// 注意: 此 Pinia store 已不再使用
// 项目现在统一使用 src/composables/useAuth.ts 来管理用户认证状态
// 此文件仅作为参考保留，如需恢复使用请与 useAuth.ts 保持同步

/*
import { defineStore } from 'pinia';

interface UserState {
  token: string | null;
  userInfo: {
    id?: string;
    nickname?: string;
    avatar?: string;
    points?: number;
    isLoggedIn: boolean;
  };
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    userInfo: {
      isLoggedIn: !!localStorage.getItem('token')
    }
  }),

  getters: {
    isLoggedIn: (state) => state.userInfo.isLoggedIn,
    hasUserInfo: (state) => !!state.userInfo.id
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUserInfo(userInfo: Partial<UserState['userInfo']>) {
      this.userInfo = { ...this.userInfo, ...userInfo };
    },

    login(token: string, userInfo: Partial<UserState['userInfo']>) {
      this.setToken(token);
      this.setUserInfo({ ...userInfo, isLoggedIn: true });
    },

    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.userInfo = { isLoggedIn: false };
    },

    async fetchUserInfo() {
      // 调用API获取用户信息
      try {
        // const { data } = await api.get('/user/info');
        // this.setUserInfo(data);

        // 模拟API调用
        this.setUserInfo({
          id: '12345',
          nickname: '张三',
          avatar: '/images/avatar.jpg',
          points: 100
        });
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    }
  }
});
*/

// 导出空函数，以便在导入时不报错
export const useUserStore = () => {
  console.warn('useUserStore 已弃用，请使用 useAuth 组合式函数代替');
  return {};
};
