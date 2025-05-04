<template>
  <div class="image-group-detail-page">
    <van-nav-bar
      :title="`图片组 #${groupId}`"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
    />

    <div v-if="loading" class="loading-container">
      <van-loading size="24px">加载中...</van-loading>
    </div>

    <div v-if="error" class="error-container">
      <van-empty image="error" :description="error" />
      <van-button type="primary" @click="fetchDetails">重试</van-button>
    </div>

    <div v-if="groupDetail && !loading && !error" class="content-area">
      <!-- 图片轮播 -->
      <van-swipe @change="onSwipeChange" ref="swipeRef" class="image-swipe" indicator-color="white">
        <van-swipe-item v-for="(image, index) in groupDetail.images" :key="image.id">
          <div class="relative">
            <van-image
              fit="contain"
              :src="image.previewPath"
              class="main-image"
              @click="showImagePreview(index)"
            />
            <!-- 选择框 -->
            <van-checkbox
              v-model="selectedImageIds[image.id]"
              class="absolute top-2 right-2"
              icon-size="20px"
              checked-color="#1989fa"
              @change="(checked: boolean) => onCheckboxChange(image.id, checked)"
            />
          </div>
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="custom-indicator">{{ active + 1 }} / {{ total }}</div>
        </template>
      </van-swipe>

      <!-- 图片信息展示 -->
      <div class="image-info-panel p-3 bg-white shadow rounded mt-2">
        <h3 class="text-base font-semibold mb-2">图片信息</h3>
        <van-row gutter="8" class="text-xs text-gray-600">
          <van-col span="12">分辨率: {{ currentImageInfo?.previewResolution || '-' }}</van-col>
          <van-col span="12">拍摄时间: {{ formatShootTime(currentImageInfo?.shootTime) }}</van-col>
          <van-col span="12">相机: {{ currentImageInfo?.cameraModel || '-' }}</van-col>
          <van-col span="12">镜头: {{ currentImageInfo?.lensModel || '-' }}</van-col>
          <van-col span="6">光圈: {{ currentImageInfo?.aperture || '-' }}</van-col>
          <van-col span="6">快门: {{ currentImageInfo?.shutterSpeed || '-' }}</van-col>
          <van-col span="6">ISO: {{ currentImageInfo?.iso || '-' }}</van-col>
          <van-col span="6">EV: {{ currentImageInfo?.ev || '-' }}</van-col>
          <van-col span="12">白平衡: {{ currentImageInfo?.whiteBalance || '-' }}</van-col>
        </van-row>
      </div>

      <!-- 图片组信息 & 摄影师信息 -->
      <div class="group-info-panel p-3 bg-white shadow rounded mt-2">
         <h3 class="text-base font-semibold mb-2">拍摄信息</h3>
        <p class="text-sm text-gray-700 mb-1">活动: {{ groupDetail.eventName || '未知活动' }}</p>
        <p class="text-sm text-gray-700 mb-1">地点: {{ groupDetail.locationName || '未知地点' }}</p>
        <p class="text-sm text-gray-700 mb-2">日期: {{ groupDetail.shootDate || '未知日期' }}</p>
        <div class="flex items-center cursor-pointer" @click="goToPhotographerDetail(groupDetail.photographerId)">
          <van-image round width="30px" height="30px" :src="groupDetail.photographerAvatar || defaultAvatar" class="mr-2" />
          <span class="text-sm font-medium text-blue-600 hover:underline">{{ groupDetail.photographerName || '匿名摄影师' }}</span>
        </div>
        <p v-if="groupDetail.description" class="text-xs text-gray-500 mt-2">{{ groupDetail.description }}</p>
      </div>

    </div>

    <!-- 底部操作栏 -->
    <van-action-bar placeholder fixed>
      <van-action-bar-icon icon="like-o" :text="`收藏(${selectedCount})`" @click="handleFavorite" />
      <van-action-bar-icon icon="cart-o" :text="`购物车(${cartStore.itemCount})`" @click="goToCart" />
      <van-action-bar-icon icon="warning-o" text="举报" @click="showReportSheet = true" />
      <van-action-bar-button type="warning" :text="`加入购物车(${selectedCount})`" @click="handleAddToCart" :disabled="selectedCount === 0"/>
      <van-action-bar-button type="danger" :text="`立即购买(${selectedCount})`" @click="handleBuyNow" :disabled="selectedCount === 0"/>
    </van-action-bar>

     <!-- 举报操作面板 -->
    <van-action-sheet
      v-model:show="showReportSheet"
      :actions="reportActions"
      cancel-text="取消"
      close-on-click-action
      @select="onReportSelect"
      description="选择举报对象"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getImageGroupDetail } from '@/api/image';
