<template>
  <div class="merchant-orders">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>订单管理</h2>
      <div class="header-actions">
        <!-- 移除导出订单和批量打印功能 -->
      </div>
    </div>

    <!-- 订单状态筛选 -->
    <div class="order-status-tabs">
      <el-tabs v-model="activeStatus" @tab-click="handleTabChange">
        <el-tab-pane label="全部订单" name="all" />
        <el-tab-pane label="待付款" name="pending" />
        <el-tab-pane label="待发货" name="toShip" />
        <el-tab-pane label="已发货" name="shipped" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="已取消" name="cancelled" />
      </el-tabs>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索订单号、买家昵称..."
          prefix-icon="Search"
          style="width: 300px"
        />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
        />
        <el-select v-model="filterPayment" placeholder="支付方式" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="支付宝" value="alipay" />
          <el-option label="微信支付" value="wechat" />
          <el-option label="银行卡" value="bank" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <!-- 批量操作 -->
    <div class="batch-actions" v-if="selectedOrders.length > 0">
      <el-alert
        :title="`已选择 ${selectedOrders.length} 个订单`"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          <el-button size="small" @click="handleBatchShip">批量发货</el-button>
          <el-button size="small" @click="clearSelection">取消选择</el-button>
        </template>
      </el-alert>
    </div>

    <!-- 订单列表 -->
    <el-card>
      <el-table
        :data="filteredOrders"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="订单信息" min-width="300">
          <template #default="{ row }">
            <div class="order-info">
              <div class="order-number">
                <strong>{{ row.orderId }}</strong>
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </div>
              <div class="order-time">{{ formatDateTime(row.createTime) }}</div>
              <div class="buyer-info">买家ID：{{ row.userId }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="250">
          <template #default="{ row }">
            <div class="product-list">
              <div 
                v-for="product in row.products" 
                :key="product.id"
                class="product-item"
              >
                <el-image
                  :src="product.image"
                  :alt="product.name"
                  fit="cover"
                  class="product-image"
                />
                <div class="product-details">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-spec">规格：{{ product.spec }}</div>
                  <div class="product-quantity">x{{ product.quantity }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="140">
          <template #default="{ row }">
            <div class="amount-info">
              <div class="total-amount">¥{{ row.totalAmount }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货信息" width="200">
          <template #default="{ row }">
            <div class="shipping-info">
              <div class="receiver">{{ row.consigneeName || '未知' }}</div>
              <div class="phone">{{ row.phone || '未知' }}</div>
              <div class="address">{{ row.shippingAddress || '未知' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                v-if="row.status === 'toShip' || row.status === 'paid'" 
                type="primary" 
                size="small"
                @click="handleShip(row)"
              >
                发货
              </el-button>
              <el-button 
                v-if="row.status === 'toShip' || row.status === 'paid' || row.status === 'shipped'" 
                size="small" 
                type="danger"
                @click="handleCancel(row)"
              >
                取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 发货对话框 -->
    <el-dialog
      v-model="showShipDialog"
      title="订单发货"
      width="500px"
    >
      <el-form :model="shipForm" label-width="80px">
        <el-form-item label="物流公司">
          <el-select v-model="shipForm.logisticsCompany" placeholder="请选择物流公司">
            <el-option label="顺丰速运" value="sf" />
            <el-option label="圆通速递" value="yt" />
            <el-option label="中通快递" value="zt" />
            <el-option label="韵达快递" value="yd" />
            <el-option label="申通快递" value="st" />
          </el-select>
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="shipForm.logisticsNo" placeholder="请输入运单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showShipDialog = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmShip">
          确认发货
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Search
} from '@element-plus/icons-vue'
import { 
  getOrderList, 
  getOrderDetail, 
  shipOrder 
} from '@/api/modules/merchant-order'
import type { OrderListItem, OrderDetail, ShipOrderParams } from '@/types/order'

interface OrderProduct {
  id: string
  name: string
  image: string
  spec: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  createTime: string
  buyerName: string
  products: OrderProduct[]
  totalAmount: number
  paymentMethod: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  orderId?: number
  orderNo?: string
  userId?: number
}

// 状态筛选
const activeStatus = ref('all')

// 搜索和筛选
const searchKeyword = ref('')
const dateRange = ref([])
const filterPayment = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 批量操作
const selectedOrders = ref<Order[]>([])

// 对话框控制
const showShipDialog = ref(false)
const shippingOrder = ref<Order | null>(null)
const shipForm = ref<ShipOrderParams>({
  logisticsCompany: '',
  logisticsNo: ''
})

// 订单数据
const orders = ref<OrderListItem[]>([])

// 加载订单列表
const loadOrders = async () => {
  try {
    const status = activeStatus.value === 'all' ? undefined : activeStatus.value
    const response = await getOrderList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      status: status as ("pending" | "paid" | "shipped" | "completed" | "cancelled" | undefined)
    })
    if (response.code === 200) {
      // 适配后端返回的数据格式
      orders.value = response.data.map((order: any) => ({
        orderId: order.orderId,
        orderNo: order.orderNo,
        userId: order.userId,
        totalAmount: order.totalAmount,
        status: order.status,
        shippingAddress: order.shippingAddress,
        createTime: order.createTime,
        updateTime: order.updateTime,
        // 新增字段适配
        consigneeName: order.consigneeName,
        phone: order.phone,
        paymentTime: order.paymentTime,
        paid: order.paid || false,
        // 商品信息
        products: order.orderItems?.map((item: any) => ({
          id: item.itemId?.toString(),
          name: item.productName,
          image: '', // 需要根据实际情况获取图片
          spec: item.skuType,
          quantity: item.quantity,
          price: item.price
        })) || []
      }))
      total.value = response.data.length
    }
  } catch (error) {
    ElMessage.error('获取订单列表失败')
    console.error('获取订单列表失败:', error)
  }
}

// 计算属性：订单列表（直接返回后端API返回的数据）
const filteredOrders = computed(() => {
  // 如果 orders.value 为 undefined 或 null，返回空数组
  if (!orders.value) {
    return []
  }
  return orders.value
})

// 方法
const handleTabChange = () => {
  currentPage.value = 1
  loadOrders()
}

const handleSearch = () => {
  currentPage.value = 1
  loadOrders()
}

const handleReset = () => {
  searchKeyword.value = ''
  dateRange.value = []
  filterPayment.value = ''
  currentPage.value = 1
  loadOrders()
}

const handleSelectionChange = (selection: Order[]) => {
  selectedOrders.value = selection
}

const handleBatchShip = () => {
  // 批量发货逻辑
  console.log('批量发货:', selectedOrders.value)
  ElMessage.info('批量发货功能暂未实现')
}

const clearSelection = () => {
  selectedOrders.value = []
}

const handleShip = (order: OrderListItem) => {
  shippingOrder.value = order as unknown as Order
  showShipDialog.value = true
}

const handleConfirmShip = async () => {
  try {
    if (shippingOrder.value) {
      const response = await shipOrder(shippingOrder.value.orderId!, shipForm.value)
      if (response.code === 200) {
        ElMessage.success('订单发货成功')
        await loadOrders()
      } else {
        ElMessage.error(response.msg || '发货失败')
      }
    }
  } catch (error) {
    ElMessage.error('发货失败')
    console.error('发货失败:', error)
  }
  
  showShipDialog.value = false
  shipForm.value = {
    logisticsCompany: '',
    logisticsNo: ''
  }
  shippingOrder.value = null
}

const handleViewTracking = (order: OrderListItem) => {
  // 查看物流逻辑
  console.log('查看物流:', order)
  ElMessage.info('查看物流功能暂未实现')
}

const handleViewDetail = async (order: OrderListItem) => {
  try {
    const response = await getOrderDetail(order.orderId)
    if (response.code === 200) {
      console.log('订单详情:', response.data)
      ElMessage.info('订单详情功能暂未实现')
    } else {
      ElMessage.error('获取订单详情失败')
    }
  } catch (error) {
    ElMessage.error('获取订单详情失败')
    console.error('获取订单详情失败:', error)
  }
}

const handleCancel = (order: OrderListItem) => {
  // 取消订单逻辑
  console.log('取消订单:', order)
  ElMessage.info('取消订单功能暂未实现')
}

// 页面加载时获取订单列表
onMounted(() => {
  loadOrders()
})

const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': 'warning',
    'toShip': 'primary',
    'shipped': 'success',
    'completed': 'info',
    'cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': '待付款',
    'paid': '待发货',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || '未知'
}

const getPaymentText = (payment: string) => {
  const paymentMap: { [key: string]: string } = {
    'alipay': '支付宝',
    'wechat': '微信支付',
    'bank': '银行卡'
  }
  return paymentMap[payment] || '其他'
}

// 获取付款状态文本
const getPaymentStatusText = (paid: boolean) => {
  return paid ? '已付款' : '未付款'
}

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return ''
  try {
    const date = new Date(dateTime)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return dateTime
  }
}
</script>

