<template>
  <div class="profile-page">
    <!-- 用户信息头部 -->
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar">
          <img :src="avatarUrl" alt="用户头像" />
        </div>
        <div class="user-details">
          <h3 class="username">{{ displayName }}</h3>
          <p class="user-level">普通会员</p>
        </div>
      </div>
    </div>

    <!-- 合并的订单管理区域 -->
    <div class="order-section">
      <div class="section-header">
        <h3 class="section-title">我的订单</h3>
      </div>
      
      <div class="order-status">
        <div class="status-item" @click="handleOrderClick('待付款')">
          <div class="status-icon">📦</div>
          <span class="status-label">待付款</span>
          <span class="order-count">{{ orderStats.pendingOrderCount }}</span>
        </div>
        <div class="status-item" @click="handleOrderClick('待发货')">
          <div class="status-icon">🚚</div>
          <span class="status-label">待发货</span>
          <span class="order-count">{{ orderStats.paidOrderCount }}</span>
        </div>
        <div class="status-item" @click="handleOrderClick('待收货')">
          <div class="status-icon">📬</div>
          <span class="status-label">待收货</span>
          <span class="order-count">{{ orderStats.shippedOrderCount }}</span>
        </div>
        <div class="status-item" @click="handleOrderClick('待评价')">
          <div class="status-icon">⭐</div>
          <span class="status-label">待评价</span>
          <span class="order-count">{{ orderStats.completedOrderCount }}</span>
        </div>
        <div class="status-item" @click="handleOrderClick('退款/售后')">
          <div class="status-icon">🔄</div>
          <span class="status-label">退款/售后</span>
          <span class="order-count">{{ orderStats.cancelledOrderCount }}</span>
        </div>
      </div>
    </div>

    <!-- 个人信息管理区域 -->
    <div class="profile-section">
      <div class="section-header">
        <h3 class="section-title">个人信息管理</h3>
      </div>
      
      <div class="profile-menu">
        <div class="menu-item" @click="handleMenuClick('个人信息')">
          <div class="menu-icon">👤</div>
          <span class="menu-label">个人信息</span>
          <span class="menu-arrow">></span>
        </div>
        <div class="menu-item" @click="handleMenuClick('收货地址')">
          <div class="menu-icon">📍</div>
          <span class="menu-label">收货地址</span>
          <span class="menu-arrow">></span>
        </div>
        <div class="menu-item" @click="handleMenuClick('账户安全')">
          <div class="menu-icon">🔒</div>
          <span class="menu-label">账户安全</span>
          <span class="menu-arrow">></span>
        </div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <button class="logout-btn" @click="confirmLogout">
        <div class="logout-icon">🚪</div>
        <span class="logout-label">退出登录</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api/modules/user'
import defaultAvatar from '@/assets/vue.svg'

const router = useRouter()
const userStore = useUserStore()

// 创建一个本地响应式变量来存储头像URL
const avatarUrl = ref(defaultAvatar)

// 计算属性：显示用户名或默认名称
const displayName = computed(() => {
  return userStore.userInfo?.username || userStore.userInfo?.account || '淘宝用户'
})

// 存储订单统计数据
const orderStats = ref({
  pendingOrderCount: 0,
  paidOrderCount: 0,
  shippedOrderCount: 0,
  completedOrderCount: 0,
  cancelledOrderCount: 0
})

// 刷新用户信息的方法
const refreshUserInfo = async () => {
  try {
    const response = await getUserInfo()
    // 更新用户store中的用户信息
    userStore.setUserInfo(response.data)
    // 更新本地头像URL变量，拼接完整路径
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || ''
    if (response.data.avatarUrl && baseUrl) {
      avatarUrl.value = baseUrl + response.data.avatarUrl
    } else {
      avatarUrl.value = response.data.avatarUrl || defaultAvatar
    }
    
    // 更新订单统计数据
    orderStats.value.pendingOrderCount = response.data.pendingOrderCount || 0
    orderStats.value.paidOrderCount = response.data.paidOrderCount || 0
    orderStats.value.shippedOrderCount = response.data.shippedOrderCount || 0
    orderStats.value.completedOrderCount = response.data.completedOrderCount || 0
    orderStats.value.cancelledOrderCount = response.data.cancelledOrderCount || 0
  } catch (error) {
    console.error('获取用户信息失败:', error)
    avatarUrl.value = defaultAvatar
  }
}

// 在组件挂载时获取用户详细信息
onMounted(async () => {
  await refreshUserInfo()
  
  // 监听用户信息更新事件
  window.addEventListener('user-profile-updated', refreshUserInfo)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('user-profile-updated', refreshUserInfo)
})

// 订单点击事件处理
const handleOrderClick = (status: string) => {
  console.log(`点击了订单状态: ${status}`)
  // 跳转到对应订单列表页面
  router.push(`/profile/orders?status=${status}`)
}

// 菜单项点击事件处理
const handleMenuClick = (menu: string) => {
  switch (menu) {
    case '个人信息':
      router.push('/profile/edit')
      break
    case '收货地址':
      router.push('/profile/addresses')
      break
    case '账户安全':
      router.push('/profile/security')
      break
    case '账号绑定':
      console.log('跳转到账号绑定页面')
      // router.push('/account-binding')
      break
    case '消息通知':
      console.log('跳转到消息通知设置页面')
      // router.push('/notifications')
      break
    default:
      console.log(`点击了菜单项: ${menu}`)
  }
}

// 确认退出登录
const confirmLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？退出后将需要重新登录',
      '确认退出',
      {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'logout-confirm-dialog'
      }
    )
    
    // 用户确认退出，执行退出登录逻辑
    console.log('用户确认退出登录')
    // 使用Pinia store清除用户状态
    userStore.clearToken()
    
    ElMessageBox.alert('退出登录成功', '提示', {
      confirmButtonText: '确定',
      callback: () => {
        console.log('退出登录流程完成')
        // 跳转到登录页面
        router.push('/login')
      }
    })
  } catch (error) {
    // 用户取消退出
    console.log('用户取消退出登录')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

/* 用户信息头部样式 */
.profile-header {
  background: linear-gradient(135deg, #ff5021 0%, #ff7b50 100%);
  color: white;
  padding: 20px;
  border-radius: 0 0 20px 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.user-level {
  font-size: 12px;
  opacity: 0.9;
  margin: 0;
}

.btn-settings {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
}

/* 订单管理区域样式 */
.order-section,
.profile-section,
.other-section {
  background: white;
  margin: 10px;
  border-radius: 8px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.view-all {
  font-size: 12px;
  color: #999;
  text-decoration: none;
}

.order-status {
  display: flex;
  justify-content: space-around;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 8px;
  transition: all 0.2s ease;
}

.status-item:hover {
  background: #f8f8f8;
  border-radius: 8px;
}

.status-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.status-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.order-count {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff5021;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  font-weight: 600;
}

/* 菜单项样式 */
.profile-menu,
.other-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-arrow {
  color: #999;
  font-size: 12px;
}

/* 退出登录按钮样式 */
.logout-section {
  margin: 20px 10px;
}

.logout-btn {
  width: 30%;
  margin: 0 auto;
  background: white;
  border: 1px solid #ff5021;
  color: #ff5021;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.logout-btn:hover {
  background: #ff5021;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 80, 33, 0.3);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 80, 33, 0.3);
}

.logout-icon {
  font-size: 16px;
  margin-right: 8px;
}

.logout-label {
  font-size: 14px;
  font-weight: 500;
}

</style>