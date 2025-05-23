declare global {
  interface Window {
    setEventConsole: (eventName: string) => void;
  }
}
