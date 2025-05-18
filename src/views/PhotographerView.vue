<template>
  <div class="photographer-view">
    <!-- 自定义顶部栏 -->
    <div class="custom-header">
      <div class="back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="page-title">摄影师详情</h1>
      <div class="right-placeholder"></div>
    </div>

    <!-- 内容主体区域 -->
    <div class="content-container">
      <!-- 摄影师信息卡片 -->
      <div class="photographer-info-section">
        <div class="photographer-info">
          <div class="avatar">
            <img :src="photographer.avatar" alt="摄影师头像">
          </div>
          <div class="photographer-details">
            <h3 class="nickname">{{ photographer.nickname }}</h3>
            <p class="photographer-id">@{{ photographer.account }}</p>
          </div>
          <div class="follow-button" :class="{ followed: isFollowed }" @click="toggleFollow">
            {{ isFollowed ? '已关注' : '关注' }}
          </div>
        </div>
        <div class="photographer-stats">
          <div class="stats-item">
            <div class="stats-value">{{ photographer.photoCount }}</div>
            <div class="stats-label">作品数</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ photographer.followersCount }}</div>
            <div class="stats-label">粉丝</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ photographer.photoGroups }}</div>
            <div class="stats-label">作品组</div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="contact-section" v-if="showPhoneContact">
        <div class="contact-phone">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 13.9867V16.32C17.5001 16.5347 17.4346 16.7438 17.3122 16.9218C17.1898 17.0998 17.0162 17.2388 16.8163 17.3209C16.6164 17.403 16.3982 17.4246 16.1866 17.3833C16.0081 17.3492 15.8314 17.308 15.6567 17.26C13.4539 16.6318 11.4276 15.5337 9.70667 14.0467C8.10511 12.67 6.81675 10.9719 5.90667 9.07334C5.4 7.89751 5.09265 6.64835 5 5.37334C4.95968 5.1683 4.98043 4.95692 5.05901 4.76266C5.13759 4.56841 5.26998 4.40007 5.43906 4.2812C5.60814 4.16232 5.8094 4.09712 6.01667 4.09334H8.35C8.70416 4.09011 9.04602 4.21675 9.31429 4.4485C9.58257 4.68025 9.75582 5.00004 9.8 5.35334C9.87468 5.96483 10.0153 6.56346 10.2167 7.14C10.3178 7.41763 10.3336 7.72072 10.2614 8.00591C10.1892 8.29109 10.0328 8.5427 9.81667 8.72667L8.98334 9.56C9.81865 11.1976 11.0691 12.5481 12.6067 13.4833L13.44 12.65C13.624 12.4339 13.8756 12.2775 14.1608 12.2053C14.446 12.1331 14.7491 12.1489 15.0267 12.25C15.6032 12.4514 16.2019 12.592 16.8133 12.6667C17.1722 12.7121 17.4963 12.8908 17.73 13.1669C17.9636 13.4429 18.0879 13.7931 18.08 14.1533L17.5 13.9867Z" fill="#9966FF"/>
          </svg>
          <span @click="copyPhone" class="phone-number">{{ maskPhone(photographer.phone) }}</span>
        </div>
        <div class="contact-button" @click="startChat">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 11.3388 2.82571 12.606 3.40217 13.724C3.53771 13.9702 3.56223 14.2534 3.46889 14.5057L3.00878 15.8858C2.86016 16.3308 3.16929 16.7782 3.60764 16.7349L5.5635 16.5763C5.79671 16.5504 6.02992 16.6164 6.21636 16.7584C7.28242 17.2602 8.50516 17.5 10 17.5Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12.5 8.33334L7.5 13.3333M7.5 8.33334L12.5 13.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>联系ta</span>
        </div>
      </div>

      <div class="contact-section-chat" v-else>
        <div class="contact-button chat-only" @click="startChat">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 11.3388 2.82571 12.606 3.40217 13.724C3.53771 13.9702 3.56223 14.2534 3.46889 14.5057L3.00878 15.8858C2.86016 16.3308 3.16929 16.7782 3.60764 16.7349L5.5635 16.5763C5.79671 16.5504 6.02992 16.6164 6.21636 16.7584C7.28242 17.2602 8.50516 17.5 10 17.5Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M6.66666 8.33334H13.3333M6.66666 11.6667H10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>联系ta</span>
        </div>
      </div>

      <!-- 简介 -->
      <div class="intro-section">
        <div class="section-title">
          <h2>摄影师介绍</h2>
        </div>
        <div class="intro-content">
          <p>{{ photographer.bio }}</p>
        </div>
      </div>

      <!-- 拍摄预告 -->
      <div class="preview-section">
        <div class="section-title">
          <h2>ta的拍摄预告</h2>
          <div class="view-more" @click="navigateTo('/preview')">
            查看更多
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="preview-list">
          <div v-for="(preview, index) in photographerPreviews" :key="index" class="preview-item">
            <div class="preview-date">
              <div class="date-day">{{ formatDate(preview.date).day }}</div>
              <div class="date-month">{{ formatDate(preview.date).month }}月</div>
            </div>
            <div class="preview-info">
              <div class="preview-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 21C16 17 20 13.4183 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13.4183 8 17 12 21Z" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ preview.location }}
              </div>
              <div class="preview-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#9966FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ preview.timeRange }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 作品展示区域 -->
      <div class="works-section">
        <div class="section-title">
          <h2>ta的作品</h2>
        </div>

        <div v-if="photographerWorks.length === 0" class="empty-works">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="#EFEFEF"/>
              <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 15L16 10L5 21" stroke="#CCCCCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="empty-text">暂无作品展示</p>
        </div>

        <div v-else class="works-masonry">
          <div class="works-row-1">
            <div class="work-item large" @click="navigateToImageGroup(photographerWorks[0].id)">
              <img :src="photographerWorks[0].coverUrl" alt="作品">
            </div>
            <div class="works-column">
              <div class="work-item small" @click="navigateToImageGroup(photographerWorks[1].id)">
                <img :src="photographerWorks[1].coverUrl" alt="作品">
              </div>
              <div class="work-item small" @click="navigateToImageGroup(photographerWorks[2].id)">
                <img :src="photographerWorks[2].coverUrl" alt="作品">
              </div>
            </div>
          </div>
          <div class="works-row-2">
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[3].id)">
              <img :src="photographerWorks[3].coverUrl" alt="作品">
            </div>
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[4].id)">
              <img :src="photographerWorks[4].coverUrl" alt="作品">
            </div>
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[5].id)">
              <img :src="photographerWorks[5].coverUrl" alt="作品">
            </div>
          </div>
          <div class="works-row-3">
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[6].id)">
              <img :src="photographerWorks[6]?.coverUrl || 'https://picsum.photos/300/350?random=7'" alt="作品">
            </div>
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[7].id)">
              <img :src="photographerWorks[7]?.coverUrl || 'https://picsum.photos/300/350?random=8'" alt="作品">
            </div>
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[8].id)">
              <img :src="photographerWorks[8]?.coverUrl || 'https://picsum.photos/300/350?random=9'" alt="作品">
            </div>
          </div>
          <div class="works-row-4">
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[9].id)">
              <img :src="photographerWorks[9]?.coverUrl || 'https://picsum.photos/300/350?random=10'" alt="作品">
            </div>
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[10].id)">
              <img :src="photographerWorks[10]?.coverUrl || 'https://picsum.photos/300/350?random=11'" alt="作品">
            </div>
            <div class="work-item medium" @click="navigateToImageGroup(photographerWorks[11].id)">
              <img :src="photographerWorks[11]?.coverUrl || 'https://picsum.photos/300/350?random=12'" alt="作品">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

