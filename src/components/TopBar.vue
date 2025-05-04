<!-- 顶部导航栏 -->
<template>
  <div class="top-bar" :class="{ 'position-fixed': isFixed, 'position-static': !isFixed }">
    <div class="logo-container">
      <div class="logo-circle">
        <img src="/images/logo-icon.png" alt="瞬影" class="logo-icon" />
      </div>
      <span class="app-name">{{ title || '瞬影' }}</span>
    </div>
    <div class="action-buttons">
      <div class="notification-indicator" @click="goToNotificationsMain">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <span v-if="hasImportantNotifications || unreadMessages > 0" class="notification-badge with-count">{{ totalUnreadCount }}</span>
        <span v-else-if="hasNotifications" class="notification-badge dot-only"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useNotifications } from '@/composables/useNotifications';
import { computed } from 'vue';
import '@/assets/styles/notification-indicator.css';

// 定义props类型和默认值
interface Props {
  isFixed?: boolean;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  isFixed: false,
  title: ''
});

const router = useRouter();
const {
  unreadCount: notificationCount,
  hasUnread: hasNotifications,
  hasUnreadImportant: hasImportantNotifications
} = useNotifications();

// 模拟未读消息数
const unreadMessages = 2; // 实际项目中应该从useMessages或API获取

// 计算总未读数
const totalUnreadCount = computed(() => notificationCount.value + unreadMessages);

// 统一跳转到通知/消息主页面
const goToNotificationsMain = () => {
  router.push('/notifications');
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
  height: 60px;
  border-bottom: none;
  z-index: 100;

  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.position-fixed {
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.position-static {
  position: static;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1c2331;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(28, 35, 49, 0.2);
  transition: transform 0.2s ease;
}

.logo-circle:active {
  transform: scale(0.95);
}

.logo-icon {
  width: 20px;
  height: 20px;
}

.app-name {
  font-size: 22px;
  font-weight: 500;
  color: #294D74;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(41, 77, 116, 0.05);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
