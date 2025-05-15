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
  methods?: TableMethods; // 页面方法
}




export interface IEventParams {
  args: any;// 原始参数对象
  state: {
    tableConfig: any
  },
  methods?: any// 页面方法
  ctx?: ComponentInternalInstance// 当前组件实例
}


// 定义属性配置类型
export interface TableAttrConfig {
  label: string;  // 显示的标签名
  prop: string;   // 属性名
  type: 'string' | 'number' | 'boolean' | 'enum' | 'function' | 'object' | any;  // 属性类型
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


// table表格的默认配置
export const defaultTableAttr = {
  border: false, // 是否带有纵向边框，默认为 false
  stripe: false, // 是否为斑马纹 table，默认为 false
  height: "100%", // table 的高度，默认为 undefined（自动高度）
  fit: true, // 列的宽度是否自撑开，默认为 true
  showHeader: true, // 是否显示表头，默认为 true
  highlightCurrentRow: false, // 是否要高亮当前行，默认为 false
  emptyText: "暂无数据", // 空数据时显示的文本内容，默认为 'No Data'
  tooltipEffect: "dark", // 溢出的 tooltip 的 effect，默认为 'dark'
  showSummary: false, // 是否在表尾显示合计行，默认为 false
  sumText: "Sum", // 显示摘要行第一列的文本，默认为 'Sum'
  selectOnIndeterminate: true, // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为，默认为 true
  indent: 16, // 展示树形数据时，树节点的缩进，默认为 16
  lazy: false, // 是否懒加载子节点数据，默认为 false
  tableLayout: "fixed", // 设置表格单元、行和列的布局方式，默认为 'fixed'
  scrollbarAlwaysOn: false, // 总是显示滚动条，默认为 false
  flexible: false, // 确保主轴的最小尺寸，以便不超过内容，默认为 false
  allowDragLastColumn: true, // 是否允许拖动最后一列，默认为 true
  preserveExpandedContent: false, // 在折叠后是否在 DOM 中保留展开行内容，默认为 false
}


export const tableColumnAttrs: TableAttrConfig[] = [
  {
    prop: 'type',
    label: '列类型',
    type: 'enum',
    options: [
      { label: '默认', value: 'default' },
      { label: '多选框', value: 'selection' },
      { label: '索引', value: 'index' },
      { label: '展开按钮', value: 'expand' },
    ],
    default: 'default',
    description: '对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引；如果设置了 expand 则显示为一个可展开的按钮。',
  },
  {
    prop: 'label',
    label: '标题',
    type: 'string',
    default: '',
    description: '显示的标题。',
  },
  {
    prop: 'prop',
    label: '字段名',
    type: 'string',
    default: '',
    description: '字段名称，对应列内容的字段名。',
  },
  {
    prop: 'width',
    label: '宽度',
    type: 'string',
    default: '',
    description: '对应列的宽度。',
  },
  {
    prop: 'minWidth',
    label: '最小宽度',
    type: 'string',
    default: '',
    description: '对应列的最小宽度。',
  },
  {
    prop: 'fixed',
    label: '固定列',
    type: 'enum',
    options: [
      { label: '不固定', value: false },
      { label: '左固定', value: 'left' },
      { label: '右固定', value: 'right' },
    ],
    default: false,
    description: '列是否固定在左侧或者右侧。true 表示固定在左侧。',
  },
  {
    prop: 'sortable',
    label: '是否可排序',
    type: 'boolean',
    default: false,
    description: '对应列是否可以排序。如果设置为 "custom"，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件。',
  },
  {
    prop: 'resizable',
    label: '是否可调整宽度',
    type: 'boolean',
    default: true,
    description: '对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）。',
  },
  {
    prop: 'align',
    label: '对齐方式',
    type: 'enum',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
    default: 'left',
    description: '对齐方式。',
  },
  {
    prop: 'headerAlign',
    label: '表头对齐方式',
    type: 'enum',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
    default: 'left',
    description: '表头对齐方式，若不设置该项，则使用表格的对齐方式。',
  },
  {
    prop: 'showOverflowTooltip',
    label: '内容过长显示 Tooltip',
    type: 'boolean',
    default: false,
    description: '当内容过长被隐藏时显示 tooltip。',
  },
  {
    prop: 'renderHeader',
    label: '自定义表头渲染',
    type: 'function',
    description: '列标题 Label 区域渲染使用的 Function。',
  },
  {
    prop: 'sortMethod',
    label: '自定义排序方法',
    type: 'function',
    description: '指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 的时候有效。应该如同 Array.sort 那样返回一个 Number。',
  },
  {
    prop: 'sortBy',
    label: '排序字段',
    type: 'function',
    description: '指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推。',
  },
  {
    prop: 'sortOrders',
    label: '排序策略',
    type: 'object',
    description: '数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效。需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序。',
  },
  {
    prop: 'formatter',
    label: '格式化内容',
    type: 'function',
    description: '用来格式化内容。',
  },
  {
    prop: 'className',
    label: '列类名',
    type: 'string',
    description: '列的 className。',
  },
  {
    prop: 'labelClassName',
    label: '表头类名',
    type: 'string',
    description: '当前列标题的自定义类名。',
  },
  {
    prop: 'selectable',
    label: '是否可选',
    type: 'function',
    description: '仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选。',
  },
  {
    prop: 'reserveSelection',
    label: '保留选项',
    type: 'boolean',
    default: false,
    description: '数据刷新后是否保留选项，仅对 type=selection 的列有效，请注意，需指定 row-key 来让这个功能生效。',
  },
  {
    prop: 'filters',
    label: '过滤选项',
    type: 'array',
    description: '数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。',
  },
  {
    prop: 'filterPlacement',
    label: '过滤弹出框定位',
    type: 'enum',
    options: [
      { label: '顶部', value: 'top' },
      { label: '底部', value: 'bottom' },
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
    ],
    description: '过滤弹出框的定位。',
  },
  {
    prop: 'filterClassName',
    label: '过滤弹出框类名',
    type: 'string',
    description: '过滤弹出框的 className。',
  },
  {
    prop: 'filterMultiple',
    label: '过滤是否多选',
    type: 'boolean',
    default: true,
    description: '数据过滤的选项是否多选。',
  },
  {
    prop: 'filterMethod',
    label: '过滤方法',
    type: 'function',
    description: '数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。',
  },
  {
    prop: 'filteredValue',
    label: '已选过滤项',
    type: 'object',
    description: '选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。',
  },
  {
    prop: 'tooltipFormatter',
    label: '提示格式化',
    type: 'function',
    description: '使用 show-overflow-tooltip 时自定义 tooltip 内容。',
  },
];

export const defaultColumnAttr = {
  prop: '', // 字段名，默认为空
  label: '', // 列标题，默认为空
  type: 'default', // 列类型，默认为 'default'
  // width: '', // 列宽度，默认为空
  // minWidth: '', // 最小宽度，默认为空
  fixed: false, // 是否固定列，默认为 false
  sortable: false, // 是否可排序，默认为 false
  resizable: true, // 是否可调整宽度，默认为 true
  align: 'left', // 对齐方式，默认为 'left'
  headerAlign: 'left', // 表头对齐方式，默认为 'left'
  showOverflowTooltip: false, // 是否显示 Tooltip，默认为 false
  // className: '', // 列类名，默认为空
  // labelClassName: '', // 表头类名，默认为空
  reserveSelection: false, // 是否保留选项，默认为 false
  filterPlacement: 'bottom', // 过滤弹出框定位，默认为 'bottom'
  // filterClassName: '', // 过滤弹出框类名，默认为空
  filterMultiple: true, // 过滤是否多选，默认为 true

  // sortOrders: ['ascending', 'descending', null], // 排序策略，默认为 ['ascending', 'descending', null]
  // filters: [], // 过滤选项，默认为空数组
  // renderHeader: undefined, // 自定义表头渲染函数，默认为 undefined
  // sortMethod: undefined, // 自定义排序方法，默认为 undefined
  // sortBy: undefined, // 排序字段，默认为 undefined
  // formatter: undefined, // 格式化内容函数，默认为 undefined
  // selectable: undefined, // 是否可选函数，默认为 undefined
  // filterMethod: undefined, // 过滤方法，默认为 undefined
  // filteredValue: undefined, // 已选过滤项，默认为 undefined
  // tooltipFormatter: undefined, // 提示格式化函数，默认为 undefined
};
