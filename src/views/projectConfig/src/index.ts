// 搜索框类型(目前搜索框中只支持这几种,后期可扩展)
export enum SearchTypeEnum {
  INPUT = 'input',
  LOCALSELECT = 'local-select',
  REMOTESELECT = 'remote-select',
  DATE = 'date'
}

export type ISearchType = SearchTypeEnum.INPUT | SearchTypeEnum.LOCALSELECT | SearchTypeEnum.REMOTESELECT | SearchTypeEnum.DATE;

// type属性配置类型
export type IAttrConfigType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'function' | 'object' | 'editor' | any;
export enum AttrConfigTypeEnum {
  STRING = 'string', //字符串
  NUMBER = 'number', //数字
  BOOLEAN = 'boolean', //布尔
  ENUM = 'enum', //下拉框选项
  ARRAY = 'array', //数组
  FUNCTION = 'function', //函数
  OBJECT = 'object', //对象
  EDITOR = 'editor', //编辑器
  ANY = 'any', //任意
}


//prop内置字段以lc开头,外部禁止修改
export enum LcSearchPropNnum {
  lCTYPE = 'lcType', // 组件类型
  lCDICT = 'lcDict', // 字典配置
  LCOPTIONS = 'lcOptions', // 静态下拉框选项
  LCREMOTEURL = 'lcRemoteUrl', // 远程下拉框请求地址
  LCMETHOD = 'lcMethod', //远程下拉框接口类型
  LCREMOTEPARAMS = 'lcRemoteParams' //远程下拉框请求参数
}

// 配置文件的属性配置项
export interface IAttrConfig {
  label: string;  // 显示的标签名
  prop: string;   // 属性名 如果是editor会注册到eventConfig,customEventConfigs中
  type: 'string' | 'number' | 'boolean' | 'enum' | 'function' | 'object' | any;  // 属性类型
  default?: any;  // 默认值
  options?: { label: string; value: any }[];  // 枚举选项
  description?: string;  // 属性描述
  attr?: any;
  show?: boolean | ((...args: any[]) => boolean); // 是否显示该属性
  //children是为了动态显示内容
  children?: IAttrConfig[] | Record<string, IAttrConfig[]>; // 子属性，支持数组或对象形式
  // [key: string]: any;
}


// 使用参考案例
// {
//   prop: "autoSearchWidth",
//   label: "宽度自适应",
//   type: "boolean",
//   description: "搜索框宽度占满",
//   // children: [
//   //   {
//   //     prop: "searchWidth",
//   //     label: "搜索框宽度1111",
//   //     type: "number",
//   //     description: "搜索框的宽度",
//   //     attr: {
//   //       min: 200,
//   //     },
//   //     show: (modelValue: any) => !modelValue.autoSearchWidth,
//   //   }
//   // ],
//   children: {
//     true: [
//       {
//         prop: "searchWidth",
//         label: "搜索框宽度1111",
//         type: "number",
//         description: "搜索框的宽度",
//         attr: {
//           min: 200,
//         },
//       },
//       {
//         prop: "searchWidth",
//         label: "搜索框宽度33333333",
//         type: "number",
//         description: "搜索框的宽度",
//         attr: {
//           min: 200,
//         },
//       }
//     ],
//     false: [
//       {
//         prop: "searchWidth",
//         label: "搜索框宽度222",
//         type: "number",
//         description: "搜索框的宽度",
//         attr: {
//           min: 200,
//         },
//       }
//     ]
//   }
// },
