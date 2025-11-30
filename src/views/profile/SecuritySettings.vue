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
      <!-- 手机号码设置 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">手机号码</h3>
        </div>
        <div class="security-item">
          <div class="security-info">
            <div class="security-icon">📱</div>
            <div class="security-details">
              <h4 class="security-title">手机号码</h4>
              <p class="security-desc">已绑定手机：{{ securityInfo.phone }}</p>
            </div>
          </div>
          <div class="security-action">
            <button 
              class="modify-btn" 
              @click="showPhoneModal = true"
            >
              更换手机
            </button>
          </div>
        </div>
      </div>

      <!-- 邮箱地址设置 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">邮箱地址</h3>
        </div>
        <div class="security-item">
          <div class="security-info">
            <div class="security-icon">📧</div>
            <div class="security-details">
              <h4 class="security-title">邮箱地址</h4>
              <p class="security-desc">已绑定邮箱：{{ securityInfo.email }}</p>
            </div>
          </div>
          <div class="security-action">
            <button 
              class="modify-btn" 
              @click="showEmailModal = true"
            >
              更换邮箱
            </button>
          </div>
        </div>
      </div>

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

    <!-- 更换手机号码模态框 -->
    <div v-if="showPhoneModal" class="modal-overlay" @click="closePhoneModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">更换手机号码</h3>
          <button class="close-btn" @click="closePhoneModal">×</button>
        </div>
        
        <div class="modal-content">
          <form @submit.prevent="handlePhoneChange" class="verification-form">
            <div class="form-group">
              <label class="form-label">当前手机号</label>
              <div class="current-info">{{ securityInfo.phone }}</div>
            </div>
            
            <div class="form-group">
              <label for="phoneVerificationCode" class="form-label">验证码</label>
              <div class="verification-input-group">
                <input 
                  type="text" 
                  id="phoneVerificationCode" 
                  v-model="phoneForm.verificationCode" 
                  class="form-input"
                  placeholder="请输入验证码"
                  maxlength="6"
                  required
                />
                <button 
                  type="button" 
                  class="send-code-btn"
                  :disabled="phoneForm.isSending"
                  @click="sendPhoneVerificationCode"
                >
                  {{ phoneForm.isSending ? `${phoneForm.countdown}s后重新发送` : '发送验证码' }}
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="newPhone" class="form-label">新手机号码</label>
              <input 
                type="tel" 
                id="newPhone" 
                v-model="phoneForm.newPhone" 
                class="form-input"
                placeholder="请输入新手机号码"
                maxlength="11"
                required
              />
            </div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="btn-cancel" 
                @click="closePhoneModal"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn-submit" 
                :disabled="!isPhoneFormValid"
              >
                确认更换
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 更换邮箱地址模态框 -->
    <div v-if="showEmailModal" class="modal-overlay" @click="closeEmailModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">更换邮箱地址</h3>
          <button class="close-btn" @click="closeEmailModal">×</button>
        </div>
        
        <div class="modal-content">
          <form @submit.prevent="handleEmailChange" class="verification-form">
            <div class="form-group">
              <label class="form-label">当前邮箱</label>
              <div class="current-info">{{ securityInfo.email }}</div>
            </div>
            
            <div class="form-group">
              <label for="emailVerificationCode" class="form-label">验证码</label>
              <div class="verification-input-group">
                <input 
                  type="text" 
                  id="emailVerificationCode" 
                  v-model="emailForm.verificationCode" 
                  class="form-input"
                  placeholder="请输入验证码"
                  maxlength="6"
                  required
                />
                <button 
                  type="button" 
                  class="send-code-btn"
                  :disabled="emailForm.isSending"
                  @click="sendEmailVerificationCode"
                >
                  {{ emailForm.isSending ? `${emailForm.countdown}s后重新发送` : '发送验证码' }}
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="newEmail" class="form-label">新邮箱地址</label>
              <input 
                type="email" 
                id="newEmail" 
                v-model="emailForm.newEmail" 
                class="form-input"
                placeholder="请输入新邮箱地址"
                maxlength="50"
                required
              />
            </div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="btn-cancel" 
                @click="closeEmailModal"
              >
                取消
              </button>
              <button 
                type="submit" 
                class="btn-submit" 
                :disabled="!isEmailFormValid"
              >
                确认更换
              </button>
            </div>
          </form>
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
                <li :class="{ 'rule-valid': hasUpperCase && hasLowerCase && hasNumber }">包含字母和数字</li>
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

