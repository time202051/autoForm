import { IAttrConfig, SearchTypeEnum } from '@/views/projectConfig/src/index'
export const searchAttrs: IAttrConfig[] = [
  {
    prop: "labelWidth",
    label: "标签宽度",
    type: "number",
    description: "设置表单标签的宽度",
    attr: {
      min: 20
    }
  },
  {
    prop: "autoSearchWidth",
    label: "宽度自适应",
    type: "boolean",
    description: "搜索框宽度占满",
    children: [
      {
        prop: "searchWidth",
        label: "搜索框宽度",
        type: "number",
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
    type: "number",
    description: "设置每行显示的表单项数量",
    attr: {
      min: 1,
      max: 6,
      step: 1,
      precision: 0, // 确保输入整数
      onChange: (modelValue: Record<string, any>, val: number) => {
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
    type: "number",
    description: "搜索框之间的距离",
    attr: {
      min: 0,
    }
  },
  {
    prop: "labelPosition",
    label: "标签位置",
    type: "enum",
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
    type: "enum",
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
  // {
  //   prop: "prop",
  //   label: "字段名",
  //   type: "string",
  //   description: "设置表单项的字段名",
  // },
  // {
  //   prop: "label",
  //   label: "标签",
  //   type: "string",
  //   description: "设置表单项的标签",
  // },
  {
    prop: "prop",
    label: "字段",
    type: "string",
    description: "双向绑定,传入查询接口的键名",
  },
  {
    prop: "label",
    label: "字段名",
    type: "string",
    description: "设置表单项的字段名",
  },
  {
    prop: "lcType",
    label: "类型",
    type: "enum",
    options: [
      { label: "输入框", value: SearchTypeEnum.INPUT },
      { label: "本地下拉", value: SearchTypeEnum.LOCALSELECT },
      { label: "远程下拉", value: SearchTypeEnum.REMOTESELECT },
      { label: "日期选择器", value: SearchTypeEnum.DATE },
    ],
    description: "设置表单项的类型",
    attr: {},
    children: {
      [SearchTypeEnum.LOCALSELECT]: [
        {
          prop: "options",
          label: "下拉框选项",
          type: "array",
          description: "本地手动配置的下拉框静态数据",
        },
      ]
    }
  },
  // {
  //   prop: "placeholder",
  //   label: "占位符",
  //   type: "string",
  //   description: "设置表单项的占位符",
  // },
];

export const defaultSearchColumnAttrs = {
  lcType: 'input'
}
