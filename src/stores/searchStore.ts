import { defineStore } from 'pinia'

// 定义筛选条件接口
export interface Filters {
  startDate: string
  endDate: string
  dateOption: 'today' | 'yesterday' | 'weekend' | 'thisWeek' | 'thisMonth' | 'custom'
  location: string
  bikeType: string | string[] // 'all' 或具体车型或车型数组
  jerseyColor: string
  bibColor: string
  shoeColor: string
}

// 定义照片数据接口
export interface Photo {
  id: number | string
  url: string | null
  description: string
  location: string
  date: string
  bikeType: string
  jerseyColor?: string
  bibColor?: string
  shoeColor?: string
  orientation: 'horizontal' | 'vertical'
  loading?: boolean
  error?: boolean
}

// 定义状态接口
interface SearchState {
  filters: Filters
  photos: Photo[]
  showFilter: boolean
  loadingMore: boolean
  initialized: boolean
}

// 日期格式化工具函数
const formatDateToString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const useSearchStore = defineStore('search', {
  // 存储的状态
  state: (): SearchState => ({
    // 筛选条件
    filters: {
      startDate: '',
      endDate: '',
      dateOption: 'today',
      location: '戒台寺',
      bikeType: 'all', // 默认全选
      jerseyColor: '',
      bibColor: '',
      shoeColor: ''
    },
    // 存储显示的照片
    photos: [],
    // 是否显示筛选面板
    showFilter: false,
    // 是否正在加载更多照片
    loadingMore: false,
    // 是否已初始化数据
    initialized: false
  }),

  // 计算属性
  getters: {
    // 获取筛选后的照片
    filteredPhotos: (state): Photo[] => {
      if (!state.photos || state.photos.length === 0) {
        return []
      }

      let result = [...state.photos]

      // 根据日期筛选
      if (state.filters.dateOption === 'custom' && state.filters.startDate && state.filters.endDate) {
        result = result.filter(photo => {
          const photoDate = new Date(photo.date)
          const start = new Date(state.filters.startDate)
          const end = new Date(state.filters.endDate)
          // 设置end为当天结束时间，以包含结束日期当天
          end.setHours(23, 59, 59, 999)
          return photoDate >= start && photoDate <= end
        })
      } else if (state.filters.dateOption === 'today') {
        const today = new Date()
        const todayStr = formatDateToString(today)
        result = result.filter(photo => photo.date === todayStr)
      } else if (state.filters.dateOption === 'yesterday') {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = formatDateToString(yesterday)
        result = result.filter(photo => photo.date === yesterdayStr)
      } else if (state.filters.dateOption === 'thisWeek') {
        const today = new Date()
        const dayOfWeek = today.getDay() || 7 // 将周日的0转换为7
        const monday = new Date(today)
        monday.setDate(today.getDate() - (dayOfWeek - 1))
        monday.setHours(0, 0, 0, 0)

        result = result.filter(photo => {
          const photoDate = new Date(photo.date)
          return photoDate >= monday
        })
      } else if (state.filters.dateOption === 'thisMonth') {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

        result = result.filter(photo => {
          const photoDate = new Date(photo.date)
          return photoDate >= firstDay
        })
      } else if (state.filters.dateOption === 'weekend') {
        const today = new Date()
        const dayOfWeek = today.getDay() // 0是周日，6是周六

        // 确定最近的周末日期
        let saturday: Date, sunday: Date
        if (dayOfWeek === 0) { // 今天是周日
          sunday = today
          saturday = new Date(today)
          saturday.setDate(today.getDate() - 1) // 昨天是周六
        } else if (dayOfWeek === 6) { // 今天是周六
          saturday = today
          sunday = new Date(today)
          sunday.setDate(today.getDate() + 1) // 明天是周日
        } else { // 工作日
          // 上一个周末
          saturday = new Date(today)
          saturday.setDate(today.getDate() - dayOfWeek - 1)
          sunday = new Date(today)
          sunday.setDate(today.getDate() - dayOfWeek)
        }

        // 格式化日期为字符串，用于比较
        const saturdayStr = formatDateToString(saturday)
        const sundayStr = formatDateToString(sunday)

        result = result.filter(photo => photo.date === saturdayStr || photo.date === sundayStr)
      }

      // 根据地点筛选
      if (state.filters.location && state.filters.location !== '全部') {
        result = result.filter(photo => photo.location === state.filters.location)
      }

      // 根据车型筛选
      if (state.filters.bikeType && state.filters.bikeType !== 'all') {
        if (Array.isArray(state.filters.bikeType)) {
          // 如果是数组，检查photo.bikeType是否在数组中
          result = result.filter(photo => state.filters.bikeType.includes(photo.bikeType))
        } else {
          // 否则直接比较
          result = result.filter(photo => photo.bikeType === state.filters.bikeType)
        }
      }

      // 如果是公路车，根据装备颜色筛选
      const hasColorFilters = state.filters.jerseyColor || state.filters.bibColor || state.filters.shoeColor

      if (hasColorFilters) {
        // 筛选公路车照片
        let roadBikePhotos = result.filter(photo => photo.bikeType === 'road')
        const otherPhotos = result.filter(photo => photo.bikeType !== 'road')

        // 根据骑行服颜色筛选
        if (state.filters.jerseyColor) {
          roadBikePhotos = roadBikePhotos.filter(photo => photo.jerseyColor === state.filters.jerseyColor)
        }

        // 根据骑行裤颜色筛选
        if (state.filters.bibColor) {
          roadBikePhotos = roadBikePhotos.filter(photo => photo.bibColor === state.filters.bibColor)
        }

        // 根据锁鞋颜色筛选
        if (state.filters.shoeColor) {
          roadBikePhotos = roadBikePhotos.filter(photo => photo.shoeColor === state.filters.shoeColor)
        }

        // 重新组合筛选结果
        if (state.filters.bikeType === 'road' ||
          (Array.isArray(state.filters.bikeType) && state.filters.bikeType.includes('road') && state.filters.bikeType.length === 1)) {
          result = roadBikePhotos
        } else if (state.filters.bikeType === 'all' ||
                 (Array.isArray(state.filters.bikeType) && state.filters.bikeType.includes('road'))) {
          result = [...roadBikePhotos, ...otherPhotos]
        } else {
          // 如果没有选公路车，则颜色筛选不起作用
          result = otherPhotos
        }
      }

      return result
    },

    // 获取筛选条件摘要
    filterSummary: (state): string => {
      const summary: string[] = []

      if (state.filters.dateOption === 'today') {
        summary.push('今日')
      } else if (state.filters.dateOption === 'yesterday') {
        summary.push('昨日')
      } else if (state.filters.dateOption === 'weekend') {
        summary.push('本周末')
      } else if (state.filters.dateOption === 'thisWeek') {
        summary.push('本周')
      } else if (state.filters.dateOption === 'thisMonth') {
        summary.push('本月')
      } else if (state.filters.dateOption === 'custom' && state.filters.startDate) {
        let dateText = state.filters.startDate
        if (state.filters.endDate) {
          dateText += ` 至 ${state.filters.endDate}`
        }
        summary.push(dateText)
      }

      if (state.filters.location && state.filters.location !== '全部') {
        summary.push(state.filters.location)
      }

      // 处理车型
      if (state.filters.bikeType && state.filters.bikeType !== 'all') {
        if (Array.isArray(state.filters.bikeType)) {
          if (state.filters.bikeType.length === 1) {
            const type = state.filters.bikeType[0]
            if (type === 'road') summary.push('公路车')
            else if (type === 'motor') summary.push('摩托车')
            else summary.push('其他车型')
          } else if (state.filters.bikeType.length > 0) {
            summary.push(`${state.filters.bikeType.length}种车型`)
          }
        } else {
          if (state.filters.bikeType === 'road') summary.push('公路车')
          else if (state.filters.bikeType === 'motor') summary.push('摩托车')
          else summary.push('其他车型')
        }
      }

      // 装备颜色
      const colorMap: Record<string, string> = {
        red: '红色', blue: '蓝色', yellow: '黄色', black: '黑色',
        white: '白色', navy: '深蓝色', grey: '灰色', green: '绿色',
        orange: '橙色', purple: '紫色', pink: '粉色'
      }

      if (state.filters.jerseyColor) {
        const colorName = colorMap[state.filters.jerseyColor] || state.filters.jerseyColor
        summary.push(`骑行服:${colorName}`)
      }

      if (state.filters.bibColor) {
        const colorName = colorMap[state.filters.bibColor] || state.filters.bibColor
        summary.push(`骑行裤:${colorName}`)
      }

      if (state.filters.shoeColor) {
        const colorName = colorMap[state.filters.shoeColor] || state.filters.shoeColor
        summary.push(`锁鞋:${colorName}`)
      }

      return summary.length > 0 ? summary.join(', ') : '全部'
    }
  },

  // 操作方法
  actions: {
    // 设置筛选条件
    setFilters(filters: Partial<Filters>): void {
      this.filters = { ...this.filters, ...filters }
    },

    // 重置筛选条件
    resetFilters(): void {
      this.filters = {
        startDate: '',
        endDate: '',
        dateOption: 'today',
        location: '戒台寺',
        bikeType: 'all',
        jerseyColor: '',
        bibColor: '',
        shoeColor: ''
      }
    },

    // 设置照片数据
    setPhotos(photos: Photo[]): void {
      this.photos = [...photos]
      this.initialized = true
    },

    // 添加更多照片
    addPhotos(photos: Photo[]): void {
      this.photos = [...this.photos, ...photos]
    },

    // 设置筛选面板显示状态
    setShowFilter(status: boolean): void {
      this.showFilter = status
    },

    // 应用筛选
    applyFilters(filters: Partial<Filters>): void {
      this.setFilters(filters)
      this.showFilter = false
    },

    // 加载照片数据，如果尚未初始化
    async loadInitialPhotos(photosData: Photo[]): Promise<void> {
      if (!this.initialized && photosData && photosData.length > 0) {
        this.setPhotos(photosData)
      }
    }
  }
})