import type { ImageGroupDetailData, ImageInfo } from '@/api/image';
import { showToast, showLoadingToast, closeToast, showImagePreview as vanShowImagePreview, showConfirmDialog } from 'vant';
// ActionSheetItem 似乎未导出，让 TS 推断类型
import type { SwipeInstance } from 'vant';
import { useCartStore } from '@/store/modules/cart'; // 导入购物车 store
import type { CartItem } from '@/store/modules/cart'; // 导入购物车项类型
/*
interface ReportActionItem {
  name: string;
  subname?: string;
  value?: string | number;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  callback?: (item: ReportActionItem) => void;
  className?: string;
  [key: string]: any; // 允许其他属性
}
*/

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore(); // 使用购物车 store

const groupId = Number(route.params.id);
const groupDetail = ref<ImageGroupDetailData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const swipeRef = ref<SwipeInstance | null>(null);
const currentImageIndex = ref(0);
const selectedImageIds = reactive<Record<number, boolean>>({}); // <imageId, isSelected>
const showReportSheet = ref(false);
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'; // 默认头像

// --- Computed --- 
const currentImageInfo = computed<ImageInfo | null>(() => {
  return groupDetail.value?.images[currentImageIndex.value] || null;
});

const selectedCount = computed(() => {
  return Object.values(selectedImageIds).filter(Boolean).length;
});

// 不显式指定类型，让 TS 推断
const reportActions = computed(() => [
  { name: '举报当前图片', subname: `图片 ID: ${currentImageInfo.value?.id || 'N/A'}`, value: 'single' },
  { name: '举报整个图片组', subname: `图片组 ID: ${groupId}`, value: 'group' },
]);

// --- Methods --- 
const goBack = () => {
  router.back();
};

const fetchDetails = async () => {
  loading.value = true;
  error.value = null;
  showLoadingToast({ message: '加载中...', forbidClick: true, duration: 0 });
  try {
    groupDetail.value = await getImageGroupDetail(groupId);
    // 初始化选择状态
    groupDetail.value.images.forEach(img => {
      if (selectedImageIds[img.id] === undefined) {
         selectedImageIds[img.id] = false; // 默认都不选中
      }
    });
  } catch (err: any) {
    console.error('Failed to fetch image group details:', err);
    const errorMsg = err?.message || '加载图片组详情失败';
    error.value = errorMsg;
    showToast(errorMsg); // 确保传递字符串
  } finally {
    loading.value = false;
    closeToast();
  }
};

const onSwipeChange = (index: number) => {
  currentImageIndex.value = index;
};

const onCheckboxChange = (imageId: number, checked: boolean) => {
  console.log(`Image ${imageId} selection changed to: ${checked}`);
  // selectedImageIds[imageId] = checked; // v-model 已经处理了
};

const showImagePreview = (startPosition: number) => {
  if (!groupDetail.value) return;
  const images = groupDetail.value.images.map(img => img.previewPath);
  vanShowImagePreview({
    images,
    startPosition,
    closeable: true,
  });
};

