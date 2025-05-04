import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ImageInfo } from '@/api/image'; // 引入图片信息类型

// 定义购物车商品接口
export interface CartItem extends Pick<ImageInfo, 'id' | 'previewPath' > { // 只选取必要信息
  // id: number; // 从 ImageInfo 继承
  // previewPath: string; // 从 ImageInfo 继承
  name?: string; // 商品名称 (可选, 方便显示)
  price?: number; // 商品单价 (待添加)
  quantity: number; // 数量 (图片通常是 1)
  addedAt?: number; // 添加时间戳 (可选)
}

export const useCartStore = defineStore(
  'cart',
  () => {
    // State: 使用 Map 存储购物车商品，方便按 ID 查找和更新
    // Key: Image ID (number), Value: CartItem
    const items = ref<Map<number, CartItem>>(new Map());

    // Getters
    const itemCount = computed(() => {
      let count = 0;
      items.value.forEach(item => {
        count += item.quantity;
      });
      return count;
      // 或者如果每个图片只能加一次: return items.value.size;
    });

    const cartItemsArray = computed(() => Array.from(items.value.values()));

    // TODO: 计算总价 (依赖 price 字段)
    const totalPrice = computed(() => {
      let total = 0;
      items.value.forEach(item => {
        if (item.price) {
          total += item.price * item.quantity;
        }
      });
      return total.toFixed(2);
    });

    // Actions
    function addItem(itemToAdd: Omit<CartItem, 'quantity'> & { quantity?: number }) {
      const existingItem = items.value.get(itemToAdd.id);
      if (existingItem) {
        // 如果已存在，可以选择更新数量或提示已存在 (对于图片，通常不允许增加数量)
        console.warn(`Item ${itemToAdd.id} already in cart.`);
        // existingItem.quantity += (itemToAdd.quantity || 1);
      } else {
        items.value.set(itemToAdd.id, {
          ...itemToAdd,
          quantity: itemToAdd.quantity || 1, // 默认数量为 1
          addedAt: Date.now()
        });
      }
      console.log('Cart after adding item:', items.value);
    }

    function addItems(itemsToAdd: (Omit<CartItem, 'quantity'> & { quantity?: number })[]) {
        itemsToAdd.forEach(item => {
            const existingItem = items.value.get(item.id);
            if (!existingItem) { // 只添加不存在的商品
                items.value.set(item.id, {
                    ...item,
                    quantity: item.quantity || 1,
                    addedAt: Date.now()
                });
            }
        });
        console.log('Cart after adding items:', items.value);
    }

    function removeItem(itemId: number) {
      const deleted = items.value.delete(itemId);
      if (deleted) {
        console.log(`Removed item ${itemId} from cart.`);
      } else {
        console.warn(`Item ${itemId} not found in cart.`);
      }
    }

    function updateItemQuantity(itemId: number, quantity: number) {
        const item = items.value.get(itemId);
        if (item) {
            if (quantity <= 0) {
                removeItem(itemId);
            } else {
                item.quantity = quantity;
            }
        } else {
             console.warn(`Item ${itemId} not found, cannot update quantity.`);
        }
    }

    function clearCart() {
      items.value.clear();
      console.log('Cart cleared.');
    }

    return {
      items, // 直接暴露 Map 可能不推荐，看需求
      cartItemsArray, // 提供数组形式方便遍历
      itemCount,
      totalPrice,
      addItem,
      addItems,
      removeItem,
      updateItemQuantity,
      clearCart,
    };
  },
  {
    // 启用持久化
    persist: {
        // Map 不能直接序列化，需要自定义序列化/反序列化
        serializer: {
            serialize: (state) => JSON.stringify(Array.from(state.items.entries())),
            deserialize: (storedState) => {
                try {
                    const parsed = JSON.parse(storedState);
                    return { items: new Map(parsed) };
                } catch (e) {
                    console.error('Failed to deserialize cart state:', e);
                    return { items: new Map() }; // 出错时返回空 Map
                }
            },
        },
    },
  }
); 