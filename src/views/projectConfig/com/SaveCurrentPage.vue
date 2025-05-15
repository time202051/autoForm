<template>
  <el-button type="primary" @click="saveCurrentPage">保存</el-button>
</template>
<script setup lang="ts">
import { useProjectCache } from "@/hooks";
import { useRoute } from "vue-router";

const props = withDefaults(
  defineProps<{
    tableConfig: any;
  }>(),
  {
    tableConfig: () => {
      return {};
    },
  }
);

const { savePageData } = useProjectCache();

const route = useRoute();
const saveCurrentPage = () => {
  savePageData(props.tableConfig);
  console.log("getProjectCache数据", props.tableConfig);
};
</script>

<style lang="scss" scoped></style>
