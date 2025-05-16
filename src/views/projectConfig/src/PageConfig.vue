<template>
  <div class="page-config">
    <div class="config-panel">
      <!-- <el-button type="primary" @click="onSubmit">提交</el-button> -->
      <!-- <el-divider /> -->
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="属性" name="attrName">
          <el-collapse v-model="activeCollapse">
            <!-- 基础属性配置 -->
            <el-collapse-item title="基础属性" name="basic">
              <el-form label-position="left" label-width="120px">
                <el-form-item v-for="attr in tableAttrs" :key="attr.prop">
                  <template #label>
                    <el-tooltip
                      :content="attr.description"
                      placement="top"
                      effect="light"
                      :show-after="200"
                    >
                      <span>{{ attr.label }}</span>
                    </el-tooltip>
                  </template>

                  <!-- 布尔类型使用开关 -->
                  <el-switch v-if="attr.type === 'boolean'" v-model="tableConfig.attr[attr.prop]" />

                  <!-- 枚举类型使用下拉框 -->
                  <el-select v-else-if="attr.type === 'enum'" v-model="tableConfig.attr[attr.prop]">
                    <el-option
                      v-for="opt in attr.options"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value"
                    />
                  </el-select>

                  <!-- 数值类型使用数字输入框 -->
                  <el-input-number
                    v-else-if="attr.type === 'number'"
                    v-model="tableConfig.attr[attr.prop]"
                    :controls="true"
                  />

                  <!-- 函数类型显示编辑按钮 -->
                  <div v-else-if="attr.type === 'function'" class="function-editor">
                    <el-button type="primary" size="small">
                      <el-icon><Plus /></el-icon>
                      编辑函数
                    </el-button>
                  </div>

                  <!-- 对象类型显示编辑按钮 -->
                  <div v-else-if="attr.type === 'object'" class="object-editor">
                    <el-button type="primary" size="small">
                      <el-icon><Plus /></el-icon>
                      编辑对象
                    </el-button>
                  </div>

                  <!-- 字符串类型使用普通输入框 -->
                  <el-input
                    v-else
                    v-model="tableConfig.attr[attr.prop]"
                    :placeholder="`请输入${attr.label}`"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <!-- 列配置 -->
            <el-collapse-item title="列配置" name="columns">
              <CollapsibleCard
                v-for="(column, index) in tableConfig.columnArr"
                :key="index"
                @close="removeColumn(index)"
              >
                <template #header>
                  <span>列 {{ index + 1 }}</span>
                </template>
                <AttrConfigForm :attrs="tableColumnAttrs" v-model="column.attr"></AttrConfigForm>
                <!-- 操作列配置 -->
                column.attr.prop:{{ !column.attr.prop }}
                <template v-if="!column.attr.prop">
                  <el-divider>操作按钮配置</el-divider>
                  <div class="action-buttons">
                    <el-button type="primary" size="small" @click="addActionButton(column)">
                      添加按钮
                    </el-button>
                  </div>
                  <div v-if="column.defaultSlotConfig" class="button-list">
                    <el-card
                      v-for="(btn, btnIndex) in column.defaultSlotConfig"
                      :key="btnIndex"
                      class="button-item"
                    >
                      <el-form>
                        <el-form-item label="按钮文本">
                          <el-input v-model="btn.content.text" />
                        </el-form-item>
                        <el-form-item label="按钮类型">
                          <el-select v-model="btn.attr.type">
                            <el-option label="主要" value="primary" />
                            <el-option label="成功" value="success" />
                            <el-option label="警告" value="warning" />
                            <el-option label="危险" value="danger" />
                            <el-option label="信息" value="info" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="点击事件">
                          <el-input
                            type="textarea"
                            v-model="btn.eventConfigs['click']"
                            placeholder="输入事件处理代码"
                            @change="updateButtonEvent(column, btnIndex)"
                          />
                        </el-form-item>
                      </el-form>
                      <el-button
                        type="danger"
                        size="small"
                        @click="removeActionButton(column, btnIndex)"
                      >
                        删除按钮
                      </el-button>
                    </el-card>
                  </div>
                </template>
              </CollapsibleCard>
              <div class="column-tools">
                <el-button type="primary" @click="addColumn">添加列</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="事件" name="evnet">
          <div v-for="(item, index) in elTableEvents" :key="index">
            <div class="event-group">
              <div class="event-group-title">{{ item.title }}</div>
              <div class="event-list">
                <div v-for="(eventItem, i) in item.evnets" :key="i" class="event-item">
                  <div class="event-header">
                    <span>{{ eventItem.label }}</span>
                    <el-button link @click="showCodeEditor(eventItem)" class="add-button">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <SaveCurrentPage class="save-btn" :tableConfig></SaveCurrentPage>
    </div>
    <!-- dialog会影响内部代码编辑器的样式，才通过这种方式手撸弹框，支持拖拽缩放 -->
    <Teleport to="body">
      <!-- 添加遮罩层 -->
      <div v-if="dialogVisible" class="editor-overlay"></div>
      <div
        v-if="dialogVisible"
        ref="editorRef"
        class="editor-container"
        :style="{
          left: position.x + 'px',
          top: position.y + 'px',
          width: size.width + 'px',
          height: size.height + 'px',
        }"
      >
        <div
          class="editor-header"
          @mousedown="startDrag"
          :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
        >
          <div class="left-space"></div>
          <div class="dialog-title">事件编辑</div>
          <el-icon class="close-icon" @click="closeEditor">
            <Close />
          </el-icon>
        </div>
        <div class="editor-body">
          <Codemirror
            ref="cmComponentRef"
            v-model:value="tableConfig.eventConfigs[currentEvent.value]"
            :options="cmOptions"
            border
            height="100%"
            width="100%"
          ></Codemirror>
          <!-- @change="(val: string, cm: Editor) => handleContentChange(currentEvent.value, val, cm)" -->
        </div>
        <div class="editor-footer">
          <el-button @click="closeEditor">取消</el-button>
          <el-button type="primary" @click="saveEditor(currentEvent.value)">确定</el-button>
        </div>
        <!-- 拖拽调整大小的边框 -->
        <div
          class="resize-handle resize-handle-e"
          @mousedown.stop="(e) => startResize('e', e)"
        ></div>
        <div
          class="resize-handle resize-handle-s"
          @mousedown.stop="(e) => startResize('s', e)"
        ></div>
        <div
          class="resize-handle resize-handle-se"
          @mousedown.stop="(e) => startResize('se', e)"
        ></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ComponentInternalInstance } from "vue";
