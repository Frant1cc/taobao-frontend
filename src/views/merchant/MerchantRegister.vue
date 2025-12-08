<template>
  <div class="auth-page">
    <!-- 注册表单 -->
    <div class="auth-container">
      <div class="auth-form">
        <!-- 返回按钮 -->
        <div class="back-button-container">
          <button class="back-btn" @click="goBack">
            <span class="back-icon">←</span>
            返回首页
          </button>
        </div>
        <div class="form-header">
          <h2>商家注册</h2>
          <p>创建您的商家账号，开启电商之旅</p>
        </div>

        <form @submit.prevent="handleRegister">
          <!-- 店铺名称 -->
          <div class="form-group">
            <label for="storeName">店铺名称</label>
            <input
              id="storeName"
              v-model="registerForm.storeName"
              type="text"
              placeholder="请输入您的店铺名称"
              required
            />
          </div>

          <!-- 商家姓名 -->
          <div class="form-group">
            <label for="merchantName">商家姓名</label>
            <input
              id="merchantName"
              v-model="registerForm.merchantName"
              type="text"
              placeholder="请输入真实姓名"
              required
            />
          </div>

          <!-- 手机号 -->
          <div class="form-group">
            <label for="phone">手机号码</label>
            <input
              id="phone"
              v-model="registerForm.phone"
              type="tel"
              placeholder="请输入手机号码"
              maxlength="11"
              required
            />
          </div>

          <!-- 验证码 -->
          <div class="form-group">
            <label for="smsCode">短信验证码</label>
            <div class="sms-row">
              <input
                id="smsCode"
                v-model="registerForm.smsCode"
                type="text"
                placeholder="请输入短信验证码"
                maxlength="6"
                required
              />
              <button 
                type="button" 
                class="sms-btn" 
                :disabled="smsCountdown > 0"
                @click="sendSmsCode"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s后重发` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label for="password">设置密码</label>
            <input
              id="password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请设置登录密码（6-20位）"
              required
            />
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ showPassword ? '隐藏' : '显示' }}
            </span>
          </div>

          <!-- 确认密码 -->
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              required
            />
            <span class="password-toggle" @click="toggleConfirmPasswordVisibility">
              {{ showConfirmPassword ? '隐藏' : '显示' }}
            </span>
          </div>

          <!-- 协议同意 -->
          <div class="form-agreement">
            <label class="agreement-checkbox">
              <input type="checkbox" v-model="registerForm.agreed" required />
              <span>我已阅读并同意</span>
            </label>
            <a href="#" class="agreement-link" @click.prevent="showAgreement">
              《商家服务协议》
            </a>
          </div>

          <!-- 注册按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册商家账号' }}
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="auth-footer">
          <p>已有商家账号？<a href="#" @click.prevent="goToLogin">立即登录</a></p>
        </div>

        <!-- 第三方注册 -->
        <div class="social-login">
          <div class="divider">
            <span>或使用以下方式注册</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn wechat" @click="handleWechatRegister">
              <span class="social-icon">💬</span>
              <span>微信注册</span>
            </button>
            <button class="social-btn qq" @click="handleQQRegister">
              <span class="social-icon">🐧</span>
              <span>QQ注册</span>
            </button>
          </div>
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
  storeName: '',
  merchantName: '',
  phone: '',
  smsCode: '',
  password: '',
  confirmPassword: '',
  agreed: false
})

// 状态变量
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const smsCountdown = ref(0)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 发送短信验证码
const sendSmsCode = () => {
  if (!registerForm.value.phone) {
    ElMessage.error('请输入手机号码')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    ElMessage.error('请输入正确的手机号码')
    return
  }

  // 模拟发送短信
  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  ElMessage.success('验证码已发送')
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.value.storeName || !registerForm.value.merchantName || !registerForm.value.phone || 
      !registerForm.value.smsCode || !registerForm.value.password || !registerForm.value.confirmPassword) {
    ElMessage.error('请填写完整的注册信息')
    return
  }

  if (!registerForm.value.agreed) {
    ElMessage.error('请同意商家服务协议')
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  if (registerForm.value.password.length < 6) {
    ElMessage.error('密码长度不能少于6位')
    return
  }

  loading.value = true
  
  try {
    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟注册成功
    ElMessage.success('商家注册成功，请登录')
    
    // 跳转到登录页面
    router.push('/merchant/auth')
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/merchant/auth')
}

const showAgreement = () => {
  ElMessage.info('商家服务协议查看功能暂未开放')
}

const handleWechatRegister = () => {
  ElMessage.info('微信注册功能暂未开放')
}

const handleQQRegister = () => {
  ElMessage.info('QQ注册功能暂未开放')
}

const goBack = () => {
  router.push('/home')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 注册容器样式 */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
  position: relative;
}

/* 返回按钮样式 */
.back-button-container {
  margin-bottom: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  width: fit-content;
}

.back-btn:hover {
  background: #f8f8f8;
  border-color: #ff5021;
  color: #ff5021;
  transform: translateY(-1px);
}

.back-icon {
  font-size: 16px;
  font-weight: bold;
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

/* 短信验证码样式 */
.sms-row {
  display: flex;
  gap: 10px;
}

.sms-row input {
  flex: 1;
}

.sms-btn {
  width: 120px;
  padding: 12px;
  border: 1px solid #ff5021;
  background: white;
  color: #ff5021;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.sms-btn:hover:not(:disabled) {
  background: #ff5021;
  color: white;
}

.sms-btn:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

/* 协议同意样式 */
.form-agreement {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
}

.agreement-checkbox input {
  margin-right: 8px;
  width: auto;
}

.agreement-link {
  color: #ff5021;
  text-decoration: none;
  margin-left: 5px;
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

/* 第三方登录样式 */
.social-login {
  margin-top: 30px;
}

.divider {
  text-align: center;
  position: relative;
  margin-bottom: 20px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: white;
  padding: 0 15px;
  font-size: 12px;
  color: #999;
  position: relative;
}

.social-buttons {
  display: flex;
  gap: 15px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-btn:hover {
  border-color: #ff5021;
  transform: translateY(-1px);
}

.social-icon {
  font-size: 16px;
}

.social-btn.wechat:hover {
  border-color: #07c160;
}

.social-btn.qq:hover {
  border-color: #12b7f5;
}
</style>