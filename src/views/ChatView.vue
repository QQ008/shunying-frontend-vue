<template>
  <div class="chat-view">
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">{{ chatName }}</h1>
      <div class="right-placeholder"></div>
    </div>

    <div class="chat-container">
      <div class="messages">
        <div class="chat-date-divider">{{ formatDate(new Date()) }}</div>

        <!-- 系统消息 -->
        <div class="system-message">
          <div class="system-content">欢迎使用瞬影客服系统，我们将为您提供专业的服务</div>
        </div>

        <!-- 消息气泡示例 -->
        <div class="message-row received">
          <div class="avatar">
            <img src="https://via.placeholder.com/40/9966FF/FFFFFF/?text=客服" alt="客服头像">
          </div>
          <div class="message-bubble">
            <div class="message-content">您好，欢迎使用瞬影，有什么可以帮助您的吗？</div>
            <div class="message-time">{{ formatTime(new Date(Date.now() - 5 * 60000)) }}</div>
          </div>
        </div>

        <div class="message-row sent">
          <div class="message-bubble">
            <div class="message-content">您好，我想咨询一下如何预约摄影师？</div>
            <div class="message-time">{{ formatTime(new Date(Date.now() - 4 * 60000)) }}</div>
          </div>
        </div>

        <div class="message-row received">
          <div class="avatar">
            <img src="https://via.placeholder.com/40/9966FF/FFFFFF/?text=客服" alt="客服头像">
          </div>
          <div class="message-bubble">
            <div class="message-content">您可以在首页点击"预约拍摄"按钮，选择您喜欢的摄影师和时间段进行预约。如果您有特殊需求，可以在预约时填写备注。</div>
            <div class="message-time">{{ formatTime(new Date(Date.now() - 3 * 60000)) }}</div>
          </div>
        </div>

        <div class="message-row sent">
          <div class="message-bubble">
            <div class="message-content">明白了，谢谢您的解答。</div>
            <div class="message-time">{{ formatTime(new Date(Date.now() - 2 * 60000)) }}</div>
          </div>
        </div>

        <div class="message-row received">
          <div class="avatar">
            <img src="https://via.placeholder.com/40/9966FF/FFFFFF/?text=客服" alt="客服头像">
          </div>
          <div class="message-bubble">
            <div class="message-content">不客气，如果您有其他问题，随时可以咨询我们。祝您使用愉快！</div>
            <div class="message-time">{{ formatTime(new Date(Date.now() - 1 * 60000)) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <div class="input-container">
        <input
          type="text"
          class="message-input"
          placeholder="输入消息..."
          v-model="newMessage"
          @keyup.enter="sendMessage"
        >
        <button
          class="send-button"
          :class="{ active: newMessage.trim().length > 0 }"
          @click="sendMessage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import '@/assets/styles/chat.css';

const router = useRouter();
const route = useRoute();
const chatId = route.params.id;
const newMessage = ref('');

// 根据聊天ID获取聊天名称
const chatName = computed(() => {
  if (chatId === 'customer-service') return '在线客服';
  if (chatId === 'feedback') return '反馈中心';
  if (chatId === 'order-service') return '订单咨询';
  if (chatId === '1') return '客服小瞬';
  if (chatId === '2') return '张摄影师';
  return '聊天';
});

// 格式化时间
const formatTime = (date: Date) => {
  return format(date, 'HH:mm');
};

// 格式化日期
const formatDate = (date: Date) => {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
};

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim().length === 0) return;

  // 在实际项目中，这里应该调用API发送消息
  // 例如：api.sendMessage(chatId, newMessage.value);
  // 同时需要更新未读状态，以确保正确的已读反馈

  // 清空输入框
  newMessage.value = '';
};

// 组件挂载时
onMounted(() => {
  // 在实际项目中，这里应该从API获取聊天历史
  // 例如：fetchChatHistory(chatId);
});
</script>

<style scoped>
.chat-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8fa;
}

.custom-header {
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

.back-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.back-button:active {
  background-color: rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.right-placeholder {
  width: 36px;
}

/* 聊天区域 */
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.chat-date-divider {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin: 8px 0;
  position: relative;
}

.chat-date-divider:before,
.chat-date-divider:after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 60px);
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
}

.chat-date-divider:before {
  left: 0;
}

.chat-date-divider:after {
  right: 0;
}

.system-message {
  text-align: center;
  margin: 8px 0;
}

.system-content {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.05);
  color: #666;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
}

.message-row {
  display: flex;
  margin-bottom: 8px;
}

.message-row.received {
  align-self: flex-start;
}

.message-row.sent {
  align-self: flex-end;
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 8px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-bubble {
  max-width: 70%;
  padding: 12px;
  border-radius: 18px;
  position: relative;
}

.received .message-bubble {
  background-color: white;
  border-top-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.sent .message-bubble {
  background-color: #e9e1ff;
  border-top-right-radius: 4px;
}

.message-content {
  font-size: 15px;
  line-height: 1.4;
  color: #333;
  margin-bottom: 4px;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  text-align: right;
}

/* 输入区域 */
.chat-input-area {
  padding: 12px 16px;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f8f8fa;
  border-radius: 24px;
  padding: 5px 12px;
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px;
  font-size: 16px;
  color: #333;
}

.message-input::placeholder {
  color: #999;
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s;
}

.send-button.active {
  opacity: 1;
  background-color: #f6f1ff;
}

.send-button.active:hover {
  background-color: #e9e1ff;
}

.send-button svg {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .chat-container {
    max-width: 768px;
    margin: 0 auto;
    width: 100%;
  }
}
</style>
