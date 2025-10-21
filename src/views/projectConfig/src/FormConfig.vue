<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="属性" name="attrName">
      <el-collapse v-model="activeCollapse" accordion>
        <el-collapse-item title="基础属性" name="basic"></el-collapse-item>
        <el-collapse-item title="表单配置" name="basic"></el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="事件" name="event">事件</el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
const activeName = ref("attrName");
const activeCollapse = ref(["basic"]);
</script>

<style lang="scss" scoped></style>
