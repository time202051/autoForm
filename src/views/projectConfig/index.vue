<template>
  <div :class="ns.b()">
    <!-- 左侧内容 -->
    <div class="left-content">
      <!-- <EDesigner /> -->
      <el-button type="primary" @click="showFormConfig">Primary</el-button>
    </div>
    <!-- 右侧面板 -->
    <div class="right-panel" v-show="isPanelOpen">
      <div class="panel-content">右侧面板内容</div>
    </div>

    <!-- 按钮 -->
    <el-button
      class="toggle-button"
      :style="{ left: isPanelOpen ? 'calc(100% - 400px - 40px)' : 'calc(100% - 40px)' }"
      @click="togglePanel"
    >
      {{ isPanelOpen ? "隐藏" : "显示" }}
    </el-button>
    <Teleport to="body">
      <div v-if="dialogVisible" class="modal">
        <EDesigner title="表单配置" @save="saveFormHandler">
          <template #header-prefix>
            <div class="modal-header-prefix"></div>
          </template>
          <template #header-right-suffix>
            <el-icon class="ml3" @click="dialogVisible = false"><Close /></el-icon>
          </template>
        </EDesigner>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useNamespace } from "@/hooks";
import { ref } from "vue";
import { EDesigner, type PageSchema } from "epic-designer";
import { Close } from "@element-plus/icons-vue";

const ns = useNamespace("projectConfig");

const isPanelOpen = ref(true); // 控制面板展开状态

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value; // 切换面板状态
};
const dialogVisible = ref(false);

const showFormConfig = () => {
  dialogVisible.value = true;
};

const saveFormHandler = (e: PageSchema) => {
  dialogVisible.value = false;
  console.log("888", e);
};
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
  // border: 1px solid #d9d9d9;
}

.right-panel {
  width: 400px; /* 面板宽度固定为 300px */
  height: 100%; /* 面板高度占满整个视口 */
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.panel-content {
  width: 100%; /* 面板内容宽度占满面板 */
  padding: 16px;
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

.modal {
  position: fixed;
  z-index: 999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 90vh;
}
</style>
