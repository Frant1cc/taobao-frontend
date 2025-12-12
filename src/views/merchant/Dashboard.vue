<template>
  <div class="merchant-dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h2>欢迎回来，{{ userInfo?.username || userInfo?.account || '商家用户' }}！</h2>
      <p>今日是 {{ currentDate }}，祝您生意兴隆！</p>
      <div v-if="userInfo" class="user-info-badge">
        <span class="account-info">账号：{{ userInfo.account }}</span>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon revenue">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">¥{{ formatNumber(revenue) }}</div>
            <div class="stat-label">今日收入</div>
            <div class="stat-change positive">+12.5%</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon orders">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ formatNumber(orders) }}</div>
            <div class="stat-label">今日订单</div>
            <div class="stat-change positive">+8.3%</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon visitors">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ formatNumber(visitors) }}</div>
            <div class="stat-label">店铺访客</div>
            <div class="stat-change positive">+15.2%</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon products">
            <el-icon><Goods /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ formatNumber(products) }}</div>
            <div class="stat-label">在售商品</div>
            <div class="stat-change neutral">-</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions-section">
      <h3>快捷操作</h3>
      <div class="quick-actions">
        <el-card class="action-card" @click="$router.push('/merchant/products')">
          <div class="action-content">
            <el-icon size="32"><Goods /></el-icon>
            <span>发布商品</span>
          </div>
        </el-card>

        <el-card class="action-card" @click="$router.push('/merchant/orders')">
          <div class="action-content">
            <el-icon size="32"><Document /></el-icon>
            <span>处理订单</span>
          </div>
        </el-card>



        <el-card class="action-card" @click="$router.push('/merchant/settings')">
          <div class="action-content">
            <el-icon size="32"><Setting /></el-icon>
            <span>店铺设置</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 最近订单 -->
    <div class="recent-orders-section">
      <div class="section-header">
        <h3>最近订单</h3>
        <el-button type="primary" link @click="$router.push('/merchant/orders')">
          查看全部
        </el-button>
      </div>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="orderId" label="订单ID" width="120" />
        <el-table-column label="商品" min-width="200">
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
              <div v-if="!row.products || row.products.length === 0" class="no-products">
                无商品信息
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="买家" width="100">
          <template #default="{ row }">
            {{ row.consigneeName || '未知买家' }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Money,
  Document,
  User,
  Goods,
  Setting
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useShopStore } from '@/stores/shop'
import { getOrderList } from '@/api/modules/merchant-order'
import type { OrderListItem } from '@/types/order'

const userStore = useUserStore()
const shopStore = useShopStore()
const currentDate = ref(new Date().toLocaleDateString('zh-CN'))

// 用户信息（从用户仓库获取）
const userInfo = computed(() => userStore.userInfo)

// 店铺信息（从店铺仓库获取）
const shopInfo = computed(() => shopStore.currentShop)

// 数据概览（使用模拟数据，因为统计接口不存在）
const revenue = ref(12568.5)
const orders = ref(42)
const visitors = ref(1568)
const products = ref(28)

// 最近订单数据
const recentOrders = ref<OrderListItem[]>([])

// 获取用户类型文本
const getUserTypeText = (userType: string) => {
  const typeMap: Record<string, string> = {
    'merchant': '商家',
    'customer': '普通用户',
    'operator': '运营人员',
    'visitor': '访客'
  }
  return typeMap[userType] || userType
}

