<template>
  <el-button
    v-for="(button, index) in actionBarConfig?.columnArr"
    :key="index"
    :type="button.attr?.type"
    v-bind="button?.attr"
    @click="handleButtonClick(button)"
    v-on="bindActionBarEvents(tableRef, button)"
  >
    {{ button?.attr?.label }}
  </el-button>
</template>

<script setup lang="ts">
import { IActionBarConfig } from "@/views/projectConfig/src/actionBarConfig";
import { useEventHandler } from "@/hooks";
import type { IPageConfig } from "@/views/projectConfig/src/pageConfig";
import request from "@/utils/request";
import { useCrudOperations } from "@/hooks";

const props = defineProps<{
  tableRef: any;
}>();

const actionBarConfig = defineModel<IActionBarConfig>({ required: true });

const { bindActionBarEvents } = useEventHandler();

const pageDate = inject<any>("pageDate");

const { openAddDialogForm, openEditDialogForm, handleExport } = useCrudOperations();
// 处理特定逻辑的按钮点击事件
const handleButtonClick = (button: any) => {
  const btnType = button.attr.lcBtnType;
  globalThis.setConsole(unref(pageDate), button.attr.label);
  // const pageConfig = unref(pageDate).pageConfig as IPageConfig;
  // // 搜索框数据
  // const search = unref(pageDate).pageConfig?.searchConfig.data;
  // // 分页数据
  // const pagination = unref(pageDate).pageConfig?.pagination;

  // const searchData = { ...search, ...pagination };
  // //表格勾选的数据
  // const selectionRows =
  //   unref(pageDate).baseTableRef.value.LCTableRef.tableRef.store.getSelectionRows();
  // console.log("选中候选项数据", pageDate, searchData, selectionRows, pagination);
  switch (btnType) {
    case 0: // 新建
      openAddDialogForm();
      break;
    case 1: // 编辑
      openEditDialogForm();
      break;
    case 2: //删除
      break;
    case 3: // 批量删除
      break;
    case 4: // 导入
      break;
    case 5: // 导出
      handleExport();
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped></style>
