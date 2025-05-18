<template>
  <div class="orders-view">
    <!-- 参考AboutView的顶部栏设计 -->
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">我的订单</h1>
      <div class="right-action" @click="showFilter = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18H9V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z" fill="#9966FF"/>
        </svg>
      </div>
    </div>

    <!-- 未登录状态显示 -->
    <div v-if="!auth.userInfo.isLoggedIn" class="login-prompt-container">
      <div class="login-prompt-icon">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 50C40.4934 50 49 41.4934 49 31C49 20.5066 40.4934 12 30 12C19.5066 12 11 20.5066 11 31C11 41.4934 19.5066 50 30 50Z" fill="#E9E1FF"/>
          <path d="M30 42C33.15 42 36 39.15 36 36C36 32.85 33.15 30 30 30C26.85 30 24 32.85 24 36C24 39.15 26.85 42 30 42Z" fill="#9966FF"/>
          <path d="M30 26C31.1 26 32 25.1 32 24C32 22.9 31.1 22 30 22C28.9 22 28 22.9 28 24C28 25.1 28.9 26 30 26Z" fill="#9966FF"/>
          <path d="M30 28C30.55 28 31 27.55 31 27V25.5C31 24.95 30.55 24.5 30 24.5C29.45 24.5 29 24.95 29 25.5V27C29 27.55 29.45 28 30 28Z" fill="#9966FF"/>
        </svg>
      </div>
      <h2 class="login-prompt-title">请先登录</h2>
      <p class="login-prompt-desc">登录后查看您的订单信息</p>
      <button class="login-prompt-button" @click="showLoginModal = true">
        立即登录
      </button>
    </div>

    <!-- 已登录状态显示 -->
    <div v-else>
      <!-- 筛选标签栏 -->
      <div class="orders-view-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="orders-view-tab"
          :class="{ active: currentTab === tab.value }"
          @click="changeTab(tab.value)"
        >
          {{ tab.name }}
          <span v-if="tab.count" class="count">({{ tab.count }})</span>
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="orders-view-container">
        <!-- 加载中状态 -->
        <div v-if="loading" class="orders-loading">
          <div class="orders-loading-spinner"></div>
        </div>

        <!-- 空状态显示 -->
        <div v-else-if="filteredOrders.length === 0" class="orders-empty-state">
          <div class="orders-empty-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M64 20H52V16C52 13.8783 51.1571 11.8434 49.6569 10.3431C48.1566 8.84285 46.1217 8 44 8H36C33.8783 8 31.8434 8.84285 30.3431 10.3431C28.8429 11.8434 28 13.8783 28 16V20H16C13.8783 20 11.8434 20.8429 10.3431 22.3431C8.84285 23.8434 8 25.8783 8 28V64C8 66.1217 8.84285 68.1566 10.3431 69.6569C11.8434 71.1571 13.8783 72 16 72H64C66.1217 72 68.1566 71.1571 69.6569 69.6569C71.1571 68.1566 72 66.1217 72 64V28C72 25.8783 71.1571 23.8434 69.6569 22.3431C68.1566 20.8429 66.1217 20 64 20ZM36 16H44V20H36V16ZM64 64H16V28H64V64Z" fill="#E9E1FF"/>
              <rect x="24" y="36" width="32" height="4" fill="#9966FF"/>
              <rect x="24" y="44" width="32" height="4" fill="#9966FF"/>
              <rect x="24" y="52" width="32" height="4" fill="#9966FF"/>
            </svg>
          </div>
          <div class="orders-empty-title">{{ emptyStateMessage }}</div>
          <div class="orders-empty-desc">浏览精彩图片，开启您的拍摄体验</div>
          <button class="orders-empty-action" @click="navigateToHome">去首页</button>
        </div>

        <!-- 订单列表 -->
        <template v-else>
          <div v-for="order in filteredOrders" :key="order.id" class="order-card" @click="navigateToDetail(order.id)">
            <!-- 订单卡片头部 -->
            <div class="order-card-header">
              <div class="order-card-id">
                <span class="order-label">订单号</span>
                {{ order.id }}
              </div>
              <div class="order-card-status">
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <!-- 订单卡片内容 -->
            <div class="order-card-content">
              <div class="order-card-image">
                <!-- 有图片则显示，无图片则显示占位图标 -->
                <img v-if="order.coverImage" :src="order.coverImage" alt="订单封面图">
                <div v-else class="order-card-image-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#9966FF" fill-opacity="0.5"/>
                  </svg>
                </div>
              </div>
              <div class="order-card-info">
                <div class="order-card-time">{{ formatDate(order.createTime) }}</div>
                <div class="order-card-detail">
                  <div class="order-card-photos">{{ order.photoCount }}张照片</div>
                </div>
                <div class="order-card-price">
                  <div class="order-card-original-price">原价：￥{{ order.originalPrice.toFixed(2) }}</div>
                  <div class="order-card-final-price">实付：￥{{ order.finalPrice.toFixed(2) }}</div>
                </div>
              </div>

              <!-- 按钮集成到卡片内 -->
              <div class="order-card-action">
                <!-- 待付款 -->
                <div v-if="order.status === 'pending'" class="order-card-action-button">
                  立即付款
                </div>

                <!-- 已完成 -->
                <div v-else-if="order.status === 'completed'" class="order-card-action-button">
                  下载照片
                </div>

                <!-- 处理中 -->
                <div v-else-if="order.status === 'processing'" class="order-card-action-button">
                  查看进度
                </div>

                <!-- 已取消 -->
                <div v-else-if="order.status === 'cancelled'" class="order-card-action-button">
                  重新购买
                </div>

                <!-- 已退款 -->
                <div v-else-if="order.status === 'refunded'" class="order-card-action-button">
                  查看详情
                </div>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && !loading" class="orders-load-more" @click="loadMore">
            加载更多
          </div>
          <div v-if="!hasMore && filteredOrders.length > 0" class="orders-end-message">
            — 已经到底啦 —
          </div>
        </template>
      </div>

      <!-- 筛选弹窗 -->
      <div class="orders-filter-modal" v-if="showFilter" @click.self="showFilter = false">
        <div class="orders-filter-content">
          <div class="orders-filter-header">
            <h3 class="orders-filter-title">筛选订单</h3>
            <div class="orders-filter-close" @click="showFilter = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
              </svg>
            </div>
          </div>

          <div class="orders-filter-section">
            <div class="orders-filter-section-title">时间范围</div>
            <div class="orders-filter-options">
              <div
                v-for="option in timeRangeOptions"
                :key="option.value"
                class="orders-filter-option"
                :class="{ selected: filters.timeRange === option.value }"
                @click="setTimeRange(option.value)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>

          <div class="orders-filter-section">
            <div class="orders-filter-section-title">价格范围</div>
            <div class="orders-filter-options">
              <div
                v-for="option in priceRangeOptions"
                :key="option.value"
                class="orders-filter-option"
                :class="{ selected: filters.priceRange === option.value }"
                @click="setPriceRange(option.value)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>

          <div class="orders-filter-footer">
            <button class="orders-filter-btn orders-filter-btn-reset" @click="resetFilters">
              重置
            </button>
            <button class="orders-filter-btn orders-filter-btn-apply" @click="applyFilters">
              应用 ({{ filteredCount }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录模态框 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="onLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import LoginModal from '@/components/LoginModal.vue';
import { format } from 'date-fns';

// 引入样式
import '@/assets/styles/ordersView.css';

// 获取路由和认证
const router = useRouter();
const auth = useAuth();

// 登录模态框控制
const showLoginModal = ref(false);

// 筛选弹窗状态
const showFilter = ref(false);

// 加载状态
const loading = ref(false);
const hasMore = ref(true);

// 当前选中的标签
const currentTab = ref('all');

// 筛选状态
const filters = ref({
  timeRange: 'all',
  priceRange: 'all'
});

// 标签数据
const tabs = ref([
  { name: '全部', value: 'all', count: 0 },
  { name: '待付款', value: 'pending', count: 2 },
  { name: '处理中', value: 'processing', count: 1 },
  { name: '已完成', value: 'completed', count: 3 },
  { name: '已取消', value: 'cancelled', count: 0 },
]);

// 筛选选项
const timeRangeOptions = [
  { label: '全部时间', value: 'all' },
  { label: '最近一周', value: 'week' },
  { label: '最近一个月', value: 'month' },
  { label: '最近三个月', value: 'threeMonths' },
  { label: '最近半年', value: 'halfYear' },
];

const priceRangeOptions = [
  { label: '全部价格', value: 'all' },
  { label: '¥1 - ¥50', value: 'low' },
  { label: '¥50 - ¥100', value: 'medium' },
  { label: '¥100 - ¥300', value: 'high' },
  { label: '¥300以上', value: 'premium' },
];

// 模拟订单数据
const allOrders = ref([
  {
    id: 'ORD202406110001',
    status: 'pending',
    createTime: new Date('2024-06-11T14:30:00'),
    photoCount: 25,
    originalPrice: 125.00,
    discountAmount: 25.00,
    finalPrice: 100.00,
    coverImage: '/images/photos/sample-1.jpg',
    paymentDeadline: new Date('2024-06-12T14:30:00')
  },
  {
    id: 'ORD202406100001',
    status: 'pending',
    createTime: new Date('2024-06-10T10:15:00'),
    photoCount: 15,
    originalPrice: 75.00,
    discountAmount: 15.00,
    finalPrice: 60.00,
    coverImage: null, // 无封面图
    paymentDeadline: new Date('2024-06-11T10:15:00')
  },
  {
    id: 'ORD202406080001',
    status: 'processing',
    createTime: new Date('2024-06-08T16:45:00'),
    photoCount: 30,
    originalPrice: 150.00,
    discountAmount: 30.00,
    finalPrice: 120.00,
    coverImage: '/images/photos/sample-3.jpg',
    estimatedCompletionTime: new Date('2024-06-13T16:45:00')
  },
  {
    id: 'ORD202406050001',
    status: 'completed',
    createTime: new Date('2024-06-05T09:20:00'),
    photoCount: 20,
    originalPrice: 100.00,
    discountAmount: 20.00,
    finalPrice: 80.00,
    coverImage: '/images/photos/sample-4.jpg',
    completionTime: new Date('2024-06-07T15:30:00'),
    downloadCode: 'DWN123456'
  },
  {
    id: 'ORD202405250001',
    status: 'completed',
    createTime: new Date('2024-05-25T11:30:00'),
    photoCount: 35,
    originalPrice: 175.00,
    discountAmount: 0.00,
    finalPrice: 175.00,
    coverImage: '/images/photos/sample-5.jpg',
    completionTime: new Date('2024-05-27T14:10:00'),
    downloadCode: 'DWN789012'
  },
  {
    id: 'ORD202405150001',
    status: 'completed',
    createTime: new Date('2024-05-15T15:10:00'),
    photoCount: 10,
    originalPrice: 50.00,
    discountAmount: 5.00,
    finalPrice: 45.00,
    coverImage: null, // 无封面图
    completionTime: new Date('2024-05-16T12:00:00'),
    downloadCode: 'DWN345678'
  },
]);

// 筛选后的订单数据
const filteredOrders = computed(() => {
  // 先按状态筛选
  let result = allOrders.value;

  if (currentTab.value !== 'all') {
    result = result.filter(order => order.status === currentTab.value);
  }

  // 按时间范围筛选
  if (filters.value.timeRange !== 'all') {
    const now = new Date();
    let startDate: Date;

    switch (filters.value.timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'threeMonths':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'halfYear':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      default:
        startDate = new Date(0); // 1970年1月1日
        break;
    }

    result = result.filter(order => order.createTime >= startDate);
  }

  // 按价格范围筛选
  if (filters.value.priceRange !== 'all') {
    switch (filters.value.priceRange) {
      case 'low':
        result = result.filter(order => order.finalPrice >= 1 && order.finalPrice <= 50);
        break;
      case 'medium':
        result = result.filter(order => order.finalPrice > 50 && order.finalPrice <= 100);
        break;
      case 'high':
        result = result.filter(order => order.finalPrice > 100 && order.finalPrice <= 300);
        break;
      case 'premium':
        result = result.filter(order => order.finalPrice > 300);
        break;
    }
  }

  // 按时间排序（从新到旧）
  return result.sort((a, b) => b.createTime.getTime() - a.createTime.getTime());
});

// 筛选结果数量
const filteredCount = computed(() => {
  return filteredOrders.value.length;
});

// 空状态文本
const emptyStateMessage = computed(() => {
  if (currentTab.value === 'all') {
    return '暂无订单记录';
  } else {
    return `暂无${getStatusText(currentTab.value)}订单`;
  }
});

// 格式化日期
const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm');
};

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待付款';
    case 'processing': return '处理中';
    case 'completed': return '已完成';
    case 'cancelled': return '已取消';
    case 'refunded': return '已退款';
    default: return '未知状态';
  }
};

