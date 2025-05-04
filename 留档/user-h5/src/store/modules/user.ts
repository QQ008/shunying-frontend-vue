import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { login as apiLogin, getUserProfile } from '@/api/user' // 假设的 API 函数
// import request from '@/utils/request' // 如果需要在 action 中直接调用

// 根据 docs/瞬影数据库定义.md 的 USER 表定义用户信息类型
export interface UserInfo {
  id: number;
  nickname: string | null;
  mobile_phone: string | null;
  avatar: string | null;
  gender: number | null; // 0=不透露/其他，1=男，2=女
  birth_date: string | null; // DATE
  email: string | null;
  points: number | null;
  open_id: string | null;
  real_name: string | null;
  id_number: string | null;
  status: number; // 0=正常，1=封禁，2=黑名单等
  source: string | null;
  last_login_time: string | null; // DATETIME
  create_time: string; // DATETIME
  // remark?: string | null; // remark 字段可选
  // is_deleted?: boolean; // is_deleted 通常不在前端业务中直接使用
}

// 定义 User Store
export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const token = ref<string | null>(localStorage.getItem('user-token') || null); // 从 localStorage 初始化 token
    const userInfo = ref<UserInfo | null>(null);

    // Getters
    const isLoggedIn = computed(() => !!token.value);
    const userAvatar = computed(() => userInfo.value?.avatar || ''); // 示例 Getter
    const userNickname = computed(() => userInfo.value?.nickname || '游客');

    // Actions
    function setToken(newToken: string | null) {
      token.value = newToken;
      if (newToken) {
        localStorage.setItem('user-token', newToken);
      } else {
        localStorage.removeItem('user-token');
      }
    }

    function setUserInfo(info: UserInfo | null) {
      userInfo.value = info;
      // 可以考虑将用户信息也存入 localStorage 或 sessionStorage
      // if (info) {
      //   localStorage.setItem('user-info', JSON.stringify(info));
      // } else {
      //   localStorage.removeItem('user-info');
      // }
    }

    // 登录 (示例，需要对接实际 API)
    async function login(credentials: any) {
      try {
        // const response = await apiLogin(credentials);
        // const { token: loginToken, user } = response; // 假设 API 返回 token 和 user
        // 模拟 API 返回
        const loginToken = 'mock-token-' + Date.now();
        const user: UserInfo = {
          id: 1,
          nickname: '测试用户',
          mobile_phone: '13800138000',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          gender: 1,
          birth_date: null,
          email: null,
          points: 100,
          open_id: null,
          real_name: null,
          id_number: null,
          status: 0,
          source: 'test',
          last_login_time: new Date().toISOString(),
          create_time: new Date().toISOString(),
        };

        setToken(loginToken);
        setUserInfo(user);
        return Promise.resolve(); // 返回成功
      } catch (error) {
        console.error('Login failed:', error);
        return Promise.reject(error);
      }
    }

    // 获取用户信息 (示例，需要对接实际 API)
    async function fetchUserInfo() {
      if (!token.value) return Promise.reject('No token');
      try {
        // const user = await getUserProfile(); // 调用 API 获取用户信息
        // 模拟 API 返回
        const user: UserInfo = {
          id: 1,
          nickname: '测试用户',
          mobile_phone: '13800138000',
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          gender: 1,
          birth_date: null,
          email: null,
          points: 100,
          open_id: null,
          real_name: null,
          id_number: null,
          status: 0,
          source: 'test',
          last_login_time: new Date().toISOString(),
          create_time: new Date().toISOString(),
        };
        setUserInfo(user);
        return Promise.resolve(user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        // 获取失败可能需要清除 token
        // setToken(null);
        // setUserInfo(null);
        return Promise.reject(error);
      }
    }

    // 退出登录
    function logout() {
      setToken(null);
      setUserInfo(null);
      // TODO: 可能需要调用后端的登出接口
      // TODO: 清除其他需要清除的状态 (如购物车？)
      console.log('User logged out');
      // 跳转到登录页或其他页面
      // router.push('/login');
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      userAvatar,
      userNickname,
      setToken,
      setUserInfo,
      login,
      logout,
      fetchUserInfo
    };
  },
  // Pinia Persist Plugin 配置 (如果使用)
  // {
  //   persist: true, // 开启持久化
  //   // persist: {
  //   //   key: 'pinia-store-user', // localStorage key
  //   //   storage: localStorage, // or sessionStorage
  //   //   paths: ['token', 'userInfo'], // 指定需要持久化的 state
  //   // },
  // }
); 