const router = useRouter()

// 安全信息
const securityInfo = ref({
  phone: '138****8888',
  email: 'user@example.com'
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 手机号码模态框相关
const showPhoneModal = ref(false)
const phoneForm = ref({
  verificationCode: '',
  newPhone: '',
  isSending: false,
  countdown: 60
})

// 邮箱地址模态框相关
const showEmailModal = ref(false)
const emailForm = ref({
  verificationCode: '',
  newEmail: '',
  isSending: false,
  countdown: 60
})

// 密码修改模态框显示状态
const showPasswordModal = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 手机表单验证
const isPhoneFormValid = computed(() => {
  const { verificationCode, newPhone } = phoneForm.value
  return (
    verificationCode.length === 6 &&
    /^1[3-9]\d{9}$/.test(newPhone)
  )
})

// 邮箱表单验证
const isEmailFormValid = computed(() => {
  const { verificationCode, newEmail } = emailForm.value
  return (
    verificationCode.length === 6 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
  )
})

// 计算密码规则验证
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.value.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.value.newPassword))
const hasNumber = computed(() => /\d/.test(passwordForm.value.newPassword))

// 密码表单验证
const isFormValid = computed(() => {
  const { currentPassword, newPassword, confirmPassword } = passwordForm.value
  return (
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    newPassword.length <= 20 &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    newPassword === confirmPassword
  )
})

// 发送手机验证码
const sendPhoneVerificationCode = async () => {
  if (phoneForm.value.isSending) return
  
  phoneForm.value.isSending = true
  
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('验证码已发送到您的手机')
    
    // 开始倒计时
    const timer = setInterval(() => {
      phoneForm.value.countdown--
      if (phoneForm.value.countdown <= 0) {
        clearInterval(timer)
        phoneForm.value.isSending = false
        phoneForm.value.countdown = 60
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
    phoneForm.value.isSending = false
  }
}

// 发送邮箱验证码
const sendEmailVerificationCode = async () => {
  if (emailForm.value.isSending) return
  
  emailForm.value.isSending = true
  
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('验证码已发送到您的邮箱')
    
    // 开始倒计时
    const timer = setInterval(() => {
      emailForm.value.countdown--
      if (emailForm.value.countdown <= 0) {
        clearInterval(timer)
        emailForm.value.isSending = false
        emailForm.value.countdown = 60
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
    emailForm.value.isSending = false
  }
}

// 处理手机号码更换
const handlePhoneChange = async () => {
  if (!isPhoneFormValid.value) {
    ElMessage.error('请填写完整的验证信息')
    return
  }

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    securityInfo.value.phone = phoneForm.value.newPhone
    ElMessage.success('手机号码更换成功！')
    closePhoneModal()
  } catch (error) {
    ElMessage.error('手机号码更换失败，请稍后重试')
  }
}

// 处理邮箱地址更换
const handleEmailChange = async () => {
  if (!isEmailFormValid.value) {
    ElMessage.error('请填写完整的验证信息')
    return
  }

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    securityInfo.value.email = emailForm.value.newEmail
    ElMessage.success('邮箱地址更换成功！')
    closeEmailModal()
  } catch (error) {
    ElMessage.error('邮箱地址更换失败，请稍后重试')
  }
}

// 关闭手机号码模态框
const closePhoneModal = () => {
  showPhoneModal.value = false
  // 重置表单
  phoneForm.value = {
    verificationCode: '',
    newPhone: '',
    isSending: false,
    countdown: 60
  }
}

// 关闭邮箱地址模态框
const closeEmailModal = () => {
  showEmailModal.value = false
  // 重置表单
  emailForm.value = {
    verificationCode: '',
    newEmail: '',
    isSending: false,
    countdown: 60
  }
}

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
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('密码修改成功！')
    closePasswordModal()
  } catch (error) {
    ElMessage.error('密码修改失败，请稍后重试')
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