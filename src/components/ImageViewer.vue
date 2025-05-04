<template>
  <!-- 图片预览组件 -->
  <div class="image-viewer" ref="viewerRef">
    <div class="main-photo-container" ref="mainPhotoContainer">
      <div
        class="slides-wrapper"
        ref="slidesWrapper"
        :style="{ transform: `translateX(${-currentIndex * 100}%)` }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="slide"
          @click="onMainPhotoClick"
        >
          <img :src="photo.url || ''" alt="照片" :class="getPhotoOrientation(photo.url)">
        </div>
      </div>
    </div>

    <div class="pagination">
      <span
        v-for="(_, index) in photos"
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="$emit('change', index)"
      ></span>
    </div>

    <div class="thumbnail-list">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="thumbnail"
        :class="{ active: index === currentIndex }"
        @click="$emit('change', index)"
      >
        <img :src="photo.url || ''" alt="照片缩略图">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// 更通用的图片接口，与特定业务逻辑分离
export interface BasePhoto {
  id?: number | string;
  url: string | null;
  [key: string]: unknown; // 允许其他属性，使用unknown而非any
}

// 定义props
const props = defineProps({
  photos: {
    type: Array as () => BasePhoto[],
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['change', 'full-screen']);

// 触摸相关
const viewerRef = ref<HTMLDivElement | null>(null);
const mainPhotoContainer = ref<HTMLDivElement | null>(null);
const slidesWrapper = ref<HTMLDivElement | null>(null);
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchDeltaX = ref(0);
const isDragging = ref(false);
const initialTransform = ref(0);
const slideWidth = ref(0);

// 判断照片的方向
const getPhotoOrientation = (url: string | null): 'landscape' | 'portrait' => {
  // 解析URL中的尺寸信息
  // 例如: https://picsum.photos/800/600 -> 横版
  // 例如: https://picsum.photos/600/800 -> 竖版
  if (url) {
    const parts = url.split('/');
    if (parts.length >= 2) {
      const width = parseInt(parts[parts.length - 2]);
      const height = parseInt(parts[parts.length - 1].split('?')[0]);
      if (!isNaN(width) && !isNaN(height)) {
        return width >= height ? 'landscape' : 'portrait';
      }
    }
  }
  return 'landscape'; // 默认为横版
};

// 计算滑动距离和方向
const onTouchStart = (e: TouchEvent): void => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY; // 记录Y轴起始位置，用于区分水平滑动和垂直滑动
  isDragging.value = true;
  initialTransform.value = -props.currentIndex * 100;

  // 停止过渡动画
  if (slidesWrapper.value) {
    slidesWrapper.value.style.transition = 'none';
  }
};

const onTouchMove = (e: TouchEvent): void => {
  if (!isDragging.value) return;

  const currentTouchX = e.touches[0].clientX;
  const currentTouchY = e.touches[0].clientY;
  touchDeltaX.value = currentTouchX - touchStartX.value;

  // 计算Y轴移动距离，如果Y轴移动距离大于X轴，可能是上下滑动，不处理
  const touchDeltaY = currentTouchY - touchStartY.value;
  if (Math.abs(touchDeltaY) > Math.abs(touchDeltaX.value) * 1.5) return;

  // 计算移动百分比
  const containerWidth = mainPhotoContainer.value?.offsetWidth || 1;
  const percentMoved = (touchDeltaX.value / containerWidth) * 100;

  // 应用拖动效果，添加阻尼效果
  if (slidesWrapper.value) {
    const newTransform = initialTransform.value + percentMoved;
    slidesWrapper.value.style.transform = `translateX(${newTransform}%)`;
  }

  // 阻止默认行为以防止页面滚动
  e.preventDefault();
};

const onTouchEnd = (): void => {
  if (!isDragging.value) return;

  isDragging.value = false;

  // 恢复过渡动画
  if (slidesWrapper.value) {
    slidesWrapper.value.style.transition = 'transform 0.3s ease';
  }

  // 计算是否切换到下一张/上一张
  const threshold = 15; // 移动超过15%的滑动阈值

  if (touchDeltaX.value > 0 && touchDeltaX.value / slideWidth.value * 100 > threshold) {
    // 右滑，切换到上一张
    if (props.currentIndex > 0) {
      emit('change', props.currentIndex - 1);
    } else if (slidesWrapper.value) {
      // 弹回第一张
      slidesWrapper.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
    }
  } else if (touchDeltaX.value < 0 && Math.abs(touchDeltaX.value) / slideWidth.value * 100 > threshold) {
    // 左滑，切换到下一张
    if (props.currentIndex < props.photos.length - 1) {
      emit('change', props.currentIndex + 1);
    } else if (slidesWrapper.value) {
      // 弹回最后一张
      slidesWrapper.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
    }
  } else if (slidesWrapper.value) {
    // 没有超过阈值，恢复到当前图片
    slidesWrapper.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
  }

  // 重置触摸状态
  touchDeltaX.value = 0;
};

// 点击大图查看
const onMainPhotoClick = (): void => {
  emit('full-screen');
};

onMounted(() => {
  slideWidth.value = mainPhotoContainer.value?.offsetWidth || 0;

  // 监听窗口大小变化，更新滑动宽度
  window.addEventListener('resize', () => {
    slideWidth.value = mainPhotoContainer.value?.offsetWidth || 0;
  });
});

// 监听currentIndex变化，应用过渡动画
watch(() => props.currentIndex, () => {
  if (slidesWrapper.value) {
    slidesWrapper.value.style.transition = 'transform 0.3s ease';
    slidesWrapper.value.style.transform = `translateX(${-props.currentIndex * 100}%)`;
  }
});
</script>

<style scoped>
.image-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.main-photo-container {
  width: 100%;
  height: 70vh;
  max-height: 500px;
  overflow: hidden;
  position: relative;
  background-color: #f7f7f7;
}

.slides-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
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

.slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.slide img.landscape {
  width: 100%;
  height: auto;
}

.slide img.portrait {
  height: 100%;
  width: auto;
}

.slide:active img {
  transform: scale(0.98);
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #9966FF;
  transform: scale(1.2);
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 16px 4px;
  scrollbar-width: none;
}

.thumbnail-list::-webkit-scrollbar {
  display: none;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail.active {
  border-color: #9966FF;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .main-photo-container {
    height: calc(100vh - 140px);
    max-height: none;
  }

  .thumbnail {
    width: 80px;
    height: 80px;
  }

  .thumbnail-list {
    padding: 20px 10px 10px;
    justify-content: center;
  }
}
</style>
