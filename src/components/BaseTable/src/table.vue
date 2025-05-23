<!--
 * @fileName: table.vue
 * @fileNameCHS: 表格
 * @author: 李嘉鹏
 * @date: 2024-03-01 11:35:50
 * @description:
 * @remark:
!-->
<template>
  <!-- :ref="tableOption.ref" -->
  <el-table
    v-loading="loading"
    :data="data"
    ref="tableRef"
    v-bind="tableOption.attr"
    v-on="bindEvents"
    :class="[ns.b()]"
  >
    <!-- v-on="tableOption.event || {}" -->
    <!-- 不attr.type切换时候不生效可能得重新加载 -->

    <el-table-column
      v-for="(tableColumn, index) of tableOption.columnArr"
      :key="setKey(index, tableColumn.attr?.label)"
      v-bind="tableColumn.attr"
    >
      <template #header v-if="tableColumn.headerSlotName || tableColumn.headerSlotConfig">
        <BasicComponent
          v-if="tableColumn.headerSlotConfig"
          :elementOption="tableColumn.headerSlotConfig"
        />
        <slot v-if="tableColumn.headerSlotName" :name="tableColumn.headerSlotName"></slot>
      </template>

      <template
        #default="scope"
        v-if="tableColumn.defaultSlotName || tableColumn.defaultSlotConfig"
      >
        <BasicComponent
          :elementOption="defaultSlotConfigHandle(tableColumn.defaultSlotConfig as CompType)"
          v-if="tableColumn.defaultSlotConfig && typeof tableColumn.defaultSlotConfig === 'object'"
          v-model="scope.row[tableColumn.attr?.prop]"
          v-on="bindEventsHandler(scope, tableColumn.defaultSlotConfig as CompType) || {}"
        />
        <template
          v-if="tableColumn.defaultSlotConfig && Array.isArray(tableColumn.defaultSlotConfig)"
        >
          <template v-for="(config, index) in tableColumn.defaultSlotConfig" :key="index">
            <BasicComponent
              :elementOption="defaultSlotConfigHandle(config as CompType)"
              v-on="
                bindEventsHandler(scope, tableColumn.defaultSlotConfig[index] as CompType) || {}
              "
            />
            <!-- <BasicComponent :elementOption="config" /> -->
            <!-- v-model:elementOption="tableColumn.defaultSlotConfig[index]" -->
          </template>
        </template>

        <slot
          v-if="tableColumn.defaultSlotName"
          :name="tableColumn.defaultSlotName"
          :currentCellData="scope"
        ></slot>
      </template>
    </el-table-column>
    <template #append>
      <BasicComponent
        v-if="tableOption.appendSlotConfig"
        :elementOption="tableOption.appendSlotConfig"
      />
      <slot v-else name="tableAppend"></slot>
    </template>
    <template #empty>
      <BasicComponent
        v-if="tableOption.emptySlotConfig"
        :elementOption="tableOption.emptySlotConfig"
      />
      <slot v-else name="tableEmpty"></slot>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import type { TableType } from "@/components/BaseTable/index";
import { ref, useTemplateRef } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import BasicComponent from "./BasicComponent.vue";
import { useNamespace } from "@/hooks/useNamespace";
import { useVModel } from "@vueuse/core";
import { useEventHandler } from "@/hooks";
import { ComponentInternalInstance } from "vue";

const ns = useNamespace("table");
const props = defineProps<{
  tableOption: TableType | any;
}>();

// const emit = defineEmits(["update:tableOption"]);

// const tableOption = useVModel(props, "tableOption", emit);

// onBeforeMount(() => {
//   if (props.tableOption.loading) {
//     loading.value = props.tableOption.loading.value;
//   }
// });

const data = computed({
  get: () => props.tableOption.data,
  set: (value) => {
    props.tableOption.data = value;
  },
});
// watch(
//   () => props.tableOption,
//   (n) => {
//     console.log("表格参数变化", n);
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );

// const data: any = ref([]);
// watch(
//   () => props.tableOption.data,
//   () => {
//     data.value = props.tableOption.data;
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );

const loading = ref(false);
// watch(
//   () => props.tableOption.loading,
//   () => {
//     if (props.tableOption.loading) {
//       loading.value = props.tableOption.loading.value;
//     }
//   },
//   { deep: true }
// );

/**
 * 设置表格列的 key 值
 * @param index { number } 表单项或表单项子组件的在数组的位置
 * @param label { string } 表单项的 prop 值或 子组件的 label 值
 * @return string 对应表格列的 key 值
 */
const setKey = (index: number, label: string | undefined) => {
  if (typeof label === "undefined") {
    return index;
  } else {
    return index + label;
  }
};
/**
 * 处理defaultSlotConfig的事件对象
 * @param currentCellData { Object } 当前行数据对象
 * @param events { Object } 当前列的事件对象
 * @return Object 事件对象
 */
