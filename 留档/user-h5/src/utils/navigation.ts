import type { Router } from 'vue-router';

/**
 * 导航服务 - 用于页面间跳转
 * 可在任意组件中通过 import { useNavigation } from '@/utils/navigation' 导入使用
 */
export class NavigationService {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  // 主导航页面
  
  /**
   * 跳转到首页
   */
  goToHome() {
    this.router.push('/home');
  }

  /**
   * 跳转到查找页
   */
  goToSearch() {
    this.router.push('/search');
  }

  /**
   * 跳转到探索页
   */
  goToExplore() {
    this.router.push('/explore');
  }

  /**
   * 跳转到个人中心页
   */
  goToProfile() {
    this.router.push('/profile');
  }

  // 二级页面

  /**
   * 跳转到图片组详情页
   * @param id 图片组ID
   */
  goToImageGroupDetail(id: number | string) {
    this.router.push(`/search/detail/${id}`);
  }

  /**
   * 跳转到购物车页面
   */
  goToCart() {
    this.router.push('/cart');
  }

  /**
   * 跳转到登录页
   */
  goToLogin() {
    this.router.push('/login');
  }

  /**
   * 跳转到订单列表页
   */
  goToOrderList() {
    this.router.push('/orders');
  }

  /**
   * 跳转到订单详情页
   * @param id 订单ID
   */
  goToOrderDetail(id: number | string) {
    this.router.push(`/orders/${id}`);
  }

  /**
   * 跳转到收藏页
   */
  goToFavorites() {
    this.router.push('/profile/favorites');
  }

  /**
   * 跳转到已购图片页
   */
  goToPurchasedImages() {
    this.router.push('/profile/purchased');
  }

  /**
   * 跳转到浏览历史页
   */
  goToHistory() {
    this.router.push('/profile/history');
  }

  /**
   * 跳转到摄影师详情页
   * @param id 摄影师ID
   */
  goToPhotographerDetail(id: number | string) {
    this.router.push(`/photographer/${id}`);
  }

  /**
   * 跳转到拍摄预告页
   */
  goToPreview() {
    this.router.push('/preview');
  }

  /**
   * 跳转到意见反馈页
   */
  goToFeedback() {
    this.router.push('/feedback');
  }

  /**
   * 跳转到赛事活动页
   */
  goToEvents() {
    this.router.push('/events');
  }

  /**
   * 跳转到文章列表页
   */
  goToArticleList() {
    this.router.push('/article/list');
  }

  /**
   * 跳转到文章详情页
   * @param slug 文章标识
   */
  goToArticleDetail(slug: string) {
    this.router.push(`/article/${slug}`);
  }

  /**
   * 跳转到设置页
   */
  goToSettings() {
    this.router.push('/setting');
  }

  /**
   * 返回上一页
   */
  goBack() {
    this.router.back();
  }
}

// 创建一个闭包，用于在需要时延迟初始化导航服务
let navigationService: NavigationService | null = null;

/**
 * 获取导航服务实例
 * @param router Vue Router实例
 * @returns NavigationService实例
 */
export function useNavigation(router?: Router): NavigationService {
  if (!navigationService && router) {
    navigationService = new NavigationService(router);
  } else if (!navigationService && !router) {
    throw new Error('首次调用 useNavigation 必须提供 router 实例');
  }
  
  return navigationService!;
} 