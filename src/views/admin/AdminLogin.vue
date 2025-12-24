<template>
  <div class="auth-page">
    <!-- 登录表单 -->
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
          <h2>管理后台登录</h2>
          <p>请使用您的管理员账号密码登录</p>
        </div>

        <form @submit.prevent="handleLogin">
          <!-- 管理员账号输入 -->
          <div class="form-group">
            <label for="username">管理员账号</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入管理员账号"
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



          <!-- 提交按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 页脚 -->
        <div class="form-footer">
          <p>© 2024 淘宝管理后台 版权所有</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { adminAPI } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const showPassword = ref(false)

// 切换密码显示状态
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理登录
const handleLogin = async () => {
  // 基本表单验证
  if (!loginForm.username.trim()) {
    ElMessage.error('请输入管理员账号')
    return
  }
  
  if (!loginForm.password.trim()) {
    ElMessage.error('请输入密码')
    return
  }
  
  try {
    loading.value = true
    
    console.group('管理员登录请求')
    console.log('账号:', loginForm.username)
    console.log('密码长度:', loginForm.password.length)
    console.groupEnd()
    
    // 使用真实API进行登录
    const response = await adminAPI.adminLogin({
      account: loginForm.username,
      password: loginForm.password
    })
    
    console.log('管理员登录响应:', response)
    
    // 存储管理员信息并更新用户状态
    if (response.data && response.data.token) {
      // 更新用户存储状态（用于路由守卫验证）
      userStore.setToken(response.data.token)
      userStore.setUserInfo({
        account: response.data.account,
        username: response.data.username || response.data.account,
        userType: response.data.userType || 'operator',
        token: response.data.token
      })
      
      // 同时保存到管理员专用存储（用于管理后台功能）
      localStorage.setItem('admin_token', response.data.token)
      localStorage.setItem('admin_info', JSON.stringify({
        account: response.data.account,
        username: response.data.username,
        userType: response.data.userType,
        token: response.data.token
      }))
      
      ElMessage.success('登录成功')
      router.push('/admin/dashboard')
    } else {
      console.error('登录响应数据异常:', response)
      ElMessage.error('登录失败：服务器返回数据异常')
    }
    
  } catch (error: any) {
    console.error('管理员登录失败:', error)
    
    // 根据错误类型显示不同的提示信息
    if (error.message.includes('网络连接失败')) {
      ElMessage.error('网络连接失败，请检查网络设置')
    } else if (error.message.includes('服务器内部错误')) {
      ElMessage.error('服务器繁忙，请稍后重试')
    } else if (error.message.includes('接口不存在')) {
      ElMessage.error('登录接口不存在，请联系管理员')
    } else {
      ElMessage.error(error.message || '登录失败，请重试')
    }
  } finally {
    loading.value = false
  }
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

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
  background: white;
  border: 1px solid #e0e0e0;
  gap: 8px;
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

.back-text {
  font-size: 14px;
}

/* 登录容器样式 */
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

/* 页脚样式 */
.form-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.form-footer p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .auth-container {
    padding: 10px;
  }
  
  .auth-form {
    padding: 30px 20px;
  }
  
  .form-header h2 {
    font-size: 20px;
  }
  

}
</style>