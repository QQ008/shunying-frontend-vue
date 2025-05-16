<template>
  <div class="explore-view">
    <!-- 顶部导航栏 -->
    <TopBar title="探索" :is-fixed="true" />

    <div class="under-construction">
      <div class="icon">🚧</div>
      <h2>功能开发中</h2>
      <p>探索页面正在建设中，敬请期待！</p>

      <div class="toast-test-buttons">
        <button class="test-toast-btn" @click="showDefaultToast">测试弹窗</button>
        <button class="test-toast-btn success" @click="showLongToast">长文本弹窗</button>
        <button class="test-toast-btn error" @click="showComponentToast">组件弹窗</button>
      </div>

      <div class="login-section">
        <div v-if="!auth.userInfo.isLoggedIn">
          <button class="auth-btn login" @click="handleLogin">模拟登录</button>
          <button class="auth-btn wechat" @click="handleWechatLogin">
            <svg class="wechat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="white" d="M8.1,14.5c-0.7,0-1.2-0.6-1.2-1.2c0-0.7,0.6-1.2,1.2-1.2s1.2,0.6,1.2,1.2C9.4,13.9,8.8,14.5,8.1,14.5z M13.8,12.1
              c0.7,0,1.2,0.6,1.2,1.2c0,0.7-0.6,1.2-1.2,1.2c-0.7,0-1.2-0.6-1.2-1.2C12.6,12.6,13.1,12.1,13.8,12.1z M9.5,9.1
              c0-0.7,0.6-1.2,1.2-1.2c0.7,0,1.2,0.6,1.2,1.2s-0.6,1.2-1.2,1.2C10.1,10.4,9.5,9.8,9.5,9.1z M4.8,9.1c0-0.7,0.6-1.2,1.2-1.2
              c0.7,0,1.2,0.6,1.2,1.2s-0.6,1.2-1.2,1.2C5.3,10.4,4.8,9.8,4.8,9.1z M3,8c0-3.9,3.4-7,7.5-7S18,4.1,18,8c0,3.9-3.4,7-7.5,7
              c-0.9,0-1.8-0.1-2.6-0.4L5,16.5l0.9-2.5C4.2,12.6,3,10.5,3,8z M21,16c0,2.1-1.3,4-3.2,5.1l0.7,2.4l-2.7-1.4c-0.8,0.2-1.6,0.4-2.4,0.4
              c-3.6,0-6.5-2.8-6.5-6.1c0-3.4,2.9-6.1,6.5-6.1C18.1,9.9,21,12.6,21,16z"/>
            </svg>
            微信登录
          </button>
        </div>
        <div v-else class="user-brief">
          <div class="avatar-mini">
            <img :src="auth.userInfo.avatar || ''" alt="头像"
                 onerror="this.onerror=null; this.src='/images/avatar-placeholder.jpg'">
          </div>
          <div class="user-info-mini">
            <span>{{ auth.userInfo.nickname }}</span>
            <button class="auth-btn logout" @click="handleLogout">退出登录</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用局部Toast组件 (可选) -->
    <Toast ref="toastRef" message="" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopBar from '../components/TopBar.vue';
import Toast from '../components/Toast.vue';
import { useToast } from '../composables/useToast';
import { useAuth } from '../composables/useAuth';

// 1. 局部组件引用方式
const toastRef = ref<InstanceType<typeof Toast> | null>(null);

// 测试使用局部引用的Toast
const showComponentToast = () => {
  toastRef.value?.show('这是通过组件引用调用的提示');
};

// 2. 全局Toast服务
const toast = useToast();

// 显示默认提示
const showDefaultToast = () => {
  toast.show('这是一条全局Toast提示消息');
};

// 显示长文本提示
const showLongToast = () => {
  toast.show('这是一条较长的提示文本，测试Toast组件的自适应能力和布局效果');
};

// 用户认证相关
const auth = useAuth();

// 处理手机号登录
const handleLogin = async () => {
  const success = await auth.loginWithPhone('15701167302', '123456');
  if (success) {
    toast.show('登录成功');
  } else {
    toast.show(auth.loginError.value ? auth.loginError.value : '登录失败');
  }
};

// 处理微信登录
const handleWechatLogin = async () => {
  const success = await auth.loginWithWechat();
  if (success) {
    toast.show('微信登录成功');
  } else {
    toast.show(auth.loginError.value ? auth.loginError.value : '微信登录失败');
  }
};

// 处理退出登录
const handleLogout = () => {
  auth.logout();
  toast.show('已退出登录');
};
</script>

<style scoped>
.explore-view {
  min-height: 80vh;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.under-construction {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  font-size: 64px;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.toast-test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.test-toast-btn {
  background-color: #9966FF;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(153, 102, 255, 0.3);
}

.test-toast-btn:hover {
  background-color: #8656e5;
}

.test-toast-btn:active {
  transform: scale(0.98);
  background-color: #7d4fd9;
}

.test-toast-btn.success {
  background-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.test-toast-btn.success:hover {
  background-color: #3e9242;
}

.test-toast-btn.success:active {
  background-color: #357a38;
}

.test-toast-btn.error {
  background-color: #F44336;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.test-toast-btn.error:hover {
  background-color: #d73226;
}

.test-toast-btn.error:active {
  background-color: #c62828;
}

/* 登录区域样式 */
.login-section {
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 320px;
}

.auth-btn {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.auth-btn.login {
  background-color: #9966FF;
  color: white;
  box-shadow: 0 2px 8px rgba(153, 102, 255, 0.3);
}

.auth-btn.login:hover {
  background-color: #8656e5;
}

.auth-btn.wechat {
  background-color: #07C160;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.3);
}

.auth-btn.wechat:hover {
  background-color: #06a552;
}

.wechat-icon {
  width: 16px;
  height: 16px;
}

.auth-btn.logout {
  background-color: #f5f5f5;
  color: #666;
  padding: 5px 10px;
  font-size: 12px;
  margin-top: 5px;
}

.auth-btn.logout:hover {
  background-color: #ebebeb;
}

.user-brief {
  display: flex;
  align-items: center;
  padding: 5px;
}

.avatar-mini {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info-mini {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.user-info-mini span {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .test-toast-btn {
    font-size: 14px;
    padding: 8px 16px;
  }

  .login-section {
    max-width: 290px;
  }
}
</style>
