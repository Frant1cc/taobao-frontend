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
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像" />
          <div v-else class="avatar-placeholder">
            <span class="placeholder-icon">👤</span>
          </div>
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
          <label 
            class="gender-option" 
            :class="{ active: userInfo.gender === 'male' }"
          >
            <input 
              type="radio" 
              v-model="userInfo.gender" 
              value="male" 
              class="gender-radio visually-hidden" 
            />
            <span class="custom-radio"></span>
            <span class="gender-label">男</span>
          </label>
          <label 
            class="gender-option" 
            :class="{ active: userInfo.gender === 'female' }"
          >
            <input 
              type="radio" 
              v-model="userInfo.gender" 
              value="female" 
              class="gender-radio visually-hidden" 
            />
            <span class="custom-radio"></span>
            <span class="gender-label">女</span>
          </label>
          <label 
            class="gender-option" 
            :class="{ active: userInfo.gender === 'unknown' }"
          >
            <input 
              type="radio" 
              v-model="userInfo.gender" 
              value="unknown" 
              class="gender-radio visually-hidden" 
            />
            <span class="custom-radio"></span>
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
    <div class="birthday-display">
      <span class="birthday-text">{{ formatDateDisplay(userInfo.birthday) }}</span>
      <button type="button" class="change-date-btn" @click="openDatePicker">修改日期</button>
    </div>
    <!-- 隐藏的日期输入框，用于日期选择器 -->
    <input 
      ref="datePickerRef"
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
            maxlength="11"
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
            maxlength="50"
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getUserInfo, updateUserInfo, uploadUserAvatar } from '@/api/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const datePickerRef = ref(null)

const userInfo = ref({
  avatar: '',
  username: '',
  gender: 'unknown',
  birthday: '',
  phone: '',
  email: ''
})

// 格式化日期显示
const formatDateDisplay = (dateString: string) => {
  if (!dateString) {
    return '未设置'
  }
  
  // 如果是 YYYY-MM-DD 格式，直接显示
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    return dateString
  }
  
  // 尝试解析时间戳格式
  if (/^\d+$/.test(dateString)) {
    const timestamp = parseInt(dateString, 10)
    const date = new Date(timestamp)
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }
  
  // 尝试解析其他日期格式
  const date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return '日期格式错误'
}

