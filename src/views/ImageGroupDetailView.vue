<template>
  <div class="image-group-detail">
    <!-- 自定义顶部导航 -->
    <div class="custom-header">
      <div class="back-button" @click="goBack">
        <i class="icon back"></i>
      </div>
      <h1 class="page-title">图片详情</h1>
      <div class="actions">
        <div class="action-menu" @click="toggleActionMenu">
          <i class="icon more"></i>
          <div v-if="showActionMenu" class="menu-dropdown">
            <div class="menu-item" @click="reportPhoto">举报</div>
            <div class="menu-item" @click="sharePhoto">分享</div>
          </div>
        </div>
      </div>
    </div>

    <div class="gallery-section">
      <ImageViewer
        :photos="photos"
        :currentIndex="currentIndex"
        @change="changePhoto"
        @full-screen="showFullScreen = true"
      />
    </div>

    <div class="info-section">
      <!-- 摄影师信息 -->
      <div class="photographer-info" @click="goToPhotographerProfile">
        <div class="photographer-avatar">
          <img :src="currentPhoto.photographer?.avatar || 'https://picsum.photos/100?random=10'" alt="摄影师头像">
        </div>
        <div class="photographer-details">
          <div class="photographer-name">{{ currentPhoto.photographer?.name || '未知摄影师' }}</div>
          <div class="photographer-bio">{{ currentPhoto.photographer?.bio || '暂无介绍' }}</div>
        </div>
        <div class="follow-btn" @click.stop="followPhotographer">
          <span>{{ isFollowing ? '已关注' : '关注' }}</span>
        </div>
      </div>

      <div class="actions-row">
        <button class="action-btn primary" @click="toggleFavorite">
          <i class="icon" :class="isFavorite ? 'favorite-active' : 'favorite'"></i>
          <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
        </button>
      </div>

      <!-- 优惠信息区域 -->
      <div v-if="hasPromotion" class="promotion-card">
        <div class="promotion-tag">优惠</div>
        <div class="promotion-content">
          <div class="promotion-title">{{ currentPromotion.title }}</div>
          <div class="promotion-desc">{{ currentPromotion.description }}</div>
        </div>
      </div>

      <div class="photo-specs">
        <div class="specs-header" @click="toggleSpecsExpand">
          <h3>图片信息</h3>
          <div class="specs-toggle">
            {{ specsExpanded ? '收起' : '展开' }}
          </div>
        </div>
        <div class="specs-body" v-if="specsExpanded">
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">分辨率</span>
              <span class="spec-value">{{ currentPhoto.specs?.resolution || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">拍摄设备</span>
              <span class="spec-value">{{ currentPhoto.specs?.camera || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">镜头</span>
              <span class="spec-value">{{ currentPhoto.specs?.lens || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">ISO</span>
              <span class="spec-value">{{ currentPhoto.specs?.iso || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">快门速度</span>
              <span class="spec-value">{{ currentPhoto.specs?.shutterSpeed || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">焦距</span>
              <span class="spec-value">{{ currentPhoto.specs?.focalLength || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">光圈</span>
              <span class="spec-value">{{ currentPhoto.specs?.aperture || '暂无数据' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">拍摄日期</span>
              <span class="spec-value">{{ currentPhoto.specs?.dateTime || '暂无数据' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商业信息与购买 -->
      <div class="price-section">
        <div class="price-info">
          <span class="price">¥{{ currentPhoto.price }}</span>
          <span v-if="currentPhoto.originalPrice && currentPhoto.originalPrice > currentPhoto.price" class="original-price">¥{{ currentPhoto.originalPrice }}</span>
        </div>
      </div>

      <div class="purchase-actions">
        <button
          class="buy-download-btn"
          :class="{ 'download-ready': isPurchased }"
          @click="isPurchased ? handleDownload() : handleBuy()"
        >
          <span>{{ isPurchased ? '下载原图' : '立即购买' }}</span>
        </button>

        <button class="cart-btn" @click="addToCart">
          <i class="icon cart"></i>
          <span>加入购物车</span>
        </button>
      </div>
    </div>

    <!-- 全屏查看组件 -->
    <FullScreenViewer
      v-if="showFullScreen"
      :photos="photos"
      :currentIndex="currentIndex"
      @close="showFullScreen = false"
      @change="changePhoto"
    />

    <!-- 举报对话框 -->
    <div v-if="showReportDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-content" @click.stop>
        <h3>举报内容</h3>
        <div class="report-options">
          <div v-for="option in reportOptions" :key="option.id" class="report-option">
            <input type="radio" :id="option.id" :value="option.id" v-model="selectedReportOption">
            <label :for="option.id">{{ option.label }}</label>
          </div>
        </div>
        <textarea v-model="reportDescription" placeholder="请详细描述问题（选填）"></textarea>
        <div class="dialog-buttons">
          <button class="cancel-btn" @click="closeDialog">取消</button>
          <button class="submit-btn" @click="submitReport">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageViewer from '@/components/ImageViewer.vue'
import FullScreenViewer from '@/components/FullScreenViewer.vue'
import useImageDetail from '@/composables/useImageDetail'
import '@/assets/styles/imageGroupDetail.css'

// 使用抽离的逻辑组合函数
const {
  photos,
  currentIndex,
  currentPhoto,
  showFullScreen,
  isPurchased,
  isFavorite,
  isFollowing,
  // promotions, // 未使用的变量已注释
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
} = useImageDetail()
</script>
