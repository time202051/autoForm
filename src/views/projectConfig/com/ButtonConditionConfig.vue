<template>
  <el-form>
    <el-form-item label="条件类型">
      <el-select v-model="conditionType">
        <el-option label="显示" value="show" />
        <el-option label="禁用" value="disable" />
      </el-select>
    </el-form-item>
    <el-form-item label="逻辑关系">
      <el-select v-model="logicRelation">
        <el-option label="且" value="and" />
        <el-option label="或" value="or" />
      </el-select>
    </el-form-item>
    <el-form-item v-for="(condition, index) in conditions" :key="index">
      <el-select v-model="condition.field" placeholder="选择字段">
        <el-option v-for="field in availableFields" :key="field" :label="field" :value="field" />
      </el-select>
      <el-select v-model="condition.operator" placeholder="选择操作符">
        <el-option label="等于" value="eq" />
        <el-option label="不等于" value="neq" />
        <el-option label="大于" value="gt" />
        <el-option label="小于" value="lt" />
        <el-option label="大于等于" value="gte" />
        <el-option label="小于等于" value="lte" />
        <el-option label="包含" value="in" />
        <el-option label="不包含" value="nin" />
      </el-select>
      <el-input v-model="condition.value" placeholder="输入值" />
      <el-button type="danger" @click="removeCondition(index)">删除</el-button>
    </el-form-item>
    <el-button type="primary" @click="addCondition">添加条件</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const conditionType = ref("show");
const logicRelation = ref("and");
const conditions = ref<Array<{ field: string; operator: string; value: string }>>([]);
const availableFields = ref(["field1", "field2", "field3"]); // 这里可以根据实际需求动态获取字段

const addCondition = () => {
  conditions.value.push({ field: "", operator: "", value: "" });
  console.log(44444, conditions);
};

const removeCondition = (index: number) => {
  conditions.value.splice(index, 1);
};
</script>
