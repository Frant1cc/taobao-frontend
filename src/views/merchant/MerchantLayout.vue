<template>
  <div class="merchant-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <img :src="shopLogoUrl" :alt="shopInfo?.shopName || '淘宝商家后台'" />
          <span class="shop-name">{{ shopInfo?.shopName || '淘宝商家后台' }}</span>
        </div>
        <div class="search-box">
          <el-input
            placeholder="搜索商品、订单..."
            prefix-icon="Search"
            size="large"
          />
        </div>
      </div>
      <div class="header-right">
        <div class="user-info" @click="goToSettings">
          <el-avatar :size="32" :src="fullAvatarUrl" />
          <span class="username">{{ shopInfo?.shopName || '店铺名称' }}</span>
        </div>
      </div>
    </header>

    <div class="main-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <div class="menu-group">
            <div class="menu-title">工作台</div>
            <ul class="menu-list">
              <li class="menu-item" :class="{ active: $route.name === 'MerchantDashboard' }">
                <router-link to="/merchant/dashboard" class="menu-link">
                  <el-icon><Monitor /></el-icon>
                  <span>工作台</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="menu-group">
            <div class="menu-title">商品管理</div>
            <ul class="menu-list">
              <li class="menu-item" :class="{ active: $route.name === 'MerchantProducts' }">
                <router-link to="/merchant/products" class="menu-link">
                  <el-icon><Goods /></el-icon>
                  <span>商品管理</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="menu-group">
            <div class="menu-title">订单管理</div>
            <ul class="menu-list">
              <li class="menu-item" :class="{ active: $route.name === 'MerchantOrders' }">
                <router-link to="/merchant/orders" class="menu-link">
                  <el-icon><Document /></el-icon>
                  <span>订单管理</span>
                </router-link>
              </li>
            </ul>
          </div>



          <div class="menu-group">
            <div class="menu-title">店铺设置</div>
            <ul class="menu-list">
              <li class="menu-item" :class="{ active: $route.name === 'MerchantSettings' }">
                <router-link to="/merchant/settings" class="menu-link">
                  <el-icon><Setting /></el-icon>
                  <span>店铺设置</span>
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useShopStore } from '@/stores/shop'
import {
  Monitor,
  Goods,
  Document,
  Setting,
  Search,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const shopStore = useShopStore()

// 用户信息（从用户仓库获取）
const userInfo = computed(() => userStore.userInfo)

// 店铺信息（从店铺仓库获取）
const shopInfo = computed(() => shopStore.currentShop)

// 店铺Logo URL（从店铺仓库获取）
const shopLogoUrl = computed(() => shopStore.shopLogoUrl)

// 获取完整头像URL（通过代理服务器解决跨域问题）
const getFullAvatarUrl = (avatarPath: string) => {
  if (!avatarPath) return 'https://via.placeholder.com/32x32'
  
  // 如果已经是完整URL，检查是否来自阿里云OSS
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    if (avatarPath.includes('taobao-hqh.oss-cn-beijing.aliyuncs.com')) {
      // 将阿里云OSS URL转换为本地代理路径
      const ossPath = avatarPath.replace('https://taobao-hqh.oss-cn-beijing.aliyuncs.com/', '')
      return `/oss/${ossPath}`
    } else {
      // 其他外部URL直接使用
      return avatarPath
    }
  }
  
  // 相对路径，通过代理访问
  return `/oss/${avatarPath}`
}

// 计算属性：完整的头像URL（使用店铺头像）
const fullAvatarUrl = computed(() => {
  const shopLogo = shopInfo.value?.shopLogo
  return getFullAvatarUrl(shopLogo || '')
})

// 跳转到店铺设置页面
const goToSettings = () => {
  router.push('/merchant/settings')
}

// 加载用户信息和店铺信息
onMounted(async () => {
  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }
  
  // 加载店铺信息
  if (!shopStore.currentShop) {
    try {
      await shopStore.fetchShopInfo()
    } catch (error) {
      console.error('加载店铺信息失败:', error)
    }
  }
})
</script>

<style scoped lang="scss">
@use "sass:color";

// 使用客户端相同的颜色主题
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;

.merchant-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $gray-light;
}

.header {
  height: 60px;
  background: $white;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  z-index: 1000;

  .header-left {
    display: flex;
    align-items: center;
    gap: 24px;
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      
      img {
        height: 32px;
        width: 32px;
        border-radius: 4px;
        object-fit: cover;
      }
      
      .shop-name {
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
      }
    }
    
    .search-box {
      width: 300px;
      
      :deep(.el-input__wrapper) {
        border-radius: 20px;
        border: 1px solid $border-color;
        
        &:focus-within {
          border-color: $primary-color;
          box-shadow: 0 0 5px rgba($primary-color, 0.3);
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: $gray-light;
        color: $primary-color;
      }
      
      .username {
        font-size: 14px;
        color: $text-primary;
      }
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: $white;
  border-right: 1px solid $border-color;
  overflow-y: auto;
  
  .nav-menu {
    padding: 16px 0;
    
    .menu-group {
      margin-bottom: 16px;
      
      .menu-title {
        padding: 8px 24px;
        font-size: 12px;
        color: $text-secondary;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          
          .menu-item {
            .menu-link {
                display: flex;
                align-items: center;
                padding: 12px 24px;
                color: $text-secondary;
                text-decoration: none;
                transition: all 0.3s;
                outline: none; // 移除默认的焦点边框
                
                // 移除焦点状态样式
                &:focus {
                outline: none;
                box-shadow: none;
                }
                
                // 移除 Element Plus 可能的焦点样式
                &:focus-visible {
                outline: none;
                box-shadow: none;
                }
                
                &:hover {
                background-color: $gray-light;
                color: $primary-color;
                }
                
                .el-icon {
                margin-right: 8px;
                font-size: 16px;
                }
                
                span {
                font-size: 14px;
                font-weight: 500;
                }
            }
            
            &.active {
                .menu-link {
                background-color: rgba($primary-color, 0.1) !important;
                color: $primary-color !important;
                border-right: 3px solid $primary-color !important;
                outline: none !important; // 确保激活状态也没有边框
                box-shadow: none !important;
                }
            }
}
        }
    }
  }
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: $gray-light;
}
</style>