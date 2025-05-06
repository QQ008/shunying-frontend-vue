<!-- 拍摄预告详情弹窗组件 -->
<template>
  <div class="preview-modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-close" @click="$emit('close')">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="modal-header">
        <!-- 添加拍摄来源标签 -->
        <div class="modal-status-row">
          <div class="modal-status featured" v-if="preview.isFeatured">推荐拍摄</div>
          <div class="modal-status source" v-if="preview.sourceLabel" :class="sourceClass">
            {{ preview.sourceLabel }}
          </div>
        </div>

        <div class="modal-location">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2>{{ preview.locationName }}</h2>
        </div>
        <div class="modal-time">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ formatModalDate(preview.startTime) }}</span>
          <span class="time-divider">|</span>
          <span>{{ formatTimeRange(preview.startTime, preview.endTime) }}</span>
        </div>

        <!-- 添加天气信息 -->
        <div class="modal-weather" v-if="weatherInfo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-icon">
            <path v-if="weatherInfo.icon === 'sun'" d="M12 3V4M12 20V21M3 12H4M20 12H21M5.64 5.64L6.34 6.34M18.36 18.36L17.66 17.66M5.64 18.36L6.34 17.66M18.36 5.64L17.66 6.34M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            <path v-else-if="weatherInfo.icon === 'cloud'" d="M5.5 16C3.567 16 2 14.433 2 12.5C2 10.567 3.567 9 5.5 9C5.74 9 5.97 9.03 6.19 9.08C6.47 9.14 6.75 9.01 6.88 8.74C7.68 7.16 9.3 6 11.16 6C13.42 6 15.31 7.74 15.4 9.95C15.41 10.09 15.52 10.22 15.67 10.25C17.03 10.48 18 11.64 18 13C18 14.43 16.43 16 14.5 16H5.5Z" stroke="currentColor" stroke-width="1.5"/>
            <path v-else-if="weatherInfo.icon === 'cloud-rain'" d="M8 13V18M12 13V18M16 13V18M5.5 13C3.57 13 2 11.43 2 9.5C2 7.57 3.57 6 5.5 6C5.74 6 5.97 6.03 6.19 6.08C6.47 6.14 6.75 6.01 6.88 5.74C7.68 4.16 9.3 3 11.16 3C13.42 3 15.31 4.74 15.4 6.95C15.41 7.09 15.52 7.22 15.67 7.25C17.03 7.48 18 8.64 18 10C18 11.43 16.43 13 14.5 13H5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path v-else-if="weatherInfo.icon === 'cloud-lightning'" d="M10 13L8 18H11L9 22M5.5 13C3.57 13 2 11.43 2 9.5C2 7.57 3.57 6 5.5 6C5.74 6 5.97 6.03 6.19 6.08C6.47 6.14 6.75 6.01 6.88 5.74C7.68 4.16 9.3 3 11.16 3C13.42 3 15.31 4.74 15.4 6.95C15.41 7.09 15.52 7.22 15.67 7.25C17.03 7.48 18 8.64 18 10C18 11.43 16.43 13 14.5 13H5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path v-else-if="weatherInfo.icon === 'cloud-sun'" d="M10 3V4M3 10H4M5.64 5.64L6.34 6.34M10 7C10 8.66 11.34 10 13 10C14.66 10 16 8.66 16 7C16 5.34 14.66 4 13 4C11.34 4 10 5.34 10 7ZM10 16.5C10 19 12.01 21 14.5 21H16.5C19 21 21 19 21 16.5C21 14.01 19 12 16.5 12H15.5M12 12C12 9.24 9.76 7 7 7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ weatherInfo.temperature.low }}°-{{ weatherInfo.temperature.high }}°C {{ getWeatherConditionText(weatherInfo.condition) }}</span>
        </div>
      </div>

      <div class="modal-photographer">
        <div class="photographer-avatar" :style="getRandomGradient(preview.photographerId)">
          {{ getInitials(preview.photographerName) }}
        </div>
        <div class="photographer-info">
          <div class="photographer-name">{{ preview.photographerName }}</div>
          <div class="photographer-title">专业摄影师</div>
        </div>
        <div class="view-profile" @click="$emit('go-to-photographer', preview.photographerId)">
          <span>查看主页</span>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- 社交媒体链接 -->
      <div class="social-media-links" v-if="preview.socialMediaLinks && preview.socialMediaLinks.length > 0">
        <h3>摄影师社交媒体</h3>
        <div class="social-links">
          <a
            v-for="(socialLink, index) in preview.socialMediaLinks"
            :key="index"
            :href="socialLink.url"
            target="_blank"
            class="social-link"
            :class="socialLink.platform"
          >
            <div class="social-icon">
              <svg v-if="socialLink.platform === 'xiaohongshu'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.77 5.03C18.76 5 18.75 4.96 18.72 4.94C18.69 4.91 18.66 4.89 18.62 4.88C17.68 4.62 14.57 5.11 12.57 6.3C11.19 7.12 9.65 8.4 8.76 9.15C7.97 9.82 7.18 10.5 6.4 11.2C5.74 11.79 5.13 12.43 4.58 13.12C4.06 13.79 3.66 14.58 3.4 15.43C3.1 16.45 2.97 17.52 3 18.59C3.03 19.55 3.57 20.08 4.13 20.26C4.94 20.53 5.8 20.22 6.74 19.55C7.92 18.7 8.97 17.67 9.86 16.51C10.4 15.84 10.94 15.17 11.3 14.4C11.39 14.24 11.44 14.06 11.44 13.88C11.44 13.71 11.39 13.53 11.3 13.38C11.21 13.22 11.07 13.1 10.91 13.02C10.75 12.95 10.57 12.92 10.39 12.94C10.21 12.97 10.04 13.05 9.91 13.17C9.89 13.18 9.88 13.2 9.87 13.22C9.87 13.24 9.87 13.26 9.87 13.28C9.88 13.29 9.89 13.31 9.91 13.32C9.92 13.33 9.94 13.34 9.96 13.34C10.09 13.36 10.21 13.44 10.28 13.54C10.39 13.73 10.4 13.9 10.29 14.08C9.83 14.8 9 15.75 8.52 16.25C7.5 17.34 6.35 18.31 5.09 19.13C4.6 19.45 4.13 19.7 3.69 19.65C3.5 19.62 3.33 19.52 3.21 19.38C3.08 19.23 3.01 19.04 3 18.85C2.98 18.52 2.98 18.19 3 17.86C3.05 16.88 3.3 15.92 3.74 15.04C4.43 13.66 5.6 12.59 6.9 11.33L6.98 11.25C7.76 10.47 8.53 9.67 9.29 8.85C10.38 7.68 13.52 5.48 16 5.49C16.9101 5.47 17.81 5.64 18.63 6C18.68 6.01 18.72 6.01 18.75 5.99C18.78 5.97 18.81 5.94 18.82 5.9C18.84 5.87 18.84 5.83 18.83 5.79C18.82 5.75 18.8 5.72 18.77 5.69" fill="currentColor"/>
                <path d="M19.4899 11.67C19.4299 11.56 19.3499 11.46 19.2499 11.39C19.1499 11.31 19.0399 11.25 18.9199 11.21C18.7999 11.18 18.6799 11.17 18.5599 11.18C18.4399 11.19 18.3199 11.22 18.2099 11.28C18.1899 11.29 18.1699 11.3 18.1599 11.32C18.1499 11.34 18.1399 11.36 18.1399 11.38C18.1399 11.4 18.1399 11.42 18.1499 11.44C18.1599 11.46 18.1699 11.47 18.1899 11.48C18.3399 11.54 18.4999 11.6 18.6299 11.7C18.7499 11.81 18.7799 11.94 18.7099 12.09C18.4399 12.71 17.9599 13.2 17.4499 13.64C16.7199 14.25 15.9399 14.8 15.1099 15.29C14.4799 15.67 13.8899 15.64 13.3299 15.48C12.7799 15.33 12.2699 15.04 11.8399 14.64C11.3999 14.23 11.0299 13.74 10.7399 13.2C10.4399 12.64 10.2199 12.04 10.0899 11.42C10.0199 11.08 9.9999 10.73 10.0099 10.37C10.0199 9.96 10.1999 9.66 10.4799 9.41C11.5699 8.45 12.7599 7.62 14.0299 6.92C14.7699 6.52 15.5499 6.19 16.3599 5.93C16.7699 5.8 17.1899 5.72 17.6199 5.7C17.8299 5.69 18.0299 5.76 18.1899 5.88C18.3499 6.01 18.4599 6.19 18.4999 6.39C18.5899 6.8 18.6299 7.22 18.6299 7.64C18.6399 7.97 18.6299 8.29 18.5999 8.62C18.5799 8.8 18.5599 8.98 18.5199 9.15C18.4899 9.29 18.4999 9.34 18.6399 9.38C19.0299 9.51 19.3699 9.75 19.6199 10.07C19.8599 10.38 19.9999 10.76 19.9999 11.15C20.0099 11.33 19.9799 11.51 19.9099 11.67" fill="currentColor"/>
              </svg>
              <svg v-else-if="socialLink.platform === 'weibo'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.10998 19.993C13.568 19.993 16.998 17.466 16.998 14.25C16.998 11.033 13.568 8.50702 9.10998 8.50702C4.65198 8.50702 1.22198 11.033 1.22198 14.25C1.22198 17.466 4.65198 19.993 9.10998 19.993Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                <path d="M10.789 15.427C10.789 16.509 9.89004 17.387 8.78104 17.387C7.67204 17.387 6.77304 16.509 6.77304 15.427C6.77304 14.345 7.67204 13.467 8.78104 13.467C9.89004 13.467 10.789 14.345 10.789 15.427Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                <path d="M9.08304 15.427C9.08304 15.802 8.77204 16.106 8.38704 16.106C8.00204 16.106 7.69104 15.802 7.69104 15.427C7.69104 15.052 8.00204 14.748 8.38704 14.748C8.77204 14.748 9.08304 15.052 9.08304 15.427Z" fill="currentColor"/>
                <path d="M10.042 14.062C9.95404 14.15 9.93504 14.278 10.002 14.347C10.069 14.416 10.2 14.398 10.288 14.31C10.376 14.222 10.395 14.094 10.328 14.025C10.261 13.956 10.13 13.974 10.042 14.062Z" fill="currentColor"/>
                <path d="M20.068 7.25008C19.368 6.55908 18.304 6.55908 17.604 7.25008C16.904 7.94108 16.904 8.99108 17.604 9.68208C18.304 10.3731 19.368 10.3731 20.068 9.68208C20.768 8.99108 20.768 7.94108 20.068 7.25008Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                <path d="M16.998 10.872C16.998 10.872 15.45 10.045 15.257 8.28204C15.257 8.28204 14.257 10.611 11.778 11.124C9.29903 11.637 7.62403 11.056 7.62403 11.056C7.62403 11.056 8.04703 12.168 7.48303 12.9C6.91903 13.631 6.09703 13.489 6.09703 13.489C6.09703 13.489 6.51903 15.628 9.42503 15.823C12.331 16.019 13.33 14.321 13.33 14.321C13.33 14.321 12.611 15.515 13.478 16.326C14.345 17.137 15.501 16.87 15.501 16.87C15.501 16.87 14.906 18.298 12.183 18.298C9.46003 18.298 7.33803 16.682 7.33803 16.682C7.33803 16.682 10.21 19.511 14.651 18.512C19.092 17.513 19.222 13.535 19.222 13.535C19.222 13.535 20.828 12.837 20.828 11.124C20.828 9.41103 19.28 9.55803 19.28 9.55803C19.28 9.55803 19.964 8.32804 18.58 7.17704C17.196 6.02604 15.647 7.49404 15.647 7.49404C15.647 7.49404 15.966 5.67804 14.393 4.92704C12.82 4.17604 11.526 5.71704 11.526 5.71704C11.526 5.71704 12.38 4.47104 12.151 3.72004C11.922 2.96904 10.593 3.38404 10.593 3.38404C10.593 3.38404 10.784 6.77004 8.43703 8.11404" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
              </svg>
              <svg v-else-if="socialLink.platform === 'instagram'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="18" cy="6" r="1" fill="currentColor"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 7H17V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="social-name">
              {{ socialLink.username }}
            </div>
          </a>
        </div>
      </div>

      <div class="modal-description" v-if="preview.description">
        <h3>拍摄备注</h3>
        <p>{{ preview.description }}</p>
      </div>

      <div class="modal-actions">
        <!-- 如果有文章ID，显示查看文章按钮，否则显示查看原文按钮 -->
        <button
          v-if="preview.articleId"
          class="action-button secondary"
          @click="viewArticle(preview.articleId)"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8.5L12 15.5L5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          查看文章
        </button>
        <button
          v-else-if="preview.originalPostUrl"
          class="action-button secondary"
          @click="$emit('view-original', preview.id)"
        >
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
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

