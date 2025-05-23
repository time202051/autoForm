import { ComponentInternalInstance } from 'vue';
import { eventHandler } from "@/utils/eventHandler";

export const useEventHandler = (tableOption?: any, instance?: ComponentInternalInstance) => {
  const baseTableInstance = inject("baseTable") as ComponentInternalInstance;
  instance = instance || baseTableInstance;
  const bindEvents = computed(() => {
    if (!tableOption.event) return {};
    const events: any = {};
    Object.entries(tableOption.event).forEach(([key, fn]: any) => {
      events[key] = (...args: any) => {
        try {
          return fn({
            args,
            instance,
          });
        } catch (error: any) {
          console.error(`事件 ${key} 执行出错:`, error);
          ElMessage.error(`事件执行出错: ${error?.message}`);
        }
      };
    });
    return events;
  });


  const bindEventsHandler = (scope: any, config: any) => {
    if (!config.event) return {};
    const events: any = {};
    Object.entries(config.event).forEach(([key, fn]: any) => {
      events[key] = ($event: any, ...args: any) => {
        try {
          // 防止冒泡
          $event.stopPropagation();
          if (!args) args = [$event];
          return fn({
            args,
            scope,
            instance,
          });
        } catch (error: any) {
          console.error(`事件 ${key} 执行出错:`, error);
          ElMessage.error(`事件执行出错: ${error?.message}`);
        }
      };
    });
    return events;
  };

  //常规的set设置
  const setEvent = (event: Record<string, any>, eventConfigs: Record<string, any>) => {
    Object.keys(event).forEach(key => {
      delete event[key];
    });
    Object.keys(eventConfigs).forEach((eventName) => {
      globalThis.setEventConsole(eventName)
      event[eventName] = ({ args, instance }: any) => {
        return eventHandler({
          eventName,
          eventConfigs,
          args, // 传递事件参数
          instance,
        })
      }
    });
  }


  // 含有Scope的set设置
  const setScopeEvent = (event: Record<string, any>, eventConfigs: Record<string, any>) => {
    Object.keys(event).forEach(key => {
      delete event[key];
    });
    Object.keys(eventConfigs).forEach((eventName) => {
      globalThis.setEventConsole(eventName)
      event[eventName] = ({ args, scope }: any) => {
        return eventHandler({
          args, // 传递事件参数
          eventName,
          eventConfigs,
          instance,
          scope
        })
      }
    })
  }


  //表格上面的操作按钮事件.  特殊:selectionRows勾选中的数据 tableRef:table实例
  // instance中有tableRef
  const bindActionBarEvents = (tableRef: any, config: any) => {
    if (!config.event) return {};
    const events: any = {};
    Object.entries(config.event).forEach(([key, fn]: any) => {
      events[key] = ($event: any, ...args: any) => {
        try {
          // 防止冒泡
          $event.stopPropagation();
          if (!args) args = [$event];
          return fn({
            args,
            tableRef: tableRef?.tableRef,
            selectionRows: tableRef?.tableRef.store.getSelectionRows(),
            instance,
          });
        } catch (error: any) {
          console.error(`事件 ${key} 执行出错:`, error);
          ElMessage.error(`事件执行出错: ${error?.message}`);
        }
      };
    });
    return events;
  };

  //按钮只有点击事件
  const setActionBarClick = (event: Record<string, any>, eventConfigs: Record<string, any>) => {
    Object.keys(event).forEach(key => {
      delete event[key];
    });

    Object.keys(eventConfigs).forEach((eventName) => {
      globalThis.setEventConsole(eventName)
      event[eventName] = ({ args, instance, tableRef, selectionRows }: any) => {
        return eventHandler({
          args, // 传递事件参数
          eventName,
          eventConfigs,
          instance,
          tableRef,
          selectionRows
        })
      }
    })
  }

  return {
    bindEvents,
    bindEventsHandler,
    setEvent,
    setScopeEvent,
    bindActionBarEvents,
    setActionBarClick,
  }
}
