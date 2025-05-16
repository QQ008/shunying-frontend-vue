<!-- 登录弹窗 -->
<template>
  <div v-if="visible" class="login-modal" :class="{ 'closing': isClosing }">
    <div class="modal-backdrop" @click="handleClose"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>登录瞬影</h3>
        <button class="close-btn" @click="handleClose">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <!-- 手机号登录 -->
        <div class="phone-login-form">
          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-prefix">+86</div>
              <input
                type="tel"
                v-model="phoneNumber"
                placeholder="请输入手机号"
                class="phone-input"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper verification-code-wrapper">
              <input
                type="text"
                v-model="verificationCode"
                placeholder="请输入验证码"
                class="verification-input"
                maxlength="6"
                @input="handleVerificationCodeInput"
              />
              <button
                class="send-code-btn"
                :class="{ 'counting': countDown > 0 }"
                @click="checkAgreementAndProceed('sendCode')"
                :disabled="sendCodeLoading || countDown > 0"
              >
                <span v-if="sendCodeLoading" class="send-code-loading"></span>
                <span v-else-if="countDown > 0">{{ countDown }}秒</span>
                <span v-else>获取验证码</span>
              </button>
            </div>
          </div>

          <!-- 协议勾选 -->
          <div class="agreement-wrapper">
            <label class="checkbox-container">
              <input
                type="checkbox"
                v-model="agreementChecked"
                @change="handleAgreementChange"
              >
              <span class="checkmark"></span>
              <span class="agreement-label">
                我已阅读并同意瞬影的 <a href="/terms" @click.stop>用户协议</a> 和 <a href="/privacy" @click.stop>隐私政策</a>
              </span>
            </label>
          </div>

          <button
            class="login-submit-btn"
            @click="checkAgreementAndProceed('login')"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>登录</span>
          </button>
        </div>

        <div class="divider">
          <span>其他登录方式</span>
        </div>

        <!-- 其他登录方式 -->
        <div class="alternate-login-methods">
          <button
            class="wechat-login-btn"
            @click="checkAgreementAndProceed('wechat')"
            title="微信登录"
            :disabled="isLoading"
          >
            <img src="/images/icons/wechat.png" alt="微信登录" width="48" height="48" />
          </button>
        </div>

        <div class="modal-footer">
          <p class="help-text">未注册的用户将为您创建瞬影账号</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 协议确认弹窗 -->
  <div v-if="showAgreementPrompt" class="login-modal agreement-modal">
    <div class="agreement-modal-backdrop" @click="cancelAgreementPrompt"></div>
    <div class="agreement-modal-content">
      <div class="agreement-modal-header">
        <h4>温馨提示</h4>
      </div>
      <div class="agreement-modal-body">
        <p>为了更好地为您提供服务，瞬影需要您同意用户协议和隐私政策</p>
      </div>
      <div class="agreement-modal-footer">
        <button class="cancel-btn" @click="cancelAgreementPrompt">暂不同意</button>
        <button class="confirm-btn" @click="confirmAgreement" ref="confirmBtn">同意并继续</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { ref, computed, nextTick, onMounted } from 'vue';
import '@/assets/styles/loginModal.css';

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

// 手机号登录表单
const phoneNumber = ref('');
const verificationCode = ref('');
const isLoading = ref(false);
const sendCodeLoading = ref(false);
const countDown = ref(0);
const agreementChecked = ref(false);
const showAgreementPrompt = ref(false);
const confirmBtn = ref<HTMLButtonElement | null>(null);
const isClosing = ref(false);
const pendingAction = ref<'login' | 'sendCode' | 'wechat' | null>(null);

// 验证手机号格式
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phoneNumber.value);
});

// 验证表单是否有效
const isLoginFormValid = computed(() => {
  return isPhoneValid.value && verificationCode.value.length === 6;
});

// 关闭弹窗（带动画）
const handleClose = () => {
  isClosing.value = true;
  setTimeout(() => {
    close();
  }, 250); // 与动画时长匹配
};

