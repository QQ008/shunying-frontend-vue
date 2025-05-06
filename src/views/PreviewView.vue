<!-- 拍摄预告页 -->
<template>
  <div class="preview-view">
    <!-- 自定义导航栏 -->
    <div class="custom-nav">
      <div class="nav-left" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>返回</span>
      </div>
      <div class="nav-title">拍摄预告</div>
      <div class="nav-right"></div>
    </div>

    <div class="preview-container">
      <div class="header-section">
        <div class="title-wrapper">
          <div class="title-decoration"></div>
          <h1 class="page-title">摄影师拍摄计划</h1>
        </div>
        <p class="subtitle">探索瞬影专业摄影师的拍摄计划，提前获知各拍摄地点与时间安排</p>
      </div>

      <div class="filter-section">
        <div
          v-for="(filter, index) in filters"
          :key="index"
          class="filter-chip"
          :class="{ active: activeFilter === filter.value }"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </div>
      </div>

      <div class="loading-container" v-if="loading">
        <div class="loading-effect">
          <span></span><span></span><span></span>
        </div>
        <p>正在加载拍摄预告...</p>
      </div>

      <div v-else class="preview-content">
        <!-- 暂无数据提示 -->
        <div class="empty-state" v-if="filteredPreviewDays.length === 0">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 5V7C21 8.10457 20.1046 9 19 9H5C3.89543 9 3 8.10457 3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5Z" stroke="currentColor" stroke-width="2"/>
              <path d="M16 3V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 3V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 15V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>{{ getEmptyStateMessage() }}</h3>
          <p>请稍后再来查看，或关注我们的公众号获取最新拍摄信息</p>
          <button class="action-button">关注公众号</button>
        </div>

        <!-- 预告列表（按日期分组） -->
        <div class="preview-timeline">
          <preview-day-card
            v-for="(dateGroup, dateIndex) in filteredPreviewDays"
            :key="dateIndex"
            :date-group="dateGroup"
            :weather="getWeatherForDate(dateGroup.date)"
            @show-details="showPreviewDetails"
          />
        </div>
      </div>
    </div>

    <!-- 预告详情弹窗 -->
    <preview-detail-modal
      v-if="selectedPreview"
      :preview="selectedPreview"
      @close="closePreviewDetails"
      @go-to-photographer="goToPhotographerPage"
      @view-original="viewOriginalPost"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import '@/assets/styles/previewother.css';
import PreviewDayCard from '@/components/preview/PreviewDayCard.vue';
import PreviewDetailModal from '@/components/preview/PreviewDetailModal.vue';

interface WeatherInfo {
  date: Date;
  condition: string; // sunny, cloudy, rainy, etc.
  temperature: {
    low: number;
    high: number;
  }
  icon: string;
}

interface SocialMedia {
  platform: string; // instagram, weibo, xiaohongshu, etc.
  url: string;
  username: string;
}

interface PreviewItem {
  id: number;
  locationName: string;
  startTime: Date;
  endTime: Date;
  photographerId: number;
  photographerName: string;
  description?: string;
  isFeatured?: boolean;
  source?: 'platform' | 'friendlybusinessman' | 'xiaohongshu' | 'other'; // 拍摄来源
  sourceLabel?: string; // 来源标签显示内容
  originalPostUrl?: string; // 原始发布链接
  socialMediaLinks?: SocialMedia[]; // 社交媒体链接
  articleId?: number; // 平台内预告文章ID
}

interface DateGroup {
  date: Date;
  items: PreviewItem[];
}

// 状态变量
const loading = ref(true);
const previewList = ref<PreviewItem[]>([]);
const selectedPreview = ref<PreviewItem | null>(null);
const activeFilter = ref('all');
const weatherData = ref<WeatherInfo[]>([]);

// 筛选条件
const filters = [
  { label: '全部', value: 'all' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' }
];

// 设置筛选条件
const setFilter = (filter: string) => {
  activeFilter.value = filter;
};

// 根据筛选条件过滤预告
const filteredPreviewDays = computed<DateGroup[]>(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 计算本周结束时间
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (7 - today.getDay()));

  // 计算本月结束时间
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // 过滤预告列表
  const filteredList = previewList.value.filter(item => {
    const itemDate = new Date(item.startTime);
    itemDate.setHours(0, 0, 0, 0);

    switch (activeFilter.value) {
      case 'week':
        return itemDate >= today && itemDate <= weekEnd;
      case 'month':
        return itemDate >= today && itemDate <= monthEnd;
      default:
        return true;
    }
  });

  // 按日期分组
  const groups: Record<string, DateGroup> = {};

  filteredList.forEach(item => {
    // 使用日期作为分组键（不含时间）
    const dateStr = new Date(
      item.startTime.getFullYear(),
      item.startTime.getMonth(),
      item.startTime.getDate()
    ).toISOString().split('T')[0];

    if (!groups[dateStr]) {
      groups[dateStr] = {
        date: new Date(item.startTime.getFullYear(), item.startTime.getMonth(), item.startTime.getDate()),
        items: []
      };
    }

    groups[dateStr].items.push(item);
  });

  // 转换为数组并按日期排序
  return Object.values(groups).sort((a, b) => a.date.getTime() - b.date.getTime());
});

