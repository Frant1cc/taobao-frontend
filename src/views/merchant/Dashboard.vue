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
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="product" label="商品" />
        <el-table-column prop="customer" label="买家" width="100" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="180" />
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
import { getShopInfo } from '@/api/modules/shop'
import type { ShopInfo } from '@/types/shop'

const userStore = useUserStore()
const currentDate = ref(new Date().toLocaleDateString('zh-CN'))

// 用户信息（从用户仓库获取）
const userInfo = computed(() => userStore.userInfo)

// 店铺信息
const shopInfo = ref<ShopInfo | null>(null)

// 数据概览（使用模拟数据，因为统计接口不存在）
const revenue = ref(12568.5)
const orders = ref(42)
const visitors = ref(1568)
const products = ref(28)

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
    
    // 获取店铺信息
    const shopResponse = await getShopInfo()
    if (shopResponse.code === 200) {
      shopInfo.value = shopResponse.data
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})

const recentOrders = ref([
  {
    id: '20241215001',
    product: '新款智能手机',
    customer: '张先生',
    amount: 2999,
    status: '待发货',
    time: '2024-12-15 10:30:25'
  },
  {
    id: '20241215002',
    product: '无线蓝牙耳机',
    customer: '李女士',
    amount: 399,
    status: '已发货',
    time: '2024-12-15 09:15:42'
  },
  {
    id: '20241215003',
    product: '笔记本电脑',
    customer: '王先生',
    amount: 5999,
    status: '已完成',
    time: '2024-12-14 16:20:18'
  },
  {
    id: '20241215004',
    product: '智能手表',
    customer: '赵女士',
    amount: 1299,
    status: '待付款',
    time: '2024-12-14 14:45:33'
  }
])

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '待付款': 'warning',
    '待发货': 'primary',
    '已发货': 'success',
    '已完成': 'info'
  }
  return statusMap[status] || 'info'
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