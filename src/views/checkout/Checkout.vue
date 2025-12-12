<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import AddressEditor, { type AddressFormData } from '@/components/AddressEditor.vue';
import { getAddressList, updateAddress, deleteAddress, setDefaultAddress } from '@/api/modules/address';
import { createOrder, updateOrderStatus } from '@/api/modules/order';
import { useCartCheckoutStore } from '@/stores/cartCheckout';
import type { Address, UpdateAddressRequest } from '@/types/address'

// 结算商品类型定义
interface CheckoutItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  spec?: string;
  productId: number;
  skuId: number;
}

const router = useRouter();
const cartCheckoutStore = useCartCheckoutStore();

// 订单商品数据（从购物车传递过来）
const orderItems = ref<CheckoutItem[]>([]);

// 初始化订单商品数据
const initOrderItems = () => {
  // 从store获取购物车选中的商品数据
  const products = cartCheckoutStore.getSelectedProducts;
  if (products && products.length > 0) {
    // 转换商品数据格式
      orderItems.value = products.map((product: any) => ({
        id: product.skuId.toString(),
        name: product.productname,
        image: product.image || 'https://img.alicdn.com/imgextra/i1/1234567890/O1CN01abcdefghijklmnopq_!!0-item_pic.jpg', // 使用传递的图片，如果没有则使用默认图片
        price: product.price,
        quantity: product.quantity,
        spec: product.skuname,
        productId: product.productId,
        skuId: product.skuId
      }));
  } 
};

// 收货地址列表
const addresses = ref<Address[]>([]);

// 选中的地址
const selectedAddress = ref<Address | undefined>(undefined);

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



// 处理地址提交
const handleAddressSubmit = async (formData: AddressFormData) => {
  try {
    if (editingAddress.value) {
      // 修改地址
      const updateData: UpdateAddressRequest = {
        addressId: editingAddress.value.addressId,
        fullAddress: formData.fullAddress,
        recipientName: formData.recipientName,
        phone: formData.phone,
        isDefault: formData.isDefault
      };
      
      const response = await updateAddress(updateData);
      if (response.code === 200) {
        ElMessage.success('地址修改成功');
        await fetchAddresses(); // 重新加载地址列表
      } else {
        ElMessage.error(response.msg || '地址修改失败');
      }
    }
  } catch (error) {
    console.error('地址操作失败:', error);
    ElMessage.error('地址操作失败');
  }
  
  // 重置编辑状态
  showAddressEditor.value = false;
  editingAddress.value = undefined;
};

// 处理编辑取消
const handleEditorCancel = () => {
  showAddressEditor.value = false;
  editingAddress.value = undefined;
};

// 删除地址
const handleDeleteAddress = async (addressId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个收货地址吗？',
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-dialog'
      }
    );
    
    // 执行删除操作
    const response = await deleteAddress(addressId);
    if (response.code === 200) {
      ElMessage.success('地址删除成功');
      await fetchAddresses(); // 重新加载地址列表
    } else {
      ElMessage.error(response.msg || '地址删除失败');
    }
  } catch {
    // 用户取消删除
  }
};

// 设为默认地址
const handleSetDefaultAddress = async (addressId: number) => {
  try {
    const response = await setDefaultAddress(addressId);
    if (response.code === 200) {
      ElMessage.success('默认地址设置成功');
      await fetchAddresses(); // 重新加载地址列表
    } else {
      ElMessage.error(response.msg || '设置默认地址失败');
    }
  } catch (error) {
    console.error('设置默认地址失败:', error);
    ElMessage.error('设置默认地址失败');
  }
};

// 提交订单
const submitOrder = async () => {
  // 验证必填信息
  if (!selectedAddress.value) {
    ElMessage.error('请选择收货地址');
    return;
  }

  if (orderItems.value.length === 0) {
    ElMessage.error('订单商品不能为空');
    return;
  }

  // 构造订单数据
  const orderData = {
    consignee: selectedAddress.value.recipientName,
    phone: selectedAddress.value.phone,
    address: selectedAddress.value.fullAddress,
    orderItems: orderItems.value.map(item => ({
      productId: item.productId,
      skuId: item.skuId,
      quantity: item.quantity,
      price: item.price
    }))
  };

  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      `确认提交订单吗？订单总金额：￥${totalPrice.value.toFixed(2)}`,
      '确认订单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'order-confirm-dialog'
      }
    );

    // 调用API提交订单
    const response = await createOrder(orderData);
    
    if (response.code === 200) {
      ElMessage.success('订单提交成功！');
      
      // 根据实际响应结构调整处理逻辑
      // 假设响应格式为 { code: 200, data: orderId, msg: "success" }
      const orderId = response.data;
      
      // 显示支付确认弹窗
      ElMessageBox.confirm(
        `订单提交成功！请立即支付以确保订单有效。`,
        '支付确认',
        {
          confirmButtonText: '立即支付',
          cancelButtonText: '稍后支付',
          type: 'success',
          customClass: 'payment-confirm-dialog',
          dangerouslyUseHTMLString: true,
          center: true
        }
      ).then(async () => {
        // 用户选择立即支付
        try {
          // 调用接口更新订单状态为已支付
          const updateResponse = await updateOrderStatus({
            orderId: orderId,
            status: 'paid'
          });
          
          if (updateResponse.code === 200) {
            ElMessage.success('支付成功！');
          } else {
            ElMessage.error(updateResponse.msg || '支付失败，请稍后重试');
          }
        } catch (error) {
          console.error('更新订单状态失败:', error);
          ElMessage.error('支付处理异常，请稍后重试');
        }
        
        // 清空购物车选中商品数据
        cartCheckoutStore.clearSelectedProducts();
        
        // 无论支付成功与否，都跳转回首页
        router.push('/');
      }).catch(() => {
        // 用户选择稍后支付（取消支付），也跳转回首页
        ElMessage.info('已取消支付');
        
        // 清空购物车选中商品数据
        cartCheckoutStore.clearSelectedProducts();
        
        router.push('/');
      });
    } else {
      ElMessage.error(response.msg || '订单提交失败');
    }
  } catch (error: any) {
    if (error === 'cancel') {
      // 用户取消操作
      return;
    }
    
    console.error('订单提交失败:', error);
    ElMessage.error('订单提交失败，请稍后重试');
  }
};

