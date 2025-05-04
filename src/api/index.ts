import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    const res = response.data;
    // 根据后端约定的状态码判断请求是否成功
    if (res.code === 0 || res.code === 200) {
      return res.data;
    } else {
      console.error('API错误:', res.message || '未知错误');
      return Promise.reject(new Error(res.message || '未知错误'));
    }
  },
  error => {
    if (error.response) {
      // 处理401未授权
      if (error.response.status === 401) {
        console.error('未授权，请重新登录');
        // 可以在这里处理登出逻辑
      }
      // 处理404
      else if (error.response.status === 404) {
        console.error('请求的资源不存在');
      } 
      // 处理500等服务器错误
      else if (error.response.status >= 500) {
        console.error('服务器错误，请稍后再试');
      }
    } else if (error.request) {
      console.error('网络错误，请检查您的网络连接');
    } else {
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 