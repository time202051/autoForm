<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="属性" name="attrName">
      <el-collapse v-model="activeCollapse" accordion>
        <el-collapse-item title="基础属性" name="basic">
          <AttrConfigForm
            :attrs="tableAttrs"
            v-model="tableConfig.attr"
            v-model:event="tableConfig.event"
            v-model:eventConfigs="tableConfig.eventConfigs"
          ></AttrConfigForm>
        </el-collapse-item>
        <el-collapse-item title="列配置" name="column">
          <CollapsibleCard
            v-for="(column, index) in tableConfig.columnArr"
            :key="index"
            @close="removeColumn(index)"
          >
            <template #header>
              <span># {{ index + 1 }}</span>
            </template>
            <AttrConfigForm
              :attrs="tableColumnAttrs"
              v-model="column.attr"
              v-model:event="column.customEvent"
              v-model:eventConfigs="column.customEventConfigs"
            ></AttrConfigForm>
            <!-- v-model:eventConfigs="column.eventConfigs" -->
          </CollapsibleCard>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="事件" name="eventName">
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
  <!-- 代码编辑器弹框 -->
  <CodeMirrorEditor
    v-if="codeMirrorVisible"
    v-model="codeMirrorVisible"
    v-model:eventConfigs="codeMirrorCurrentObject.eventConfigs"
    v-model:event="codeMirrorCurrentObject.event"
    :eventName="eventNameCodeMirror"
    @save="codeMirrorSave"
  ></CodeMirrorEditor>
</template>

<script setup lang="ts">
import type { IPageConfig } from "@/views/projectConfig/src/pageConfig.ts";
import CodeMirrorEditor from "@/views/projectConfig/com/CodeMirrorEditor.vue";
import CollapsibleCard from "@/views/projectConfig/com/CollapsibleCard.vue";
import AttrConfigForm from "@/views/projectConfig/com/AttrConfigForm.vue";
import { tableAttrs, tableColumnAttrs } from "@/views/projectConfig/src/tableConfig";

const tableConfig = defineModel<IPageConfig>({ required: true, default: {} });

const activeName = ref("attrName");
const activeCollapse = ref(["basic"]);

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

const removeColumn = (index: number) => {
  tableConfig.value.columnArr.splice(index, 1);
};
</script>

<style lang="scss" scoped>
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
}

.add-button {
  padding: 0;
  font-size: 16px;
}
</style>