<style scoped lang="scss">
@use "sass:color";

// 使用客户端相同的颜色主题
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;

// 统一的焦点样式修复类
.no-focus {
  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
}

.merchant-orders {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      color: $text-primary;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .order-status-tabs {
    margin-bottom: 16px;

    :deep(.el-tabs__header) {
      margin: 0;
    }
  }

  .filter-card {
    margin-bottom: 16px;

    .filter-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .batch-actions {
    margin-bottom: 16px;

    :deep(.el-alert) {
      padding: 8px 16px;

      .el-alert__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .order-info {
    .order-number {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .order-time {
      font-size: 12px;
      color: $text-secondary;
      margin-bottom: 4px;
    }

    .buyer-info {
      font-size: 12px;
      color: $text-secondary;
    }
  }

  .product-list {
    .product-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      .product-image {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        object-fit: cover;
      }

      .product-details {
        flex: 1;

        .product-name {
          font-size: 12px;
          margin-bottom: 2px;
        }

        .product-spec {
          font-size: 11px;
          color: $text-secondary;
          margin-bottom: 2px;
        }

        .product-quantity {
          font-size: 11px;
          color: $text-secondary;
        }
      }
    }
  }

  .amount-info {
    .total-amount {
      font-weight: 600;
      margin-bottom: 4px;
    }

    .payment-method {
      font-size: 12px;
      color: $text-secondary;
    }
  }

  .shipping-info {
    .receiver {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .phone {
      font-size: 12px;
      color: $text-secondary;
      margin-bottom: 2px;
    }

    .address {
      font-size: 12px;
      color: $text-secondary;
    }
  }

  .action-buttons {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 16px 0;
  }
  
  .el-table {
    // 移除纵向滚动条
    :deep(.el-table__body-wrapper) {
      overflow-x: auto !important;
      overflow-y: hidden !important;
    }
    
    // 确保内容区域高度自适应
    :deep(.el-table__body) {
      overflow-y: visible !important;
    }
    
    // 移除表格内所有元素的焦点边框
    :deep(*) {
      // 表格行
      .el-table__row {
        &:focus {
          outline: none !important;
        }
        
        &.current-row {
          // 当前行样式（如果有需要）
        }
      }
      
      // 表格单元格
      .el-table__cell {
        &:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      }
      
      // 表格内的按钮
      .el-button {
        @extend .no-focus;
        
        // 按钮悬停效果
        &:hover {
          border-color: $primary-color !important;
          color: $primary-color !important;
        }
      }
      
      // 表格内的标签
      .el-tag {
        @extend .no-focus;
      }
      
      // 表格内的图片
      .el-image {
        @extend .no-focus;
      }
      
      // 可点击的商品名称
      .clickable {
        @extend .no-focus;
        cursor: pointer;
        transition: color 0.2s;
        
        &:hover {
          color: $primary-color;
          text-decoration: underline;
        }
      }
    }
    
    // 移除表格选中状态的焦点边框
    :deep(.el-table__row) {
      // 选中行
      &.current-row {
        &:focus {
          outline: none !important;
        }
      }
      
      // 勾选框
      .el-checkbox {
        &:focus {
          outline: none !important;
        }
        
        :deep(.el-checkbox__inner) {
          &:focus {
            outline: none !important;
          }
        }
      }
    }
    
    // 移除表格排序按钮的焦点边框
    :deep(.caret-wrapper) {
      &:focus {
        outline: none !important;
      }
    }
    
    // 移除表格过滤按钮的焦点边框
    :deep(.el-table__column-filter-trigger) {
      @extend .no-focus;
    }
    
    // 移除表格展开按钮的焦点边框
    :deep(.el-table__expand-icon) {
      @extend .no-focus;
    }
  }
  
  // 可选：固定表头，内容区域自动高度
  .el-table--scrollable-y {
    :deep(.el-table__body-wrapper) {
      max-height: none !important;
      overflow-y: hidden !important;
    }
  }
}
</style>