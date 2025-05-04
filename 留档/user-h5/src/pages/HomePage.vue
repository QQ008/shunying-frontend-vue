<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">瞬影 - 用户端首页 (H5)</h1>
    <p>这里是首页内容区域。</p>
    <van-button type="primary" class="mt-4" @click="showTestNav = !showTestNav">
      {{ showTestNav ? '隐藏导航测试' : '显示导航测试' }}
    </van-button>
    
    <!-- 导航测试组件 - 仅开发阶段使用 -->
    <test-navigation v-if="showTestNav" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TestNavigation from '@/components/TestNavigation.vue';

// 控制测试导航的显示/隐藏
const showTestNav = ref(true);
</script>

<style scoped>
/* 可以在这里添加特定于此页面的样式 */
</style> 