<!--
 * @fileName: BasicComponent.vue
 * @fileNameCHS:
 * @author: 李嘉鹏
 * @date: 2024-02-07 15:25:40
 * @description:
 * @remark:
!-->
<template>
  <component
    :is="typeof elementOption.comp === 'string' ? comps[elementOption.comp] : elementOption.comp"
    v-model="value"
    v-bind="elementOption?.attr"
    v-on="elementOption?.event || {}"
    :ref="elementOption?.ref"
  >
    <BasicComponent
      v-if="elementOption.children && elementOption.children.length !== 0"
      v-for="(element, i) of elementOption.children"
      :key="i"
      :elementOption="element"
    ></BasicComponent>
    <template v-if="elementOption.content">
      {{ content.toString() }}
    </template>
  </component>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElRate,
  ElInputNumber,
  ElRadioGroup,
  ElRadio,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElUpload,
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElColorPicker,
  ElDatePicker,
  ElOption,
  ElTableColumn,
  ElText,
  ElDescriptions,
  ElDescriptionsItem,
} from "element-plus";

const props = defineProps<{
  elementOption: CompType;
}>();

/**
 * 依据 elementOption 中 data 属性和 key 属性确定渲染组件的响应数据
 * 1.存在key：响应数据是响应数据对象中的某个属性，需传响应对象 data 和属性名 key
 * 2.不存在key：响应数据类型是除对象类型外的所有类型，但该数据必须是由 ref 或 reactive 包裹形成的响应数据
 */
const value =
  props.elementOption.data && props.elementOption.hasOwnProperty("key")
    ? toRef(props.elementOption.data, props.elementOption.key as string)
    : props.elementOption.data;

/**
 * 依据 elementOption 中 content 属性的 text 属性和 key 属性确定渲染组件的渲染文本内容
 * 1.存在key：渲染文本内容是响应数据对象中的某个属性，需传响应对象 data 和属性名 key
 * 2.不存在key：渲染文本内容类型是除对象类型外的所有类型，但该数据必须是由 ref 或 reactive 包裹形成的响应数据
 */
// const content =
//   props.elementOption.content && props.elementOption.content?.hasOwnProperty("key")
//     ? toRef(props.elementOption.content.text, props.elementOption.content.key as string)
//     : props.elementOption.content?.text;
const content = computed(() => {
  if (props.elementOption.content && props.elementOption.content?.hasOwnProperty("key")) {
    return toRef(props.elementOption.content.text, props.elementOption.content.key as string).value;
  }
  return props.elementOption.content?.text;
});

const comps: any = {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElRate,
  ElInputNumber,
  ElRadioGroup,
  ElRadio,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElUpload,
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElColorPicker,
  ElDatePicker,
  ElOption,
  ElTableColumn,
  ElText,
  ElDescriptions,
  ElDescriptionsItem,
};
</script>

<style scoped lang="less"></style>
