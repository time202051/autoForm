import { ComponentInternalInstance } from 'vue';
import { eventHandler } from "@/utils/eventHandler";

export const useEventHandler = (props?: any, instance?: ComponentInternalInstance) => {
  const baseTableInstance = inject("baseTable") as ComponentInternalInstance;
  instance = instance || baseTableInstance;
  const bindEvents = computed(() => {
    if (!props.tableOption.event) return {};
    const events: any = {};
    Object.entries(props.tableOption.event).forEach(([key, fn]: any) => {
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
      event[eventName] = ({ args, scope, instance }: any) => {
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

  return {
    bindEvents,
    bindEventsHandler,
    setEvent,
    setScopeEvent
  }
}