// 路由相关
const route = useRoute();
const router = useRouter();
const toast = useToast();
const photographerId = computed(() => route.params.id as string);

// 摄影师数据
const photographer = ref({
  id: '',
  nickname: 'XXXXXXXX',
  account: '瞬尚·摄影',
  avatar: 'https://placekitten.com/100/100', // 使用示例图片
  bio: '我是专业的骑行摄影师，有5年专业摄影经验。常年活跃在北京骑行圈，曾为多项赛事提供专业摄影服务。希望能用镜头记录下你精彩的骑行瞬间！',
  phone: '12345678901',
  photoCount: 356,
  photoGroups: 68,
  followersCount: 128,
});

// 关注状态
const isFollowed = ref(false);

// 联系方式显示模式
const showPhoneContact = ref(true);

// 摄影师的拍摄预告
const photographerPreviews = ref([
  {
    id: 1,
    date: '2023-10-15',
    location: '北京怀柔黄花城水长城',
    timeRange: '08:00-11:00'
  },
  {
    id: 2,
    date: '2023-10-21',
    location: '北京延庆八达岭长城',
    timeRange: '09:00-12:00'
  }
]);

// 摄影师的作品列表
const photographerWorks = ref([
  {
    id: 1,
    coverUrl: 'https://picsum.photos/300/400?random=1',
    photoCount: 24
  },
  {
    id: 2,
    coverUrl: 'https://picsum.photos/300/300?random=2',
    photoCount: 18
  },
  {
    id: 3,
    coverUrl: 'https://picsum.photos/300/350?random=3',
    photoCount: 32
  },
  {
    id: 4,
    coverUrl: 'https://picsum.photos/300/450?random=4',
    photoCount: 15
  },
  {
    id: 5,
    coverUrl: 'https://picsum.photos/300/320?random=5',
    photoCount: 27
  },
  {
    id: 6,
    coverUrl: 'https://picsum.photos/300/360?random=6',
    photoCount: 19
  }
]);

