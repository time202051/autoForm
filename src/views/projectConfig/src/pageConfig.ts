import type { TableType } from '@/components/BaseTable'
import type { ComponentInternalInstance } from "vue";

export interface TableScope {
  row: any; // 当前行数据
  $index: number; // 当前行索引
  column: any; // 当前列信息
}

export interface TableState {
  tableConfig: any; // 表格配置
  // eventConfigs: any; // 事件配置
  [attrName: string]: any;
}

export interface TableMethods {
  // addColumn: () => void; // 添加列方法
  // removeColumn: () => void; // 删除列方法
  // addActionButton: () => void; // 添加按钮方法
  // removeActionButton: () => void; // 删除按钮方法
  // updateTableEvent: (eventName: string) => void; // 更新表格事件方法
  // onSubmit: () => void; // 提交方法
  [attrKey: string]: any; // 其他方法
}

export interface TableParams {
  scope: TableScope; // 原始 scope 对象
  row: any; // 当前行数据
  index: number; // 当前行索引
  column: any; // 当前列信息
  state: TableState; // 页面状态
  methods: TableMethods; // 页面方法
}




export interface IEventParams {
  args: any;// 原始参数对象
  state: {
    tableConfig: any
  },
  methods: any// 页面方法
  ctx: ComponentInternalInstance// 当前组件实例
}


// 定义属性配置类型
export interface TableAttrConfig {
  label: string;  // 显示的标签名
  prop: string;   // 属性名
  type: 'string' | 'number' | 'boolean' | 'enum' | 'function' | 'object';  // 属性类型
  default?: any;  // 默认值
  options?: { label: string; value: any }[];  // 枚举选项
  description?: string;  // 属性描述
}

