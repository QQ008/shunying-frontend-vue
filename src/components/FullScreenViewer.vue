<template>
    <!-- 滑动切换图片组件 -->
  <div class="fullscreen-viewer" @click="closeViewer">
    <div
      class="viewer-content"
      ref="viewerContent"
      @click.stop
    >
      <div
        class="slides-container"
        ref="slidesContainer"
        :style="{ transform: `translateX(${-currentIndex * 100}%)`, opacity: verticalSwipeProgress ? 1 - Math.abs(verticalSwipeProgress) : 1 }"
      >
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="slide"
        >
          <div
            class="zoom-container"
            :ref="el => { if(el) zoomContainers[index] = el as HTMLElement }"
            @touchstart="onZoomTouchStart($event, index)"
            @touchmove="onZoomTouchMove($event, index)"
            @touchend="onZoomTouchEnd($event, index)"
            @click.stop="onSlideClick($event, index)"
            @dblclick.stop="onDoubleTap($event, index, true)"
          >
            <img :src="photo.highResUrl || photo.url || ''" :alt="`照片 ${index + 1}`">
          </div>
        </div>
      </div>

      <div class="pagination">
        <span>{{ currentIndex + 1 }} / {{ photos.length }}</span>
      </div>

      <button class="close-btn" @click.stop="closeViewer">
        <i class="icon close"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';

interface Photo {
  id?: number | string;
  url: string | null;
  highResUrl?: string | null;
  description?: string;
  location?: string;
  date?: string;
  [key: string]: unknown;
}

interface FullScreenViewerProps {
  photos: Photo[];
  currentIndex: number;
}

const props = defineProps<FullScreenViewerProps>();

const emit = defineEmits<{
  'close': [];
  'change': [index: number];
}>();

// 引用元素
const viewerContent = ref<HTMLDivElement | null>(null);
const slidesContainer = ref<HTMLDivElement | null>(null);
const zoomContainers = ref<HTMLElement[]>([]);

// 状态变量
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchDeltaX = ref(0);
const touchDeltaY = ref(0); // 添加Y轴移动距离
const isDragging = ref(false);
const isVerticalSwiping = ref(false); // 是否正在垂直滑动
const verticalSwipeProgress = ref<number | null>(null); // 垂直滑动进度，用于调整透明度
const slideWidth = ref(0);
const slideHeight = ref(0); // 添加高度变量
const initialTransform = ref('');
const lastTapTime = ref(0); // 上次点击时间，用于检测双击
const doubleTapDetected = ref(false); // 检测到双击
const lastTapX = ref(0); // 上次点击的X坐标，用于检测双击位置
const lastTapY = ref(0); // 上次点击的Y坐标，用于检测双击位置
const isMobile = ref(false); // 是否是移动设备

// 缩放相关变量
const zoomScales = ref<number[]>([]); // 每个slide的缩放比例
const zoomOffsetX = ref<number[]>([]); // X方向偏移
const zoomOffsetY = ref<number[]>([]); // Y方向偏移
const zoomStartDistance = ref(0); // 双指触摸起始距离
const zoomStartScale = ref(1); // 开始缩放时的比例
const isZooming = ref(false); // 是否正在缩放
const zoomStartX = ref(0); // 缩放开始的X坐标
const zoomStartY = ref(0); // 缩放开始的Y坐标

// 初始化缩放数据
const initZoomData = (): void => {
  zoomScales.value = Array(props.photos.length).fill(1);
  zoomOffsetX.value = Array(props.photos.length).fill(0);
  zoomOffsetY.value = Array(props.photos.length).fill(0);
};

