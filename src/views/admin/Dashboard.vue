<template>
  <div class="admin-dashboard">
    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.newUserCount }}</div>
          <div class="stat-label">今日新增用户</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon order-icon">📦</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.newOrderCount }}</div>
          <div class="stat-label">今日新增订单</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon revenue-icon">�</div>
        <div class="stat-content">
          <div class="stat-value">¥{{ stats.todayTransactionAmount }}</div>
          <div class="stat-label">今日交易额</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon completed-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedOrderCount }}</div>
          <div class="stat-label">已完成订单</div>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>用户增长趋势</h3>
          <el-select v-model="userChartPeriod" size="small" style="width: 120px">
            <el-option label="近7天" value="7d" />
            <el-option label="近30天" value="30d" />
            <el-option label="近90天" value="90d" />
          </el-select>
        </div>
        <div class="chart-container">
          <div class="placeholder-chart">
            <div class="chart-bars">
              <div 
                v-for="(item, index) in userChartData" 
                :key="index"
                class="chart-bar"
                :style="{ height: item.value * 0.8 + '%' }"
              ></div>
            </div>
            <div class="chart-labels">
              <span v-for="(item, index) in userChartData" :key="index">
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="chart-header">
          <h3>商家分布</h3>
        </div>
        <div class="chart-container">
          <div class="placeholder-chart">
            <div class="pie-chart">
              <div class="pie-segment" style="--percentage: 40; --color: #ff6b35;"></div>
              <div class="pie-segment" style="--percentage: 25; --color: #4ecdc4;"></div>
              <div class="pie-segment" style="--percentage: 20; --color: #45b7d1;"></div>
              <div class="pie-segment" style="--percentage: 15; --color: #96ceb4;"></div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #ff6b35;"></span>
                <span>已认证 (40%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #4ecdc4;"></span>
                <span>待审核 (25%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #45b7d1;"></span>
                <span>审核中 (20%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #96ceb4;"></span>
                <span>已拒绝 (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最近活动 -->
    <div class="recent-activity">
      <div class="activity-card">
        <div class="card-header">
          <h3>最近活动</h3>
          <router-link to="/admin/audit" class="view-all">查看全部</router-link>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <div class="activity-status" :class="activity.status">
              {{ activity.statusText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminAPI } from '@/api'

const userChartPeriod = ref('7d')

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

const userChartData = ref([
  { label: '周一', value: 45 },
  { label: '周二', value: 52 },
  { label: '周三', value: 48 },
  { label: '周四', value: 60 },
  { label: '周五', value: 75 },
  { label: '周六', value: 82 },
  { label: '周日', value: 68 }
])

const recentActivities = ref([
  {
    id: 1,
    icon: '👤',
    title: '新用户注册',
    time: '5分钟前',
    status: 'success',
    statusText: '已完成'
  },
  {
    id: 2,
    icon: '🏪',
    title: '商家申请审核',
    time: '15分钟前',
    status: 'warning',
    statusText: '待审核'
  },
  {
    id: 3,
    icon: '📦',
    title: '新订单生成',
    time: '30分钟前',
    status: 'success',
    statusText: '已完成'
  },
  {
    id: 4,
    icon: '⚠️',
    title: '用户投诉处理',
    time: '1小时前',
    status: 'error',
    statusText: '需处理'
  },
  {
    id: 5,
    icon: '✅',
    title: '商家认证通过',
    time: '2小时前',
    status: 'success',
    statusText: '已完成'
  }
])
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.user-icon { background: #e3f2fd; color: #1976d2; }
.order-icon { background: #e8f5e8; color: #388e3c; }
.revenue-icon { background: #fff3e0; color: #f57c00; }
.completed-icon { background: #e8f5e8; color: #4caf50; }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.chart-container {
  height: 200px;
}

.placeholder-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 120px;
  margin-bottom: 20px;
}

.chart-bar {
  width: 20px;
  background: linear-gradient(to top, #ff5021, #ff7d33);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  color: #666;
}

.pie-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #ff6b35 0% 40%,
    #4ecdc4 40% 65%,
    #45b7d1 65% 85%,
    #96ceb4 85% 100%
  );
  margin: 0 auto 20px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* 最近活动 */
.recent-activity {
  margin-bottom: 0;
}

.activity-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-all {
  font-size: 12px;
  color: #ff5021;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.3s;
}

.activity-item:hover {
  background: #f8f8f8;
}

.activity-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

.activity-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.activity-status.success {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.activity-status.warning {
  background: #fffbe6;
  color: #faad14;
  border: 1px solid #ffe58f;
}

.activity-status.error {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>