import type { TableType } from "@/components/BaseTable/index";
import BaseTable from "@/components/BaseTable/src/BaseTable.vue";
import { cloneDeep } from "lodash";
import "codemirror/mode/javascript/javascript.js";
import type { Editor, EditorConfiguration } from "codemirror";
import { CmComponentRef } from "codemirror-editor-vue3";
import { Close } from "@element-plus/icons-vue";
import { useResizable } from "@/hooks";
import { useVModel } from "@vueuse/core";
import CollapsibleCard from "@/views/projectConfig/com/CollapsibleCard.vue";
import AttrConfigForm from "@/views/projectConfig/com/AttrConfigForm.vue";
import SaveCurrentPage from "@/views/projectConfig/com/SaveCurrentPage.vue";
import type {
  TableParams,
  IEventParams,
  TableAttrConfig,
} from "@/views/projectConfig/src/pageConfig.ts"; // 引入类型定义
import { tableColumnAttrs, tableAttrs } from "@/views/projectConfig/src/pageConfig"; // 引入类型定义
import { eventHandler } from "@/utils/eventHandler";
const props = withDefaults(
  defineProps<{
    modelValue: any;
  }>(),
  {
    modelValue: () => {
      return {};
    },
  }
);

const emit = defineEmits(["update:modelValue", "save"]);

