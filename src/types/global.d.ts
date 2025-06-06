declare global {
  /**
   * 响应数据
   */
  interface ResponseData<T = any> {
    code: string;
    data: T;
    msg: string;
  }

  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    list: T;
    /** 总数 */
    total: number;
  }

  /**
   * 页签对象
   */
  interface TagView {
    /** 页签名称 */
    name: string;
    /** 页签标题 */
    title: string;
    /** 页签路由路径 */
    path: string;
    /** 页签路由完整路径 */
    fullPath: string;
    /** 页签图标 */
    icon?: string;
    /** 是否固定页签 */
    affix?: boolean;
    /** 是否开启缓存 */
    keepAlive?: boolean;
    /** 路由查询参数 */
    query?: any;
  }

  /**
   * 系统设置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string;
    /** 系统版本 */
    version: string;
    /** 是否显示设置 */
    showSettings: boolean;
    /** 是否显示多标签导航 */
    tagsView: boolean;
    /** 是否显示侧边栏Logo */
    sidebarLogo: boolean;
    /** 导航栏布局(left|top|mix) */
    layout: string;
    /** 主题颜色 */
    themeColor: string;
    /** 主题模式(dark|light) */
    theme: string;
    /** 布局大小(default |large |small) */
    size: string;
    /** 语言( zh-cn| en) */
    language: string;
    /** 是否开启水印 */
    watermarkEnabled: boolean;
    /** 水印内容 */
    watermarkContent: string;
  }

  /**
   * 下拉选项数据类型
   */
  interface OptionType {
    /** 值 */
    value: string | number;
    /** 文本 */
    label: string;
    /** 子列表  */
    children?: OptionType[];
  }

  /**
   * 导入结果
   */
  interface ExcelResult {
    /** 状态码 */
    code: string;
    /** 无效数据条数 */
    invalidCount: number;
    /** 有效数据条数 */
    validCount: number;
    /** 错误信息 */
    messageList: Array<string>;
  }


  declare type T = any;
  declare type Recordable<T = any> = Record<string, T>;

  interface CompContentType {
    text: any;
    key?: string;
    attr?: Recordable;
    event?: Recordable;
    eventConfigs?: any;
    ref?: Ref<T>;
  }

  declare interface CompType {
    comp: string | Component;
    data?: any;
    key?: string;
    attr?: Recordable;
    event?: Recordable;
    eventConfigs?: any;
    content?: CompContentType;
    children?: Array<CompType> | [];
    ref?: Ref<T>;
    [key: string]: any;
  }
}
export { };
