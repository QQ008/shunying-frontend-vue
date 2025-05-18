<template>
  <div class="order-detail-view">
    <!-- 参考AboutView的顶部栏设计 -->
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">订单详情</h1>
      <div class="right-placeholder"></div>
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
      <p class="login-prompt-desc">登录后查看您的订单详情</p>
      <button class="login-prompt-button" @click="showLoginModal = true">
        立即登录
      </button>
    </div>

    <!-- 已登录状态显示 -->
    <div v-else>
      <!-- 加载中状态 -->
      <div v-if="loading" class="orders-loading">
        <div class="orders-loading-spinner"></div>
      </div>

      <!-- 内容区域 -->
      <template v-else-if="order">
        <!-- 订单状态横幅 -->
        <div class="order-detail-status-banner">
          <div class="order-detail-status-header">
            <div class="order-detail-status-text">{{ getStatusText(order.status) }}</div>
            <div class="order-detail-order-id">订单号: {{ order.id }}</div>
          </div>
          <div class="order-detail-time">下单时间: {{ formatDate(order.createTime) }}</div>

          <!-- 订单进度条 -->
          <div class="order-detail-progress">
            <div class="order-detail-progress-bar">
              <div
                class="order-detail-progress-fill"
                :style="{ width: progressWidth }"
              ></div>

              <div
                v-for="(step, index) in progressSteps"
                :key="index"
                class="order-detail-progress-step"
                :class="{
                  active: currentStepIndex === index,
                  complete: currentStepIndex > index
                }"
              >
                <div class="order-detail-progress-dot">
                  <svg v-if="currentStepIndex > index" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
                <div class="order-detail-progress-label">{{ step.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单详情卡片 -->
        <div class="order-detail-card">
          <!-- 如果是待付款状态，显示支付倒计时 -->
          <div v-if="order.status === 'pending'" class="order-detail-countdown-section">
            <div class="order-detail-section-title">支付倒计时</div>
            <div class="order-detail-countdown-timer">
              <div class="order-detail-time-block">{{ countdown.hours }}</div>
              <div class="order-detail-time-separator">:</div>
              <div class="order-detail-time-block">{{ countdown.minutes }}</div>
              <div class="order-detail-time-separator">:</div>
              <div class="order-detail-time-block">{{ countdown.seconds }}</div>
            </div>
          </div>

          <!-- 如果是已完成状态，显示下载码 -->
          <div v-if="order.status === 'completed'" class="order-detail-download-section">
            <div class="order-detail-section-title">下载提取码</div>
            <div class="order-detail-code-container">
              <div class="order-detail-code-value">{{ order.downloadCode }}</div>
              <button class="order-detail-copy-btn" @click="copyDownloadCode">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="#9966FF"/>
                </svg>
                复制
              </button>
            </div>
            <div v-if="showCopiedMessage" class="order-detail-code-message">已复制到剪贴板</div>
          </div>

          <!-- 价格信息部分 -->
          <div class="order-detail-price-section">
            <div class="order-detail-section-title">价格明细</div>
            <div class="order-detail-price-list">
              <div class="order-detail-price-item">
                <div class="order-detail-price-label">原始价格</div>
                <div class="order-detail-price-value">￥{{ order.originalPrice.toFixed(2) }}</div>
              </div>
              <div v-if="order.discountAmount > 0" class="order-detail-price-item">
                <div class="order-detail-price-label">优惠折扣</div>
                <div class="order-detail-price-value discount">-￥{{ order.discountAmount.toFixed(2) }}</div>
              </div>
              <div class="order-detail-price-item total">
                <div class="order-detail-price-label">实付金额</div>
                <div class="order-detail-price-value">￥{{ order.finalPrice.toFixed(2) }}</div>
              </div>
            </div>
            <div v-if="order.paymentMethod" class="order-detail-payment-method">
              支付方式：{{ order.paymentMethod }}
            </div>
          </div>

          <!-- 图片列表部分 -->
          <div class="order-detail-photo-section">
            <div class="order-detail-section-title">已选照片 <span class="order-detail-photo-count">({{ order.photoCount }}张)</span></div>
            <div class="order-detail-photo-grid">
              <div v-for="(photo, index) in photos" :key="index" class="order-detail-photo-item">
                <div class="order-detail-photo-thumb">
                  <img :src="photo.url" :alt="photo.name">
                </div>
                <div class="order-detail-photo-info">
                  <div class="order-detail-photo-name">{{ photo.name }}</div>
                  <div class="order-detail-photo-meta">{{ photo.size }}</div>
                  <div class="order-detail-photo-price">
                    <div v-if="photo.originalPrice !== photo.finalPrice" class="order-detail-price-original">￥{{ photo.originalPrice }}</div>
                    <div class="order-detail-price-final">￥{{ photo.finalPrice }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 优惠详情部分 -->
          <div v-if="discounts.length > 0" class="order-detail-discount-section">
            <div class="order-detail-section-title">优惠详情</div>
            <div class="order-detail-discount-list">
              <div v-for="(discount, index) in discounts" :key="index" class="order-detail-discount-item">
                <div class="order-detail-discount-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#9966FF"/>
                  </svg>
                  <span>{{ discount.name }}</span>
                  <span v-if="discount.type" class="order-detail-discount-badge">{{ discount.type }}</span>
                </div>
                <div class="order-detail-discount-value">-￥{{ discount.value.toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <!-- 订单信息部分 -->
          <div class="order-detail-info-section">
            <div class="order-detail-section-title">订单信息</div>
            <div class="order-detail-info-list">
              <div class="order-detail-info-item">
                <div class="order-detail-info-label">订单号</div>
                <div class="order-detail-info-value">
                  {{ order.id }}
                  <button class="order-detail-info-copy" @click="copyOrderId">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="#9966FF"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="order-detail-info-item">
                <div class="order-detail-info-label">下单时间</div>
                <div class="order-detail-info-value">{{ formatDate(order.createTime) }}</div>
              </div>
              <div v-if="order.paymentTime" class="order-detail-info-item">
                <div class="order-detail-info-label">支付时间</div>
                <div class="order-detail-info-value">{{ formatDate(order.paymentTime) }}</div>
              </div>
              <div v-if="order.completionTime" class="order-detail-info-item">
                <div class="order-detail-info-label">完成时间</div>
                <div class="order-detail-info-value">{{ formatDate(order.completionTime) }}</div>
              </div>
              <div v-if="order.cancelTime" class="order-detail-info-item">
                <div class="order-detail-info-label">取消时间</div>
                <div class="order-detail-info-value">{{ formatDate(order.cancelTime) }}</div>
              </div>
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div class="order-detail-action-section">
            <!-- 待付款状态 -->
            <template v-if="order.status === 'pending'">
              <button class="order-detail-action-btn secondary" @click="cancelOrder">取消订单</button>
              <button class="order-detail-action-btn primary" @click="payOrder">立即付款</button>
            </template>

            <!-- 已完成状态 -->
            <template v-else-if="order.status === 'completed'">
              <button class="order-detail-action-btn secondary" @click="showRefundModal = true">申请售后</button>
              <button class="order-detail-action-btn primary" @click="downloadPhotos">下载照片</button>
            </template>

            <!-- 处理中状态 -->
            <template v-else-if="order.status === 'processing'">
              <button class="order-detail-action-btn secondary" @click="contactCustomerService">联系客服</button>
            </template>

            <!-- 已取消状态 -->
            <template v-else-if="order.status === 'cancelled'">
              <button class="order-detail-action-btn secondary" @click="deleteOrder">删除订单</button>
              <button class="order-detail-action-btn primary" @click="rebuyOrder">重新购买</button>
            </template>
          </div>
        </div>
      </template>

      <!-- 退款/售后弹窗 -->
      <div v-if="showRefundModal" class="order-detail-modal" @click.self="showRefundModal = false">
        <div class="order-detail-modal-content">
          <div class="order-detail-modal-header">
            <h3 class="order-detail-modal-title">申请售后</h3>
            <div class="order-detail-modal-close" @click="showRefundModal = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
              </svg>
            </div>
          </div>

          <div class="order-detail-modal-body">
            <div class="order-detail-refund-options">
              <div
                v-for="(option, index) in refundOptions"
                :key="index"
                class="order-detail-refund-option"
                :class="{ selected: selectedRefundOption === index }"
                @click="selectedRefundOption = index"
              >
                <div class="order-detail-refund-radio"></div>
                <div class="order-detail-refund-info">
                  <div class="order-detail-refund-title">{{ option.title }}</div>
                  <div class="order-detail-refund-desc">{{ option.description }}</div>
                </div>
              </div>
            </div>

            <div class="order-detail-refund-form">
              <div class="order-detail-form-group">
                <label class="order-detail-form-label">
                  申请原因
                  <span>(必填，{{ refundReason.length }}/200)</span>
                </label>
                <textarea
                  class="order-detail-form-textarea"
                  v-model="refundReason"
                  placeholder="请详细描述您的问题或退款原因..."
                  maxlength="200"
                ></textarea>
              </div>

              <button
                class="order-detail-form-submit"
                :disabled="!refundReason.trim() || refundReason.length < 10"
                @click="submitRefund"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录模态框 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="onLoginSuccess"
    />

    <!-- 成功提示 -->
    <div v-if="showToast" class="order-detail-toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import LoginModal from '@/components/LoginModal.vue';
import { format } from 'date-fns';

// 引入样式
import '@/assets/styles/orderDetailView.css';

// 获取路由和认证
const router = useRouter();
const route = useRoute();
const auth = useAuth();

// 登录模态框控制
const showLoginModal = ref(false);
const showRefundModal = ref(false);
const selectedRefundOption = ref(0);
const refundReason = ref('');

// 加载状态
const loading = ref(true);

// 订单ID
const orderId = computed(() => route.params.id as string);

// Toast提示
const showToast = ref(false);
const toastMessage = ref('');
const showToastMessage = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 下载码复制状态
const showCopiedMessage = ref(false);

// 订单类型接口
interface OrderData {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  createTime: Date;
  photoCount: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentDeadline?: Date;
  paymentTime?: Date;
  completionTime?: Date;
  cancelTime?: Date;
  downloadCode?: string;
  paymentMethod?: string;
}

// 模拟订单数据
const order = ref<OrderData | null>(null);

// 模拟照片数据
const photos = ref([
  {
    name: 'IMG_001.jpg',
    url: '/images/photos/sample-1.jpg',
    size: '5.2MB',
    originalPrice: '25.00',
    finalPrice: '20.00'
  },
  {
    name: 'IMG_002.jpg',
    url: '/images/photos/sample-2.jpg',
    size: '4.8MB',
    originalPrice: '25.00',
    finalPrice: '20.00'
  },
  {
    name: 'IMG_003.jpg',
    url: '/images/photos/sample-3.jpg',
    size: '6.1MB',
    originalPrice: '25.00',
    finalPrice: '20.00'
  },
  {
    name: 'IMG_004.jpg',
    url: '/images/photos/sample-4.jpg',
    size: '5.5MB',
    originalPrice: '25.00',
    finalPrice: '20.00'
  },
  {
    name: 'IMG_005.jpg',
    url: '/images/photos/sample-5.jpg',
    size: '4.9MB',
    originalPrice: '25.00',
    finalPrice: '20.00'
  }
]);

// 模拟优惠数据
const discounts = ref([
  { name: '新用户优惠', type: '平台券', value: 15.00 },
  { name: '满100减10', type: '活动券', value: 10.00 }
]);

// 退款选项
const refundOptions = [
  {
    title: '申请退款',
    description: '如果您对购买的照片不满意，可以申请退款。'
  },
  {
    title: '照片质量问题',
    description: '照片存在质量问题（如模糊、曝光不当等）。'
  },
  {
    title: '下载问题',
    description: '无法正常下载照片或下载的照片有问题。'
  },
  {
    title: '其他问题',
    description: '其他售后问题，请在描述中详细说明。'
  }
];

// 进度步骤
const progressSteps = [
  { label: '创建订单' },
  { label: '付款成功' },
  { label: '处理中' },
  { label: '已完成' }
];

// 当前步骤索引
const currentStepIndex = computed(() => {
  if (!order.value) return 0;

  switch (order.value.status) {
    case 'pending': return 0;
    case 'processing': return 2;
    case 'completed': return 3;
    case 'cancelled': return 0;
    case 'refunded': return 0;
    default: return 0;
  }
});

// 进度条宽度
const progressWidth = computed(() => {
  const totalSteps = progressSteps.length - 1;
  const currentStep = currentStepIndex.value;
  const percentage = (currentStep / totalSteps) * 100;
  return `${percentage}%`;
});

// 倒计时数据
const countdown = ref({
  hours: '00',
  minutes: '00',
  seconds: '00'
});

// 倒计时定时器
let countdownTimer: number | null = null;

// 计算倒计时
const calculateCountdown = () => {
  if (!order.value || order.value.status !== 'pending' || !order.value.paymentDeadline) return;

  const now = new Date();
  const deadline = order.value.paymentDeadline;
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    // 超时，订单自动取消
    clearInterval(countdownTimer!);
    order.value.status = 'cancelled';
    order.value.cancelTime = new Date();
    return;
  }

  // 计算小时、分钟和秒
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 格式化时间
  countdown.value = {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
};

// 格式化日期
const formatDate = (date: Date | undefined) => {
  if (!date) return ''; // 处理undefined的情况
  return format(date, 'yyyy-MM-dd HH:mm:ss');
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

// 复制订单ID
const copyOrderId = () => {
  if (!order.value) return;

  navigator.clipboard.writeText(order.value.id)
    .then(() => {
      showToastMessage('订单号已复制到剪贴板');
    });
};

// 复制下载码
const copyDownloadCode = () => {
  if (!order.value || !order.value.downloadCode) return;

  navigator.clipboard.writeText(order.value.downloadCode)
    .then(() => {
      showCopiedMessage.value = true;
      setTimeout(() => {
        showCopiedMessage.value = false;
      }, 3000);
    });
};

// 取消订单
const cancelOrder = () => {
  if (!order.value) return;

  // 实际项目中这里会调用API
  order.value.status = 'cancelled';
  order.value.cancelTime = new Date();
  showToastMessage('订单已取消');
};

// 付款
const payOrder = () => {
  if (!order.value) return;

  // 实际项目中这里会调用支付API
  order.value.status = 'processing';
  order.value.paymentTime = new Date();
  order.value.paymentMethod = '微信支付';
  showToastMessage('支付成功');
};

// 下载照片
const downloadPhotos = () => {
  // 实际项目中这里会调用下载API
  showToastMessage('正在准备下载');
};

// 联系客服
const contactCustomerService = () => {
  router.push('/chat/customer-service');
};

// 删除订单
const deleteOrder = () => {
  // 实际项目中会调用API
  router.push('/profile/orders');
};

// 重新购买
const rebuyOrder = () => {
  // 实际项目中会重新创建订单
  router.push('/profile/orders');
};

// 提交退款
const submitRefund = () => {
  if (!order.value) return;

  const option = refundOptions[selectedRefundOption.value];
  showRefundModal.value = false;
  showToastMessage('退款申请已提交，客服将尽快处理');

  // 实际项目中会调用API提交退款申请
  console.log('提交退款申请', {
    orderId: order.value.id,
    reason: option.title,
    description: refundReason.value
  });
};

// 加载订单数据
const loadOrderData = () => {
  loading.value = true;

  // 实际项目中会从API获取数据
  setTimeout(() => {
    // 模拟数据
    const orderData: OrderData = {
      id: orderId.value,
      status: 'pending',
      createTime: new Date('2024-06-11T14:30:00'),
      photoCount: 5,
      originalPrice: 125.00,
      discountAmount: 25.00,
      finalPrice: 100.00,
      paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时后
      downloadCode: 'DWN123456'
    };

    order.value = orderData;
    loading.value = false;

    // 如果是待付款状态，启动倒计时
    if (orderData.status === 'pending') {
      calculateCountdown();
      countdownTimer = window.setInterval(calculateCountdown, 1000);
    }
  }, 800);
};

// 登录成功回调
const onLoginSuccess = () => {
  loadOrderData();
};

onMounted(() => {
  if (auth.userInfo.isLoggedIn) {
    loadOrderData();
  }
});

onUnmounted(() => {
  // 清除倒计时定时器
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
/* 订单详情页面容器 */
.order-detail-view {
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
</style>