const tableConfig = useVModel(props, "modelValue", emit);
// watch(
//   tableConfig.value,
//   (newValue) => {
//     emit("update:modelValue", newValue);
//   },
//   { deep: true }
// );
// const tableConfig = defineModel({
//   default: () =>
//     reactive({
//       data: [],
//       attr: {},
//       columnArr: [],
//       event: {},
//       eventConfigs: {},
//     }),
// });

// 表格配置
// const tableConfig = reactive<TableType>({
//   data: [
//     { id: 1, name: "张三", age: 25, address: "北京" },
//     { id: 2, name: "李四", age: 30, address: "上海" },
//   ],
//   attr: {
//     border: true,
//     stripe: true,
//     size: "default",
//   },
//   columnArr: [],
//   event: {},
//   eventConfigs: {},
// });

// 折叠面板激活项
const activeCollapse = ref(["basic"]);

const activeName = ref("attrName");

// 定义 el-table 支持的事件列表
const elTableEvents = [
  {
    title: "通用事件",
    evnets: [
      { value: "select", label: "行选择" }, // 当用户手动勾选数据行的 Checkbox 时触发的事件
      { value: "select-all", label: "全选" }, // 当用户手动勾选全选 Checkbox 时触发的事件
      { value: "selection-change", label: "选择变化" }, // 当选择项发生变化时会触发该事件
      { value: "cell-click", label: "单元格点击" }, // 当某个单元格被点击时会触发该事件
      { value: "cell-dblclick", label: "单元格双击" }, // 当某个单元格被双击时会触发该事件
      { value: "row-click", label: "行点击" }, // 当某一行被点击时会触发该事件
      { value: "row-dblclick", label: "行双击" }, // 当某一行被双击时会触发该事件
      { value: "header-click", label: "表头点击" }, // 当某一列的表头被点击时会触发该事件
      { value: "sort-change", label: "排序变化" }, // 当表格的排序条件发生变化的时候会触发该事件
      { value: "current-change", label: "当前行变化" }, // 当表格的当前行发生变化的时候会触发该事件
    ],
  },
  {
    title: "高级事件",
    evnets: [
      { value: "cell-mouse-enter", label: "hover进入" }, // 当用户对某一行展开或者关闭的时候会触发该事件
      { value: "cell-mouse-leave", label: "hover退出" }, // 当用户对某一行展开或者关闭的时候会触发该事件
      { value: "cell-contextmenu", label: "单元格右键菜单" }, // 当某个单元格被鼠标右键点击时会触发该事件
      { value: "row-contextmenu", label: "行右键菜单" }, // 当某一行被鼠标右键点击时会触发该事件
      { value: "header-contextmenu", label: "表头右键菜单" }, // 当某一列的表头被鼠标右键点击时触发该事件
      { value: "filter-change", label: "过滤变化" }, // 当表格的过滤条件发生变化的时候会触发该事件
      { value: "header-dragend", label: "表头拖拽结束" }, // 当拖动表头改变了列的宽度的时候会触发该事件
      { value: "expand-change", label: "展开行变化" }, // 当用户对某一行展开或者关闭的时候会触发该事件
      { value: "scroll", label: "滚动事件" }, // 当表格滚动时触发该事件（Element Plus 2.9.0+）
    ],
  },
];

// 添加列
const addColumn = () => {
  tableConfig.value.columnArr.push({
    attr: {
      prop: "",
      label: "",
      width: "",
      align: "left",
    },
  });
};

// 删除列
const removeColumn = (index: number) => {
  console.log(1111111, tableConfig);

  tableConfig.value.columnArr.splice(index, 1);
};