// 获取指定日期的天气信息
const getWeatherForDate = (date: Date): WeatherInfo | null => {
  const dateStr = date.toISOString().split('T')[0];
  return weatherData.value.find(w => w.date.toISOString().split('T')[0] === dateStr) || null;
};

// 获取空状态消息
const getEmptyStateMessage = () => {
  switch (activeFilter.value) {
    case 'week':
      return '本周暂无拍摄预告';
    case 'month':
      return '本月暂无拍摄预告';
    default:
      return '暂无拍摄预告';
  }
};

// 显示预告详情
const showPreviewDetails = (preview: PreviewItem) => {
  selectedPreview.value = preview;
  document.body.style.overflow = 'hidden'; // 防止背景滚动
};

// 关闭预告详情
const closePreviewDetails = () => {
  selectedPreview.value = null;
  document.body.style.overflow = ''; // 恢复滚动
};

// 返回上一页
const goBack = () => {
  window.history.back();
};

// 跳转到摄影师主页
const goToPhotographerPage = (photographerId: number) => {
  console.log(`跳转到摄影师主页，ID: ${photographerId}`);
  // 实际开发时此处添加路由跳转逻辑
};

// 跳转到原文
const viewOriginalPost = (previewId: number) => {
  console.log(`查看拍摄预告原文，ID: ${previewId}`);
  // 实际开发时此处添加路由跳转逻辑
};

// 模拟获取天气数据
const fetchWeatherData = () => {
  const today = new Date();
  const weatherConditions = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'thunderstorm'];
  const weatherIcons = ['sun', 'cloud-sun', 'cloud', 'cloud-rain', 'cloud-lightning'];

  // 为未来7天生成模拟天气数据
  const weatherForecasts: WeatherInfo[] = [];

  for (let i = 0; i < 15; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);

    const conditionIndex = Math.floor(Math.random() * weatherConditions.length);
    const lowTemp = Math.floor(Math.random() * 10) + 15; // 15-25°C
    const highTemp = lowTemp + Math.floor(Math.random() * 10); // 低温+0-10°C

    weatherForecasts.push({
      date: forecastDate,
      condition: weatherConditions[conditionIndex],
      temperature: {
        low: lowTemp,
        high: highTemp
      },
      icon: weatherIcons[conditionIndex]
    });
  }

  weatherData.value = weatherForecasts;
};

