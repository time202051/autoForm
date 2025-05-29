<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="属性" name="attrName">
      <el-collapse v-model="activeCollapse" accordion>
        <!-- <el-collapse-item title="按钮配置" name="basic">
          <CollapsibleCard
            v-for="(column, index) in actionBarConfig.columnArr"
            :key="index"
            @close="removeColumn(index)"
          >
            <template #header>
              <span># {{ index + 1 }}</span>
            </template>
            <AttrConfigForm
              :attrs="actionBarColumnAttrs"
              v-model="column.attr"
              v-model:event="column.event"
              v-model:eventConfigs="column.eventConfigs"
            ></AttrConfigForm>
          </CollapsibleCard>
        </el-collapse-item> -->
        <el-collapse-item title="按钮配置" name="basic">
          <CollapsibleCard
            v-for="(column, index) in actionBarConfig.columnArr"
            :key="index"
            @close="removeColumn(index)"
          >
            <template #header>
              <span># {{ index + 1 }}</span>
            </template>
            <AttrConfigForm
              :attrs="actionBarColumnAttrs"
              v-model="column.attr"
              v-model:event="column.event"
              v-model:eventConfigs="column.eventConfigs"
            ></AttrConfigForm>
          </CollapsibleCard>
          <div class="column-tools">
            <el-button type="primary" @click="addColumn">
              <el-icon><Plus /></el-icon>
              添加查询条件
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import CollapsibleCard from "@/views/projectConfig/com/CollapsibleCard.vue";
import AttrConfigForm from "@/views/projectConfig/com/AttrConfigForm.vue";
import { actionBarColumnAttrs } from "@/views/projectConfig/src/actionBarConfig";
import type { IActionBarConfig, IComItem } from "@/views/projectConfig/src/actionBarConfig";

const actionBarConfig = defineModel<IActionBarConfig>({ required: true });
console.log("actionBarConfig数据", actionBarConfig);

const activeCollapse = ref(["basic"]);
const activeName = ref("attrName");

// 添加列
const addColumn = () => {
  const temp: IComItem = {
    attr: {
      lcBtnType: 6, //必填
      label: "文本",
      type: "primary",
    },
    event: {},
    eventConfigs: {},
    // 自定义事件, 页面中特定的函数
    customEvent: {},
    customEventConfigs: {},
  };
  actionBarConfig.value.columnArr.push(temp);
};

const removeColumn = (index: number) => {
  actionBarConfig.value.columnArr.splice(index, 1);
};

watch(
  () => actionBarConfig.value.columnArr.map((column: IComItem) => column.attr.lcBtnType),
  (newValues, oldValues) => {
    newValues.forEach((newValue, index) => {
      if (newValue !== oldValues[index]) {
        console.log(newValues, newValue);
        handleButtonLogic(newValue, actionBarConfig.value.columnArr[index]);
      }
    });
  },
  { deep: true }
);

// 处理按钮逻辑
const handleButtonLogic = (btnType: number, column: any) => {
  // 清空自定义事件event,eventConfigs
  column.event = {};
  column.eventConfigs = {};
  column.attr.type = "primary";
  switch (btnType) {
    case 0: // 新建
      console.log("组态-执行新建逻辑", column);
      column.attr.label = "新建";
      break;
    case 1: // 编辑
      console.log("组态-执行编辑逻辑", column);
      column.attr.label = "编辑";
      break;
    case 2: // 删除
      console.log("组态-执行删除逻辑", column);
      column.attr.label = "删除";
      column.attr.type = "danger";
      break;
    case 3: // 批量删除
      console.log("组态-执行批量删除逻辑", column);
      column.attr.label = "批量删除";
      column.attr.type = "danger";
      break;
    case 4: // 导入
      console.log("组态-执行导入逻辑", column);
      column.attr.label = "导入";
      break;
    case 5: // 导出
      console.log("组态-执行导出逻辑", column);
      column.attr.label = "导出";
      break;
    case 6: // 导出
      console.log("组态-执行导出逻辑", column);
      column.attr.label = "文本";
      break;
    default:
      // console.log("组态-未知按钮类型", column);

      break;
  }
};
</script>

<style lang="scss" scoped></style>
