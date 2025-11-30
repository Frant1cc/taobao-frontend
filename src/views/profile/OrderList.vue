<template>
  <div class="order-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </div>
        <h1 class="page-title">{{ pageTitle }}</h1>
      </div>
    </div>

    <!-- 订单筛选 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          :class="['filter-tab', { active: activeFilter === tab.value }]"
          @click="changeFilter(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <p class="empty-text">暂无{{ pageTitle }}订单</p>
        <button class="go-shopping-btn" @click="goShopping">去购物</button>
      </div>

      <div v-else class="orders-container">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="order-item"
        >
          <!-- 订单头部 -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-time">{{ order.createTime }}</span>
            </div>
            <div class="order-status-badge" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="order-products">
            <div 
              v-for="product in order.products" 
              :key="product.id"
              class="product-item"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-spec">{{ product.spec }}</p>
                <div class="product-price">¥{{ product.price }}</div>
              </div>
              <div class="product-quantity">x{{ product.quantity }}</div>
            </div>
          </div>

          <!-- 订单统计 -->
          <div class="order-summary">
            <div class="total-amount">
              共{{ order.products.length }}件商品 合计：¥{{ order.totalAmount }}
            </div>
          </div>

          <!-- 订单操作 -->
          <div class="order-actions">
            <button 
              v-if="order.status === 'pending_payment'" 
              class="action-btn primary"
              @click="payOrder(order)"
            >
              立即付款
            </button>
            <button 
              v-if="order.status === 'pending_receipt'" 
              class="action-btn primary"
              @click="confirmReceipt(order)"
            >
              确认收货
            </button>
            <button 
              v-if="order.status === 'completed'" 
              class="action-btn"
              @click="viewOrderDetail(order)"
            >
              查看详情
            </button>
            <button 
              v-if="order.status === 'completed'" 
              class="action-btn"
              @click="applyRefund(order)"
            >
              申请售后
            </button>
            <button class="action-btn secondary" @click="viewOrderDetail(order)">
              订单详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()


// 订单状态映射
const statusMap = {
  'pending_payment': { text: '待付款', class: 'pending' },
  'pending_shipment': { text: '待发货', class: 'pending' },
  'pending_receipt': { text: '待收货', class: 'shipping' },
  'completed': { text: '已完成', class: 'completed' },
  'refund': { text: '退款中', class: 'refund' },
  'cancelled': { text: '已取消', class: 'cancelled' }
}

// 筛选标签
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending_payment' },
  { label: '待发货', value: 'pending_shipment' },
  { label: '待收货', value: 'pending_receipt' },
  { label: '已完成', value: 'completed' }
]
// 响应式数据
const activeFilter = ref('all')
const orders = ref([
  // 模拟数据
  {
    id: 'TB20231215001',
    status: 'pending_payment',
    createTime: '2023-12-15 10:30:25',
    totalAmount: 299.00,
    products: [
      {
        id: 'P001',
        name: '新款智能手机',
        spec: '黑色 128GB',
        price: 2999.00,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80'
      }
    ]
  },
  {
    id: 'TB20231214002',
    status: 'pending_shipment',
    createTime: '2023-12-14 16:45:12',
    totalAmount: 156.00,
    products: [
      {
        id: 'P002',
        name: '无线蓝牙耳机',
        spec: '白色',
        price: 156.00,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80'
      }
    ]
  },
  {
    id: 'TB20231213003',
    status: 'pending_receipt',
    createTime: '2023-12-13 09:20:33',
    totalAmount: 89.90,
    products: [
      {
        id: 'P003',
        name: '运动水杯',
        spec: '蓝色 500ml',
        price: 29.90,
        quantity: 3,
        image: 'https://via.placeholder.com/80x80'
      }
    ]
  }
])

// 计算属性
const pageTitle = ref('我的订单')

const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeFilter.value)
})

// 方法
const goBack = () => {
  router.back()
}

const changeFilter = (filter: string) => {
  activeFilter.value = filter
  // 页面标题统一显示为"我的订单"
  pageTitle.value = '我的订单'
}

const getStatusClass = (status: string) => {
  return (statusMap as Record<string, { text: string; class: string }>)[status]?.class || 'pending'
}

const getStatusText = (status: string) => {
  return (statusMap as Record<string, { text: string; class: string }>)[status]?.text || '未知状态'
}

const payOrder = (order: any) => {
  ElMessage.success(`正在支付订单：${order.id}`)
  // 实际开发中这里会跳转到支付页面
}

const confirmReceipt = (order: any) => {
  ElMessage.success(`确认收货订单：${order.id}`)
  // 实际开发中这里会调用确认收货API
}

const viewOrderDetail = (order: any) => {
  ElMessage.info(`查看订单详情：${order.id}`)
  // 实际开发中这里会跳转到订单详情页面
}

const applyRefund = (order: any) => {
  ElMessage.info(`申请售后：${order.id}`)
  // 实际开发中这里会跳转到售后申请页面
}

const goShopping = () => {
  router.push('/home')
}

// 生命周期
onMounted(() => {
  // 根据路由参数设置初始筛选状态
  const status = route.query.status as string
  if (status === '待付款') {
    activeFilter.value = 'pending_payment'
  } else if (status === '待发货') {
    activeFilter.value = 'pending_shipment'
  } else if (status === '待收货') {
    activeFilter.value = 'pending_receipt'
  } else if (status === '已完成') {
    activeFilter.value = 'completed'
  }
})
</script>

<style scoped>
.order-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部样式 */
.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #ff5021;
}

.back-icon {
  font-size: 18px;
  margin-right: 5px;
}

.back-text {
  font-size: 14px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-left: 20px;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
}

.filter-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 0;
}

.filter-tab {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.filter-tab.active {
  color: #ff5021;
  border-bottom-color: #ff5021;
}

.filter-tab:hover {
  color: #ff5021;
}

/* 订单列表样式 */
.order-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 20px;
}

.go-shopping-btn {
  background: #ff5021;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.go-shopping-btn:hover {
  background: #ff3a00;
}

/* 订单项样式 */
.order-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-id {
  font-size: 14px;
  color: #666;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.order-status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.order-status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.order-status-badge.shipping {
  background: #e6f7ff;
  color: #1890ff;
}

.order-status-badge.completed {
  background: #f6ffed;
  color: #52c41a;
}

.order-status-badge.refund {
  background: #fff2e8;
  color: #fa541c;
}

.order-status-badge.cancelled {
  background: #f5f5f5;
  color: #999;
}

/* 商品列表样式 */
.order-products {
  padding: 15px 20px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.product-spec {
  font-size: 12px;
  color: #999;
  margin: 0 0 5px 0;
}

.product-price {
  font-size: 14px;
  color: #ff5021;
  font-weight: 600;
}

.product-quantity {
  font-size: 14px;
  color: #666;
}

/* 订单统计样式 */
.order-summary {
  padding: 0 20px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}

.total-amount {
  padding: 10px 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 订单操作样式 */
.order-actions {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  color: #666;
}

.action-btn.primary {
  background: #ff5021;
  color: white;
  border-color: #ff5021;
}

.action-btn.secondary {
  background: white;
  color: #ff5021;
  border-color: #ff5021;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn.primary:hover {
  background: #ff3a00;
  border-color: #ff3a00;
}

.action-btn.secondary:hover {
  background: #fff2e8;
}
</style>