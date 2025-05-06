// [消息中心]通知中心
import { ref, computed, watchEffect } from 'vue';
import { parseISO, isToday, isThisWeek, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface Notification {
  id: number;
  type: 'system' | 'order' | 'activity';
  title: string;
  content: string;
  time: string; // ISO 格式日期字符串
  isRead: boolean;
  isImportant: boolean;
}

// 使用单例模式确保所有组件共享同一份通知数据
const notifications = ref<Notification[]>([]);
const isInitialized = ref(false);

// 本地存储键名
const STORAGE_KEY = 'notifications_data';

// 初始化通知数据
const initNotifications = () => {
  if (isInitialized.value) return;

  try {
    // 尝试从localStorage读取通知数据
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      // 合并已存储的已读状态与默认数据
      const parsedData = JSON.parse(storedData);
      // 使用默认通知数据，但应用已存储的已读状态
      getDefaultNotifications().forEach(notification => {
        const storedNotification = parsedData.find((n: Notification) => n.id === notification.id);
        if (storedNotification) {
          notification.isRead = storedNotification.isRead;
        }
      });
    }
  } catch (error) {
    console.error('读取通知数据失败', error);
  }

  // 如果没有存储的数据或发生错误，使用默认数据
  if (notifications.value.length === 0) {
    notifications.value = getDefaultNotifications();
  }

  isInitialized.value = true;
};

// 获取默认通知数据
const getDefaultNotifications = (): Notification[] => {
  return [
    {
      id: 1,
      type: 'system',
      title: '系统升级通知',
      content: '亲爱的用户，瞬影将于今晚22:00-23:00进行系统升级，升级期间部分功能可能暂时无法使用，请您谅解。',
      time: new Date().toISOString(),
      isRead: false,
      isImportant: true
    },
    {
      id: 2,
      type: 'order',
      title: '订单状态更新',
      content: '您的订单 #23456 已成功支付，摄影师将在预约时间与您见面。',
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3小时前
      isRead: true,
      isImportant: false
    },
    {
      id: 3,
      type: 'activity',
      title: '限时活动：初夏特惠',
      content: '初夏特惠活动开始啦！即日起至6月30日，预约指定摄影师拍摄可享受8折优惠。',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
      isRead: false,
      isImportant: true
    },
    {
      id: 4,
      type: 'system',
      title: '账号安全提醒',
      content: '我们检测到您的账号在新设备上登录，请确认是您本人操作。如非本人操作，请立即修改密码。',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
      isRead: true,
      isImportant: true
    },
    {
      id: 5,
      type: 'order',
      title: '摄影作品已上传',
      content: '您好，摄影师已上传您的照片，请前往"我的照片"查看并下载。',
      time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
      isRead: false,
      isImportant: false
    },
    {
      id: 6,
      type: 'activity',
      title: '新功能上线',
      content: '瞬影特效滤镜功能现已上线，提供多种专业级滤镜，让您的照片更具艺术感。',
      time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
      isRead: true,
      isImportant: false
    },
    {
      id: 7,
      type: 'system',
      title: '隐私政策更新',
      content: '我们的隐私政策已更新，请前往设置-关于瞬影-隐私政策查看最新内容。',
      time: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15天前
      isRead: true,
      isImportant: false
    }
  ];
};

// 将通知数据保存到本地存储
const saveNotificationsToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value));
  } catch (error) {
    console.error('保存通知数据失败', error);
  }
};

export function useNotifications() {
  // 确保初始化只执行一次
  if (!isInitialized.value) {
    initNotifications();

    // 监听通知状态变化，自动保存到本地存储
    watchEffect(() => {
      if (isInitialized.value && notifications.value.length > 0) {
        saveNotificationsToStorage();
      }
    });
  }

  // 获取未读通知总数
  const unreadCount = computed(() => {
    return notifications.value.filter(notification => !notification.isRead).length;
  });

  // 获取未读重要通知数量
  const unreadImportantCount = computed(() => {
    return notifications.value.filter(notification => !notification.isRead && notification.isImportant).length;
  });

  // 是否有未读通知
  const hasUnread = computed(() => unreadCount.value > 0);

  // 是否有未读重要通知
  const hasUnreadImportant = computed(() => unreadImportantCount.value > 0);

  // 按类型获取未读通知数
  const getUnreadCountByType = (type: 'system' | 'order' | 'activity' | 'all') => {
    if (type === 'all') {
      return unreadCount.value;
    } else {
      return notifications.value.filter(
        notification => !notification.isRead && notification.type === type
      ).length;
    }
  };

  // 格式化时间
  const formatNotificationTime = (timeString: string) => {
    const date = parseISO(timeString);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: zhCN });
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE', { locale: zhCN });
    } else {
      return format(date, 'MM月dd日', { locale: zhCN });
    }
  };

  // 将通知标记为已读
  const markAsRead = (id: number) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification && !notification.isRead) {
      notification.isRead = true;

      // 保存到本地存储
      saveNotificationsToStorage();

      // 这里应该调用后端API更新通知状态
      // 示例: api.updateNotification(id, { isRead: true });
      console.log(`将通知 #${id} 标记为已读，向后端发送更新`, notification);
    }
  };

  // 将所有通知标记为已读
  const markAllAsRead = (type?: 'system' | 'order' | 'activity') => {
    const updatedIds: number[] = [];

    if (type) {
      notifications.value.forEach(notification => {
        if (notification.type === type && !notification.isRead) {
          notification.isRead = true;
          updatedIds.push(notification.id);
        }
      });
    } else {
      notifications.value.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          updatedIds.push(notification.id);
        }
      });
    }

    if (updatedIds.length > 0) {
      // 保存到本地存储
      saveNotificationsToStorage();

      // 这里应该调用后端API批量更新通知状态
      // 示例: if (updatedIds.length > 0) api.markNotificationsAsRead(updatedIds);
    }
  };

  // 获取通知列表，可按类型过滤
  const getNotifications = (type?: 'system' | 'order' | 'activity') => {
    if (type) {
      return notifications.value.filter(notification => notification.type === type);
    } else {
      return notifications.value;
    }
  };

  // 获取通知详情
  const getNotificationById = (id: number) => {
    return notifications.value.find(n => n.id === id);
  };

  return {
    notifications,
    unreadCount,
    unreadImportantCount,
    hasUnread,
    hasUnreadImportant,
    getUnreadCountByType,
    formatNotificationTime,
    markAsRead,
    markAllAsRead,
    getNotifications,
    getNotificationById,
    initNotifications
  };
}