// 返回购物车
const goBackToCart = () => {
  router.push('/cart');
};

// 获取用户地址列表
const fetchAddresses = async () => {
  try {
    const response = await getAddressList();
    if (response.code === 200) {
      addresses.value = response.data || [];
      
      // 设置默认选中的地址
      const defaultAddress = addresses.value.find(addr => addr.isDefault);
      if (defaultAddress) {
        selectedAddress.value = defaultAddress;
      } else if (addresses.value.length > 0) {
        // 如果没有默认地址，选择第一个地址
        selectedAddress.value = addresses.value[0];
      }
    } else {
      ElMessage.error(response.msg || '获取地址列表失败');
    }
  } catch (error) {
    console.error('获取地址列表失败:', error);
    ElMessage.error('获取地址列表失败');
  }
};

onMounted(() => {
  // 初始化订单商品数据
  initOrderItems();
  
  // 获取用户地址列表
  fetchAddresses();
  
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
          :key="address.addressId"
          class="address-item"
:class="{ active: selectedAddress && selectedAddress.addressId === address.addressId }"
          @click="selectAddress(address)"
        >
          <div class="address-info">
            <div class="address-header">
              <span class="receiver">{{ address.recipientName }}</span>
              <span class="phone">{{ address.phone }}</span>
              <span v-if="address.isDefault" class="default-tag">默认</span>
            </div>
            <div class="address-detail">
              {{ address.fullAddress }}
            </div>
          </div>
          <div class="address-actions">
            <button class="edit-btn" @click.stop="editAddress(address)">编辑</button>
            <button class="delete-btn" @click.stop="handleDeleteAddress(address.addressId)">删除</button>
            <button 
              v-if="!address.isDefault" 
              class="set-default-btn" 
              @click.stop="handleSetDefaultAddress(address.addressId)"
            >
              设为默认
            </button>
          </div>
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
        @cancel="handleEditorCancel"
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
      display: flex;
      gap: 10px;
      margin-left: 20px;

      .edit-btn,
      .delete-btn,
      .set-default-btn {
        padding: 4px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }

      .edit-btn {
        color: #666666;

        &:hover {
          background: #f5f5f5;
          border-color: #ccc;
          color: #333;
        }
      }

      .delete-btn {
        color: #ff4d4f;
        border-color: #ff4d4f;

        &:hover {
          background: #ff4d4f;
          color: white;
        }
      }

      .set-default-btn {
        color: #ff5000;
        border-color: #ff5000;

        &:hover {
          background: #ff5000;
          color: white;
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

/* 通用弹窗样式 */
.delete-confirm-dialog,
.order-confirm-dialog,
.payment-confirm-dialog {
  width: 420px !important;
  max-width: 90vw;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.delete-confirm-dialog .el-message-box__header,
.order-confirm-dialog .el-message-box__header,
.payment-confirm-dialog .el-message-box__header {
  padding: 20px 20px 10px;
}

.delete-confirm-dialog .el-message-box__title,
.order-confirm-dialog .el-message-box__title,
.payment-confirm-dialog .el-message-box__title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.delete-confirm-dialog .el-message-box__content,
.order-confirm-dialog .el-message-box__content,
.payment-confirm-dialog .el-message-box__content {
  padding: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

.delete-confirm-dialog .el-message-box__btns,
.order-confirm-dialog .el-message-box__btns,
.payment-confirm-dialog .el-message-box__btns {
  padding: 15px 20px 20px;
}

.delete-confirm-dialog .el-button,
.order-confirm-dialog .el-button,
.payment-confirm-dialog .el-button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  min-width: 100px;
}

.delete-confirm-dialog .el-button--primary,
.order-confirm-dialog .el-button--primary,
.payment-confirm-dialog .el-button--primary {
  background-color: #ff5021;
  border-color: #ff5021;
}

.delete-confirm-dialog .el-button--primary:hover,
.order-confirm-dialog .el-button--primary:hover,
.payment-confirm-dialog .el-button--primary:hover {
  background-color: #e6450d;
  border-color: #e6450d;
}

.delete-confirm-dialog .el-button--default,
.order-confirm-dialog .el-button--default,
.payment-confirm-dialog .el-button--default {
  border-color: #dcdfe6;
  color: #666;
}

@media (max-width: 768px) {
  .delete-confirm-dialog,
  .order-confirm-dialog,
  .payment-confirm-dialog {
    width: 90vw !important;
  }
  
  .delete-confirm-dialog .el-message-box__title,
  .order-confirm-dialog .el-message-box__title,
  .payment-confirm-dialog .el-message-box__title {
    font-size: 18px;
  }
  
  .delete-confirm-dialog .el-message-box__content,
  .order-confirm-dialog .el-message-box__content,
  .payment-confirm-dialog .el-message-box__content {
    font-size: 14px;
    padding: 15px;
  }
  
  .delete-confirm-dialog .el-button,
  .order-confirm-dialog .el-button,
  .payment-confirm-dialog .el-button {
    padding: 10px 20px;
    font-size: 14px;
    min-width: 80px;
  }
}
</style>