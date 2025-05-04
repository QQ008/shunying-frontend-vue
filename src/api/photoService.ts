import type { Photo, Filters } from '@/stores/searchStore'

// 模拟后端API接口
export interface PhotoResponse {
  photos: Photo[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 可用的筛选字段
export interface FilterOptions {
  locations: string[]
  bikeTypes: string[]
  jerseyColors: Array<{label: string, value: string, hex: string}>
  bibColors: Array<{label: string, value: string, hex: string}>
  shoeColors: Array<{label: string, value: string, hex: string}>
}

// 模拟的照片数据库
const generateMockPhotos = (count: number): Photo[] => {
  const locations = ['戒台寺', '潭王路', '妙峰山', '其他地点']
  const bikeTypes = ['road', 'motor', 'other']
  const jerseyColors = ['red', 'blue', 'yellow', 'black', 'white', 'navy', 'green', 'orange', 'purple', 'pink']
  const bibColors = ['black', 'navy', 'grey', 'red', 'blue', 'white']
  const shoeColors = ['white', 'black', 'red', 'yellow', 'blue']

  return Array.from({ length: count }, (_, index) => {
    const id = Date.now() + index 
    const bikeType = bikeTypes[Math.floor(Math.random() * bikeTypes.length)]
    return {
      id,
      url: null,
      description: `骑行照片 #${index + 1}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      bikeType,
      jerseyColor: bikeType === 'road' ? jerseyColors[Math.floor(Math.random() * jerseyColors.length)] : undefined,
      bibColor: bikeType === 'road' ? bibColors[Math.floor(Math.random() * bibColors.length)] : undefined,
      shoeColor: bikeType === 'road' ? shoeColors[Math.floor(Math.random() * shoeColors.length)] : undefined,
      orientation: Math.random() > 0.7 ? 'vertical' : 'horizontal'
    }
  })
}

// 模拟照片数据库
const mockPhotoDatabase = generateMockPhotos(200)

// 实现过滤逻辑
const filterPhotos = (photos: Photo[], filters: Filters): Photo[] => {
  let result = [...photos]
  
  // 根据日期筛选
  if (filters.dateOption === 'custom' && filters.startDate && filters.endDate) {
    result = result.filter(photo => {
      const photoDate = new Date(photo.date)
      const start = new Date(filters.startDate)
      const end = new Date(filters.endDate)
      end.setHours(23, 59, 59, 999)
      return photoDate >= start && photoDate <= end
    })
  } else if (filters.dateOption === 'today') {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    result = result.filter(photo => photo.date === todayStr)
  } else if (filters.dateOption === 'yesterday') {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    result = result.filter(photo => photo.date === yesterdayStr)
  } // 其他日期选项同理...

  // 根据地点筛选
  if (filters.location && filters.location !== '全部') {
    result = result.filter(photo => photo.location === filters.location)
  }
  
  // 根据车型筛选
  if (filters.bikeType && filters.bikeType !== 'all') {
    if (Array.isArray(filters.bikeType)) {
      result = result.filter(photo => filters.bikeType.includes(photo.bikeType))
    } else {
      result = result.filter(photo => photo.bikeType === filters.bikeType)
    }
  }
  
  // 如果是公路车，根据装备颜色筛选
  const hasColorFilters = filters.jerseyColor || filters.bibColor || filters.shoeColor
  
  if (hasColorFilters) {
    // 筛选公路车照片
    let roadBikePhotos = result.filter(photo => photo.bikeType === 'road')
    let otherPhotos = result.filter(photo => photo.bikeType !== 'road')
    
    // 根据骑行服颜色筛选
    if (filters.jerseyColor) {
      roadBikePhotos = roadBikePhotos.filter(photo => photo.jerseyColor === filters.jerseyColor)
    }
    
    // 根据骑行裤颜色筛选
    if (filters.bibColor) {
      roadBikePhotos = roadBikePhotos.filter(photo => photo.bibColor === filters.bibColor)
    }
    
    // 根据锁鞋颜色筛选
    if (filters.shoeColor) {
      roadBikePhotos = roadBikePhotos.filter(photo => photo.shoeColor === filters.shoeColor)
    }
    
    // 重新组合筛选结果
    if (filters.bikeType === 'road' || 
      (Array.isArray(filters.bikeType) && filters.bikeType.includes('road') && filters.bikeType.length === 1)) {
      result = roadBikePhotos
    } else if (filters.bikeType === 'all' || 
             (Array.isArray(filters.bikeType) && filters.bikeType.includes('road'))) {
      result = [...roadBikePhotos, ...otherPhotos]
    } else {
      // 如果没有选公路车，则颜色筛选不起作用
      result = otherPhotos
    }
  }
  
  return result
}

// 模拟API - 获取照片
export const fetchPhotos = async (
  filters: Filters, 
  page: number = 1, 
  pageSize: number = 20
): Promise<PhotoResponse> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))
  
  // 过滤照片
  const filteredPhotos = filterPhotos(mockPhotoDatabase, filters)
  
  // 分页
  const startIndex = (page - 1) * pageSize
  const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + pageSize)
  
  return {
    photos: paginatedPhotos,
    total: filteredPhotos.length,
    page,
    pageSize,
    hasMore: startIndex + pageSize < filteredPhotos.length
  }
}

// 模拟API - 获取可用筛选选项
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    locations: ['全部', '戒台寺', '潭王路', '妙峰山', '其他地点'],
    bikeTypes: ['road', 'motor', 'other'],
    jerseyColors: [
      { label: '红色', value: 'red', hex: '#ff4d4f' },
      { label: '蓝色', value: 'blue', hex: '#1890ff' },
      { label: '黄色', value: 'yellow', hex: '#fadb14' },
      { label: '黑色', value: 'black', hex: '#000000' },
      { label: '白色', value: 'white', hex: '#ffffff' },
      { label: '深蓝色', value: 'navy', hex: '#003366' },
      { label: '灰色', value: 'grey', hex: '#8c8c8c' },
      { label: '绿色', value: 'green', hex: '#52c41a' },
      { label: '橙色', value: 'orange', hex: '#fa8c16' },
      { label: '紫色', value: 'purple', hex: '#722ed1' },
      { label: '粉色', value: 'pink', hex: '#eb2f96' }
    ],
    bibColors: [
      { label: '黑色', value: 'black', hex: '#000000' },
      { label: '深蓝色', value: 'navy', hex: '#003366' },
      { label: '灰色', value: 'grey', hex: '#8c8c8c' },
      { label: '红色', value: 'red', hex: '#ff4d4f' },
      { label: '蓝色', value: 'blue', hex: '#1890ff' },
      { label: '白色', value: 'white', hex: '#ffffff' }
    ],
    shoeColors: [
      { label: '白色', value: 'white', hex: '#ffffff' },
      { label: '黑色', value: 'black', hex: '#000000' },
      { label: '红色', value: 'red', hex: '#ff4d4f' },
      { label: '黄色', value: 'yellow', hex: '#fadb14' },
      { label: '蓝色', value: 'blue', hex: '#1890ff' }
    ]
  }
}

// 模拟API - 获取单张照片
export const fetchPhotoById = async (id: string | number): Promise<Photo | null> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const photo = mockPhotoDatabase.find(p => p.id.toString() === id.toString())
  return photo || null
} 