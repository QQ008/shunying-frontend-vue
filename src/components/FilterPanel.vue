<!-- 筛选图片组件 -->
<template>
  <div class="filter-panel-container">
    <transition name="fade">
      <div class="filter-mask" v-if="modelValue" @click="handleClose"></div>
    </transition>

    <transition name="slide">
      <div class="filter-content" v-if="modelValue">
        <div class="filter-header">
          <div class="filter-title">筛选条件</div>
          <div class="filter-close" @click="handleClose">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="filter-scroll-area">
          <!-- 日期筛选 -->
          <div class="filter-section">
            <div class="section-title">日期</div>
            <div class="date-options">
              <div
                v-for="option in dateOptions"
                :key="option.value"
                class="date-option"
                :class="{ active: localFilters.dateOption === option.value }"
                @click="selectDateOption(option.value)"
              >
                {{ option.label }}
              </div>
              <div class="date-option custom" :class="{ active: localFilters.dateOption === 'custom', expanded: customDateExpanded }">
                <div class="custom-date-header" @click="toggleCustomDate">
                  <span>{{ getDateDisplay() }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: customDateExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }">
                    <path d="M6 9L12 15L18 9" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <transition name="fold">
                  <div class="custom-date-inputs" v-if="customDateExpanded">
                    <input type="date" v-model="localFilters.startDate" placeholder="开始日期" />
                    <span class="date-separator">至</span>
                    <input type="date" v-model="localFilters.endDate" placeholder="结束日期" />
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- 地点筛选 -->
          <div class="filter-section">
            <div class="section-title">地点</div>
            <div class="location-options">
              <div
                v-for="location in filterOptions.locations"
                :key="location"
                class="location-option"
                :class="{ active: localFilters.location === location }"
                @click="selectLocation(location)"
              >
                {{ location }}
              </div>
            </div>
          </div>

          <!-- 车型筛选 -->
          <div class="filter-section">
            <div class="section-title">车型</div>
            <div class="bike-options">
              <div
                v-for="bikeType in bikeOptions"
                :key="bikeType.value"
                class="bike-option"
                :class="{ active: isTypeSelected(bikeType.value) }"
                @click="toggleBikeType(bikeType.value)"
              >
                <div class="checkbox">
                  <div class="checkbox-inner" v-if="isTypeSelected(bikeType.value)"></div>
                </div>
                <span>{{ bikeType.label }}</span>
              </div>
            </div>
          </div>

          <!-- 颜色筛选 -->
          <div class="color-filters" v-if="showColorFilters" :class="{ 'slide-in': showColorFilters }">
            <!-- 骑行服颜色 -->
            <div class="filter-section">
              <div class="section-title">骑行服颜色</div>
              <div class="color-options">
                <div
                  class="color-option all-option"
                  :class="{ selected: !localFilters.jerseyColor }"
                  @click="selectJerseyColor('')"
                >
                  <div class="all-colors-icon">全部</div>
                </div>
                <div
                  v-for="color in visibleJerseyColors"
                  :key="color.value"
                  class="color-option"
                  :class="{ selected: localFilters.jerseyColor === color.value }"
                  @click="selectJerseyColor(color.value)"
                  :title="color.label"
                >
                  <div class="color-dot" :style="{ backgroundColor: color.hex }"></div>
                </div>
                <div
                  v-if="!showAllJerseyColors && filterOptions.jerseyColors.length > visibleColorsCount"
                  class="color-option show-more"
                  @click="toggleJerseyColors"
                >
                  <div class="show-more-icon" :class="{ 'rotate-icon': showAllJerseyColors }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9L12 16L5 9" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>更多颜色</span>
                </div>
              </div>
            </div>

            <!-- 骑行裤颜色 -->
            <div class="filter-section">
              <div class="section-title">骑行裤颜色</div>
              <div class="color-options">
                <div
                  class="color-option all-option"
                  :class="{ selected: !localFilters.bibColor }"
                  @click="selectBibColor('')"
                >
                  <div class="all-colors-icon">全部</div>
                </div>
                <div
                  v-for="color in visibleBibColors"
                  :key="color.value"
                  class="color-option"
                  :class="{ selected: localFilters.bibColor === color.value }"
                  @click="selectBibColor(color.value)"
                  :title="color.label"
                >
                  <div class="color-dot" :style="{ backgroundColor: color.hex }"></div>
                </div>
                <div
                  v-if="!showAllBibColors && filterOptions.bibColors.length > visibleColorsCount"
                  class="color-option show-more"
                  @click="toggleBibColors"
                >
                  <div class="show-more-icon" :class="{ 'rotate-icon': showAllBibColors }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9L12 16L5 9" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>更多颜色</span>
                </div>
              </div>
            </div>

            <!-- 锁鞋颜色 -->
            <div class="filter-section">
              <div class="section-title">锁鞋颜色</div>
              <div class="color-options">
                <div
                  class="color-option all-option"
                  :class="{ selected: !localFilters.shoeColor }"
                  @click="selectShoeColor('')"
                >
                  <div class="all-colors-icon">全部</div>
                </div>
                <div
                  v-for="color in visibleShoeColors"
                  :key="color.value"
                  class="color-option"
                  :class="{ selected: localFilters.shoeColor === color.value }"
                  @click="selectShoeColor(color.value)"
                  :title="color.label"
                >
                  <div class="color-dot" :style="{ backgroundColor: color.hex }"></div>
                </div>
                <div
                  v-if="!showAllShoeColors && filterOptions.shoeColors.length > visibleColorsCount"
                  class="color-option show-more"
                  @click="toggleShoeColors"
                >
                  <div class="show-more-icon" :class="{ 'rotate-icon': showAllShoeColors }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9L12 16L5 9" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>更多颜色</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部占位空间 -->
          <div class="bottom-space"></div>
        </div>

        <!-- 操作按钮 - 固定在底部 -->
        <div class="filter-actions">
          <!-- 筛选结果统计 -->
          <div class="filter-stats">
            <div class="stats-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#9966FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stats-text">{{ getFilterResultsText }}</div>
          </div>

          <div class="action-buttons">
            <button class="reset-btn" @click="handleReset">重置</button>
            <button class="apply-btn" @click="handleApply">应用筛选</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, reactive } from 'vue'
