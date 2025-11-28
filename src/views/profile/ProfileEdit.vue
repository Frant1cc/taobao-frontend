<template>
  <div class="profile-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </div>
        <h1 class="page-title">个人信息</h1>
      </div>
    </div>

    <!-- 个人信息编辑表单 -->
    <div class="edit-form">
      <!-- 头像编辑 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">头像</h3>
        </div>
        <div class="avatar-edit-section">
          <div class="avatar-preview">
            <img :src="userInfo.avatar" alt="用户头像" />
            <div class="avatar-overlay" @click="changeAvatar">
              <span class="camera-icon">📷</span>
              <span class="change-text">更换头像</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户名编辑 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">用户名</h3>
        </div>
        <div class="input-section">
          <input 
            v-model="userInfo.username" 
            type="text" 
            class="username-input"
            placeholder="请输入用户名"
            maxlength="20"
          />
          <span class="char-count">{{ userInfo.username.length }}/20</span>
        </div>
      </div>

      <!-- 性别选择 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">性别</h3>
        </div>
        <div class="gender-section">
          <label class="gender-option">
            <input 
              type="radio" 
              v-model="userInfo.gender" 
              value="male" 
              class="gender-radio" 
            />
            <span class="gender-label">男</span>
          </label>
          <label class="gender-option">
            <input 
              type="radio" 
              v-model="userInfo.gender" 
              value="female" 
              class="gender-radio" 
            />
            <span class="gender-label">女</span>
          </label>
          <label class="gender-option">
            <input 
              type="radio" 
              v-model="userInfo.gender" 
              value="unknown" 
              class="gender-radio" 
            />
            <span class="gender-label">保密</span>
          </label>
        </div>
      </div>

      <!-- 出生日期 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">出生日期</h3>
        </div>
        <div class="input-section">
          <input 
            v-model="userInfo.birthday" 
            type="date" 
            class="birthday-input"
            placeholder="请选择出生日期"
          />
        </div>
      </div>

      <!-- 手机号码 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">手机号码</h3>
        </div>
        <div class="input-section">
          <input 
            v-model="userInfo.phone" 
            type="tel" 
            class="phone-input"
            placeholder="请输入手机号码"
            maxlength="20"
          />
        </div>
      </div>

      <!-- 邮箱地址 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">邮箱地址</h3>
        </div>
        <div class="input-section">
          <input 
            v-model="userInfo.email" 
            type="email" 
            class="email-input"
            placeholder="请输入邮箱地址"
            maxlength="100"
          />
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="action-section">
        <button class="save-btn" @click="saveProfile">保存修改</button>
        <button class="cancel-btn" @click="goBack">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 用户信息
const userInfo = ref({
  avatar: '@/assets/vue.svg',
  username: '淘宝用户_123456',
  gender: 'unknown',
  birthday: '',
  phone: '',
  email: ''
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 更换头像
const changeAvatar = () => {
  ElMessage.info('头像更换功能开发中...')
}

// 保存个人信息
const saveProfile = () => {
  if (!userInfo.value.username.trim()) {
    ElMessage.error('用户名不能为空')
    return
  }
  
  // 验证手机号码格式
  if (userInfo.value.phone && !/^1[3-9]\d{9}$/.test(userInfo.value.phone)) {
    ElMessage.error('请输入正确的手机号码格式')
    return
  }
  
  // 验证邮箱格式
  if (userInfo.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.value.email)) {
    ElMessage.error('请输入正确的邮箱格式')
    return
  }
  
  // 验证出生日期（如果填写了）
  if (userInfo.value.birthday) {
    const birthDate = new Date(userInfo.value.birthday)
    const today = new Date()
    if (birthDate > today) {
      ElMessage.error('出生日期不能晚于今天')
      return
    }
  }
  
  // 模拟保存操作
  console.log('保存的用户信息：', userInfo.value)
  ElMessage.success('个人信息保存成功！')
  
  // 延迟返回上一页
  setTimeout(() => {
    router.back()
  }, 1000)
}

// 页面加载时获取用户信息
onMounted(() => {
  // 这里可以调用API获取用户信息
  console.log('个人信息管理页面加载完成')
})
</script>

<style scoped>
.profile-edit-page {
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

/* 编辑表单样式 */
.edit-form {
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

/* 头像编辑区域 */
.avatar-edit-section {
  display: flex;
  justify-content: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 3px solid #f0f0f0;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.camera-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.change-text {
  font-size: 12px;
}

/* 输入区域样式 */
.input-section {
  position: relative;
}

.username-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.username-input:focus {
  border-color: #ff5021;
}



/* 性别选择区域 */
.gender-section {
  display: flex;
  gap: 20px;
}

.gender-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.gender-option:hover {
  background: #f5f5f5;
}

.gender-radio {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.gender-label {
  font-size: 14px;
  color: #333;
}

/* 日期输入框样式 */
.birthday-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.birthday-input:focus {
  border-color: #ff5021;
}

/* 手机号码输入框样式 */
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

/* 邮箱输入框样式 */
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
</style>