<template>
  <div class="audit-management">
    
    
    <!-- 审核列表 -->
    <div class="audit-list">
      <div class="list-header">
        <h3>审核列表</h3>
      </div>
      
      <div class="audit-items">
        <div 
          v-for="item in filteredAuditItems" 
          :key="item.id"
          class="audit-item"
          :class="item.status"
        >
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-info">
              <span>申请人：{{ item.applicant }}</span>
              <span>申请时间：{{ item.applyTime }}</span>
              <span v-if="(item as AuditItem).auditTime">审核时间：{{ (item as AuditItem).auditTime }}</span>
            </div>
          </div>
          <div class="item-actions">
            <el-button 
              v-if="item.status === 'pending'"
              size="small" 
              type="success"
              @click="handleAudit(item, 'approved')"
            >
              通过
            </el-button>
            <el-button 
              v-if="item.status === 'pending'"
              size="small" 
              type="danger"
              @click="handleAudit(item, 'rejected')"
            >
              拒绝
            </el-button>
            <el-tag 
              v-else 
              :type="item.status === 'approved' ? 'success' : 'danger'"
            >
              {{ item.status === 'approved' ? '已通过' : '已拒绝' }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 审核对话框 -->
    <el-dialog v-model="auditDialogVisible" :title="auditDialogTitle" width="500px">
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
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminAPI } from '@/api'

interface PendingMerchant {
  userId: number
  account: string
  userType: string
  status: string
  username: string | null
  createTime: string
  updateTime: string
}

interface AuditItem {
  id: number
  type: string
  title: string
  applicant: string
  applyTime: string
  auditTime?: string
  status: 'pending' | 'approved' | 'rejected'
  remark?: string
  icon: string
}

// 加载状态
const loading = ref(false)

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})



// 待审核商家列表
const pendingMerchants = ref<PendingMerchant[]>([])

// 状态映射函数
const mapStatus = (status: string): 'pending' | 'approved' | 'rejected' => {
  // 映射后端返回的状态到前端使用的状态
  const statusMap: Record<string, 'pending' | 'approved' | 'rejected'> = {
    'pending': 'pending',
    'inactive': 'pending', // 后端返回的inactive可能表示待审核
    'active': 'approved',
    'rejected': 'rejected'
  }
  return statusMap[status] || 'pending'
}

// 审核列表数据（转换为前端需要的格式）
const auditItems = computed(() => {
  return pendingMerchants.value.map((merchant) => ({
    id: merchant.userId,
    type: 'merchant_register',
    title: `商家注册申请 - ${merchant.username || merchant.account}`,
    applicant: merchant.username || merchant.account,
    applyTime: merchant.createTime,
    status: mapStatus(merchant.status),
    icon: '🏪'
  }))
})

// 审核对话框
const auditDialogVisible = ref(false)
const auditDialogTitle = ref('')
const auditForm = reactive({
  result: 'approved',
  remark: ''
})
let currentAuditItem: AuditItem | null = null

// 过滤后的审核项
const filteredAuditItems = computed(() => {
  return auditItems.value
})

// 加载待审核商家列表
const loadPendingMerchants = async () => {
  loading.value = true
  
  try {
    const response = await adminAPI.getPendingMerchantList({
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    
    pendingMerchants.value = response.list
    pagination.total = response.total
    
  } catch (error) {
    console.error('加载待审核商家列表失败:', error)
    ElMessage.error('加载待审核商家列表失败')
  } finally {
    loading.value = false
  }
}

// 处理审核
const handleAudit = async (item: AuditItem, result: string) => {
  if (result === 'approved') {
    // 直接通过
    try {
      await ElMessageBox.confirm(
        `确定要通过 "${item.title}" 的审核吗？`,
        '审核通过',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }
      )
      
      // 调用审核商家接口
      await adminAPI.auditMerchant({
        id: item.id,
        status: 'active'
      })
      
      // 从待审核列表中移除已审核的商家
      pendingMerchants.value = pendingMerchants.value.filter(merchant => merchant.userId !== item.id)
      ElMessage.success('审核通过成功')
      
    } catch (error) {
      if (error !== 'cancel') {
        console.error('审核通过失败:', error)
        ElMessage.error('审核通过失败')
      }
    }
  } else {
    // 拒绝审核，需要填写意见
    currentAuditItem = item
    auditForm.result = 'rejected'
    auditForm.remark = ''
    auditDialogTitle.value = `审核 - ${item.title}`
    auditDialogVisible.value = true
  }
}

// 提交审核
const submitAudit = async () => {
  if (!currentAuditItem) return
  
  try {
    // 调用审核商家接口
    await adminAPI.auditMerchant({
      id: currentAuditItem.id,
      status: auditForm.result === 'approved' ? 'active' : 'inactive'
    })
    
    // 从待审核列表中移除已审核的商家
    pendingMerchants.value = pendingMerchants.value.filter(
      merchant => merchant.userId !== currentAuditItem!.id
    )
    
    if (auditForm.remark) {
      ElMessage.success(`审核${auditForm.result === 'approved' ? '通过' : '拒绝'}成功，意见：${auditForm.remark}`)
    } else {
      ElMessage.success(`审核${auditForm.result === 'approved' ? '通过' : '拒绝'}成功`)
    }
    
    auditDialogVisible.value = false
    currentAuditItem = null
    auditForm.remark = ''
    
  } catch (error) {
    console.error('审核操作失败:', error)
    ElMessage.error('审核操作失败')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadPendingMerchants()
})
</script>

<style scoped>
.audit-management {
  padding: 0;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
}



/* 审核列表 */
.audit-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.list-header {
  margin-bottom: 20px;
}

.list-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.audit-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audit-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.audit-item:hover {
  border-color: #ff5021;
  box-shadow: 0 2px 8px rgba(255, 80, 33, 0.1);
}

.audit-item.pending {
  border-left: 4px solid #faad14;
  background: #fffbe6;
}

.audit-item.approved {
  border-left: 4px solid #52c41a;
  background: #f6ffed;
}

.audit-item.rejected {
  border-left: 4px solid #ff4d4f;
  background: #fff2f0;
}

.item-icon {
  font-size: 24px;
  margin-right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.item-info {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.item-remark {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.item-actions {
  min-width: 120px;
  text-align: right;
}

@media (max-width: 768px) {
  .list-header {
    margin-bottom: 15px;
  }
  
  .item-info {
    flex-direction: column;
    gap: 4px;
  }
  
  .audit-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .item-actions {
    text-align: left;
  }
}
</style>