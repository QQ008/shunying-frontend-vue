/**
 * 用户认证模块
 *
 * 注意：这是项目中管理用户认证状态的唯一方法
 * 请勿使用其他方式（如 Pinia store）来管理用户登录状态，以免造成状态不一致
 */
import { ref, reactive, readonly } from 'vue';

// 用户信息接口
export interface UserInfo {
  isLoggedIn: boolean;
  nickname?: string;
  userId?: string;
  avatar?: string;
  points?: number;
  coupons?: number;
  favoriteCount?: number;
  phone?: string;
  email?: string;
}

// 默认的游客信息
const defaultUserInfo: UserInfo = {
  isLoggedIn: false
};

// 模拟登录后的用户信息（正常情况下会从后端获取）
const mockLoggedInUserInfo: UserInfo = {
  isLoggedIn: true,
  nickname: '瞬影用户',
  userId: 'u_' + Math.floor(Math.random() * 100000),
  avatar: '/images/avatar-default.svg',
  points: 580,
  coupons: 3,
  favoriteCount: 12,
  phone: '138****1234',
  email: 'user@example.com'
};

// 微信登录用户信息
const mockWechatUserInfo: UserInfo = {
  isLoggedIn: true,
  nickname: '微信用户',
  userId: 'wx_' + Math.floor(Math.random() * 100000),
  avatar: '/images/avatar-default.svg',
  points: 320,
  coupons: 2,
  favoriteCount: 8,
  phone: '139****5678'
};

// 创建用户状态
const userInfo = reactive<UserInfo>({...defaultUserInfo});

// 创建loading状态
const isLoading = ref(false);
const loginError = ref<string | null>(null);

/**
 * 读取本地存储的登录状态
 * 在应用启动时自动调用
 */
const initAuthState = () => {
  try {
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as UserInfo;
      if (parsedUser.isLoggedIn) {
        Object.assign(userInfo, parsedUser);
      }
    }
  } catch {
    // 如果出错，就使用默认状态
    Object.assign(userInfo, defaultUserInfo);
  }
};

/**
 * 保存用户信息到本地存储
 * 在用户信息更新时调用
 */
const saveUserInfo = () => {
  localStorage.setItem('user_info', JSON.stringify(userInfo));
};

/**
 * 提供用户认证相关功能的组合式函数
 *
 * 示例用法:
 * const auth = useAuth();
 *
 * // 检查用户是否登录
 * if (auth.userInfo.isLoggedIn) { ... }
 *
 * // 手机号登录
 * await auth.loginWithPhone('13800138000', '1234');
 *
 * // 登出
 * auth.logout();
 */
export function useAuth() {
  // 初始化认证状态
  initAuthState();

  // 手机号登录
  const loginWithPhone = async (phone: string, code: string): Promise<boolean> => {
    isLoading.value = true;
    loginError.value = null;

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // 模拟验证码检查 (实际项目中会通过API验证)
      if (code !== '1234') {
        loginError.value = '验证码错误';
        return false;
      }

      // 登录成功，更新用户信息
      Object.assign(userInfo, mockLoggedInUserInfo);
      userInfo.phone = phone;

      // 保存到本地存储
      saveUserInfo();
      return true;
    } catch {
      loginError.value = '登录失败，请稍后重试';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 模拟微信登录
  const loginWithWechat = async (): Promise<boolean> => {
    isLoading.value = true;
    loginError.value = null;

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 登录成功，更新用户信息
      Object.assign(userInfo, mockWechatUserInfo);

      // 保存到本地存储
      saveUserInfo();
      return true;
    } catch {
      loginError.value = '微信登录失败，请稍后重试';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 登出
  const logout = () => {
    Object.assign(userInfo, defaultUserInfo);
    localStorage.removeItem('user_info');
  };

  // 检查是否已登录
  const isLoggedIn = (): boolean => {
    return userInfo.isLoggedIn;
  };

  return {
    // 只读的用户信息，防止外部直接修改
    userInfo: readonly(userInfo),
    isLoading: readonly(isLoading),
    loginError: readonly(loginError),

    // 方法
    loginWithPhone,
    loginWithWechat,
    logout,
    isLoggedIn
  };
}
