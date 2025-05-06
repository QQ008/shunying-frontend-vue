<script setup lang="ts">
import TabBar from './components/TabBar.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showTabBar = computed(() => !route.meta.hideTabBar)

// 定义导航方向
const transitionName = ref('slide-right')

// 页面层级映射，用于判断导航方向
const pageOrder: Record<string, number> = {
  'home': 0,      // 首页
  'search': 1,    // 查找
  'explore': 2,   // 探索
  'profile': 3,   // 我的
}

// 监听路由变化，确定导航方向
watch(() => route.name, (to, from) => {
  if (!to || !from) return

  const toName = to.toString()
  const fromName = from.toString()

  // 仅当在一级页面之间导航时判断方向
  if (toName in pageOrder && fromName in pageOrder) {
    transitionName.value = pageOrder[toName] > pageOrder[fromName] ? 'slide-left' : 'slide-right'
  } else {
    // 二级页面统一使用右滑入效果
    transitionName.value = 'slide-right'
  }
}, { immediate: true })
</script>

<template>
  <div class="app-container">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

html, body {
  /* height: 100%; */
  width: 100%;
  background-color: #F5F5F7;
  color: #333;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 100%;
  margin: 0;
  overflow-x: hidden;
  background-color: #F5F5F7;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 65px;
  width: 100%;
}

/* 向左滑动动画 - 从右向左 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.1s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* 向右滑动动画 - 从左向右 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.10s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

@media (min-width: 768px) {
  .app-container {
    max-width: 768px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  }
}

@media (min-width: 1024px) {
  .app-container {
    max-width: 480px;
  }
}
</style>
