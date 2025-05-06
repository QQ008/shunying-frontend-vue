// 聊天消息管理
import { ref, computed, watchEffect } from 'vue';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 导出 Conversation 接口以便其他组件可以使用
export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

// 使用单例模式确保所有组件共享同一份消息数据
const conversations = ref<Conversation[]>([]);
const isInitialized = ref(false);

// 本地存储键名
const STORAGE_KEY = 'messages_data';

// 初始化消息数据
const initMessages = () => {
  if (isInitialized.value) return;

  try {
    // 尝试从localStorage读取消息数据
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      conversations.value = JSON.parse(storedData);
    } else {
      // 如果没有存储的数据，使用默认数据
      conversations.value = getDefaultConversations();
    }
  } catch (error) {
    console.error('读取消息数据失败', error);
    conversations.value = getDefaultConversations();
  }

  isInitialized.value = true;
};

// 获取默认消息数据
const getDefaultConversations = (): Conversation[] => {
  return [
    {
      id: 1,
      name: '客服小瞬',
      avatar: 'https://via.placeholder.com/48/9966FF/FFFFFF/?text=小瞬',
      lastMessage: '您好，有什么可以帮助您的吗？',
      lastTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unreadCount: 1
    },
    {
      id: 2,
      name: '张摄影师',
      avatar: 'https://via.placeholder.com/48/FF6600/FFFFFF/?text=张',
      lastMessage: '您的照片已经修好了，请查收',
      lastTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0
    }
  ];
};

// 将消息数据保存到本地存储
const saveMessagesToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.value));
  } catch (error) {
    console.error('保存消息数据失败', error);
  }
};

export function useMessages() {
  // 确保初始化只执行一次
  if (!isInitialized.value) {
    initMessages();

    // 监听消息状态变化，自动保存到本地存储
    watchEffect(() => {
      if (isInitialized.value && conversations.value.length > 0) {
        saveMessagesToStorage();
      }
    });
  }

  // 计算未读消息总数
  const unreadCount = computed(() => {
    return conversations.value.reduce((total, chat) => total + chat.unreadCount, 0);
  });

  // 是否有未读消息
  const hasUnread = computed(() => unreadCount.value > 0);

  // 格式化聊天时间
  const formatChatTime = (timeString: string) => {
    const date = new Date(timeString);
    return formatDistance(date, new Date(), { addSuffix: false, locale: zhCN });
  };

  // 获取单个对话
  const getConversation = (id: number) => {
    return conversations.value.find(chat => chat.id === id);
  };

  // 将对话标记为已读
  const markConversationAsRead = (id: number) => {
    const conversation = conversations.value.find(chat => chat.id === id);
    if (conversation && conversation.unreadCount > 0) {
      conversation.unreadCount = 0;

      // 保存到本地存储
      saveMessagesToStorage();

      // 这里应该调用后端API更新已读状态
      // 示例: api.markConversationAsRead(id);
      console.log(`将对话 #${id} 标记为已读，向后端发送更新`, conversation);
    }
  };

  // 将所有对话标记为已读
  const markAllConversationsAsRead = () => {
    let updated = false;
    conversations.value.forEach(chat => {
      if (chat.unreadCount > 0) {
        chat.unreadCount = 0;
        updated = true;
      }
    });

    if (updated) {
      // 保存到本地存储
      saveMessagesToStorage();

      // 这里应该调用后端API批量更新已读状态
      // 示例: api.markAllConversationsAsRead();
    }
  };

  // 添加新消息到对话
  const addMessage = (conversationId: number, message: string, isIncoming: boolean) => {
    const conversation = conversations.value.find(chat => chat.id === conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.lastTime = new Date().toISOString();

      // 如果是收到的消息，增加未读数量
      if (isIncoming) {
        conversation.unreadCount += 1;
      }

      // 保存到本地存储
      saveMessagesToStorage();
    }
  };

  return {
    conversations,
    unreadCount,
    hasUnread,
    formatChatTime,
    getConversation,
    markConversationAsRead,
    markAllConversationsAsRead,
    addMessage
  };
}
