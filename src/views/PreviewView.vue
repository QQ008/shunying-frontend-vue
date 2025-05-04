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
          <div
            v-for="(dateGroup, dateIndex) in filteredPreviewDays"
            :key="dateIndex"
            class="timeline-day"
          >
            <div class="timeline-date">
              <div class="date-indicator">
                <span class="date-day">{{ formatDay(dateGroup.date) }}</span>
                <div class="date-details">
                  <span class="date-month">{{ formatMonth(dateGroup.date) }}</span>
                  <span class="date-weekday">{{ formatWeekday(dateGroup.date) }}</span>
                </div>
              </div>
            </div>

            <!-- 当日拍摄地点分组 -->
            <div class="timeline-events">
              <div
                v-for="(locationGroup, locIndex) in groupByLocation(dateGroup.items)"
                :key="locIndex"
                class="location-group"
              >
                <div class="location-header">
                  <div class="location-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h3 class="location-title">{{ locationGroup.location }}</h3>
                </div>

                <!-- 同一地点的摄影师拍摄安排 -->
                <div class="photographer-schedule">
                  <!-- 时间轴 -->
                  <div class="time-axis">
                    <div class="time-markers">
                      <div class="time-marker" v-for="hour in 24" :key="hour" :style="{ left: `${(hour-1) * 4.17}%` }">
                        <div class="hour-label" v-if="hour % 3 === 0">{{ hour.toString().padStart(2, '0') }}:00</div>
                      </div>
                    </div>
                    <div class="time-slots">
                      <div
                        v-for="(item, itemIndex) in locationGroup.items"
                        :key="itemIndex"
                        class="time-slot"
                        :class="{'featured-slot': item.isFeatured}"
                        :style="getTimeSlotStyle(item)"
                        @click="showPreviewDetails(item)"
                      >
                        <div class="time-slot-content">
                          <div class="photographer-avatar" :style="getRandomGradient(item.photographerId)">
                            {{ getInitials(item.photographerName) }}
                          </div>
                          <div class="slot-info">
                            <div class="slot-photographer">{{ item.photographerName }}</div>
                            <div class="slot-time">{{ formatTimeRange(item.startTime, item.endTime) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预告详情弹窗 -->
    <div class="preview-modal" v-if="selectedPreview" @click="closePreviewDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-close" @click="closePreviewDetails">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="modal-header">
          <div class="modal-status" v-if="selectedPreview.isFeatured">推荐拍摄</div>
          <div class="modal-location">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2>{{ selectedPreview.locationName }}</h2>
          </div>
          <div class="modal-time">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ formatModalDate(selectedPreview.startTime) }}</span>
            <span class="time-divider">|</span>
            <span>{{ formatTimeRange(selectedPreview.startTime, selectedPreview.endTime) }}</span>
          </div>
        </div>

        <div class="modal-photographer" @click="goToPhotographerPage(selectedPreview.photographerId)">
          <div class="photographer-avatar" :style="getRandomGradient(selectedPreview.photographerId)">
            {{ getInitials(selectedPreview.photographerName) }}
          </div>
          <div class="photographer-info">
            <div class="photographer-name">{{ selectedPreview.photographerName }}</div>
            <div class="photographer-title">专业摄影师</div>
          </div>
          <div class="view-profile">
            <span>查看主页</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="modal-description" v-if="selectedPreview.description">
          <h3>拍摄备注</h3>
          <p>{{ selectedPreview.description }}</p>
        </div>

        <div class="modal-actions">
          <button class="action-button secondary" @click="viewOriginalPost(selectedPreview.id)">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 7H17V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            查看原文
          </button>
          <button class="action-button primary">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            加入日历
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import '@/assets/styles/PreviewView.css';


interface PreviewItem {
  id: number;
  locationName: string;
  startTime: Date;
  endTime: Date;
  photographerId: number;
  photographerName: string;
  description?: string;
  isFeatured?: boolean;
}

interface DateGroup {
  date: Date;
  items: PreviewItem[];
}

interface LocationGroup {
  location: string;
  items: PreviewItem[];
}

// 状态变量
const loading = ref(true);
const previewList = ref<PreviewItem[]>([]);
const selectedPreview = ref<PreviewItem | null>(null);
const activeFilter = ref('all');

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

// 按地点分组
const groupByLocation = (items: PreviewItem[]): LocationGroup[] => {
  const groups: Record<string, LocationGroup> = {};

  items.forEach(item => {
    if (!groups[item.locationName]) {
      groups[item.locationName] = {
        location: item.locationName,
        items: []
      };
    }

    groups[item.locationName].items.push(item);
  });

  // 转换为数组并按时间排序
  return Object.values(groups).map(group => {
    group.items.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    return group;
  });
};