// 切换关注状态
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value;

  // 使用Toast组件提示用户
  if (isFollowed.value) {
    toast.show('已关注');
  } else {
    toast.show('已取消关注');
  }

  // 实际项目中需要调用API保存关注状态
  console.log('关注状态:', isFollowed.value);
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1
  };
};

// 隐藏电话号码中间部分
const maskPhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 开始聊天
const startChat = () => {
  // 实际项目中应跳转至聊天页面或打开聊天窗口
  router.push(`/chat/${photographerId.value}`);
};

// 页面跳转
const navigateTo = (path: string) => {
  router.push(path);
};

// 跳转到图片组详情
const navigateToImageGroup = (id: number) => {
  if (!id) return; // 防止点击默认图片时出错
  router.push(`/search/detail/${id}`);
};

// 页面加载时获取摄影师数据
onMounted(() => {
  // 这里应该调用API获取摄影师的详细信息
  // 使用photographerId.value获取路由参数中的ID
  console.log('获取摄影师ID:', photographerId.value);

  // 模拟API调用
  // 实际项目中应替换为真实的API请求
  // fetchPhotographerData(photographerId.value);
});

// 添加手机号点击复制功能
const copyPhone = () => {
  // 这里应该实现复制手机号的逻辑
  console.log('手机号已复制:', photographer.value.phone);
  toast.show('手机号已复制成功');
};
</script>

<style scoped>
/* 摄影师详情页样式 */
.photographer-view {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding-bottom: 30px;
}

/* 自定义顶部栏 */
.photographer-view .custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 16px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.photographer-view .back-button {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.photographer-view .page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.photographer-view .right-placeholder {
  width: 24px;
}

/* 内容容器 */
.photographer-view .content-container {
  padding: 0 16px;
}

/* 摄影师信息区 */
.photographer-view .photographer-info-section {
  margin: 24px 0;
}

.photographer-view .photographer-info {
  display: flex;
  align-items: center;
  position: relative;
}

.photographer-view .avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #9966FF;
  box-shadow: 0 2px 8px rgba(153, 102, 255, 0.3);
  flex-shrink: 0;
}

.photographer-view .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photographer-view .photographer-details {
  margin-left: 16px;
  flex: 1;
}

