<template>
  <div class="merchant-management no-focus-all">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商家ID、店铺名称、手机号"
          style="width: 300px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><search /></el-icon>
            </el-button>
          </template>
        </el-input>
        
        <div class="filter-controls">
          <el-select v-model="filterStatus" placeholder="审核状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="审核通过" value="approved" />
            <el-option label="审核拒绝" value="rejected" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
          
          <el-select v-model="filterType" placeholder="商家类型" clearable>
            <el-option label="个人商家" value="personal" />
            <el-option label="企业商家" value="enterprise" />
          </el-select>
          
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="注册开始日期"
            end-placeholder="注册结束日期"
            value-format="YYYY-MM-DD"
          />
        </div>
      </div>
      
      <div class="action-buttons">
        <el-button type="primary" @click="handleSearch">
          <el-icon><search /></el-icon>
          搜索
        </el-button>
        <el-button @click="resetFilters">
          <el-icon><refresh /></el-icon>
          重置
        </el-button>
        <el-button type="success" @click="exportMerchants">
          <el-icon><download /></el-icon>
          导出数据
        </el-button>
      </div>
    </div>
    
    <!-- 商家列表 -->
    <div class="merchant-list">
      <el-table :data="merchantList" v-loading="loading" style="width: 100%">
        <el-table-column prop="merchant_id" label="商家ID" width="100" />
        <el-table-column prop="store_name" label="店铺名称" width="150" />
        <el-table-column prop="merchant_name" label="商家姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="merchant_type" label="商家类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.merchant_type === 'enterprise' ? 'success' : ''">
              {{ getMerchantTypeText(row.merchant_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="product_count" label="商品数量" width="100" />
        <el-table-column prop="order_count" label="订单数量" width="100" />
        <el-table-column prop="create_time" label="注册时间" width="160" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewMerchantDetail(row)">
              查看
            </el-button>
            <el-button size="small" type="primary" @click="editMerchant(row)">
              编辑
            </el-button>
            <el-button 
              v-if="row.status === 'pending'"
              size="small" 
              type="success"
              @click="handleAudit(row, 'approved')"
            >
              通过
            </el-button>
            <el-button 
              v-if="row.status === 'pending'"
              size="small" 
              type="danger"
              @click="handleAudit(row, 'rejected')"
            >
              拒绝
            </el-button>
            <el-button 
              v-if="row.status === 'approved'"
              size="small" 
              type="warning"
              @click="toggleMerchantStatus(row)"
            >
              禁用
            </el-button>
            <el-button 
              v-if="row.status === 'disabled'"
              size="small" 
              type="success"
              @click="toggleMerchantStatus(row)"
            >
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
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
    </div>
    
    <!-- 商家详情对话框 -->
    <el-dialog v-model="detailVisible" title="商家详情" width="700px">
      <div v-if="currentMerchant" class="merchant-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="商家ID">{{ currentMerchant.merchant_id }}</el-descriptions-item>
            <el-descriptions-item label="店铺名称">{{ currentMerchant.store_name }}</el-descriptions-item>
            <el-descriptions-item label="商家姓名">{{ currentMerchant.merchant_name }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ currentMerchant.phone }}</el-descriptions-item>
            <el-descriptions-item label="商家类型">{{ getMerchantTypeText(currentMerchant.merchant_type) }}</el-descriptions-item>
            <el-descriptions-item label="审核状态">{{ getStatusText(currentMerchant.status) }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ currentMerchant.create_time }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ currentMerchant.last_login }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <h4>店铺信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="店铺描述">{{ currentMerchant.store_description || '暂无描述' }}</el-descriptions-item>
            <el-descriptions-item label="店铺地址">{{ currentMerchant.store_address || '暂无地址' }}</el-descriptions-item>
            <el-descriptions-item label="营业执照">{{ currentMerchant.business_license || '未上传' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <h4>经营数据</h4>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ currentMerchant.product_count || 0 }}</div>
                <div class="stat-label">商品数量</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ currentMerchant.order_count || 0 }}</div>
                <div class="stat-label">订单数量</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">¥{{ currentMerchant.total_sales || 0 }}</div>
                <div class="stat-label">总销售额</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ currentMerchant.customer_count || 0 }}</div>
                <div class="stat-label">客户数量</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 审核对话框 -->
    <el-dialog v-model="auditVisible" :title="auditTitle" width="500px">
      <el-form :model="auditForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            v-model="auditForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见（选填）"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'

