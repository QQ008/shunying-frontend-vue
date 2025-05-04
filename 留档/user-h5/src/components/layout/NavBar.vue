<template>
  <van-nav-bar
    :title="title"
    :left-text="showBack ? '返回' : ''"
    :left-arrow="showBack"
    @click-left="onClickLeft"
    class="fixed top-0 left-0 right-0 z-50"
    style="height: 46px;" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps({
  title: {
    type: String,
    default: '瞬影'
  },
  showBack: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();

const onClickLeft = () => {
  router.back();
};
</script> 