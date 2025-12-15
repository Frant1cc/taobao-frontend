<template>
  <div class="user-management no-focus-all">
    <!-- 用户列表 -->
    <div class="user-list">
      <el-table :data="userList" v-loading="loading" style="width: 100%">
        <el-table-column prop="user_id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="user_type" label="用户类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getUserTypeTag(row.user_type)">
              {{ getUserTypeText(row.user_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" effect="light">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="注册时间" width="160" />
        <el-table-column prop="last_login" label="最后登录" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewUserDetail(row)">
              查看
            </el-button>
            <el-button size="small" type="primary" @click="openEditDialog(row)">
          编辑
        </el-button>
            <el-button 
              size="small" 
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="toggleUserStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
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
    
    <!-- 用户详情对话框 -->
    <el-dialog v-model="detailVisible" title="用户详情" width="600px">
      <div v-if="currentUser" class="user-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户ID">{{ currentUser.user_id }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
            <el-descriptions-item label="用户类型">{{ getUserTypeText(currentUser.user_type) }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ getStatusText(currentUser.status) }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ currentUser.create_time }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ currentUser.last_login }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 编辑用户对话框 -->
    <el-dialog v-model="editVisible" :title="editDialogTitle" width="500px">
      <el-form 
        ref="editFormRef" 
        :model="editForm" 
        :rules="editRules" 
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" placeholder="请输入手机号（选填）" />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" placeholder="请输入邮箱（选填）" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  getCustomerList,
  getAdminUserDetail, 
  putAdminUserStatus, 
  putAdminUserUpdate 
} from '@/api/modules/admin'

interface User {
  user_id: number
  username: string
  phone: string
  email: string
  user_type: 'operator' | 'merchant' | 'customer' | 'visitor'
  status: 'active' | 'inactive' | 'locked'
  create_time: string
  last_login: string
  order_count?: number
  total_spent?: number
  login_count?: number
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

// 用户列表
const userList = ref<User[]>([])
const loading = ref(false)
const detailVisible = ref(false)
const currentUser = ref<User | null>(null)

// 编辑对话框
const editVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editDialogTitle = ref('编辑用户')
const editForm = reactive({
  user_id: 0,
  username: '',
  phone: '',
  email: ''
})

// 编辑表单验证规则
const editRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    user_id: 10001,
    username: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    user_type: 'customer',
    status: 'active',
    create_time: '2024-01-15 10:30:00',
    last_login: '2024-03-20 14:25:00',
    order_count: 12,
    total_spent: 2560,
    login_count: 45
  },
  {
    user_id: 10002,
    username: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    user_type: 'merchant',
    status: 'active',
    create_time: '2024-01-20 09:15:00',
    last_login: '2024-03-20 16:40:00',
    order_count: 0,
    total_spent: 0,
    login_count: 28
  },
  {
    user_id: 10003,
    username: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    user_type: 'customer',
    status: 'locked',
    create_time: '2024-02-05 14:20:00',
    last_login: '2024-03-18 11:10:00',
    order_count: 5,
    total_spent: 890,
    login_count: 32
  },
  {
    user_id: 10004,
    username: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    user_type: 'operator',
    status: 'active',
    create_time: '2024-02-10 16:45:00',
    last_login: '2024-03-20 09:00:00',
    order_count: 0,
    total_spent: 0,
    login_count: 156
  },
  {
    user_id: 10005,
    username: '钱七',
    phone: '13800138005',
    email: 'qianqi@example.com',
    user_type: 'customer',
    status: 'inactive',
    create_time: '2024-02-28 13:30:00',
    last_login: '2024-03-15 17:20:00',
    order_count: 8,
    total_spent: 1420,
    login_count: 23
  }
]

// 获取用户类型标签
const getUserTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    customer: '',
    merchant: 'success',
    operator: 'warning',
    visitor: 'info'
  }
  return tags[type] || 'info'
}

const getUserTypeText = (type: string) => {
  const texts: Record<string, string> = {
    customer: '普通用户',
    merchant: '商家',
    operator: '运营人员',
    visitor: '访客'
  }
  return texts[type] || type
}

// 获取状态标签
const getStatusTag = (status: string) => {
  const tags: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    locked: 'danger'
  }
  return tags[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: '正常',
    inactive: '禁用',
    locked: '锁定'
  }
  return texts[status] || status
}

