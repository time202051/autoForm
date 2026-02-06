<template>
  <div :class="ns.b()">
    <!-- 左侧内容 -->
    <div class="left-content">
      <BaseTable
        v-if="mainType == 0"
        v-model:tableConfig="tableOption"
        ref="baseTableRef"
      ></BaseTable>
      <DialogForm v-else-if="mainType == 1"></DialogForm>
      <!-- <div v-else-if="mainType == 1">form表单配置页面</div> -->
    </div>
    <!-- 右侧面板 -->
    <div class="right-panel">
      <el-scrollbar height="100%">
        <PageConfig v-model="tableOption"></PageConfig>
      </el-scrollbar>
    </div>

    <!-- <el-dialog
      v-model="eDesignerDialogVisible"
      fullscreen
      :show-close="false"
      class="eDesignerDialog"
      append-to-body
    >
      <EDesigner
        v-if="eDesignerDialogVisible"
        title="表单配置"
        :defaultSchema
        :formMode="false"
        @save="saveFormHandler"
      >
        <template #header-prefix>
          <div class="modal-header-prefix"></div>
        </template>
        <template #header-right-suffix>
          <el-icon class="ml3" @click="eDesignerDialogVisible = false"><Close /></el-icon>
        </template>
      </EDesigner>
    </el-dialog> -->

    <!-- <Teleport to="body">
      <div v-if="eDesignerDialogVisible" class="modal">
        <EDesigner title="表单配置" @save="saveFormHandler">
          <template #header-prefix>
            <div class="modal-header-prefix"></div>
          </template>
          <template #header-right-suffix>
            <el-icon class="ml3" @click="eDesignerDialogVisible = false"><Close /></el-icon>
          </template>
        </EDesigner>
      </div>
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
import { useNamespace } from "@/hooks";
import { ref, useTemplateRef } from "vue";
import { Close } from "@element-plus/icons-vue";
import BaseTable from "@/components/BaseTable/src/BaseTable.vue";
import type { TableType } from "@/components/BaseTable/index";
import PageConfig from "./src/PageConfig.vue";
import { defaultTableAttr, defaultColumnAttr } from "@/views/projectConfig/src/tableConfig";
import { cloneDeep } from "lodash-es";
import { useProjectCache } from "@/hooks";
import {
  defaultSearchAttrs,
  defaultSearchColumnAttrs,
} from "@/views/projectConfig/src/searchConfig";
import type { IPageConfig } from "@/views/projectConfig/src/pageConfig";
import type { IPageDate } from "@/views/projectConfig/index";
import DialogForm from "@/components/BaseTable/src/DialogForm.vue";
import { useSettingsStore } from "@/store";
import { storeToRefs } from "pinia";

const { getPageData } = useProjectCache();

const settingsStore = useSettingsStore();
const { mainType } = storeToRefs(settingsStore);

const ns = useNamespace("projectConfig");

const loading = ref(false);
const tableOption = reactive<IPageConfig>({
  data: [
    {
      id: "1",
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
      children: [
        { id: "1-1", date: "2016-05-03", name: "Tom", address: "No. 189, Grove St, Los Angeles" },
        { id: "1-2", date: "2016-05-03", name: "Tom", address: "No. 189, Grove St, Los Angeles" },
      ],
    },
    {
      id: "2",
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      id: "3",
      date: "2016-05-04",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
    {
      id: "4",
      date: "2016-05-01",
      name: "Tom",
      address: "No. 189, Grove St, Los Angelesfegrwerw",
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
            type: "primary",
            link: true,
          },
          content: {
            text: "编辑",
          },
          event: {},
          eventConfigs: {},
        },
        {
          comp: "ElButton",
          attr: {
            type: "danger",
            link: true,
          },
          content: {
            text: "删除",
          },
          event: {},
          eventConfigs: {},
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
  searchConfig: {
    data: {}, //双向绑定的值
    attr: cloneDeep(defaultSearchAttrs),
    columnArr: [
      {
        attr: {
          label: "文本",
          prop: "text",
          ...cloneDeep(defaultSearchColumnAttrs),
        },
        //这些event可以用于当前搜索框组件的事件
        event: {},
        eventConfigs: {},
        // 自定义事件, 页面中特定的函数
        customEvent: {},
        customEventConfigs: {},
      },
      {
        attr: {
          label: "文本1",
          prop: "text1",
          ...cloneDeep(defaultSearchColumnAttrs),
        },
        event: {},
        eventConfigs: {},

        // 自定义事件, 页面中特定的函数
        customEvent: {},
        customEventConfigs: {},
      },
      // {
      //   attr: {
      //     prop: "gender",
      //     label: "性别",
      //     type: "local-select",
      //     options: [
      //       { label: "男", value: "male" },
      //       { label: "女", value: "female" },
      //     ],
      //   },
      //   event: {},
      //   eventConfigs: {},
      // },
      // {
      //   attr: {
      //     prop: "department",
      //     label: "部门",
      //     type: "remote-select",
      //     apiUrl: "/api/departments",
      //     labelField: "name",
      //     valueField: "id",
      //   },
      //   event: {},
      //   eventConfigs: {},
      // },
      // {
      //   attr: {
      //     prop: "dateRange",
      //     label: "日期范围",
      //     type: "date",
      //     placeholder: "请选择日期范围",
      //   },
      //   event: {},
      //   eventConfigs: {},
      // },
      // {
      //   attr: { prop: "name", label: "姓名", type: "input", placeholder: "请输入姓名" },
      //   event: {},
      //   eventConfigs: {},
      // },
      // {
      //   attr: { prop: "name1", label: "姓名", type: "input", placeholder: "请输入姓名" },
      //   event: {},
      //   eventConfigs: {},
      // },
    ],
    event: {},
    eventConfigs: {},
  },
  actionBarConfig: {
    attr: {},
    columnArr: [
      {
        attr: {
          label: "自定义按钮",
          type: "primary",
        },
        //这些event可以用于当前搜索框组件的事件
        event: {},
        eventConfigs: {},
        // 自定义事件, 页面中特定的函数
        customEvent: {},
        customEventConfigs: {},
      },
    ],
    data: {},
    event: {},
    eventConfigs: {},
  },
  pagination: {
    currentPage: 1,
    pageSize: 20,
    total: 100,
  },
});

const baseTableRef = useTemplateRef("baseTableRef");
provide<IPageDate>("pageDate", {
  pageConfig: tableOption,
  baseTableRef,
});
const init = async () => {
  const data = await getPageData();
  if (data) {
    Object.keys(tableOption).forEach((key) => {
      tableOption[key] = data[key];
    });
    console.log("indexDB获取并更新数据", data, tableOption);
  }
};
init();
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
</style>
