<template>
  <el-card ref="cardRef" class="collapsible-card">
    <!-- 关闭按钮 -->
    <el-icon class="close-button" @click="handleClose">
      <Close />
    </el-icon>
    <!-- 头部插槽 -->
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <!-- 内容区域，根据高度控制显示 -->
    <div
      ref="contentRef"
      class="card-content"
      :style="{ maxHeight: isExpanded ? 'none' : `${height}px`, overflow: 'hidden' }"
    >
      <slot></slot>
    </div>
    <!-- 更多按钮 -->
    <div v-if="isOverflow" class="more-button" @click="toggleExpand">
      <el-button type="primary" link>
        {{ isExpanded ? "收起" : "更多" }}
        <el-icon :class="['arrow-icon', { 'rotate-180': isExpanded }]">
          <ArrowDown />
        </el-icon>
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { ArrowDown, Close } from "@element-plus/icons-vue"; // 引入关闭图标
import { useElementSize } from "@vueuse/core"; // 引入 useElementSize

const props = withDefaults(
  defineProps<{
    height?: number; // 外部传入的高度
  }>(),
  {
    height: 150, // 默认高度为 150px
  }
);

const isExpanded = ref(false); // 是否展开
const isOverflow = ref(false); // 是否内容超出高度
const contentRef = ref<HTMLElement | null>(null); // 内容区域的引用

// 使用 useElementSize 监听内容区域的大小变化
const { height: contentHeight } = useElementSize(contentRef);

// 检测内容是否超出高度
const checkOverflow = () => {
  if (contentRef.value) {
    return contentRef.value.scrollHeight > props.height;
  }
  return false;
};

// 更新 isOverflow 状态
const updateOverflow = () => {
  isOverflow.value = checkOverflow();
};

// 在组件挂载后检测内容是否超出高度
onMounted(() => {
  nextTick(() => {
    updateOverflow();
  });
});

// 监听内容区域的高度变化
watch(contentHeight, () => {
  updateOverflow();
});

// 切换展开/折叠
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 关闭按钮点击事件
const emit = defineEmits(["close"]);
const handleClose = () => {
  emit("close");
};
</script>

<style scoped lang="scss">
.collapsible-card {
  margin-bottom: 16px;
  border-radius: 8px; // 圆角
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); // 阴影
  transition: box-shadow 0.3s ease; // 阴影过渡效果
  position: relative; // 相对定位

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2); // 悬停时阴影加深
  }

  .close-button {
    position: absolute; // 绝对定位
    top: 10px; // 距离顶部 10px
    right: 10px; // 距离右侧 10px
    cursor: pointer; // 鼠标指针样式
    font-size: 16px; // 图标大小
    color: #909399; // 图标颜色
    transition: color 0.3s ease; // 颜色过渡效果

    &:hover {
      color: #303133; // 悬停时颜色加深
    }
  }

  .card-header {
    padding: 10px;
    border-bottom: 1px solid #ebeef5; // 头部底部边框
  }

  .card-content {
    padding: 10px;
    transition: max-height 0.5s ease; // 延长过渡时间
    overflow: hidden; // 确保内容隐藏
  }

  .more-button {
    text-align: center;
    margin-top: 8px;
    margin-bottom: 8px;

    .el-button {
      width: 100%; // 按钮宽度
      border-radius: 4px; // 按钮圆角
      font-size: 14px; // 字体大小
      transition:
        background-color 0.3s ease,
        color 0.3s ease; // 按钮过渡效果

      .arrow-icon {
        margin-left: 8px; // 图标与文字的间距
        transition: transform 0.3s ease; // 图标旋转过渡效果
      }

      .rotate-180 {
        transform: rotate(180deg); // 旋转 180 度
      }
    }
  }
}

:deep(.el-card__body) {
  padding: 0px !important;
}
</style>
