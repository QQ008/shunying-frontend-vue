import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Icon, Button, Search, Image as VanImage, Empty, Loading } from 'vant'
import 'vant/lib/index.css'

// 创建Vue应用实例
const app = createApp(App)
// 创建Pinia实例
app.use(createPinia())
// 使用路由
app.use(router)
// 使用Vant组件库
app.use(Icon)
app.use(Button)
app.use(Search)
app.use(VanImage)
app.use(Empty)
app.use(Loading)

// 挂载应用
app.mount('#app')