interface SocialMedia {
  platform: string; // instagram, weibo, xiaohongshu, etc.
  url: string;
  username: string;
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

defineEmits<{
  (e: 'close'): void;
  (e: 'go-to-photographer', photographerId: number): void;
  (e: 'view-original', previewId: number): void;
}>();

const props = defineProps<{
  preview: PreviewItem;
}>();

// 根据来源类型设置样式类
const sourceClass = computed(() => {
  if (!props.preview.source) return '';
  return `source-${props.preview.source}`;
});

// 天气数据示例 - 实际应用中会从父组件传入或通过API获取
const weatherInfo = computed<WeatherInfo | null>(() => {
  // 模拟天气数据
  const today = new Date();
  if (props.preview.startTime.getDate() === today.getDate() &&
      props.preview.startTime.getMonth() === today.getMonth() &&
      props.preview.startTime.getFullYear() === today.getFullYear()) {
    return {
      date: today,
      condition: 'sunny',
      temperature: {
        low: 18,
        high: 25
      },
      icon: 'sun'
    };
  }
  return null;
});

// 获取摄影师姓名首字母
const getInitials = (name: string): string => {
  return name.charAt(0);
};

// 生成摄影师头像渐变色
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
const formatTimeRange = (start: Date, end: Date) => {
  const startHour = start.getHours().toString().padStart(2, '0');
  const startMin = start.getMinutes().toString().padStart(2, '0');
  const endHour = end.getHours().toString().padStart(2, '0');
  const endMin = end.getMinutes().toString().padStart(2, '0');

  return `${startHour}:${startMin} - ${endHour}:${endMin}`;
};

const formatModalDate = (date: Date) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
};

// 查看预告文章
const viewArticle = (articleId: number) => {
  console.log(`查看预告文章，ID: ${articleId}`);
  // 实际开发时可以跳转到文章页面
};

// 天气状态文本
const getWeatherConditionText = (condition: string): string => {
  const conditions: Record<string, string> = {
    'sunny': '晴天',
    'partly-cloudy': '多云',
    'cloudy': '阴天',
    'rainy': '雨天',
    'thunderstorm': '雷雨'
  };
  return conditions[condition] || condition;
};
</script>
