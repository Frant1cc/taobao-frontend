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

import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()





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