import { useSearchStore, type Filters } from '@/stores/searchStore'
import { fetchFilterOptions, type FilterOptions } from '@/api/photoService'
import '@/assets/FilterPantel.css'

// 获取搜索状态管理器
const searchStore = useSearchStore()

interface BikeOption {
  label: string;
  value: string;
}

// 父组件传入的v-model值，控制筛选面板的显示/隐藏
interface Props {
  modelValue: boolean;
  filters: Filters;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  filters: () => ({
      startDate: '',
      endDate: '',
      dateOption: 'today',
      location: '戒台寺',
    bikeType: 'all',
      jerseyColor: '',
      bibColor: '',
    shoeColor: ''
    })
})

// 事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'apply', filters: Filters): void;
  (e: 'reset'): void;
}>();

// 本地筛选条件，避免直接修改props
const localFilters = reactive<Filters>({
  startDate: props.filters.startDate || '',
  endDate: props.filters.endDate || '',
  dateOption: props.filters.dateOption || 'today',
  location: props.filters.location || '戒台寺',
  bikeType: props.filters.bikeType === 'all'
    ? ['road', 'motor', 'other']
    : Array.isArray(props.filters.bikeType)
      ? [...props.filters.bikeType]
      : props.filters.bikeType
        ? [props.filters.bikeType]
        : ['road', 'motor', 'other'],
  jerseyColor: props.filters.jerseyColor || '',
  bibColor: props.filters.bibColor || '',
  shoeColor: props.filters.shoeColor || ''
});

