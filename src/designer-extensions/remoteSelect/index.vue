<template>
  <el-select
    v-model="modelValue"
    :remote-method="(q: any) => handleRemoteSearch(q)"
    clearable
    filterable
    v-bind="{
      remote: true,
      ...componentSchema.componentProps,
    }"
  >
    <el-option
      v-for="opt in componentSchema.componentProps.options || []"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";
const props = defineProps({
  componentSchema: {
    default: () => ({}),
    type: Object,
  },
});
watch(
  () => props.componentSchema,
  () => {
    console.log(props.componentSchema);
  },
  {
    immediate: true,
    deep: true,
  }
);
const modelValue = defineModel({ required: true });

// 远程下拉输入时触发
function handleRemoteSearch(query: string) {
  fetchRemoteOptions(query);
}

// 远程下拉请求
const fetchRemoteOptions = async (query = "") => {
  console.log(111111190, query);

  // query是输入框的值,可以做远程的模糊查询,后面有接口再加
  // const params = await func({ instance }); // 确保 this 绑定
  // globalThis.setConsole(params, "remoteParams");
  // 接口
  const url =
    props.componentSchema?.componentProps.lcremoteurl ||
    "https://jsonplaceholder.typicode.com/posts";
  const method = props.componentSchema.componentProps.lcmethod || "POST";
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
      props.componentSchema.componentProps.options = [
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
      // remoteOptionsMap[item.attr?.prop] = [];
    });
};
</script>
