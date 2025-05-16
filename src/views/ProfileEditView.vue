<template>
  <div class="profile-edit-view">
    <!-- 顶部导航栏 -->
    <div class="profile-edit-header">
      <div class="profile-edit-back-button" @click="router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333333"/>
        </svg>
      </div>
      <h1 class="profile-edit-page-title">编辑资料</h1>
      <div class="profile-edit-save-button" @click="saveUserProfile">
        保存
      </div>
    </div>

    <!-- 头像编辑区域 -->
    <div class="profile-edit-avatar-container">
      <div class="profile-edit-avatar-wrapper">
        <img :src="userForm.avatar" alt="用户头像" class="profile-edit-avatar">
        <div class="profile-edit-avatar-overlay" @click="openAvatarSelector">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>
      <p class="profile-edit-avatar-hint">点击更换头像</p>

      <!-- 头像选择器 (隐藏) -->
      <input
        type="file"
        ref="avatarInput"
        class="profile-edit-avatar-input"
        accept="image/*"
        @change="handleAvatarChange"
      >
    </div>

    <!-- 表单区域 -->
    <div class="profile-edit-form">
      <div class="profile-edit-form-group">
        <div class="profile-edit-form-item">
          <div class="profile-edit-form-label">昵称</div>
          <div class="profile-edit-form-input-container">
            <input
              type="text"
              v-model="userForm.nickname"
              class="profile-edit-form-input"
              placeholder="请输入昵称"
              maxlength="20"
            >
            <div class="profile-edit-form-character-count">{{ userForm.nickname.length }}/20</div>
          </div>
        </div>

        <div class="profile-edit-form-item">
          <div class="profile-edit-form-label">性别</div>
          <div class="profile-edit-form-input-container" @click="showGenderSelector = true">
            <div class="profile-edit-form-value">{{ getGenderText(userForm.gender) }}</div>
            <div class="profile-edit-form-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="profile-edit-form-item">
          <div class="profile-edit-form-label">生日</div>
          <div class="profile-edit-form-input-container" @click="showDatePicker = true">
            <div class="profile-edit-form-value">{{ formatBirthday(userForm.birthday) }}</div>
            <div class="profile-edit-form-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="profile-edit-form-item">
          <div class="profile-edit-form-label">地区</div>
          <div class="profile-edit-form-input-container" @click="showRegionSelector = true">
            <div class="profile-edit-form-value">{{ formatRegion(userForm.region) }}</div>
            <div class="profile-edit-form-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-edit-form-group">
        <div class="profile-edit-form-item">
          <div class="profile-edit-form-label">手机号</div>
          <div class="profile-edit-form-value phone-number">{{ formatPhoneNumber(userForm.phone) }}</div>
        </div>
      </div>

      <div class="profile-edit-form-group">
        <div class="profile-edit-form-item signature-item">
          <div class="profile-edit-form-label">个性签名</div>
          <div class="profile-edit-form-input-container">
            <textarea
              v-model="userForm.signature"
              class="profile-edit-form-textarea"
              placeholder="填写个性签名展示更多的自我..."
              maxlength="100"
              rows="3"
            ></textarea>
            <div class="profile-edit-form-character-count">{{ userForm.signature.length }}/100</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 性别选择器弹窗 -->
    <div class="profile-edit-modal" v-if="showGenderSelector" @click.self="showGenderSelector = false">
      <div class="profile-edit-selector">
        <div class="profile-edit-selector-header">
          <h3>选择性别</h3>
          <div class="profile-edit-close-button" @click="showGenderSelector = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
            </svg>
          </div>
        </div>
        <div class="profile-edit-selector-content">
          <div
            class="profile-edit-selector-option"
            :class="{ 'selected': userForm.gender === 'male' }"
            @click="selectGender('male')"
          >
            男
          </div>
          <div
            class="profile-edit-selector-option"
            :class="{ 'selected': userForm.gender === 'female' }"
            @click="selectGender('female')"
          >
            女
          </div>
          <div
            class="profile-edit-selector-option"
            :class="{ 'selected': userForm.gender === 'private' }"
            @click="selectGender('private')"
          >
            不愿透露/其他
          </div>
        </div>
      </div>
    </div>

    <!-- 日期选择器弹窗 -->
    <div class="profile-edit-modal" v-if="showDatePicker" @click.self="showDatePicker = false">
      <div class="profile-edit-selector">
        <div class="profile-edit-selector-header">
          <h3>选择生日</h3>
          <div class="profile-edit-close-button" @click="showDatePicker = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
            </svg>
          </div>
        </div>
        <div class="profile-edit-date-picker">
          <div class="profile-edit-date-select-container">
            <select v-model="dateForm.year" class="profile-edit-date-select">
              <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
            </select>
            <select v-model="dateForm.month" class="profile-edit-date-select">
              <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
            </select>
            <select v-model="dateForm.day" class="profile-edit-date-select">
              <option v-for="day in getDaysInMonth(dateForm.year, dateForm.month)" :key="day" :value="day">{{ day }}日</option>
            </select>
          </div>
          <div class="profile-edit-date-action">
            <button class="profile-edit-date-cancel" @click="showDatePicker = false">取消</button>
            <button class="profile-edit-date-confirm" @click="confirmDate">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 地区选择器弹窗 -->
    <div class="profile-edit-modal" v-if="showRegionSelector" @click.self="showRegionSelector = false">
      <div class="profile-edit-selector">
        <div class="profile-edit-selector-header">
          <h3>选择地区</h3>
          <div class="profile-edit-close-button" @click="showRegionSelector = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#333333"/>
            </svg>
          </div>
        </div>
        <div class="profile-edit-region-selector">
          <div class="profile-edit-region-tabs">
            <div
              class="profile-edit-region-tab"
              :class="{ 'active': regionTabActive === 'province' }"
              @click="regionTabActive = 'province'"
            >
              {{ regionForm.province || '选择省份' }}
            </div>
            <div
              class="profile-edit-region-tab"
              :class="{ 'active': regionTabActive === 'city', 'disabled': !regionForm.province }"
              @click="regionForm.province && (regionTabActive = 'city')"
            >
              {{ regionForm.city || '选择城市' }}
            </div>
          </div>
          <div class="profile-edit-region-content">
            <div v-if="regionTabActive === 'province'" class="profile-edit-region-list">
              <div
                v-for="province in regions"
                :key="province.code"
                class="profile-edit-region-item"
                :class="{ 'selected': regionForm.province === province.name }"
                @click="selectProvince(province)"
              >
                {{ province.name }}
              </div>
            </div>
            <div v-else-if="regionTabActive === 'city'" class="profile-edit-region-list">
              <div
                v-for="city in currentCities"
                :key="city.code"
                class="profile-edit-region-item"
                :class="{ 'selected': regionForm.city === city.name }"
                @click="selectCity(city)"
              >
                {{ city.name }}
              </div>
            </div>
          </div>
          <div class="profile-edit-region-actions">
            <button class="profile-edit-region-cancel" @click="showRegionSelector = false">取消</button>
            <button class="profile-edit-region-confirm" @click="confirmRegion">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast提示 -->
    <div v-if="showToast" class="profile-edit-toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import chinaRegions from '@/data/chinaRegions';