// 加载数据
const loadData = async () => {
  try {
    // 如果用户信息不存在，尝试从用户仓库加载
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo()
    }
    
    // 店铺信息已经在布局文件中加载，这里不再重复加载
    // 获取最近订单
    await loadRecentOrders()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 获取完整图片URL（参考订单管理页面的实现）
const getFullImageUrl = (imagePath: string) => {
  if (!imagePath) return 'https://via.placeholder.com/60x60'
  
  // 如果图片路径已经是完整URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 处理路径格式，避免双斜杠问题
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || ''
  if (!baseUrl) return imagePath
  
  // 确保baseUrl以斜杠结尾，imagePath不以斜杠开头
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const cleanImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  return `${cleanBaseUrl}/${cleanImagePath}`
}

// 加载最近订单
const loadRecentOrders = async () => {
  try {
    const response = await getOrderList({
      pageNum: 1,
      pageSize: 5
    })
    if (response.code === 200) {
      // 适配后端返回的数据格式并处理商品信息
      let orderData: any[] = []
      if (Array.isArray(response.data)) {
        orderData = response.data
      } else if (response.data && Array.isArray(response.data.list)) {
        orderData = response.data.list
      }
      
      // 处理商品信息，与订单管理页面保持一致
      recentOrders.value = orderData.slice(0, 5).map((order: any) => ({
        orderId: order.orderId,
        orderNo: order.orderNo,
        userId: order.userId,
        totalAmount: order.totalAmount,
        status: order.status,
        shippingAddress: order.shippingAddress,
        createTime: order.createTime,
        updateTime: order.updateTime,
        consigneeName: order.consigneeName,
        phone: order.phone,
        paymentTime: order.paymentTime,
        paid: order.paid || false,
        // 商品信息 - 使用orderItems数据渲染商品信息
        products: order.orderItems?.map((item: any) => ({
          id: item.itemId?.toString(),
          name: item.productName,
          image: getFullImageUrl(item.skuImage),
          spec: item.skuName,
          quantity: item.quantity,
          price: item.price
        })) || []
      }))
    }
  } catch (error) {
    console.error('获取最近订单失败:', error)
  }
}

onMounted(() => {
  loadData()
})

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
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

// 获取订单状态文本
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': '待付款',
    'paid': '待发货',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 格式化时间显示
const formatTime = (timeStr: string) => {
  try {
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN')
  } catch (error) {
    return timeStr
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

.merchant-dashboard {
  .welcome-section {
    background: linear-gradient(135deg, $primary-color, color.adjust($primary-color, $lightness: 10%));
    color: $white;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;
    
    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
    }
    
    p {
      margin: 0 0 12px 0;
      opacity: 0.9;
    }
    
    .user-info-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      
      .el-tag {
        font-size: 12px;
        font-weight: 500;
      }
      
      .account-info {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $white;
          font-size: 24px;

          &.revenue { background: #67c23a; }
          &.orders { background: $primary-color; }
          &.visitors { background: #e6a23c; }
          &.products { background: #f56c6c; }
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: $text-primary;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            color: $text-secondary;
            margin-bottom: 4px;
          }

          .stat-change {
            font-size: 12px;
            font-weight: 500;

            &.positive { color: #67c23a; }
            &.negative { color: #f56c6c; }
            &.neutral { color: $text-secondary; }
          }
        }
      }
    }
  }

  .quick-actions-section {
    margin-bottom: 24px;

    h3 {
      margin-bottom: 16px;
      color: $text-primary;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      .action-card {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          color: $text-secondary;

          .el-icon {
            color: $primary-color;
          }

          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }

  .recent-orders-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        color: $text-primary;
      }
    }

    // 商品列表样式
    .product-list {
      .product-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;

        .product-image {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
        }

        .product-details {
          flex: 1;
          min-width: 0;

          .product-name {
            font-size: 12px;
            font-weight: 500;
            color: $text-primary;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .product-spec {
            font-size: 10px;
            color: $text-secondary;
            margin-bottom: 2px;
          }

          .product-quantity {
            font-size: 10px;
            color: $text-secondary;
          }
        }
      }

      .no-products {
        font-size: 12px;
        color: $text-secondary;
        text-align: center;
        padding: 8px 0;
      }
    }
  }
}

@media (max-width: 1200px) {
  .merchant-dashboard {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .quick-actions {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .merchant-dashboard {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
}
</style>