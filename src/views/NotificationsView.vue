<template>
  <div class="notification-center">
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">消息中心</h1>
      <div class="right-placeholder"></div>
    </div>

    <!-- 通知类型按钮区 -->
    <div class="notification-category">
      <div
        class="category-item"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        <div class="category-icon all-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="getUnreadCount('all') > 0" class="category-badge">{{ getUnreadCount('all') }}</span>
        </div>
        <div class="category-name">全部</div>
      </div>

      <div
        class="category-item"
        :class="{ active: activeTab === 'system' }"
        @click="activeTab = 'system'"
      >
        <div class="category-icon system-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="getUnreadCount('system') > 0" class="category-badge">{{ getUnreadCount('system') }}</span>
        </div>
        <div class="category-name">系统</div>
      </div>

      <div
        class="category-item"
        :class="{ active: activeTab === 'order' }"
        @click="activeTab = 'order'"
      >
        <div class="category-icon order-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="#9966FF" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span v-if="getUnreadCount('order') > 0" class="category-badge">{{ getUnreadCount('order') }}</span>
        </div>
        <div class="category-name">订单</div>
      </div>

      <div
        class="category-item"
        :class="{ active: activeTab === 'activity' }"
        @click="activeTab = 'activity'"
      >
        <div class="category-icon activity-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="getUnreadCount('activity') > 0" class="category-badge">{{ getUnreadCount('activity') }}</span>
        </div>
        <div class="category-name">活动</div>
      </div>

      <div
        class="category-item"
        :class="{ active: activeTab === 'messages' }"
        @click="activeTab = 'messages'"
      >
        <div class="category-icon messages-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#9966FF" stroke-width="1.5"/>
          </svg>
          <span v-if="messagesUnreadCount > 0" class="category-badge">{{ messagesUnreadCount }}</span>
        </div>
        <div class="category-name">消息</div>
      </div>
    </div>

    <!-- 消息部分（仅在选择消息tab时显示） -->
    <div v-if="activeTab === 'messages'" class="messages-container">
      <!-- 客服区域 -->
      <div class="customer-service">
        <div class="service-header">
          <div class="service-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5V21H19V11Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 11V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V11" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 16L12 13L15 16" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="service-title">客服中心</h2>
        </div>
        <div class="service-list">
          <div class="service-item" @click="navigateToChat('customer-service')">
            <div class="service-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#9966FF" stroke-width="1.5"/>
                <path d="M15.75 12C15.75 12.4142 15.4142 12.75 15 12.75C14.5858 12.75 14.25 12.4142 14.25 12C14.25 11.5858 14.5858 11.25 15 11.25C15.4142 11.25 15.75 11.5858 15.75 12Z" fill="#9966FF" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z" fill="#9966FF" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.75 12C9.75 12.4142 9.41421 12.75 9 12.75C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25C9.41421 11.25 9.75 11.5858 9.75 12Z" fill="#9966FF" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="service-name">在线客服</div>
          </div>
          <div class="service-item" @click="navigateToChat('feedback')">
            <div class="service-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 8H17M7 12H11M7 16H13M4 4H20V20H4V4Z" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="service-name">反馈中心</div>
          </div>
          <div class="service-item" @click="navigateToChat('order-service')">
            <div class="service-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="service-name">订单咨询</div>
          </div>
        </div>
      </div>

      <!-- 消息对话列表 -->
      <div v-if="messagesList.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#CCCCCC" stroke-width="1.5" fill="#EFEFEF"/>
            <path d="M15.75 12C15.75 12.4142 15.4142 12.75 15 12.75C14.5858 12.75 14.25 12.4142 14.25 12C14.25 11.5858 14.5858 11.25 15 11.25C15.4142 11.25 15.75 11.5858 15.75 12Z" fill="#CCCCCC" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z" fill="#CCCCCC" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.75 12C9.75 12.4142 9.41421 12.75 9 12.75C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25C9.41421 11.25 9.75 11.5858 9.75 12Z" fill="#CCCCCC" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="empty-text">暂无消息</p>
      </div>

      <div v-else class="chat-list">
        <div
          v-for="chat in messagesList"
          :key="chat.id"
          class="chat-item"
          @click="navigateToChat(chat.id.toString())"
        >
          <div class="avatar">
            <img :src="chat.avatar" :alt="chat.name">
          </div>
          <div class="chat-content">
            <div class="chat-top">
              <h3 class="chat-name">{{ chat.name }}</h3>
              <span class="chat-time">{{ messages.formatChatTime(chat.lastTime) }}</span>
            </div>
            <p class="chat-preview">{{ chat.lastMessage }}</p>
          </div>
          <div class="unread-indicator" v-if="chat.unreadCount > 0">
            <span v-if="chat.unreadCount > 0" class="unread-count">{{ chat.unreadCount }}</span>
            <span v-else class="unread-dot"></span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="notifications-container">
      <!-- 无通知状态 -->
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="#EFEFEF"/>
          </svg>
        </div>
        <p class="empty-text">暂无{{ activeTabName }}通知</p>
      </div>

      <!-- 通知列表 -->
      <div v-else class="notification-list">
        <!-- 今天 -->
        <template v-if="todayNotifications.length > 0">
          <div class="time-divider">今天</div>
          <div
            v-for="notification in todayNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.isRead, important: notification.isImportant }"
            @click="readNotification(notification)"
          >
            <div class="notification-icon" :class="notification.type">
              <template v-if="notification.type === 'system'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              <template v-else-if="notification.type === 'order'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#9966FF" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </template>
              <template v-else-if="notification.type === 'activity'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
            </div>
            <div class="notification-content">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-description">{{ notification.content }}</p>
              <span class="notification-time">{{ formatTime(notification.time) }}</span>
            </div>
            <div class="notification-status">
              <span v-if="!notification.isRead" class="unread-dot"></span>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </template>

        <!-- 本周 -->
        <template v-if="weekNotifications.length > 0">
          <div class="time-divider">本周</div>
          <div
            v-for="notification in weekNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.isRead, important: notification.isImportant }"
            @click="readNotification(notification)"
          >
            <div class="notification-icon" :class="notification.type">
              <template v-if="notification.type === 'system'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              <template v-else-if="notification.type === 'order'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#9966FF" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </template>
              <template v-else-if="notification.type === 'activity'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
            </div>
            <div class="notification-content">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-description">{{ notification.content }}</p>
              <span class="notification-time">{{ formatTime(notification.time) }}</span>
            </div>
            <div class="notification-status">
              <span v-if="!notification.isRead" class="unread-dot"></span>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </template>

        <!-- 更早 -->
        <template v-if="earlierNotifications.length > 0">
          <div class="time-divider">更早</div>
          <div
            v-for="notification in earlierNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.isRead, important: notification.isImportant }"
            @click="readNotification(notification)"
          >
            <div class="notification-icon" :class="notification.type">
              <template v-if="notification.type === 'system'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              <template v-else-if="notification.type === 'order'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#9966FF" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </template>
              <template v-else-if="notification.type === 'activity'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
            </div>
            <div class="notification-content">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-description">{{ notification.content }}</p>
              <span class="notification-time">{{ formatTime(notification.time) }}</span>
            </div>
            <div class="notification-status">
              <span v-if="!notification.isRead" class="unread-dot"></span>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotifications } from '@/composables/useNotifications';
