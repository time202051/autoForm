<template>
  <el-button
    v-for="(button, index) in actionBarConfig?.columnArr"
    :key="index"
    :type="button.attr?.type"
    v-bind="button?.attr"
    v-on="bindActionBarEvents(tableRef, button)"
  >
    {{ button?.attr?.label }}
  </el-button>
</template>

<script setup lang="ts">
import { IActionBarConfig } from "@/views/projectConfig/src/actionBarConfig";
import { useEventHandler } from "@/hooks";
const props = defineProps<{
  tableRef: any;
}>();

const actionBarConfig = defineModel<IActionBarConfig>({ required: true });

const { bindActionBarEvents } = useEventHandler();
</script>

<style lang="scss" scoped></style>
