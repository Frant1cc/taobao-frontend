<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AddressEditor from '@/components/AddressEditor.vue';

// 地址相关类型定义
interface Address {
  address_id: number
  user_id: number
  full_address: string
  recipient_name: string
  phone: string
  is_default: boolean
  create_time: string
  update_time: string
}

// 地址表单数据类型定义
interface AddressFormData {
  full_address: string
  recipient_name: string
  phone: string
  is_default: boolean
}

// 订单商品类型定义
interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  spec?: string;
}

const router = useRouter();

// 模拟订单数据（实际项目中应从购物车传递）
const orderItems = ref<OrderItem[]>([
  {
    id: '1',
    name: 'Apple iPhone 15 Pro 256GB 星光色',
    image: 'https://img.alicdn.com/imgextra/i1/1234567890/O1CN01abcdefghijklmnopq_!!0-item_pic.jpg',
    price: 7999,
    quantity: 1,
    spec: '256GB · 星光色'
  },
  {
    id: '2',
    name: '华为Mate 60 Pro 512GB 曜石黑',
    image: 'https://img.alicdn.com/imgextra/i2/987654321/O1CN02zyxwvutsrqponml_!!0-item_pic.jpg',
    price: 6999,
    quantity: 1,
    spec: '512GB · 曜石黑'
  }
]);

// 收货地址列表
const addresses = ref<Address[]>([
  {
    address_id: 1,
    user_id: 1001,
    full_address: '北京市朝阳区建国门外大街1号国贸大厦A座1001室',
    recipient_name: '张三',
    phone: '13800138000',
    is_default: true,
    create_time: '2024-01-15 10:30:00',
    update_time: '2024-01-15 10:30:00'
  },
  {
    address_id: 2,
    user_id: 1001,
    full_address: '上海市浦东新区陆家嘴环路1000号金茂大厦',
    recipient_name: '李四',
    phone: '13900139000',
    is_default: false,
    create_time: '2024-01-20 14:20:00',
    update_time: '2024-01-20 14:20:00'
  }
]);

// 选中的地址
const selectedAddress = ref<Address | undefined>(addresses.value[0]);

// 地址编辑相关状态
const showAddressEditor = ref(false);
const editingAddress = ref<Address | undefined>(undefined);

// 支付方式
const paymentMethod = ref('alipay');

// 优惠券
// const coupon = ref('');

// 运费
const shippingFee = computed(() => {
  return orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0) > 99 ? 0 : 10;
});

// 商品总价
const subtotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

// 订单总价
const totalPrice = computed(() => {
  return subtotal.value + shippingFee.value;
});

// 选择地址
const selectAddress = (address: Address) => {
  selectedAddress.value = address;
};

// 编辑地址
const editAddress = (address: Address) => {
  editingAddress.value = address;
  showAddressEditor.value = true;
};

// 添加地址
const addAddress = () => {
  editingAddress.value = undefined;
  showAddressEditor.value = true;
};

