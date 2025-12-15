<template>
  <div class="admin-settings">

    <div class="settings-content">
      <!-- 账户安全 -->
      <el-card class="setting-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">账户安全</span>
          </div>
        </template>
        
        <div class="account-security">
          <div class="security-item">
            <div class="security-info">
              <h4>退出登录</h4>
              <p>安全退出当前登录的管理员账户</p>
            </div>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 基本设置
const basicSettings = ref({
  siteName: '淘宝管理后台',
  siteDescription: '专业的电商平台管理后台',
  logo: '',
  icp: ''
})

// 用户设置
const userSettings = ref({
  allowRegister: true,
  emailVerification: false,
  phoneVerification: false,
  defaultAvatar: ''
})

// 商家设置
const merchantSettings = ref({
  allowRegister: true,
  autoAudit: false,
  deposit: 1000,
  commissionRate: 5.0
})

// 安全设置
const securitySettings = ref({
  maxLoginAttempts: 5,
  passwordStrength: 'medium',
  sessionTimeout: 120,
  ipWhitelist: ''
})

// 系统维护信息
const lastBackupTime = ref('')
const cacheSize = ref('')
const logSize = ref('')

// 保存设置的方法
const saveBasicSettings = () => {
  ElMessage.success('基本设置已保存')
}

const saveUserSettings = () => {
  ElMessage.success('用户设置已保存')
}

const saveMerchantSettings = () => {
  ElMessage.success('商家设置已保存')
}

const saveSecuritySettings = () => {
  ElMessage.success('安全设置已保存')
}

// 文件上传处理
const beforeLogoUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('Logo必须是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过 2MB!')
    return false
  }
  return true
}

const handleLogoSuccess = (response: any, file: File) => {
  // 模拟上传成功，实际项目中需要调用后端接口
  basicSettings.value.logo = URL.createObjectURL(file)
  ElMessage.success('Logo上传成功')
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isJPG && !isPNG) {
    ElMessage.error('头像必须是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt1M) {
    ElMessage.error('头像大小不能超过 1MB!')
    return false
  }
  return true
}

const handleAvatarSuccess = (response: any, file: File) => {
  // 模拟上传成功
  userSettings.value.defaultAvatar = URL.createObjectURL(file)
  ElMessage.success('默认头像上传成功')
}

// 系统维护操作
const handleMaintenance = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要执行系统维护吗？此操作可能需要几分钟时间。',
      '系统维护确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('系统维护已完成')
  } catch {
    // 用户取消操作
  }
}

const backupData = () => {
  ElMessage.success('数据备份已完成')
  lastBackupTime.value = new Date().toLocaleString()
}

const clearCache = () => {
  ElMessage.success('缓存清理完成')
  cacheSize.value = '0 MB'
}

const viewLogs = () => {
  ElMessage.info('日志查看功能开发中')
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 清除所有登录信息
    userStore.clearToken() // 清除 store 中的用户信息和 authToken
    localStorage.removeItem('big-user') // 清除 big-user 信息
    localStorage.removeItem('admin_token') // 清除管理员 token
    localStorage.removeItem('admin_info') // 清除管理员信息
    
    ElMessage.success('退出登录成功')
    
    // 跳转到登录页
    router.push('/admin/login')
  } catch (error) {
    // 用户取消操作
  }
}

onMounted(() => {
  // 模拟加载系统维护信息
  cacheSize.value = '256 MB'
  logSize.value = '128 MB'
})
</script>

<style scoped lang="scss">
.admin-settings {
  padding: 0;
  min-height: calc(100vh - 120px);
}

.settings-header {
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
  }
  
  .settings-description {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-section {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  
  :deep(.el-card__header) {
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #409eff;
    }
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input-number) {
  width: 200px;
}

:deep(.el-textarea) {
  width: 400px;
}

@media (max-width: 768px) {
  .settings-content {
    gap: 16px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
  
  :deep(.el-input-number),
  :deep(.el-textarea) {
    width: 100%;
  }
}

/* 账户安全样式 */
.account-security {
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .security-info {
      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 4px 0;
      }
      
      p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }
}
</style>