import { useMessages } from '@/composables/useMessages';
import type { Conversation } from '@/composables/useMessages';
import '@/assets/styles/notifications.css';
// import '@/assets/styles/messages.css';

const router = useRouter();
const {
  notifications,
  getNotifications,
  formatNotificationTime: formatTime,
  markAsRead,
  getUnreadCountByType
} = useNotifications();

// 使用全局消息状态
const messages = useMessages();

// 标签页定义
const activeTab = ref('all');

// 计算消息列表，确保类型安全
const messagesList = computed<Conversation[]>(() => {
  return messages.conversations.value;
});

// 计算活动标签页名称
const activeTabName = computed(() => {
  if (activeTab.value === 'all') return '全部';
  if (activeTab.value === 'system') return '系统';
  if (activeTab.value === 'order') return '订单';
  if (activeTab.value === 'activity') return '活动';
  if (activeTab.value === 'messages') return '消息';
  return '全部';
});

// 根据选择的标签过滤通知
const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notifications.value;
  } else {
    return getNotifications(activeTab.value as 'system' | 'order' | 'activity');
  }
});

// 按时间分组
const todayNotifications = computed(() => {
  return filteredNotifications.value.filter(notification =>
    notification.time && new Date(notification.time).toDateString() === new Date().toDateString()
  );
});

const weekNotifications = computed(() => {
  const today = new Date().toDateString();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toDateString();

  return filteredNotifications.value.filter(notification => {
    const notifDate = new Date(notification.time).toDateString();
    return notifDate !== today && notifDate >= weekStartStr;
  });
});

const earlierNotifications = computed(() => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toDateString();

  return filteredNotifications.value.filter(notification => {
    return new Date(notification.time).toDateString() < weekStartStr;
  });
});

// 从消息系统获取未读消息数
const messagesUnreadCount = computed(() => messages.unreadCount.value);

// 获取未读消息数量
const getUnreadCount = (tabId: string) => {
  if (tabId === 'messages') {
    return messagesUnreadCount.value;
  }
  return getUnreadCountByType(tabId as 'system' | 'order' | 'activity' | 'all');
};

// 阅读通知
const readNotification = (notification: import('@/composables/useNotifications').Notification) => {
  markAsRead(notification.id);
  // 这里可以添加跳转到详情页的逻辑，或者弹出详情模态框
};

// 导航到聊天页面
const navigateToChat = (chatId: string) => {
  // 如果是数字ID的对话，标记为已读
  if (!isNaN(Number(chatId))) {
    messages.markConversationAsRead(Number(chatId));
  }
  router.push(`/chat/${chatId}`);
};

// 组件挂载时
onMounted(() => {
  // 在实际项目中，这里应该从API获取最新通知和消息数据
  // 但现在我们已经在composables中实现了自动初始化
});
</script>
