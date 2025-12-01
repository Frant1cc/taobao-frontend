<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { CartItem } from '@/types/cart';

const router = useRouter();

// 模拟购物车数据
const cartItems = reactive<CartItem[]>([
  {
    id: '1',
    name: 'Apple iPhone 15 Pro 256GB 星光色',
    image: 'https://img.alicdn.com/imgextra/i1/1234567890/O1CN01abcdefghijklmnopq_!!0-item_pic.jpg',
    price: 7999,
    quantity: 1,
    checked: true,
    spec: '256GB · 星光色'
  },
  {
    id: '2',
    name: '华为Mate 60 Pro 512GB 曜石黑',
    image: 'https://img.alicdn.com/imgextra/i2/987654321/O1CN02zyxwvutsrqponml_!!0-item_pic.jpg',
    price: 6999,
    quantity: 1,
    checked: true,
    spec: '512GB · 曜石黑'
  }
]);

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

// 单个商品选择状态切换
const toggleItem = (item: CartItem) => {
  item.checked = !item.checked;
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
    .reduce((total, item) => total + item.price * item.quantity, 0);
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
    alert('请选择要结算的商品');
    return;
  }
  // 跳转到结算页面
  router.push('/checkout');
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
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <label class="checkbox-label">
          <input type="checkbox" v-model="item.checked">
          <span class="checkbox-custom"></span>
        </label>

        <div class="item-info">
          <img :src="item.image" alt="{{ item.name }}" class="item-image">
          <div class="item-details">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-spec" v-if="item.spec">{{ item.spec }}</p>
          </div>
        </div>

        <div class="item-price">￥{{ item.price.toFixed(2) }}</div>

        <div class="item-quantity">
          <button class="quantity-btn minus" @click="decreaseQuantity(item)">-</button>
          <input type="number" v-model.number="item.quantity" min="1" class="quantity-input">
          <button class="quantity-btn plus" @click="increaseQuantity(item)">+</button>
        </div>

        <div class="item-subtotal">￥{{ (item.price * item.quantity).toFixed(2) }}</div>
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
    padding-left: 120px; // 与商品图片宽度对齐

    span {
      flex: 1;
      text-align: center;
      &:first-child {
        text-align: left;
        flex: 2;
      }
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
    flex: 2;
    align-items: center;
  }

  .item-image {
    width: 100px;
    height: 100px;
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
    }

    .item-spec {
      font-size: 12px;
      color: #666666;
      margin: 0;
    }
  }

  .item-price {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #333333;
  }

  .item-quantity {
    flex: 1;
    display: flex;
    justify-content: center;

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
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #ff5021;
    font-weight: bold;
  }
}

.cart-footer {
  position: fixed;
  bottom: 60px; // 为底部导航栏留出空间
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 15px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;

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

  .checkout-btn {
    background-color: #ff5021;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 12px 40px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: 30px;
    
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