// 实际关闭弹窗
const close = () => {
  // 重置表单
  phoneNumber.value = '';
  verificationCode.value = '';
  agreementChecked.value = false;
  isClosing.value = false;
  pendingAction.value = null;

  emit('update:visible', false);
};

// 处理验证码输入
const handleVerificationCodeInput = () => {
  // 当验证码输入满6位时自动验证 (如果已经同意协议的话)
  if (verificationCode.value.length === 6 && agreementChecked.value) {
    handlePhoneLogin();
  }
};

// 检查协议并继续操作
const checkAgreementAndProceed = (action: 'login' | 'sendCode' | 'wechat') => {
  pendingAction.value = action;
  console.log("检查协议状态，当前是否已勾选：", agreementChecked.value);

  if (!agreementChecked.value) {
    console.log("显示协议弹窗");
    showAgreementPrompt.value = true;
    nextTick(() => {
      console.log("协议弹窗已显示，焦点设置状态:", !!confirmBtn.value);
      confirmBtn.value?.focus();
    });
    return;
  }

  // 已同意协议，执行相应操作
  console.log("已同意协议，继续执行操作:", action);
  proceedWithAction();
};

// 执行操作
const proceedWithAction = () => {
  switch (pendingAction.value) {
    case 'login':
      handlePhoneLogin();
      break;
    case 'sendCode':
      sendVerificationCode();
      break;
    case 'wechat':
      handleWechatLogin();
      break;
  }
};

// 验证并继续登录流程
const validateAndProceed = () => {
  // 验证手机号
  if (!isPhoneValid.value) {
    toast.show('请输入正确的手机号');
    return false;
  }

  // 验证验证码
  if (verificationCode.value.length !== 6) {
    toast.show('请输入正确的验证码');
    return false;
  }

  return true;
};

// 发送验证码
const sendVerificationCode = async () => {
  if (!isPhoneValid.value) {
    toast.show('请输入正确的手机号');
    return;
  }

  if (sendCodeLoading.value || countDown.value > 0) {
    return;
  }

  try {
    sendCodeLoading.value = true;
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 开始倒计时
    countDown.value = 60;
    const timer = setInterval(() => {
      countDown.value--;
      if (countDown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    toast.show('验证码已发送');
  } catch {
    toast.show('发送验证码失败，请稍后重试');
  } finally {
    sendCodeLoading.value = false;
  }
};

// 处理协议勾选变化
const handleAgreementChange = () => {
  if (!agreementChecked.value) {
    showAgreementPrompt.value = false;
  }
};

// 确认协议
const confirmAgreement = () => {
  agreementChecked.value = true;
  showAgreementPrompt.value = false;

  // 如果有等待执行的操作，继续执行
  if (pendingAction.value) {
    proceedWithAction();
  }
};

// 取消协议确认
const cancelAgreementPrompt = () => {
  showAgreementPrompt.value = false;
  pendingAction.value = null;
};

// 处理手机号登录
const handlePhoneLogin = async () => {
  // 表单验证
  if (!validateAndProceed()) {
    return;
  }

  try {
    isLoading.value = true;

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 调用登录方法
    const success = await auth.loginWithPhone(phoneNumber.value, verificationCode.value);

    if (success) {
      toast.show('登录成功');
      emit('login-success');
      handleClose();
    } else {
      // 显示具体错误
      if (auth.loginError.value) {
        toast.show(auth.loginError.value);
      } else {
        toast.show('登录失败，请稍后重试');
      }
    }
  } catch {
    toast.show('登录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 处理微信登录
const handleWechatLogin = async () => {
  try {
    isLoading.value = true;
    const success = await auth.loginWithWechat();
    if (success) {
      toast.show('微信登录成功');
      emit('login-success');
      handleClose();
    } else {
      toast.show(auth.loginError.value ? auth.loginError.value : '微信登录失败');
    }
  } catch {
    toast.show('登录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 监听回车键
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showAgreementPrompt.value) {
        confirmAgreement();
        e.preventDefault();
      } else if (isLoginFormValid.value && agreementChecked.value) {
        handlePhoneLogin();
        e.preventDefault();
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
});
</script>

<style scoped>
/* 动画关键帧已移至CSS文件中 */
</style>
