<template>
  <el-form label-position="left" label-width="120px">
    <template v-for="item in attrs" :key="item.prop">
      <!-- 渲染父项 -->
      <el-form-item
        v-if="!item.show || (typeof item.show === 'function' ? item.show(modelValue) : item.show)"
      >
        <template #label>
          <el-tooltip :content="item.description" placement="top" effect="light">
            <span>{{ item.label }}</span>
          </el-tooltip>
        </template>
        <!-- 枚举类型：下拉框 -->
        <el-select
          v-if="item.type === 'enum'"
          v-model="modelValue[item.prop]"
          :placeholder="`请选择${item.label}`"
          v-bind="item?.attr"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- 布尔类型：开关 -->
        <el-switch
          v-else-if="item.type === 'boolean'"
          v-model="modelValue[item.prop]"
          v-bind="item?.attr"
        />
        <!-- 字符串类型：输入框 -->
        <el-input
          v-else-if="item.type === 'string'"
          v-model="modelValue[item.prop]"
          :placeholder="`请输入${item.label}`"
          v-bind="item?.attr"
        />
        <el-input-number
          v-else-if="item.type === 'number'"
          v-model="modelValue[item.prop]"
          v-bind="{
            ...item.attr,
            onChange: ($event: number) => item.attr?.onChange(modelValue, $event),
          }"
        />
        <!-- 函数类型：编辑按钮 -->
        <div v-else-if="item.type === 'function'" class="function-editor">
          <el-button type="primary" size="small" @click="openFunctionEditor(item.prop)">
            <el-icon><Edit /></el-icon>
            编辑函数
          </el-button>
        </div>
        <!-- 其他类型：不显示 -->
        <span v-else>暂不支持配置</span>
      </el-form-item>
      <!-- 动态渲染 children -->
      <template v-if="item.children">
        <AttrConfigForm
          v-if="typeof item.children === 'object' && !Array.isArray(item.children)"
          :attrs="item.children[modelValue[item.prop]] || []"
          v-model="modelValue"
        />
        <AttrConfigForm v-else :attrs="item.children" v-model="modelValue" />
      </template>
    </template>
  </el-form>
</template>

<script setup lang="ts">
// import { useVModel } from "@vueuse/core";
import { Edit } from "@element-plus/icons-vue";
import type { IAttrConfig } from "@/views/projectConfig/src/index";

const props = defineProps<{
  attrs: IAttrConfig[]; // 属性配置数据
}>();

const modelValue = defineModel<Record<string, any>>({ required: true });

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
