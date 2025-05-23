// src/utils/eventHandler.ts
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus';
import dayjs from 'dayjs'; // 日期处理库
import { cloneDeep, debounce, throttle } from 'lodash-es'; // 常用工具函数
import request from '@/utils/request'; // 自定义请求工具
import { usePermissionStore, useUserStore, useAppStore, useSettingsStore, useTagsViewStore, useDictStore, useProjectStore } from '@/store';
import type { Router, RouteLocationNormalized } from 'vue-router';
import { v4 as uuidv4 } from 'uuid'; // 生成唯一标识符
import type {
  IEventParams,
} from "@/views/projectConfig/src/pageConfig.ts";


const utils: any = {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElLoading,

  route: null,
  router: null,

  dayjs,

  cloneDeep,
  debounce,
  throttle,
  request,

  uuid: uuidv4,

  // 延迟加载
  get stores() {
    return {
      PermissionStore: usePermissionStore(),
      UserStore: useUserStore(),
      AppStore: useAppStore(),
      SettingsStore: useSettingsStore(),
      TagsViewStore: useTagsViewStore(),
      DictStore: useDictStore(),
      ProjectStore: useProjectStore()
    }
  },

  isObject: (value: any) => typeof value === 'object' && value !== null, // 判断是否为对象
  isArray: (value: any) => Array.isArray(value), // 判断是否为数组
  isEmpty: (value: any) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },
};


interface IEventHandler {
  eventName: string; // 事件名称
  eventConfigs: Record<string, string>; // 事件配置对象
  args?: any; // 事件参数
  tableInstance?: any; // 组件实例
  tableRef?: any; // 表格引用
  baseTableProvide?: any; // 表格注入对象
  [attrName: string]: any;
}

/**
 * 处理事件执行逻辑
 * @param options 事件处理选项
 * @returns 事件执行结果
 */
export const eventHandler = (options: IEventHandler) => {
  const { eventName, eventConfigs, args, instance, scope } = options;
  console.log(
    `%c[事件触发]${eventName}%c`,
    'color: white; background: green; padding: 2px 4px; border-radius: 3px;',
    'color: inherit;'
  );
  try {
    const context: IEventParams = {
      args, // 将事件参数添加到上下文中
      instance,
      tableConfig: instance?.proxy?.tableConfig || {},
    };
    if (scope) Object.assign(context, { scope });

    Object.setPrototypeOf(context, utils);
    return new Function('context', 'args', `
      with(context) {
        ${eventConfigs[eventName]}
      }
    `)(context, args);
  } catch (error: any) {
    console.error(`事件 ${eventName} 执行出错:`, error);
    ElMessage.error(`事件执行出错: ${error?.message}`);
  }
};

// 挂在router，和route
export const setRouterAndRouteForEvent = (router: Router, route: RouteLocationNormalized) => {
  utils.router = router;
  utils.route = route;
};






