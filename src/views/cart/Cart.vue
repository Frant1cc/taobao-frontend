<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCartCheckoutStore } from '@/stores/cartCheckout'
import { getCartList, deleteCartItem, batchUpdateCartQuantity } from '@/api/modules/cart'
import type { CartItem } from '@/types/cart'
import { IMAGE_BASE_URL } from '@/api/config';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const cartCheckoutStore = useCartCheckoutStore();

// 检查是否有重定向参数并显示相应提示
onMounted(() => {
  if (route.query.redirect === 'auth-required') {
    ElMessage.warning('请先登录后再访问该页面');
  }
});

// 购物车数据
const cartItems = reactive<CartItem[]>([]);

// 获取完整图片URL
const getFullImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  // 如果已经是完整URL，则直接返回
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // 添加基础URL前缀
  return IMAGE_BASE_URL + imagePath;
};

// 获取购物车列表
const fetchCartList = async () => {
  try {
    const response = await getCartList();
    console.log('购物车API响应:', response);
    
    // 处理不同格式的响应数据
    let cartData = [];
    
    // 如果response本身就是数组，直接使用
    if (Array.isArray(response)) {
      cartData = response;
    } 
    // 如果response有data字段且为数组，使用response.data
    else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
      cartData = (response as any).data;
    }

    // 其他情况尝试直接使用response（如果它是数组）
    else if (response && typeof response === 'object') {
      // 尝试查找可能包含购物车数据的字段
      const possibleFields = ['items', 'list', 'cartItems'];
      for (const field of possibleFields) {
        if (field in response && Array.isArray(response[field])) {
          cartData = response[field];
          break;
        }
      }
    }
    
    // 检查是否成功提取到购物车数据
    if (Array.isArray(cartData) && cartData.length > 0) {
      // 验证数据结构是否符合CartItem接口
      const isValidCartItem = (item: any): item is CartItem => {
        return (
          typeof item === 'object' &&
          'cartItemId' in item &&
          'skuId' in item &&
          'quantity' in item &&
          'sku' in item &&
          typeof item.sku === 'object' &&
          'skuId' in item.sku &&
          'skuName' in item.sku &&
          'price' in item.sku
        );
      };
      
      // 检查所有项目是否符合CartItem结构
      const allValid = cartData.every(isValidCartItem);
      
      if (allValid) {
        // 设置默认选中状态并赋值给cartItems
        const itemsWithChecked = cartData.map(item => ({
          ...item,
          checked: true // 默认选中
        }));
        cartItems.splice(0, cartItems.length, ...itemsWithChecked);
      } else {
        console.warn('购物车数据结构不符合预期:', cartData);
        ElMessage.warning('购物车数据结构异常');
      }
    } else {
      console.warn('购物车数据为空或格式不符合预期:', response);
      // 即使没有购物车数据，也要清空现有数据
      cartItems.splice(0, cartItems.length);
    }
  } catch (error) {
    console.error('获取购物车列表失败:', error);
    ElMessage.error('获取购物车数据失败，请稍后重试');
  }
};

// 页面加载时获取购物车数据
onMounted(() => {
  // 检查是否有重定向参数并显示相应提示
  if (route.query.redirect === 'auth-required') {
    ElMessage.warning('请先登录后再访问该页面');
  }
  
  // 获取购物车数据
  fetchCartList();
});

const allChecked = computed(() => {
  return cartItems.length > 0 && cartItems.every(item => item.checked);
});

// 全选/取消全选
const toggleAll = () => {
  const checked = !allChecked.value;
  cartItems.forEach(item => {
    item.checked = checked;
  });
};

// 增加商品数量
const increaseQuantity = (item: CartItem) => {
  item.quantity++;
};

// 减少商品数量
const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    item.quantity--;
  }
};

// 计算选中商品总价
const getTotalPrice = () => {
  return cartItems
    .filter(item => item.checked)
    .reduce((total, item) => total + item.sku.price * item.quantity, 0);
};

// 计算选中商品总数
const getTotalItems = () => {
  return cartItems
    .filter(item => item.checked)
    .reduce((total, item) => total + item.quantity, 0);
};

// 结算功能
const checkout = () => {
  const checkedItems = cartItems
    .filter(item => item.checked);
  if (checkedItems.length === 0) {
    ElMessage.warning('请选择要结算的商品');
    return;
  }
  
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再进行结算');
    // 跳转到登录页面
    router.push('/login');
    return;
  }
  
  // 构造选中商品的参数
  const selectedProducts = checkedItems.map(item => ({
    productId: item.sku.productId,
    skuId: item.sku.skuId,
    quantity: item.quantity,
    price: item.sku.price,
    productname: item.sku.productName,
    skuname: item.sku.skuName
  }));
  
  // 使用store存储选中商品信息
  cartCheckoutStore.setSelectedProducts(selectedProducts);
  
  // 跳转到结算页面，不再携带URL参数
  router.push('/checkout');
};

