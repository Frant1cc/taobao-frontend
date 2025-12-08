<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <h2>管理后台</h2>
        </div>
      </div>
      <div class="header-right">
        <div class="user-info">
          <el-avatar :size="32" :src="userAvatar" />
          <span class="username">管理员</span>
          <el-dropdown @command="handleCommand">
            <el-icon><arrow-down /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <div class="main-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <ul class="menu-list">
            <li class="menu-item" :class="{ active: $route.path === '/admin/dashboard' }">
              <router-link to="/admin/dashboard" class="menu-link">
                <span class="menu-icon">📊</span>
                <span>数据概览</span>
              </router-link>
            </li>
            
            <li class="menu-item" :class="{ active: $route.path === '/admin/users' }">
              <router-link to="/admin/users" class="menu-link">
                <span class="menu-icon">👥</span>
                <span>用户管理</span>
              </router-link>
            </li>
            
            <li class="menu-item" :class="{ active: $route.path === '/admin/merchants' }">
              <router-link to="/admin/merchants" class="menu-link">
                <span class="menu-icon">🏪</span>
                <span>商家管理</span>
              </router-link>
            </li>
            
            <li class="menu-item" :class="{ active: $route.path === '/admin/audit' }">
              <router-link to="/admin/audit" class="menu-link">
                <span class="menu-icon">✅</span>
                <span>审核管理</span>
              </router-link>
            </li>
            
            <li class="menu-item" :class="{ active: $route.path === '/admin/settings' }">
              <router-link to="/admin/settings" class="menu-link">
                <span class="menu-icon">⚙️</span>
                <span>系统设置</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="content">
        <div class="content-header">
          <h1>{{ pageTitle }}</h1>
        </div>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': '数据概览',
    '/admin/users': '用户管理',
    '/admin/merchants': '商家管理',
    '/admin/audit': '审核管理',
    '/admin/settings': '系统设置'
  }
  return titles[route.path] || '管理后台'
})

const userAvatar = computed(() => {
  return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '退出确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      // 清除登录信息
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      
      ElMessage.success('退出登录成功')
      
      // 跳转到登录页
      router.push('/admin/login')
    } catch (error) {
      // 用户取消操作
    }
  } else if (command === 'profile') {
    ElMessage.info('个人信息功能开发中')
  }
}
</script>

<style scoped lang="scss">
@use "sass:color";

// 使用与商家端相同的颜色主题
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;

.admin-layout {
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
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
        margin: 0;
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
          outline: none;
          
          &:focus {
            outline: none;
            box-shadow: none;
          }
          
          &:focus-visible {
            outline: none;
            box-shadow: none;
          }
          
          &:hover {
            background-color: $gray-light;
            color: $primary-color;
          }
          
          .menu-icon {
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
            outline: none !important;
            box-shadow: none !important;
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
  
  .content-header {
    margin-bottom: 24px;
    
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }
}
</style>