// 默认筛选条件
const defaultFilters: Filters = {
  startDate: '',
  endDate: '',
  dateOption: 'today',
  location: '戒台寺',
  bikeType: 'all',
  jerseyColor: '',
  bibColor: '',
  shoeColor: ''
};

// 筛选选项数据
const filterOptions = reactive<FilterOptions>({
  locations: ['全部', '戒台寺', '潭王路', '妙峰山', '其他地点'],
  bikeTypes: ['road', 'motor', 'other'],
  jerseyColors: [],
  bibColors: [],
  shoeColors: []
});

// 加载筛选选项
const loadFilterOptions = async () => {
  try {
    const options = await fetchFilterOptions();
    filterOptions.locations = options.locations;
    filterOptions.bikeTypes = options.bikeTypes;
    filterOptions.jerseyColors = options.jerseyColors;
    filterOptions.bibColors = options.bibColors;
    filterOptions.shoeColors = options.shoeColors;
  } catch (error) {
    console.error('Failed to load filter options:', error);
  }
};

// 日期选项
const dateOptions = [
  { label: '今天', value: 'today' },
  { label: '昨天', value: 'yesterday' },
  { label: '周末', value: 'weekend' },
  { label: '本周', value: 'thisWeek' },
  { label: '本月', value: 'thisMonth' },
  { label: '自定义', value: 'custom' }
];

// 车型选项
const bikeOptions = computed<BikeOption[]>(() => [
  { label: '公路车', value: 'road' },
  { label: '摩托车', value: 'motor' },
  { label: '其他', value: 'other' }
]);

// 自定义日期是否展开
const customDateExpanded = ref(false);

// 控制颜色展示状态
const visibleColorsCount = 5;
const showAllJerseyColors = ref(false);
const showAllBibColors = ref(false);
const showAllShoeColors = ref(false);

// 计算可见的颜色选项
const visibleJerseyColors = computed(() => {
  if (showAllJerseyColors.value) {
    return filterOptions.jerseyColors;
  }
  return filterOptions.jerseyColors.slice(0, visibleColorsCount);
});

const visibleBibColors = computed(() => {
  if (showAllBibColors.value) {
    return filterOptions.bibColors;
  }
  return filterOptions.bibColors.slice(0, visibleColorsCount);
});

const visibleShoeColors = computed(() => {
  if (showAllShoeColors.value) {
    return filterOptions.shoeColors;
  }
  return filterOptions.shoeColors.slice(0, visibleColorsCount);
});

// 计算是否显示颜色筛选选项
const showColorFilters = computed(() => {
  if (Array.isArray(localFilters.bikeType)) {
    return localFilters.bikeType.includes('road');
  }
  return localFilters.bikeType === 'road' || localFilters.bikeType === 'all';
});

// 车型多选逻辑
const isTypeSelected = (type: string): boolean => {
  if (Array.isArray(localFilters.bikeType)) {
    return localFilters.bikeType.includes(type);
}
  return localFilters.bikeType === type || localFilters.bikeType === 'all';
};

const toggleBikeType = (type: string): void => {
  // 确保bikeType是数组
  if (!Array.isArray(localFilters.bikeType)) {
    localFilters.bikeType = localFilters.bikeType === 'all' ? ['road', 'motor', 'other'] : [localFilters.bikeType];
  }

  const index = localFilters.bikeType.indexOf(type);
  if (index === -1) {
    localFilters.bikeType.push(type);
  } else {
    localFilters.bikeType.splice(index, 1);
  }
};

// 切换自定义日期展开/收起
const toggleCustomDate = (): void => {
  customDateExpanded.value = !customDateExpanded.value;

  if (customDateExpanded.value) {
    // 如果展开，则选择自定义日期选项
    if (localFilters.dateOption !== 'custom') {
      // 保留已有的日期，切换到自定义模式
      selectDateOption('custom', false);
    }
  }
};

