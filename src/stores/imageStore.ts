import { defineStore } from 'pinia'

// 定义状态接口
interface ImageState {
  imageState: 'normal' | 'no-image' | 'slow'
  loadingDelay: number
  localImages: string[]
}

export const useImageStore = defineStore('image', {
  state: (): ImageState => ({
    imageState: 'normal', // 'normal' | 'no-image' | 'slow'
    loadingDelay: 2000, // 慢加载状态的延迟时间（毫秒）
    localImages: Array.from({ length: 40 }, (_, index) => `/images/photos/photo${index + 1}.jpg`)
  }),

  actions: {
    setImageState(state: ImageState['imageState']): void {
      this.imageState = state
    },

    // 获取图片URL
    async getImageUrl(index: number): Promise<string | null> {
      if (this.imageState === 'no-image') {
        return null
      }
      
      if (this.imageState === 'slow') {
        await new Promise(resolve => setTimeout(resolve, this.loadingDelay))
      }

      // 使用本地图片
      return this.localImages[index % this.localImages.length]
    }
  }
}) 