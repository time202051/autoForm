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
          v-bind="{
            ...item.attr,
            onChange: (...args: any[]) =>
              item.attr?.onChange({
                attrs,
                modelValue,
                args,
              }),
          }"
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
        <!-- 数组类型：数组配置 -->
        <div v-else-if="item.type === 'array'" class="array-editor">
          <div class="array-items">
            <div
              v-for="(arrayItem, index) in modelValue[item.prop]"
              :key="index"
              class="array-item"
            >
              <div class="array-item-content">
                <span
                  v-for="(key, idx) in getArrayKeys(item.prop)"
                  :key="idx"
                  class="array-item-field"
                >
                  <span class="array-item-label">{{ key }}:</span>
                  <span class="array-item-value">{{ arrayItem[key] }}</span>
                </span>
              </div>
              <div class="array-item-actions">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="openEditDialog(item.prop, index)"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="deleteArrayItem(item.prop, index)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
          <el-button type="primary" size="small" @click="addArrayItem(item.prop)">
            <el-icon><Plus /></el-icon>
            添加项
          </el-button>
        </div>

        <div v-else-if="item.type === 'editor'" class="object-editor">
          <el-button type="primary" size="small" @click="codeMirrorOpen(item.prop)">
            <el-icon><Plus /></el-icon>
            参数编辑
          </el-button>
        </div>
        <!-- 其他类型：不显示 -->
        <span v-else>暂不支持配置</span>
      </el-form-item>
      <!-- 动态渲染 children -->
      <template v-if="item.children">
        <!-- 不推荐对象 -->
        <AttrConfigForm
          v-if="typeof item.children === 'object' && !Array.isArray(item.children)"
          :attrs="item.children[modelValue[item.prop]] || []"
          v-model="modelValue"
          v-model:event="event"
          v-model:eventConfigs="eventConfigs"
        />
        <!--  推荐数组 -->
        <AttrConfigForm
          v-else
          :attrs="item.children"
          v-model="modelValue"
          v-model:event="event"
          v-model:eventConfigs="eventConfigs"
        />
      </template>
    </template>
  </el-form>

  <!-- 编辑数组项的弹框 -->
  <el-dialog v-model="editDialogVisible" title="编辑数组项" width="350px">
    <el-form :model="currentEditItem" label-width="80px">
      <el-form-item v-for="(key, index) in Object.keys(currentEditItem)" :key="index" :label="key">
        <el-input v-model="currentEditItem[key]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>

  <!-- 代码编辑器弹框 -->
  <CodeMirrorEditor
    v-if="codeMirrorVisible"
    v-model="codeMirrorVisible"
    v-model:event="event"
    v-model:eventConfigs="eventConfigs"
    :eventName="eventNameCodeMirror"
    @save="codeMirrorClose"
  ></CodeMirrorEditor>
</template>

<script setup lang="ts">
import { Edit, Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { IAttrConfig } from "@/views/projectConfig/src/index";
import CodeMirrorEditor from "@/views/projectConfig/com/CodeMirrorEditor.vue";
import { LcSearchPropNnum } from "@/views/projectConfig/src/index";
const props = defineProps<{
  attrs: IAttrConfig[]; // 属性配置数据
}>();

const modelValue = defineModel<Record<string, any>>({ required: true });
//事件,非必填 (可以是eventConfigs,也可是customEventConfigs)
const eventConfigs = defineModel<Record<string, any>>("eventConfigs", {
  required: false,
  default: {},
});
//事件,非必填 (可以是event,也可是customEvent)
const event = defineModel<Record<string, any>>("event", { required: false, default: {} });

// 编辑弹框的显示状态
const editDialogVisible = ref(false);
// 当前编辑的数组项
const currentEditItem = ref<Record<string, any>>({});
// 当前编辑的数组项所属的 prop
const currentEditProp = ref<string>("");
// 当前编辑的数组项的索引
const currentEditIndex = ref<number>(-1);

// 打开函数编辑器
const openFunctionEditor = (prop: string) => {
  console.log("编辑函数:", prop);
  // 在这里实现函数编辑逻辑，例如打开弹框
};

// 添加数组项
const addArrayItem = (prop: string) => {
  if (!modelValue.value[prop]) {
    modelValue.value[prop] = [];
  }
  const newValue = { label: "", value: "" };
  modelValue.value[prop].push(newValue);
  openEditDialog(prop, modelValue.value[prop].length - 1); // 打开新添加的项
};

// 打开编辑弹框
const openEditDialog = (prop: string, index: number) => {
  currentEditProp.value = prop;
  currentEditIndex.value = index;
  currentEditItem.value = { ...modelValue.value[prop][index] }; // 深拷贝当前项
  editDialogVisible.value = true;
};

// 保存编辑
const saveEdit = () => {
  // 检查 value 是否唯一
  const isValueUnique = !modelValue.value[currentEditProp.value].some(
    (item: any, index: number) =>
      item.value === currentEditItem.value.value && index !== currentEditIndex.value
  );

  if (!isValueUnique) {
    ElMessage.warning("value 值不能重复，请修改后重试");
    return;
  }

  modelValue.value[currentEditProp.value][currentEditIndex.value] = currentEditItem.value;
  editDialogVisible.value = false;
};

// 删除数组项
const deleteArrayItem = (prop: string, index: number) => {
  modelValue.value[prop].splice(index, 1);
};

// 获取数组项的键名
const getArrayKeys = (prop: string) => {
  const array = modelValue.value[prop];
  if (!array || array.length === 0) {
    return []; // 如果数组为空，返回空数组
  }
  return Object.keys(array[0]); // 返回第一个对象的键名
};

//代码编辑器弹框
const codeMirrorVisible = ref(false);
const eventNameCodeMirror = ref<string>(""); //事件名称

const codeMirrorOpen = (key: string) => {
  codeMirrorVisible.value = true;
  eventNameCodeMirror.value = key;
};
const codeMirrorClose = () => {
  codeMirrorVisible.value = false;
  eventNameCodeMirror.value = "";
};
</script>

<style scoped lang="scss">
.function-editor {
  display: flex;
  justify-content: flex-start;
}
.array-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%; // 确保宽度占满父容器
  max-width: 238px; // 限制最大宽度为 238px
}

.array-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.array-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.array-item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.array-item-field {
  display: flex;
  gap: 4px;
}

.array-item-label {
  font-weight: bold;
  color: #606266;
}

.array-item-value {
  color: #909399;
}

.array-item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
</style>