interface Merchant {
  merchant_id: number
  store_name: string
  merchant_name: string
  phone: string
  merchant_type: 'personal' | 'enterprise'
  status: 'pending' | 'approved' | 'rejected' | 'disabled'
  product_count: number
  order_count: number
  total_sales: number
  customer_count: number
  create_time: string
  last_login: string
  store_description?: string
  store_address?: string
  business_license?: string
}

// 搜索和筛选
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const dateRange = ref([])

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 商家列表
const merchantList = ref<Merchant[]>([])
const loading = ref(false)
const detailVisible = ref(false)
const currentMerchant = ref<Merchant | null>(null)

// 审核相关
const auditVisible = ref(false)
const auditForm = reactive({
  result: 'approved',
  remark: ''
})
let auditMerchant: Merchant | null = null

// 模拟商家数据
const mockMerchants: Merchant[] = [
  {
    merchant_id: 20001,
    store_name: '时尚女装店',
    merchant_name: '张美丽',
    phone: '13800138001',
    merchant_type: 'personal',
    status: 'pending',
    product_count: 0,
    order_count: 0,
    total_sales: 0,
    customer_count: 0,
    create_time: '2024-03-15 10:30:00',
    last_login: '2024-03-20 14:25:00',
    store_description: '主营时尚女装、配饰等',
    store_address: '北京市朝阳区建国路88号',
    business_license: '已上传'
  },
  {
    merchant_id: 20002,
    store_name: '数码科技旗舰店',
    merchant_name: '李科技',
    phone: '13800138002',
    merchant_type: 'enterprise',
    status: 'approved',
    product_count: 156,
    order_count: 289,
    total_sales: 125600,
    customer_count: 89,
    create_time: '2024-02-20 09:15:00',
    last_login: '2024-03-20 16:40:00',
    store_description: '专业数码产品供应商',
    store_address: '深圳市南山区科技园',
    business_license: '已上传'
  },
  {
    merchant_id: 20003,
    store_name: '美食特产店',
    merchant_name: '王美食',
    phone: '13800138003',
    merchant_type: 'personal',
    status: 'rejected',
    product_count: 0,
    order_count: 0,
    total_sales: 0,
    customer_count: 0,
    create_time: '2024-03-10 14:20:00',
    last_login: '2024-03-18 11:10:00',
    store_description: '各地特色美食',
    store_address: '上海市黄浦区南京路',
    business_license: '未上传'
  },
  {
    merchant_id: 20004,
    store_name: '家居生活馆',
    merchant_name: '赵家居',
    phone: '13800138004',
    merchant_type: 'enterprise',
    status: 'disabled',
    product_count: 45,
    order_count: 67,
    total_sales: 28900,
    customer_count: 23,
    create_time: '2024-01-10 16:45:00',
    last_login: '2024-03-15 09:00:00',
    store_description: '高品质家居用品',
    store_address: '广州市天河区珠江新城',
    business_license: '已上传'
  }
]

// 获取商家类型文本
const getMerchantTypeText = (type: string) => {
  const texts: Record<string, string> = {
    personal: '个人商家',
    enterprise: '企业商家'
  }
  return texts[type] || type
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const tags: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    disabled: 'info'
  }
  return tags[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待审核',
    approved: '审核通过',
    rejected: '审核拒绝',
    disabled: '已禁用'
  }
  return texts[status] || status
}

// 审核标题
const auditTitle = computed(() => {
  if (!auditMerchant) return ''
  return `审核商家 - ${auditMerchant.store_name}`
})

// 搜索商家
const handleSearch = () => {
  pagination.current = 1
  loadMerchants()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  dateRange.value = []
  handleSearch()
}

