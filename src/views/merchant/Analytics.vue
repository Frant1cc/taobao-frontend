<template>
  <div class="merchant-analytics">
    <!-- 页面标题和时间筛选 -->
    <div class="page-header">
      <h2>数据分析</h2>
      <div class="time-filter">
        <el-radio-group v-model="timeRange" @change="handleTimeChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="quarter">本季度</el-radio-button>
          <el-radio-button label="year">本年</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px; margin-left: 12px"
          @change="handleCustomDateChange"
        />
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="metrics-grid">
      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon revenue">
            <el-icon><Money /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">¥{{ formatNumber(stats.totalRevenue) }}</div>
            <div class="metric-label">总销售额</div>
            <div class="metric-change" :class="getChangeClass(stats.revenueChange)">
              {{ stats.revenueChange > 0 ? '+' : '' }}{{ stats.revenueChange }}%
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon orders">
            <el-icon><Document /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ formatNumber(stats.totalOrders) }}</div>
            <div class="metric-label">总订单数</div>
            <div class="metric-change" :class="getChangeClass(stats.ordersChange)">
              {{ stats.ordersChange > 0 ? '+' : '' }}{{ stats.ordersChange }}%
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon visitors">
            <el-icon><User /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ formatNumber(stats.totalVisitors) }}</div>
            <div class="metric-label">店铺访客</div>
            <div class="metric-change" :class="getChangeClass(stats.visitorsChange)">
              {{ stats.visitorsChange > 0 ? '+' : '' }}{{ stats.visitorsChange }}%
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card">
        <div class="metric-content">
          <div class="metric-icon conversion">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ stats.conversionRate }}%</div>
            <div class="metric-label">转化率</div>
            <div class="metric-change" :class="getChangeClass(stats.conversionChange)">
              {{ stats.conversionChange > 0 ? '+' : '' }}{{ stats.conversionChange }}%
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 销售趋势图表 -->
    <el-card class="chart-card">
      <template #header>
        <div class="chart-header">
          <h3>销售趋势</h3>
          <el-radio-group v-model="chartType" size="small">
            <el-radio-button label="revenue">销售额</el-radio-button>
            <el-radio-button label="orders">订单数</el-radio-button>
            <el-radio-button label="visitors">访客数</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-container">
        <div ref="salesChart" class="chart" style="height: 300px;"></div>
      </div>
    </el-card>

    <!-- 商品销售排行 -->
    <div class="charts-row">
      <el-card class="half-card">
        <template #header>
          <h3>商品销售排行</h3>
        </template>
        <el-table :data="productRankings" style="width: 100%">
          <el-table-column label="排名" width="60">
            <template #default="{ $index }">
              <span class="rank" :class="getRankClass($index + 1)">
                {{ $index + 1 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称">
            <template #default="{ row }">
              <div class="product-info">
                <el-image
                  :src="row.image"
                  :alt="row.name"
                  fit="cover"
                  class="product-image"
                />
                <span class="product-name">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="销售额" width="120">
            <template #default="{ row }">
              ¥{{ formatNumber(row.revenue) }}
            </template>
          </el-table-column>
          <el-table-column label="销量" width="100">
            <template #default="{ row }">
              {{ row.sales }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 流量来源分析 -->
      <el-card class="half-card">
        <template #header>
          <h3>流量来源</h3>
        </template>
        <div class="traffic-chart-container">
          <div ref="trafficChart" class="chart" style="height: 300px;"></div>
        </div>
      </el-card>
    </div>

    <!-- 客户分析 -->
    <el-card class="chart-card">
      <template #header>
        <h3>客户分析</h3>
      </template>
      <div class="customer-stats">
        <div class="customer-metric">
          <div class="metric-value">{{ stats.newCustomers }}</div>
          <div class="metric-label">新客户</div>
        </div>
        <div class="customer-metric">
          <div class="metric-value">{{ stats.returningCustomers }}</div>
          <div class="metric-label">回头客</div>
        </div>
        <div class="customer-metric">
          <div class="metric-value">{{ stats.averageOrderValue }}</div>
          <div class="metric-label">客单价(元)</div>
        </div>
        <div class="customer-metric">
          <div class="metric-value">{{ stats.repeatPurchaseRate }}%</div>
          <div class="metric-label">复购率</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  Money,
  Document,
  User,
  TrendCharts
} from '@element-plus/icons-vue'

// 时间筛选
const timeRange = ref('week')
const customDateRange = ref([])

// 图表类型
const chartType = ref('revenue')

// 图表实例
const salesChart = ref<HTMLElement>()
const trafficChart = ref<HTMLElement>()
let salesChartInstance: echarts.ECharts | null = null
let trafficChartInstance: echarts.ECharts | null = null

// 统计数据
const stats = ref({
  totalRevenue: 125680,
  totalOrders: 456,
  totalVisitors: 12345,
  conversionRate: 3.7,
  revenueChange: 12.5,
  ordersChange: 8.3,
  visitorsChange: 15.2,
  conversionChange: 2.1,
  newCustomers: 234,
  returningCustomers: 122,
  averageOrderValue: 275,
  repeatPurchaseRate: 26.8
})

// 商品销售排行
const productRankings = ref([
  {
    id: '1',
    name: '新款智能手机',
    image: 'https://via.placeholder.com/40x40',
    revenue: 56800,
    sales: 189
  },
  {
    id: '2',
    name: '无线蓝牙耳机',
    image: 'https://via.placeholder.com/40x40',
    revenue: 35600,
    sales: 89
  },
  {
    id: '3',
    name: '笔记本电脑',
    image: 'https://via.placeholder.com/40x40',
    revenue: 29900,
    sales: 50
  },
  {
    id: '4',
    name: '智能手表',
    image: 'https://via.placeholder.com/40x40',
    revenue: 15600,
    sales: 120
  },
  {
    id: '5',
    name: '时尚连衣裙',
    image: 'https://via.placeholder.com/40x40',
    revenue: 9800,
    sales: 49
  }
])

// 方法
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const getChangeClass = (change: number) => {
  if (change > 0) return 'positive'
  if (change < 0) return 'negative'
  return 'neutral'
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-1'
  if (rank === 2) return 'rank-2'
  if (rank === 3) return 'rank-3'
  return 'rank-other'
}

const handleTimeChange = () => {
  // 根据时间范围更新数据
  loadData()
}

const handleCustomDateChange = () => {
  if (customDateRange.value && customDateRange.value.length === 2) {
    timeRange.value = 'custom'
    loadData()
  }
}

const loadData = () => {
  // 模拟数据加载
  console.log('加载数据，时间范围:', timeRange.value)
}

// 初始化图表
const initCharts = () => {
  if (salesChart.value) {
    salesChartInstance = echarts.init(salesChart.value)
    const salesOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['销售额', '订单数', '访客数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['12-08', '12-09', '12-10', '12-11', '12-12', '12-13', '12-14']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '销售额',
          type: 'line',
          data: [12000, 18000, 15000, 22000, 19000, 25000, 21000],
          smooth: true,
          lineStyle: {
            color: '#ff6b35'
          },
          itemStyle: {
            color: '#ff6b35'
          }
        },
        {
          name: '订单数',
          type: 'line',
          data: [32, 45, 38, 52, 48, 60, 55],
          smooth: true,
          yAxisIndex: 1,
          lineStyle: {
            color: '#409eff'
          },
          itemStyle: {
            color: '#409eff'
          }
        },
        {
          name: '访客数',
          type: 'line',
          data: [1200, 1500, 1300, 1800, 1600, 2000, 1900],
          smooth: true,
          yAxisIndex: 1,
          lineStyle: {
            color: '#67c23a'
          },
          itemStyle: {
            color: '#67c23a'
          }
        }
      ]
    }
    salesChartInstance.setOption(salesOption)
  }

  if (trafficChart.value) {
    trafficChartInstance = echarts.init(trafficChart.value)
    const trafficOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '流量来源',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 40, name: '搜索流量' },
            { value: 25, name: '推荐流量' },
            { value: 15, name: '直接访问' },
            { value: 10, name: '社交媒体' },
            { value: 10, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    trafficChartInstance.setOption(trafficOption)
  }
}

