<template>
  <div class="coupons-view">
    <!-- 顶部导航栏 -->
    <div class="coupons-view-header">
      <div class="coupons-view-back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333333"/>
        </svg>
      </div>
      <h1 class="coupons-view-page-title">我的优惠</h1>
      <div class="coupons-view-rule-button" @click="showGlobalRules = true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 17C11.45 17 11 16.55 11 16C11 15.45 11.45 15 12 15C12.55 15 13 15.45 13 16C13 16.55 12.55 17 12 17ZM13 13H11V7H13V13Z" fill="#9966FF"/>
        </svg>
        <span>使用规则</span>
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="coupons-view-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="coupons-view-tab"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="getCouponCount(tab.value) > 0" class="count">({{ getCouponCount(tab.value) }})</span>
      </div>
    </div>

    <!-- 优惠券列表容器 -->
    <div class="coupons-view-container">
      <!-- 特殊优惠区域 -->
      <template v-if="activeTab === 'valid' && specialOffers && specialOffers.length > 0">
        <h2 class="coupons-view-section-title">专享优惠</h2>

        <!-- 优惠卡片 -->
        <div v-for="offer in specialOffers" :key="offer.id" class="coupons-view-special-offer">
          <div class="coupons-view-special-card-bg"></div>
          <div class="coupons-view-special-card-inner">
            <div class="coupons-view-offer-name">{{ offer.name }}</div>
            <div class="coupons-view-offer-value">
              <template v-if="offer.discountType === 'amount'">{{ offer.value }}元优惠</template>
              <template v-else-if="offer.discountType === 'percentage'">{{ offer.value }}折优惠</template>
              <template v-else-if="offer.discountType === 'combo'">满{{ offer.threshold }}减{{ offer.value }}元</template>
            </div>
            <div class="coupons-view-offer-desc">{{ offer.description }}</div>

            <div class="coupons-view-offer-footer">
              <div class="coupons-view-countdown" v-if="offer.endDate && offer.isNewUser">
                <span>剩余时间：</span>
                <div class="coupons-view-countdown-timer">
                  <span class="coupons-view-time-block">{{ getCountdown(offer.endDate).days }}</span>
                  <span class="coupons-view-time-separator">天</span>
                  <span class="coupons-view-time-block">{{ getCountdown(offer.endDate).hours }}</span>
                  <span class="coupons-view-time-separator">:</span>
                  <span class="coupons-view-time-block">{{ getCountdown(offer.endDate).minutes }}</span>
                  <span class="coupons-view-time-separator">:</span>
                  <span class="coupons-view-time-block">{{ getCountdown(offer.endDate).seconds }}</span>
                </div>
              </div>
              <div v-else-if="!offer.isNewUser" class="coupons-view-offer-tag">
                长期有效
              </div>
              <button class="coupons-view-use-now-btn" @click="useSpecialOffer(offer)">立即使用</button>
            </div>
          </div>
        </div>

        <h2 class="coupons-view-section-title">我的优惠券</h2>
      </template>

      <!-- 优惠券列表 -->
      <template v-if="filteredCoupons.length > 0">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupons-view-coupon-card"
          :class="{ expired: coupon.status === 'expired' }"
        >
          <!-- 优惠券左侧 -->
          <div class="coupons-view-coupon-left">
            <div class="coupons-view-coupon-amount" v-if="coupon.discountType === 'amount'">
              <span class="coupons-view-currency">¥</span>
              <span class="coupons-view-value">{{ coupon.value }}</span>
            </div>
            <div class="coupons-view-coupon-amount" v-else-if="coupon.discountType === 'percentage'">
              <span class="coupons-view-value">{{ coupon.value }}</span>
              <span class="coupons-view-unit">折</span>
            </div>
            <div class="coupons-view-coupon-condition">{{ coupon.condition }}</div>
          </div>

          <!-- 优惠券右侧 -->
          <div class="coupons-view-coupon-right">
            <div class="coupons-view-coupon-name">{{ coupon.name }}</div>
            <div class="coupons-view-coupon-scope">
              <span class="coupons-view-scope-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#9966FF"/>
                </svg>
              </span>
              {{ getCouponScope(coupon) }}
            </div>
            <div class="coupons-view-coupon-validity">
              <span class="coupons-view-calendar-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 12H7V14H9V12ZM13 12H11V14H13V12ZM17 12H15V14H17V12ZM9 16H7V18H9V16ZM13 16H11V18H13V16ZM17 16H15V18H17V16Z" fill="#999999"/>
                </svg>
              </span>
              {{ formatDateRange(coupon.startDate, coupon.endDate) }}
            </div>
            <div class="coupons-view-rule-link" @click="showCouponDetail(coupon)">
              <span>查看使用规则</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#9966FF"/>
              </svg>
            </div>
          </div>

          <!-- 使用按钮 -->
          <div class="coupons-view-coupon-action">
            <button
              v-if="coupon.status === 'valid'"
              class="coupons-view-use-button"
              @click="useCoupon(coupon)"
            >
              去使用
            </button>
            <div v-else-if="coupon.status === 'expired'" class="coupons-view-expired-label">已过期</div>
            <div v-else-if="coupon.status === 'used'" class="coupons-view-used-label">已使用</div>
          </div>

          <!-- 优惠券标签 -->
          <div v-if="coupon.isRepeatable" class="coupons-view-coupon-tag coupons-view-tag-repeatable">可重复使用</div>
          <div v-if="coupon.type === 'group'" class="coupons-view-coupon-tag coupons-view-tag-combo">组合专享</div>
          <div v-if="coupon.isNew" class="coupons-view-coupon-tag coupons-view-tag-new">新人专享</div>
        </div>
      </template>

      <!-- 空状态 -->
      <div v-else class="coupons-view-empty">
        <div class="coupons-view-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6H17.82C17.93 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C13.95 2 13.04 2.54 12.5 3.35L12 4L11.5 3.34C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5C6 5.35 6.07 5.69 6.18 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM15 4C15.55 4 16 4.45 16 5C16 5.55 15.55 6 15 6C14.45 6 14 5.55 14 5C14 4.45 14.45 4 15 4ZM9 4C9.55 4 10 4.45 10 5C10 5.55 9.55 6 9 6C8.45 6 8 5.55 8 5C8 4.45 8.45 4 9 4ZM20 19H4V17H20V19ZM20 14H4V8H9.08L7 10.83L8.62 12L11 8.76L12 7.4L13 8.76L15.38 12L17 10.83L14.92 8H20V14Z" fill="#CCCCCC"/>
          </svg>
        </div>
        <p class="coupons-view-empty-text">暂无{{ getTabLabel(activeTab) }}优惠券</p>
        <p class="coupons-view-empty-subtext">去首页看看更多精彩活动吧</p>
        <button class="coupons-view-explore-button" @click="navigateTo('/')">去首页逛逛</button>
      </div>
    </div>

    <!-- 全局优惠规则弹窗 -->
    <div class="coupons-view-modal" v-if="showGlobalRules" @click.self="showGlobalRules = false">
      <div class="coupons-view-modal-content rules-modal">
        <div class="coupons-view-modal-header">
          <h3>优惠券使用规则</h3>
          <div class="coupons-view-close-button" @click="showGlobalRules = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
            </svg>
          </div>
        </div>
        <div class="coupons-view-modal-body">
          <div class="coupons-view-rule-section">
            <h4>优惠券类型说明</h4>
            <div class="coupons-view-rule-item">
              <div class="coupons-view-rule-title">全局折扣</div>
              <div class="coupons-view-rule-desc">适用于全站所有商品，可直接抵扣相应金额或折扣。部分优惠券可重复使用。</div>
            </div>
            <div class="coupons-view-rule-item">
              <div class="coupons-view-rule-title">满减优惠</div>
              <div class="coupons-view-rule-desc">订单满足特定金额条件时可使用，减免固定金额。</div>
            </div>
            <div class="coupons-view-rule-item">
              <div class="coupons-view-rule-title">组合优惠</div>
              <div class="coupons-view-rule-desc">在同一图片组内购买多张照片时可享受的专属优惠。</div>
            </div>
          </div>

          <div class="coupons-view-rule-section">
            <h4>使用须知</h4>
            <ul class="coupons-view-rule-list">
              <li>优惠券仅限在有效期内使用</li>
              <li>部分优惠券不可与其他优惠同时使用</li>
              <li>新人优惠券仅限新注册用户使用</li>
              <li>优惠券不可兑换现金，不设找零</li>
              <li>在符合条件的情况下，系统会自动为您匹配最优惠的组合</li>
              <li>特殊活动期间的优惠券可能有额外限制条件，请以实际优惠券说明为准</li>
              <li>瞬影保留对优惠券规则的最终解释权</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠券详情弹窗 -->
    <div class="coupons-view-modal" v-if="selectedCoupon" @click.self="selectedCoupon = null">
      <div class="coupons-view-modal-content coupons-view-coupon-detail-modal">
        <div class="coupons-view-modal-header">
          <h3>优惠券详情</h3>
          <div class="coupons-view-close-button" @click="selectedCoupon = null">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
            </svg>
          </div>
        </div>
        <div class="coupons-view-modal-body" v-if="selectedCoupon">
          <div class="coupons-view-coupon-detail-header">
            <div class="coupons-view-coupon-amount" v-if="selectedCoupon.discountType === 'amount'">
              <span class="coupons-view-currency">¥</span>
              <span class="coupons-view-value">{{ selectedCoupon.value }}</span>
            </div>
            <div class="coupons-view-coupon-amount" v-else-if="selectedCoupon.discountType === 'percentage'">
              <span class="coupons-view-value">{{ selectedCoupon.value }}</span>
              <span class="coupons-view-unit">折</span>
            </div>
            <div class="coupons-view-coupon-name-large">{{ selectedCoupon.name }}</div>
            <div class="coupons-view-coupon-condition">{{ selectedCoupon.condition }}</div>
          </div>

          <div class="coupons-view-coupon-detail-info">
            <div class="coupons-view-info-row">
              <div class="coupons-view-info-label">优惠券类型</div>
              <div class="coupons-view-info-value">{{ getCouponTypeName(selectedCoupon.type) }}</div>
            </div>
            <div class="coupons-view-info-row">
              <div class="coupons-view-info-label">使用范围</div>
              <div class="coupons-view-info-value">{{ getCouponScope(selectedCoupon) }}</div>
            </div>
            <div class="coupons-view-info-row">
              <div class="coupons-view-info-label">有效期</div>
              <div class="coupons-view-info-value">{{ formatDateRange(selectedCoupon.startDate, selectedCoupon.endDate) }}</div>
            </div>
            <div class="coupons-view-info-row" v-if="selectedCoupon.usageLimit">
              <div class="coupons-view-info-label">使用次数</div>
              <div class="coupons-view-info-value">{{ selectedCoupon.isRepeatable ? `限${selectedCoupon.usageLimit}次` : '限1次' }}</div>
            </div>
          </div>

          <div class="coupons-view-detail-rule-section">
            <h4>使用规则</h4>
            <div class="coupons-view-detail-rule-content">
              {{ selectedCoupon.detailedRules || '无特殊使用规则' }}
            </div>
          </div>

          <div class="coupons-view-action-button-container">
            <button
              v-if="selectedCoupon.status === 'valid'"
              class="coupons-view-action-button"
              @click="useCoupon(selectedCoupon)"
            >
              立即使用
            </button>
            <button
              v-else
              class="coupons-view-action-button disabled"
              disabled
            >
              {{ selectedCoupon.status === 'expired' ? '已过期' : '已使用' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import '@/assets/styles/couponsView.css';

const router = useRouter();
const auth = useAuth();

// 优惠券类型
interface Coupon {
  id: string;
  name: string;
  type: 'global' | 'order' | 'group'; // 全局折扣、满减优惠、组合优惠
  discountType: 'amount' | 'percentage'; // 金额或折扣百分比
  value: number; // 优惠金额或折扣百分比
  condition: string; // 使用条件描述
  scope: string; // 使用范围
  startDate: Date;
  endDate: Date;
  status: 'valid' | 'used' | 'expired'; // 有效、已使用、已过期
  isRepeatable: boolean; // 是否可重复使用
  usageLimit?: number; // 使用次数限制
  usageCount?: number; // 已使用次数
  isNew?: boolean; // 是否新人专享
  detailedRules?: string; // 详细规则说明
}

// 特殊优惠类型
interface SpecialOffer {
  id: string;
  name: string;
  discountType: 'amount' | 'percentage' | 'combo'; // 金额、折扣百分比、组合优惠
  value: number; // 优惠值
  threshold?: number; // 满减门槛（适用于combo类型）
  description: string; // 优惠描述
  scope: string; // 适用范围
  startDate: Date;
  endDate: Date;
  isNewUser?: boolean; // 是否新用户专享
}

// 选项卡配置（删除全部选项）
const tabs = [
  { label: '可用', value: 'valid' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' }
];

// 状态变量（默认显示可用选项卡）
const activeTab = ref('valid');
const showGlobalRules = ref(false);
const selectedCoupon = ref<Coupon | null>(null);
const countdownTimer = ref<number | null>(null);
const now = ref(new Date());

// 模拟的特殊优惠数据
const specialOffers = ref<SpecialOffer[]>([
  {
    id: 'special-001',
    name: '新人专享礼包',
    discountType: 'percentage',
    value: 8,
    description: '注册7天内用户可享全场8折优惠，任意照片均可使用',
    scope: '全场通用',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后到期
    isNewUser: true
  },
  {
    id: 'special-002',
    name: '图片组合优惠',
    discountType: 'combo',
    value: 35,
    threshold: 3,
    description: '同一图片组内购买3张及以上照片，立减35元',
    scope: '同一图片组内使用',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后到期
  }
]);

// 模拟的优惠券数据
const coupons = ref<Coupon[]>([
  {
    id: '1001',
    name: '新人专享优惠',
    type: 'global',
    discountType: 'amount',
    value: 20,
    condition: '无门槛',
    scope: '全场通用',
    startDate: new Date(2023, 6, 1),
    endDate: new Date(2023, 11, 31),
    status: 'valid',
    isRepeatable: false,
    isNew: true,
    detailedRules: '1. 限新注册用户使用\n2. 无使用门槛，下单即可抵扣\n3. 不可与其他优惠券叠加使用\n4. 每个账户仅可使用一次'
  },
  {
    id: '1002',
    name: '全场满减券',
    type: 'order',
    discountType: 'amount',
    value: 50,
    condition: '满200元可用',
    scope: '全场通用',
    startDate: new Date(2023, 6, 15),
    endDate: new Date(2023, 10, 30),
    status: 'valid',
    isRepeatable: false,
    detailedRules: '1. 订单满200元可用\n2. 仅限购买照片使用\n3. 不可与其他满减优惠同时使用\n4. 使用期间如取消订单，优惠券将自动退回'
  },
  {
    id: '1003',
    name: '组合购券',
    type: 'group',
    discountType: 'percentage',
    value: 8.5,
    condition: '同组照片3张以上',
    scope: '同一图片组内使用',
    startDate: new Date(2023, 7, 1),
    endDate: new Date(2023, 9, 30),
    status: 'valid',
    isRepeatable: true,
    usageLimit: 5,
    usageCount: 2,
    detailedRules: '1. 在同一图片组内购买3张或以上照片时可用\n2. 使用后所有照片享受8.5折优惠\n3. 可与其他满减优惠同时使用\n4. 单个账户可使用5次'
  },
  {
    id: '1004',
    name: '生日特惠券',
    type: 'global',
    discountType: 'amount',
    value: 30,
    condition: '满100元可用',
    scope: '全场通用',
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 8, 30),
    status: 'used',
    isRepeatable: false,
    detailedRules: '1. 用户生日月专享优惠\n2. 订单满100元可用\n3. 不可与其他满减优惠同时使用\n4. 每位用户生日月仅可使用一次'
  },
  {
    id: '1005',
    name: '会员日折扣',
    type: 'global',
    discountType: 'percentage',
    value: 7.5,
    condition: '无门槛',
    scope: '全场通用',
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 6, 30),
    status: 'expired',
    isRepeatable: false,
    detailedRules: '1. 会员日专享优惠\n2. 无使用门槛，下单即可享受7.5折优惠\n3. 不可与其他折扣优惠同时使用\n4. 使用有效期为会员日当天'
  }
]);

// 根据当前选项卡筛选优惠券
const filteredCoupons = computed(() => {
  return coupons.value.filter(coupon => coupon.status === activeTab.value);
});

// 获取每个标签下优惠券的数量
const getCouponCount = (tabValue: string) => {
  return coupons.value.filter(coupon => coupon.status === tabValue).length;
};

// 获取选项卡标签
const getTabLabel = (tabValue: string) => {
  const tab = tabs.find(t => t.value === tabValue);
  return tab ? tab.label : '';
};

// 格式化日期范围
const formatDateRange = (startDate: Date, endDate: Date) => {
  const start = `${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()}`;
  const end = `${endDate.getFullYear()}.${endDate.getMonth() + 1}.${endDate.getDate()}`;
  return `${start} - ${end}`;
};

// 获取优惠券使用范围描述
const getCouponScope = (coupon: Coupon) => {
  if (coupon.type === 'group') {
    return '限同一图片组内使用';
  }
  return coupon.scope || '全场通用';
};

// 获取优惠券类型名称
const getCouponTypeName = (type: string) => {
  const types: Record<string, string> = {
    'global': '全局折扣',
    'order': '满减优惠',
    'group': '组合优惠'
  };
  return types[type] || '未知类型';
};

// 倒计时计算
const getCountdown = (endDate: Date) => {
  const diff = Math.max(0, endDate.getTime() - now.value.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
  const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

  return { days, hours, minutes, seconds };
};

// 启动倒计时
const startCountdown = () => {
  countdownTimer.value = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
};

// 清除倒计时
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
});

// 展示优惠券详情
const showCouponDetail = (coupon: Coupon) => {
  selectedCoupon.value = coupon;
};

// 使用优惠券
const useCoupon = (coupon: Coupon) => {
  // 根据优惠券类型跳转到不同页面
  if (coupon.type === 'group') {
    router.push('/search'); // 跳转到搜索页，查找图片组
  } else {
    router.push('/'); // 跳转到首页
  }
};

// 使用特殊优惠
const useSpecialOffer = (offer: SpecialOffer) => {
  if (offer.discountType === 'combo') {
    router.push('/search'); // 组合优惠跳转到搜索页
  } else {
    router.push('/'); // 其他优惠跳转到首页
  }
};

// 页面导航
const navigateTo = (path: string) => {
  router.push(path);
};

// 模拟加载用户优惠券数据
const loadUserCoupons = () => {
  // 实际项目中会从API获取数据
  console.log('用户ID:', auth.userInfo.userId);
  // 模拟后端数据加载
  setTimeout(() => {
    // 这里不做任何实际操作，因为我们已经有了模拟数据
  }, 500);
};

// 页面加载时获取优惠券数据
onMounted(() => {
  loadUserCoupons();
  startCountdown(); // 启动倒计时
});
</script>
