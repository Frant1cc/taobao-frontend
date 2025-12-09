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
          @click="handleFilterClick(tab.value)"
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
              <span class="order-id">订单号：{{ order.orderId }}</span>
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

          <!-- 订单地址 -->
          <div class="order-address" v-if="order.address || order.consigneeName || order.phone">
            <div class="address-label">收货地址：</div>
            <div class="address-detail" v-if="order.consigneeName">
              {{ order.consigneeName }}
            </div>
            <div class="address-detail" v-if="order.phone" :class="{ 'phone-with-margin': order.consigneeName }">
              {{ order.phone }}
            </div>
            <div class="address-detail" v-if="order.address">
              {{ order.address }}
            </div>
          </div>

          <!-- 订单统计 -->
          <div class="order-summary">
            <div class="total-amount">
              共{{ order.productCount }}件商品 合计：¥{{ order.totalAmount }}
            </div>
          </div>

          <!-- 订单操作 -->
          <div class="order-actions">
            <button 
              v-if="order.status === 'pending'" 
              class="action-btn primary"
              @click="payOrder(order)"
            >
              立即付款
            </button>
            <button 
              v-if="order.status === 'pending'" 
              class="action-btn secondary"
              @click="cancelOrder(order)"
            >
              取消订单
            </button>
            <button 
              v-if="order.status === 'shipped'" 
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
          </div>
        </div>

        <!-- 分页组件 -->
        <div class="pagination-container" v-if="total > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElPagination } from 'element-plus'
import { getOrderList, updateOrderStatus } from '@/api/modules/order'
import type { GetOrderListRequest, GetOrderListResponse, OrderListItem, UpdateOrderStatusRequest } from '@/types/order'

const router = useRouter()
const route = useRoute()

// 添加加载状态
const loading = ref(false)


// 订单状态映射 (适配新的API状态值)
const statusMap = {
  'pending': { text: '待付款', class: 'pending' },
  'paid': { text: '已付款', class: 'pending' },
  'shipped': { text: '已发货', class: 'shipping' },
  'completed': { text: '已完成', class: 'completed' },
  'cancelled': { text: '已取消', class: 'cancelled' }
}

// 筛选标签 (适配新的API状态值)
const filterTabs = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending' },
  { label: '已付款', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

// 响应式数据
const activeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10) // 固定每页显示10条记录
const total = ref(0)

// 从API获取的订单数据
const allOrders = ref<OrderListItem[]>([])

// 获取订单数据的函数
const fetchOrders = async () => {
  loading.value = true
  try {
    const params: GetOrderListRequest = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      orderStatus: activeFilter.value as "" | "pending" | "paid" | "shipped" | "completed" | "cancelled" | undefined || undefined
    }
    
    const response = await getOrderList(params)
    
    // 详细的响应结构调试信息
    console.log('API完整响应:', JSON.stringify(response, null, 2))
    
    // 根据实际API响应结构调整处理逻辑
    if (response.code === 200) {
      // 检查是否有data字段并且是一个对象（包含list数组）
      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.list)) {
        console.log('使用标准数据结构处理')
        // 使用后端返回的实际数据结构
        allOrders.value = response.data.list.map(order => ({
          id: order.id || '',
          orderId: order.orderId || '',
          status: order.status || 'pending',
          createTime: order.createTime || new Date().toLocaleString(),
          totalAmount: order.totalAmount || 0,
          productCount: order.productCount || 0,
          products: order.products && Array.isArray(order.products) ? order.products : [],
          address: order.address || '',
          consigneeName: order.consigneeName || '',
          phone: order.phone || ''
        }))
        
        total.value = response.data.total || 0
      } 
      // 如果data直接就是一个数组（根据用户提供的API数据）
      else if (Array.isArray(response.data)) {
        console.log('使用数组数据结构处理')
        // 转换API数据以适配前端组件
        allOrders.value = response.data.map((order: any) => ({
          id: order.orderId?.toString() || '',
          orderId: order.orderId || '',
          status: order.status || 'pending',
          createTime: order.createTime ? new Date(order.createTime).toLocaleString() : new Date().toLocaleString(),
          totalAmount: order.totalAmount || 0,
          productCount: order.orderItems && Array.isArray(order.orderItems) 
            ? order.orderItems.reduce((count: number, item: any) => count + (item.quantity || 0), 0) 
            : (order.products && Array.isArray(order.products) 
                ? order.products.reduce((count: number, item: any) => count + (item.quantity || 0), 0)
                : 0),
          products: order.orderItems && Array.isArray(order.orderItems) 
            ? order.orderItems.map((item: any) => ({
                id: item.itemId?.toString() || Math.random().toString(),
                name: item.productName || '未知商品',
                spec: item.skuType || '默认规格',
                price: item.price || 0,
                quantity: item.quantity || 0,
                image: item.image || 'https://via.placeholder.com/80x80' // 使用占位图或真实图片
              }))
            : (order.products && Array.isArray(order.products) 
                ? order.products.map((item: any) => ({
                    id: item.id?.toString() || Math.random().toString(),
                    name: item.name || '未知商品',
                    spec: item.spec || '默认规格',
                    price: item.price || 0,
                    quantity: item.quantity || 0,
                    image: item.image || 'https://via.placeholder.com/80x80'
                  }))
                : []),
          address: order.address || order.shippingAddress || order.receiverAddress || '',
          consigneeName: order.consigneeName || '',
          phone: order.phone || ''
        }))
        
        // 设置总数量为返回数据的长度
        total.value = response.data.length
      }
      else {
        console.log('未知数据结构:', typeof response.data, response.data)
        ElMessage.error('获取订单列表失败: 数据格式不正确')
        // 重置数据
        allOrders.value = []
        total.value = 0
      }
    } else {
      ElMessage.error('获取订单列表失败: ' + (response.msg || response.msg || '未知错误'))
      // 重置数据
      allOrders.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取订单列表异常:', error)
    ElMessage.error('获取订单列表失败: ' + (error instanceof Error ? error.message : '未知错误'))
    // 重置数据
    allOrders.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 初始化总订单数
// total.value = allOrders.value.length

// 计算属性
const pageTitle = ref('我的订单')

const filteredOrders = computed(() => {
  // 在使用API的情况下，过滤和分页都在后端完成，这里直接返回所有订单
  return allOrders.value
})

// 分页相关方法
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchOrders() // 重新获取数据
}