// 切换标签
const changeTab = (tab: string) => {
  currentTab.value = tab;
};

// 设置时间范围
const setTimeRange = (range: string) => {
  filters.value.timeRange = range;
};

// 设置价格范围
const setPriceRange = (range: string) => {
  filters.value.priceRange = range;
};

// 重置筛选
const resetFilters = () => {
  filters.value = {
    timeRange: 'all',
    priceRange: 'all'
  };
};

// 应用筛选
const applyFilters = () => {
  showFilter.value = false;
};

// 跳转到订单详情
const navigateToDetail = (orderId: string) => {
  router.push(`/profile/orders/${orderId}`);
};

// 跳转到首页
const navigateToHome = () => {
  router.push('/');
};

// 加载更多
const loadMore = () => {
  // 模拟加载更多
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    hasMore.value = false; // 模拟没有更多数据
  }, 1000);
};

// 登录成功回调
const onLoginSuccess = () => {
  // 刷新数据
  loadOrderData();
};

// 加载订单数据
const loadOrderData = () => {
  // 实际项目中，这里会从API获取数据
  loading.value = true;
  setTimeout(() => {
    // 更新标签数量
    tabs.value.forEach(tab => {
      if (tab.value === 'all') {
        tab.count = allOrders.value.length;
      } else {
        tab.count = allOrders.value.filter(o => o.status === tab.value).length;
      }
    });
    loading.value = false;
  }, 500);
};

