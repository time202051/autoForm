<template>
  <div class="page-config">
    <div class="config-panel">
      <!-- 搜索框配置 -->
      <SearchConfigCom
        v-if="selectedModule == ModuleTypeEnum.SEARCH"
        v-model="tableConfig.searchConfig"
      ></SearchConfigCom>
      <ActionBarConfigCom
        v-else-if="selectedModule == ModuleTypeEnum.ACTIONBAR"
        v-model="tableConfig.actionBarConfig"
      ></ActionBarConfigCom>
      <el-tabs v-else v-model="activeName" class="demo-tabs">
        <el-tab-pane label="属性" name="attrName">
          <el-collapse v-model="activeCollapse" accordion>
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
                    <!-- <CodeMirrorEditor
                      v-model="tableConfig"
                      :eventName="attr.prop"
                      text="编辑函数"
                    ></CodeMirrorEditor> -->
                    <el-button
                      type="primary"
                      size="small"
                      @click="codeMirrorOpen(attr.prop, tableConfig)"
                    >
                      <el-icon><Plus /></el-icon>
                      编辑函数
                    </el-button>
                  </div>

                  <!-- 对象类型显示编辑按钮 -->
                  <!-- <div v-else-if="attr.type === 'object'" class="object-editor">
                    <el-button type="primary" size="small">
                      <el-icon><Plus /></el-icon>
                      编辑对象
                    </el-button>
                  </div> -->

                  <!-- 字符串类型使用普通输入框 -->
                  <el-input
                    v-else-if="attr.type === 'string'"
                    v-model="tableConfig.attr[attr.prop]"
                    :placeholder="`请输入${attr.label}`"
                  />
                  <el-text v-else type="info">暂不支持编辑</el-text>
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
                <template v-if="!column.attr.prop">
                  <el-divider>操作按钮配置</el-divider>
                  <template v-if="column.defaultSlotConfig">
                    <CollapsibleCard
                      v-for="(btn, btnIndex) in column.defaultSlotConfig"
                      :key="btnIndex"
                      :isShowMore="false"
                      :height="170"
                      @close="removeActionButton(column, btnIndex)"
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
                          <el-button
                            type="primary"
                            size="small"
                            @click="codeMirrorOpen('click', column.defaultSlotConfig[btnIndex])"
                          >
                            <el-icon><Plus /></el-icon>
                            代码配置
                          </el-button>
                        </el-form-item>
                      </el-form>
                    </CollapsibleCard>
                  </template>
                  <div class="action-buttons">
                    <el-button type="primary" size="small" @click="addActionButton(column)">
                      添加按钮
                    </el-button>
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
                    <el-button
                      link
                      @click="codeMirrorOpen(eventItem.value, tableConfig)"
                      class="add-button"
                    >
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

    <!-- 代码编辑器弹框 -->
    <CodeMirrorEditor
      v-if="codeMirrorVisible"
      v-model="codeMirrorVisible"
      v-model:eventConfigs="codeMirrorCurrentObject.eventConfigs"
      v-model:event="codeMirrorCurrentObject.event"
      :eventName="eventNameCodeMirror"
      @save="codeMirrorSave"
    ></CodeMirrorEditor>
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
import { tableColumnAttrs, tableAttrs } from "@/views/projectConfig/src/pageConfig"; // 引入类型定义
import { eventHandler } from "@/utils/eventHandler";
import CodeMirrorEditor from "@/views/projectConfig/com/CodeMirrorEditor.vue";
import { hasEvents } from "@/hooks/useProjectCache";
import type { IPageConfig } from "./pageConfig";
import SearchConfigCom from "./SearchConfig.vue";
import { useProjectStore } from "@/store";
import { ModuleTypeEnum } from "@/views/projectConfig/src/pageConfig";
import ActionBarConfigCom from "@/views/projectConfig/src/ActionBarConfig.vue";

// const props = withDefaults(
//   defineProps<{
//     modelValue: any;
//   }>(),
//   {
//     modelValue: () => {
//       return {};
//     },
//   }
// );
const tableConfig = defineModel<IPageConfig>({ required: true });
console.log("所有数据", tableConfig);

const projectStore = useProjectStore();
const selectedModule = computed(() => projectStore.selectedModule);
const emit = defineEmits(["save"]);
// const tableConfig = useVModel(props, "modelValue", emit);

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
  if (!tableConfig.value?.columnArr) tableConfig.value.columnArr = [];
  tableConfig.value?.columnArr.push({
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
  if (!tableConfig.value?.columnArr) tableConfig.value.columnArr = [];
  tableConfig.value?.columnArr.splice(index, 1);
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
  // 动态判断是否有值
  // 动态判断是否有值
  const hasEventConfigs = hasEvents.some((field) => {
    if (column[field] && Array.isArray(column[field])) {
      return Object.keys(column[field][btnIndex].eventConfigs).length > 0;
    }
    return false;
  });

  console.log(123, column);
  // 注册事件需要确认删除
  if (hasEventConfigs) {
    ElMessageBox.confirm("当前按钮有事件配置，是否删除？", "按钮删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      column.defaultSlotConfig.splice(btnIndex, 1);
    });
  } else {
    column.defaultSlotConfig.splice(btnIndex, 1);
  }
};

defineExpose({
  tableConfig,
});

// 编辑弹框
const codeMirrorVisible = ref<boolean>(false);
const eventNameCodeMirror = ref<string>("");
const codeMirrorCurrentObject = ref<any>({});
const codeMirrorOpen = (key: string, obj: any) => {
  codeMirrorVisible.value = true;
  eventNameCodeMirror.value = key;
  codeMirrorCurrentObject.value = obj;
};
const codeMirrorClose = () => {
  codeMirrorVisible.value = false;
  eventNameCodeMirror.value = "";
  codeMirrorCurrentObject.value = {};
};
const codeMirrorSave = (data: any) => {
  codeMirrorClose();
};
</script>

<style scoped lang="scss">
.page-config {
  width: 100%;

  .config-panel {
    position: relative;
    .save-btn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .column-tools {
      margin-bottom: 16px;
    }
  }
}

:deep(.el-collapse-item__header) {
  background-color: #f8f8f8;
}

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