// 检测是否为移动设备
const checkIfMobile = (): void => {
  isMobile.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// 缩放功能
const onZoomTouchStart = (e: TouchEvent, index: number): void => {
  // 记录触摸起始位置
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  touchDeltaY.value = 0;
  verticalSwipeProgress.value = null;
  isVerticalSwiping.value = false;

  if (e.touches.length === 2) {
    // 双指触摸，开始缩放
    isZooming.value = true;

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    // 计算两指之间的距离
    zoomStartDistance.value = getDistance(
      touch1.clientX, touch1.clientY,
      touch2.clientX, touch2.clientY
    );

    zoomStartScale.value = zoomScales.value[index];

    e.preventDefault(); // 防止页面缩放
  } else if (e.touches.length === 1) {
    // 移动设备上的双击检测
    const now = new Date().getTime();
    const DOUBLE_TAP_DELAY = 300; // 300ms内的两次点击视为双击
    const DOUBLE_TAP_DISTANCE = 20; // 两次点击在20px范围内视为相同位置

    const dx = touchStartX.value - lastTapX.value;
    const dy = touchStartY.value - lastTapY.value;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (now - lastTapTime.value < DOUBLE_TAP_DELAY && distance < DOUBLE_TAP_DISTANCE) {
      // 这是双击，在相近位置
      doubleTapDetected.value = true;
      // 使用自定义的双击处理函数
      handleDoubleTap(e, index);
      lastTapTime.value = 0;
      e.preventDefault();
      return;
    }

    // 记录这次点击的时间和位置
    lastTapTime.value = now;
    lastTapX.value = touchStartX.value;
    lastTapY.value = touchStartY.value;
    doubleTapDetected.value = false;

    // 单指触摸，准备移动已缩放的图片或开始滑动切换
    if (zoomScales.value[index] > 1) {
      // 图片已缩放，准备移动图片
      zoomStartX.value = e.touches[0].clientX;
      zoomStartY.value = e.touches[0].clientY;
    } else {
      // 图片未缩放，准备滑动切换
      isDragging.value = true;

      if (slidesContainer.value) {
        initialTransform.value = getComputedStyle(slidesContainer.value).transform;
        slidesContainer.value.style.transition = 'none';
      }
    }
  }
};

const onZoomTouchMove = (e: TouchEvent, index: number): void => {
  if (doubleTapDetected.value) return;

  if (e.touches.length === 2 && isZooming.value) {
    // 双指缩放
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const currentDistance = getDistance(
      touch1.clientX, touch1.clientY,
      touch2.clientX, touch2.clientY
    );

    // 计算新的缩放比例
    let newScale = zoomStartScale.value * (currentDistance / zoomStartDistance.value);

    // 限制缩放范围
    newScale = Math.max(1, Math.min(newScale, 4));

    zoomScales.value[index] = newScale;

    applyZoomTransform(index);
    e.preventDefault();
  } else if (e.touches.length === 1) {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    if (zoomScales.value[index] > 1) {
      // 单指移动已缩放的图片
      const deltaX = currentX - zoomStartX.value;
      const deltaY = currentY - zoomStartY.value;

      // 移动的距离与缩放比例成正比
      const maxOffsetX = (zoomScales.value[index] - 1) * slideWidth.value / 2;
      const maxOffsetY = (zoomScales.value[index] - 1) * (viewerContent.value?.offsetHeight || 0) / 2;

      zoomOffsetX.value[index] += deltaX;
      zoomOffsetY.value[index] += deltaY;

      // 限制移动范围
      zoomOffsetX.value[index] = Math.max(-maxOffsetX, Math.min(zoomOffsetX.value[index], maxOffsetX));
      zoomOffsetY.value[index] = Math.max(-maxOffsetY, Math.min(zoomOffsetY.value[index], maxOffsetY));

      zoomStartX.value = currentX;
      zoomStartY.value = currentY;

      applyZoomTransform(index);
    } else if (isDragging.value) {
      // 计算X和Y方向的移动距离
      touchDeltaX.value = currentX - touchStartX.value;
      touchDeltaY.value = currentY - touchStartY.value;

      // 判断是水平滑动还是垂直滑动
      if (!isVerticalSwiping.value && !isZooming.value) {
        // 首次移动时判断滑动方向
        if (Math.abs(touchDeltaY.value) > Math.abs(touchDeltaX.value) * 1.2) {
          isVerticalSwiping.value = true;
        }
      }

      if (isVerticalSwiping.value) {
        // 垂直滑动 - 用于退出全屏查看
        const maxSwipeDistance = slideHeight.value * 0.4; // 最大滑动距离为高度的40%
        const progress = touchDeltaY.value / maxSwipeDistance; // 计算进度，范围约为-1到1
        verticalSwipeProgress.value = Math.max(-0.85, Math.min(0.85, progress)); // 限制最大透明度变化
      } else {
        // 水平滑动 - 切换图片
        // 计算Y轴移动距离，如果Y轴移动距离大于X轴，可能是上下滑动，不处理
        const touchDeltaY = currentY - touchStartY.value;
        if (Math.abs(touchDeltaY) > Math.abs(touchDeltaX.value) * 1.5) return;

        // 应用移动效果，边缘有阻尼
        const containerWidth = slideWidth.value;
        const movePercent = (touchDeltaX.value / containerWidth) * 100;

        // 计算当前的translateX值
        const currentTranslateX = -props.currentIndex * 100;

        // 添加阻尼效果：边缘滑动阻力更大
        let dampenedMovePercent = movePercent;
        if ((props.currentIndex === 0 && movePercent > 0) ||
            (props.currentIndex === props.photos.length - 1 && movePercent < 0)) {
          dampenedMovePercent = movePercent * 0.3; // 边缘阻尼
        }

        if (slidesContainer.value) {
          slidesContainer.value.style.transform = `translateX(${currentTranslateX + dampenedMovePercent}%)`;
        }
      }
    }

    // 阻止默认行为以防止页面滚动
    e.preventDefault();
  }
};

const onZoomTouchEnd = (e: TouchEvent, index: number): void => {
  isZooming.value = false;

  if (doubleTapDetected.value) {
    doubleTapDetected.value = false;
    return;
  }

  // 如果缩放比例接近1，重置为1
  if (zoomScales.value[index] < 1.05) {
    resetZoom(index);
  }

  if (isDragging.value) {
    isDragging.value = false;

    if (isVerticalSwiping.value) {
      // 处理垂直滑动结束
      isVerticalSwiping.value = false;

      const SWIPE_THRESHOLD = 0.15; // 需要达到屏幕高度15%的距离才触发关闭

      if (verticalSwipeProgress.value !== null && Math.abs(verticalSwipeProgress.value) > SWIPE_THRESHOLD) {
        // 达到关闭阈值，关闭查看器
        closeViewer();
      } else {
        // 未达到阈值，恢复显示
        verticalSwipeProgress.value = 0;
        // 添加过渡动画回到原位
        if (slidesContainer.value) {
          slidesContainer.value.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          setTimeout(() => {
            verticalSwipeProgress.value = null;
            if (slidesContainer.value) {
              slidesContainer.value.style.transition = '';
            }
          }, 200);
        }
      }
    } else {
      // 处理水平滑动结束
      if (slidesContainer.value) {
        slidesContainer.value.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
      }

      // 判断滑动距离是否足够触发翻页
      const threshold = 0.15; // 15%的屏幕宽度
      const moveRatio = Math.abs(touchDeltaX.value) / slideWidth.value;

      if (moveRatio > threshold) {
        if (touchDeltaX.value > 0 && props.currentIndex > 0) {
          // 右滑，前一张
          emit('change', props.currentIndex - 1);
        } else if (touchDeltaX.value < 0 && props.currentIndex < props.photos.length - 1) {
          // 左滑，后一张
          emit('change', props.currentIndex + 1);
        } else if (slidesContainer.value) {
          // 回弹到当前位置
          slidesContainer.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
        }
      } else if (slidesContainer.value) {
        // 回弹到当前位置
        slidesContainer.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
      }
    }

    touchDeltaX.value = 0;
    touchDeltaY.value = 0;
  }
};

const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const applyZoomTransform = (index: number): void => {
  if (!zoomContainers.value[index]) return;

  const el = zoomContainers.value[index];
  el.style.transform = `scale(${zoomScales.value[index]}) translate(${zoomOffsetX.value[index] / zoomScales.value[index]}px, ${zoomOffsetY.value[index] / zoomScales.value[index]}px)`;
};

const resetZoom = (index: number): void => {
  zoomScales.value[index] = 1;
  zoomOffsetX.value[index] = 0;
  zoomOffsetY.value[index] = 0;

  if (zoomContainers.value[index]) {
    zoomContainers.value[index].style.transform = 'scale(1) translate(0, 0)';
    zoomContainers.value[index].style.transition = 'transform 0.3s ease';
    setTimeout(() => {
      if (zoomContainers.value[index]) {
        zoomContainers.value[index].style.transition = '';
      }
    }, 300);
  }
};

// 处理触屏设备的双击
const handleDoubleTap = (e: MouseEvent | TouchEvent, index: number): void => {
  // 实际执行双击放大/缩小的逻辑
  if (zoomScales.value[index] > 1) {
    // 已经放大，重置缩放
    resetZoom(index);
  } else {
    // 放大到2x
    zoomScales.value[index] = 2;

    if (!zoomContainers.value[index]) return;

    // 获取容器尺寸
    const containerRect = zoomContainers.value[index].getBoundingClientRect();
    const imgCenterX = containerRect.width / 2;
    const imgCenterY = containerRect.height / 2;

    // 获取触摸/点击坐标
    let touchX: number, touchY: number;
    if ('touches' in e && e.touches.length > 0) {
      // 触摸事件
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      // 鼠标事件
      touchX = e.clientX;
      touchY = e.clientY;
    } else {
      // 默认使用中心点
      touchX = containerRect.left + imgCenterX;
      touchY = containerRect.top + imgCenterY;
    }

    const zoomPointX = touchX - containerRect.left - imgCenterX;
    const zoomPointY = touchY - containerRect.top - imgCenterY;

    // 计算偏移以使双击点成为放大的中心
    zoomOffsetX.value[index] = -zoomPointX * (zoomScales.value[index] - 1);
    zoomOffsetY.value[index] = -zoomPointY * (zoomScales.value[index] - 1);

    applyZoomTransform(index);

    // 添加缩放动画
    zoomContainers.value[index].style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    setTimeout(() => {
      if (zoomContainers.value[index]) {
        zoomContainers.value[index].style.transition = '';
      }
    }, 300);
  }
};

// 处理双击缩放 - 桌面端专用
const onDoubleTap = (e: MouseEvent | TouchEvent, index: number, fromDblClick = false): void => {
  // 桌面端的双击事件处理，不与触摸双击事件重复触发
  if (!isMobile.value || fromDblClick) {
    handleDoubleTap(e, index);
  }
};

// 单击事件
const onSlideClick = (e: MouseEvent, index: number): void => {
  // 在桌面端，可以通过连续单击检测双击
  if (!isMobile.value) {
    const now = new Date().getTime();
    const DOUBLE_CLICK_DELAY = 300;

    if (now - lastTapTime.value < DOUBLE_CLICK_DELAY) {
      // 这是双击
      onDoubleTap(e, index);
      lastTapTime.value = 0;
    } else {
      // 记录这次点击的时间
      lastTapTime.value = now;
    }
  }
};

// 关闭查看器
const closeViewer = (): void => {
  // 关闭前重置所有缩放
  zoomScales.value.forEach((_, index) => {
    if (zoomScales.value[index] > 1) {
      resetZoom(index);
    }
  });
  emit('close');
};

// 监听索引变化，重置缩放
watch(() => props.currentIndex, (newIndex, oldIndex) => {
  if (newIndex !== oldIndex && slidesContainer.value) {
    // 在切换slide时重置被放大的图片
    if (oldIndex >= 0 && zoomScales.value[oldIndex] > 1) {
      resetZoom(oldIndex);
    }

    // 添加过渡动画
    slidesContainer.value.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    slidesContainer.value.style.transform = `translateX(${-newIndex * 100}%)`;
  }
});

onMounted(() => {
  initZoomData();
  checkIfMobile();

  nextTick(() => {
    slideWidth.value = viewerContent.value?.offsetWidth || 0;
    slideHeight.value = viewerContent.value?.offsetHeight || 0;

    // 初始位置
    if (slidesContainer.value) {
      slidesContainer.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
    }

    // 监听窗口大小变化，更新尺寸
    window.addEventListener('resize', () => {
      slideWidth.value = viewerContent.value?.offsetWidth || 0;
      slideHeight.value = viewerContent.value?.offsetHeight || 0;
    });
  });
});
</script>

<style scoped>
.fullscreen-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  user-select: none;
  touch-action: none;
}

.viewer-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slides-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease;
  will-change: transform, opacity;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;
}

.zoom-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  touch-action: none;
  pointer-events: none; /* 防止图片接收事件，让容器处理 */
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}

.pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1002;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1002;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon.close {
  background-color: white;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (min-width: 768px) {
  .close-btn {
    width: 50px;
    height: 50px;
  }

  .icon {
    width: 28px;
    height: 28px;
  }
}
</style>
