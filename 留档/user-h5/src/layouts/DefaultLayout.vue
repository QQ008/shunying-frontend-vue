<template>
  <div>
    <NavBar :title="route.meta.title as string || '瞬影'" :show-back="route.path !== '/'" />
    <main class="pt-[46px]"> <!-- pt-[46px] to offset fixed NavBar height -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script> 