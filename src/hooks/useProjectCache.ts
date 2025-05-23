import { watchEffect, ref, getCurrentInstance } from "vue";
import type { ComponentInternalInstance } from "vue";
import type { TableType } from "@/components/BaseTable/index";
import { useRoute } from "vue-router";
import { useProjectStore } from "@/store/modules/project.store";
import { createStore, get, set, del } from 'idb-keyval';
import { ElMessage } from 'element-plus';
import type {
  IEventParams,
} from "@/views/projectConfig/src/pageConfig.ts";
// import { eventHandler } from "@/utils/eventHandler";
import { useEventHandler } from '@/hooks'

export const hasEvents = readonly(['defaultSlotConfig', 'headerSlotConfig']);

// 基础菜单数据结构
interface IBaseMenuData {
  id: string;           // 菜单ID
  name: string;         // 菜单名称
  path: string;         // 路由路径
  icon?: string;        // 菜单图标
  parentId?: string;    // 父级菜单ID
  order?: number;       // 排序
  children?: IBaseMenuData[]; // 子菜单
}

// 完整的菜单页面数据结构（包含配置信息）
interface IMenuPageData extends IBaseMenuData {
  pageConfig?: TableType; // 页面配置数据
  // 后期可以在这里扩展其他配置属性
  // otherConfig?: xxx;
}

// 单例实例
let instance: ReturnType<typeof createProjectCache> | null = null;

