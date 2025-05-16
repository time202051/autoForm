export const setEventConsole = (eventName: any, type: number = 0) => {
  if (type === 1) {
    console.log(
      `%c[事件触发]${eventName}%c`,
      'color: white; background: green; padding: 2px 4px; border-radius: 3px;',
      'color: inherit;'
    );
  } else {
    console.log(
      `%c[事件注册]${eventName}%c`,
      'color: white; background: green; padding: 2px 4px; border-radius: 3px;',
      'color: inherit;'
    );
  }
}

