// [图片详情页]
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useImageDetail() {
  const route = useRoute()
  const router = useRouter()
  const currentIndex = ref(0)
  const showFullScreen = ref(false)
  const isPurchased = ref(false)
  const isFavorite = ref(false)
  const isFollowing = ref(false)
  const showReportDialog = ref(false)
  const selectedReportOption = ref('')
  const reportDescription = ref('')
  const specsExpanded = ref(false)
  const showActionMenu = ref(false)

  // 举报选项
  const reportOptions = [
    { id: 'copyright', label: '版权问题' },
    { id: 'portrait', label: '肖像权问题' },
    { id: 'inappropriate', label: '不适当内容' },
    { id: 'fraud', label: '欺诈行为' },
    { id: 'other', label: '其他问题' }
  ]

  // 隐藏底部导航栏
  onBeforeMount(() => {
    document.body.classList.add('hide-tabbar')
  })

  // 模拟数据
  const photos = ref([
    {
      id: 1,
      url: 'https://picsum.photos/800/600?random=1',
      highResUrl: 'https://picsum.photos/1600/1200?random=1',
      price: 29.9,
      originalPrice: 39.9,
      specs: {
        resolution: '4000 x 3000',
        camera: 'Canon EOS R5',
        lens: 'RF 24-70mm f/2.8L IS USM',
        iso: 'ISO 200',
        shutterSpeed: '1/250秒',
        focalLength: '50mm',
        aperture: 'f/4.0',
        dateTime: '2024-03-15 14:30'
      },
      photographer: {
        id: 101,
        name: '张明',
        avatar: 'https://picsum.photos/100?random=1',
        bio: '专注人文风光摄影，作品曾获国家地理摄影大赛奖项'
      }
    },
    {
      id: 2,
      url: 'https://picsum.photos/600/800?random=2', // 竖版图
      highResUrl: 'https://picsum.photos/1200/1600?random=2',
      price: 39.9,
      specs: {
        resolution: '3648 x 5472',
        camera: 'Sony A7 III',
        lens: 'FE 16-35mm f/2.8 GM',
        iso: 'ISO 800',
        shutterSpeed: '6秒',
        focalLength: '24mm',
        aperture: 'f/8.0',
        dateTime: '2024-02-18 21:15'
      },
      photographer: {
        id: 101,
        name: '张明',
        avatar: 'https://picsum.photos/100?random=1',
        bio: '专注人文风光摄影，作品曾获国家地理摄影大赛奖项'
      }
    },
    {
      id: 3,
      url: 'https://picsum.photos/800/600?random=3',
      highResUrl: 'https://picsum.photos/1600/1200?random=3',
      price: 49.9,
      specs: {
        resolution: '6000 x 4000',
        camera: 'Nikon Z7 II',
        lens: 'NIKKOR Z 24-70mm f/4 S',
        iso: 'ISO 100',
        shutterSpeed: '1/125秒',
        focalLength: '35mm',
        aperture: 'f/5.6',
        dateTime: '2024-01-22 17:45'
      },
      photographer: {
        id: 102,
        name: '李华',
        avatar: 'https://picsum.photos/100?random=2',
        bio: '旅行摄影师，足迹遍布全球30多个国家'
      }
    },
    {
      id: 4,
      url: 'https://picsum.photos/600/800?random=4', // 竖版图
      highResUrl: 'https://picsum.photos/1200/1600?random=4',
      price: 59.9,
      specs: {
        resolution: '5504 x 8256',
        camera: 'Fujifilm GFX 100S',
        lens: 'GF 32-64mm f/4 R LM WR',
        iso: 'ISO 400',
        shutterSpeed: '1/60秒',
        focalLength: '45mm',
        aperture: 'f/11.0',
        dateTime: '2023-12-05 06:20'
      },
      photographer: {
        id: 102,
        name: '李华',
        avatar: 'https://picsum.photos/100?random=2',
        bio: '旅行摄影师，足迹遍布全球30多个国家'
      }
    },
    {
      id: 5,
      url: 'https://picsum.photos/800/600?random=5',
      highResUrl: 'https://picsum.photos/1600/1200?random=5',
      price: 35.9,
      specs: {
        resolution: '4928 x 3264',
        camera: 'Panasonic LUMIX GH5',
        lens: 'LEICA DG 12-60mm f/2.8-4.0',
        iso: 'ISO 320',
        shutterSpeed: '1/100秒',
        focalLength: '25mm',
        aperture: 'f/3.5',
        dateTime: '2023-10-30 10:15'
      },
      photographer: {
        id: 103,
        name: '王芳',
        avatar: 'https://picsum.photos/100?random=3',
        bio: '专业建筑摄影师，注重光影与结构的完美结合'
      }
    }
  ])

  // 优惠活动数据
  const promotions = ref([
    {
      id: 1,
      title: '新用户首单8折',
      description: '新注册用户首次购买享受8折优惠',
      condition: 'isNewUser'
    },
    {
      id: 2,
      title: '同系列照片满3减50',
      description: '同一摄影师作品购买3张及以上立减50元',
      condition: 'samePhotographer'
    }
  ])

  const hasPromotion = ref(true)
  const currentPromotion = computed(() => promotions.value[0])
  const currentPhoto = computed(() => photos.value[currentIndex.value])

  onMounted(() => {
    // 如果有id参数，根据id加载特定图片
    if (route.params.id) {
      const photoId = parseInt(route.params.id as string)
      const photoIndex = photos.value.findIndex(photo => photo.id === photoId)
      if (photoIndex !== -1) {
        currentIndex.value = photoIndex
      }
    }
  })

  // 方法
  const changePhoto = (index: number) => {
    currentIndex.value = index
  }

  const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    if (isFavorite.value) {
      alert('已添加到收藏夹！')
    } else {
      alert('已从收藏夹移除！')
    }
  }

  const toggleSpecsExpand = () => {
    specsExpanded.value = !specsExpanded.value
  }

  const toggleActionMenu = () => {
    showActionMenu.value = !showActionMenu.value
  }

  const addToCart = () => {
    // 模拟加入购物车
    alert(`已加入购物车！`)
  }

  const sharePhoto = () => {
    // 模拟分享功能
    alert('分享功能已打开，请选择分享平台')
  }

  const reportPhoto = () => {
    showReportDialog.value = true
    showActionMenu.value = false
  }

  const closeDialog = () => {
    showReportDialog.value = false
    selectedReportOption.value = ''
    reportDescription.value = ''
  }

  const followPhotographer = () => {
    isFollowing.value = !isFollowing.value
    if (isFollowing.value) {
      alert(`已关注${currentPhoto.value.photographer?.name || '摄影师'}`)
    } else {
      alert(`已取消关注`)
    }
  }

  const goToPhotographerProfile = () => {
    if (currentPhoto.value.photographer?.id) {
      // 模拟跳转
      alert(`跳转到摄影师 ${currentPhoto.value.photographer.name} 的主页`)
      // router.push(`/photographer/${currentPhoto.value.photographer.id}`)
    }
  }

  const handleBuy = () => {
    // 模拟购买流程
    isPurchased.value = true
    alert('购买成功！')
  }

  const handleDownload = () => {
    if (!isPurchased.value) {
      alert('请先购买照片')
      return
    }
    // 模拟下载流程
    alert('开始下载原图...')
  }

  const goBack = () => {
    router.back()
    // 离开页面时恢复底部导航栏显示
    document.body.classList.remove('hide-tabbar')
  }

  const submitReport = () => {
    if (!selectedReportOption.value) {
      alert('请选择举报原因')
      return
    }

    // 模拟提交举报
    alert('举报已提交，我们会尽快处理！')
    closeDialog()
  }

  return {
    photos,
    currentIndex,
    currentPhoto,
    showFullScreen,
    isPurchased,
    isFavorite,
    isFollowing,
    promotions,
    hasPromotion,
    currentPromotion,
    showReportDialog,
    selectedReportOption,
    reportDescription,
    specsExpanded,
    showActionMenu,
    reportOptions,
    changePhoto,
    toggleFavorite,
    toggleSpecsExpand,
    toggleActionMenu,
    addToCart,
    sharePhoto,
    reportPhoto,
    closeDialog,
    followPhotographer,
    goToPhotographerProfile,
    handleBuy,
    handleDownload,
    goBack,
    submitReport
  }
}