onMounted(() => {
  // 获取天气数据
  fetchWeatherData();

  // 模拟加载数据
  setTimeout(() => {
    // 生成模拟数据 - 未来7天的拍摄计划
    const today = new Date();
    const previewData: PreviewItem[] = [];

    // 添加一些模拟数据 - 添加来源和社交媒体信息
    // 第一天 - 多个摄影师在同一地点
    previewData.push({
      id: 1,
      locationName: '妙峰山风景路',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 7, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
      photographerId: 1,
      photographerName: '张舜元',
      description: '妙峰山风景区沿途光线充足，适合拍摄骑行者攀爬山路的英姿。装备推荐：轻便骑行服，明亮色系便于突出照片效果。',
      isFeatured: true,
      source: 'platform',
      sourceLabel: '瞬影发布',
      articleId: 101,
      socialMediaLinks: [
        { platform: 'weibo', url: 'https://weibo.com/u/zhangshunyuan', username: '张舜元_影像日记' },
        { platform: 'xiaohongshu', url: 'https://xiaohongshu.com/user/zhangshunyuan', username: '张舜元摄影' }
      ]
    });

    // 同一地点，时间重叠
    previewData.push({
      id: 2,
      locationName: '妙峰山风景路',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 13, 0),
      photographerId: 3,
      photographerName: '王睿杰',
      description: '妙峰山中段有绝佳拍摄点，可捕捉骑行者在山路S弯攀爬的瞬间。适合高难度技术动作的拍摄。',
      source: 'xiaohongshu',
      sourceLabel: '小红书发布',
      originalPostUrl: 'https://xiaohongshu.com/post/123456',
      socialMediaLinks: [
        { platform: 'xiaohongshu', url: 'https://xiaohongshu.com/user/wangruijie', username: '王睿杰' },
        { platform: 'instagram', url: 'https://instagram.com/ruijiewang', username: '@ruijiewang' }
      ]
    });

    // 同一地点，下午场次
    previewData.push({
      id: 3,
      locationName: '妙峰山风景路',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 17, 30),
      photographerId: 2,
      photographerName: '李明阳',
      description: '下午光线偏斜，特别适合拍摄剪影效果。拍摄侧重：下坡技术动作、速降姿态。',
      source: 'friendlybusinessman',
      sourceLabel: '友商平台',
      socialMediaLinks: [
        { platform: 'weibo', url: 'https://weibo.com/u/liminyang', username: '李明阳摄影' }
      ]
    });

    // 第一天，不同地点
    previewData.push({
      id: 4,
      locationName: '百花山环道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 7, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
      photographerId: 4,
      photographerName: '陈思远',
      description: '百花山环道景色优美，能拍摄到绝美的山景背景和骑行者构图。路段平缓，适合拍摄轻松愉快的骑行氛围。',
      source: 'platform',
      sourceLabel: '瞬影发布',
      articleId: 102,
      socialMediaLinks: [
        { platform: 'xiaohongshu', url: 'https://xiaohongshu.com/user/chensiyuan', username: '陈思远FOTO' },
        { platform: 'weibo', url: 'https://weibo.com/u/chensiyuan', username: '陈思远影像' }
      ]
    });

    // 第二天
    previewData.push({
      id: 5,
      locationName: '戒台寺骑行道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 12, 0),
      photographerId: 2,
      photographerName: '李明阳',
      description: '戒台寺入口处拍摄，光线较好，建议骑行者上午前往。背景有古建筑元素，可拍摄传统与现代结合的画面。',
      isFeatured: true,
      source: 'platform',
      sourceLabel: '瞬影发布',
      articleId: 103,
      socialMediaLinks: [
        { platform: 'weibo', url: 'https://weibo.com/u/liminyang', username: '李明阳摄影' },
        { platform: 'instagram', url: 'https://instagram.com/leeming', username: '@leeming' }
      ]
    });

    // 第二天，同地点不同摄影师
    previewData.push({
      id: 6,
      locationName: '戒台寺骑行道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
      photographerId: 1,
      photographerName: '张舜元',
      description: '戒台寺地区光线变化丰富，可拍摄明暗对比强烈的骑行照片。主要拍摄地点：寺院东侧山路。',
      source: 'other',
      sourceLabel: '自主发布',
      socialMediaLinks: [
        { platform: 'weibo', url: 'https://weibo.com/u/zhangshunyuan', username: '张舜元_影像日记' }
      ]
    });

    // 第四天
    previewData.push({
      id: 7,
      locationName: '潭王路弯道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 15, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 18, 0),
      photographerId: 1,
      photographerName: '张舜元',
      description: '傍晚拍摄，光线温暖，适合拍摄环境人文和骑行团队合作的照片。备注：路段拐弯较多，可拍摄骑行者过弯技术动作。',
      source: 'xiaohongshu',
      sourceLabel: '小红书发布',
      originalPostUrl: 'https://xiaohongshu.com/post/654321',
      socialMediaLinks: [
        { platform: 'xiaohongshu', url: 'https://xiaohongshu.com/user/zhangshunyuan', username: '张舜元摄影' }
      ]
    });

    // 远期预告
    previewData.push({
      id: 8,
      locationName: '云蒙山骑行路线',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 8, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 13, 0),
      photographerId: 4,
      photographerName: '陈思远',
      description: '秋季云蒙山特别拍摄活动，适合拍摄秋日红叶中的骑行场景。限定人数：60人，需提前预约。',
      isFeatured: true,
      source: 'platform',
      sourceLabel: '瞬影发布',
      articleId: 104,
      socialMediaLinks: [
        { platform: 'xiaohongshu', url: 'https://xiaohongshu.com/user/chensiyuan', username: '陈思远FOTO' }
      ]
    });

    // 本月底
    previewData.push({
      id: 9,
      locationName: '怀柔水库环线',
      startTime: new Date(today.getFullYear(), today.getMonth() + 1, 0, 9, 0),
      endTime: new Date(today.getFullYear(), today.getMonth() + 1, 0, 16, 0),
      photographerId: 3,
      photographerName: '王睿杰',
      description: '月末特别活动：环湖骑行全程拍摄。全天候跟拍，可获得系列连贯照片，展现完整骑行故事。需提前报名。',
      isFeatured: true,
      source: 'platform',
      sourceLabel: '瞬影发布',
      articleId: 105,
      socialMediaLinks: [
        { platform: 'xiaohongshu', url: 'https://xiaohongshu.com/user/wangruijie', username: '王睿杰' },
        { platform: 'instagram', url: 'https://instagram.com/ruijiewang', username: '@ruijiewang' }
      ]
    });

    // 按日期排序
    previewData.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    previewList.value = previewData;
    loading.value = false;
  }, 1500);
});
</script>
