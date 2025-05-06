<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TopBar from '../components/TopBar.vue';
import '../assets/HomeView.css';

const router = useRouter();

// 假设的图片URL，实际开发时需要替换为真实的资源
const bannerImage = ref('/images/banner-bg.png');

interface HotSpot {
  name: string;
  location: string;
  image: string;
}

// 热门地点数据
const hotSpots = ref<HotSpot[]>([
  {
    name: '戒台寺',
    location: '北京市头沟',
    image: '/images/place1.jpg'
  },
  {
    name: '潭王路',
    location: '北京市头沟',
    image: '/images/place2.jpg'
  },
  {
    name: '妙峰山',
    location: '北京市头沟',
    image: '/images/place3.png'
  }
]);

// 点击状态管理
const isSearchActive = ref(false);
const isFeatureActive1 = ref(false);
const isFeatureActive2 = ref(false);
const activeSpotIndex = ref(-1);

// 跳转到搜索页面
const goToSearch = () => {
  isSearchActive.value = true;
  setTimeout(() => {
    router.replace('/search');
    isSearchActive.value = false;
  }, 150);
};

// 功能区块点击
const handleFeatureClick = (featureName: string) => {
  if (featureName === '拍摄预告') {
    isFeatureActive1.value = true;
    setTimeout(() => {
      router.push('/preview');
      isFeatureActive1.value = false;
    }, 150);
  } else if (featureName === '活动专区') {
    isFeatureActive2.value = true;
    setTimeout(() => {
      console.log('点击了活动专区');
      isFeatureActive2.value = false;
    }, 150);
  }
};

// 热门地点点击
const handleSpotClick = (spot: HotSpot) => {
  const index = hotSpots.value.findIndex(item => item.name === spot.name);
  activeSpotIndex.value = index;
  setTimeout(() => {
    console.log('点击了热门地点:', spot.name);
    activeSpotIndex.value = -1;
  }, 150);
};
</script>

<template>
  <div class="home-view">
    <!-- 顶部导航栏 -->
    <TopBar :is-fixed="true" />

    <!-- 头部横幅 -->
    <div class="banner-container">
      <div class="banner" :style="{ backgroundImage: 'url(' + bannerImage + ')' }">
        <div class="banner-content">
          <h1 class="banner-title">瞬影, 捕捉速度</h1>
          <h1 class="banner-title">与风的对话</h1>
        </div>
      </div>
      <div class="banner-gradient"></div>
    </div>

    <!-- 功能区域 -->
    <div class="features-container">
      <!-- 查找图片卡片 -->
      <div class="search-block" @click="goToSearch" :class="{ 'active': isSearchActive }">
        <div class="search-icon">
          <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32.5" cy="32.5" r="27.5" stroke="white" stroke-width="5" fill="white" fill-opacity="0.35"/>
            <path d="M51 51L61 61" stroke="white" stroke-width="5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="search-text">
          <h3>查找图片</h3>
          <p>查找属于您的照片～</p>
        </div>
      </div>

      <!-- 拍摄预告&活动专区 -->
      <div class="feature-blocks">
        <div class="feature-block" @click="handleFeatureClick('拍摄预告')" :class="{ 'active': isFeatureActive1 }">
          <div class="feature-bg"></div>
          <div class="feature-content">
            <div class="feature-icon">
              <img src="/images/icons/calendar.svg" alt="拍摄预告" width="28" height="28">
            </div>
            <div class="feature-text">
              <h4>拍摄预告</h4>
              <p>查看瞬影师拍摄计划</p>
            </div>
          </div>
        </div>
        <div class="feature-block" @click="handleFeatureClick('活动专区')" :class="{ 'active': isFeatureActive2 }">
          <div class="feature-bg"></div>
          <div class="feature-content">
            <div class="feature-icon">
              <img src="/images/icons/trophy.svg" alt="活动专区" width="28" height="28">
            </div>
            <div class="feature-text">
              <h4>活动专区</h4>
              <p>比赛与活动专属图片</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门地点 -->
      <div class="hot-spots">
        <div class="section-header">
          <h3>热门地点</h3>
          <router-link to="/more-spots" class="view-all">
            查看全部
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
        </div>
        <div class="spot-list-container">
          <div class="spot-list">
            <div class="spot-card"
                 v-for="(spot, index) in hotSpots"
                 :key="index"
                 @click="handleSpotClick(spot)"
                 :class="{ 'active': activeSpotIndex === index }">
              <div class="spot-image" :style="{ backgroundImage: 'url(' + spot.image + ')' }"></div>
              <div class="spot-info">
                <h4>{{ spot.name }}</h4>
                <p><van-icon name="location-o" size="12" color="#9966ff" /> {{ spot.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式已移动到外部CSS文件 */
</style>