// 创建 useProjectCache 的逻辑
function createProjectCache() {
  const userStore = createStore('projectCache', 'projectConfig');
  const projectStore = useProjectStore();
  const route = useRoute();
  const { setEvent, setScopeEvent } = useEventHandler()

  // // 当前页面数据
  const pageData = ref<TableType | null>(null);
  const menuPageData = ref<IMenuPageData[]>([]);
  // const getPageData = () => { };
  // 获取页面数据
  const getPageData = async (): Promise<TableType | null> => {
    const projectId = projectStore.selectedProject?.id || "";
    const pageId = (route.meta.id as string) || "";

    if (!projectId || !pageId) return null;

    const projectCache = await get<IMenuPageData[]>(projectId, userStore);
    if (!projectCache) return null;

    // 递归查找页面配置
    const findPageConfig = (menus: IMenuPageData[]): TableType | null => {
      for (const menu of menus) {
        if (menu.id === pageId) {
          return menu.pageConfig || null;
        }
        if (menu.children?.length) {
          const found = findPageConfig(menu.children);
          if (found) return found;
        }
      }
      return null;
    };

    const pageConfig = findPageConfig(projectCache);
    if (!pageConfig) return null;
    // 还原事件函数
    setEvent(pageConfig.event || {}, pageConfig.eventConfigs)


    // 这是table内部的事件，注意有scope
    if (pageConfig.columnArr && pageConfig.columnArr.length > 0) {
      pageConfig.columnArr.forEach((column) => {
        // const hasEvents = ['defaultSlotConfig', 'headerSlotConfig'];
        Object.keys(column).forEach((key) => {
          if (hasEvents.includes(key)) {
            if (Array.isArray(column[key])) {
              column[key].forEach((item, index) => {
                if (typeof item === 'object' && item.event) {
                  setScopeEvent(item.event, item.eventConfigs)
                }
              })
            } else if (typeof column[key] === 'object' && column[key].event) {
              setScopeEvent(column[key].event, column[key].eventConfigs)
            }
          }
        })
      })
    }


    // 搜索框自定义事件事件处理
    if (pageConfig.searchConfig && pageConfig.searchConfig.columnArr && pageConfig.searchConfig.columnArr.length > 0) {
      pageConfig.searchConfig.columnArr.forEach((item: any) => {
        setEvent(item.customEvent, item.customEventConfigs)
      })
    }
    return pageConfig;
  };

  // 保存页面数据
  const savePageData = async (data: TableType) => {
    const projectId = projectStore.selectedProject?.id || "";
    const pageId = (route?.meta?.id as string) || "";

    if (!projectId || !pageId) return;

    let projectCache = await get<IMenuPageData[]>(projectId, userStore) || [];

    // 递归更新页面配置
    const updatePageConfig = (menus: IMenuPageData[]): boolean => {
      for (let menu of menus) {
        if (menu.id === pageId) {
          menu.pageConfig = data;
          return true;
        }
        if (menu.children?.length) {
          if (updatePageConfig(menu.children)) {
            return true;
          }
        }
      }
      return false;
    };

    if (!updatePageConfig(projectCache)) {
      ElMessage.error("菜单不存在");
      return;
    }

    await set(projectId, JSON.parse(JSON.stringify(projectCache)), userStore);
    pageData.value = data;
    ElMessage.success("页面数据保存成功");
  };

  // 保存整个菜单树
  const saveMenuTree = async (newMenuTree: IMenuPageData[]) => {
    const projectId = projectStore.selectedProject?.id || "";
    if (!projectId) return;

    let oldProjectCache = await get<IMenuPageData[]>(projectId, userStore) || [];

    // 收集所有旧的id
    const oldIds = new Set<string>();
    const collectIds = (menus: IMenuPageData[]) => {
      menus.forEach(menu => {
        oldIds.add(menu.id);
        if (menu.children?.length) {
          collectIds(menu.children);
        }
      });
    };
    collectIds(oldProjectCache);

    // 收集并保留新菜单树中的页面配置
    const newIds = new Set<string>();
    const preservePageConfigs = (menus: IMenuPageData[]) => {
      menus.forEach(menu => {
        newIds.add(menu.id);
        // 查找旧的页面配置
        const findOldConfig = (oldMenus: IMenuPageData[]): TableType | undefined => {
          for (const oldMenu of oldMenus) {
            if (oldMenu.id === menu.id) {
              return oldMenu.pageConfig;
            }
            if (oldMenu.children?.length) {
              const found = findOldConfig(oldMenu.children);
              if (found) return found;
            }
          }
          return undefined;
        };

        // 保留原有的页面配置
        const oldConfig = findOldConfig(oldProjectCache);
        if (oldConfig) {
          menu.pageConfig = oldConfig;
        }

        if (menu.children?.length) {
          preservePageConfigs(menu.children);
        }
      });
    };
    preservePageConfigs(newMenuTree);

    // 保存新的菜单树
    await set(projectId, JSON.parse(JSON.stringify(newMenuTree)), userStore);
    menuPageData.value = newMenuTree;
    ElMessage.success("菜单保存成功");

    // 提示已删除的页面数量
    const deletedPages = [...oldIds].filter(id => !newIds.has(id));
    if (deletedPages.length > 0) {
      ElMessage.info(`已清理 ${deletedPages.length} 个不再使用的页面配置`);
    }
  };

  // 获取菜单树（只返回基础菜单数据）
  const getMenuTree = async (): Promise<IBaseMenuData[]> => {
    const projectId = projectStore.selectedProject?.id || "";
    if (!projectId) return [];

    const projectCache = await get<IMenuPageData[]>(projectId, userStore) || [];

    // 递归提取基础菜单数据
    const extractBaseMenuData = (menus: IMenuPageData[]): IBaseMenuData[] => {
      return menus.map(menu => {
        delete menu.pageConfig; // 移除页面配置数据
        const baseMenu: IBaseMenuData = {
          ...menu
        };

        if (menu.children?.length) {
          baseMenu.children = extractBaseMenuData(menu.children);
        }

        return baseMenu;
      });
    };

    const baseMenuTree = extractBaseMenuData(projectCache);
    menuPageData.value = projectCache; // 内部仍然保存完整数据
    return baseMenuTree;
  };


  // 删除整个项目
  const deleteProject = async (projectId: string) => {
    if (!projectId) return;
    await del(projectId, userStore);
    ElMessage.success("项目删除成功");
  };

  // 监听项目 ID 和页面 ID 的变化
  watchEffect(async () => {
    pageData.value = await getPageData();
    await getMenuTree();
  });

  return {
    pageData,
    menuPageData,
    savePageData,
    getPageData,
    deleteProject,
    saveMenuTree,
    getMenuTree
  };
}

// 导出一个单例的 useProjectCache
export function useProjectCache() {
  if (!instance) {
    instance = createProjectCache();
  }
  return instance;
}
