import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'; // 类型导入
import { showToast } from 'vant'; // 用于显示错误提示

// 定义响应数据结构 (可以根据后端实际返回调整)
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // API 基础 URL，可通过 .env 配置
  timeout: 10000, // 请求超时时间 (10秒)
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 例如：从 Pinia store 获取 token 并添加到请求头
    // const userStore = useUserStore();
    // if (userStore.token) {
    //   config.headers['Authorization'] = `Bearer ${userStore.token}`;
    // }
    // console.log('Request Config:', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request Error:', error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    // console.log('Response Data:', res);

    // 对响应数据做点什么
    // 后端约定：code === 0 表示成功
    if (res.code !== 0) {
      // 处理业务错误
      showToast(res.message || 'Error');

      // 处理特定错误码，如 401 未授权
      if (res.code === 401) {
        console.error('认证失败或 Token 过期 (业务码 401)');
        // TODO: 清除本地用户状态?
        // useUserStore().logout(); // 假设有 logout action 清理 token
        // 跳转到登录页
        const currentPath = window.location.pathname + window.location.search + window.location.hash;
        // 避免重复跳转
        if (window.location.pathname !== '/login') {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`; // 使用页面跳转确保状态清理
            // 或者使用 router.replace({ path: '/login', query: { redirect: currentPath } });
        }
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    // 如果 code === 0，直接返回 data 部分
    return res.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('Response Error:', error); // for debug

    let message = '请求失败';
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      switch (error.response.status) {
        case 400:
          message = '请求错误(400)';
          break;
        case 401:
          message = '未授权，请重新登录(401)';
          // TODO: 跳转到登录页
          break;
        case 403:
          message = '拒绝访问(403)';
          break;
        case 404:
          message = '请求资源不存在(404)';
          break;
        case 500:
          message = '服务器内部错误(500)';
          break;
        // ... 其他错误处理
        default:
          message = `连接出错(${error.response.status})!`;
      }
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      message = '网络超时，请检查网络连接';
    } else {
      // 发送请求时出了点问题
      message = '连接服务器失败';
    }

    showToast(message);
    return Promise.reject(error);
  }
);

// 导出封装的请求方法
// 使用泛型 T 来指定响应 data 的类型
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  // 这里 service 的响应拦截器已经处理了外层 data 和 code，
  // 所以调用方拿到的已经是 Promise<T>，即后端定义的 data 部分的类型
  return service(config) as Promise<T>;
};

export default request; 