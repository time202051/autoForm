<template>
  <div class="search-config">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="属性" name="attrName">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="基础属性" name="basic">
            <AttrConfigForm :attrs="searchAttrs" v-model="searchConfig.attr"></AttrConfigForm>
          </el-collapse-item>

          <el-collapse-item title="列配置" name="columns">
            <CollapsibleCard
              v-for="(column, index) in searchConfig.columnArr"
              :key="index"
              @close="removeColumn(index)"
            >
              <template #header>
                <span># {{ index + 1 }}</span>
              </template>
              <AttrConfigForm :attrs="searchColumnAttrs" v-model="column.attr"></AttrConfigForm>
            </CollapsibleCard>
            <div class="column-tools">
              <el-button type="primary" @click="addColumn">
                <el-icon><Plus /></el-icon>
                添加列
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CollapsibleCard from "@/views/projectConfig/com/CollapsibleCard.vue";
import AttrConfigForm from "@/views/projectConfig/com/AttrConfigForm.vue";
import { searchAttrs, searchColumnAttrs } from "./searchConfig";

const searchConfig = defineModel<any>({ required: true });
console.log("searchForm组件", searchConfig);

// 折叠面板激活项
const activeCollapse = ref(["basic"]);

const activeName = ref("attrName");

// 添加列
const addColumn = () => {
  searchConfig.value.columnArr.push({
    attr: {
      prop: "",
      label: "文本",
      lcType: "input",
      // placeholder: "",
    },
  });
};

// 删除列
const removeColumn = (index: number) => {
  searchConfig.value.columnArr.splice(index, 1);
};
</script>

<style scoped lang="scss">
.search-config {
  width: 100%;

  .config-panel {
    position: relative;
    .column-tools {
      margin-bottom: 16px;
    }
  }
}

:deep(.el-collapse-item__header) {
  background-color: #f8f8f8;
}
</style>
