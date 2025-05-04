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