// 获取时间槽样式
const getTimeSlotStyle = (item: PreviewItem) => {
  // 计算开始时间在一天内的百分比位置
  const startHour = item.startTime.getHours();
  const startMinute = item.startTime.getMinutes();
  const startPercent = (startHour + startMinute / 60) * 4.17; // 4.17% = 100% / 24小时

  // 计算持续时间的宽度百分比
  const durationHours = (item.endTime.getTime() - item.startTime.getTime()) / (1000 * 60 * 60);
  const widthPercent = durationHours * 4.17;

  return {
    left: `${startPercent}%`,
    width: `${widthPercent}%`
  };
};

// 获取摄影师姓名首字母
const getInitials = (name: string): string => {
  return name.charAt(0);
};

// 随机头像背景 - 根据摄影师ID生成固定的渐变色
const getRandomGradient = (photographerId: number) => {
  const gradients = [
    'linear-gradient(45deg, #9966ff, #7333ff)',
    'linear-gradient(45deg, #8c52ff, #b04eff)',
    'linear-gradient(45deg, #6539ff, #9e2fff)',
    'linear-gradient(45deg, #b252ff, #7913ff)',
    'linear-gradient(45deg, #9966ff, #612aff)'
  ];

  // 使用摄影师ID来选择固定的渐变色
  const index = photographerId % gradients.length;
  return { background: gradients[index] };
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

// 跳转到摄影师主页（仅预留功能）
const goToPhotographerPage = (photographerId: number) => {
  console.log(`跳转到摄影师主页，ID: ${photographerId}`);
  // 实际开发时此处添加路由跳转逻辑
};

// 跳转到原文（仅预留功能）
const viewOriginalPost = (previewId: number) => {
  console.log(`查看拍摄预告原文，ID: ${previewId}`);
  // 实际开发时此处添加路由跳转逻辑
};

// 日期格式化函数
const formatMonth = (date: Date) => {
  return date.getMonth() + 1 + '月';
};

const formatDay = (date: Date) => {
  return date.getDate();
};

const formatWeekday = (date: Date) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
};

const formatTimeRange = (start: Date, end: Date) => {
  const startHour = start.getHours().toString().padStart(2, '0');
  const startMin = start.getMinutes().toString().padStart(2, '0');
  const endHour = end.getHours().toString().padStart(2, '0');
  const endMin = end.getMinutes().toString().padStart(2, '0');

  return `${startHour}:${startMin} - ${endHour}:${endMin}`;
};

const formatModalDate = (date: Date) => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${formatWeekday(date)}`;
};

onMounted(() => {
  // 模拟加载数据
  setTimeout(() => {
    // 生成模拟数据 - 未来7天的拍摄计划
    const today = new Date();
    const previewData: PreviewItem[] = [];

    // 添加一些模拟数据
    // 第一天 - 多个摄影师在同一地点
    previewData.push({
      id: 1,
      locationName: '妙峰山风景路',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 7, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
      photographerId: 1,
      photographerName: '张舜元',
      description: '妙峰山风景区沿途光线充足，适合拍摄骑行者攀爬山路的英姿。装备推荐：轻便骑行服，明亮色系便于突出照片效果。',
      isFeatured: true
    });

    // 同一地点，时间重叠
    previewData.push({
      id: 2,
      locationName: '妙峰山风景路',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 13, 0),
      photographerId: 3,
      photographerName: '王睿杰',
      description: '妙峰山中段有绝佳拍摄点，可捕捉骑行者在山路S弯攀爬的瞬间。适合高难度技术动作的拍摄。'
    });

    // 同一地点，下午场次
    previewData.push({
      id: 3,
      locationName: '妙峰山风景路',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 17, 30),
      photographerId: 2,
      photographerName: '李明阳',
      description: '下午光线偏斜，特别适合拍摄剪影效果。拍摄侧重：下坡技术动作、速降姿态。'
    });

    // 第一天，不同地点
    previewData.push({
      id: 4,
      locationName: '百花山环道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 7, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
      photographerId: 4,
      photographerName: '陈思远',
      description: '百花山环道景色优美，能拍摄到绝美的山景背景和骑行者构图。路段平缓，适合拍摄轻松愉快的骑行氛围。'
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
      isFeatured: true
    });

    // 第二天，同地点不同摄影师
    previewData.push({
      id: 6,
      locationName: '戒台寺骑行道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
      photographerId: 1,
      photographerName: '张舜元',
      description: '戒台寺地区光线变化丰富，可拍摄明暗对比强烈的骑行照片。主要拍摄地点：寺院东侧山路。'
    });

    // 第四天
    previewData.push({
      id: 7,
      locationName: '潭王路弯道',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 15, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 18, 0),
      photographerId: 1,
      photographerName: '张舜元',
      description: '傍晚拍摄，光线温暖，适合拍摄环境人文和骑行团队合作的照片。备注：路段拐弯较多，可拍摄骑行者过弯技术动作。'
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
      isFeatured: true
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
      isFeatured: true
    });

    // 按日期排序
    previewData.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    previewList.value = previewData;
    loading.value = false;
  }, 1500);
});
</script>
