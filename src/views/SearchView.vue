<template>
  <div class="search">
    <!-- 顶部导航栏 -->
    <TopBar :is-fixed="false" />

    <!-- 页面顶部搜索栏 -->
    <div class="search-header">
      <div class="search-bar" @click="openFilter">
        <div class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="search-text">筛选条件: {{ filterSummary }}</div>
        <div class="filter-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 图片列表 -->
    <div class="photos-container">
      <!-- Display photos using filteredPhotos computed property -->
      <div v-if="localPhotos.length > 0" class="photos-grid">
        <div
          v-for="photo in localPhotos"
          :key="photo.id"
          class="photo-item"
          :class="{ 'photo-vertical': photo.orientation === 'vertical' }"
          @click="viewPhoto(photo)"
        >
          <div class="photo-wrapper">
            <!-- Image display logic -->
            <img
              v-if="photo.url"
              :src="photo.url"
              :alt="photo.description"
              loading="lazy"
              @error="handleImageError(photo)"
            >
            <!-- Loading Placeholder -->
            <div v-else-if="photo.loading" class="loading-placeholder">
               <div class="loading-spinner"></div>
               <span>加载中...</span>
            </div>
            <!-- Error Placeholder -->
            <div v-else class="error-placeholder">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" stroke="#ccc" stroke-width="2"/><path d="M19 15L14 10L5 19" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
               <span>加载失败</span>
            </div>

            <div class="photo-info">
              <div class="photo-location">{{ photo.location }}</div>
              <div class="photo-date">{{ formatDate(photo.date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loadingInitial && !loadingMore" class="empty-state">
         <div class="empty-icon">
           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="3" y="3" width="18" height="18" rx="2" stroke="#999" stroke-width="2"/>
             <circle cx="8.5" cy="8.5" r="1.5" fill="#999"/>
             <path d="M21 15L16 10L5 21" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
         </div>
         <div class="empty-text">暂无符合条件的图片</div>
         <div class="empty-subtext">请尝试调整筛选条件</div>
         <button class="reset-filter-btn" @click="resetFilters">重置筛选</button>
       </div>

      <!-- Loading More Indicator -->
      <div v-if="loadingMore" class="loading-more">
        <div class="loading-spinner"></div>
        <div>加载更多...</div>
      </div>

      <!-- Initial Loading Indicator -->
       <div v-if="loadingInitial" class="initial-loading">
           <div class="loading-spinner"></div>
           <div>正在加载照片...</div>
       </div>
    </div>

    <!-- 筛选面板组件 -->
    <FilterPanel
      v-model="showFilter"
      :filters="filters"
      @apply="applyFilters"
      @reset="resetFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useSearchStore, type Filters, type Photo } from '@/stores/searchStore'
import { useImageStore } from '@/stores/imageStore'
import { fetchPhotos } from '@/api/photoService'
import FilterPanel from '@/components/FilterPanel.vue'
import TopBar from '@/components/TopBar.vue'
import { useRouter } from 'vue-router'

// Extend Photo interface for local UI state (loading/error per photo)
interface DisplayPhoto extends Photo {
  loading?: boolean;
  error?: boolean;
}

// --- Stores & Router ---
const searchStore = useSearchStore()
const imageStore = useImageStore()
const router = useRouter()

// --- Refs ---
const loadingInitial = ref<boolean>(false)
const loadingMore = ref<boolean>(false)
const localPhotos = ref<DisplayPhoto[]>([])
const currentPage = ref<number>(1)
const hasMorePhotos = ref<boolean>(true)
const totalPhotos = ref<number>(0)

// --- Computed Properties ---

// Control filter panel visibility via store
const showFilter = computed({
  get: () => searchStore.showFilter,
  set: (value: boolean) => searchStore.setShowFilter(value)
})

// Filters from store
const filters = computed<Filters>(() => searchStore.filters)

// Filter summary from store
const filterSummary = computed<string>(() => searchStore.filterSummary)

// --- Methods ---

// Load initial photos or refresh
const loadPhotos = async (isInitialLoad = false): Promise<void> => {
  if (isInitialLoad) {
    loadingInitial.value = true
    currentPage.value = 1 // Reset page on initial load
  } else if (loadingMore.value) {
    // Prevent concurrent loads
    return
  }

  try {
    // 从API获取照片
    const response = await fetchPhotos(filters.value, currentPage.value)

    // 更新总数和是否有更多照片
    totalPhotos.value = response.total
    hasMorePhotos.value = response.hasMore

    // 如果是初始加载，替换本地照片列表
    if (currentPage.value === 1) {
      // 处理照片列表，添加加载状态
      const photosWithLoadingState: DisplayPhoto[] = response.photos.map(p => ({
        ...p,
        loading: true,
        error: false,
        url: null
      }))

      // 更新本地照片列表
      localPhotos.value = photosWithLoadingState

      // 更新store
      searchStore.setPhotos(response.photos)
    } else {
      // 如果是加载更多，添加到现有列表
      const newPhotosWithLoadingState: DisplayPhoto[] = response.photos.map(p => ({
        ...p,
        loading: true,
        error: false,
        url: null
      }))

      // 追加到本地照片列表
      localPhotos.value.push(...newPhotosWithLoadingState)

      // 更新store
      searchStore.addPhotos(response.photos)
    }

    // 加载图片URL
    await Promise.all(localPhotos.value
      .filter(photo => photo.loading === true)
      .map(async (photo) => {
        try {
          // 从imageStore获取URL
          const url = await imageStore.getImageUrl(typeof photo.id === 'string' ? parseInt(photo.id) : (photo.id as number))
          photo.url = url
          if (!url) photo.error = true // 处理URL为null的情况
        } catch (error) {
          console.error(`加载照片失败 ${photo.id}:`, error)
          photo.error = true
          photo.url = null
        } finally {
          photo.loading = false
        }
      })
    )

    console.log(`照片加载完成. 总数: ${totalPhotos.value}, 当前页: ${currentPage.value}, 显示: ${localPhotos.value.length}`)
  } catch (error) {
    console.error('加载照片失败:', error)
    // 设置错误状态
    localPhotos.value.forEach(photo => {
      if (photo.loading) {
        photo.loading = false
        photo.error = true
        photo.url = null
      }
    })
  } finally {
    loadingInitial.value = false
    loadingMore.value = false
  }
}

// Handle image loading errors (e.g., broken link after initial success)
const handleImageError = (photo: DisplayPhoto): void => {
  console.warn(`图片加载失败: ${photo.url}`)
  photo.error = true
  photo.url = null
}

// Open filter panel
const openFilter = (): void => {
  showFilter.value = true
}

// Apply filters from panel
const applyFilters = (newFilters: Filters): void => {
  searchStore.applyFilters(newFilters)
  // 重新加载照片
  nextTick(() => {
    loadPhotos(true) // 作为初始加载处理，重置页码
  })
}

// Reset filters from panel or button
const resetFilters = (): void => {
  searchStore.resetFilters()
  // 重新加载照片
  nextTick(() => {
    loadPhotos(true) // 作为初始加载处理，重置页码
  })
}

// Navigate to photo detail page
const viewPhoto = (photo: DisplayPhoto): void => {
  // 确保ID存在
  if (photo && photo.id != null) {
    router.push({
      name: 'photo-detail',
      params: { id: photo.id.toString() }
    })
  } else {
    console.error("无法查看照片: 无效的照片ID", photo)
  }
}

// Format date utility
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    // 验证日期有效性
    if (isNaN(date.getTime())) return ''
    return `${date.getMonth() + 1}月${date.getDate()}日`
  } catch {
    return '' // 处理日期解析错误
  }
}

// Load more photos (infinite scroll)
const loadMorePhotos = (): void => {
  if (loadingMore.value || loadingInitial.value || !hasMorePhotos.value) return

  loadingMore.value = true
  currentPage.value++
  loadPhotos()
}

// --- Scroll Handling ---
const handleScroll = (): void => {
  // 基本检查以防止在服务器端或初始加载期间运行
  if (typeof window === 'undefined' || loadingInitial.value || loadingMore.value || !hasMorePhotos.value) return

  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight

  // 当接近底部时触发加载更多（例如，150px阈值）
  if (scrollHeight - scrollTop - clientHeight < 150) {
    loadMorePhotos()
  }
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  console.log('SearchView mounted')
  // 仅在store尚未初始化时加载初始数据
  await loadPhotos(true)

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})