import type { Province, City } from '@/data/chinaRegions';

const router = useRouter();
const auth = useAuth();
const toast = useToast();

// 头像上传引用
const avatarInput = ref<HTMLInputElement | null>(null);

// 表单数据
const userForm = reactive({
  nickname: '',
  gender: '', // male, female, private
  birthday: '', // ISO格式：YYYY-MM-DD
  region: { province: '', city: '' },
  phone: '',
  avatar: '',
  signature: ''
});

// 控制弹窗显示状态
const showGenderSelector = ref(false);
const showDatePicker = ref(false);
const showRegionSelector = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

// 日期选择器数据
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const dateForm = reactive({
  year: currentYear - 18,
  month: 1,
  day: 1
});

// 地区选择器数据
const regions = chinaRegions;
const regionTabActive = ref('province');
const regionForm = reactive({
  province: '',
  city: ''
});

// 获取当前选中省份的城市列表
const currentCities = computed(() => {
  const selectedProvince = regions.find(province => province.name === regionForm.province);
  return selectedProvince ? selectedProvince.cities : [];
});

// 初始化表单数据
onMounted(() => {
  // 从当前用户信息中获取数据
  const userInfo = auth.userInfo;

  // 模拟从后端获取更完整的用户资料
  const mockUserData = {
    ...userInfo,
    gender: 'male',
    birthday: '1990-01-01',
    region: { province: '北京市', city: '北京市' },
    signature: '这是一个简短的个性签名，展示用户的特点和爱好。'
  };

  // 填充表单
  userForm.nickname = mockUserData.nickname || '';
  userForm.gender = mockUserData.gender || 'private';
  userForm.birthday = mockUserData.birthday || '';
  userForm.region = mockUserData.region || { province: '', city: '' };
  userForm.phone = userInfo.phone || '';
  userForm.avatar = userInfo.avatar || '/images/avatar-default.svg';
  userForm.signature = mockUserData.signature || '';

  // 初始化日期选择器
  if (userForm.birthday) {
    const [year, month, day] = userForm.birthday.split('-').map(Number);
    dateForm.year = year;
    dateForm.month = month;
    dateForm.day = day;
  }

  // 初始化地区选择器
  if (userForm.region.province) {
    regionForm.province = userForm.region.province;
    regionForm.city = userForm.region.city;
  }
});