const formatShootTime = (isoTime?: string): string => {
  if (!isoTime) return '-';
  try {
    const date = new Date(isoTime);
    return date.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch {
    return '-';
  }
};

const goToPhotographerDetail = (photographerId?: number) => {
  if (photographerId) {
    showToast(`跳转到摄影师详情页 (ID: ${photographerId}) - 待开发`);
    // router.push(`/photographer/${photographerId}`);
  } else {
    showToast('摄影师信息不可用');
  }
};

const handleFavorite = () => {
  const idsToFavorite = Object.entries(selectedImageIds)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => Number(id));

  if (idsToFavorite.length > 0) {
    showToast(`收藏 ${idsToFavorite.length} 张图片 - 功能待实现`);
    console.log('Favoriting image IDs:', idsToFavorite);
    // TODO: 调用收藏接口
  } else {
     showConfirmDialog({
       title: '收藏整个图片组？',
       message: '当前未选择任何单张图片，是否收藏整个图片组？',
     })
       .then(() => {
         showToast(`收藏图片组 ID: ${groupId} - 功能待实现`);
         console.log('Favoriting group ID:', groupId);
         // TODO: 调用收藏图片组接口
       })
       .catch(() => {
         // on cancel
       });
  }
};

const handleAddToCart = () => {
  if (!groupDetail.value) return;

  const itemsToAdd: (Omit<CartItem, 'quantity'> & { quantity?: number })[] = [];
  Object.entries(selectedImageIds).forEach(([idStr, isSelected]) => {
    if (isSelected) {
      const imageId = Number(idStr);
      const imageInfo = groupDetail.value?.images.find(img => img.id === imageId);
      if (imageInfo) {
        itemsToAdd.push({
          id: imageInfo.id,
          previewPath: imageInfo.previewPath,
          // name: `图片 #${imageInfo.id}`, // 可选：添加商品名称
          // price: 10, // TODO: 获取实际价格
        });
      }
    }
  });

  if (itemsToAdd.length > 0) {
    cartStore.addItems(itemsToAdd);
    showToast(`已将 ${itemsToAdd.length} 张图片加入购物车`);
    // 可选：加入后清除选择状态？
    // Object.keys(selectedImageIds).forEach(key => selectedImageIds[Number(key)] = false);
  } else {
    showToast('请先选择要加入购物车的图片');
  }
};

const goToCart = () => {
  router.push('/cart'); // 假设购物车路由为 /cart
};

const handleBuyNow = () => {
  const idsToBuy = Object.entries(selectedImageIds)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => Number(id));

  if (idsToBuy.length > 0) {
    showToast(`立即购买 ${idsToBuy.length} 张图片 - 功能待实现`);
    console.log('Buying now image IDs:', idsToBuy);
    // TODO: 调用创建订单接口并跳转到支付页
  } else {
    showToast('请先选择要购买的图片');
  }
};

// 不显式指定 action 类型
const onReportSelect = (action: any) => {
  const reportType = action.value;
  if (reportType === 'single') {
    const imageId = currentImageInfo.value?.id;
    if (imageId) {
      showToast(`举报图片 ID: ${imageId} - 功能待实现`);
      console.log('Reporting single image ID:', imageId);
      // TODO: 调用举报单张图片接口
    } else {
      showToast('无法获取当前图片ID');
    }
  } else if (reportType === 'group') {
    showToast(`举报图片组 ID: ${groupId} - 功能待实现`);
    console.log('Reporting group ID:', groupId);
    // TODO: 调用举报图片组接口
  }
};

// --- Lifecycle --- 
onMounted(() => {
  fetchDetails();
});

</script>

<style scoped>
.image-group-detail-page {
  padding-bottom: 50px; /* 为底部操作栏留出空间 */
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
}

.content-area {
  padding: 0 10px 10px 10px;
}

.image-swipe {
  height: 300px; /* Or adapt based on content */
  background-color: #333;
  border-radius: 8px;
  overflow: hidden;
}

.main-image {
  display: block;
  width: 100%;
  height: 300px;
}

.custom-indicator {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 2px 8px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 12px;
}

.image-info-panel, .group-info-panel {
  border-radius: 8px;
}

.van-action-bar {
  z-index: 100;
}

/* 调整 Checkbox 位置和样式 */
.van-checkbox.absolute {
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  padding: 2px; /* Add some padding around the icon */
}

/* 让信息面板的列换行更自然 */
.van-row {
  line-height: 1.6;
}

/*摄影师头像点击效果*/
.cursor-pointer {
  cursor: pointer;
}
</style> 