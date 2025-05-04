<template>
  <div class="search-page">
    <!-- 顶部固定区域 -->
    <van-sticky>
      <div class="bg-white p-2 shadow">
        <!-- 筛选触发按钮 -->
        <van-button type="primary" block icon="filter-o" @click="showFilterPopup = true">
          筛选条件
        </van-button>
        <!-- 时间筛选 -->
        <div class="time-filter mt-2 px-4 text-sm text-gray-700">
          <van-slider
            v-model="timeValue"  
            :min="0"
            :max="24"
            :step="1"
            @change="onTimeChange" 
            bar-height="4px"
          >
            <template #button>
              <div class="custom-button">{{ timeValue }}:00</div>
            </template>
          </van-slider>
          <div class="text-xs text-center text-gray-500 mt-1">拖动选择时间点</div>
          <!-- TODO: 添加显示可用时间段的可视化 -->
        </div>
      </div>
    </van-sticky>

    <!-- 筛选条件弹出层 -->
    <van-popup v-model:show="showFilterPopup" position="right" :style="{ width: '85%', height: '100%' }" @open="onFilterPopupOpen">
      <div class="filter-popup p-4 h-full flex flex-col">
        <h2 class="text-lg font-semibold mb-4">筛选条件</h2>

        <van-cell-group inset class="flex-grow overflow-y-auto mb-4">
          <!-- 日期选择 -->
          <van-field name="日期范围" label="日期范围">
            <template #input>
              <div class="flex flex-col w-full">
                <van-button
                  :text="localFilters.dateRangeText || '选择日期范围'"
                  block
                  plain
                  type="primary"
                  size="small"
                  @click="showCalendar = true"
                  class="mb-1"
                />
                <div class="flex justify-around text-xs">
                  <van-button size="mini" plain type="default" @click="setDateRange('today')">今天</van-button>
                  <van-button size="mini" plain type="default" @click="setDateRange('thisWeek')">本周</van-button>
                  <van-button size="mini" plain type="default" @click="setDateRange('weekend')">周末</van-button>
                </div>
              </div>
            </template>
          </van-field>
          <van-calendar v-model:show="showCalendar" type="range" @confirm="onDateConfirm" color="#1989fa" />

          <!-- 地点 -->
          <van-field
            v-model="selectedLocationText"
            is-link
            readonly
            label="地点"
            placeholder="选择拍摄地点"
            @click="showLocationPicker = true"
          />
          <!-- 地点选择弹出层 -->
          <van-popup v-model:show="showLocationPicker" round position="bottom">
            <van-picker
              :columns="locationOptions"
              @confirm="onLocationConfirm"
              @cancel="showLocationPicker = false"
              :loading="loadingLocations"
              title="选择地点"
            />
          </van-popup>

          <!-- 车型 (多选) -->
          <van-field name="checkboxGroup" label="车型">
            <template #input>
              <van-checkbox-group v-model="localFilters.bikeType" direction="horizontal" class="flex flex-wrap gap-x-2 gap-y-1">
                <van-checkbox v-for="bike in bikeTypeOptions" :key="bike.value" :name="bike.value" shape="square">{{ bike.text }}</van-checkbox>
              </van-checkbox-group>
            </template>
          </van-field>

          <!-- 骑行服颜色 (单选) -->
          <van-field name="jerseyColorRadio" label="骑行服">
             <template #input>
               <div v-if="loadingColors.jersey" class="text-xs text-gray-400">加载中...</div>
               <van-radio-group v-else v-model="localFilters.jerseyColor" direction="horizontal" class="flex flex-wrap gap-1">
                 <van-radio name="">全部</van-radio> <!-- 添加全部选项 -->
                 <van-radio v-for="color in availableColors.jersey" :key="color.value" :name="color.value">
                   {{ color.name }}
                 </van-radio>
               </van-radio-group>
               <div v-if="!loadingColors.jersey && !availableColors.jersey.length" class="text-xs text-gray-400">无颜色选项</div>
             </template>
          </van-field>

          <!-- 骑行裤颜色 (单选) -->
          <van-field name="pantsColorRadio" label="骑行裤">
             <template #input>
               <div v-if="loadingColors.pants" class="text-xs text-gray-400">加载中...</div>
               <van-radio-group v-else v-model="localFilters.pantsColor" direction="horizontal" class="flex flex-wrap gap-1">
                 <van-radio name="">全部</van-radio>
                 <van-radio v-for="color in availableColors.pants" :key="color.value" :name="color.value">
                   {{ color.name }}
                 </van-radio>
               </van-radio-group>
                <div v-if="!loadingColors.pants && !availableColors.pants.length" class="text-xs text-gray-400">无颜色选项</div>
             </template>
          </van-field>

          <!-- 鞋子颜色 (单选) -->
          <van-field name="shoeColorRadio" label="鞋子">
             <template #input>
               <div v-if="loadingColors.shoes" class="text-xs text-gray-400">加载中...</div>
               <van-radio-group v-else v-model="localFilters.shoeColor" direction="horizontal" class="flex flex-wrap gap-1">
                  <van-radio name="">全部</van-radio>
                 <van-radio v-for="color in availableColors.shoes" :key="color.value" :name="color.value">
                   {{ color.name }}
                 </van-radio>
               </van-radio-group>
               <div v-if="!loadingColors.shoes && !availableColors.shoes.length" class="text-xs text-gray-400">无颜色选项</div>
             </template>
          </van-field>

        </van-cell-group>

        <div class="flex justify-between">
          <van-button @click="resetLocalFiltersToDefault">重置为默认</van-button>
          <van-button type="primary" @click="applyFilters">确认筛选</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 结果展示区域 -->
    <div class="results-area p-2">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
         <van-list
            v-model:loading="searchStore.isLoading"
            :finished="searchStore.isFinished"
            finished-text="没有更多了"
            @load="onLoadMore"
            v-if="!searchStore.firstLoad || (searchStore.firstLoad && searchStore.isLoading)"
            ref="listContainerRef"  
          >
           <div class="grid grid-cols-2 gap-2">
              <div v-for="group in searchStore.imageGroups" :key="group.id" class="image-group-card bg-white rounded shadow overflow-hidden" @click="goToDetail(group.id)">
                 <van-image
                  lazy-load
                  :src="group.coverImageUrl || 'https://via.placeholder.com/300x400?text=Image'"
                  alt="图片组封面"
                  class="w-full h-48 object-cover"
                />
                <div class="p-2 text-sm">
                  <p class="font-semibold truncate">{{ group.eventName || '未知活动' }}</p>
                  <p class="text-gray-500 truncate">{{ group.photographerName || '匿名摄影师' }}</p>
                  <p class="text-gray-400 text-xs">{{ group.shootDate || '未知日期' }}</p>
                </div>
              </div>
            </div>
           <div v-if="searchStore.isLoading && searchStore.imageGroups.length === 0" class="flex justify-center items-center p-10">
             <van-loading size="24px">加载中...</van-loading>
           </div>
        </van-list>

        <van-empty v-if="!searchStore.firstLoad && !searchStore.isLoading && searchStore.imageGroups.length === 0" description="未找到符合条件的图片" />
        <van-empty v-if="searchStore.firstLoad && !searchStore.isLoading && searchStore.imageGroups.length === 0" description="请设置筛选条件并搜索" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, nextTick, onActivated, onDeactivated } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useSearchStore, initialSearchFilters } from '@/store/modules/search';
