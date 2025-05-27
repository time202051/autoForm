import { IAttrConfig, SearchTypeEnum, AttrConfigTypeEnum, IAttrConfigType, LcSearchPropNnum } from '@/views/projectConfig/src/index'
export const searchAttrs: IAttrConfig[] = [
  {
    prop: "labelWidth",
    label: "标签宽度",
    type: AttrConfigTypeEnum.NUMBER,
    description: "设置表单标签的宽度",
    attr: {
      min: 20
    }
  },
  {
    prop: "autoSearchWidth",
    label: "宽度自适应",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "搜索框宽度占满",
    children: [
      {
        prop: "searchWidth",
        label: "搜索框宽度",
        type: AttrConfigTypeEnum.NUMBER,
        description: "搜索框的宽度",
        attr: {
          min: 200,
        },
        show: (modelValue: any) => !modelValue.autoSearchWidth,
      }
    ],
  },
  {
    prop: "rowCount",
    label: "每行显示项数",
    type: AttrConfigTypeEnum.NUMBER,
    description: "设置每行显示的表单项数量",
    attr: {
      min: 1,
      max: 6,
      step: 1,
      precision: 0, // 确保输入整数
      onChange: ({ modelValue, val }: any) => {
        if (modelValue?.rowCount === 5) {
          modelValue.rowCount = 4;
          ElMessage.info('每行显示项数只能为1、2、3、4、6')
        }
      }
    }
  },
  {
    prop: "gutter",
    label: "间距",
    type: AttrConfigTypeEnum.NUMBER,
    description: "搜索框之间的距离",
    attr: {
      min: 0,
    }
  },
  {
    prop: "labelPosition",
    label: "标签位置",
    type: AttrConfigTypeEnum.ENUM,
    description: "表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性",
    options: [
      { label: "左侧", value: "left" },
      { label: "右侧", value: "right" },
      { label: "顶部", value: "top" },
    ],
  },
  {
    prop: "size",
    label: "尺寸",
    type: AttrConfigTypeEnum.ENUM,
    description: "用于控制该表单内组件的尺寸",
    options: [
      { label: "大", value: "large" },
      { label: "默认", value: "default" },
      { label: "小", value: "small" },
    ],
    attr: {
      clearable: true
    }
  },
];

const selectBase = [
  {
    prop: 'multiple',
    label: "多选",
    type: AttrConfigTypeEnum.BOOLEAN,
    description: "是否多选",
    children: {
      true: [
        {
          prop: 'multipleLimit',
          label: "最多选择数",
          type: AttrConfigTypeEnum.NUMBER,
          description: "multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制",
          attr: {
            min: 0,
            max: 10,
            step: 1,
          }
        },
      ]
    }
  },
]


//搜索框默认的属性
export const defaultSearchAttrs = {
  autoSearchWidth: true,
  searchWidth: 300,
  labelWidth: 100,
  rowCount: 4,
  gutter: 16,
  labelPosition: 'right'
}

export const searchColumnAttrs: IAttrConfig[] = [
  {
    prop: "label",
    label: "标题",
    type: AttrConfigTypeEnum.STRING,
    description: "设置表单项的字段名",
  },
  {
    prop: "prop",
    label: "字段",
    type: AttrConfigTypeEnum.STRING,
    description: "双向绑定,传入查询接口的键名",
  },
  {
    prop: LcSearchPropNnum.lCTYPE,
    label: "类型",
    type: AttrConfigTypeEnum.ENUM,
    options: [
      { label: "输入框", value: SearchTypeEnum.INPUT },
      { label: "本地下拉", value: SearchTypeEnum.LOCALSELECT },
      { label: "远程下拉", value: SearchTypeEnum.REMOTESELECT },
      { label: "日期选择器", value: SearchTypeEnum.DATE },
    ],
    description: "设置表单项的类型",
    attr: {
      onChange: (modelValue: Record<string, any>, val: string) => {
        // console.log(123, modelValue, val);
        // delete modelValue.options
        // delete modelValue.lcDict
      }
    },
    children: {
      [SearchTypeEnum.LOCALSELECT]: [
        {
          prop: LcSearchPropNnum.lCDICT,
          label: "字典数据",
          type: AttrConfigTypeEnum.STRING,
          description: "通过字典获取下拉框数据",
        },
        {
          prop: LcSearchPropNnum.LCOPTIONS,
          label: "下拉框选项",
          type: AttrConfigTypeEnum.ARRAY,
          description: "本地手动配置的下拉框静态数据,label:展示文本,value:实际值",
          show: (modelValue: any) => !modelValue.lcDict,
        },
        ...selectBase
      ],
      [SearchTypeEnum.REMOTESELECT]: [
        {
          prop: LcSearchPropNnum.LCREMOTEURL,
          label: "url",
          type: AttrConfigTypeEnum.STRING,
          description: "远程下拉框接口地址,例:/api/xxx",
        },
        {
          prop: LcSearchPropNnum.LCMETHOD,
          label: "请求类型",
          type: AttrConfigTypeEnum.ENUM,
          options: [
            { label: "GET", value: "GET" },
            { label: "POST", value: "POST" },
          ],
          description: "url接口请求类型",
        },
        {
          prop: LcSearchPropNnum.LCREMOTEPARAMS,
          label: "参数",
          type: AttrConfigTypeEnum.EDITOR,
          description: "返回的url接口参数,注意: 如含有异步请返回promise",
        },
        {
          prop: 'remote',
          label: "远程",
          type: AttrConfigTypeEnum.BOOLEAN,
          description: "其中的选项是否从服务器远程加载",
        },
        ...selectBase
      ],
      [SearchTypeEnum.DATE]: [
        {
          prop: 'type',
          label: "显示类型",
          type: AttrConfigTypeEnum.ENUM,
          description: "范围选择时开始日期的占位内容",
          options: [
            { label: "日期", value: 'date' },
            { label: "日期范围", value: 'daterange' },
            { label: "月份范围", value: 'monthrange' },
            { label: "年份日期", value: 'yearrange' },
            { label: "时间", value: 'datetime' },
            { label: "范围时间", value: 'datetimerange' },
          ],
        },
      ]
    },
  },
  // {
  //   prop: "placeholder",
  //   label: "占位符",
  //   type: "string",
  //   description: "设置表单项的占位符",
  // },
];

export const defaultSearchColumnAttrs = {
  lcType: SearchTypeEnum.INPUT
}


