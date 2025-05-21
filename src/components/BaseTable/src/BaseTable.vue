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
      <!-- v-model="formModel" -->
      <SearchForm v-model="tableConfig.searchConfig" @search="handleSearch" @reset="handleReset" />
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
      <!-- 动态渲染按钮 -->
      <el-button v-for="(button, index) in buttons" :key="index" :type="button.type">
        {{ button.label }}
      </el-button>
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
      <LCTable
        ref="LCTableRef"
        :tableOption="tableConfig"
        v-bind="$attrs"
        @selection-change="handleSelectionChange"
      ></LCTable>
    </div>

    <!-- 分页 -->
    <div
      :class="[
        'module-container',
        'table-pagination',
        ns.is('selected', projectStore.selectedModule === ModuleTypeEnum.PAGINATION),
      ]"
      @click="projectStore.setSelectedModule(ModuleTypeEnum.PAGINATION)"
    >
      <el-pagination
        ref="paginationRef"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import LCTable from "./table.vue";
import type { TableType } from "@/components/BaseTable/index";
import { useNamespace } from "@/hooks/useNamespace";
import SearchForm from "./SearchForm.vue";
import { ISearchConfig } from "@/components/BaseTable/src/table";
import { useProjectStore } from "@/store";
import { ModuleTypeEnum } from "@/views/projectConfig/src/pageConfig";

// 定义按钮配置类型
interface ButtonConfig {
  label: string; // 按钮文本
  type: "primary" | "success" | "warning" | "danger" | "info" | "text"; // 按钮类型
  [key: string]: any; // 其他属性
}

//为了instance中名称一致，都叫tableConfig
const tableConfig = defineModel<any>("tableConfig", { required: true });

const buttons = defineModel<ButtonConfig[]>("buttons", { required: true });
const ns = useNamespace("baseTable");

// 分页相关状态
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示条数
const total = ref(100); // 总条数（根据实际数据动态更新）

// 选中行数据
const selectedRows = ref<any[]>([]);

// 处理表格选中行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchData(); // 重新获取数据
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchData(); // 重新获取数据
};

// 模拟获取数据
const fetchData = () => {
  console.log("获取数据：", {
    page: currentPage.value,
    size: pageSize.value,
  });
  // 在这里调用 API 获取数据，并更新表格和 total
};

const instance = getCurrentInstance();
const paginationRef = useTemplateRef("paginationRef");
const LCTableRef = useTemplateRef("LCTableRef");
provide("baseTable", instance);
defineExpose({
  paginationRef,
  instance,
  LCTableRef,
});

// 表单数据
const formModel = ref({
  // name: "",
  // gender: "",
  // department: "",
  // dateRange: [],
});

// 查询事件
function handleSearch(params: any) {
  console.log("查询参数:", params, formModel);
}

// 重置事件
function handleReset() {
  console.log("表单已重置");
}

const projectStore = useProjectStore();

// const { selectedModule, handleModuleClick, rightPanelContent } = useModuleSelection();
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
  }

  .table-pagination {
    // margin-top: 16px;
    text-align: right;
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