// 加载商家列表
const loadMerchants = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟筛选逻辑
    let filteredMerchants = [...mockMerchants]
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredMerchants = filteredMerchants.filter(merchant => 
        merchant.merchant_id.toString().includes(query) ||
        merchant.store_name.toLowerCase().includes(query) ||
        merchant.phone.includes(query)
      )
    }
    
    if (filterStatus.value) {
      filteredMerchants = filteredMerchants.filter(merchant => merchant.status === filterStatus.value)
    }
    
    if (filterType.value) {
      filteredMerchants = filteredMerchants.filter(merchant => merchant.merchant_type === filterType.value)
    }
    
    // 模拟分页
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size
    merchantList.value = filteredMerchants.slice(start, end)
    pagination.total = filteredMerchants.length
    
  } catch (error) {
    ElMessage.error('加载商家列表失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadMerchants()
}

const handleCurrentChange = (page: number) => {
  pagination.current = page
  loadMerchants()
}

// 查看商家详情
const viewMerchantDetail = (merchant: Merchant) => {
  currentMerchant.value = merchant
  detailVisible.value = true
}

// 编辑商家
const editMerchant = (merchant: Merchant) => {
  ElMessage.info(`编辑商家 ${merchant.store_name} 功能开发中`)
}

// 处理审核
const handleAudit = (merchant: Merchant, result: string) => {
  if (result === 'approved') {
    // 直接通过
    ElMessageBox.confirm(
      `确定要通过商家 "${merchant.store_name}" 的审核吗？`,
      '审核通过',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }
    ).then(() => {
      merchant.status = 'approved'
      ElMessage.success('审核通过成功')
    }).catch(() => {
      // 用户取消操作
    })
  } else {
    // 拒绝审核，需要填写意见
    auditMerchant = merchant
    auditForm.result = 'rejected'
    auditForm.remark = ''
    auditVisible.value = true
  }
}

// 提交审核
const submitAudit = async () => {
  if (!auditMerchant) return
  
  try {
    auditMerchant.status = auditForm.result as 'approved' | 'pending' | 'rejected' | 'disabled'
    
    if (auditForm.remark) {
      ElMessage.success(`审核${auditForm.result === 'approved' ? '通过' : '拒绝'}成功，意见：${auditForm.remark}`)
    } else {
      ElMessage.success(`审核${auditForm.result === 'approved' ? '通过' : '拒绝'}成功`)
    }
    
    auditVisible.value = false
    auditMerchant = null
    auditForm.remark = ''
    
  } catch (error) {
    ElMessage.error('审核操作失败')
  }
}

// 切换商家状态
const toggleMerchantStatus = async (merchant: Merchant) => {
  const action = merchant.status === 'approved' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}商家 "${merchant.store_name}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟状态切换
    merchant.status = merchant.status === 'approved' ? 'disabled' : 'approved'
    ElMessage.success(`${action}商家成功`)
    
  } catch {
    // 用户取消操作
  }
}

// 导出商家数据
const exportMerchants = () => {
  ElMessage.success('导出功能开发中')
}

onMounted(() => {
  loadMerchants()
})
</script>

<style scoped>
.merchant-management {
  padding: 0;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
}

.filter-controls {
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* 商家列表 */
.merchant-list {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

}

.pagination {
  padding: 20px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}

/* 商家详情 */
.merchant-detail {
  max-height: 500px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #ff5021;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    justify-content: flex-start;
  }
}
</style>

<style lang="scss">
// 专门针对商家管理页面的焦点样式覆盖
.merchant-management.no-focus-all {
  // 移除所有交互元素的焦点边框
  *:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  
  // 按钮相关
  .el-button {
    &:focus,
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  
  // 下拉菜单相关
  .el-dropdown {
    .el-button:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  
  .el-dropdown-menu {
    .el-dropdown-menu__item {
      &:focus {
        outline: none !important;
        background-color: #f5f7fa !important;
      }
      
      &:hover {
        background-color: #f5f7fa !important;
      }
    }
  }
  
  // 表单相关
  .el-input,
  .el-select,
  .el-textarea {
    .el-input__wrapper {
      &:focus-within {
        outline: none !important;
        box-shadow: none !important;
        border-color: #DCDFE6 !important;
      }
      
      &.is-focus {
        box-shadow: none !important;
        border-color: #ff5000 !important;
      }
    }
  }
  
  // 表格相关
  .el-table {
    .el-button {
      &:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    }
  }
}
</style>