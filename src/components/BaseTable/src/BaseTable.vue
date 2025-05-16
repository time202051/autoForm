<template>
  <div :class="ns.b()">
    <!-- 顶部操作按钮 -->
    <div class="table-header">
      <!-- 动态渲染按钮 -->
      <el-button
        v-for="(button, index) in buttons"
        :key="index"
        :type="button.type"
        @click="handleButtonClick(button)"
      >
        {{ button.text }}
      </el-button>
    </div>

    <!-- 表格 -->
    <LCTable
      ref="LCTableRef"
      :tableOption="tableOption"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    ></LCTable>

    <!-- 分页 -->
    <div class="table-pagination">
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
import { ElMessage } from "element-plus";

// 定义按钮配置类型
interface ButtonConfig {
  text: string; // 按钮文本
  type: "primary" | "success" | "warning" | "danger" | "info" | "text"; // 按钮类型
  action: (selectedRows: any[]) => void; // 点击事件逻辑
}

// 定义 props
const props = defineProps<{
  tableOption: TableType;
  buttons?: ButtonConfig[]; // 按钮配置
}>();

const ns = useNamespace("baseTable");

// 分页相关状态
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示条数
const total = ref(100); // 总条数（根据实际数据动态更新）

// 选中行数据
const selectedRows = ref<any[]>([]);

// 处理按钮点击
const handleButtonClick = (button: ButtonConfig) => {
  if (button.action) {
    button.action(selectedRows.value); // 执行自定义逻辑
  } else {
    console.log(`点击了按钮：${button.text}`);
  }
};

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
</script>

<style lang="scss" scoped>
.lc-baseTable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-header {
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
  }

  .table-pagination {
    margin-top: 16px;
    text-align: right;
  }
}
</style>
