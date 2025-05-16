<!-- 拍摄预告日期卡片组件 -->
<template>
  <div class="timeline-day">
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

          <!-- 添加天气信息到地点标题右侧 -->
          <div class="location-weather" v-if="weather">
            <div class="weather-icon" :class="weather.condition">
              <svg v-if="weather.icon === 'sun'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 3V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 20V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M3 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M20 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M5.63672 5.63672L6.3441 6.3441" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M17.6562 17.6562L18.3636 18.3636" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M5.63672 18.3633L6.3441 17.6559" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M17.6562 6.3438L18.3636 5.6364" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else-if="weather.icon === 'cloud-sun'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M3 10H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M5.63672 5.63672L6.3441 6.3441" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 16.5C10 18.9853 12.0147 21 14.5 21H16.5C18.9853 21 21 18.9853 21 16.5C21 14.0147 18.9853 12 16.5 12H15.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 12C12 9.23858 9.76142 7 7 7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H12.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 7C10 8.65685 11.3431 10 13 10C14.6569 10 16 8.65685 16 7C16 5.34315 14.6569 4 13 4C11.3431 4 10 5.34315 10 7Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <svg v-else-if="weather.icon === 'cloud'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 16C3.567 16 2 14.433 2 12.5C2 10.567 3.567 9 5.5 9C5.73623 9 5.96731 9.02717 6.19057 9.07937C6.47171 9.14224 6.75191 9.0114 6.88497 8.74172C7.68177 7.16472 9.29998 6 11.1626 6C13.4233 6 15.3118 7.7413 15.4039 9.94609C15.4104 10.0945 15.521 10.2209 15.6675 10.2458C17.0309 10.4753 18 11.6395 18 13C18 14.433 16.433 16 14.5 16H5.5Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <svg v-else-if="weather.icon === 'cloud-rain'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 13C3.567 13 2 11.433 2 9.5C2 7.567 3.567 6 5.5 6C5.73623 6 5.96731 6.02717 6.19057 6.07937C6.47171 6.14224 6.75191 6.0114 6.88497 5.74172C7.68177 4.16472 9.29998 3 11.1626 3C13.4233 3 15.3118 4.7413 15.4039 6.94609C15.4104 7.0945 15.521 7.2209 15.6675 7.2458C17.0309 7.4753 18 8.6395 18 10C18 11.433 16.433 13 14.5 13L5.5 13Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 13V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 13V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M16 13V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else-if="weather.icon === 'cloud-lightning'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 13C3.567 13 2 11.433 2 9.5C2 7.567 3.567 6 5.5 6C5.73623 6 5.96731 6.02717 6.19057 6.07937C6.47171 6.14224 6.75191 6.0114 6.88497 5.74172C7.68177 4.16472 9.29998 3 11.1626 3C13.4233 3 15.3118 4.7413 15.4039 6.94609C15.4104 7.0945 15.521 7.2209 15.6675 7.2458C17.0309 7.4753 18 8.6395 18 10C18 11.433 16.433 13 14.5 13L5.5 13Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M10 13L8 18H11L9 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="weather-temp">{{ weather.temperature.low }}°-{{ weather.temperature.high }}°</span>
          </div>
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
                v-for="(rowItems, rowIndex) in calculateTimeSlotRows(locationGroup.items)"
                :key="rowIndex"
                class="time-slot-row"
                :style="{ top: `${rowIndex * 35}px` }"
              >
                <div
                  v-for="(item, itemIndex) in rowItems"
                  :key="itemIndex"
                  class="time-slot"
                  :class="[
                    {'featured-slot': item.isFeatured},
                    `source-${item.source || 'default'}`
                  ]"
                  :style="getTimeSlotStyle(item)"
                  @click="$emit('show-details', item)"
                >
                  <div class="source-tag" v-if="item.sourceLabel">{{ item.sourceLabel }}</div>
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
</template>

<script setup lang="ts">
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

interface LocationGroup {
  location: string;
  items: PreviewItem[];
}

interface WeatherInfo {
  date: Date;
  condition: string; // sunny, cloudy, rainy, etc.
  temperature: {
    low: number;
    high: number;
  }
  icon: string;
}

defineEmits<{
  (e: 'show-details', item: PreviewItem): void
}>();

defineProps<{
  dateGroup: DateGroup;
  weather: WeatherInfo | null;
}>();

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

// 计算时间槽行，处理重叠问题
const calculateTimeSlotRows = (items: PreviewItem[]): PreviewItem[][] => {
  if (!items || items.length === 0) return [];

  // 按开始时间排序
  const sortedItems = [...items].sort((a, b) =>
    a.startTime.getTime() - b.startTime.getTime()
  );

  const rows: PreviewItem[][] = [];

  // 遍历所有项目
  sortedItems.forEach(item => {
    // 尝试找到可以放置当前项目的行
    let placed = false;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const lastItemInRow = row[row.length - 1];

      // 检查是否可以放在这一行（没有时间重叠）
      if (item.startTime.getTime() >= lastItemInRow.endTime.getTime()) {
        row.push(item);
        placed = true;
        break;
      }
    }

    // 如果没有找到合适的行，创建新行
    if (!placed) {
      rows.push([item]);
    }
  });

  return rows;
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
</script>
