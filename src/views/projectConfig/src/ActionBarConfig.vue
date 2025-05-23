<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="属性" name="attrName">
      <el-collapse v-model="activeCollapse" accordion>
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

const actionBarConfig = defineModel<any>({ required: true });
console.log("actionBarConfig数据", actionBarConfig);

const activeCollapse = ref(["basic"]);
const activeName = ref("attrName");

// 添加列
const addColumn = () => {
  actionBarConfig.value.columnArr.push({
    attr: {
      label: "文本",
      type: "primary",
    },
    event: {},
    eventConfigs: {},
    // 自定义事件, 页面中特定的函数
    customEvent: {},
    customEventConfigs: {},
  });
};
const removeColumn = (index: number) => {
  actionBarConfig.value.columnArr.splice(index, 1);
};
</script>

<style lang="scss" scoped></style>
