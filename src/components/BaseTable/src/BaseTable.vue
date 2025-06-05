<template>
  <div :class="ns.b()">
    <!-- 搜索框 -->
    <div
      :class="[
        'module-container',
        ns.is('selected', projectStore.selectedModule === ModuleTypeEnum.SEARCH),
      ]"
      @click="projectStore.setSelectedModule(ModuleTypeEnum.SEARCH)"
    >
      <SearchForm v-model="tableConfig.searchConfig!" @search="handleSearch" @reset="handleReset" />
    </div>
    <!-- 顶部操作按钮 actionBar-->
    <div
      :class="[
        'module-container',
        'table-header',
        ns.is('selected', projectStore.selectedModule === ModuleTypeEnum.ACTIONBAR),
      ]"
      @click="projectStore.setSelectedModule(ModuleTypeEnum.ACTIONBAR)"
    >
      <ActionBar v-model="tableConfig.actionBarConfig!" :tableRef="LCTableRef"></ActionBar>
    </div>

    <!-- 表格 -->
    <div
      :class="[
        'module-container',
        'table-container',
        ns.is('selected', projectStore.selectedModule === ModuleTypeEnum.TABLE),
      ]"
      @click="projectStore.setSelectedModule(ModuleTypeEnum.TABLE)"
    >
      <LCTable ref="LCTableRef" :tableOption="tableConfig" v-bind="$attrs"></LCTable>
    </div>

    <!-- 分页 不需要配置-->
    <div
      :class="['module-container', 'table-pagination']"
      @click="projectStore.setSelectedModule(ModuleTypeEnum.PAGINATION)"
    >
      <!-- ns.is('selected', projectStore.selectedModule === ModuleTypeEnum.PAGINATION), -->
      <el-pagination
        ref="paginationRef"
        v-model:current-page="tableConfig.pagination.currentPage"
        v-model:page-size="tableConfig.pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="tableConfig.pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
    <el-dialog
      v-model="dialogFormData.visible"
      :title="dialogFormData.title"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      draggable
    >
      <DialogForm v-if="dialogFormData.visible" :dialogFormData></DialogForm>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, getCurrentInstance, provide } from "vue";
import LCTable from "./table.vue";
import type { TableType } from "@/components/BaseTable/index";
import { useNamespace } from "@/hooks/useNamespace";
import SearchForm from "./SearchForm.vue";
import { ISearchConfig } from "@/components/BaseTable/src/table";
import { useProjectStore } from "@/store";
import { ModuleTypeEnum } from "@/views/projectConfig/src/pageConfig";
import ActionBar from "@/components/BaseTable/src/ActionBar.vue";
import { useCrudOperations } from "@/hooks";
import type { IPageConfig } from "@/views/projectConfig/src/pageConfig";
import DialogForm from "@/components/BaseTable/src/DialogForm.vue";
// 为了 instance 中名称一致，都叫 tableConfig
const tableConfig = defineModel<IPageConfig>("tableConfig", { required: true });

const ns = useNamespace("baseTable");
const { dialogFormData, handleSearch, handleReset, handleSizeChange, handlePageChange } =
  useCrudOperations();

// 初始化分页数据
if (!tableConfig.value.pagination) {
  tableConfig.value.pagination = {
    currentPage: 1, // 当前页码
    pageSize: 20, // 每页显示条数
    total: 100, // 总条数（根据实际数据动态更新）
  };
}

const instance = getCurrentInstance();
const paginationRef = useTemplateRef("paginationRef");
const LCTableRef = useTemplateRef("LCTableRef");
provide("baseTable", instance);
defineExpose({
  paginationRef,
  instance,
  LCTableRef,
});

const projectStore = useProjectStore();
</script>

<style lang="scss" scoped>
.lc-baseTable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-header {
    display: flex;
  }
  .table-container {
    flex: 1;
    overflow: auto;
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
// ====
.module-container {
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 4px;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
  cursor: pointer;
}

.is-selected {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.right-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>