// 获取日期显示文本
const getDateDisplay = (): string => {
  if (localFilters.dateOption === 'custom') {
    if (localFilters.startDate && localFilters.endDate) {
      if (localFilters.startDate === localFilters.endDate) {
        return localFilters.startDate;
      } else {
        return `${localFilters.startDate} 至 ${localFilters.endDate}`;
      }
    } else if (localFilters.startDate) {
      return localFilters.startDate;
    } else if (localFilters.endDate) {
      return localFilters.endDate;
    } else {
      return '自定义日期';
    }
  } else {
    // 根据选项显示不同的日期文本
    const option = localFilters.dateOption;
    const dateOptionText = dateOptions.find(item => item.value === option)?.label || '自定义日期';

    if (localFilters.startDate || localFilters.endDate) {
      if (localFilters.startDate === localFilters.endDate) {
        // 同一天
        return `${dateOptionText}：${localFilters.startDate}`;
      } else if (localFilters.startDate && localFilters.endDate) {
        // 日期范围
        return `${dateOptionText}：${localFilters.startDate} 至 ${localFilters.endDate}`;
      } else if (localFilters.startDate) {
        // 只有开始日期
        return `${dateOptionText}：${localFilters.startDate}`;
      } else {
        // 只有结束日期
        return `${dateOptionText}：${localFilters.endDate}`;
      }
    } else {
      return dateOptionText;
    }
  }
};

// 选择日期选项
const selectDateOption = (option: string, closeCustom = true): void => {
  localFilters.dateOption = option as Filters['dateOption'];

  // 如果不是自定义日期，则收起自定义日期面板
  if (option !== 'custom' && closeCustom) {
    customDateExpanded.value = false;
  }

  // 根据选项设置日期范围
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  switch (option) {
    case 'today':
      // 今天
      localFilters.startDate = formatDate(startDate);
      localFilters.endDate = formatDate(endDate);
      break;
    case 'yesterday':
      // 昨天
      startDate.setDate(today.getDate() - 1);
      endDate.setDate(today.getDate() - 1);
      localFilters.startDate = formatDate(startDate);
      localFilters.endDate = formatDate(endDate);
      break;
    case 'weekend':
      // 上一个周末（最近的周六和周日）
      const dayOfWeek = today.getDay(); // 0是周日，6是周六
      if (dayOfWeek === 0) { // 今天是周日
        startDate.setDate(today.getDate() - 1); // 周六
        localFilters.startDate = formatDate(startDate);
        localFilters.endDate = formatDate(today);
      } else if (dayOfWeek === 6) { // 今天是周六
        endDate.setDate(today.getDate() + 1); // 周日
        localFilters.startDate = formatDate(today);
        localFilters.endDate = formatDate(endDate);
      } else { // 工作日
        // 找到上一个周末
        startDate.setDate(today.getDate() - dayOfWeek - 1); // 上周六
        endDate.setDate(today.getDate() - dayOfWeek); // 上周日
        localFilters.startDate = formatDate(startDate);
        localFilters.endDate = formatDate(endDate);
      }
      break;
    case 'thisWeek':
      // 本周（周一到今天）
      const currentDayOfWeek = today.getDay() || 7; // 将周日的0转换为7
      startDate.setDate(today.getDate() - (currentDayOfWeek - 1)); // 本周一
      localFilters.startDate = formatDate(startDate);
      localFilters.endDate = formatDate(endDate);
      break;
    case 'thisMonth':
      // 本月
      startDate.setDate(1); // 当月1号
      localFilters.startDate = formatDate(startDate);
      localFilters.endDate = formatDate(endDate);
      break;
    case 'custom':
      // 自定义，保留现有日期
      break;
  }
};

// 格式化日期为YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 选择地点
const selectLocation = (location: string): void => {
  localFilters.location = location;
};

// 选择骑行服颜色
const selectJerseyColor = (color: string): void => {
  localFilters.jerseyColor = color;
};

