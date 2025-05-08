<template>
  <div>
    <!-- elbutton按钮 -->
    <el-button type="primary" @click="openMenuDialog">菜单管理</el-button>

    <!-- eldialog弹框 -->
    <el-dialog v-model="dialogVisible" title="菜单设置" width="600">
      <MenuManagement
        v-if="dialogVisible"
        @save="onSave"
        @cancel="dialogVisible = false"
      ></MenuManagement>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import MenuManagement from "./MenuManagement.vue";
const dialogVisible = ref(false);
const openMenuDialog = () => {
  dialogVisible.value = true;
};
const onSave = () => {
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped></style>
