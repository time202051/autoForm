import { IAttrConfig, SearchTypeEnum, AttrConfigTypeEnum, IAttrConfigType, LcSearchPropNnum } from '@/views/projectConfig/src/index'
import { rowKey } from 'element-plus/es/components/table-v2/src/common';

export const tableAttrs: IAttrConfig[] = [
  {
    prop: "height",
    label: "表格高度",
    type: AttrConfigTypeEnum.STRING,
    description: "table 的高度。 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。",
  },
  {
    prop: "maxHeight",
    label: "最大高度",
    type: AttrConfigTypeEnum.STRING,
    description: "table 的最大高度。 合法的值为数字或者单位为 px 的高度。",
  },
  {
    prop: "stripe",
    label: "斑马纹",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否为斑马纹 table",
  },
  {
    prop: "border",
    label: "边框",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否带有纵向边框",
  },
  {
    prop: "size",
    label: "尺寸",
    type: AttrConfigTypeEnum.ENUM,
    options: [
      { label: '大', value: 'large' },
      { label: '默认', value: 'default' },
      { label: '小', value: 'small' }
    ],
    description: "Table 的尺寸",
  },
  {
    prop: "fit",
    label: "自适应",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "列的宽度是否自撑开",
  },
  {
    prop: "showHeader",
    label: "显示表头",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否显示表头",
  },
  {
    prop: "highlightCurrentRow",
    label: "高亮当前行",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否要高亮当前行",
  },
  {
    prop: "emptyText",
    label: "空数据文本",
    type: AttrConfigTypeEnum.STRING,
    description: '空数据时显示的文本内容'
  },
  {
    prop: "rowKey",
    label: "行数据的Key",
    type: AttrConfigTypeEnum.STRING,
    description: "行数据的 Key，用来优化 Table 的渲染",
  },
  {
    prop: "defaultExpandAll",
    label: "默认展开所有行",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效",
  },
  {
    prop: "indent",
    label: "树节点缩进",
    type: AttrConfigTypeEnum.NUMBER,
    description: "展示树形数据时，树节点的缩进",
  },
  {
    prop: "tableLayout",
    label: "表格布局",
    type: AttrConfigTypeEnum.ENUM,
    options: [
      { label: '固定', value: 'fixed' },
      { label: '自动', value: 'auto' }
    ],
    description: "设置表格单元、行和列的布局方式",
  },
  {
    prop: "scrollbarAlwaysOn",
    label: "显示滚动条",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "总是显示滚动条",
  },
  {
    prop: "showOverflowTooltip",
    label: "显示提示",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否隐藏额外内容并在单元格悬停时使用 Tooltip 显示它们",
  },
  {
    prop: "flexible",
    label: "弹性布局",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "确保主轴的最小尺寸，以便不超过内容",
  },
  {
    prop: "preserveExpandedContent",
    label: "保留展开内容",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "在折叠后是否在DOM中保留展开行内容",
  },
]

export const tableColumnAttrs: IAttrConfig[] = [
  {
    prop: 'type',
    label: '列类型',
    type: AttrConfigTypeEnum.ENUM,
    options: [
      { label: '默认', value: 'default' },
      { label: '多选框', value: 'selection' },
      { label: '索引', value: 'index' },
      { label: '展开按钮', value: 'expand' },
    ],
    description: '对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引；如果设置了 expand 则显示为一个可展开的按钮。',
    children: {
      default: [
        {
          prop: 'lcTableColumnType',
          label: '宽度',
          type: AttrConfigTypeEnum.STRING,
        }
      ]
    }
  },
]

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
  rowKey: 'id', // 行数据的唯一标识，默认为 'id'
}
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
