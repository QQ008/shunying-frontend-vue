<script setup lang="ts">
import TabBar from './components/TabBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showTabBar = computed(() => !route.meta.hideTabBar)
</script>

<template>
  <div class="app-container">
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
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
  height: 100%;
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

.page-enter-active,
.page-leave-active {
  transition: opacity 0.10s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-8px);
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
