
import { IAttrConfig, SearchTypeEnum, AttrConfigTypeEnum, IAttrConfigType, LcSearchPropNnum } from '@/views/projectConfig/src/index'

export interface IComItem {
  attr: Recordable,
  event?: Recordable, //搜索框组件事件
  eventConfigs?: Recordable, //存储事件
  customEvent?: Recordable, //自定义事件, 页面中特定的函数
  customEventConfigs?: Recordable, //存储自定义事件
}

export interface IActionBarConfig {
  attr?: Recordable,
  columnArr: IComItem[],
  data?: Recordable, //双向绑定的值
  event?: Recordable, //搜索框组件事件
  eventConfigs?: Recordable, //存储事件
}

export const defaultActionBarAttrs = {}
export const actionBarColumnAttrs: IAttrConfig[] = [
  {
    prop: "label",
    label: "文本",
    type: AttrConfigTypeEnum.STRING,
    description: "按钮文本字段",
  },
  {
    prop: "type",
    label: "type",
    type: AttrConfigTypeEnum.ENUM,
    description: "按钮类型，在设置color时，后者优先。",
    options: [
      { label: '默认', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '信息', value: 'info' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
    ]
  },
  {
    prop: "plain",
    label: "朴素",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否为朴素按钮",
  },
  {
    prop: "text",
    label: "文字按钮",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否为文字按钮",
  },
  {
    prop: "link",
    label: "朴素",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否为链接按钮",
  },
  {
    prop: "round",
    label: "圆角",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "否为圆角按钮",
  },
  {
    prop: "circle",
    label: "圆形",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否为圆形按钮",
  },
  {
    prop: "color",
    label: "自定义颜色",
    type: AttrConfigTypeEnum.STRING,
    description: "自定义按钮颜色, 并自动计算 hover 和 active 触发后的颜色",
  },
  {
    prop: "click",
    label: "点击逻辑",
    type: AttrConfigTypeEnum.EDITOR,
    description: "点击事件逻辑",
  },
]


