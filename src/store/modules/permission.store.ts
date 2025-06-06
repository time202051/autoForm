import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import router from "@/router";
import { useProjectCache } from '@/hooks'

import MenuAPI, { type RouteVO } from "@/api/system/menu.api";
const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

export const usePermissionStore = defineStore(
  "permission",
  () => {
    // 储所有路由，包括静态路由和动态路由
    const routes = ref<RouteRecordRaw[]>([]);
    // 混合模式左侧菜单路由
    const mixedLayoutLeftRoutes = ref<RouteRecordRaw[]>([]);
    // 路由是否加载完成
    const isRoutesLoaded = ref(false);
    const dynamicMenus = ref<RouteRecordRaw[]>([]);
    const projectCache = useProjectCache()
    function saveDynamicMenus(menus: any[]) {
      dynamicMenus.value = menus;
    }
    /**
     * 获取后台动态路由数据，解析并注册到全局路由
     *
     * @returns Promise<RouteRecordRaw[]> 解析后的动态路由列表
     */
    function generateRoutes() {
      return new Promise<RouteRecordRaw[]>((resolve, reject) => {
        MenuAPI.getRoutes()
          .then((data) => {
            const dynamicRoutesTemp = parseDynamicRoutes(data);
            routes.value = [...constantRoutes, ...dynamicRoutesTemp];
            isRoutesLoaded.value = true;
            resolve(dynamicRoutesTemp);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    function generateRoutesData(dynamicRoutes: any) {
      return new Promise<RouteRecordRaw[]>((resolve, reject) => {
        routes.value = [...constantRoutes, ...dynamicRoutes];
        isRoutesLoaded.value = true;
        resolve(dynamicRoutes);
      });
    }

    /**
     * 根据父菜单路径设置混合模式左侧菜单
     *
     * @param parentPath 父菜单的路径，用于查找对应的菜单项
     */
    const setMixedLayoutLeftRoutes = (parentPath: string) => {
      const matchedItem = routes.value.find((item) => item.path === parentPath);
      if (matchedItem && matchedItem.children) {
        mixedLayoutLeftRoutes.value = matchedItem.children;
      }
    };

    /**
     * 重置路由
     */
    const resetRouter = () => {
      //  从 router 实例中移除动态路由
      routes.value.forEach((route) => {
        if (route.name && !constantRoutes.find((r) => r.name === route.name)) {
          router.removeRoute(route.name);
        }
      });

      // 清空本地存储的路由和菜单数据
      routes.value = [];
      mixedLayoutLeftRoutes.value = [];
      isRoutesLoaded.value = false;
    };
    // 递归生成路由
    const generateRoutesLowCode = (menus: any[]): any[] => {
      return menus.map((menu) => {
        const { isSon, pathField: path } = menu;
        const component = menu?.componentField?.toString();
        let route: any = {
          ...menu,
          path: isSon ? path : `/${path}`,
          name: isSon ? path : `/${path}`,
          meta: menu.meta,
          isSon,
        };

        // 只有一级菜单
        if (!isSon && menu.children && menu.children.length === 0) {
          route = {
            path: `/${path}`,
            name: `/${path}`,
            component: Layout, // 只有一级菜单使用 Layout
            ...menu,
            children: [
              {
                path: "index",
                name: `${path}/index`,
                meta: menu.meta,
                component: modules[`../../views/projectConfig/index.vue`], // 子路由使用 projectConfig/index
              },
            ],
          };
        } else {
          // 处理 component
          route.component =
            component === "Layout"
              ? Layout
              : modules[`../../views/${component}.vue`] ||
              modules["../../views/error-page/404.vue"];

          // 处理 children
          if (menu.children && menu.children.length > 0) {
            route.children = generateRoutesLowCode(menu.children); // 递归生成子路由
          } else {
            route.children = []; //必须有，左侧菜单需要
          }
        }

        return route;
      });
    };


    // 设置化菜单（无参数缓存中获取）
    const initMenu = async (menus?: any) => {
      if (!menus) {
        const cacheMenu = await projectCache.getMenuTree();
        console.log('缓存的菜单', cacheMenu);
        menus = cacheMenu
      }
      // 获取菜单数据
      const routerTemp = generateRoutesLowCode(menus);
      resetRouter();
      const dynamicRoutes = await generateRoutesData(routerTemp);
      console.log("promission=》initMenu", routerTemp, dynamicRoutes);
      dynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
      saveDynamicMenus(menus);
    }

    return {
      routes,
      mixedLayoutLeftRoutes,
      isRoutesLoaded,
      dynamicMenus,
      generateRoutes,
      generateRoutesData,
      setMixedLayoutLeftRoutes,
      resetRouter,
      generateRoutesLowCode,
      saveDynamicMenus,
      initMenu
    };
  },
  {
    persist: true, // 启用持久化
  }
);

/**
 * 解析后端返回的路由数据并转换为 Vue Router 兼容的路由配置
 *
 * @param rawRoutes 后端返回的原始路由数据
 * @returns 解析后的路由配置数组
 */
const parseDynamicRoutes = (rawRoutes: RouteVO[]): RouteRecordRaw[] => {
  const parsedRoutes: RouteRecordRaw[] = [];

  rawRoutes.forEach((route) => {
    const normalizedRoute = { ...route } as RouteRecordRaw;
    // 处理组件路径
    normalizedRoute.component =
      normalizedRoute.component?.toString() === "Layout"
        ? Layout
        : modules[`../../views/${normalizedRoute.component}.vue`] ||
        modules["../../views/error-page/404.vue"];

    // 递归解析子路由
    if (normalizedRoute.children) {
      normalizedRoute.children = parseDynamicRoutes(route.children);
    }

    parsedRoutes.push(normalizedRoute);
  });

  return parsedRoutes;
};

/**
 * 在组件外使用 Pinia store 实例 @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
