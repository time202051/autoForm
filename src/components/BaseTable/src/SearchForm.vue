<template>
  <div class="search-form__container">
    <el-form
      :model="searchConfig.data"
      :label-width="searchConfig.attr?.labelWidth || '100px'"
      class="search-form"
      @submit.prevent
      v-bind="{ ...searchConfig.attr }"
    >
      <!-- 表单项区域 -->
      <el-row :gutter="searchConfig.attr?.gutter || 16" align="middle">
        <template v-for="(item, idx) in visibleConfig" :key="item.attr?.prop">
          <el-col :span="spanValue" class="search-form__col">
            <!-- :label="item.label" :prop="item.prop" -->
            <el-form-item v-bind="item.attr">
              <!-- 输入框 -->
              <el-input
                v-if="item.attr?.lcType == SearchTypeEnum.INPUT"
                v-model="searchConfig.data[item.attr?.prop]"
                clearable
                v-bind="{ placeholder: item.attr?.placeholder || '请输入', ...item.attr }"
              />
              <!-- 本地下拉 -->
              <el-select
                v-else-if="item.attr?.lcType == SearchTypeEnum.LOCALSELECT"
                v-model="searchConfig.data[item.attr?.prop]"
                clearable
                v-bind="{ placeholder: item.attr?.placeholder || '请选择', ...item.attr }"
              >
                <el-option
                  v-for="opt in item.attr?.lcOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <!-- 远程下拉 -->
              <el-select
                v-else-if="item.attr?.lcType == SearchTypeEnum.REMOTESELECT"
                v-model="searchConfig.data[item.attr?.prop]"
                :remote-method="(q: any) => handleRemoteSearch(item, q)"
                :loading="!remoteOptionsMap[item.attr?.prop]"
                clearable
                filterable
                v-bind="{
                  remote: true,
                  placeholder: item.attr?.placeholder || '请选择',
                  ...item.attr,
                }"
              >
                <el-option
                  v-for="opt in remoteOptionsMap[item.attr?.prop] || []"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <!-- 日期选择器 -->

              <el-date-picker
                v-else-if="item.attr?.lcType == SearchTypeEnum.DATE"
                v-model="searchConfig.data[item.attr?.prop]"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                style="width: 100%"
                v-bind="{
                  placeholder: item.attr?.placeholder || '请选择日期时间范围',
                  ...item.attr,
                }"
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
import type { ISearchConfig } from "./table";
import type { TableType } from "@/components/BaseTable/index";
import { SearchTypeEnum } from "@/views/projectConfig/src/index";
import { LcSearchPropNnum } from "@/views/projectConfig/src/index";
import { useEventHandler } from "@/hooks";
import { ComponentInternalInstance } from "vue";

const props = withDefaults(
  defineProps<{
    collapsed?: boolean;
  }>(),
  {
    collapsed: true, // 默认折叠
  }
);

const searchConfig = defineModel<Record<string, any>>({ required: true });
globalThis.setConsole(searchConfig, "searchConfig");

const columnArr = computed(() => unref(searchConfig)?.columnArr || []);
console.log("运行态数据", searchConfig, columnArr);

const emit = defineEmits(["search", "reset"]);

const collapsed = ref(props.collapsed);
const rowCount = computed(() => unref(searchConfig).attr?.rowCount || 4);
// const labelWidth = props.labelWidth;

//搜索框宽度自适应宽度
const searchWidth = computed(() => {
  if (unref(searchConfig).attr?.autoSearchWidth) return "100%";
  return unref(searchConfig).attr?.searchWidth
    ? `${unref(searchConfig).attr?.searchWidth}px`
    : "200px";
});

// 动态计算 span 值
const spanValue = computed(() => 24 / unref(rowCount));

// 远程下拉数据缓存
const remoteOptionsMap = reactive<Record<string, any[]>>({});

// 只显示部分项
const visibleConfig = computed(() => {
  return collapsed.value ? unref(columnArr).slice(0, unref(rowCount)) : unref(columnArr);
});
const {} = useEventHandler();
const instance = inject("baseTable") as ComponentInternalInstance;

// 远程下拉请求
const fetchRemoteOptions = async (item: any, query = "") => {
  // query是输入框的值,可以做远程的模糊查询,后面有接口再加

  try {
    // 获取请求参数
    if (item.customEvent && LcSearchPropNnum.LCREMOTEPARAMS in item.customEvent) {
      const func = item.customEvent[LcSearchPropNnum.LCREMOTEPARAMS];
      if (typeof func === "function") {
        try {
          // 入参
          const params = await func({ instance }); // 确保 this 绑定
          globalThis.setConsole(params, "remoteParams");
          // 接口
          const url =
            item.attr[LcSearchPropNnum.LCREMOTEURL] || "https://jsonplaceholder.typicode.com/posts";
          const method = item.attr[LcSearchPropNnum.LCMETHOD];
          //后期替换接口
          fetch(url, {
            method,
            body: JSON.stringify([
              {
                value: "111",
                label: "张三",
              },
              {
                value: "222",
                label: "李四",
              },
              {
                value: "333",
                label: "王五",
              },
            ]),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(8888, data);
              remoteOptionsMap[item.attr?.prop] = [
                {
                  value: "111",
                  label: "张三",
                },
                {
                  value: "222",
                  label: "李四",
                },
                {
                  value: "333",
                  label: "王五",
                },
              ];
            })
            .catch(() => {
              remoteOptionsMap[item.attr?.prop] = [];
            });
        } catch (error) {
          console.error("函数执行出错:", error);
        }
      } else {
        console.error("item.customEvent[LcSearchPropNnum.LCREMOTEPARAMS] 不是函数");
      }
    } else {
      console.error("item.customEvent 或 LcSearchPropNnum.LCREMOTEPARAMS 未定义");
    }
  } catch (e) {
    ElMessage.error("远程下拉数据获取失败");
    remoteOptionsMap[item.attr?.prop] = [];
  }
};

// 远程下拉输入时触发
function handleRemoteSearch(item: any, query: string) {
  fetchRemoteOptions(item, query);
}

// 初始化远程下拉
unref(columnArr).forEach((item: any) => {
  if (item.attr?.lcType === SearchTypeEnum.REMOTESELECT) {
    fetchRemoteOptions(item as any);
  }
});

function onSearch() {
  emit("search", unref(searchConfig));
}
function onReset() {
  // 放到hook统一处理
  // Object.keys(unref(searchConfig).data).forEach(
  //   (key: string) => (unref(searchConfig).data[key] = undefined)
  // );
  emit("reset");
}
function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

// 事件处理
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

// 实现搜索框自定义宽度
:deep(.el-input) {
  width: v-bind(searchWidth) !important;
}
:deep(.el-date-editor) {
  width: v-bind(searchWidth) !important;
}
:deep(.el-select) {
  width: v-bind(searchWidth) !important;
}
// :deep(.el-form-item__content) {
//   // flex: none;
// }
</style>