export const tableAttrs: TableAttrConfig[] = [
  {
    label: '表格高度',
    prop: 'height',
    type: 'string',
    description: 'table 的高度。 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。'
  },
  {
    label: '最大高度',
    prop: 'maxHeight',
    type: 'string',
    description: 'table 的最大高度。 合法的值为数字或者单位为 px 的高度。'
  },
  {
    label: '斑马纹',
    prop: 'stripe',
    type: 'boolean',
    default: false,
    description: '是否为斑马纹 table'
  },
  {
    label: '边框',
    prop: 'border',
    type: 'boolean',
    default: false,
    description: '是否带有纵向边框'
  },
  {
    label: '尺寸',
    prop: 'size',
    type: 'enum',
    options: [
      { label: '大', value: 'large' },
      { label: '默认', value: 'default' },
      { label: '小', value: 'small' }
    ],
    description: 'Table 的尺寸'
  },
  {
    label: '自适应',
    prop: 'fit',
    type: 'boolean',
    default: true,
    description: '列的宽度是否自撑开'
  },
  {
    label: '显示表头',
    prop: 'showHeader',
    type: 'boolean',
    default: true,
    description: '是否显示表头'
  },
  {
    label: '高亮当前行',
    prop: 'highlightCurrentRow',
    type: 'boolean',
    default: false,
    description: '是否要高亮当前行'
  },
  {
    label: '当前行的key',
    prop: 'currentRowKey',
    type: 'string',
    description: '当前行的 key，只写属性'
  },
  {
    label: '行类名',
    prop: 'rowClassName',
    type: 'function',
    description: '行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className'
  },
  {
    label: '行样式',
    prop: 'rowStyle',
    type: 'function',
    description: '行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style'
  },
  {
    label: '单元格类名',
    prop: 'cellClassName',
    type: 'function',
    description: '单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className'
  },
  {
    label: '单元格样式',
    prop: 'cellStyle',
    type: 'function',
    description: '单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style'
  },
  {
    label: '表头行类名',
    prop: 'headerRowClassName',
    type: 'function',
    description: '表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className'
  },
  {
    label: '表头行样式',
    prop: 'headerRowStyle',
    type: 'function',
    description: '表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style'
  },
  {
    label: '表头单元格类名',
    prop: 'headerCellClassName',
    type: 'function',
    description: '表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className'
  },
  {
    label: '表头单元格样式',
    prop: 'headerCellStyle',
    type: 'function',
    description: '表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style'
  },
  {
    label: '行数据的Key',
    prop: 'rowKey',
    type: 'string',
    description: '行数据的 Key，用来优化 Table 的渲染'
  },
  {
    label: '空数据文本',
    prop: 'emptyText',
    type: 'string',
    default: 'No Data',
    description: '空数据时显示的文本内容'
  },
  {
    label: '默认展开所有行',
    prop: 'defaultExpandAll',
    type: 'boolean',
    default: false,
    description: '是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效'
  },
  {
    label: '默认排序',
    prop: 'defaultSort',
    type: 'object',
    description: '默认的排序列的 prop 和顺序。它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序'
  },
  {
    label: '提示效果',
    prop: 'tooltipEffect',
    type: 'enum',
    options: [
      { label: '深色', value: 'dark' },
      { label: '浅色', value: 'light' }
    ],
    description: '溢出的 tooltip 的 effect'
  },
  {
    label: '提示选项',
    prop: 'tooltipOptions',
    type: 'object',
    description: '溢出 tooltip 的选项'
  },
  {
    label: '挂载节点',
    prop: 'appendFilterPanelTo',
    type: 'string',
    description: '挂载到哪个 DOM 元素'
  },
  {
    label: '显示合计行',
    prop: 'showSummary',
    type: 'boolean',
    default: false,
    description: '是否在表尾显示合计行'
  },
  {
    label: '合计行文本',
    prop: 'sumText',
    type: 'string',
    default: 'Sum',
    description: '显示摘要行第一列的文本'
  },
  {
    label: '合计计算方法',
    prop: 'summaryMethod',
    type: 'function',
    description: '自定义的合计计算方法'
  },
  {
    label: '合并计算方法',
    prop: 'spanMethod',
    type: 'function',
    description: '合并行或列的计算方法'
  },
  {
    label: '选择时的行为',
    prop: 'selectOnIndeterminate',
    type: 'boolean',
    default: true,
    description: '在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行'
  },
  {
    label: '树节点缩进',
    prop: 'indent',
    type: 'number',
    default: 16,
    description: '展示树形数据时，树节点的缩进'
  },
  {
    label: '懒加载',
    prop: 'lazy',
    type: 'boolean',
    default: false,
    description: '是否懒加载子节点数据'
  },
  {
    label: '加载函数',
    prop: 'load',
    type: 'function',
    description: '加载子节点数据的函数，lazy 为 true 时生效'
  },
  {
    label: '树形配置',
    prop: 'treeProps',
    type: 'object',
    description: '渲染嵌套数据的配置选项'
  },
  {
    label: '表格布局',
    prop: 'tableLayout',
    type: 'enum',
    options: [
      { label: '固定', value: 'fixed' },
      { label: '自动', value: 'auto' }
    ],
    description: '设置表格单元、行和列的布局方式'
  },
  {
    label: '显示滚动条',
    prop: 'scrollbarAlwaysOn',
    type: 'boolean',
    default: false,
    description: '总是显示滚动条'
  },
  {
    label: '显示提示',
    prop: 'showOverflowTooltip',
    type: 'boolean',
    default: false,
    description: '是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它们'
  },
  {
    label: '弹性布局',
    prop: 'flexible',
    type: 'boolean',
    default: false,
    description: '确保主轴的最小尺寸，以便不超过内容'
  },
  {
    label: '滚动条tabindex',
    prop: 'scrollbarTabindex',
    type: 'string',
    description: 'body 的滚动条的包裹容器 tabindex'
  },
  {
    label: '拖动最后一列',
    prop: 'allowDragLastColumn',
    type: 'boolean',
    default: true,
    description: '是否允许拖动最后一列'
  },
  {
    label: '提示格式化',
    prop: 'tooltipFormatter',
    type: 'function',
    description: '自定义 show-overflow-tooltip 时的 tooltip 内容'
  },
  {
    label: '保留展开内容',
    prop: 'preserveExpandedContent',
    type: 'boolean',
    default: false,
    description: '在折叠后是否在DOM中保留展开行内容'
  }
];
