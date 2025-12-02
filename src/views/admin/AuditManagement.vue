<template>
  <div class="audit-management">
    <!-- 审核统计 -->
    <div class="audit-stats">
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingCount }}</div>
          <div class="stat-label">待审核</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.approvedCount }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">❌</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.rejectedCount }}</div>
          <div class="stat-label">已拒绝</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalCount }}</div>
          <div class="stat-label">总审核数</div>
        </div>
      </div>
    </div>
    
    <!-- 审核列表 -->
    <div class="audit-list">
      <div class="list-header">
        <h3>审核列表</h3>
        <div class="header-actions">
          <el-select v-model="filterType" placeholder="审核类型" clearable>
            <el-option label="商家注册" value="merchant_register" />
            <el-option label="商品上架" value="product_publish" />
            <el-option label="资质认证" value="qualification" />
          </el-select>
          <el-select v-model="filterStatus" placeholder="审核状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </div>
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
              <span v-if="item.auditTime">审核时间：{{ item.auditTime }}</span>
            </div>
            <div v-if="item.remark" class="item-remark">
              审核意见：{{ item.remark }}
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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

// 筛选条件
const filterType = ref('')
const filterStatus = ref('')

// 审核统计
const stats = reactive({
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  totalCount: 0
})

// 审核列表数据
const auditItems = ref<AuditItem[]>([
  {
    id: 1,
    type: 'merchant_register',
    title: '商家注册申请 - 时尚女装店',
    applicant: '张美丽',
    applyTime: '2024-03-20 10:30:00',
    status: 'pending',
    icon: '🏪'
  },
  {
    id: 2,
    type: 'product_publish',
    title: '商品上架申请 - iPhone 15 Pro',
    applicant: '数码科技旗舰店',
    applyTime: '2024-03-20 09:15:00',
    auditTime: '2024-03-20 14:20:00',
    status: 'approved',
    remark: '商品信息完整，图片清晰',
    icon: '📱'
  },
  {
    id: 3,
    type: 'qualification',
    title: '资质认证申请 - 食品经营许可证',
    applicant: '美食特产店',
    applyTime: '2024-03-19 16:45:00',
    auditTime: '2024-03-20 08:30:00',
    status: 'rejected',
    remark: '证件照片模糊，请重新上传',
    icon: '📄'
  },
  {
    id: 4,
    type: 'merchant_register',
    title: '商家注册申请 - 家居生活馆',
    applicant: '赵家居',
    applyTime: '2024-03-19 14:20:00',
    status: 'pending',
    icon: '🏪'
  }
])

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
  let items = auditItems.value
  
  if (filterType.value) {
    items = items.filter(item => item.type === filterType.value)
  }
  
  if (filterStatus.value) {
    items = items.filter(item => item.status === filterStatus.value)
  }
  
  return items
})

// 更新统计信息
const updateStats = () => {
  stats.pendingCount = auditItems.value.filter(item => item.status === 'pending').length
  stats.approvedCount = auditItems.value.filter(item => item.status === 'approved').length
  stats.rejectedCount = auditItems.value.filter(item => item.status === 'rejected').length
  stats.totalCount = auditItems.value.length
}

// 处理审核
const handleAudit = (item: AuditItem, result: string) => {
  if (result === 'approved') {
    // 直接通过
    ElMessageBox.confirm(
      `确定要通过 "${item.title}" 的审核吗？`,
      '审核通过',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }
    ).then(() => {
      item.status = 'approved'
      item.auditTime = new Date().toLocaleString('zh-CN')
      updateStats()
      ElMessage.success('审核通过成功')
    }).catch(() => {
      // 用户取消操作
    })
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
currentAuditItem.status = auditForm.result as 'pending' | 'approved' | 'rejected'
    currentAuditItem.auditTime = new Date().toLocaleString('zh-CN')
    
    if (auditForm.remark) {
      currentAuditItem.remark = auditForm.remark
    }
    
    updateStats()
    
    if (auditForm.remark) {
      ElMessage.success(`审核${auditForm.result === 'approved' ? '通过' : '拒绝'}成功，意见：${auditForm.remark}`)
    } else {
      ElMessage.success(`审核${auditForm.result === 'approved' ? '通过' : '拒绝'}成功`)
    }
    
    auditDialogVisible.value = false
    currentAuditItem = null
    auditForm.remark = ''
    
  } catch (error) {
    ElMessage.error('审核操作失败')
  }
}

// 初始化统计信息
updateStats()
</script>

<style scoped>
.audit-management {
  padding: 0;
  min-height: calc(100vh - 60px);
  background: #f5f5f5;
}

/* 审核统计 */
.audit-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
  background: #f5f5f5;
}

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

/* 审核列表 */
.audit-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
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
  .audit-stats {
    grid-template-columns: 1fr;
  }
  
  .list-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .header-actions {
    justify-content: flex-start;
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