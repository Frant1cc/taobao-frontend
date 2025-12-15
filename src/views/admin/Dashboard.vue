<template>
  <div class="admin-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.newUserCount }}</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon order-icon">📦</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.newOrderCount }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon revenue-icon">�</div>
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.todayTransactionAmount }}</div>
          <div class="stat-label">交易额总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon completed-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedOrderCount }}</div>
          <div class="stat-label">已完成订单总数</div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminAPI } from '@/api'

const stats = reactive({
  completedOrderCount: 0,
  newOrderCount: 0,
  newUserCount: 0,
  todayTransactionAmount: 0
})

// 获取统计数据
const fetchStatistics = async () => {
  try {
    console.log('开始获取管理端统计数据')
    
    // 使用真实API获取统计数据
    const response = await adminAPI.getAdminDashboard()
    
    console.log('管理端统计数据响应:', response)
    
    // 更新统计数据
    Object.assign(stats, {
      completedOrderCount: response.completedOrderCount || 0,
      newOrderCount: response.newOrderCount || 0,
      newUserCount: response.newUserCount || 0,
      todayTransactionAmount: response.todayTransactionAmount || 0
    })
    
    console.log('统计数据更新完成:', stats)
    
  } catch (error: any) {
    console.error('获取管理端统计数据失败:', error)
    
    // 错误时使用默认数据，避免页面崩溃
    Object.assign(stats, {
      completedOrderCount: 1,
      newOrderCount: 32,
      newUserCount: 14,
      todayTransactionAmount: 272954.2
    })
    
    ElMessage.warning('统计数据加载失败，使用模拟数据')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
}

/* 数据概览卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 40px;
  margin-right: 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.user-icon { background: #e3f2fd; color: #1976d2; }
.order-icon { background: #e8f5e8; color: #388e3c; }
.revenue-icon { background: #fff3e0; color: #f57c00; }
.completed-icon { background: #e8f5e8; color: #4caf50; }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #666;
}



@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>