// 监听imageStore状态变化
watch(() => imageStore.imageState, async () => {
  console.log(`图片状态变更为: ${imageStore.imageState}. 刷新照片.`)
  // 重新加载照片以反映新的图片状态
  await loadPhotos(true)
})

// 监听筛选条件变化
watch(() => searchStore.filters, async (newFilters, oldFilters) => {
  if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
    console.log('筛选条件变更. 重新加载照片.')
    await loadPhotos(true)
  }
}, { deep: true })
</script>

<style scoped>
.search {
  background-color: #F5F5F7;
  min-height: calc(100vh - 65px);
  padding-bottom: 20px;
}

/* 搜索头部 */
.search-header {
  padding: 12px 14px 10px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-icon, .filter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-text {
  flex: 1;
  margin: 0 12px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 图片列表 */
.photos-container {
  padding: 0 10px 10px;
}

.photos-grid {
  columns: 2;
  column-gap: 10px;
}

.photo-item {
  break-inside: avoid;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: #eee;
  transform: translateZ(0);
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}

.photo-item:active {
  transform: scale(0.98);
}

.photo-wrapper {
  position: relative;
  width: 100%;
  display: block;
}

.photo-wrapper img {
  width: 100%;
  display: block;
  border-radius: 12px;
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
  border-radius: 0 0 12px 12px;
}

.photo-location {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 2px;
}

.photo-date {
  font-size: 11px;
  opacity: 0.8;
}

/* 加载更多 */
.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(153, 102, 255, 0.3);
  border-radius: 50%;
  border-top-color: #9966ff;
  animation: spin 0.8s linear infinite;
  margin-bottom: 8px;
}

.initial-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #666;
  font-size: 16px;
}

.initial-loading .loading-spinner {
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 平板适配 */
@media (min-width: 768px) {
  .photos-grid {
    columns: 3;
  }
}

/* 电脑适配 */
@media (min-width: 1200px) {
  .photos-grid {
    columns: 4;
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.reset-filter-btn {
  padding: 10px 20px;
  background-color: #9966ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-filter-btn:active {
  background-color: #8052d8;
}

.loading-placeholder,
.error-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  color: #999;
  border-radius: 12px;
}

.photo-vertical .loading-placeholder,
.photo-vertical .error-placeholder {
  aspect-ratio: 3/4;
}

.loading-placeholder span,
.error-placeholder span {
  margin-top: 10px;
  font-size: 13px;
}
</style>