import { getJerseyColorOptions, getPantsColorOptions, getShoeColorOptions, getLocationOptions } from '@/api/common';
import type { ImageGroup, SearchImageParams } from '@/api/image';
import { searchImages } from '@/api/image';
import { showToast } from 'vant';
import type { LocationOption, ColorOption } from '@/api/common';
import type { PickerConfirmEventParams } from 'vant';

const router = useRouter();
const searchStore = useSearchStore();

// --- 状态定义 ---
const showFilterPopup = ref(false);
const showCalendar = ref(false);
const showLocationPicker = ref(false);
const localFilters = reactive(JSON.parse(JSON.stringify(searchStore.filters)));
const timeValue = ref<number>(searchStore.filters.targetTime ?? 12);
const availableColors = reactive<{ jersey: ColorOption[], pants: ColorOption[], shoes: ColorOption[] }>({ jersey: [], pants: [], shoes: [] });
const loadingColors = reactive({ jersey: false, pants: false, shoes: false });
const locationOptions = ref<LocationOption[]>([]);
const loadingLocations = ref(false);
const refreshing = ref(false);

// 定义车型选项 (方便重置和渲染)
const bikeTypeOptions = [
  { text: '公路车', value: '公路车' },
  { text: '摩托车', value: '摩托车' },
  { text: '山地车', value: '山地车' },
  { text: '其他', value: '其他' },
];