// 选择骑行裤颜色
const selectBibColor = (color: string): void => {
  localFilters.bibColor = color;
};

// 选择锁鞋颜色
const selectShoeColor = (color: string): void => {
  localFilters.shoeColor = color;
};

// 应用筛选条件
const handleApply = (): void => {
  // 将bikeType数组转换为字符串格式
  let bikeTypeValue: string | string[];

  if (Array.isArray(localFilters.bikeType)) {
    if (localFilters.bikeType.length === 0) {
      bikeTypeValue = '';
    } else if (localFilters.bikeType.length === 1) {
      bikeTypeValue = localFilters.bikeType[0];
    } else if (localFilters.bikeType.length === 3) {
      // 全选了三种车型
      bikeTypeValue = 'all';
    } else {
      // 其他组合保持数组形式
      bikeTypeValue = localFilters.bikeType;
    }
  } else {
    bikeTypeValue = localFilters.bikeType;
  }

  const filtersToApply: Filters = {
    ...localFilters,
    bikeType: bikeTypeValue
  };

  // 更新全局状态
  searchStore.applyFilters(filtersToApply);

  // 兼容原有逻辑
  emit('apply', filtersToApply);
  emit('update:modelValue', false);
};

// 重置筛选条件
const handleReset = (): void => {
  // 重置为默认值
  Object.assign(localFilters, defaultFilters);

  // 更新全局状态
  searchStore.resetFilters();

  // 兼容原有逻辑
  emit('reset');
};

// 关闭面板
const handleClose = (): void => {
  emit('update:modelValue', false);
};

// 切换骑行服颜色展示
const toggleJerseyColors = (): void => {
  showAllJerseyColors.value = !showAllJerseyColors.value;
};

// 切换骑行裤颜色展示
const toggleBibColors = (): void => {
  showAllBibColors.value = !showAllBibColors.value;
};

// 切换锁鞋颜色展示
const toggleShoeColors = (): void => {
  showAllShoeColors.value = !showAllShoeColors.value;
};

// 模拟的照片统计数据
interface PhotoStats {
  total: number;
  byDate: Record<string, number>;
  byLocation: Record<string, number>;
  byBikeType: Record<string, number>;
  roadBikeByColor: {
    jersey: Record<string, number>;
    bib: Record<string, number>;
    shoe: Record<string, number>;
  };
}

const photoStats = ref<PhotoStats>({
  total: 156,
  byDate: {
    today: 28,
    yesterday: 15,
    weekend: 35,
    thisWeek: 62,
    thisMonth: 124,
    custom: 156 // 默认全部
  },
  byLocation: {
    '全部': 156,
    '戒台寺': 68,
    '潭王路': 42,
    '妙峰山': 36,
    '其他地点': 10
  },
  byBikeType: {
    road: 95,
    motor: 48,
    other: 13
  },
  roadBikeByColor: {
    jersey: {
      red: 18,
      blue: 22,
      black: 25,
      white: 15,
      yellow: 10,
      navy: 5
    },
    bib: {
      black: 45,
      navy: 25,
      grey: 15,
      red: 5,
      blue: 3,
      white: 2
    },
    shoe: {
      white: 35,
      black: 40,
      red: 12,
      yellow: 5,
      blue: 3
    }
  }
});