// 添加操作按钮
const addActionButton = (column: any) => {
  if (!column.defaultSlotConfig) {
    column.defaultSlotConfig = [];
  }
  column.defaultSlotConfig.push({
    comp: "ElButton",
    attr: {
      type: "primary",
      // size: "small",
    },
    content: {
      text: "按钮",
    },
    eventConfigs: {}, // 存储事件代码
    event: {},
  });
};

// 删除操作按钮
const removeActionButton = (column: any, btnIndex: number) => {
  column.defaultSlotConfig.splice(btnIndex, 1);
};

// 获取组件实例
const ctx = getCurrentInstance() as ComponentInternalInstance;

// 更新按钮事件
const updateButtonEvent = (column: any, btnIndex: number) => {
  const btn = column.defaultSlotConfig[btnIndex];
  try {
    if (!btn.event) btn.event = {};
    // 创建事件处理函数
    btn.event["click"] = (args: any, instance: any) => {
      return eventHandler({
        args,
        eventName: "click",
        eventConfigs: btn.eventConfigs,
        instance,
      });
      // 创建一个统一的参数对象，包含所有可能用到的参数和方法
      // const e: IEventParams = {
      //   args,
      //   // 基础数据
      //   // scope, // 原始 scope 对象
      //   // row: scope.row, // 当前行数据
      //   // index: scope.$index, // 当前行索引
      //   // column: scope.column, // 当前列信息
      //   // 页面状态
      //   state: {
      //     tableConfig: tableConfig,
      //     // eventConfigs, // 事件配置
      //   },
      // };

      // // 使用 Function 构造函数创建新的函数，只传入一个参数
      // const fn = new Function("context", btn.eventConfigs["click"]); //默认一定是click，后面再扩展其他的
      // // 执行函数，传入统一的参数对象
      // return fn(e);
    };
  } catch (error) {
    console.error("事件代码格式错误:", error);
  }
};

// 代码编辑器
const editorRef = ref<HTMLElement | null>(null);
const cmComponentRef = ref<CmComponentRef>(null);
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
};
const dialogVisible = ref(false);
const currentEvent = ref<any>(null);
// 显示代码编辑器
const showCodeEditor = (eventItem: any) => {
  console.log(123, eventItem);
  currentEvent.value = eventItem;
  dialogVisible.value = true;
};
// 关闭编辑器
const closeEditor = async () => {
  await ElMessageBox.confirm("代码未保存，是否继续关闭？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  // 用户确认关闭
  dialogVisible.value = false;
};
const saveEditor = (eventName: string) => {
  updateTableEvent(eventName);
  dialogVisible.value = false;
  ElMessage({
    message: "编辑成功",
    type: "success",
  });
};

// 更新表格事件eventName事件名，codeVal代码值
const updateTableEvent = (eventName: string, codeVal?: string) => {
  const val = codeVal || cmComponentRef?.value.cminstance.getValue();
  console.log("更新表格事件", eventName, val);

  // 如果 codeVal 没有值，删除 eventConfigs 中的事件
  if (!val) {
    delete tableConfig.value.eventConfigs[eventName];
    delete tableConfig.value.event[eventName];
    return;
  }

  try {
    tableConfig.value.event[eventName] = (args: any, instance: any, tableRef: any) => {
      try {
        return eventHandler({ args, eventName, eventConfigs: tableConfig.value.eventConfigs });
      } catch (error: any) {
        console.error(`事件 ${eventName} 执行出错:`, error);
        ElMessage.error(`事件执行出错: ${error?.message}`);
      }
    };
    // tableConfig.value.event[eventName] = (...args: any[]) => {
    //   const e: IEventParams = {
    //     args,
    //     state: {
    //       tableConfig: tableConfig,
    //       // eventConfigs, // 事件配置
    //     },
    //     methods: {
    //       addColumn, // 添加列方法
    //       removeColumn, // 删除列方法
    //       addActionButton, // 添加按钮方法
    //       removeActionButton, // 删除按钮方法
    //       updateTableEvent, // 更新表格事件方法
    //       // onSubmit, // 提交方法
    //     },
    //     ctx: ctx,
    //     // 备注
    //   };
    //   // Object.defineProperty(e, "lc-remark", {
    //   //   value: `args:是el-table事件${eventName}的参数，顺序一致`,
    //   //   writable: false, // 只读
    //   //   enumerable: false, // 不可遍历
    //   // });
    //   return new Function("e", tableConfig.value.eventConfigs[eventName])(e);
    // };
  } catch (error) {
    console.error("事件代码格式错误:", error);
  }
};
const { position, size, isDragging, startDrag, startResize, cleanup, recalculatePosition } =
  useResizable(editorRef, { width: 800, height: 800 }, { minWidth: 400, minHeight: 300 });
// 监听对话框显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      recalculatePosition();
    });
  }
});
// 组件卸载时清理
onUnmounted(() => {
  cleanup();
});

