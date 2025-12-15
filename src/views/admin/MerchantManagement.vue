<template>
  <div class="merchant-management no-focus-all">
    <!-- 商家列表 -->
    <div class="merchant-list">
      <el-table :data="merchantList" v-loading="loading" style="width: 100%">
        <el-table-column prop="merchant_id" label="商家ID" width="150" />
        <el-table-column prop="store_name" label="店铺名称" min-width="300" />
        <el-table-column prop="status" label="审核状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewMerchantDetail(row)">
              查看
            </el-button>
            <el-button size="small" type="primary" @click="openEditDialog(row)">
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
              @click="toggleMerchantStatus(row, 'disable')"
            >
              禁用
            </el-button>
            <el-button 
              v-if="row.status === 'disabled'"
              size="small" 
              type="success"
              @click="toggleMerchantStatus(row, 'enable')"
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
    <el-dialog v-model="detailVisible" title="商家详情" width="500px">
      <div v-if="currentMerchant" class="merchant-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="商家ID">{{ currentMerchant.merchant_id }}</el-descriptions-item>
            <el-descriptions-item label="店铺名称">{{ currentMerchant.store_name }}</el-descriptions-item>
            <el-descriptions-item label="商家类型">{{ getMerchantTypeText(currentMerchant.merchant_type) }}</el-descriptions-item>
            <el-descriptions-item label="审核状态">{{ getStatusText(currentMerchant.status) }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <h4>其他信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="手机号">{{ currentMerchant.phone || '未提供' }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ currentMerchant.create_time || '未提供' }}</el-descriptions-item>
          </el-descriptions>
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
    
    <!-- 编辑商家对话框 -->
    <el-dialog v-model="editVisible" :title="editDialogTitle" width="500px">
      <el-form 
        ref="editFormRef" 
        :model="editForm" 
        :rules="editRules" 
        label-width="80px"
      >
        <el-form-item label="店铺名称" prop="store_name">
          <el-input v-model="editForm.store_name" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { adminAPI } from '@/api'

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

// 编辑相关
const editVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editDialogTitle = ref('编辑商家')
const editForm = reactive({
  merchant_id: 0,
  store_name: ''
})

// 编辑表单验证规则
const editRules: FormRules = {
  store_name: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 2, max: 50, message: '店铺名称长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}


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
    disabled: 'info',
    // 添加其他可能的状态值
    active: 'success',
    inactive: 'info'
  }
  
  // 如果找不到对应的类型，默认使用 'info'
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
    // 调用真实API获取商家列表
    const response = await adminAPI.getMerchantList({
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    
    // 根据后端返回的数据格式进行转换，只渲染后端返回的字段
    merchantList.value = response.list.map((user: any) => ({
      merchant_id: user.userId || 0,
      store_name: user.username || '未命名店铺', // 使用账号作为店铺名称
      merchant_name: user.account || '未知商家', // 使用账号作为商家姓名
      phone: user.phone || '', // 后端未返回手机号，设为空
      merchant_type: 'personal', // 后端未返回商家类型，默认个人商家
      status: user.status === 'active' ? 'approved' : user.status === 'inactive' ? 'disabled' : 'pending', // 转换状态
      product_count: 0, // 后端未返回商品数量
      order_count: 0, // 后端未返回订单数量
      total_sales: 0, // 后端未返回总销售额
      customer_count: 0, // 后端未返回客户数量
      create_time: user.createTime || '', // 后端未返回注册时间
      last_login: '', // 后端未返回最后登录时间
      store_description: '', // 后端未返回店铺描述
      store_address: '', // 后端未返回店铺地址
      business_license: '未上传' // 后端未返回营业执照信息
    }))
    
    pagination.total = response.total
    
  } catch (error) {
    console.error('加载商家列表失败:', error)
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

// 打开编辑对话框
const openEditDialog = (merchant: Merchant) => {
  editDialogTitle.value = `编辑商家 - ${merchant.store_name}`
  editForm.merchant_id = merchant.merchant_id
  editForm.store_name = merchant.store_name
  editVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return
  
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 调用真实API更新用户信息（商家就是不同身份的用户）
    await adminAPI.putAdminUserUpdate({
      id: editForm.merchant_id,
      username: editForm.store_name
    })
    
    // 更新本地商家数据
    const merchantIndex = merchantList.value.findIndex(merchant => merchant.merchant_id === editForm.merchant_id)
    if (merchantIndex !== -1) {
      if (merchantList.value[merchantIndex]) {
        merchantList.value[merchantIndex].store_name = editForm.store_name
      }
    }
    
    ElMessage.success('商家信息更新成功')
    editVisible.value = false
    
  } catch (error) {
    console.error('更新商家信息失败:', error)
    ElMessage.error('更新商家信息失败')
  } finally {
    loading.value = false
  }
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
    ).then(async () => {
      try {
        // 调用新的审核商家接口
        await adminAPI.auditMerchant({
          id: merchant.merchant_id,
          status: 'active' // 通过审核，状态设为active
        })
        
        merchant.status = 'approved'
        ElMessage.success('审核通过成功')
      } catch (error) {
        console.error('审核通过失败:', error)
        ElMessage.error('审核通过失败')
      }
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
    // 根据审核结果确定状态值
    const statusMap = {
      'approved': 'active',
      'rejected': 'inactive'
    }
    
    // 调用新的审核商家接口
    await adminAPI.auditMerchant({
      id: auditMerchant.merchant_id,
      status: statusMap[auditForm.result as keyof typeof statusMap] || 'inactive'
    })
    
    // 更新本地状态
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
    console.error('审核操作失败:', error)
    ElMessage.error('审核操作失败')
  }
}

// 切换商家状态（启用/禁用）
const toggleMerchantStatus = async (merchant: Merchant, actionType: 'enable' | 'disable') => {
  const action = actionType === 'disable' ? '禁用' : '启用'
  const newStatus = actionType === 'disable' ? 'inactive' : 'active'
  const targetStatus = actionType === 'disable' ? 'disabled' : 'approved'
  
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
    
    // 调用新的审核商家接口进行状态切换
    await adminAPI.auditMerchant({
      id: merchant.merchant_id,
      status: newStatus
    })
    
    // 更新本地状态
    merchant.status = targetStatus
    ElMessage.success(`${action}商家成功`)
    
  } catch (error) {
    console.error('切换商家状态失败:', error)
    
    // 如果是用户取消操作，不显示错误信息
    if (error !== 'cancel') {
      ElMessage.error(`${action}商家失败`)
    }
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