// 删除购物车商品
const deleteItem = (item: CartItem) => {
  ElMessageBox.confirm(
    `确定要删除商品 "${item.sku.skuName}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      // 调用删除接口
      await deleteCartItem(item.cartItemId);
      
      // 从本地购物车列表中移除
      const index = cartItems.findIndex(cartItem => cartItem.cartItemId === item.cartItemId);
      if (index > -1) {
        cartItems.splice(index, 1);
      }
      
      ElMessage.success('删除成功');
    } catch (error) {
      console.error('删除商品失败:', error);
      ElMessage.error('删除商品失败，请稍后重试');
    }
  }).catch(() => {
    // 用户取消删除
    ElMessage.info('已取消删除');
  });
};

// 保存修改功能
const saveChanges = async () => {
  try {
    // 准备批量更新的数据
    const updateItems = cartItems.map(item => ({
      cartItemId: item.cartItemId,
      quantity: item.quantity
    }));
    
    // 调用批量更新接口
    await batchUpdateCartQuantity({
      items: updateItems
    });
    
    ElMessage.success('修改已保存');
  } catch (error) {
    console.error('保存修改失败:', error);
    ElMessage.error('保存修改失败，请稍后重试');
  }
};
</script>

<template>
  <div class="cart-container">
    <!-- 页面标题 -->
    <div class="cart-header">
      <h1>购物车</h1>
      <span v-if="cartItems.length > 0">({{ cartItems.length }}件商品)</span>
    </div>

    <!-- 空购物车状态 -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-icon">
        <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,30 L30,30 L30,20 C30,14.48 34.48,10 40,10 L60,10 C65.52,10 70,14.48 70,20 L70,30 L80,30 L85,40 L25,40 Z" fill="#e0e0e0"/>
          <path d="M30,40 L70,40 L70,80 C70,85.52 65.52,90 60,90 L40,90 C34.48,90 30,85.52 30,80 Z" fill="#e0e0e0"/>
          <path d="M55,50 L45,60 M45,50 L55,60" stroke="#999" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="empty-text">您的购物车还是空的</p>
      <button class="go-shopping" @click="$router.push('/home')">去逛逛</button>
    </div>

    <!-- 购物车商品列表 -->
    <div v-else class="cart-items">
      <!-- 列表头部 -->
      <div class="cart-list-header">
        <label class="checkbox-label">
          <input type="checkbox" v-model="allChecked" @change="toggleAll">
          <span class="checkbox-custom"></span>
          <span class="checkbox-text">全选</span>
        </label>
        <div class="header-titles">
          <span>商品</span>
          <span>单价</span>
          <span>数量</span>
          <span>小计</span>
        </div>
      </div>

      <!-- 商品项 -->
      <div class="cart-item" v-for="item in cartItems" :key="item.cartItemId">
        <label class="checkbox-label">
          <input type="checkbox" v-model="item.checked">
          <span class="checkbox-custom"></span>
        </label>

        <div class="item-info">
          <img :src="getFullImageUrl(item.sku.skuImage)" :alt="item.sku.skuName" class="item-image">
          <div class="item-details">
            <h3 class="item-name">
              <router-link :to="'/product/' + item.sku.productId" class="product-link">
                {{ item.sku.productName }}
              </router-link>
            </h3>
            <p class="item-sku-name">{{ item.sku.skuName }}</p>
          </div>
        </div>

        <div class="item-price">￥{{ item.sku.price.toFixed(2) }}</div>

        <div class="item-quantity">
          <button class="quantity-btn minus" @click="decreaseQuantity(item)">-</button>
          <input type="number" v-model.number="item.quantity" min="1" class="quantity-input">
          <button class="quantity-btn plus" @click="increaseQuantity(item)">+</button>
        </div>

        <div class="item-subtotal">￥{{ (item.sku.price * item.quantity).toFixed(2) }}</div>
        
        <button class="delete-btn" @click="deleteItem(item)">删除</button>
      </div>
    </div>

    <!-- 结算栏 -->
    <div v-if="cartItems.length > 0" class="cart-footer">
      <label class="checkbox-label footer-checkbox">
        <input type="checkbox" v-model="allChecked" @change="toggleAll">
        <span class="checkbox-custom"></span>
        <span class="checkbox-text">全选</span>
      </label>

      <div class="footer-summary">
        <div class="summary-text">
          已选 <span class="selected-count">{{ getTotalItems() }}</span> 件商品
        </div>
        <div class="price-summary">
          <span class="price-label">合计:</span>
          <span class="total-price">￥{{ getTotalPrice().toFixed(2) }}</span>
        </div>
        <button class="save-btn" @click="saveChanges">
          保存修改
        </button>
        <button class="checkout-btn" @click="checkout">
          结算
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px; // 为底部结算栏留出空间
}

.cart-header {
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;

  h1 {
    font-size: 20px;
    color: #333333;
    margin: 0;
  }
}

.empty-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 60px 0;

  .empty-icon {
    margin-bottom: 20px;
  }

  .empty-text {
    font-size: 16px;
    color: #666666;
    margin-bottom: 30px;
  }

  .go-shopping {
    background-color: #ff5021;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 12px 30px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #e6450d;
    }
  }
}

.cart-list-header {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
  font-weight: bold;

  .checkbox-label {
    margin-right: 20px;
  }

  .header-titles {
    display: flex;
    justify-content: space-between;
    flex: 1;
    padding-left: 95px; // 与商品图片宽度对齐 (80px图片宽度 + 15px右边距)

    span {
      flex: 1;
      text-align: left;
      padding-left: 10px;
      &:first-child {
        text-align: left;
        flex: 1;
      }
    }
    
    // 为删除按钮预留空间
    span:last-child {
      flex: 0.5;
    }
  }
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;

  .checkbox-label {
    margin-right: 20px;
  }

  .item-info {
    display: flex;
    flex: 1.5;
    align-items: center;
  }

  .item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 15px;
  }

  .item-details {
    flex: 1;

    .item-name {
      font-size: 14px;
      color: #333333;
      margin: 0 0 5px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-height: 40px;
      
      .product-link {
        color: #333333;
        text-decoration: none;
        
        &:hover {
          color: #ff5021;
          text-decoration: underline;
        }
      }
    }

    .item-sku-name {
      font-size: 13px;
      color: #444444;
      margin: 3px 0;
      font-weight: 500;
    }
  }

  .item-price {
    flex: 0.8;
    text-align: left;
    padding-left: 10px;
    font-size: 14px;
    color: #333333;
  }

  .item-quantity {
    flex: 0.8;
    display: flex;
    justify-content: flex-start;
    padding-left: 10px;

    .quantity-btn {
      width: 30px;
      height: 30px;
      border: 1px solid #e0e0e0;
      background-color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-input {
      width: 50px;
      height: 30px;
      text-align: center;
      border: 1px solid #e0e0e0;
      border-left: none;
      border-right: none;
      outline: none;
    }
  }

  .item-subtotal {
    flex: 0.8;
    text-align: left;
    padding-left: 10px;
    font-size: 14px;
    color: #ff5021;
    font-weight: bold;
  }
  
  .delete-btn {
    width: 60px;
    height: 30px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #666666;
    cursor: pointer;
    margin-left: 10px;
    transition: all 0.3s;
    
    &:hover {
      background-color: #ff5021;
      color: #ffffff;
      border-color: #ff5021;
    }
  }
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 15px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 1000; // 确保在最上层
  min-height: 60px; // 设置最小高度

  .footer-checkbox {
    margin-right: 20px;
  }

  .footer-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }

  .summary-text {
    font-size: 14px;
    color: #666666;

    .selected-count {
      color: #ff5021;
      font-weight: bold;
    }
  }

  .price-summary {
    margin-left: 20px;

    .price-label {
      font-size: 14px;
      color: #666666;
      margin-right: 10px;
    }

    .total-price {
      font-size: 18px;
      color: #ff5021;
      font-weight: bold;
    }
  }

  .save-btn {
    background-color: #4CAF50;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 12px 40px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
    
    &:hover {
      background-color: #45a049;
    }
  }

  .checkout-btn {
    background-color: #ff5021;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 12px 40px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 10px;
    
    &:hover {
      background-color: #e6450d;
    }
  }
}

// 复选框样式
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative; // 添加相对定位

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 20px;
    height: 20px;
    margin: 0;
    cursor: pointer;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .checkbox-custom {
    width: 20px;
    height: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    display: inline-block;
    position: relative;
    margin-right: 8px;

    &::after {
      content: "✓";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ffffff;
      font-size: 14px;
      display: none;
    }
  }

  input[type="checkbox"]:checked + .checkbox-custom {
    background-color: #ff5021;
    border-color: #ff5021;

    &::after {
      display: block;
    }
  }

  .checkbox-text {
    font-size: 14px;
    color: #333333;
  }
}
</style>