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
          <!-- 账户 -->
          <div class="form-group">
            <label for="account">账户</label>
            <input
              id="account"
              v-model="registerForm.account"
              type="text"
              placeholder="请输入账户"
              required
            />
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
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

          <!-- 注册按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册商家账号' }}
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="auth-footer">
          <p>已有商家账号？<a href="#" @click.prevent="goToLogin">立即登录</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/modules/user'

const router = useRouter()

// 注册表单数据
const registerForm = ref({
  account: '',
  password: '',
  confirmPassword: ''
})

// 状态变量
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.value.account || !registerForm.value.password || !registerForm.value.confirmPassword) {
    ElMessage.error('请填写账户和密码')
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
    // 调用注册API，userType设置为merchant
    const res = await register({
      account: registerForm.value.account,
      password: registerForm.value.password,
      userType: 'merchant'
    })
    
    if (res.code === 200) {
      ElMessage.success('商家注册成功，请登录')
      // 跳转到登录页面
      router.push('/merchant/auth')
    } else {
      ElMessage.error(res.message || '注册失败，请稍后重试')
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/merchant/auth')
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