// 获取性别文本
const getGenderText = (gender: string): string => {
  const genderMap: Record<string, string> = {
    'male': '男',
    'female': '女',
    'private': '不愿透露/其他'
  };
  return genderMap[gender] || '不愿透露/其他';
};

// 格式化生日
const formatBirthday = (birthday: string): string => {
  if (!birthday) return '请选择出生日期';
  const [year, month, day] = birthday.split('-');
  return `${year}年${month}月${day}日`;
};

// 格式化地区
const formatRegion = (region: { province: string, city: string }): string => {
  if (!region.province) return '请选择地区';
  if (!region.city) return region.province;
  return `${region.province} ${region.city}`;
};

// 格式化手机号
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '未绑定手机号';
  // 保持中间部分隐藏
  if (phone.includes('*')) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 选择性别
const selectGender = (gender: string) => {
  userForm.gender = gender;
  showGenderSelector.value = false;
};

// 获取每月天数
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

// 确认日期选择
const confirmDate = () => {
  // 格式化为 YYYY-MM-DD
  const formatMonth = dateForm.month.toString().padStart(2, '0');
  const formatDay = dateForm.day.toString().padStart(2, '0');
  userForm.birthday = `${dateForm.year}-${formatMonth}-${formatDay}`;
  showDatePicker.value = false;
};

// 选择省份
const selectProvince = (province: Province) => {
  regionForm.province = province.name;
  regionForm.city = '';
  regionTabActive.value = 'city';
};

// 选择城市
const selectCity = (city: City) => {
  regionForm.city = city.name;
};

// 确认地区选择
const confirmRegion = () => {
  userForm.region.province = regionForm.province;
  userForm.region.city = regionForm.city;
  showRegionSelector.value = false;
};

// 打开头像选择器
const openAvatarSelector = () => {
  avatarInput.value?.click();
};

