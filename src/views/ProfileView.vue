<template>
  <div class="profile-view">
    <div class="profile-content">
      <!-- 自定义顶部栏 -->
      <div class="custom-header" :class="{ 'header-logged-in': auth.userInfo.isLoggedIn }">
        <h1 class="page-title">我的</h1>
        <div class="notification-indicator" @click="navigateTo('/notifications')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                  stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span v-if="hasImportantNotifications || unreadMessages > 0" class="notification-badge with-count">{{ totalUnreadCount }}</span>
          <span v-else-if="hasNotifications" class="notification-badge dot-only"></span>
        </div>
      </div>

      <!-- 未登录状态显示 -->
      <div v-if="!auth.userInfo.isLoggedIn" class="not-logged-in">
        <div class="auth-banner">
          <div class="auth-content">
            <div class="auth-avatar">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#E9E1FF"/>
                <path d="M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z" fill="#9966FF"/>
              </svg>
            </div>
            <div class="auth-message">登录瞬影，探索更多精彩</div>
            <div class="auth-buttons">
              <button class="login-btn" @click="showLoginModal = true">登录 / 注册</button>
            </div>
          </div>
        </div>

        <!-- 登录前提示的功能 -->
        <div class="feature-section">
          <div class="section-title">
            <h2>发现瞬影</h2>
          </div>

          <div class="feature-grid">
            <div class="feature-item" @click="navigateTo('/profile/history')">
              <div class="feature-icon history-icon"></div>
              <div class="feature-name">浏览历史</div>
            </div>
            <div class="feature-item" @click="promptLogin">
              <div class="feature-icon photos-icon"></div>
              <div class="feature-name">我的照片</div>
            </div>
            <div class="feature-item" @click="promptLogin">
              <div class="feature-icon favorites-icon"></div>
              <div class="feature-name">收藏夹</div>
            </div>
            <div class="feature-item" @click="navigateTo('/profile/settings')">
              <div class="feature-icon settings-icon"></div>
              <div class="feature-name">设置</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 已登录状态显示 -->
      <div v-else class="logged-in">
        <!-- 用户资料卡片 -->
        <div class="user-profile-card">
          <div class="card-background">
            <div class="decorative-elements">
              <div class="light-beam"></div>
              <div class="dots-pattern"></div>
            </div>
          </div>
          <div class="user-info">
            <div class="avatar">
              <img :src="auth.userInfo.avatar" alt="用户头像">
            </div>
            <div class="user-details">
              <h3 class="nickname">{{ auth.userInfo.nickname }}</h3>
              <p class="user-id">ID: {{ auth.userInfo.userId }}</p>
            </div>
            <button class="edit-profile-btn" @click="navigateTo('/profile/edit')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z" fill="#9966FF"/>
              </svg>
              编辑资料
            </button>
          </div>

          <!-- 用户数据统计 -->
          <div class="stats-row">
            <div class="stat-item" @click="navigateTo('/profile/points')">
              <div class="stat-value">{{ auth.userInfo.points }}</div>
              <div class="stat-label">我的积分</div>
            </div>
            <div class="stat-item" @click="navigateTo('/profile/coupons')">
              <div class="stat-value">{{ auth.userInfo.coupons }}</div>
              <div class="stat-label">优惠券</div>
            </div>
            <div class="stat-item" @click="navigateTo('/profile/favorites')">
              <div class="stat-value">{{ auth.userInfo.favoriteCount }}</div>
              <div class="stat-label">收藏</div>
            </div>
          </div>
        </div>

        <!-- 功能区块 -->
        <div class="features-container">
          <div class="section-header">
            <h2>我的服务</h2>
          </div>

          <div class="feature-grid">
            <div class="feature-item" @click="navigateTo('/profile/orders')">
              <div class="feature-icon orders-icon"></div>
              <div class="feature-name">我的订单</div>
            </div>
            <div class="feature-item" @click="navigateTo('/profile/purchased')">
              <div class="feature-icon photos-icon"></div>
              <div class="feature-name">我的照片</div>
            </div>
            <div class="feature-item" @click="navigateTo('/profile/favorites')">
              <div class="feature-icon favorites-icon"></div>
              <div class="feature-name">收藏夹</div>
            </div>
            <div class="feature-item" @click="navigateTo('/profile/history')">
              <div class="feature-icon history-icon"></div>
              <div class="feature-name">浏览历史</div>
            </div>
          </div>
        </div>

        <!-- 菜单列表 -->
        <div class="menu-container">
          <div class="menu-item" @click="navigateTo('/profile/points')">
            <div class="menu-icon points-icon"></div>
            <div class="menu-title">积分中心</div>
            <div class="menu-arrow">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="menu-item" @click="navigateTo('/profile/coupons')">
            <div class="menu-icon coupons-icon"></div>
            <div class="menu-title">优惠券</div>
            <div class="menu-arrow">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="menu-item" @click="navigateTo('/profile/settings')">
            <div class="menu-icon settings-icon"></div>
            <div class="menu-title">设置</div>
            <div class="menu-arrow">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="menu-item" @click="navigateTo('/profile/feedback')">
            <div class="menu-icon feedback-icon"></div>
            <div class="menu-title">意见反馈</div>
            <div class="menu-arrow">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="menu-item" @click="navigateTo('/about')">
            <div class="menu-icon about-icon"></div>
            <div class="menu-title">关于瞬影</div>
            <div class="menu-arrow">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用可复用的登录模态框组件 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="onLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
// import { useToast } from '@/composables/useToast';
import LoginModal from '@/components/LoginModal.vue';
import { useNotifications } from '@/composables/useNotifications';
import '@/assets/styles/notification-indicator.css';
import '@/assets/styles/profileView.css';

const router = useRouter();
// const toast = useToast();
const auth = useAuth();
const {
  unreadCount: unreadNotificationsCount,
  hasUnread: hasNotifications,
  hasUnreadImportant: hasImportantNotifications
} = useNotifications();

// 登录模态框控制
const showLoginModal = ref(false);

// 模拟未读消息数
const unreadMessages = 1; // 实际项目中应该从useMessages或API获取

// 计算总未读数
const totalUnreadCount = computed(() => unreadNotificationsCount.value + unreadMessages);

// 导航方法
const navigateTo = (path: string) => {
  router.push(path);
};

// 需要登录提示
const promptLogin = () => {
  showLoginModal.value = true;
};

// // 处理手机号登录
// const handleLogin = () => {
//   showLoginModal.value = true;
// };

// 登录成功回调
const onLoginSuccess = () => {
  // 可以在这里处理登录成功后的逻辑
  // 例如刷新数据或其他操作
};
</script>
