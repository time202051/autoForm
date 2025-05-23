import type { Ref } from "vue";

// 表格头部搜索框的单个搜索框配置
interface ISearchItem {
  attr: Recordable,
  event?: Recordable, //搜索框组件事件
  eventConfigs?: Recordable, //存储事件
  customEvent?: Recordable, //自定义事件, 页面中特定的函数
  customEventConfigs?: Recordable, //存储自定义事件
}

// 表格头部搜索框整体配置
export interface ISearchConfig {
  attr: Recordable,
  columnArr: ISearchItem[],
  data: Recordable, //双向绑定的值
  event?: Recordable, //搜索框组件事件
  eventConfigs?: Recordable, //存储事件
}

export interface TableType {
  data?: Array<any>;
  attr?: Recordable | any; //el-table的attr
  event?: Recordable; //el-table的事件，弃用，attr也可以继承事件
  ref?: Ref<T>;
  loading?: Ref<boolean>;
  columnArr?: Array<TableColumnType>; //循环的列表
  appendSlotConfig?: CompType;
  emptySlotConfig?: CompType;
  eventConfigs?: any;//存储事件
  searchConfig?: ISearchConfig; //ISearchConfig[]
  [key: string]: any;
}

// 表格  列配置
export interface TableColumnType {
  headerSlotName?: string;
  headerSlotConfig?: CompType;
  defaultSlotName?: string;
  defaultSlotConfig?: CompType | Array<CompType> | any;
  attr?: Recordable | any;
  [key: string]: any;
}