// 处理地址提交
const handleAddressSubmit = (formData: AddressFormData) => {
  if (editingAddress.value) {
    // 修改地址
    const index = addresses.value.findIndex((addr: Address) => addr.address_id === editingAddress.value!.address_id);
    if (index !== -1) {
      addresses.value[index] = {
        ...editingAddress.value,
        ...formData
      };
      
      // 如果修改的是当前选中的地址，更新选中地址
      if (selectedAddress.value && selectedAddress.value.address_id === editingAddress.value.address_id) {
        selectedAddress.value = addresses.value[index];
      }
    }
  } else {
    // 添加新地址
    const newAddress: Address = {
      address_id: Date.now(),
      user_id: 1001,
      ...formData,
      create_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      update_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    // 如果设置为默认地址，取消其他地址的默认状态
    if (formData.is_default) {
      addresses.value.forEach((addr: Address) => {
        addr.is_default = false;
      });
    }
    
    addresses.value.push(newAddress);
    
    // 如果是第一个地址，自动选中
    if (addresses.value.length === 1) {
      selectedAddress.value = newAddress;
    }
  }
  
  // 重置编辑状态
  editingAddress.value = undefined;
};

// 提交订单
const submitOrder = () => {
  // 模拟订单提交
  const orderData = {
    items: orderItems.value,
    address: selectedAddress.value,
    paymentMethod: paymentMethod.value,
    totalPrice: totalPrice.value,
    orderTime: new Date().toISOString()
  };
  
  console.log('提交订单:', orderData);
  
  // 实际项目中这里会调用API提交订单
  alert('订单提交成功！订单总金额：￥' + totalPrice.value.toFixed(2));
  
  // 跳转到订单完成页面
  router.push('/order/success');
};

// 返回购物车
const goBackToCart = () => {
  router.push('/cart');
};

onMounted(() => {
  // 实际项目中应从路由参数或状态管理获取购物车数据
  console.log('结算页面加载完成');
});
</script>

<template>
  <div class="checkout-container">
    <!-- 页面标题 -->
    <div class="checkout-header">
      <h1>确认订单</h1>
      <button class="back-btn" @click="goBackToCart">返回购物车</button>
    </div>

    <!-- 收货地址 -->
    <div class="address-section">
      <h2 class="section-title">收货地址</h2>
      <div class="address-list">
        <div 
          v-for="address in addresses" 
          :key="address.address_id"
          class="address-item"
:class="{ active: selectedAddress && selectedAddress.address_id === address.address_id }"
          @click="selectAddress(address)"
        >
          <div class="address-info">
            <div class="address-header">
              <span class="receiver">{{ address.recipient_name }}</span>
              <span class="phone">{{ address.phone }}</span>
              <span v-if="address.is_default" class="default-tag">默认</span>
            </div>
            <div class="address-detail">
              {{ address.full_address }}
            </div>
          </div>
          <div class="address-actions">
            <button class="edit-btn" @click="editAddress(address)">编辑</button>
          </div>
        </div>
        <div class="add-address" @click="addAddress">
          <span class="add-icon">+</span>
          <span>添加新地址</span>
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="products-section">
      <h2 class="section-title">商品信息</h2>
      <div class="products-list">
        <div v-for="item in orderItems" :key="item.id" class="product-item">
          <img :src="item.image" :alt="item.name" class="product-image">
          <div class="product-info">
            <h3 class="product-name">{{ item.name }}</h3>
            <p v-if="item.spec" class="product-spec">{{ item.spec }}</p>
          </div>
          <div class="product-price">
            <span class="price">￥{{ item.price.toFixed(2) }}</span>
            <span class="quantity">×{{ item.quantity }}</span>
          </div>
          <div class="product-subtotal">
            ￥{{ (item.price * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-section">
      <h2 class="section-title">支付方式</h2>
      <div class="payment-methods">
        <label class="payment-method">
          <input type="radio" v-model="paymentMethod" value="alipay">
          <span class="payment-icon">💰</span>
          <span>支付宝</span>
        </label>
        <label class="payment-method">
          <input type="radio" v-model="paymentMethod" value="wechat">
          <span class="payment-icon">💳</span>
          <span>微信支付</span>
        </label>
        <label class="payment-method">
          <input type="radio" v-model="paymentMethod" value="bank">
          <span class="payment-icon">🏦</span>
          <span>银行卡</span>
        </label>
      </div>
    </div>

    <!-- 订单汇总 -->
    <div class="summary-section">
      <h2 class="section-title">订单汇总</h2>
      <div class="summary-details">
        <div class="summary-row">
          <span>商品总价：</span>
          <span>￥{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>运费：</span>
          <span>{{ shippingFee > 0 ? '￥' + shippingFee.toFixed(2) : '免运费' }}</span>
        </div>
        <div class="summary-row total">
          <span>订单总价：</span>
          <span class="total-price">￥{{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 提交订单栏 -->
    <div class="checkout-footer">
      <div class="footer-summary">
        <div class="price-summary">
          <span class="price-label">实付款：</span>
          <span class="total-price">￥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="submit-btn" @click="submitOrder">
          提交订单
        </button>
      </div>
    </div>

    <!-- 地址编辑弹窗 -->
    <div v-if="showAddressEditor" class="modal-overlay">
      <AddressEditor
        :address="editingAddress"
        :visible="showAddressEditor"
        @update:visible="showAddressEditor = $event"
        @submit="handleAddressSubmit"
        @cancel="editingAddress = undefined"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

.checkout-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px; // 为底部提交栏留出空间
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;

  h1 {
    font-size: 20px;
    color: #333333;
    margin: 0;
  }

  .back-btn {
    background: none;
    border: none;
    padding: 8px 16px;
    font-size: 12px;
    background-color: #ffffff;
    color: #666666;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.section-title {
  font-size: 18px;
  color: #333333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.address-section {
  margin-bottom: 30px;

  .address-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .address-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &.active {
      border-color: #ff5021;
      background-color: rgba(255, 80, 33, 0.05);
    }

    &:hover {
      border-color: #ff5021;
    }

    .address-info {
      flex: 1;

      .address-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 8px;

        .receiver {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
        }

        .phone {
          color: #666666;
        }

        .default-tag {
          background-color: #ff5021;
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }
      }

      .address-detail {
        color: #666666;
        line-height: 1.5;
      }
    }

    .address-actions {
      .edit-btn {
        background: none;
        border: 1px solid #e0e0e0;
        padding: 6px 12px;
        border-radius: 4px;
        color: #666666;
        cursor: pointer;

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }

  .add-address {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    color: #666666;
    transition: all 0.3s ease;

    &:hover {
      border-color: #ff5021;
      color: #ff5021;
    }

    .add-icon {
      font-size: 20px;
      margin-right: 8px;
    }
  }
}

.products-section {
  margin-bottom: 30px;

  .products-list {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .product-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }

    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 15px;
    }

    .product-info {
      flex: 1;

      .product-name {
        font-size: 14px;
        color: #333333;
        margin: 0 0 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        max-height: 40px;
      }

      .product-spec {
        font-size: 12px;
        color: #666666;
        margin: 0;
      }
    }

    .product-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-right: 20px;

      .price {
        font-size: 14px;
        color: #333333;
      }

      .quantity {
        font-size: 12px;
        color: #666666;
      }
    }

    .product-subtotal {
      font-size: 16px;
      color: #ff5021;
      font-weight: bold;
      min-width: 80px;
      text-align: right;
    }
  }
}

.payment-section {
  margin-bottom: 30px;

  .payment-methods {
    display: flex;
    gap: 20px;

    .payment-method {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

      input[type="radio"] {
        margin-right: 10px;
      }

      .payment-icon {
        margin-right: 8px;
        font-size: 18px;
      }

      &:hover {
        border-color: #ff5021;
      }

      input[type="radio"]:checked + .payment-icon {
        color: #ff5021;
      }
    }
  }
}

.summary-section {
  margin-bottom: 30px;

  .summary-details {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      color: #666666;

      &.total {
        border-top: 1px solid #e0e0e0;
        margin-top: 10px;
        padding-top: 15px;
        font-size: 16px;
        color: #333333;

        .total-price {
          color: #ff5021;
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
  }
}

.checkout-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 15px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;

  .footer-summary {
    display: flex;
    align-items: center;
    gap: 30px;

    .price-summary {
      .price-label {
        font-size: 14px;
        color: #666666;
        margin-right: 10px;
      }

      .total-price {
        font-size: 20px;
        color: #ff5021;
        font-weight: bold;
      }
    }

    .submit-btn {
      background: #ff5021;
      color: white;
      border: none;
      padding: 15px 50px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e6450d;
      }
    }
  }
}

@media (max-width: 768px) {
  .checkout-container {
    padding: 10px;
  }

  .payment-methods {
    flex-direction: column;
  }

  .checkout-footer {
    .footer-summary {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
}
</style>