// 处理头像变更
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // 检查文件类型和大小
    if (!file.type.match('image.*')) {
      showToastMessage('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToastMessage('图片大小不能超过5MB');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        userForm.avatar = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

// 显示提示信息
const showToastMessage = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// 保存用户资料
const saveUserProfile = () => {
  // 表单验证
  if (!userForm.nickname.trim()) {
    showToastMessage('昵称不能为空');
    return;
  }

  // 模拟保存到后端的过程
  toast.show('保存成功');

  // 返回上一页
  setTimeout(() => {
    router.back();
  }, 1500);
};
</script>

<style scoped>
/* 基础动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(153, 102, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(153, 102, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(153, 102, 255, 0); }
}

.profile-edit-view {
  min-height: 100vh;
  background-color: #f9f7fe;
  padding-bottom: 40px;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

/* 顶部导航 */
.profile-edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(153, 102, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.profile-edit-back-button {
  padding: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 50%;
}

.profile-edit-back-button:hover {
  background-color: #f5f0ff;
  transform: scale(1.05);
}

.profile-edit-back-button:active {
  transform: scale(0.95);
}

.profile-edit-page-title {
  font-size: 19px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  text-align: center;
  letter-spacing: 0.3px;
}

.profile-edit-save-button {
  padding: 8px 12px;
  font-size: 15px;
  font-weight: 500;
  color: #9966FF;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.profile-edit-save-button:hover {
  background-color: #f5f0ff;
}

.profile-edit-save-button:active {
  transform: scale(0.98);
}

/* 头像编辑区域 */
.profile-edit-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 0;
  background: linear-gradient(to bottom, #fff, #f8f6fe);
  margin-bottom: 15px;
  animation: slideDown 0.4s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.profile-edit-avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(153, 102, 255, 0.25);
  border: 3px solid #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-edit-avatar-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(153, 102, 255, 0.3);
}

.profile-edit-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.profile-edit-avatar-wrapper:hover .profile-edit-avatar {
  transform: scale(1.1);
}

.profile-edit-avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 34px;
  background: linear-gradient(to top, rgba(153, 102, 255, 0.9), rgba(153, 102, 255, 0.8));
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: height 0.2s ease, background 0.2s ease;
}

.profile-edit-avatar-wrapper:hover .profile-edit-avatar-overlay {
  height: 40px;
  background: linear-gradient(to top, rgba(153, 102, 255, 1), rgba(153, 102, 255, 0.9));
}

.profile-edit-avatar-input {
  display: none;
}

.profile-edit-avatar-hint {
  margin-top: 12px;
  font-size: 14px;
  color: #9966FF;
  opacity: 0.8;
  font-weight: 500;
}

/* 表单区域 */
.profile-edit-form {
  padding: 0 16px;
  animation: fadeIn 0.5s ease-out;
}

.profile-edit-form-group {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profile-edit-form-group:hover {
  box-shadow: 0 4px 15px rgba(153, 102, 255, 0.08);
}

.profile-edit-form-item {
  display: flex;
  padding: 18px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.8);
  transition: background-color 0.2s ease;
}

.profile-edit-form-item:hover {
  background-color: #fafafa;
}

.profile-edit-form-item:last-child {
  border-bottom: none;
}

.profile-edit-form-label {
  width: 85px;
  font-size: 15px;
  color: #333;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.profile-edit-form-input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.profile-edit-form-input {
  width: 100%;
  height: 24px;
  border: none;
  font-size: 15px;
  color: #333;
  padding: 0;
  background: transparent;
  transition: color 0.2s ease;
}

.profile-edit-form-input:focus {
  outline: none;
  color: #9966FF;
}

.profile-edit-form-value {
  flex: 1;
  font-size: 15px;
  color: #333;
  line-height: 24px;
}

.profile-edit-form-arrow {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.profile-edit-form-input-container:hover .profile-edit-form-arrow {
  transform: translateX(2px);
}

.profile-edit-form-textarea {
  width: 100%;
  border: none;
  font-size: 15px;
  color: #333;
  padding: 0;
  background: transparent;
  resize: none;
  line-height: 1.5;
  transition: border 0.3s ease;
}

.profile-edit-form-textarea:focus {
  outline: none;
  color: #9966FF;
}

.profile-edit-form-character-count {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 12px;
  color: #9966FF;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.phone-number {
  color: #666;
  font-family: monospace;
  letter-spacing: 0.5px;
}

.signature-item {
  align-items: flex-start;
}

/* 选择器弹窗样式 */
.profile-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: flex-end;
  z-index: 100;
  animation: fadeIn 0.25s ease forwards;
  backdrop-filter: blur(2px);
  transition: background-color 0.25s ease;
}

.profile-edit-modal[v-if="true"] {
  background-color: rgba(0, 0, 0, 0.5);
}

.profile-edit-selector {
  width: 100%;
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(100%);
  animation: slideUp 0.3s ease-out forwards;
}

.profile-edit-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to right, #fcfaff, #fff);
}

.profile-edit-selector-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.3px;
}

.profile-edit-close-button {
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.profile-edit-close-button:hover {
  background-color: #f5f0ff;
  transform: rotate(90deg);
}

.profile-edit-selector-content {
  padding: 8px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.profile-edit-selector-option {
  padding: 16px 20px;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease, padding-left 0.2s ease;
}

.profile-edit-selector-option:last-child {
  border-bottom: none;
}

.profile-edit-selector-option:hover {
  background-color: #f9f6ff;
  padding-left: 25px;
}

.profile-edit-selector-option.selected {
  color: #9966FF;
  font-weight: 500;
  background-color: #f5f0ff;
  position: relative;
}

.profile-edit-selector-option.selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #9966FF;
}

/* 日期选择器样式 */
.profile-edit-date-picker {
  padding: 20px;
}

.profile-edit-date-select-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  gap: 10px;
}

