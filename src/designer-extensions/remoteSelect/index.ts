import { type ComponentConfigModel } from "epic-designer";
export default {
  component: () => import('./index.vue'),
  config: {
    // action: [
    //   {
    //     describe: '使输入框获取焦点',
    //     type: 'focus',
    //   },
    //   {
    //     describe: '使输入框失去焦点',
    //     type: 'blur',
    //   },
    //   {
    //     describe: '选中输入框中的文字',
    //     type: 'select',
    //   },
    // ],
    attribute: [
      {
        field: 'field',
        label: '字段名',
        type: 'input',
      },
      {
        field: 'label',
        label: '标题',
        type: 'input',
      },
      {
        field: 'componentProps.placeholder',
        label: '占位内容',
        type: 'input',
      },
      {
        field: 'lcremoteurl',
        label: 'url',
        type: 'input',
      },
      {
        field: 'componentProps.lcmethod',
        label: '请求类型',
        type: 'select',
        componentProps: {
          options: [
            {
              value: "GET",
              label: "GET"
            },
            {
              value: "POST",
              label: "POST"
            }
          ],
          placeholder: '请选择请求类型',
        }
      },
      {
        field: 'componentProps.remote',
        label: '远程',
        type: 'switch',
      },
      {

        field: 'componentProps.multiple',
        label: '多选',
        type: 'switch',
      },
    ],
    event: [
      {
        describe: '输入值时',
        type: 'input',
      },
      {
        describe: '值修改时',
        type: 'change',
      },
      {
        describe: '按下回车时',
        type: 'pressEnter',
      },
      {
        describe: '获取焦点时',
        type: 'focus',
      },
      {
        describe: '失去焦点时',
        type: 'blur',
      },
    ],
  },
  defaultSchema: {
    componentProps: {
      placeholder: '请输入',
    },
    // field: 'epic-input',
    input: true,
    label: '远程下拉框',
    type: 'remoteSelect',
  },
  groupName: '表单',
  icon: 'icon-chukusaomiao',
  sort: 2000,
} as ComponentConfigModel;
