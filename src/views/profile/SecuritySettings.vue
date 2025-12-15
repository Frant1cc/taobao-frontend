<template>
  <div class="security-settings-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </div>
        <h1 class="page-title">账户安全</h1>
      </div>
    </div>

    <!-- 安全设置表单 -->
    <div class="security-form">
      <!-- 登录密码设置 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">登录密码</h3>
        </div>
        <div class="security-item">
          <div class="security-info">
            <div class="security-icon">🔒</div>
            <div class="security-details">
              <h4 class="security-title">登录密码</h4>
              <p class="security-desc">定期更换密码可以让账户更安全</p>
            </div>
          </div>
          <div class="security-action">
            <button 
              class="modify-btn" 
              @click="showPasswordModal = true"
            >
              修改密码
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码模态框 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">修改登录密码</h3>
          <button class="close-btn" @click="closePasswordModal">×</button>
        </div>
        
        <div class="modal-content">
          <form @submit.prevent="handlePasswordChange" class="password-form">
            <div class="form-group">
              <label for="currentPassword" class="form-label">当前密码</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="passwordForm.currentPassword" 
                class="form-input"
                placeholder="请输入当前密码"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="newPassword" class="form-label">新密码</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="passwordForm.newPassword" 
                class="form-input"
                placeholder="请输入新密码（6-20位字符）"
                required
                minlength="6"
                maxlength="20"
              />
            </div>
            
            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认新密码</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="passwordForm.confirmPassword" 
                class="form-input"
                placeholder="请再次输入新密码"
                required
              />
            </div>
            
            <div class="password-rules">
              <p class="rule-title">密码规则：</p>
              <ul class="rule-list">
                <li :class="{ 'rule-valid': passwordForm.newPassword.length >= 6 }">长度6-20位字符</li>
                <li :class="{ 'rule-valid': passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword.length > 0 }">两次输入一致</li>
              </ul>
            </div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="btn-cancel" 
                @click="closePasswordModal"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn-submit" 
                :disabled="!isFormValid"
              >
                确认修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateUserInfo } from '@/api/modules/user'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 密码修改模态框显示状态
const showPasswordModal = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单验证
const isFormValid = computed(() => {
  const { currentPassword, newPassword, confirmPassword } = passwordForm.value
  return (
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    newPassword.length <= 20 &&
    newPassword === confirmPassword
  )
})

// 关闭密码修改模态框
const closePasswordModal = () => {
  showPasswordModal.value = false
  // 重置表单
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 处理密码修改
const handlePasswordChange = async () => {
  if (!isFormValid.value) {
    ElMessage.error('请填写完整的密码信息')
    return
  }

  try {
    // 调用真实API修改密码，直接传入password参数
    const response = await updateUserInfo({
      password: passwordForm.value.newPassword
    })
    
    if (response.code === 200) {
      ElMessage.success('密码修改成功！')
      closePasswordModal()
    } else {
      ElMessage.error(response.msg || '密码修改失败')
    }
  } catch (error: any) {
    console.error('密码修改失败:', error)
    ElMessage.error(error.response?.data?.msg || '密码修改失败，请稍后重试')
  }
}

// 页面加载时获取安全信息
onMounted(() => {
  // 这里可以调用API获取安全信息
  console.log('账户安全管理页面加载完成')
})
</script>

<style scoped>
.security-settings-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部样式 */
.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #ff5021;
}

.back-icon {
  font-size: 18px;
  margin-right: 5px;
}

.back-text {
  font-size: 14px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-left: 20px;
}

/* 安全设置表单样式 */
.security-form {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.form-section {
  background: white;
  margin-bottom: 15px;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.security-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.security-icon {
  font-size: 24px;
  margin-right: 12px;
}

.security-details {
  flex: 1;
}

.security-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.security-desc {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.security-action {
  display: flex;
  align-items: center;
}

.modify-btn {
  background: #ff5021;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modify-btn:hover {
  background: #ff3a00;
  transform: translateY(-1px);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.modal-content {
  padding: 20px;
}

/* 表单样式 */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #ff5021;
}

.password-rules {
  background: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
  margin: 10px 0;
}

.rule-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 10px 0;
}

.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rule-list li {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
  position: relative;
  padding-left: 15px;
}

.rule-list li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #999;
}

.rule-list li.rule-valid {
  color: #52c41a;
}

.rule-list li.rule-valid::before {
  content: '✓';
  color: #52c41a;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.btn-submit {
  background: #ff5021;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background: #ff3a00;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
/* 输入区域样式 */
.input-section {
  position: relative;
}

.phone-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.phone-input:focus {
  border-color: #ff5021;
}

.email-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.email-input:focus {
  border-color: #ff5021;
}

/* 操作按钮区域 */
.action-section {
  text-align: center;
  margin-top: 30px;
}

.save-btn {
  background: linear-gradient(135deg, #ff5021 0%, #ff7b50 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 15px;
  transition: all 0.3s;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 80, 33, 0.3);
}

.cancel-btn {
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

/* 验证码输入组样式 */
.verification-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.verification-input-group .form-input {
  flex: 1;
}

.send-code-btn {
  background: #ff5021;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  min-width: 100px;
}

.send-code-btn:hover:not(:disabled) {
  background: #ff3a00;
  transform: translateY(-1px);
}

.send-code-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* 当前信息显示样式 */
.current-info {
  padding: 12px;
  background: #f8f8f8;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  border: 1px solid #e0e0e0;
}

/* 验证表单样式 */
.verification-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #ff5021;
}

.password-rules {
  background: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
  margin: 10px 0;
}

.rule-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 10px 0;
}

.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rule-list li {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
  position: relative;
  padding-left: 15px;
}

.rule-list li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #999;
}

.rule-list li.rule-valid {
  color: #52c41a;
}

.rule-list li.rule-valid::before {
  content: '✓';
  color: #52c41a;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #ccc;
}
</style>