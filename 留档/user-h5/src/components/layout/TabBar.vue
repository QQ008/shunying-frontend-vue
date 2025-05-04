<template>
  <van-tabbar v-model="active" route fixed class="fixed bottom-0 left-0 right-0 z-50">
    <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item replace to="/search" icon="search">查找</van-tabbar-item>
    <van-tabbar-item replace to="/explore" icon="guide-o">探索</van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const active = ref(0);

// 监听路由变化来更新 active 的值
watch(
  () => route.path,
  (newPath) => {
    // 统一路径格式，移除开头的斜杠进行比较
    const normalizedPath = newPath.replace(/^\/+/, '');
    
    if (normalizedPath === 'home') {
      active.value = 0; // 首页
    } else if (normalizedPath === 'search') {
      active.value = 1; // 查找
    } else if (normalizedPath === 'explore') {
      active.value = 2; // 探索
    } else if (normalizedPath === 'profile') {
      active.value = 3; // 我的
    } else if (normalizedPath === '') {
      // 如果是根路径，重定向到home
      router.replace('/home');
    }
  },
  { immediate: true } // 立即执行一次以初始化
);
</script> 