const handleSizeChange = (size: number) => {
  // 固定每页显示10条记录，不随用户选择改变
  pageSize.value = 10
  currentPage.value = 1 // 重置到第一页
  fetchOrders() // 重新获取数据
}

// 方法
const goBack = () => {
  router.back()
}

const handleFilterClick = (filter: string) => {
  activeFilter.value = filter
  currentPage.value = 1 // 切换筛选条件时重置到第一页
  fetchOrders() // 重新获取数据
  // 页面标题统一显示为"我的订单"
  pageTitle.value = '我的订单'
}

const getStatusClass = (status: string) => {
  return (statusMap as Record<string, { text: string; class: string }>)[status]?.class || 'pending'
}

const getStatusText = (status: string) => {
  return (statusMap as Record<string, { text: string; class: string }>)[status]?.text || '未知状态'
}

const payOrder = async (order: any) => {
  try {
    // 调用API更新订单状态为"已付款"
    const params: UpdateOrderStatusRequest = {
      orderId: parseInt(order.id),
      status: 'paid'
    }
    
    const response = await updateOrderStatus(params)
    
    if (response.code === 200) {
      ElMessage.success('支付成功，订单状态已更新')
      // 更新本地订单状态
      order.status = 'paid'
      // 重新获取订单列表以确保数据同步
      await fetchOrders()
    } else {
      ElMessage.error('支付失败: ' + (response.msg || '未知错误'))
    }
  } catch (error) {
    console.error('支付过程中出现错误:', error)
    ElMessage.error('支付失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

const cancelOrder = async (order: any) => {
  try {
    // 调用API更新订单状态为"已取消"
    const params: UpdateOrderStatusRequest = {
      orderId: parseInt(order.id),
      status: 'cancelled'
    }
    
    const response = await updateOrderStatus(params)
    
    if (response.code === 200) {
      ElMessage.success('订单已取消')
      // 更新本地订单状态
      order.status = 'cancelled'
      // 重新获取订单列表以确保数据同步
      await fetchOrders()
    } else {
      ElMessage.error('取消订单失败: ' + (response.msg || '未知错误'))
    }
  } catch (error) {
    console.error('取消订单过程中出现错误:', error)
    ElMessage.error('取消订单失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
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
    activeFilter.value = 'pending'
  } else if (status === '待发货') {
    activeFilter.value = 'paid'
  } else if (status === '待收货') {
    activeFilter.value = 'shipped'
  } else if (status === '已完成') {
    activeFilter.value = 'completed'
  } else if (status === '已取消') {
    activeFilter.value = 'cancelled'
  }
  
  // 获取订单数据
  fetchOrders()
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
  outline: none;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #ff5021;
}

.back-btn:focus,
.back-btn:focus-visible {
  outline: none !important;
  box-shadow: none !important;
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
  outline: none;
}

.filter-tab.active {
  color: #ff5021;
  border-bottom-color: #ff5021;
}

.filter-tab:hover {
  color: #ff5021;
}

.filter-tab:focus,
.filter-tab:focus-visible {
  outline: none !important;
  box-shadow: none !important;
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
  outline: none;
}

.go-shopping-btn:hover {
  background: #ff3a00;
}

.go-shopping-btn:focus,
.go-shopping-btn:focus-visible {
  outline: none !important;
  box-shadow: none !important;
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

/* 订单地址样式 */
.order-address {
  padding: 10px 20px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.address-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.address-detail {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
}

.address-detail:last-child {
  margin-bottom: 0;
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
  outline: none;
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

/* 移除按钮焦点边框 */
.action-btn:focus,
.action-btn:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background: white;
  border-radius: 8px;
  margin-top: 15px;
}
</style>