// --- computed ---
const selectedLocationText = computed(() => { const selectedValue = localFilters.location; const selectedOption = locationOptions.value.find(opt => opt.value === selectedValue); return selectedOption ? selectedOption.text : '选择拍摄地点'; });

// --- Watchers ---
watch(() => searchStore.filters.targetTime, (newTime) => { if (newTime !== undefined && newTime !== null && newTime !== timeValue.value) { timeValue.value = newTime; } });

// --- 方法 ---
const formatDate = (date: Date | null): string => { if (!date) return ''; const year = date.getFullYear(); const month = (date.getMonth() + 1).toString().padStart(2, '0'); const day = date.getDate().toString().padStart(2, '0'); return `${year}-${month}-${day}`; };
const onDateConfirm = (value: Date | Date[]) => { if (Array.isArray(value) && value.length === 2) { const [start, end] = value; showCalendar.value = false; localFilters.dateStart = formatDate(start); localFilters.dateEnd = formatDate(end); localFilters.dateRangeText = `${formatDate(start)} 至 ${formatDate(end)}`; } };
const setDateRange = (type: 'today' | 'thisWeek' | 'weekend') => { const now = new Date(); let start = new Date(); let end = new Date(); if(type === 'today'){ start=now; end=now; } else if(type === 'thisWeek'){ const d=now.getDay();start.setDate(now.getDate()-(d===0?6:d-1));end.setDate(start.getDate()+6); } else if(type === 'weekend'){ const d=now.getDay(); if(d===0){start.setDate(now.getDate()-1);end=now;}else if(d===6){start=now;end.setDate(now.getDate()+1);}else{start.setDate(now.getDate()+(6-d));end.setDate(now.getDate()+(7-d));} } localFilters.dateStart = formatDate(start); localFilters.dateEnd = formatDate(end); localFilters.dateRangeText = `${formatDate(start)} 至 ${formatDate(end)}`; showCalendar.value = false; };
const fetchLocationOptions = async () => { if (locationOptions.value.length > 0) return; loadingLocations.value = true; try { locationOptions.value = await getLocationOptions(); } catch (error) { console.error('Failed to load location options:', error); showToast('加载地点选项失败'); } finally { loadingLocations.value = false; } };
const onLocationConfirm = ({ selectedOptions }: PickerConfirmEventParams) => { localFilters.location = selectedOptions[0]?.value || ''; showLocationPicker.value = false; };
const fetchColorOptions = async () => { if (availableColors.jersey.length > 0) return; loadingColors.jersey = true; loadingColors.pants = true; loadingColors.shoes = true; try { const [jersey, pants, shoes] = await Promise.all([getJerseyColorOptions(), getPantsColorOptions(), getShoeColorOptions(),]); availableColors.jersey = jersey; availableColors.pants = pants; availableColors.shoes = shoes; } catch (error) { console.error('Failed to load color options:', error); showToast('加载颜色选项失败'); } finally { loadingColors.jersey = false; loadingColors.pants = false; loadingColors.shoes = false; } };
const onFilterPopupOpen = () => { Object.assign(localFilters, JSON.parse(JSON.stringify(searchStore.filters))); if (availableColors.jersey.length === 0) fetchColorOptions(); if (locationOptions.value.length === 0) fetchLocationOptions(); };

// 修改重置方法，将 bikeType 设置为全选
const resetLocalFiltersToDefault = () => {
  const defaults = initialSearchFilters();
  Object.assign(localFilters, defaults);
  // 将 bikeType 设置为所有可用选项的值，以在 UI 上显示为全选
  localFilters.bikeType = bikeTypeOptions.map(option => option.value);
  timeValue.value = localFilters.targetTime ?? 12;
};

