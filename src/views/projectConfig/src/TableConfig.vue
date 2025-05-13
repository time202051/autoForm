<template>
  <div>
    <PageConfig @save="onSave"></PageConfig>
    <!-- 组件选择器 -->
    <el-select v-model="selectedComponent" placeholder="选择组件">
      <el-option
        v-for="component in components"
        :key="component"
        :label="component"
        :value="component"
      />
    </el-select>

    <!-- 动态配置表单 -->
    <div v-if="selectedComponent">
      <el-collapse v-model="activeCollapse">
        <!-- 属性配置 -->
        <el-collapse-item title="属性配置" name="props">
          <el-form :model="config" label-width="100px" label-position="left">
            <el-form-item
              v-for="(prop, key) in componentMetadata[selectedComponent].props"
              :key="key"
              :label="prop.label"
            >
              <!-- 正常就输入框，下拉框框，开关boolean -->
              <el-input
                v-if="prop.type === 'string' && !prop.options"
                v-model="config.props[key]"
              />
              <el-select
                v-else-if="prop.type === 'string' && prop.options"
                v-model="config.props[key]"
              >
                <el-option
                  v-for="option in prop.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-switch v-else-if="prop.type === 'boolean'" v-model="config.props[key]" />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 事件配置 -->
        <el-collapse-item title="事件配置" name="events">
          <el-form :model="config" label-width="120px" label-position="left">
            <el-form-item
              v-for="(event, key) in componentMetadata[selectedComponent].events"
              :key="key"
              :label="event.label"
            >
              <el-input v-model="config.events[key]" />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 插槽配置 -->
        <el-collapse-item title="插槽配置" name="slots">
          <el-form :model="config" label-width="120px" label-position="left">
            <el-form-item
              v-for="(slot, key) in componentMetadata[selectedComponent].slots"
              :key="key"
              :label="slot.label"
            >
              <el-input v-model="config.slots[key]" />
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>

      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { ComponentMetadataMap, ComponentConfig } from "./tableConfig";
import PageConfig from "./PageConfig.vue";
import { cloneDeep } from "lodash";

// 支持的组件列表
const components: string[] = ["ElInput", "ElSelect"];
const emit = defineEmits(["save"]);

enum FormPropKey {
  KeyValue = "keyValue", // 字段名
  Type = "type", // 类型
  Placeholder = "placeholder", // 占位符
  Disabled = "disabled", // 是否禁用
  Clearable = "clearable", // 是否可清空
  Maxlength = "maxlength", // 最大长度
  Multiple = "multiple", // 是否多选
  Filterable = "filterable", // 是否可过滤
}

// 组件元数据
const componentMetadata: ComponentMetadataMap = {
  ElInput: {
    props: {
      [FormPropKey.KeyValue]: {
        label: "字段名",
        type: "string",
      },
      [FormPropKey.Type]: {
        type: "string",
        options: [
          { label: "文本", value: "text" },
          { label: "密码", value: "password" },
          { label: "数字", value: "number" },
        ],
        label: "类型",
      },
      [FormPropKey.Placeholder]: { type: "string", label: "占位符" },
      [FormPropKey.Disabled]: { type: "boolean", label: "是否禁用" },
      [FormPropKey.Clearable]: { type: "boolean", label: "是否可清空" },
      [FormPropKey.Maxlength]: { type: "number", label: "最大长度" },
    },
    events: {
      input: { description: "输入时触发", label: "输入事件" },
      change: { description: "值改变时触发", label: "值改变事件" },
      focus: { description: "获取焦点时触发", label: "获取焦点事件" },
      blur: { description: "失去焦点时触发", label: "失去焦点事件" },
    },
    slots: {
      prefix: { description: "输入框前置内容", label: "前置插槽" },
      suffix: { description: "输入框后置内容", label: "后置插槽" },
      prepend: { description: "输入框前置内容", label: "前置内容插槽" },
      append: { description: "输入框后置内容", label: "后置内容插槽" },
    },
  },
  ElSelect: {
    props: {
      [FormPropKey.KeyValue]: {
        label: "字段名",
        type: "string",
      },
      [FormPropKey.Multiple]: { type: "boolean", label: "是否多选" },
      [FormPropKey.Disabled]: { type: "boolean", label: "是否禁用" },
      [FormPropKey.Placeholder]: { type: "string", label: "占位符" },
      [FormPropKey.Clearable]: { type: "boolean", label: "是否可清空" },
      [FormPropKey.Filterable]: { type: "boolean", label: "是否可过滤" },
    },
    events: {
      change: { description: "值改变时触发", label: "值改变事件" },
      visibleChange: { description: "下拉框显示/隐藏时触发", label: "下拉框显示/隐藏事件" },
      removeTag: { description: "多选模式下移除标签时触发", label: "移除标签事件" },
    },
    slots: {
      default: { description: "选项内容", label: "默认插槽" },
      prefix: { description: "选择框前置内容", label: "前置插槽" },
      empty: { description: "无选项时的内容", label: "空状态插槽" },
    },
  },
};

// 当前选择的组件
const selectedComponent = ref<string>("");

// 组件配置（使用 reactive）
const config: ComponentConfig = reactive({
  props: {},
  events: {},
  slots: {},
});

// 当前展开的折叠项
const activeCollapse = ref<string[]>(["props", "events", "slots"]);

// 监听组件选择变化，重置配置
watch(selectedComponent, (newVal: string) => {
  config.props = {};
  config.events = {};
  config.slots = {};
});

const onSave = (data: any) => {
  emit("save", {
    tableConfig: data,
  });
};
// 提交表单
const onSubmit = () => {
  console.log("用户输入的配置：", config);
};
</script>

<style scoped lang="scss">
:deep(.el-collapse) {
  --el-fill-color-blank: rgba(0, 0, 0, 0) !important;
}
.preview {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
