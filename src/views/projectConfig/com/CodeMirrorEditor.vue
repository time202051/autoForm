<template>
  <Teleport to="body">
    <!-- dialog会影响内部代码编辑器的样式，才通过这种方式手撸弹框，支持拖拽缩放 -->
    <div v-if="dialogVisible" class="editor-overlay"></div>
    <div
      v-if="dialogVisible"
      ref="editor"
      class="editor-container"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        width: size.width + 'px',
        height: size.height + 'px',
      }"
    >
      <div
        class="editor-header"
        @mousedown="startDrag"
        :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
      >
        <div class="left-space"></div>
        <div class="dialog-title">事件编辑【{{ eventName }}】</div>
        <el-icon class="close-icon" @click="closeEditor">
          <Close />
        </el-icon>
      </div>
      <div class="editor-body">
        <Codemirror
          ref="cmComponentRef"
          v-model:value="codeMirrorCurrentObject.eventConfigs[eventName]"
          :options="cmOptions"
          border
          height="100%"
          width="100%"
        ></Codemirror>
        <!-- @change="(val: string, cm: Editor) => handleContentChange(currentEvent.value, val, cm)" -->
      </div>
      <div class="editor-footer">
        <el-button @click="closeEditor">取消</el-button>
        <el-button type="primary" @click="saveEditor">确定</el-button>
      </div>
      <!-- 拖拽调整大小的边框 -->
      <div class="resize-handle resize-handle-e" @mousedown.stop="(e) => startResize('e', e)"></div>
      <div class="resize-handle resize-handle-s" @mousedown.stop="(e) => startResize('s', e)"></div>
      <div
        class="resize-handle resize-handle-se"
        @mousedown.stop="(e) => startResize('se', e)"
      ></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useResizable } from "@/hooks";
import { useTemplateRef } from "vue";
import type { Editor, EditorConfiguration } from "codemirror";
import { eventHandler } from "@/utils/eventHandler";
import { cloneDeep } from "lodash";

const props = withDefaults(
  defineProps<{
    eventName: string;
    text?: string;
    codeMirrorCurrentObject: any;
  }>(),
  {
    codeMirrorCurrentObject: () => {
      return {};
    },
    eventName: "click",
    text: "事件编辑",
  }
);
const initialCode = ref<string>(
  cloneDeep(props.codeMirrorCurrentObject?.eventConfigs?.[props.eventName]) || undefined
);

// 计算属性：判断代码是否被修改
const isModified = computed(() => {
  return props.codeMirrorCurrentObject?.eventConfigs?.[props.eventName] !== initialCode.value;
});

const dialogVisible = defineModel({ required: true });
const editor = useTemplateRef("editor");
const cmComponentRef = useTemplateRef<any>("cmComponentRef");
const cmOptions: EditorConfiguration = {
  mode: "text/javascript",
  autofocus: !unref(initialCode),
};

const { position, size, isDragging, startDrag, startResize, cleanup, recalculatePosition } =
  useResizable(editor, { width: 800, height: 800 }, { minWidth: 400, minHeight: 300 });

// 监听对话框显示状态
watch(
  () => dialogVisible.value,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        recalculatePosition();
      });
    }
  },
  {
    immediate: true,
  }
);
// 组件卸载时清理
onUnmounted(() => {
  cleanup();
});

// 关闭编辑器
const closeEditor = async () => {
  if (unref(isModified)) {
    await ElMessageBox.confirm("代码未保存，是否继续关闭？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  }
  props.codeMirrorCurrentObject.eventConfigs[props.eventName] = unref(initialCode);
  // 用户确认关闭
  dialogVisible.value = false;
};

const emit = defineEmits(["save"]);
const saveEditor = () => {
  dialogVisible.value = false;
  if (!unref(isModified)) return;
  const codeVal = cmComponentRef?.value.cminstance.getValue();
  if (!codeVal) {
    delete props.codeMirrorCurrentObject.eventConfigs[props.eventName];
    delete props.codeMirrorCurrentObject.event[props.eventName];
    return;
  }
  ElMessage({
    message: "代码编辑成功",
    type: "success",
  });
  // 行按钮有scope，表格事件都是这里注册
  props.codeMirrorCurrentObject.event[props.eventName] = ({ args, scope, instance }: any) => {
    const context = {
      args,
      eventName: props.eventName,
      eventConfigs: props.codeMirrorCurrentObject.eventConfigs,
      instance,
    };
    if (scope) Object.assign(context, { scope });
    eventHandler(context);
  };

  emit("save", {
    eventName: props.eventName,
    codeMirrorCurrentObject: props.codeMirrorCurrentObject,
    codeVal: cmComponentRef?.value.cminstance.getValue(),
  });
};
</script>

<style lang="scss" scoped>
// 添加遮罩层样式
.editor-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999; // 确保在编辑器容器之下
}
.editor-container {
  position: fixed;
  z-index: 2000;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: var(--el-bg-color-overlay);
    border-bottom: 1px solid #e4e7ed;
    border-radius: 4px 4px 0 0;
    user-select: none; /* 防止拖拽时选中文字 */
  }
  .editor-body {
    flex: 1;
    padding: 10px;
  }
  .editor-footer {
    padding: 5px 15px 15px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-space {
    width: 20px;
  }

  .dialog-title {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .close-icon {
    font-size: 20px;
    color: #909399;
    cursor: pointer;
    transition: all 0.3s;
  }

  .close-icon:hover {
    color: #303133;
  }

  /* 确保编辑器填充剩余空间 */
  // :deep(.CodeMirror) {
  //   height: calc(100% - 50px) !important; /* 减去header高度 */
  // }

  /* 拖拽时添加一些视觉反馈 */
  .editor-header:active {
    cursor: grabbing;
  }

  /* 防止文本选择 */
  .editor-header * {
    user-select: none;
  }
  .resize-handle {
    position: absolute;
    background: transparent;

    &-e {
      top: 0;
      right: -5px;
      width: 10px;
      height: 100%;
      cursor: e-resize;
    }

    &-s {
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 10px;
      cursor: s-resize;
    }

    &-se {
      bottom: -5px;
      right: -5px;
      width: 10px;
      height: 10px;
      cursor: se-resize;
    }
  }
}
</style>