// const onSubmit = () => {
//   console.log("保存", tableConfig);
//   emit("save", { tableConfig: cloneDeep(tableConfig) });
// };

defineExpose({
  tableConfig,
});
</script>

<style scoped lang="scss">
.page-config {
  // height: 100%;
  width: 100%;

  .config-panel {
    // padding: 20px;
    // border-left: 1px solid #dcdfe6;
    // background-color: #f5f7fa;
    position: relative;
    .save-btn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .column-tools {
      margin-bottom: 16px;
    }

    .column-card {
      margin-bottom: 16px;

      .column-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .button-list {
      margin-top: 16px;

      .button-item {
        margin-bottom: 16px;
      }
    }
  }
}

:deep(.el-collapse-item__header) {
  background-color: #f8f8f8;
}
// :deep(.CodeMirror-gutters) {
//   width: 29px;
//   .CodeMirror-linenumbers {
//     width: 29px;
//   }
// }
// :deep(.CodeMirror-sizer) {
//   margin-left: 39px !important;
// }

// 事件样式
.events-panel {
  padding: 20px;
}

.event-group {
  margin-bottom: 20px;
}

.event-group-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.event-list {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.event-item {
  border-bottom: 1px solid #e4e7ed;
}

.event-item:last-child {
  border-bottom: none;
}

.event-header {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.add-button {
  padding: 0;
  font-size: 16px;
}

// 添加遮罩层样式
.editor-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999; // 确保在编辑器容器之下
}
.editor-container {
  position: fixed;
  z-index: 2000;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: var(--el-bg-color-overlay);
    border-bottom: 1px solid #e4e7ed;
    border-radius: 4px 4px 0 0;
    user-select: none; /* 防止拖拽时选中文字 */
  }
  .editor-body {
    flex: 1;
    padding: 10px;
  }
  .editor-footer {
    padding: 5px 15px 15px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-space {
    width: 20px;
  }

  .dialog-title {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .close-icon {
    font-size: 20px;
    color: #909399;
    cursor: pointer;
    transition: all 0.3s;
  }

  .close-icon:hover {
    color: #303133;
  }

  /* 确保编辑器填充剩余空间 */
  // :deep(.CodeMirror) {
  //   height: calc(100% - 50px) !important; /* 减去header高度 */
  // }

  /* 拖拽时添加一些视觉反馈 */
  .editor-header:active {
    cursor: grabbing;
  }

  /* 防止文本选择 */
  .editor-header * {
    user-select: none;
  }
  .resize-handle {
    position: absolute;
    background: transparent;

    &-e {
      top: 0;
      right: -5px;
      width: 10px;
      height: 100%;
      cursor: e-resize;
    }

    &-s {
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 10px;
      cursor: s-resize;
    }

    &-se {
      bottom: -5px;
      right: -5px;
      width: 10px;
      height: 10px;
      cursor: se-resize;
    }
  }
}

.el-form-item {
  :deep(.el-tooltip__trigger) {
    cursor: help;
  }
}

:deep(.el-collapse-item__content) {
  padding: 10px 0;
}
</style>
