// src/hooks/useResizable.ts
import { ref, Ref } from 'vue';

interface ResizableOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export function useResizable(
  elementRef: Ref<HTMLElement | null>,
  initialSize: Size,
  options: ResizableOptions = {}
) {
  const size = ref<Size>(initialSize);

  // 计算居中位置
  const calculateCenterPosition = (): Position => {
    if (!elementRef.value) return { x: 0, y: 0 };

    const element = elementRef.value;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    return {
      x: Math.max(0, Math.min(
        (windowWidth - elementWidth) / 2,
        windowWidth - elementWidth
      )),
      y: Math.max(0, Math.min(
        (windowHeight - elementHeight) / 2,
        windowHeight - elementHeight
      ))
    };
  };

  const position = ref<Position>(calculateCenterPosition());
  const isDragging = ref(false);
  const isResizing = ref(false);
  const dragOffset = ref({ x: 0, y: 0 });
  const resizeDirection = ref('');
  const resizeStartPos = ref({ x: 0, y: 0 });
  const resizeStartSize = ref({ width: 0, height: 0 });

  // 开始拖拽
  const startDrag = (e: MouseEvent) => {
    isDragging.value = true;
    dragOffset.value = {
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  // 处理拖拽
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.value || !elementRef.value) return;

    const newX = e.clientX - dragOffset.value.x;
    const newY = e.clientY - dragOffset.value.y;

    position.value = {
      x: Math.max(0, Math.min(newX, window.innerWidth - elementRef.value.offsetWidth)),
      y: Math.max(0, Math.min(newY, window.innerHeight - elementRef.value.offsetHeight))
    };
  };

  // 停止拖拽
  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  // 开始调整大小
  const startResize = (direction: string, e: MouseEvent) => {
    isResizing.value = true;
    resizeDirection.value = direction;
    resizeStartPos.value = {
      x: e.clientX,
      y: e.clientY
    };
    resizeStartSize.value = {
      width: size.value.width,
      height: size.value.height
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  // 处理调整大小
  const handleResize = (e: MouseEvent) => {
    if (!isResizing.value || !elementRef.value) return;

    const deltaX = e.clientX - resizeStartPos.value.x;
    const deltaY = e.clientY - resizeStartPos.value.y;

    if (resizeDirection.value.includes('e')) {
      const newWidth = Math.min(
        Math.max(
          resizeStartSize.value.width + deltaX,
          options.minWidth || 400
        ),
        window.innerWidth - position.value.x
      );
      size.value.width = newWidth;
    }

    if (resizeDirection.value.includes('s')) {
      const newHeight = Math.min(
        Math.max(
          resizeStartSize.value.height + deltaY,
          options.minHeight || 300
        ),
        window.innerHeight - position.value.y
      );
      size.value.height = newHeight;
    }
  };

  // 停止调整大小
  const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // 窗口大小变化处理
  const handleWindowResize = () => {
    if (!elementRef.value) return;
    position.value = calculateCenterPosition();
  };

  window.addEventListener('resize', handleWindowResize);

  // 清理
  const cleanup = () => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    window.removeEventListener('resize', handleWindowResize);
  };

  return {
    position,
    size,
    isDragging,
    isResizing,
    startDrag,
    startResize,
    cleanup,
    recalculatePosition: () => {
      position.value = calculateCenterPosition();
    }
  };
}



// const { position, size, isDragging, startDrag, startResize, cleanup, recalculatePosition } =
//   useResizable(editor, { width: 800, height: 800 }, { minWidth: 400, minHeight: 300 });

// // 监听对话框显示状态
// watch(
//   () => dialogVisible.value,
//   (newVal) => {
//     if (newVal) {
//       nextTick(() => {
//         recalculatePosition();
//       });
//     }
//   },
//   {
//     immediate: true,
//   }
// );
// // 组件卸载时清理
// onUnmounted(() => {
//   cleanup();
// });
