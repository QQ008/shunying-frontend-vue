<template>
  <div class="detail-page p-4">
    <div v-if="loading" class="flex justify-center items-center pt-20">
      <van-loading size="24px">加载中...</van-loading>
    </div>

    <div v-else-if="error" class="text-center pt-20 text-gray-500">
      <p>{{ error }}</p>
      <van-button type="primary" size="small" @click="fetchDetail" class="mt-4">重试</van-button>
    </div>

    <div v-else-if="groupDetail">
      <!-- 图片组信息 -->
      <div class="group-info mb-4 p-3 bg-white rounded shadow">
        <h1 class="text-lg font-semibold mb-2">{{ groupDetail.eventName || '活动详情' }}</h1>
        <p class="text-sm text-gray-600 mb-1">摄影师：{{ groupDetail.photographerName || '未知' }}</p>
        <p class="text-sm text-gray-600 mb-1">地点：{{ groupDetail.locationName || '未知' }}</p>
        <p class="text-sm text-gray-600 mb-1">日期：{{ groupDetail.shootDate || '未知' }}</p>
        <p v-if="groupDetail.description" class="text-sm text-gray-700 mt-2 bg-gray-100 p-2 rounded">
          {{ groupDetail.description }}
        </p>
        <p class="text-xs text-gray-400 mt-2">共 {{ groupDetail.imageCount }} 张图片</p>
      </div>

      <!-- 图片列表 -->
      <div class="image-list mb-16"> <!-- mb-16 for bottom actions padding -->
        <van-grid :column-num="3" :gutter="8" square>
          <van-grid-item v-for="image in groupDetail.images" :key="image.id" @click="previewImage(image.previewPath)">
            <van-image
              lazy-load
              :src="image.previewPath"
              fit="cover"
              class="w-full h-full"
            />
            <!-- 可选：在图片上添加角标，如购物车图标 -->
            <!-- <van-tag v-if="isInCart(image.id)" round type="primary" class="absolute top-1 right-1">已选</van-tag> -->
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 底部操作栏 -->
      <div class="fixed bottom-0 left-0 right-0 bg-white shadow-md p-3 flex justify-between items-center">
        <div>
          <!-- TODO: 计算价格 -->
          <span class="text-red-500 font-bold text-lg mr-2">¥ 模拟价格</span>
          <span class="text-gray-500 text-sm">已选 0 张</span>
        </div>
        <div>
          <van-button type="warning" size="small" class="mr-2" @click="addToCart">加入购物车</van-button>
          <van-button type="primary" size="small" @click="buyNow">立即购买</van-button>
        </div>
      </div>

    </div>

    <!-- 图片预览 -->
    <van-image-preview v-model:show="showPreview" :images="previewImages" @change="onPreviewChange">
      <template #index>第{{ previewIndex + 1 }}张</template>
    </van-image-preview>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast, showImagePreview } from 'vant';
import type { ImageGroupDetailData } from '@/api/image';
import { getImageGroupDetail } from '@/api/image';
// import { useCartStore } from '@/store/modules/cart'; // 引入购物车 store (如果需要)

const route = useRoute();
const router = useRouter();
// const cartStore = useCartStore(); // 使用购物车 store

const groupId = ref<number | null>(null);
const groupDetail = ref<ImageGroupDetailData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// 图片预览状态
const showPreview = ref(false);
const previewImages = ref<string[]>([]);
const previewIndex = ref(0);

// 获取详情数据
const fetchDetail = async () => {
  const idParam = route.params.id;
  if (!idParam) {
    error.value = '无效的图片组 ID';
    loading.value = false;
    return;
  }
  groupId.value = Number(idParam);
  if (isNaN(groupId.value)) {
    error.value = '无效的图片组 ID';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  const loadingToast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0, // 一直显示
  });

  try {
    const data = await getImageGroupDetail(groupId.value);
    groupDetail.value = data;
    previewImages.value = data.images.map(img => img.previewPath);
  } catch (err: any) {
    console.error('Failed to fetch image group detail:', err);
    error.value = err.message || '加载失败，请稍后重试';
    groupDetail.value = null;
  } finally {
    loading.value = false;
    closeToast(); // 关闭加载提示
  }
};

// 预览图片
const previewImage = (startImageUrl: string) => {
  const startIndex = previewImages.value.findIndex(url => url === startImageUrl);
  if (startIndex !== -1) {
    previewIndex.value = startIndex;
    showPreview.value = true;
    // 使用 Vant 的函数式调用预览
    // showImagePreview({
    //   images: previewImages.value,
    //   startPosition: startIndex,
    // });
  }
};

const onPreviewChange = (index: number) => {
  previewIndex.value = index;
};

// --- 占位函数 ---
const addToCart = () => {
  showToast('功能暂未实现：加入购物车');
  // TODO: 实现加入购物车逻辑，可能需要选择图片
};

const buyNow = () => {
  showToast('功能暂未实现：立即购买');
  // TODO: 实现购买逻辑，跳转支付或确认页
};

// const isInCart = (imageId: number): boolean => {
//   // TODO: 检查图片是否在购物车中
//   // return cartStore.items.some(item => item.type === 'IMAGE' && item.id === imageId);
//   return false; 
// };

// 组件挂载时获取数据
onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
.detail-page {
  background-color: #f7f8fa;
  min-height: calc(100vh - 46px); /* 减去 NavBar 高度 */
}
.image-list .van-grid-item {
  /* 可调整 grid item 样式 */
  height: auto; /* 根据内容自适应高度 */
}
.van-image {
  display: block; /* 确保图片正确显示 */
}
</style> 