.profile-edit-date-select {
  flex: 1;
  height: 45px;
  padding: 0 12px;
  border: 1px solid #e8e0f7;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  appearance: none;
  background-color: #fcfaff;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%239966FF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 30px;
}

.profile-edit-date-select:focus {
  outline: none;
  border-color: #9966FF;
  box-shadow: 0 0 0 3px rgba(153, 102, 255, 0.1);
}

.profile-edit-date-action {
  display: flex;
  justify-content: flex-end;
}

.profile-edit-date-cancel,
.profile-edit-date-confirm {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.profile-edit-date-cancel {
  background-color: #f0f0f0;
  color: #666;
  margin-right: 12px;
}

.profile-edit-date-cancel:hover {
  background-color: #e5e5e5;
}

.profile-edit-date-confirm {
  background-color: #9966FF;
  color: #fff;
  box-shadow: 0 4px 10px rgba(153, 102, 255, 0.3);
}

.profile-edit-date-confirm:hover {
  background-color: #8a4dff;
  box-shadow: 0 4px 15px rgba(153, 102, 255, 0.4);
}

.profile-edit-date-cancel:active,
.profile-edit-date-confirm:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 地区选择器样式 */
.profile-edit-region-selector {
  display: flex;
  flex-direction: column;
  max-height: 60vh;
}

.profile-edit-region-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fcfaff;
}

.profile-edit-region-tab {
  flex: 1;
  padding: 16px 0;
  text-align: center;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.profile-edit-region-tab.active {
  color: #9966FF;
  font-weight: 500;
  background-color: #fff;
}

.profile-edit-region-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 3px;
  background-color: #9966FF;
  border-radius: 3px 3px 0 0;
  animation: fadeIn 0.2s ease;
}

.profile-edit-region-tab.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.profile-edit-region-content {
  flex: 1;
  overflow-y: auto;
}

.profile-edit-region-list {
  padding: 5px 16px;
  max-height: 40vh;
  overflow-y: auto;
}

.profile-edit-region-item {
  padding: 16px 8px;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: padding-left 0.2s ease, background-color 0.2s ease;
}

.profile-edit-region-item:last-child {
  border-bottom: none;
}

.profile-edit-region-item:hover {
  background-color: #f9f6ff;
  padding-left: 12px;
}

.profile-edit-region-item.selected {
  color: #9966FF;
  font-weight: 500;
  background-color: #f5f0ff;
  position: relative;
  padding-left: 16px;
}

.profile-edit-region-item.selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 50%;
  background-color: #9966FF;
  border-radius: 0 2px 2px 0;
}

.profile-edit-region-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fcfaff;
}

.profile-edit-region-cancel,
.profile-edit-region-confirm {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.profile-edit-region-cancel {
  background-color: #f0f0f0;
  color: #666;
  margin-right: 12px;
}

.profile-edit-region-cancel:hover {
  background-color: #e5e5e5;
}

.profile-edit-region-confirm {
  background-color: #9966FF;
  color: #fff;
  box-shadow: 0 4px 10px rgba(153, 102, 255, 0.3);
}

.profile-edit-region-confirm:hover {
  background-color: #8a4dff;
  box-shadow: 0 4px 15px rgba(153, 102, 255, 0.4);
}

.profile-edit-region-cancel:active,
.profile-edit-region-confirm:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Toast样式 */
@keyframes toastAnimation {
  0% { opacity: 0; transform: translate(-50%, -40%); }
  10% { opacity: 1; transform: translate(-50%, -50%); }
  90% { opacity: 1; transform: translate(-50%, -50%); }
  100% { opacity: 0; transform: translate(-50%, -60%); }
}

.profile-edit-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  z-index: 1000;
  animation: toastAnimation 2s ease-in-out forwards;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.3px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 360px) {
  .profile-edit-form-label {
    width: 75px;
    font-size: 14px;
  }

  .profile-edit-form-input,
  .profile-edit-form-value,
  .profile-edit-form-textarea {
    font-size: 14px;
  }

  .profile-edit-selector-option {
    padding: 14px 16px;
    font-size: 15px;
  }
}

/* 给一些元素添加淡入效果，错开时间形成层次感 */
.profile-edit-form-group:nth-child(1) { animation-delay: 0.05s; }
.profile-edit-form-group:nth-child(2) { animation-delay: 0.1s; }
.profile-edit-form-group:nth-child(3) { animation-delay: 0.15s; }
</style>