// 打开日期选择器
const openDatePicker = () => {
  if (datePickerRef.value) {
    // 使用 showPicker API 如果可用，否则回退到 click 方法
    if (typeof (datePickerRef.value as HTMLInputElement).showPicker === 'function') {
(datePickerRef.value as HTMLInputElement).click()
    } else {
(datePickerRef.value as HTMLInputElement).click()
    }
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 更换头像
const changeAvatar = () => {
  // 创建一个隐藏的文件输入元素
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.style.display = 'none'
  
  // 添加文件选择事件监听器
  fileInput.onchange = async (event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (file) {
      try {
        // 显示上传中提示
        ElMessage.info('正在上传头像...')
        
        // 调用API上传头像
        const response = await uploadUserAvatar(file)
        
        // 更新用户信息中的头像URL
        if (response.data?.avatarUrl) {
          const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || ''
          const fullAvatarUrl = baseUrl ? baseUrl + response.data.avatarUrl : response.data.avatarUrl
          
          // 更新用户信息中的头像URL
          userInfo.value.avatar = fullAvatarUrl
          
          // 同时更新用户store中的头像信息
          if (userStore.userInfo) {
            userStore.userInfo.avatarUrl = response.data.avatarUrl
          }
          
          ElMessage.success('头像上传成功！')
          
          // 发送事件通知其他组件刷新
          window.dispatchEvent(new CustomEvent('user-profile-updated'))
          
          // 强制触发视图更新
          nextTick(() => {
            // 可以在这里添加额外的刷新逻辑
          })
        } else {
          ElMessage.success('头像上传成功！')
        }
      } catch (error) {
        console.error('上传头像失败:', error)
        ElMessage.error('头像上传失败，请稍后重试')
      }
    }
  }
  
  // 触发文件选择
  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}

// 刷新当前页面的用户信息
const refreshCurrentUserInfo = async () => {
  try {
    const response = await getUserInfo()
    // 更新用户信息到表单
    const userData = response.data
    // 处理生日时间戳转换为日期字符串
    let birthdayStr = ''
    if (userData.birthday) {
      // 如果是数字字符串，转换为日期格式
      if (/^\d+$/.test(userData.birthday)) {
        const timestamp = parseInt(userData.birthday, 10)
        const date = new Date(timestamp)
        // 转换为 YYYY-MM-DD 格式
        birthdayStr = date.toISOString().split('T')[0] || ''
      } else {
        // 如果已经是日期字符串格式，直接使用
        birthdayStr = userData.birthday
      }
    }
    
    userInfo.value = {
      avatar: userData.avatarUrl || '',
      username: userData.username || '',
      gender: userData.gender || 'unknown',
      birthday: birthdayStr,
      phone: userData.phone || '',
      email: userData.email || ''
    }
    
    // 如果有头像URL且设置了基础URL，则拼接完整路径
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || ''
    if (userData.avatarUrl && baseUrl) {
      userInfo.value.avatar = baseUrl + userData.avatarUrl
    }
  } catch (error) {
    console.error('刷新当前页面用户信息失败:', error)
  }
}

// 保存个人信息
const saveProfile = async () => {
  if (!userInfo.value.username.trim()) {
    ElMessage.error('用户名不能为空')
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
  
  // 验证手机号格式（如果填写了）
  if (userInfo.value.phone && !/^1[3-9]\d{9}$/.test(userInfo.value.phone)) {
    ElMessage.error('请输入正确的手机号码')
    return
  }
  
  // 验证邮箱格式（如果填写了）
  if (userInfo.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.value.email)) {
    ElMessage.error('请输入正确的邮箱地址')
    return
  }
  
  try {
    // 处理生日日期，转换为时间戳格式
    let birthdayTimestamp = null
    if (userInfo.value.birthday) {
      // 创建日期对象并转换为时间戳（毫秒）
      const date = new Date(userInfo.value.birthday)
      if (!isNaN(date.getTime())) {
        birthdayTimestamp = date.getTime().toString() // 转换为毫秒时间戳字符串
      }
    }
    
    // 调用API更新用户信息
    await updateUserInfo({
      username: userInfo.value.username,
      gender: userInfo.value.gender,
      birthday: birthdayTimestamp ?? undefined,
      phone: userInfo.value.phone,
      email: userInfo.value.email
    })
    
    ElMessage.success('个人信息保存成功！')
    
    // 刷新用户信息
    try {
      const response = await getUserInfo()
      userStore.setUserInfo(response.data)
      // 通过事件总线或路由参数通知Profile页面刷新
      window.dispatchEvent(new CustomEvent('user-profile-updated'))
      
      // 同时刷新当前页面显示的用户信息
      await refreshCurrentUserInfo()
    } catch (error) {
      console.error('刷新用户信息失败:', error)
    }
    
    // 延迟返回上一页
    setTimeout(() => {
      router.back()
    }, 1000)
  } catch (error) {
    console.error('保存用户信息失败:', error)
    ElMessage.error('保存用户信息失败，请稍后重试')
  }
}

// 页面加载时获取用户信息
onMounted(async () => {
  await refreshCurrentUserInfo()
  
  // 监听用户信息更新事件
  window.addEventListener('user-profile-updated', refreshCurrentUserInfo)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('user-profile-updated', refreshCurrentUserInfo)
})
</script>

<style scoped>
.profile-edit-page {
  min-height: 100vh;
  height: auto;
  background: #f5f5f5;
  padding-bottom: 20px;
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

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.placeholder-icon {
  font-size: 40px;
  color: #ccc;
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

/* 字符计数样式 */
.char-count {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #999;
  opacity: 0.8;
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
  border: 1px solid transparent;
}

.gender-option:hover {
  background: #f5f5f5;
}

/* 隐藏原始单选框 */
.gender-radio.visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}

/* 自定义单选框样式 */
.custom-radio {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  background-color: white;
  vertical-align: middle;
  transition: all 0.3s;
}

/* 选中状态的自定义单选框 */
.gender-option.active .custom-radio {
  border-color: #ff5000;
  background-color: white;
}

/* 选中状态的内部圆点 */
.gender-option.active .custom-radio::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5000;
}

.gender-option.active {
  border-color: #ff5000;
  background: #fff5f0;
}

.gender-label {
  font-size: 14px;
  color: #333;
}

/* 出生日期显示区域 */
.birthday-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.birthday-text {
  font-size: 16px;
  color: #333;
}

.change-date-btn {
  background: #ff5000;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.change-date-btn:hover {
  background: #e04500;
}

/* 隐藏的日期输入框 */
.birthday-input.hidden {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 0;
  height: 0;
  opacity: 0;
}

/* 出生日期输入框样式 */
.birthday-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  background: white;
}

.birthday-input:focus {
  outline: none;
  border-color: #ff5000;
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.1);
}

/* 手机号码输入框样式 */
.phone-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  background: white;
}

.phone-input:focus {
  outline: none;
  border-color: #ff5000;
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.1);
}

/* 邮箱输入框样式 */
.email-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  background: white;
}

.email-input:focus {
  outline: none;
  border-color: #ff5000;
  box-shadow: 0 0 0 2px rgba(255, 80, 0, 0.1);
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