<template>
  <div class="auth-page">
    <!-- 注册表单 -->
    <div class="auth-container">
      <div class="auth-form">
        <div class="form-header">
          <h2>创建新账号</h2>
          <p>请填写以下信息完成注册</p>
        </div>

        <form @submit.prevent="handleRegister">
          <!-- 用户名输入 -->
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              placeholder="请输入用户名（4-20位字符）"
              required
              @blur="validateUsername"
            />
            <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
          </div>

          <!-- 手机号输入 -->
          <div class="form-group">
            <label for="phone">手机号</label>
            <input
              id="phone"
              v-model="registerForm.phone"
              type="tel"
              placeholder="请输入手机号"
              required
              @blur="validatePhone"
            />
            <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码（6-20位字符）"
              required
              @blur="validatePassword"
            />
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ showPassword ? '隐藏' : '显示' }}
            </span>
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          </div>

          <!-- 确认密码 -->
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              required
              @blur="validateConfirmPassword"
            />
            <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
          </div>

          <!-- 验证码 -->
          <div class="form-group">
            <label for="captcha">验证码</label>
            <div class="captcha-input">
              <input
                id="captcha"
                v-model="registerForm.captcha"
                type="text"
                placeholder="请输入验证码"
                required
                maxlength="6"
              />
              <button 
                type="button" 
                class="captcha-btn" 
                :disabled="captchaCooldown > 0"
                @click="sendCaptcha"
              >
                {{ captchaCooldown > 0 ? `${captchaCooldown}s后重发` : '获取验证码' }}
              </button>
            </div>
            <div v-if="captchaError" class="error-message">{{ captchaError }}</div>
          </div>

          <!-- 用户协议 -->
          <div class="agreement">
            <label class="agreement-label">
              <input type="checkbox" v-model="registerForm.agreed" required />
              <span>我已阅读并同意</span>
            </label>
            <a href="#" class="agreement-link" @click.prevent="showAgreement">《用户协议》</a>
            <span>和</span>
            <a href="#" class="agreement-link" @click.prevent="showPrivacy">《隐私政策》</a>
          </div>

          <!-- 注册按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="auth-footer">
          <p>已有账号？<a href="#" @click.prevent="goToLogin">立即登录</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 注册表单数据
const registerForm = ref({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agreed: false
})

// 错误信息
const usernameError = ref('')
const phoneError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const captchaError = ref('')

const showPassword = ref(false)
const loading = ref(false)
const captchaCooldown = ref(0)

// 验证方法
const validateUsername = () => {
  const username = registerForm.value.username.trim()
  if (!username) {
    usernameError.value = '请输入用户名'
    return false
  }
  if (username.length < 4 || username.length > 20) {
    usernameError.value = '用户名长度应为4-20位字符'
    return false
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    usernameError.value = '用户名只能包含字母、数字和下划线'
    return false
  }
  usernameError.value = ''
  return true
}

const validatePhone = () => {
  const phone = registerForm.value.phone.trim()
  if (!phone) {
    phoneError.value = '请输入手机号'
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    phoneError.value = '请输入正确的手机号格式'
    return false
  }
  phoneError.value = ''
  return true
}

const validatePassword = () => {
  const password = registerForm.value.password
  if (!password) {
    passwordError.value = '请输入密码'
    return false
  }
  if (password.length < 6 || password.length > 20) {
    passwordError.value = '密码长度应为6-20位字符'
    return false
  }
  passwordError.value = ''
  return true
}

const validateConfirmPassword = () => {
  const password = registerForm.value.password
  const confirmPassword = registerForm.value.confirmPassword
  if (!confirmPassword) {
    confirmPasswordError.value = '请确认密码'
    return false
  }
  if (password !== confirmPassword) {
    confirmPasswordError.value = '两次输入的密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}


const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const sendCaptcha = async () => {
  if (!validatePhone()) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  // 模拟发送验证码
  captchaCooldown.value = 60
  const timer = setInterval(() => {
    captchaCooldown.value--
    if (captchaCooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  ElMessage.success('验证码已发送到您的手机')
}

const handleRegister = async () => {
  // 验证所有字段
  const validations = [
    validateUsername(),
    validatePhone(),
    validatePassword(),
    validateConfirmPassword()
  ]

  if (validations.some(valid => !valid)) {
    ElMessage.error('请检查表单信息')
    return
  }

  if (!registerForm.value.captcha) {
    ElMessage.error('请输入验证码')
    return
  }

  if (!registerForm.value.agreed) {
    ElMessage.error('请同意用户协议和隐私政策')
    return
  }

  loading.value = true
  
  try {
    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟注册成功
    ElMessage.success('注册成功！')
    
    // 跳转到登录页面
    router.push('/login')
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const showAgreement = () => {
  ElMessage.info('用户协议页面暂未开放')
}

const showPrivacy = () => {
  ElMessage.info('隐私政策页面暂未开放')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 页面头部样式 */
.auth-header {
  background: transparent;
  padding: 20px 0;
}

.header-content {
  max-width: 400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 18px;
  margin-right: 5px;
}

.back-text {
  font-size: 14px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-left: 20px;
}

/* 注册容器样式 */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
}

.auth-form {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.form-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #ff5021;
  box-shadow: 0 0 0 2px rgba(255, 80, 33, 0.1);
}

.error-message {
  color: #ff5021;
  font-size: 12px;
  margin-top: 4px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 38px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  user-select: none;
}

.password-toggle:hover {
  color: #ff5021;
}

/* 验证码输入样式 */
.captcha-input {
  display: flex;
  gap: 10px;
}

.captcha-input input {
  flex: 1;
}

.captcha-btn {
  padding: 12px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.captcha-btn:hover:not(:disabled) {
  background: #ff5021;
  color: white;
  border-color: #ff5021;
}

.captcha-btn:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

/* 用户协议样式 */
.agreement {
  margin-bottom: 30px;
  text-align: center;
}

.agreement-label {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  margin-right: 4px;
}

.agreement-label input {
  margin-right: 6px;
  width: auto;
}

.agreement-link {
  color: #ff5021;
  text-decoration: none;
  font-size: 14px;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 提交按钮样式 */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #ff5021;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #ff3a00;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* 底部链接样式 */
.auth-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.auth-footer p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.auth-footer a {
  color: #ff5021;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>