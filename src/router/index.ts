import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: '查找' }
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/ExploreView.vue'),
    meta: { title: '探索' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '我的' }
  },
  {
    path: '/search/detail/:id',
    name: 'photo-detail',
    component: () => import('@/views/ImageGroupDetailView.vue'),
    meta: { title: '图片详情' }
  },
  {
    path: '/preview',
    name: 'shooting-schedule',
    component: () => import('@/views/PreviewView.vue'),
    meta: { title: '拍摄预告', hideTabBar: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: { title: '消息中心', hideTabBar: true }
  },
  {
    path: '/chat/:id',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: '聊天', hideTabBar: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于瞬影', hideTabBar: true }
  },
  {
    path: '/profile/feedback',
    name: 'feedback',
    component: () => import('@/views/FeedbackView.vue'),
    meta: { title: '意见反馈', hideTabBar: true }
  },
  {
    path: '/profile/coupons',
    name: 'coupons',
    component: () => import('@/views/CouponsView.vue'),
    meta: { title: '我的优惠', hideTabBar: true }
  },
  {
    path: '/profile/points',
    name: 'points',
    component: () => import('@/views/PointsView.vue'),
    meta: { title: '我的积分', hideTabBar: true }
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: () => import('@/views/ProfileEditView.vue'),
    meta: { title: '编辑资料', hideTabBar: true }
  },
  {
    path: '/profile/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { title: '我的订单', hideTabBar: true }
  },
  {
    path: '/profile/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: { title: '订单详情', hideTabBar: true }
  },
  {
    path: '/photographer/:id',
    name: 'photographer-detail',
    component: () => import('@/views/PhotographerView.vue'),
    meta: { title: '摄影师详情', hideTabBar: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 为route.meta提供类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hideTabBar?: boolean
  }
}

// 路由守卫：修改页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 瞬影` : '瞬影'
  next()
})

export default router
