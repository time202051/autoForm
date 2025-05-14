<template>
  <div :class="ns.b()">
    <!-- 左侧内容 -->
    <div class="left-content">
      <BaseTable :tableOption></BaseTable>
    </div>
    <!-- 右侧面板 -->
    <div class="right-panel" v-show="isPanelOpen">
      <el-scrollbar height="100%">
        <!-- 直接修改相同数据源，无需保存 -->
        <PageConfig v-model="tableOption"></PageConfig>
      </el-scrollbar>
    </div>
    <Teleport to="body">
      <div v-if="dialogVisible" class="modal">
        <EDesigner title="表单配置" @save="saveFormHandler">
          <template #header-prefix>
            <div class="modal-header-prefix"></div>
          </template>
          <template #header-right-suffix>
            <el-icon class="ml3" @click="dialogVisible = false"><Close /></el-icon>
          </template>
        </EDesigner>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useNamespace } from "@/hooks";
import { ref } from "vue";
import { EDesigner, type PageSchema } from "epic-designer";
import { Close } from "@element-plus/icons-vue";
import BaseTable from "@/components/BaseTable/src/BaseTable.vue";
import type { TableType } from "@/components/BaseTable/index";
// import TableConfig from "./src/TableConfig.vue";
import PageConfig from "./src/PageConfig.vue";
import { defaultTableAttr, defaultColumnAttr } from "@/views/projectConfig/src/pageConfig";
import { cloneDeep } from "lodash-es";

const ns = useNamespace("projectConfig");

const isPanelOpen = ref(true); // 控制面板展开状态

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value; // 切换面板状态
};
const dialogVisible = ref(false);

const showFormConfig = () => {
  dialogVisible.value = true;
};

const loading = ref(false);
const tableOption = reactive<TableType | any>({
  data: [
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-04",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      date: "2016-05-01",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
  ],
  loading: loading,
  attr: cloneDeep(defaultTableAttr),
  columnArr: [
    {
      attr: {
        type: "index",
        label: "#",
      },
    },
    {
      attr: {
        type: "selection",
      },
    },
    {
      attr: {
        ...cloneDeep(defaultColumnAttr),
        prop: "name",
        label: "姓名",
      },
    },
    {
      attr: {
        ...cloneDeep(defaultColumnAttr),
        prop: "date",
        label: "日期",
      },
    },
    {
      attr: {
        ...cloneDeep(defaultColumnAttr),
        prop: "address",
        label: "地址",
      },
    },
    {
      attr: {
        ...cloneDeep(defaultColumnAttr),
        label: "操作",
      },
      defaultSlotConfig: [
        {
          comp: "ElButton",
          attr: {
            type: "danger",
          },
          content: {
            text: "编辑",
          },
          event: {
            click: (e: any) => {
              e.row.name = "张三";
              console.log("点击了", e);
              dialogVisible.value = true;
            },
          },
        },
        {
          comp: "ElButton",
          attr: {
            type: "danger",
          },
          content: {
            text: "删除",
          },
          event: {
            click: (e: any) => {
              console.log("点击了", e);
              tableOption.data.splice(e.$index, 1);
              console.log("tableOption", tableOption);
            },
          },
        },
      ],
    },
    // {
    //   defaultSlotConfig: [
    //     {
    //       comp: "ElTableColumn",
    //       attr: {
    //         prop: "name",
    //         label: "姓名",
    //       },
    //     },
    //     {
    //       comp: "ElTableColumn",
    //       attr: {
    //         prop: "date",
    //         label: "日期",
    //       },
    //     },
    //     {
    //       comp: "ElTableColumn",
    //       attr: {
    //         prop: "address",
    //         label: "地址",
    //       },
    //     },
    //     // {
    //     //   comp: "ElButton",
    //     //   attr: {
    //     //     type: "danger"
    //     //   }
    //     // }
    //   ],
    // },
    // {
    //   defaultSlotConfig: {
    //     comp: "ElTableColumn",
    //     attr: {
    //       label: "操作",
    //     },
    //     children: [
    //       {
    //         comp: "ElButton",
    //         attr: {
    //           type: "danger",
    //           onClick: (e: any) => {
    //             console.log("被点击了", e);
    //           },
    //         },
    //         content: {
    //           text: "按钮",
    //         },
    //       },
    //     ],
    //   },
    // },
  ],
  event: {},
  eventConfigs: {},
});

const saveFormHandler = (e: PageSchema) => {
  dialogVisible.value = false;
  console.log("888", e);
};

// const onSave = (data: any) => {
//   console.log(33, data);
//   const { tableConfig } = data;
//   Object.keys(tableConfig).forEach((key) => {
//     tableOption[key] = tableConfig[key];
//   });
//   // tableOption.attr = tableConfig.attr;
//   // tableOption.columnArr = tableConfig.columnArr;
// };
</script>

<style lang="scss" scoped>
.lc-projectConfig {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  position: relative; /* 确保按钮相对于容器定位 */
  gap: 10px;
}

.left-content {
  flex: 1; /* 左侧占据剩余空间 */
  padding: 16px;
  // background-color: map-get($bg-color, "page");
  border: 1px solid #d9d9d9;
  overflow: hidden;
}

.right-panel {
  width: 400px; /* 面板宽度固定为 300px */
  height: 100%; /* 面板高度占满整个视口 */
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  padding: 10px 0 10px 10px;
  box-sizing: border-box;
}
:deep(.el-scrollbar__wrap) {
  padding-right: 10px;
}

.toggle-button {
  position: absolute; /* 绝对定位 */
  top: 8%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中 */
  width: 40px; /* 按钮宽度 */
  height: 40px; /* 按钮高度 */
  padding: 0; /* 去除内边距 */
  z-index: 1000; /* 确保按钮在最上层 */
}

.modal {
  position: fixed;
  z-index: 999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
}
</style>
