<template>
  <div class="test-navigation p-4 border-t border-gray-100 mt-4">
    <h3 class="text-base font-medium mb-2">页面导航测试</h3>
    <div class="grid grid-cols-2 gap-2">
      <!-- 主导航 -->
      <van-button size="small" type="primary" @click="nav.goToHome()">首页</van-button>
      <van-button size="small" type="primary" @click="nav.goToSearch()">查找</van-button>
      <van-button size="small" type="primary" @click="nav.goToExplore()">探索</van-button>
      <van-button size="small" type="primary" @click="nav.goToProfile()">我的</van-button>

      <!-- 二级页面导航 -->
      <van-button size="small" @click="nav.goToImageGroupDetail(1)">图片组详情</van-button>
      <van-button size="small" @click="nav.goToCart()">购物车</van-button>
      <van-button size="small" @click="nav.goToOrderList()">订单列表</van-button>
      <van-button size="small" @click="nav.goToOrderDetail(1)">订单详情</van-button>
      <van-button size="small" @click="nav.goToFavorites()">我的收藏</van-button>
      <van-button size="small" @click="nav.goToPurchasedImages()">已购图片</van-button>
      <van-button size="small" @click="nav.goToHistory()">浏览历史</van-button>
      <van-button size="small" @click="nav.goToPhotographerDetail(1)">摄影师详情</van-button>
      <van-button size="small" @click="nav.goToPreview()">拍摄预告</van-button>
      <van-button size="small" @click="nav.goToFeedback()">意见反馈</van-button>
      <van-button size="small" @click="nav.goToEvents()">赛事活动</van-button>
      <van-button size="small" @click="nav.goToArticleList()">文章列表</van-button>
      <van-button size="small" @click="nav.goToArticleDetail('test')">文章详情</van-button>
      <van-button size="small" @click="nav.goToSettings()">设置</van-button>
      <van-button size="small" @click="nav.goToLogin()">登录</van-button>
      <van-button size="small" @click="nav.goBack()">返回</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from '@/utils/navigation';

// 获取导航服务
const nav = useNavigation();
</script> 