// 搜索用户
const handleSearch = () => {
  pagination.current = 1
  loadUsers()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  dateRange.value = []
  handleSearch()
}

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  
  try {
    // 用户管理页面只调用客户列表接口
    const response = await getCustomerList({
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    
    // 转换数据格式以匹配页面结构
    userList.value = response.list.map(user => ({
      user_id: user.userId,
      username: user.username || user.account,
      phone: user.phone || '',
      email: user.email || '',
      user_type: user.userType as User['user_type'],
      status: user.status as User['status'],
      create_time: user.createTime,
      last_login: user.updateTime,
      order_count: 0,
      total_spent: 0,
      login_count: 0
    }))
    
    pagination.total = response.total
    
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('加载用户列表失败')
    
    // 错误时使用模拟数据作为降级方案
    userList.value = mockUsers.slice(0, pagination.size)
    pagination.total = mockUsers.length
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadUsers()
}

const handleCurrentChange = (page: number) => {
  pagination.current = page
  loadUsers()
}

// 查看用户详情
const viewUserDetail = async (user: User) => {
  try {
    loading.value = true
    
    // 调用真实API获取用户详情
    const userDetail = await getAdminUserDetail(user.user_id)
    
    // 转换数据格式以匹配页面结构
    currentUser.value = {
      user_id: userDetail.userId,
      username: userDetail.username || userDetail.account,
      phone: userDetail.phone || '',
      email: userDetail.email || '',
      user_type: userDetail.userType as User['user_type'],
      status: userDetail.status as User['status'],
      create_time: userDetail.createTime,
      last_login: userDetail.updateTime,
      order_count: 0,
      total_spent: 0,
      login_count: 0
    }
    
    detailVisible.value = true
    
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
    
    // 错误时使用当前用户数据作为降级方案
    currentUser.value = user
    detailVisible.value = true
  } finally {
    loading.value = false
  }
}

// 打开编辑对话框
const openEditDialog = (user: User) => {
  editDialogTitle.value = `编辑用户 - ${user.username}`
  editForm.user_id = user.user_id
  editForm.username = user.username
  editForm.phone = user.phone
  editForm.email = user.email
  editVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return
  
  try {
    const valid = await editFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 调用真实API更新用户信息
    await putAdminUserUpdate({
      id: editForm.user_id,
      username: editForm.username,
      ...(editForm.phone ? { phone: editForm.phone } : {}),
      ...(editForm.email ? { email: editForm.email } : {})
    })
    
    // 更新本地用户数据
    const userIndex = userList.value.findIndex(user => user.user_id === editForm.user_id)
    if (userIndex !== -1) {
      const target = userList.value[userIndex]
      if (target) {
        userList.value[userIndex] = {
          ...target,
          user_id: target.user_id,
          username: editForm.username,
          phone: editForm.phone || target.phone,
          email: editForm.email || target.email,
          user_type: target.user_type,
          status: target.status,
          create_time: target.create_time,
          last_login: target.last_login,
          order_count: target.order_count || 0,
          total_spent: target.total_spent || 0,
          login_count: target.login_count || 0
        }
      }
    }
    
    ElMessage.success('用户信息更新成功')
    editVisible.value = false
    
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新用户信息失败')
  } finally {
    loading.value = false
  }
}

// 切换用户状态
const toggleUserStatus = async (user: User) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 "${user.username}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用真实API更新用户状态
    await putAdminUserStatus({
      id: user.user_id,
      status: newStatus
    })
    
    // 更新本地状态
    user.status = newStatus
    ElMessage.success(`${action}用户成功`)
    
  } catch (error) {
    console.error('切换用户状态失败:', error)
    
    // 如果是用户取消操作，不显示错误信息
    if (error !== 'cancel') {
      ElMessage.error(`${action}用户失败`)
    }
  }
}

// 导出用户数据
const exportUsers = () => {
  ElMessage.success('导出功能开发中')
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
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

/* 用户列表 */
.user-list {
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

/* 用户详情 */
.user-detail {
  max-height: 400px;
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
// 专门针对用户管理页面的焦点样式覆盖
.user-management.no-focus-all {
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