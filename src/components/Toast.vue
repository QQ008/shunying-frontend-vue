<!-- 吐司提示 -->
<template>
  <transition name="tfade">
    <div v-show="visible" class="t-Tips">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 组件名应该是多词，这里使用ToastMessage
defineOptions({
  name: 'ToastMessage'
});

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2000 // 默认2秒后自动关闭
  }
});

const visible = ref(false);
let timer: number | null = null;

// 显示Toast
const show = (msg?: string) => {
  // 清除之前的定时器
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  // 设置消息内容
  if (msg) {
    message.value = msg;
  }

  // 显示弹窗
  visible.value = true;

  // 设置自动关闭
  timer = window.setTimeout(() => {
    hide();
  }, props.duration);
};

// 隐藏Toast
const hide = () => {
  visible.value = false;
};

// 在组件销毁时清除定时器
const clear = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

// 将当前消息值转为响应式，以便外部能修改
const message = ref(props.message);

// 暴露方法给父组件
defineExpose({
  show,
  hide,
  clear
});
</script>

<style scoped>
.tfade-enter-active, .tfade-leave-active {
  transition: opacity 0.3s;
}
.tfade-enter-from, .tfade-leave-to {
  opacity: 0;
}

.t-Tips {
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffffdd;
  min-height: 40px;
  border-radius: 6px;
  font-size: 15px;
  position: fixed;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 18px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999999;

  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap; /* 阻止文本自动换行 */
  max-width: 80vw; /* 最大宽度为视窗宽度的80% */
}

@media (max-width: 768px) {
  .t-Tips {
    font-size: 14px;
    padding: 0 15px;
  }
}
</style>
