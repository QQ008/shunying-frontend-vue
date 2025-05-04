import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入布局组件
import TabLayout from '@/layouts/TabLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// 导入页面组件
import HomePage from '@/pages/HomePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import ExplorePage from '@/pages/ExplorePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import ImageGroupDetailPage from '@/pages/ImageGroupDetailPage.vue'
import CartPage from '@/pages/CartPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import OrderListPage from '@/pages/OrderListPage.vue'
import OrderDetailPage from '@/pages/OrderDetailPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import PurchasedImagesPage from '@/pages/PurchasedImagesPage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'
import PhotographerDetailPage from '@/pages/PhotographerDetailPage.vue'
import PreviewPage from '@/pages/PreviewPage.vue'
import FeedbackPage from '@/pages/FeedbackPage.vue'
import EventsPage from '@/pages/EventsPage.vue'
import ArticleListPage from '@/pages/ArticleListPage.vue'
import ArticleDetailPage from '@/pages/ArticleDetailPage.vue'
import SettingPage from '@/pages/SettingPage.vue'

const routes: Array<RouteRecordRaw> = [
  // 根路径重定向到/home
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: TabLayout, // 使用 Tab 布局
    children: [
      {
        path: 'home', // 对应 /home 路径
        name: 'Home',
        component: HomePage,
        meta: { title: '首页', keepAlive: true }
      },
      {
        path: 'search',
        name: 'Search',
        component: SearchPage,
        meta: { title: '查找', keepAlive: true }
      },
      {
        path: 'explore',
        name: 'Explore',
        component: ExplorePage,
        meta: { title: '探索', keepAlive: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfilePage,
        meta: { title: '我的', keepAlive: true }
      },
    ]
  },
  {
    path: '/', // 根路径，用于 DefaultLayout 包裹的二级页面
    component: DefaultLayout, // 使用默认布局
    children: [
      {
        path: 'search/detail/:id',
        name: 'ImageGroupDetail',
        component: ImageGroupDetailPage,
        props: true,
        meta: { title: '图片组详情' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: CartPage,
        meta: { title: '购物车' }
      },
      {
        path: 'orders',
        name: 'OrderList',
        component: OrderListPage,
        meta: { title: '我的订单' }
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: OrderDetailPage,
        props: true,
        meta: { title: '订单详情' }
      },
      {
        path: 'profile/favorites',
        name: 'Favorites',
        component: FavoritesPage,
        meta: { title: '我的收藏' }
      },
      {
        path: 'profile/purchased',
        name: 'PurchasedImages',
        component: PurchasedImagesPage,
        meta: { title: '已购图片' }
      },
      {
        path: 'profile/history',
        name: 'History',
        component: HistoryPage,
        meta: { title: '浏览记录' }
      },
      {
        path: 'photographer/:id',
        name: 'PhotographerDetail',
        component: PhotographerDetailPage,
        props: true,
        meta: { title: '摄影师详情' }
      },
      {
        path: 'preview',
        name: 'Preview',
        component: PreviewPage,
        meta: { title: '拍摄预告' }
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: FeedbackPage,
        meta: { title: '意见反馈' }
      },
      {
        path: 'events',
        name: 'Events',
        component: EventsPage,
        meta: { title: '赛事活动' }
      },
      {
        path: 'article/list',
        name: 'ArticleList',
        component: ArticleListPage,
        meta: { title: '文章列表' }
      },
      {
        path: 'article/:slug',
        name: 'ArticleDetail',
        component: ArticleDetailPage,
        props: true,
        meta: { title: '文章详情' }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: SettingPage,
        meta: { title: '设置' }
      }
    ]
  },
  // 单独处理不需要布局的页面，如 Login
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: '登录' }
  },
  // 404 页面重定向到首页
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/home' 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局路由守卫 - 可以在这里处理页面标题、权限验证等
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `瞬影 - ${to.meta.title}`
  } else {
    document.title = '瞬影'
  }
  
  // 这里可以添加登录验证等逻辑
  // 例如: 检查是否需要登录的页面
  // const needsAuth = to.matched.some(record => record.meta.requiresAuth)
  // if (needsAuth && !isLoggedIn) {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  next()
})

export default router 