const applyFilters = () => {
  // 如果用户在 UI 上选择了所有 bikeType，将其转换为空数组 [] 发送给后端
  const finalBikeType = localFilters.bikeType?.length === bikeTypeOptions.length
    ? []
    : localFilters.bikeType;

  searchStore.setFilters({ ...localFilters, bikeType: finalBikeType });
  showFilterPopup.value = false;
  performSearch(false);
};

const onTimeChange = (value: number) => {
  searchStore.setFilters({ targetTime: value });
  performSearch(false);
};

const performSearch = async (isLoadMore = false) => {
  const currentFilters = searchStore.filters;
  // 后端期望 bikeType 为空数组代表全部，如果 store 中是全选数组，则转换为空数组
  const filtersForApi = {
      ...currentFilters,
      bikeType: (currentFilters.bikeType && currentFilters.bikeType.length === bikeTypeOptions.length) ? [] : currentFilters.bikeType,
  };
  const currentPage = isLoadMore ? filtersForApi.page || 1 : 1;

  if (isLoadMore && searchStore.isFinished) return;
  searchStore.setLoading(true);
  if (refreshing.value && !isLoadMore) {
    // searchStore.setFirstLoad(false); // setFirstLoad 会在 setResults 或 appendResults 中处理
  }
  try {
    const params: SearchImageParams = {
      ...filtersForApi, // 使用转换后的过滤器
      page: currentPage,
     };
    console.log('Performing search with params:', params);
    const newGroups = await searchImages(params);
    if (isLoadMore) {
      searchStore.appendResults(newGroups, newGroups.length < (currentFilters.limit || 10));
    } else {
      searchStore.setResults(newGroups, newGroups.length < (currentFilters.limit || 10));
    }
  } catch (error) { console.error('Search failed:', error); showToast('搜索失败，请稍后重试'); searchStore.setFinished(true); } finally { searchStore.setLoading(false); if (refreshing.value) { refreshing.value = false; } } };
const onLoadMore = () => { performSearch(true); };
const onRefresh = () => { searchStore.setFinished(false); searchStore.setScrollPosition(0); performSearch(false); };
const goToDetail = (id: number) => { router.push(`/search/detail/${id}`); };

// --- 生命周期 & 路由 --- 
onMounted(() => {
  // 确保 localFilters 与 store 同步
  Object.assign(localFilters, JSON.parse(JSON.stringify(searchStore.filters)));
  timeValue.value = searchStore.filters.targetTime ?? 12;

  if (searchStore.firstLoad) {
    console.log('First load, performing initial search with default filters...');
    performSearch(false);
  } else {
    console.log('Not first load, restoring state from store.');
    nextTick(() => {
      console.log('Attempting to restore scroll to:', searchStore.scrollPosition);
      window.scrollTo(0, searchStore.scrollPosition);
    });
  }
});

onBeforeRouteLeave((to, from, next) => {
  searchStore.setScrollPosition(window.scrollY);
  console.log('Saving scroll position to store:', window.scrollY);
  next();
});

onActivated(() => {
  console.log('Component activated, restoring scroll position from store to:', searchStore.scrollPosition);
   nextTick(() => {
      window.scrollTo(0, searchStore.scrollPosition);
   });
});

// onDeactivated (可选，如果使用 keep-alive)
// onDeactivated(() => {
//   console.log('Component deactivated');
// });

</script>

<style scoped>
.search-page {
  min-height: calc(100vh - 50px); /* 减去 TabBar 高度 */
  background-color: #f7f8fa;
}
.filter-popup {
  /* Filter panel specific styles */
}
.image-group-card {
  /* Card styles */
}
.van-checkbox--horizontal {
  margin-bottom: 8px; /* Checkbox 间距 */
}
.flex-wrap .van-checkbox { margin-right: 8px; /* Checkbox 水平间距 */}
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: var(--van-primary-color);
  border-radius: 100px;
}
.van-radio--horizontal {
  margin-bottom: 8px;
  margin-right: 8px;
}
</style> 