<template>
  <div class="points-view">
    <!-- 自定义顶部栏 -->
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">我的积分</h1>
      <div class="right-placeholder"></div>
    </div>

    <!-- 积分卡片 -->
    <div class="points-card">
      <div class="card-wave"></div>
      <div class="points-amount">
        <h2>{{ userPoints }}</h2>
        <p>可用积分</p>
      </div>
      <div class="points-actions">
        <button class="exchange-btn" @click="scrollToExchange">兑换服务</button>
      </div>
    </div>

    <!-- 功能区域 -->
    <div class="function-blocks">
      <div class="function-block" @click="showOrderDiscountModal = true">
        <div class="function-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 7L12 13L21 7" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="function-text">积分说明</div>
      </div>
      <div class="function-block" @click="scrollToExchange">
        <div class="function-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 9L9 15" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 9L15 15" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="function-text">积分兑换</div>
      </div>
      <div class="function-block" @click="scrollToHistory">
        <div class="function-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 13H8" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17H8" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 9H9H8" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="function-text">积分明细</div>
      </div>
      <div class="function-block" @click="scrollToRules">
        <div class="function-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16V12" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8H12.01" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="function-text">获取规则</div>
      </div>
    </div>

    <!-- 积分获取方式 -->
    <div ref="rulesSection" class="section rules-section">
      <h3 class="section-title">如何获取积分</h3>
      <div class="rules-list">
        <div
          v-for="(rule, index) in pointsRules"
          :key="index"
          class="rule-item"
          :class="{ expanded: expandedRules.includes(index) }"
          @click="toggleRule(index)"
        >
          <div class="rule-header">
            <div class="rule-icon-title">
              <div class="rule-icon">
                <svg v-if="rule.iconType === 'register'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="rule.iconType === 'purchase'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="rule.iconType === 'share'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.59 13.51L15.42 17.49" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.41 6.51L8.59 10.49" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="rule.iconType === 'invite'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="rule.iconType === 'comment'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else-if="rule.iconType === 'sign'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 13L11 15L15 11" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="rule-title">
                <h4>{{ rule.title }}</h4>
                <div class="rule-points">+{{ rule.points }}</div>
              </div>
            </div>
            <div class="rule-status">
              <span v-if="rule.completed" class="status-completed">已完成</span>
              <span v-else-if="rule.type === 'once'" class="status-incomplete">未完成</span>
              <span v-else-if="rule.type === 'daily'" class="status-count">{{ rule.todayCount || 0 }}/{{ rule.maxDaily }}</span>
            </div>
            <div class="rule-toggle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9L12 16L5 9" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="rule-content">
            <p>{{ rule.description }}</p>
            <div v-if="rule.details" class="rule-details">
              <div v-for="(detail, detailIndex) in rule.details" :key="detailIndex" class="rule-detail-item">
                <span class="detail-label">{{ detail.label }}:</span>
                <span class="detail-value">{{ detail.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 积分兑换服务 -->
    <div ref="exchangeSection" class="section exchange-section">
      <h3 class="section-title">积分兑换</h3>
      <div class="exchange-options">
        <div class="exchange-item" v-for="(option, index) in exchangeOptions" :key="index">
          <div class="exchange-content">
            <div class="exchange-icon">
              <svg v-if="option.iconType === 'photo'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 15L16 10L5 21" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="option.iconType === 'editing'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="option.iconType === 'coupon'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12V22H4V12" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 7H2V12H22V7Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 22V7" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="option.iconType === 'vip'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11L10 8" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11L14 8" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="exchange-details">
              <h4>{{ option.title }}</h4>
              <p>{{ option.description }}</p>
              <div class="exchange-cost">{{ option.points }}积分</div>
            </div>
          </div>
          <button
            class="exchange-now-btn"
            :class="{ exchanged: option.exchanged }"
            :disabled="userPoints < option.points || option.exchanged"
            @click="exchangeItem(option, index)"
          >
            {{ option.exchanged ? '已兑换' : '兑换' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 积分历史记录 -->
    <div ref="historySection" class="section">
      <div class="section-header">
        <h3 class="section-title">积分记录</h3>
        <div class="filter-selector">
          <span :class="{ active: timeFilter === 'all' }" @click="timeFilter = 'all'">全部</span>
          <span :class="{ active: timeFilter === 'month' }" @click="timeFilter = 'month'">本月</span>
        </div>
      </div>
      <div class="points-history">
        <div v-if="filteredHistory.length === 0" class="empty-history">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#ccc" stroke-width="2"/>
            <path d="M8 12H16" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>暂无积分记录</p>
        </div>
        <div class="history-item" v-for="(item, index) in displayedHistory" :key="index">
          <div class="history-content">
            <h4>{{ item.title }}</h4>
            <p>{{ item.date }}</p>
          </div>
          <div class="history-points" :class="{ increase: item.type === 'increase', decrease: item.type === 'decrease' }">
            {{ item.type === 'increase' ? '+' : '-' }}{{ item.points }}
          </div>
        </div>
        <div v-if="filteredHistory.length > initialDisplayCount" class="view-more" @click="toggleHistoryView">
          <span>{{ showAllHistory ? '收起' : '查看全部' }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="showAllHistory ? 'M19 15L12 8L5 15' : 'M19 9L12 16L5 9'" stroke="#9358FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 积分抵扣订单模态框 -->
    <div class="modal-overlay" v-if="showOrderDiscountModal" @click="showOrderDiscountModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>积分抵扣说明</h3>
          <div class="modal-close" @click="showOrderDiscountModal = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="modal-body">
          <div class="discount-info">
            <p>积分可在订单支付页面抵扣部分金额，抵扣规则如下：</p>
            <div class="discount-rule">
              <div class="rule-item">
                <span class="rule-icon">·</span>
                <span class="rule-text">100积分 = ¥1.00</span>
              </div>
              <div class="rule-item">
                <span class="rule-icon">·</span>
                <span class="rule-text">最高可抵扣订单金额的30%</span>
              </div>
              <div class="rule-item">
                <span class="rule-icon">·</span>
                <span class="rule-text">积分不可与其他优惠券同时使用</span>
              </div>
              <div class="rule-item">
                <span class="rule-icon">·</span>
                <span class="rule-text">积分抵扣后不予退还</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-confirm" @click="showOrderDiscountModal = false">我知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()
const userPoints = ref(1250)
const timeFilter = ref('all')
const initialDisplayCount = ref(3)
const showAllHistory = ref(false)
const expandedRules = ref<number[]>([])
const rulesSection = ref<HTMLElement | null>(null)
const historySection = ref<HTMLElement | null>(null)
const exchangeSection = ref<HTMLElement | null>(null)

// 订单抵扣模态框
const showOrderDiscountModal = ref(false)
// const orderTotal = ref(199)
const pointsToUse = ref(0)
// const maxDiscount = computed(() => {
//   // 最多抵扣订单总额的30%
//   return Math.min(orderTotal.value * 0.3, userPoints.value / 100)
// })

// 积分获取规则
const pointsRules = ref([
  {
    iconType: 'register',
    title: '注册奖励',
    description: '新用户注册并完成首次登录即可获得积分奖励，每个账号仅可获得一次。',
    points: 100,
    type: 'once',
    completed: true,
    details: [
      { label: '奖励条件', value: '完成注册并首次登录' },
      { label: '积分数量', value: '100积分' },
      { label: '有效期', value: '永久有效' }
    ]
  },
  {
    iconType: 'purchase',
    title: '照片购买',
    description: '购买照片时可获得积分回馈，积分数量与消费金额挂钩。多买多得，无上限。',
    points: '1/元',
    type: 'normal',
    details: [
      { label: '奖励比例', value: '每消费1元获得1积分' },
      { label: '计算方式', value: '按实付金额计算' },
      { label: '到账时间', value: '订单完成后立即到账' }
    ]
  },
  {
    iconType: 'share',
    title: '分享奖励',
    description: '将购买的照片分享到社交平台，获得额外积分奖励。每日最多获取3次分享奖励。',
    points: 10,
    type: 'daily',
    maxDaily: 3,
    todayCount: 1,
    details: [
      { label: '单次奖励', value: '10积分/次' },
      { label: '每日上限', value: '3次（共30积分）' },
      { label: '有效分享', value: '微信、微博等主流平台' }
    ]
  },
  {
    iconType: 'invite',
    title: '邀请好友',
    description: '邀请好友注册成功并完成首次购买，邀请人和被邀请人均可获得积分奖励。',
    points: 50,
    type: 'ladder',
    completed: false,
    details: [
      { label: '基础奖励', value: '好友注册成功：20积分' },
      { label: '额外奖励', value: '好友首次购买：+30积分' },
      { label: '阶梯奖励', value: '累计邀请5人：额外100积分' }
    ]
  },
  {
    iconType: 'comment',
    title: '评价反馈',
    description: '对已购买的照片或服务进行评价，提供有价值的反馈意见，获得积分奖励。',
    points: 5,
    type: 'daily',
    maxDaily: 3,
    todayCount: 2,
    details: [
      { label: '单次奖励', value: '5积分/次' },
      { label: '每日上限', value: '3次（共15积分）' },
      { label: '有效评价', value: '至少10字以上的文字评价' }
    ]
  },
  {
    iconType: 'sign',
    title: '每日签到',
    description: '每日登录签到可获得积分奖励，连续签到可获得额外奖励。',
    points: '3-10',
    type: 'daily',
    maxDaily: 1,
    todayCount: 1,
    completed: true,
    details: [
      { label: '基础奖励', value: '3积分/天' },
      { label: '连续签到', value: '7天：+10积分' },
      { label: '连续签到', value: '30天：+50积分' }
    ]
  }
])

// 积分历史记录
const pointsHistory = ref([
  {
    title: '购买照片',
    date: '2023-10-01 15:30',
    points: 25,
    type: 'increase'
  },
  {
    title: '兑换修图服务',
    date: '2023-09-28 09:15',
    points: 200,
    type: 'decrease'
  },
  {
    title: '分享照片奖励',
    date: '2023-09-25 18:45',
    points: 10,
    type: 'increase'
  },
  {
    title: '邀请好友注册',
    date: '2023-09-20 12:30',
    points: 50,
    type: 'increase'
  },
  {
    title: '每日签到',
    date: '2023-09-18 08:10',
    points: 3,
    type: 'increase'
  },
  {
    title: '评价反馈奖励',
    date: '2023-09-15 16:22',
    points: 5,
    type: 'increase'
  },
  {
    title: '连续签到奖励',
    date: '2023-09-14 09:05',
    points: 10,
    type: 'increase'
  },
  {
    title: '兑换优惠券',
    date: '2023-09-10 14:30',
    points: 50,
    type: 'decrease'
  }
])

// 根据时间筛选积分历史
const filteredHistory = computed(() => {
  if (timeFilter.value === 'all') {
    return pointsHistory.value
  } else {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return pointsHistory.value.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startOfMonth
    })
  }
})

// 显示的历史记录
const displayedHistory = computed(() => {
  if (showAllHistory.value) {
    return filteredHistory.value
  } else {
    return filteredHistory.value.slice(0, initialDisplayCount.value)
  }
})

// 积分兑换选项
const exchangeOptions = ref([
  {
    iconType: 'photo',
    title: '单张照片兑换',
    description: '可兑换一张高清照片',
    points: 100,
    exchanged: false
  },
  {
    iconType: 'editing',
    title: '照片精修服务',
    description: '由专业摄影师提供精修服务',
    points: 200,
    exchanged: false
  },
  {
    iconType: 'coupon',
    title: '满50减10优惠券',
    description: '在购买照片时可使用',
    points: 50,
    exchanged: false
  },
  {
    iconType: 'vip',
    title: '会员月卡',
    description: '享受会员专属优惠及服务',
    points: 500,
    exchanged: false
  }
])

// 切换规则展开/收起
const toggleRule = (index: number) => {
  const position = expandedRules.value.indexOf(index)
  if (position === -1) {
    expandedRules.value.push(index)
  } else {
    expandedRules.value.splice(position, 1)
  }
}

// 切换历史记录查看全部/收起
const toggleHistoryView = () => {
  showAllHistory.value = !showAllHistory.value
}

// 滚动到指定区域
const scrollToRules = () => {
  if (rulesSection.value) {
    rulesSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToHistory = () => {
  if (historySection.value) {
    historySection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToExchange = () => {
  if (exchangeSection.value) {
    exchangeSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// 兑换商品
const exchangeItem = (option: { points: number, exchanged: boolean }, index: number) => {
  if (userPoints.value < option.points) {
    toast.show('积分不足，无法兑换')
    return
  }

  // 模拟API请求
  setTimeout(() => {
    // 兑换成功
    userPoints.value -= option.points
    exchangeOptions.value[index].exchanged = true
    toast.show('兑换成功！')
  }, 500)
}

// 初始展开第一个规则
onMounted(() => {
  expandedRules.value.push(0)
})

// 监听积分变化，更新可使用积分
watch(userPoints, (newValue) => {
  if (pointsToUse.value > newValue) {
    pointsToUse.value = newValue
  }
})
</script>

<style>
@import '@/assets/styles/pointsView.css';
</style>