const eventHandle = function (currentCellData: any, config: any) {
  if (!config.event) return;
  const eventObj: any = {};
  Object.keys(config.event).forEach((event) => {
    eventObj[event] = function () {
      config.event[event](currentCellData, ...arguments);
    };
  });
  return eventObj;
};

/**
 * 处理defaultSlotConfig
 * @param config { Object } 当前列的配置对象
 * @return Object 除去事件对象的当前列配置对象
 */
const defaultSlotConfigHandle = function (config: CompType) {
  const { comp, data, key, attr, content, children, ref, event, eventConfigs } = config;
  return {
    comp,
    data,
    key,
    attr,
    content,
    children,
    ref,
    event,
    eventConfigs,
  };
};

const instance = getCurrentInstance();
const tableRef = useTemplateRef("tableRef");
const baseTableInstance = inject("baseTable") as ComponentInternalInstance;
defineExpose({
  tableRef,
  instance,
});
const { bindEvents, bindEventsHandler } = useEventHandler(
  props.tableOption,
  baseTableInstance
);
// const bindEvents = computed(() => {
//   if (!props.tableOption.event) return {};
//   const events: any = {};
//   Object.entries(props.tableOption.event).forEach(([key, fn]: any) => {
//     events[key] = (...args: any) => {
//       try {
//         return fn({
//           args,
//           instance: baseTableInstance,
//         });
//       } catch (error: any) {
//         console.error(`事件 ${key} 执行出错:`, error);
//         ElMessage.error(`事件执行出错: ${error?.message}`);
//       }
//     };
//   });
//   return events;
// });
// const bindEventsHandler = (scope: any, config: any) => {
//   if (!config.event) return {};
//   const events: any = {};
//   Object.entries(config.event).forEach(([key, fn]: any) => {
//     events[key] = ($event: any, ...args: any) => {
//       try {
//         // 防止冒泡
//         $event.stopPropagation();
//         if (!args) args = [$event];
//         return fn({
//           args,
//           scope,
//           instance: baseTableInstance,
//         });
//       } catch (error: any) {
//         console.error(`事件 ${key} 执行出错:`, error);
//         ElMessage.error(`事件执行出错: ${error?.message}`);
//       }
//     };
//   });
//   return events;
// };
</script>

<style scoped lang="less"></style>

<!-- const tableOption = reactive<TableType>({
  data: [
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles"
    },
    {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles"
    },
    {
      date: "2016-05-04",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles"
    },
    {
      date: "2016-05-01",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles"
    }
  ],
  loading: loading,
  attr: {
    border: true
  },
  columnArr: [
    {
      attr: {
        prop: "name",
        label: "姓名"
      }
    },
    {
      attr: {
        prop: "date",
        label: "日期"
      }
    },
    {
      attr: {
        prop: "address",
        label: "地址"
      }
    },
    {
      attr: {
        label: "操作"
      },
      defaultSlotConfig: [
        {
          comp: "ElButton",
          attr: {
            type: "danger"
          },
          content: {
            text: "编辑"
          },
          event: {
            click: (e: any) => {
              e.row.name = "张三";
              console.log("点击了", e);
            }
          }
        },
        {
          comp: "ElButton",
          attr: {
            type: "danger"
          },
          content: {
            text: "删除"
          },
          event: {
            click: (e: any) => {
              console.log("点击了", e);
              tableOption.data.splice(e.$index, 1);
              console.log("tableOption", tableOption);
            }
          }
        }
      ]
    }
    // {
    //   defaultSlotConfig: [
    //     {
    //       comp: "ElTableColumn",
    //       attr: {
    //         prop: "name",
    //         label: "姓名"
    //       }
    //     },
    //     {
    //       comp: "ElTableColumn",
    //       attr: {
    //         prop: "date",
    //         label: "日期"
    //       }
    //     },
    //     {
    //       comp: "ElTableColumn",
    //       attr: {
    //         prop: "address",
    //         label: "地址"
    //       }
    //     }
    //     // {
    //     //   comp: "ElButton",
    //     //   attr: {
    //     //     type: "danger"
    //     //   }
    //     // }
    //   ]
    // },
    // {
    //   defaultSlotConfig: {
    //     comp: "ElTableColumn",
    //     attr: {
    //       label: "操作"
    //     },
    //     children: [
    //       {
    //         comp: "ElButton",
    //         attr: {
    //           type: "danger",
    //           onClick: (e: any) => {
    //             console.log("被点击了", e);
    //           }
    //         },
    //         content: {
    //           text: "按钮"
    //         }
    //       }
    //     ]
    //   }
    // }
  ]
}); -->
