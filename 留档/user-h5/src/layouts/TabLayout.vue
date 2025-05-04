<template>
  <div>
    <!-- 顶部导航栏可以根据需要添加 -->
    <!-- <NavBar :title="route.meta.title as string || '瞬影'" :show-back="false" /> -->
    <main class="pb-[50px]"> <!-- pb-[50px] to offset fixed TabBar height -->
      <router-view />
    </main>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import TabBar from '@/components/layout/TabBar.vue';
// import NavBar from '@/components/layout/NavBar.vue';
// import { useRoute } from 'vue-router';

// const route = useRoute();
</script> 