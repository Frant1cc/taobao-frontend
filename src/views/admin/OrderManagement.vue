<template>
  <div class="order-management">

    <!-- 订单列表 -->
    <el-card>
      <el-table
        :data="orderList"
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >

        <el-table-column label="订单信息" min-width="200">
          <template #default="{ row }">
            <div class="order-info">
              <div class="order-number">
                <strong>订单号：{{ row.orderNo }}</strong>
              </div>
              <div class="order-id">订单ID：{{ row.orderId }}</div>
              <div class="order-time">{{ formatDateTime(row.createTime) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="用户信息" width="150">
          <template #default="{ row }">
            <div class="user-info">
              <div class="user-id">用户ID：{{ row.userId }}</div>
              <div class="consignee">{{ row.consigneeName || '未知' }}</div>
              <div class="phone">{{ row.phone || '未知' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div class="product-list">
              <div 
                v-for="item in row.orderItems" 
                :key="item.itemId"
                class="product-item"
              >
                <div class="product-image">
                  <el-image
                    :src="getImageUrl(item.skuImage)"
                    :alt="item.productName"
                    fit="cover"
                    class="product-img"
                  />
                </div>
                <div class="product-details">
                  <div class="product-name">{{ item.productName }}</div>
                  <div class="product-spec">{{ item.skuName }}</div>
                  <div class="product-price">¥{{ item.price }} x {{ item.quantity }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="金额" width="120">
          <template #default="{ row }">
            <div class="amount-info">
              <div class="total-amount">¥{{ row.totalAmount }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="收货地址" width="200">
          <template #default="{ row }">
            <div class="shipping-info">
              <div class="address">{{ row.shippingAddress }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="small"
                @click="viewOrderDetail(row)"
              >
                查看详情
              </el-button>
              <el-button 
                v-if="row.status === 'pending'"
                type="warning" 
                size="small"
                @click="handleCancelOrder(row)"
              >
                取消订单
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="800px"
    >
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="订单ID">{{ currentOrder.orderId }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ currentOrder.userId }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(currentOrder.status)">
                {{ getStatusText(currentOrder.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="订单金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatDateTime(currentOrder.createTime) }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ formatDateTime(currentOrder.updateTime) }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ currentOrder.paymentTime ? formatDateTime(currentOrder.paymentTime) : '未支付' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>收货信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="收货人">{{ currentOrder.consigneeName || '未知' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentOrder.phone || '未知' }}</el-descriptions-item>
            <el-descriptions-item label="收货地址">{{ currentOrder.shippingAddress }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>商品信息</h4>
          <el-table :data="currentOrder.orderItems" style="width: 100%">
            <el-table-column label="商品图片" width="80">
              <template #default="{ row }">
                <el-image
                  :src="getImageUrl(row.skuImage)"
                  :alt="row.productName"
                  fit="cover"
                  style="width: 60px; height: 60px"
                />
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="productName" />
            <el-table-column label="规格" prop="skuName" />
            <el-table-column label="单价" width="100">
              <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column label="数量" width="80" prop="quantity" />
            <el-table-column label="小计" width="100">
              <template #default="{ row }">¥{{ row.totalPrice }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getAdminOrderList, getAdminOrderDetail, cancelAdminOrder } from '@/api/modules/admin'
import type { AdminOrderListItem, AdminOrderDetail } from '@/types/admin'

// 响应式数据
const loading = ref(false)
const orderList = ref<AdminOrderListItem[]>([])
const currentOrder = ref<AdminOrderDetail | null>(null)
const detailVisible = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const selectedOrders = ref<AdminOrderListItem[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 获取图片完整URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath || imagePath.trim() === '') {
    return 'https://via.placeholder.com/60x60'
  }
  
  // 如果图片路径已经是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 处理路径格式，避免双斜杠问题
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://taobao-hqh.oss-cn-beijing.aliyuncs.com'
  
  // 确保baseUrl以斜杠结尾，imagePath不以斜杠开头
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const cleanImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  return `${cleanBaseUrl}/${cleanImagePath}`
}

// 订单状态映射
const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': 'warning',
    'paid': 'primary',
    'shipped': 'success',
    'completed': 'info',
    'cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': '待付款',
    'paid': '已付款',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN')
  } catch {
    return dateString
  }
}

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  
  try {
    // 调用真实API获取订单列表
    const response = await getAdminOrderList()
    
    // 处理响应数据
    if (response.code === 200 && response.data) {
      orderList.value = response.data.list
      pagination.total = response.data.total
      pagination.current = response.data.pageNum
      pagination.size = response.data.pageSize
    } else {
      ElMessage.error('获取订单列表失败')
      orderList.value = []
      pagination.total = 0
    }
    
  } catch (error) {
    console.error('加载订单列表失败:', error)
    ElMessage.error('加载订单列表失败')
    
    // 错误时使用空数据作为降级方案
    orderList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 查看订单详情
const viewOrderDetail = async (order: AdminOrderListItem) => {
  try {
    loading.value = true
    
    // 调用真实API获取订单详情
    const response = await getAdminOrderDetail(order.orderId)
    
    if (response.code === 200 && response.data) {
      currentOrder.value = response.data
      detailVisible.value = true
    } else {
      ElMessage.error('获取订单详情失败')
    }
    
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
    
    // 错误时使用当前订单数据作为降级方案
    currentOrder.value = {
      orderId: order.orderId,
      orderNo: order.orderNo,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      consigneeName: order.consigneeName,
      phone: order.phone,
      paymentTime: order.paymentTime,
      createTime: order.createTime,
      updateTime: order.updateTime,
      orderItems: order.orderItems
    }
    detailVisible.value = true
  } finally {
    loading.value = false
  }
}

// 取消订单
const handleCancelOrder = async (order: AdminOrderListItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消订单 "${order.orderNo}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用取消订单API
    const response = await cancelAdminOrder({
      id: order.orderId,
      status: 'cancelled'
    })
    
    if (response.code === 200) {
      ElMessage.success(response.data || '取消订单成功')
      
      // 刷新订单列表
      loadOrders()
    } else {
      ElMessage.error(response.msg || '取消订单失败')
    }
    
  } catch (error) {
    console.error('取消订单失败:', error)
    
    // 如果是用户取消操作，不显示错误信息
    if (error !== 'cancel') {
      ElMessage.error('取消订单失败')
    }
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.current = 1
  loadOrders()
}

// 重置搜索
const handleReset = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  pagination.current = 1
  loadOrders()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadOrders()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadOrders()
}

// 批量选择处理
const handleSelectionChange = (selection: AdminOrderListItem[]) => {
  selectedOrders.value = selection
}

// 页面加载时获取订单列表
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.order-info .order-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.order-info .order-id,
.order-info .order-time {
  font-size: 12px;
  color: #909399;
}

.user-info .consignee {
  font-weight: 500;
  margin-bottom: 2px;
}

.user-info .user-id,
.user-info .phone {
  font-size: 12px;
  color: #909399;
}

.product-list {
  max-height: 200px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  margin-right: 12px;
}

.product-img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.product-price {
  font-size: 12px;
  color: #ff5000;
}

.shipping-info .address {
  font-size: 12px;
  line-height: 1.4;
}

.amount-info .total-amount {
  font-weight: 600;
  color: #ff5000;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.order-detail .detail-section {
  margin-bottom: 24px;
}

.order-detail .detail-section h4 {
  margin-bottom: 12px;
  color: #303133;
  font-weight: 500;
}
</style>