// 计算属性：获取筛选结果文本
const getFilterResultsText = computed((): string => {
  // 计算符合当前筛选条件的照片数量
  const count = calculateFilteredCount();

  // 生成描述文本
  const baseText = `共找到 ${count} 张照片`;

  // 如果是0，添加提示
  if (count === 0) {
    return `${baseText} (无符合条件的照片)`;
  }

  // 构建详细描述
  const details: string[] = [];

  // 添加日期描述
  if (localFilters.dateOption) {
    const dateLabel = dateOptions.find(item => item.value === localFilters.dateOption)?.label || '自定义日期';
    details.push(dateLabel);
  }

  // 添加地点描述
  if (localFilters.location && localFilters.location !== '全部') {
    details.push(localFilters.location);
  }

  // 添加车型描述
  if (Array.isArray(localFilters.bikeType) && localFilters.bikeType.length > 0) {
    if (localFilters.bikeType.length === bikeOptions.value.length) {
      // 全选
      details.push('全部车型');
    } else if (localFilters.bikeType.includes('road')) {
      // 如果选择了公路车，可以包含颜色信息
      const bikeDetail: string[] = [];
      bikeDetail.push('公路车');

      // 添加颜色信息
      if (localFilters.jerseyColor) {
        const color = filterOptions.jerseyColors.find(c => c.value === localFilters.jerseyColor)?.label;
        if (color) bikeDetail.push(`${color}骑行服`);
      }

      if (localFilters.bibColor) {
        const color = filterOptions.bibColors.find(c => c.value === localFilters.bibColor)?.label;
        if (color) bikeDetail.push(`${color}骑行裤`);
      }

      if (localFilters.shoeColor) {
        const color = filterOptions.shoeColors.find(c => c.value === localFilters.shoeColor)?.label;
        if (color) bikeDetail.push(`${color}骑行鞋`);
      }

      details.push(bikeDetail.join('、'));
    } else {
      // 其他车型组合
      const selectedBikes = localFilters.bikeType.map(type => {
        const option = bikeOptions.value.find(opt => opt.value === type);
        return option ? option.label : '';
      }).filter(Boolean);

      details.push(selectedBikes.join('、'));
    }
  } else if (typeof localFilters.bikeType === 'string' && localFilters.bikeType !== 'all') {
    const bikeLabel = bikeOptions.value.find(opt => opt.value === localFilters.bikeType)?.label || '';
    if (bikeLabel) {
      details.push(bikeLabel);
    }
  }

  if (details.length > 0) {
    return `${baseText}（${details.join(' · ')}）`;
  }

  return baseText;
});

// 计算符合筛选条件的照片数量
const calculateFilteredCount = (): number => {
  // 这是一个模拟的计算函数，实际应用中可能需要向后端发起请求获取准确数量
  let count = photoStats.value.total;

  // 按日期筛选
  if (localFilters.dateOption && localFilters.dateOption !== 'custom') {
    count = Math.min(count, photoStats.value.byDate[localFilters.dateOption]);
  } else if (localFilters.startDate || localFilters.endDate) {
    // 自定义日期范围，这里简化处理，实际应该根据日期范围计算
    const dateRangeFactor = 0.8; // 假设日期范围覆盖了80%的照片
    count = Math.floor(count * dateRangeFactor);
  }

  // 按地点筛选
  if (localFilters.location && localFilters.location !== '全部') {
    // 原始地点数与筛选后的比例
    const locationRatio = photoStats.value.byLocation[localFilters.location] / photoStats.value.total;
       count = Math.floor(count * locationRatio);
   }

  // 按车型筛选
  if (Array.isArray(localFilters.bikeType) && localFilters.bikeType.length > 0 && localFilters.bikeType.length < bikeOptions.value.length) {
    // 计算选中的车型占总数的比例
    let bikeTypeCount = 0;
    localFilters.bikeType.forEach(type => {
      bikeTypeCount += photoStats.value.byBikeType[type] || 0;
    });
       const bikeTypeRatio = bikeTypeCount / photoStats.value.total;
       count = Math.floor(count * bikeTypeRatio);
  } else if (typeof localFilters.bikeType === 'string' && localFilters.bikeType !== 'all') {
    const bikeTypeRatio = photoStats.value.byBikeType[localFilters.bikeType] / photoStats.value.total;
    count = Math.floor(count * bikeTypeRatio);
  }

  // 如果选择了公路车，并且选择了颜色，进一步筛选
  const hasRoadBike = Array.isArray(localFilters.bikeType)
    ? localFilters.bikeType.includes('road')
    : (localFilters.bikeType === 'road' || localFilters.bikeType === 'all');

  if (hasRoadBike) {
    const roadBikeStats = photoStats.value.roadBikeByColor;

    // 计算公路车在选中车型中的比例
    const roadBikeRatio = photoStats.value.byBikeType.road /
      (Array.isArray(localFilters.bikeType)
        ? localFilters.bikeType.reduce((sum, type) => sum + (photoStats.value.byBikeType[type] || 0), 0)
        : (localFilters.bikeType === 'all' ? photoStats.value.total : photoStats.value.byBikeType[localFilters.bikeType] || 0));

    let roadBikeCount = Math.floor(count * roadBikeRatio);

    // 骑行服颜色
    if (localFilters.jerseyColor) {
      const jerseyRatio = (roadBikeStats.jersey[localFilters.jerseyColor] || 0) / photoStats.value.byBikeType.road;
      roadBikeCount = Math.floor(roadBikeCount * jerseyRatio);
    }

    // 骑行裤颜色
    if (localFilters.bibColor) {
      const bibRatio = (roadBikeStats.bib[localFilters.bibColor] || 0) / photoStats.value.byBikeType.road;
      roadBikeCount = Math.floor(roadBikeCount * bibRatio);
    }

    // 锁鞋颜色
    if (localFilters.shoeColor) {
      const shoeRatio = (roadBikeStats.shoe[localFilters.shoeColor] || 0) / photoStats.value.byBikeType.road;
      roadBikeCount = Math.floor(roadBikeCount * shoeRatio);
    }

    // 计算非公路车的数量
    const nonRoadBikeCount = count - Math.floor(count * roadBikeRatio);

    // 总数 = 符合颜色条件的公路车 + 其他车型
    count = roadBikeCount + nonRoadBikeCount;
  }

  // 确保结果不小于0
  return Math.max(0, count);
};

