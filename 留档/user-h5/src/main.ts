import '@unocss/reset/tailwind.css' // 引入 UnoCSS 重置样式
import 'virtual:uno.css' // 引入 UnoCSS 生成的样式
import 'vant/lib/index.css'; // 引入 Vant 样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入持久化插件
import App from './App.vue'
import router from '@/router' // 使用路径别名导入 router
import Vant from 'vant'; // 引入 Vant 组件库
import { useNavigation } from '@/utils/navigation'; // 导入导航服务

// 初始化导航服务
useNavigation(router);

const app = createApp(App)
const pinia = createPinia() // 创建 Pinia 实例
pinia.use(piniaPluginPersistedstate) // 注册持久化插件

// 全局属性注册
app.provide('$navigation', useNavigation()); // 注入导航服务

app.use(pinia) // 使用 Pinia 实例
app.use(router) // 使用 Vue Router
app.use(Vant); // 使用 Vant

app.mount('#app')
