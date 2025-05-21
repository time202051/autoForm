import type { Ref } from "vue";
import { SearchTypeEnum } from '@/views/projectConfig/src/index'

interface ISearchConfigBase {
  id?: string; // 唯一标识
  prop: string; // 对应列的字段名
  label: string; // label文本
  value: any; // 搜索框双向绑定的值
  // 开始时间

  type: string; // input, local-select, remote-select, date
  [attrName: string]: any;
}

interface LocalSelectConfig extends ISearchConfigBase {
  type: SearchTypeEnum.LOCALSELECT; //local-select
  options: { label: string; value: string;[key: string]: any }[];
  [attrName: string]: any;
}

export interface RemoteSelectConfig extends ISearchConfigBase {
  type: SearchTypeEnum.REMOTESELECT, //"remote-select";
  apiUrl: string;
  queryParams?: Record<string, any>;
  options?: { label?: string; value?: string;[key: string]: any }[];
  labelField?: string;
  valueField?: string;
  [attrName: string]: any;
}

interface InputConfig extends ISearchConfigBase {
  type: SearchTypeEnum.INPUT;
  placeholder?: string;
  [attrName: string]: any;
}

interface DateConfig extends ISearchConfigBase {
  type: SearchTypeEnum.DATE;
  placeholder?: string;

  // 时间范围专用startDate，endDate。替代双向绑定的value
  startDate?: string;
  endDate?: string;
  [attrName: string]: any;
}

export type ISearchConfig = LocalSelectConfig | RemoteSelectConfig | InputConfig | DateConfig;


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
  searchConfigs?: any; //ISearchConfig[]
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