// 监听筛选条件变化，更新统计
watch([
  () => localFilters.dateOption,
  () => localFilters.startDate,
  () => localFilters.endDate,
  () => localFilters.location,
  () => localFilters.bikeType,
  () => localFilters.jerseyColor,
  () => localFilters.bibColor,
  () => localFilters.shoeColor
], () => {
  // 当筛选条件变化时，可以做一些额外的处理
  console.log('筛选条件变化', getFilterResultsText.value);
}, { deep: true });

// 监听父组件传入的筛选条件变化
watch(() => props.filters, (newFilters) => {
  // 处理bikeType
  let bikeTypeArray: string[] = [];
  if (newFilters.bikeType === 'all') {
    // 如果是全选
    bikeTypeArray = ['road', 'motor', 'other'];
  } else if (Array.isArray(newFilters.bikeType)) {
    bikeTypeArray = [...newFilters.bikeType];
  } else if (newFilters.bikeType) {
    bikeTypeArray = [newFilters.bikeType];
  } else {
    bikeTypeArray = ['road', 'motor', 'other']; // 默认全选
  }

  Object.assign(localFilters, {
    startDate: newFilters.startDate || '',
    endDate: newFilters.endDate || '',
    dateOption: newFilters.dateOption || 'today',
    location: newFilters.location || '戒台寺',
    bikeType: bikeTypeArray,
    jerseyColor: newFilters.jerseyColor || '',
    bibColor: newFilters.bibColor || '',
    shoeColor: newFilters.shoeColor || ''
  });
}, { deep: true });

// 组件挂载时
onMounted(async () => {
  // 加载筛选选项
  await loadFilterOptions();

  // 确保bikeType是数组且包含所有选项（全选）
  if (props.filters.bikeType === 'all') {
    localFilters.bikeType = ['road', 'motor', 'other'];
  }

  // 根据初始dateOption设置日期
  if (localFilters.dateOption) {
    nextTick(() => {
      selectDateOption(localFilters.dateOption);
    });
  }
});
</script>

<style scoped>

</style>