<template>
  <div class="search-form__container">
    <el-form :model="formModel" :label-width="labelWidth" class="search-form" @submit.prevent>
      <!-- 表单项区域 -->
      <el-row :gutter="16" align="middle">
        <template v-for="(item, idx) in visibleConfig" :key="item.prop">
          <el-col :span="spanValue" class="search-form__col">
            <el-form-item :label="item.label" :prop="item.id">
              <!-- 输入框 -->
              <el-input
                v-if="item.type === 'input'"
                v-model="formModel[item.prop]"
                :placeholder="item.placeholder || '请输入'"
                clearable
              />
              <!-- 本地下拉 -->
              <el-select
                v-else-if="item.type === 'local-select'"
                v-model="formModel[item.prop]"
                :placeholder="item.placeholder || '请选择'"
                clearable
              >
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <!-- 远程下拉 -->
              <el-select
                v-else-if="item.type === 'remote-select'"
                v-model="formModel[item.prop]"
                filterable
                remote
                :remote-method="(q: any) => handleRemoteSearch(item, q)"
                :loading="!remoteOptionsMap[item.prop]"
                :placeholder="item.placeholder || '请选择'"
                clearable
              >
                <el-option
                  v-for="opt in remoteOptionsMap[item.prop] || []"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <!-- 日期选择器 -->
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="formModel[item.prop]"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :placeholder="item.placeholder || '请选择日期时间范围'"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="search-form__btns">
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" link @click="toggleCollapse">
        <span v-if="collapsed">展开</span>
        <span v-else>折叠</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import type { ISearchConfig, RemoteSelectConfig } from "./table";
import type { TableType } from "@/components/BaseTable/index";

const props = withDefaults(
  defineProps<{
    tableOption: TableType;
    collapsed?: boolean;
    labelWidth?: string;
    rowCount?: number;
  }>(),
  {
    tableOption: () => {
      return {};
    },
    collapsed: true, // 默认折叠
    labelWidth: "100px", // 默认 label 宽度
    rowCount: 4, // 默认每行显示 4 个表单项
  }
);

const searchConfig = ref<ISearchConfig[]>([
  {
    prop: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
  },
  {
    prop: "gender",
    label: "性别",
    type: "local-select",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
  },
  {
    prop: "department",
    label: "部门",
    type: "remote-select",
    apiUrl: "/api/departments",
    labelField: "name",
    valueField: "id",
  },
  {
    prop: "dateRange",
    label: "日期范围",
    type: "date",
    placeholder: "请选择日期范围",
  },
  {
    prop: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
  },
  {
    prop: "name1",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
  },
]);

const emit = defineEmits(["search", "reset"]);

const collapsed = ref(props.collapsed);
const rowCount = props.rowCount;
const labelWidth = props.labelWidth;

// 动态计算 span 值
const spanValue = computed(() => 24 / rowCount);

const formModel = defineModel<Record<string, any>>({ required: true });

// 远程下拉数据缓存
const remoteOptionsMap = reactive<Record<string, any[]>>({});

// 只显示部分项
const visibleConfig = computed(() =>
  collapsed.value ? unref(searchConfig).slice(0, rowCount) : unref(searchConfig)
);

// 远程下拉请求
async function fetchRemoteOptions(item: RemoteSelectConfig, query = "") {
  try {
    let params = { ...item.queryParams };
    if (query) params.keyword = query;
    const url = item.apiUrl;
    const res = await fetch(url + (query ? `?keyword=${encodeURIComponent(query)}` : ""), {
      method: "GET",
    });
    const data = await res.json();
    // 兼容labelField/valueField
    const labelKey = item.labelField || "label";
    const valueKey = item.valueField || "value";
    remoteOptionsMap[item.prop] = (data?.data || data).map((d: any) => ({
      label: d[labelKey],
      value: d[valueKey],
    }));
  } catch (e) {
    ElMessage.error("远程下拉数据获取失败");
    remoteOptionsMap[item.prop] = [];
  }
}

// 远程下拉输入时触发
function handleRemoteSearch(item: RemoteSelectConfig, query: string) {
  fetchRemoteOptions(item, query);
}

// 初始化远程下拉
unref(searchConfig).forEach((item: any) => {
  if (item.type === "remote-select") {
    fetchRemoteOptions(item as RemoteSelectConfig);
  }
});

function onSearch() {
  emit("search", unref(formModel));
}
function onReset() {
  Object.keys(unref(formModel)).forEach((key: string) => (unref(formModel)[key] = undefined));
  emit("reset");
}
function toggleCollapse() {
  collapsed.value = !collapsed.value;
}
</script>

<style lang="scss" scoped>
.search-form__container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.search-form__btns {
  display: flex;
  padding-top: 12px;
}
.search-form {
  padding: 12px 16px 0 16px;
  background: #fff;
  flex: 1;
  .el-form-item {
    margin-bottom: 16px;
  }
  .search-form__col {
    min-width: 240px;
    max-width: 100%;
    box-sizing: border-box;
  }
  .search-form__actions-row {
    margin-top: 0;
    margin-bottom: 8px;
    .el-button + .el-button {
      margin-left: 8px;
    }
  }
}
// :deep(.el-input) {
//   width: 300px !important;
// }
// :deep(.el-date-editor) {
//   width: 300px !important;
// }
</style>
