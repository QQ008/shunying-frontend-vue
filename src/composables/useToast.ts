// 全局Toast吐司弹窗服务
import { ref, shallowRef, createApp, defineComponent, h } from 'vue';
import type { App } from 'vue';
import ToastComponent from '../components/Toast.vue';

// 定义Toast组件实例的类型
export interface ToastInstance {
  show: (message: string) => void;
  hide: () => void;
  clear: () => void;
}

// 创建一个全局单例
let toastInstance: ToastInstance | null = null;
let app: App | null = null;

/**
 * 全局Toast服务，可以在任何组件中使用
 */
export function useToast() {
  const isInitialized = ref(false);

  // 初始化Toast服务
  const initToast = (): ToastInstance => {
    if (toastInstance) return toastInstance;

    // 创建一个挂载点
    const container = document.createElement('div');
    document.body.appendChild(container);

    // 创建Toast实例的包装组件
    const ToastWrapper = defineComponent({
      setup() {
        const toastRef = shallowRef<ToastInstance | null>(null);

        // 提供给外部的方法
        const methods: ToastInstance = {
          show: (message: string) => {
            toastRef.value?.show(message);
          },
          hide: () => {
            toastRef.value?.hide();
          },
          clear: () => {
            toastRef.value?.clear();
          }
        };

        // 设置实例引用
        toastInstance = methods;

        return () => h(ToastComponent, {
          ref: toastRef,
          message: ''
        });
      }
    });

    // 创建并挂载应用
    app = createApp(ToastWrapper);
    app.mount(container);

    isInitialized.value = true;
    // 这里我们知道toastInstance已经被赋值，因此断言是安全的
    return toastInstance!;
  };

  // 确保仅初始化一次
  if (!isInitialized.value) {
    initToast();
  }

  // 销毁Toast实例
  const destroyToast = () => {
    if (app) {
      app.unmount();
      app = null;
    }
    toastInstance = null;
    isInitialized.value = false;
  };

  return {
    // 显示Toast
    show: (message: string) => {
      if (!toastInstance) {
        initToast();
      }
      toastInstance?.show(message);
    },

    // 隐藏Toast
    hide: () => {
      toastInstance?.hide();
    },

    // 销毁Toast实例
    destroy: destroyToast
  };
}