.photographer-view .nickname {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.photographer-view .photographer-id {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.photographer-view .follow-button {
  background-color: #9966FF;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.photographer-view .follow-button:hover {
  background-color: #8952e0;
  transform: translateY(-1px);
}

.photographer-view .follow-button.followed {
  background-color: rgba(153, 102, 255, 0.1);
  color: #9966FF;
  border: 1px solid rgba(153, 102, 255, 0.3);
}

.photographer-view .follow-button.followed:hover {
  background-color: rgba(153, 102, 255, 0.15);
}

.photographer-view .photographer-stats {
  display: flex;
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.photographer-view .stats-item {
  flex: 1;
  text-align: center;
}

.photographer-view .stats-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.photographer-view .stats-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 联系方式 */
.photographer-view .contact-section {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0 24px;
}

.photographer-view .contact-phone {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  color: #333;
}

.photographer-view .contact-phone svg {
  margin-right: 8px;
}

.photographer-view .contact-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(153, 102, 255, 0.1);
  color: #9966FF;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(153, 102, 255, 0.2);
}

.photographer-view .contact-button:hover {
  background-color: rgba(153, 102, 255, 0.15);
}

.photographer-view .contact-button svg {
  margin-right: 8px;
}

.photographer-view .contact-section-chat {
  margin: 16px 0 24px;
}

.photographer-view .chat-only {
  width: 100%;
}

/* 通用区块样式 */
.photographer-view .section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.photographer-view .section-title h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
  position: relative;
  padding-left: 12px;
}

.photographer-view .section-title h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  height: 16px;
  width: 3px;
  background-color: #9966FF;
  border-radius: 3px;
}

.photographer-view .view-more {
  font-size: 14px;
  color: #9966FF;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.photographer-view .view-more:hover {
  opacity: 0.8;
}

.photographer-view .intro-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 24px;
}

/* 拍摄预告 */
.photographer-view .preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.photographer-view .preview-item {
  display: flex;
  align-items: center;
  padding: 14px;
  border-radius: 12px;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
}

.photographer-view .preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.05);
}

.photographer-view .preview-date {
  min-width: 60px;
  text-align: center;
  padding-right: 12px;
  border-right: 1px solid #eee;
}

.photographer-view .date-day {
  font-size: 20px;
  font-weight: bold;
  color: #9966FF;
}

.photographer-view .date-month {
  font-size: 14px;
  color: #666;
}

.photographer-view .preview-info {
  margin-left: 16px;
  flex: 1;
}

.photographer-view .preview-location,
.photographer-view .preview-time {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}

.photographer-view .preview-location svg,
.photographer-view .preview-time svg {
  margin-right: 6px;
  flex-shrink: 0;
}

.photographer-view .preview-location {
  font-weight: 500;
  color: #333;
}

/* 作品展示区新样式 */
.photographer-view .empty-works {
  text-align: center;
  padding: 30px 0;
}

.photographer-view .empty-icon {
  margin-bottom: 10px;
}

.photographer-view .empty-text {
  color: #999;
  font-size: 14px;
}

/* 新的瀑布流布局 */
.photographer-view .works-masonry {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 -16px; /* 让图片区域可以延伸到两侧边缘 */
  padding: 0 8px; /* 内部添加一些内边距 */
}

.photographer-view .works-row-1 {
  display: flex;
  gap: 8px;
  height: 260px;
}

.photographer-view .works-row-2,
.photographer-view .works-row-3,
.photographer-view .works-row-4 {
  display: flex;
  gap: 8px;
  height: 130px;
}

.photographer-view .works-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 45%;
}

.photographer-view .work-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.photographer-view .work-item:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  z-index: 10;
}

.photographer-view .work-item.large {
  width: 55%;
  height: 100%;
  background-color: #FFE6F6; /* 粉色背景 */
  border-top-left-radius: 16px; /* 左上角为大圆角 */
}

.photographer-view .work-item.small {
  width: 100%;
  height: calc(50% - 4px); /* 减去间隙的一半 */
}

.photographer-view .work-item.small:first-child {
  background-color: #D6EFFF; /* 浅蓝色背景 */
  border-top-right-radius: 16px; /* 右上角为大圆角 */
}

.photographer-view .work-item.small:last-child {
  background-color: #E0FFDB; /* 浅绿色背景 */
}

.photographer-view .work-item.medium {
  flex: 1;
  height: 100%;
}

.photographer-view .work-item.medium:nth-child(1) {
  background-color: #DBFFFD; /* 浅青色背景 */
}

.photographer-view .work-item.medium:nth-child(2) {
  background-color: #FFF8DB; /* 浅黄色背景 */
}

.photographer-view .work-item.medium:nth-child(3) {
  background-color: #FFE3FF; /* 浅紫色背景 */
}

.photographer-view .work-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.photographer-view .work-item:hover img {
  transform: scale(1.05);
}
</style>