// 响应式调整图表大小
const resizeCharts = () => {
  salesChartInstance?.resize()
  trafficChartInstance?.resize()
}

onMounted(() => {
  nextTick(() => {
    initCharts()
    window.addEventListener('resize', resizeCharts)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
  salesChartInstance?.dispose()
  trafficChartInstance?.dispose()
})
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

.merchant-analytics {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      color: $text-primary;
    }

    .time-filter {
      display: flex;
      align-items: center;
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .metric-card {
      .metric-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .metric-icon {
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
          &.conversion { background: #f56c6c; }
        }

        .metric-info {
          flex: 1;

          .metric-value {
            font-size: 24px;
            font-weight: 600;
            color: $text-primary;
            margin-bottom: 4px;
          }

          .metric-label {
            font-size: 14px;
            color: $text-secondary;
            margin-bottom: 4px;
          }

          .metric-change {
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

  .chart-card {
    margin-bottom: 24px;

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
      }
    }

    .chart-container {
      .chart {
        width: 100%;
      }
    }
  }

  .charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;

    .half-card {
      .product-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .product-image {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
        }

        .product-name {
          font-size: 14px;
        }
      }

      .rank {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        font-weight: 600;

        &.rank-1 { background: #ffd700; color: #fff; }
        &.rank-2 { background: #c0c0c0; color: #fff; }
        &.rank-3 { background: #cd7f32; color: #fff; }
        &.rank-other { background: $gray-light; color: $text-secondary; }
      }

      .traffic-chart-container {
        .chart {
          width: 100%;
        }
      }
    }
  }

  .customer-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    text-align: center;

    .customer-metric {
      .metric-value {
        font-size: 32px;
        font-weight: 600;
        color: $primary-color;
        margin-bottom: 8px;
      }

      .metric-label {
        font-size: 14px;
        color: $text-secondary;
      }
    }
  }
}

@media (max-width: 1200px) {
  .merchant-analytics {
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .charts-row {
      grid-template-columns: 1fr;
    }

    .customer-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .merchant-analytics {
    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .customer-stats {
      grid-template-columns: 1fr;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .time-filter {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  }
}
</style>