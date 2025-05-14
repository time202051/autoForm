<template>
  <el-form label-position="left" label-width="120px">
    <el-form-item v-for="attr in attrs" :key="attr.prop">
      <template #label>
        <el-tooltip :content="attr.description" placement="top" effect="light">
          <span>{{ attr.label }}</span>
        </el-tooltip>
      </template>
      <!-- 枚举类型：下拉框 -->
      <el-select
        v-if="attr.type === 'enum'"
        v-model="modelValue[attr.prop]"
        :placeholder="`请选择${attr.label}`"
      >
        <el-option
          v-for="opt in attr.options"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <!-- 布尔类型：开关 -->
      <el-switch v-else-if="attr.type === 'boolean'" v-model="modelValue[attr.prop]" />
      <!-- 字符串类型：输入框 -->
      <el-input
        v-else-if="attr.type === 'string'"
        v-model="modelValue[attr.prop]"
        :placeholder="`请输入${attr.label}`"
      />
      <!-- 函数类型：编辑按钮 -->
      <div v-else-if="attr.type === 'function'" class="function-editor">
        <el-button type="primary" size="small" @click="openFunctionEditor(attr.prop)">
          <el-icon><Edit /></el-icon>
          编辑函数
        </el-button>
      </div>
      <!-- 其他类型：不显示 -->
      <span v-else>暂不支持配置</span>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { Edit } from "@element-plus/icons-vue";
import type { TableAttrConfig } from "@/views/projectConfig/src/pageConfig.ts"; // 引入类型定义

const props = defineProps<{
  attrs: TableAttrConfig[]; // 属性配置数据
  modelValue: any; // 双向绑定的值
}>();

const emit = defineEmits(["update:modelValue"]);

// 使用 useVModel 实现双向绑定
const modelValue = useVModel(props, "modelValue", emit);

// 打开函数编辑器
const openFunctionEditor = (prop: string) => {
  console.log("编辑函数:", prop);
  // 在这里实现函数编辑逻辑，例如打开弹框
};
</script>

<style scoped lang="scss">
.function-editor {
  display: flex;
  justify-content: flex-start;
}
</style>
