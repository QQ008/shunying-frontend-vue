import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SearchImageParams, ImageGroup } from '@/api/image'; // 修正路径

// 工具函数：获取 YYYY-MM-DD 格式日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayStr = formatDate(new Date());

// 默认筛选条件工厂函数
export const initialSearchFilters = (): SearchImageParams => ({
  page: 1,
  limit: 10, // 保持 limit
  dateStart: todayStr,    // 默认今天
  dateEnd: todayStr,      // 默认今天
  dateRangeText: '今天', // 默认显示今天
  location: '妙峰山',     // 默认妙峰山
  targetTime: 12, // 保留 targetTime
  bikeType: [],          // 默认全部车型
  jerseyColor: '',       // 默认全部颜色 (空字符串代表全部)
  pantsColor: '',
  shoeColor: '',
});

export const useSearchStore = defineStore(
  'search',
  () => {
    // State
    const filters = ref<SearchImageParams>(initialSearchFilters());
    const imageGroups = ref<ImageGroup[]>([]);
    const isLoading = ref(false);
    const isFinished = ref(false);
    const firstLoad = ref(true); // 是否从未执行过搜索
    const scrollPosition = ref<number>(0); // 保存滚动位置

    // Actions
    function setFilters(newFilters: Partial<SearchImageParams>) {
      // 当设置新过滤器时，总是重置页码为1，并清除完成状态
      filters.value = { ...filters.value, ...newFilters, page: 1 };
      isFinished.value = false;
      firstLoad.value = false; // 只要设置过过滤器，就不再是首次加载
      console.log('Filters updated in store:', filters.value);
    }

    function resetFiltersToDefault() {
      filters.value = initialSearchFilters(); // 重置为默认值
      isFinished.value = false; // 清除完成状态
      firstLoad.value = false; // 重置操作也视为非首次加载
      scrollPosition.value = 0; // 重置滚动位置
      console.log('Filters reset to default in store:', filters.value);
    }

    // 清除过滤器是回到一个完全空白的状态，允许首次加载逻辑再次运行
    function clearFilters() {
      filters.value = {
        page: 1, limit: 10, dateStart: '', dateEnd: '', dateRangeText: '',
        location: '', targetTime: 12, bikeType: [], jerseyColor: '',
        pantsColor: '', shoeColor: ''
      };
      isFinished.value = false;
      firstLoad.value = true; // 清除后，下次加载视为首次
      scrollPosition.value = 0; // 重置滚动位置
      console.log('Filters cleared in store:', filters.value);
    }

    function setResults(groups: ImageGroup[], finished: boolean) {
      imageGroups.value = groups;
      isFinished.value = finished;
      isLoading.value = false;
      if (groups.length > 0 || !firstLoad.value) {
          firstLoad.value = false; // 只要有结果或不是首次加载，就标记为非首次
      }
      // 分页逻辑移到 SearchPage.vue 中，这里不再管理 page
      console.log('Results set in store. Finished:', finished, 'FirstLoad:', firstLoad.value);
    }

    function appendResults(groups: ImageGroup[], finished: boolean) {
      imageGroups.value.push(...groups);
      isFinished.value = finished;
      isLoading.value = false;
      // 分页逻辑移到 SearchPage.vue 中，这里不再管理 page
      console.log('Results appended in store. Finished:', finished);
    }

    function setLoading(loading: boolean) {
      isLoading.value = loading;
    }

    function setFinished(finished: boolean) {
      isFinished.value = finished;
    }

    function setFirstLoad(isFirst: boolean) {
      firstLoad.value = isFirst;
    }

    function setScrollPosition(position: number) {
      scrollPosition.value = position;
    }

    return {
      filters,
      imageGroups,
      isLoading,
      isFinished,
      firstLoad,
      scrollPosition, // 导出滚动位置状态
      setFilters,
      resetFiltersToDefault,
      clearFilters,
      setResults,
      appendResults,
      setLoading,
      setFinished,
      setFirstLoad,
      setScrollPosition, // 导出设置滚动位置的 action
    };
  },
  {
    // 启用持久化
    persist: true,
  }
); 