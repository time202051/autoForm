import type { Ref } from "vue";

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
  [key: string]: any;
}

// 表格  列配置
interface TableColumnType {
  headerSlotName?: string;
  headerSlotConfig?: CompType;
  defaultSlotName?: string;
  defaultSlotConfig?: CompType | Array<CompType> | any;
  attr?: Recordable | any;
  [key: string]: any;
}