onMounted(() => {
  // 加载订单数据
  if (auth.userInfo.isLoggedIn) {
    loadOrderData();
  }
});
</script>

<style scoped>
/* 订单页面容器 */
.orders-view {
  min-height: 100vh;
  background-color: #f9f7fe;
  padding-bottom: 80px;
}

/* 登录提示样式 */
.login-prompt-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 32px;
  text-align: center;
}

.login-prompt-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.login-prompt-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.login-prompt-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  max-width: 280px;
  line-height: 1.5;
}

.login-prompt-button {
  background-color: #9966FF;
  color: white;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(153, 102, 255, 0.3);
}

.login-prompt-button:hover {
  background-color: #8a4dff;
  box-shadow: 0 6px 16px rgba(153, 102, 255, 0.4);
}

/* 修改顶部栏样式，参考AboutView.vue的样式 */
.orders-view .custom-header {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

.orders-view .back-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.orders-view .back-button:active {
  background-color: rgba(0, 0, 0, 0.05);
}

.orders-view .page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
  flex: 1;
}

.orders-view .right-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.orders-view .right-action:active {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 修改订单卡片样式 */
.order-card {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeIn 0.3s ease-out;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.order-card-status {
  font-size: 14px;
  font-weight: 500;
  color: #9966FF;
}

.order-card-content {
  display: flex;
  padding: 16px;
  position: relative;
}

.order-card-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f7fe;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-card-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f9f7fe;
}

.order-card-info {
  flex: 1;
  margin-left: 16px;
  overflow: hidden;
}

.order-card-time {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.order-card-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-card-photos {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.order-card-price {
  margin-top: 4px;
}

.order-card-original-price {
  font-size: 13px;
  color: #999;
  margin-bottom: 2px;
}

.order-card-final-price {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.order-card-action {
  position: absolute;
  right: 16px;
  bottom: 16px;
}

.order-card-action-button {
  background-color: #9966FF;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(153, 102, 255, 0.2);
  transition: all 0.2s ease;
}

.order-card-action-button:hover {
  background-color: #8a4dff;
  box-shadow: 0 4px 8px rgba(153, 102, 255, 0.3);
}

/* 统一筛选器颜色 */
.orders-filter-option.selected {
  background-color: #9966FF;
  color: white;
}

.orders-filter-btn-apply {
  background-color: #9966FF;
}
</style>
