<template>
  <div class="auth-page">
    <!-- 登录表单 -->
    <div class="auth-container">
      <div class="auth-form">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>请使用您的账号密码登录</p>
        </div>

        <form @submit.prevent="handleLogin">
          <!-- 用户名/手机号输入 -->
          <div class="form-group">
            <label for="username">用户名/手机号</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名或手机号"
              required
            />
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              required
            />
            <span class="password-toggle" @click="togglePasswordVisibility">
              {{ showPassword ? '隐藏' : '显示' }}
            </span>
          </div>

          <!-- 记住密码和忘记密码 -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="loginForm.rememberMe" />
              <span>记住密码</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
              忘记密码？
            </a>
          </div>

          <!-- 登录按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 注册链接 -->
        <div class="auth-footer">
          <p>还没有账号？<a href="#" @click.prevent="goToRegister">立即注册</a></p>
        </div>

        <!-- 第三方登录 -->
        <div class="social-login">
          <div class="divider">
            <span>或使用以下方式登录</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn wechat" @click="handleWechatLogin">
              <span class="social-icon">💬</span>
              <span>微信登录</span>
            </button>
            <button class="social-btn qq" @click="handleQQLogin">
              <span class="social-icon">🐧</span>
              <span>QQ登录</span>
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

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const loading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }

  loading.value = true
  
  try {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功
    ElMessage.success('登录成功')
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能暂未开放')
}

const goToRegister = () => {
  router.push('/register')
}

const handleWechatLogin = () => {
  ElMessage.info('微信登录功能暂未开放')
}

const handleQQLogin = () => {
  ElMessage.info('QQ登录功能暂未开放')
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

/* 登录容器样式 */
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

/* 表单选项样式 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.remember-me {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.remember-me input {
  margin-right: 8px;
}

.forgot-password {
  font-size: 14px;
  color: #ff5021;
  text-decoration: none;
}

.forgot-password:hover {
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