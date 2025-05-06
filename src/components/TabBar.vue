<!-- 底部导航栏 -->
<template>
  <div class="tab-bar">
    <router-link to="/" class="tab-item" active-class="active" v-slot="{ isActive }" replace>
      <div class="icon-wrapper">
        <div class="icon" :class="{ 'icon-active': isActive }">
          <img :src="isActive ? '/images/icons/home-active.svg' : '/images/icons/home.svg'" alt="首页" />
        </div>
        <div class="text" :class="{ 'text-active': isActive }">首页</div>
      </div>
    </router-link>
    <router-link to="/search" class="tab-item" active-class="active" v-slot="{ isActive }" replace>
      <div class="icon-wrapper">
        <div class="icon" :class="{ 'icon-active': isActive }">
          <img :src="isActive ? '/images/icons/search-active.svg' : '/images/icons/search.svg'" alt="查找" />
        </div>
        <div class="text" :class="{ 'text-active': isActive }">查找</div>
      </div>
    </router-link>
    <router-link to="/explore" class="tab-item" active-class="active" v-slot="{ isActive }" replace>
      <div class="icon-wrapper">
        <div class="icon" :class="{ 'icon-active': isActive }">
          <img :src="isActive ? '/images/icons/explore-active.svg' : '/images/icons/explore.svg'" alt="探索" />
        </div>
        <div class="text" :class="{ 'text-active': isActive }">探索</div>
      </div>
    </router-link>
    <router-link to="/profile" class="tab-item" active-class="active" v-slot="{ isActive }" replace>
      <div class="icon-wrapper">
        <div class="icon" :class="{ 'icon-active': isActive }">
          <img :src="isActive ? '/images/icons/profile-active.svg' : '/images/icons/profile.svg'" alt="我的" />
        </div>
        <div class="text" :class="{ 'text-active': isActive }">我的</div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()
// const currentPath = ref(router.currentRoute.value.path)
</script>

<style scoped>
.tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background-color: #ffffff;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 0 5%;
  width: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666666;
  text-decoration: none;
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.icon {
  margin-bottom: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}

.icon img {
  width: 26px;
  height: 26px;
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.icon-active {
  transform: translateY(-2px) scale(1.08);
}

.text {
  font-size: 12px;
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
  color: #666666;
}

.text-active {
  color: #9966ff;
  font-weight: 500;
}

@media (min-width: 768px) {
  .tab-bar {
    padding: 0 20%;
  }

  .icon img {
    width: 28px;
    height: 28px;
  }

  .text {
    font-size: 13px;
  }
}
</style>
