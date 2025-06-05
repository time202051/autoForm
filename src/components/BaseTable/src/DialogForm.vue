<template>
  <div :class="ns.b()">
    <EBuilder v-if="pageSchema" ref="ebForm" :pageSchema="pageSchema" />
    <div class="dialog-footer">
      <el-button @click="dialogFormData.visible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button type="success" @click="eDesignerHandler">编辑页面</el-button>
    </div>
  </div>

  <el-dialog
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
  </el-dialog>
</template>

<script setup lang="ts">
import type { IDialogFormData } from "@/hooks/useCrudOperations";
import { useNamespace } from "@/hooks";
import { EBuilder, EDesigner } from "epic-designer";
import type { PageSchema } from "epic-designer";
import { useTemplateRef } from "vue";
import type { IPageDate } from "@/views/projectConfig/index";
import { useCrudOperations } from "@/hooks";

const props = withDefaults(
  defineProps<{
    dialogFormData: IDialogFormData;
  }>(),
  {
    dialogFormData: () => {
      return {
        type: 1, //0详情，1新建 2编辑
        visible: false,
        title: "新建",
        formData: {}, // 表单数据
      };
    },
  }
);

const pageSchema = reactive<PageSchema>({ schemas: [] });
const defaultSchema = ref();
const eDesignerDialogVisible = ref(false);
const ns = useNamespace("dialogForm");

const eDesignerHandler = () => {
  eDesignerDialogVisible.value = true;
};

const saveFormHandler = (e: PageSchema) => {
  pageSchema.schemas = e.schemas;
  defaultSchema.value = e;
  eDesignerDialogVisible.value = false;
};

const ebForm = useTemplateRef("ebForm");
const pageDate = inject<IPageDate>("pageDate");
const { handleCreate, handleEdit } = useCrudOperations();
//表单提交
const onSubmit = async () => {
  const res = await unref(ebForm)?.validate();
  globalThis.setConsole(res, "表单数据");
  if (props.dialogFormData.type == 0) {
  } else if (props.dialogFormData.type == 1) {
    handleCreate(res || {});
  } else if (props.dialogFormData.type == 2) {
    handleEdit(res || {});
  }
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
}
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
