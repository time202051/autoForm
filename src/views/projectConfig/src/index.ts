// 搜索框类型(目前搜索框中只支持这几种,后期可扩展)
export enum SearchTypeEnum {
  INPUT = 'input',
  LOCALSELECT = 'local-select',
  REMOTESELECT = 'remote-select',
  DATE = 'date'
}

export type ISearchType = SearchTypeEnum.INPUT | SearchTypeEnum.LOCALSELECT | SearchTypeEnum.REMOTESELECT | SearchTypeEnum.DATE;


// 配置文件的属性配置项
export interface IAttrConfig {
  label: string;  // 显示的标签名
  prop: string;   // 属性名
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
