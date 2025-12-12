<template>
  <div class="auth-page">
    <!-- 页面头部 -->
    <div class="auth-header">
      <div class="header-content">
        <div class="back-btn" @click="goToHome">
          <i class="back-icon">←</i>
          <span class="back-text">首页</span>
        </div>
      </div>
    </div>

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
                v-model="loginForm.account"
                type="text"
                placeholder="请输入账号"
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

          

          <!-- 登录按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 注册链接 -->
        <div class="auth-footer">
          <p>还没有账号？<a href="#" @click.prevent="goToRegister">立即注册</a></p>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/modules/user'
import type { LoginResponse } from '@/types/user'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 检查是否有重定向参数并显示相应提示
onMounted(() => {
  if (route.query.redirect === 'auth-required') {
    ElMessage.warning('请先登录后再访问该页面')
  }
})

// 登录表单数据
const loginForm = ref({
  account: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!loginForm.value.account || !loginForm.value.password) {
    ElMessage.error('请输入账号和密码')
    return
  }

  loading.value = true
  
  try {
    // 调用登录API
    const response = await login(loginForm.value)
    
    // 从响应中解构出数据
    const { data }: { data: LoginResponse } = response

    // 使用Pinia存储用户信息和token
    userStore.setToken(data.token)
    userStore.setUserInfo(data)
    
    ElMessage.success('登录成功')
    
    // 根据用户类型跳转到相应的主页
    if (data.userType === 'merchant') {
      // 商家用户跳转到商家端主页
      router.push('/merchant/dashboard')
    } else {
      // 普通用户跳转到用户端主页
      router.push('/home')
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查账号和密码')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const goToHome = () => {
  router.push('/home')
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
  position: relative;
  height: 60px;
}

.header-content {
  position: absolute;
  top: 20px;
  left: 40px;
  z-index: 100;
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
  min-height: calc(100vh - 180px);
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