<template>
  <div class="admin-settings">
    <div class="settings-header">
      <p class="settings-description">管理系统基本配置和参数设置</p>
    </div>

    <div class="settings-content">
      <!-- 基本设置 -->
      <el-card class="setting-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">基本设置</span>
            <el-button type="primary" size="small" @click="saveBasicSettings">保存</el-button>
          </div>
        </template>
        
        <el-form :model="basicSettings" label-width="120px">
          <el-form-item label="网站名称">
            <el-input v-model="basicSettings.siteName" placeholder="请输入网站名称" />
          </el-form-item>
          
          <el-form-item label="网站描述">
            <el-input 
              v-model="basicSettings.siteDescription" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入网站描述" 
            />
          </el-form-item>
          
          <el-form-item label="网站Logo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeLogoUpload"
              :on-success="handleLogoSuccess"
            >
              <img v-if="basicSettings.logo" :src="basicSettings.logo" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="备案信息">
            <el-input v-model="basicSettings.icp" placeholder="请输入备案号" />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 用户设置 -->
      <el-card class="setting-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">用户设置</span>
            <el-button type="primary" size="small" @click="saveUserSettings">保存</el-button>
          </div>
        </template>
        
        <el-form :model="userSettings" label-width="120px">
          <el-form-item label="用户注册">
            <el-switch
              v-model="userSettings.allowRegister"
              active-text="允许"
              inactive-text="禁止"
            />
          </el-form-item>
          
          <el-form-item label="邮箱验证">
            <el-switch
              v-model="userSettings.emailVerification"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          
          <el-form-item label="手机验证">
            <el-switch
              v-model="userSettings.phoneVerification"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          
          <el-form-item label="默认头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="userSettings.defaultAvatar" :src="userSettings.defaultAvatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 商家设置 -->
      <el-card class="setting-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">商家设置</span>
            <el-button type="primary" size="small" @click="saveMerchantSettings">保存</el-button>
          </div>
        </template>
        
        <el-form :model="merchantSettings" label-width="120px">
          <el-form-item label="商家注册">
            <el-switch
              v-model="merchantSettings.allowRegister"
              active-text="允许"
              inactive-text="禁止"
            />
          </el-form-item>
          
          <el-form-item label="自动审核">
            <el-switch
              v-model="merchantSettings.autoAudit"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          
          <el-form-item label="保证金">
            <el-input-number
              v-model="merchantSettings.deposit"
              :min="0"
              :max="10000"
              :step="100"
              controls-position="right"
            />
            <span style="margin-left: 8px; color: #666;">元</span>
          </el-form-item>
          
          <el-form-item label="佣金比例">
            <el-input-number
              v-model="merchantSettings.commissionRate"
              :min="0"
              :max="50"
              :step="0.5"
              controls-position="right"
            />
            <span style="margin-left: 8px; color: #666;">%</span>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 安全设置 -->
      <el-card class="setting-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">安全设置</span>
            <el-button type="primary" size="small" @click="saveSecuritySettings">保存</el-button>
          </div>
        </template>
        
        <el-form :model="securitySettings" label-width="120px">
          <el-form-item label="登录尝试次数">
            <el-input-number
              v-model="securitySettings.maxLoginAttempts"
              :min="1"
              :max="10"
              controls-position="right"
            />
            <span style="margin-left: 8px; color: #666;">次</span>
          </el-form-item>
          
          <el-form-item label="密码强度">
            <el-select v-model="securitySettings.passwordStrength" placeholder="请选择密码强度">
              <el-option label="低（6位以上）" value="low" />
              <el-option label="中（8位以上，包含字母和数字）" value="medium" />
              <el-option label="高（10位以上，包含字母、数字和特殊字符）" value="high" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="会话超时">
            <el-input-number
              v-model="securitySettings.sessionTimeout"
              :min="30"
              :max="1440"
              :step="30"
              controls-position="right"
            />
            <span style="margin-left: 8px; color: #666;">分钟</span>
          </el-form-item>
          
          <el-form-item label="IP白名单">
            <el-input
              v-model="securitySettings.ipWhitelist"
              type="textarea"
              :rows="3"
              placeholder="请输入允许访问的IP地址，多个用逗号分隔"
            />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 系统维护 -->
      <el-card class="setting-section" shadow="never">
        <template #header>
          <div class="section-header">
            <span class="section-title">系统维护</span>
            <el-button type="warning" size="small" @click="handleMaintenance">执行维护</el-button>
          </div>
        </template>
        
        <el-form label-width="120px">
          <el-form-item label="数据备份">
            <el-button type="primary" @click="backupData">立即备份</el-button>
            <span style="margin-left: 16px; color: #666;">最后备份时间：{{ lastBackupTime || '从未备份' }}</span>
          </el-form-item>
          
          <el-form-item label="缓存清理">
            <el-button type="warning" @click="clearCache">清理缓存</el-button>
            <span style="margin-left: 16px; color: #666;">缓存大小：{{ cacheSize || '未知' }}</span>
          </el-form-item>
          
          <el-form-item label="系统日志">
            <el-button @click="viewLogs">查看日志</el-button>
            <span style="margin-left: 16px; color: #666;">日志文件大小：{{ logSize || '未知' }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

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
</style>