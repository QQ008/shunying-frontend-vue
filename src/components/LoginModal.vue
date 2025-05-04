<!-- 登录弹窗 -->
<template>
  <div v-if="visible" class="login-modal">
    <div class="modal-backdrop" @click="close"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>登录瞬影</h3>
        <button class="close-btn" @click="close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="login-methods">
          <button class="phone-login-btn" @click="handlePhoneLogin">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8337 16.6667C15.8337 17.125 15.4587 17.5 15.0003 17.5H5.00033C4.54199 17.5 4.16699 17.125 4.16699 16.6667V3.33333C4.16699 2.875 4.54199 2.5 5.00033 2.5H15.0003C15.4587 2.5 15.8337 2.875 15.8337 3.33333V16.6667ZM10.0003 15C10.6893 15 11.2503 14.4417 11.2503 13.75C11.2503 13.0583 10.6893 12.5 10.0003 12.5C9.31199 12.5 8.75033 13.0583 8.75033 13.75C8.75033 14.4417 9.31199 15 10.0003 15Z" fill="#9966FF"/>
            </svg>
            手机号登录
          </button>
          <button class="wechat-login-btn" @click="handleWechatLogin">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#07C160" d="M6.75,12.1c-0.6,0-1-0.5-1-1c0-0.6,0.5-1,1-1s1,0.5,1,1C7.8,11.6,7.3,12.1,6.75,12.1z M11.5,10.1
              c0.6,0,1,0.5,1,1c0,0.6-0.5,1-1,1c-0.6,0-1-0.5-1-1C10.5,10.5,11,10.1,11.5,10.1z M7.9,7.6c0-0.6,0.5-1,1-1c0.6,0,1,0.5,1,1
              s-0.5,1-1,1C8.4,8.7,7.9,8.2,7.9,7.6z M4,7.6c0-0.6,0.5-1,1-1c0.6,0,1,0.5,1,1s-0.5,1-1,1C4.4,8.7,4,8.2,4,7.6z M2.5,6.7
              c0-3.2,2.8-5.8,6.2-5.8S15,3.4,15,6.7c0,3.2-2.8,5.8-6.2,5.8c-0.7,0-1.5-0.1-2.1-0.3L4.2,13.8l0.7-2.1C3.5,10.5,2.5,8.7,2.5,6.7z
              M17.5,13.3c0,1.7-1.1,3.3-2.7,4.2l0.6,2l-2.2-1.2c-0.6,0.2-1.3,0.3-2,0.3c-3,0-5.4-2.3-5.4-5.1c0-2.8,2.4-5.1,5.4-5.1
              C15.1,8.2,17.5,10.5,17.5,13.3z"/>
            </svg>
            微信登录
          </button>
        </div>
        <div class="agreement-text">
          登录即表示同意瞬影的 <a href="/terms">用户协议</a> 和 <a href="/privacy">隐私政策</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';

defineOptions({
  name: 'LoginModal'
});

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'login-success']);

const auth = useAuth();
const toast = useToast();

const close = () => {
  emit('update:visible', false);
};

// 处理手机号登录
const handlePhoneLogin = async () => {
  const success = await auth.loginWithPhone('13800138000', '1234');
  if (success) {
    toast.show('登录成功');
    emit('login-success');
    close();
  } else {
    toast.show(auth.loginError.value ? auth.loginError.value : '登录失败');
  }
};

// 处理微信登录
const handleWechatLogin = async () => {
  const success = await auth.loginWithWechat();
  if (success) {
    toast.show('微信登录成功');
    emit('login-success');
    close();
  } else {
    toast.show(auth.loginError.value ? auth.loginError.value : '微信登录失败');
  }
};
</script>

<style scoped>
/* 登录模态框 */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 100%;
  background-color: white;
  border-radius: 16px 16px 0 0;
  position: relative;
  z-index: 1001;
  animation: slideUp 0.3s ease;
  max-width: 500px;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.modal-body {
  padding: 24px 16px;
}

.login-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.phone-login-btn,
.wechat-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.phone-login-btn {
  background-color: #f6f1ff;
  color: #9966FF;
}

.wechat-login-btn {
  background-color: #07C160;
  color: white;
}

.agreement-text {
  font-size: 12px;
  color: #999;
  text-align: center;
  line-height: 1.5;
}

.agreement-text a {
  color: #9966FF;
  text-decoration: none;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
