<template>
  <div class="feedback-view">
    <!-- 顶部标题栏 -->
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333333"/>
        </svg>
      </div>
      <h1 class="page-title">意见反馈</h1>
    </div>

    <!-- 页面切换标签 -->
    <div class="tab-container">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'feedback' }"
        @click="switchTab('feedback')"
      >
        意见反馈
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'records' }"
        @click="handleRecordsTabClick"
      >
        反馈记录
      </div>
    </div>

    <!-- 意见反馈表单 -->
    <div v-if="activeTab === 'feedback'" class="feedback-form">
      <!-- 描述输入区 -->
      <div class="form-group">
        <label for="feedback-content">请描述您遇到的问题或建议</label>
        <div class="textarea-container">
          <textarea
            id="feedback-content"
            v-model="feedback.content"
            placeholder="请详细描述您的问题或建议，以便我们更好地为您解决..."
            rows="6"
            maxlength="500"
          ></textarea>
          <div class="word-count">{{ feedback.content.length }}/500</div>
        </div>
      </div>

      <!-- 问题类型选择 -->
      <div class="form-group">
        <label>问题类型</label>
        <div class="select-container">
          <select v-model="feedback.type">
            <option value="" disabled>请选择问题类型</option>
            <option value="bug">功能异常/软件崩溃</option>
            <option value="ui">界面设计问题</option>
            <option value="performance">性能问题</option>
            <option value="feature">功能建议</option>
            <option value="account">账号相关问题</option>
            <option value="privacy">隐私与安全问题</option>
            <option value="payment">支付相关问题</option>
            <option value="content">内容质量反馈</option>
            <option value="other">其他问题</option>
          </select>
          <div class="select-arrow">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 6L11 1" stroke="#666666" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 上传图片部分 -->
      <div class="form-group">
        <label>相关截图（可选）</label>
        <div class="upload-container" @click="handleImageUpload">
          <div class="upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20H4V6H13V4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H18C19.1 22 20 21.1 20 20V11H18V20ZM10.21 16.83L8.25 14.47L5.5 18H16.5L12.96 13.29L10.21 16.83ZM20 4V1H18V4H15C15.01 4.01 15 6 15 6H18V8.99C18.01 9 20 8.99 20 8.99V6H23V4H20Z" fill="#9966FF"/>
            </svg>
          </div>
          <div class="upload-text">点击上传图片</div>
          <div class="upload-hint">支持JPG、PNG格式，大小不超过10MB</div>
        </div>
      </div>

      <!-- 未登录用户的联系方式 -->
      <div v-if="!auth.userInfo.isLoggedIn" class="contact-section">
        <div class="section-title">联系方式（选填）</div>

        <div class="form-group">
          <label for="phone">手机号码</label>
          <input
            id="phone"
            type="tel"
            v-model="feedback.phone"
            placeholder="请输入您的手机号码"
          >
        </div>

        <div class="form-group">
          <label for="email">电子邮箱</label>
          <input
            id="email"
            type="email"
            v-model="feedback.email"
            placeholder="请输入您的电子邮箱"
          >
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-container">
        <button
          class="submit-button"
          :disabled="isSubmitDisabled"
          @click="submitFeedback"
        >
          提交反馈
        </button>
      </div>
    </div>

    <!-- 反馈记录列表 -->
    <div v-else-if="activeTab === 'records' && auth.userInfo.isLoggedIn" class="records-container">
      <div v-if="feedbackRecords.length === 0" class="empty-records">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M53.333 10.667H10.667C8.667 10.667 7 12.333 7 14.333V49.667C7 51.667 8.667 53.333 10.667 53.333H53.333C55.333 53.333 57 51.667 57 49.667V14.333C57 12.333 55.333 10.667 53.333 10.667ZM53.333 49.667H10.667V14.333H53.333V49.667ZM23.667 42L34.667 34.667L42 44L47.667 37L53.333 44H13.667L23.667 42Z" fill="#CCCCCC"/>
          </svg>
        </div>
        <div class="empty-text">暂无反馈记录</div>
      </div>

      <div v-else class="record-list">
        <div v-for="(record, index) in feedbackRecords" :key="index" class="record-item">
          <div class="record-header">
            <div class="record-type">{{ getTypeText(record.type) }}</div>
            <div class="record-status" :class="record.status">{{ getStatusText(record.status) }}</div>
          </div>
          <div class="record-content">{{ record.content }}</div>
          <div class="record-footer">
            <div class="record-time">{{ record.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未登录用户查看记录时的提示 -->
    <div v-else-if="activeTab === 'records'" class="login-prompt">
      <div class="prompt-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 5.333C17.28 5.333 5.333 17.28 5.333 32C5.333 46.72 17.28 58.667 32 58.667C46.72 58.667 58.667 46.72 58.667 32C58.667 17.28 46.72 5.333 32 5.333ZM34.667 45.333H29.333V40H34.667V45.333ZM34.667 34.667H29.333V18.667H34.667V34.667Z" fill="#CCCCCC"/>
        </svg>
      </div>
      <div class="prompt-text">登录后可查看历史反馈记录</div>
      <button class="login-button" @click="showLoginModal = true">立即登录</button>
    </div>

    <!-- 登录模态框 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="onLoginSuccess"
    />

    <!-- 提示弹窗 -->
    <div v-if="showToast" class="toast-container">
      <div class="toast-content">{{ toastMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import LoginModal from '@/components/LoginModal.vue';

const router = useRouter();
const auth = useAuth();

// 标签页状态
const activeTab = ref('feedback');

// 登录模态框控制
const showLoginModal = ref(false);

// Toast提示控制
const showToast = ref(false);
const toastMessage = ref('');

// 表单数据
const feedback = reactive({
  content: '',
  type: '',
  phone: '',
  email: ''
});

// 验证提交按钮是否禁用
const isSubmitDisabled = computed(() => {
  return feedback.content.trim() === '' || feedback.type === '';
});

// 模拟的反馈记录数据
const feedbackRecords = ref([
  {
    id: 1,
    type: 'bug',
    content: '使用过程中发现照片浏览页面偶尔会出现加载失败的情况',
    time: '2023-12-15 14:32',
    status: 'pending'
  },
  {
    id: 2,
    type: 'feature',
    content: '希望能增加照片批量下载的功能，方便一次性保存多张照片',
    time: '2023-12-10 09:15',
    status: 'replied'
  },
  {
    id: 3,
    type: 'ui',
    content: '夜间模式下部分文字颜色较浅，不易阅读',
    time: '2023-12-05 18:47',
    status: 'resolved'
  }
]);

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

// 处理记录标签点击
const handleRecordsTabClick = () => {
  if (!auth.userInfo.isLoggedIn) {
    // 可以选择以下两种方式之一
    // 1. 弹出登录模态框
    // showLoginModal.value = true;

    // 2. 切换到记录页并展示提示信息
    activeTab.value = 'records';
  } else {
    activeTab.value = 'records';
  }
};

// 处理图片上传点击
const handleImageUpload = () => {
  showToast.value = true;
  toastMessage.value = '图片上传功能即将上线，敬请期待！';

  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// 提交反馈
const submitFeedback = () => {
  // 模拟提交操作
  setTimeout(() => {
    showToast.value = true;
    toastMessage.value = '感谢您的反馈，我们会尽快处理！';

    // 重置表单
    feedback.content = '';
    feedback.type = '';
    feedback.phone = '';
    feedback.email = '';

    setTimeout(() => {
      showToast.value = false;
    }, 2000);
  }, 800);
};

// 登录成功回调
const onLoginSuccess = () => {
  if (activeTab.value === 'records') {
    // 重新加载反馈记录
    // 实际项目中这里会有API调用
  }
};

// 获取问题类型文本
const getTypeText = (type: string) => {
  const typeMap: {[key: string]: string} = {
    'bug': '功能异常',
    'ui': '界面设计',
    'performance': '性能问题',
    'feature': '功能建议',
    'account': '账号问题',
    'privacy': '隐私安全',
    'payment': '支付问题',
    'content': '内容质量',
    'other': '其他问题'
  };
  return typeMap[type] || '未知类型';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: {[key: string]: string} = {
    'pending': '待处理',
    'processing': '处理中',
    'replied': '已回复',
    'resolved': '已解决'
  };
  return statusMap[status] || '未知状态';
};
</script>

<style scoped>
.feedback-view {
  padding-bottom: 32px;
  position: relative;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.custom-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.back-button {
  position: absolute;
  left: 16px;
  cursor: pointer;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.tab-container {
  display: flex;
  background-color: #fff;
  margin-bottom: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 15px;
  color: #666;
  position: relative;
  cursor: pointer;
}

.tab-item.active {
  color: #9966FF;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #9966FF;
  border-radius: 2px;
}

.feedback-form {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  margin: 0 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.textarea-container {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

textarea {
  width: 100%;
  padding: 12px;
  border: none;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  resize: none;
  outline: none;
  background-color: #fafafa;
}

.word-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999;
}

.select-container {
  position: relative;
}

select {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
  appearance: none;
  color: #333;
  outline: none;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
}

.upload-container {
  border: 1px dashed #9966FF;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(153, 102, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s;
}

.upload-container:hover {
  background-color: rgba(153, 102, 255, 0.05);
}

.upload-icon {
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: #9966FF;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.contact-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
  color: #333;
  outline: none;
}

.submit-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.submit-button {
  background-color: #9966FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 48px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.submit-button:hover:not(:disabled) {
  background-color: #8a4dff;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.records-container {
  padding: 16px;
}

.empty-records {
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 15px;
  color: #999;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.record-type {
  font-size: 14px;
  color: #666;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.record-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.record-status.pending {
  color: #ff9800;
  background-color: rgba(255, 152, 0, 0.1);
}

.record-status.processing {
  color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
}

.record-status.replied {
  color: #9966FF;
  background-color: rgba(153, 102, 255, 0.1);
}

.record-status.resolved {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.record-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 12px;
}

.record-footer {
  display: flex;
  justify-content: flex-end;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.login-prompt {
  padding: 48px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.prompt-icon {
  margin-bottom: 16px;
}

.prompt-text {
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
}

.login-button {
  background-color: #9966FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #8a4dff;
}

/* Toast样式 */
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.toast-content {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 80vw;
  text-align: center;
}
</style>
