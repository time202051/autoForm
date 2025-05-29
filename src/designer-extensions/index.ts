import { pluginManager } from "epic-designer";
import RemoteSelect from "./remoteSelect";
import { setupPublicMethod } from './script/index';

// 安装扩展
export function setupDesignerExtensions(): void {
  setupPublicMethod();

  // 注册组件
  pluginManager.registerComponent(RemoteSelect);

}
