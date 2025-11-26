<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElTabs, ElTabPane } from 'element-plus'

// 定义Tab选项
interface Tab {
  name: string
  path: string
}

const tabs: Tab[] = [
  { name: '首页', path: '/home' },
  { name: '购物车', path: '/cart' },
  { name: '我的', path: '/profile' }
]

const router = useRouter()
const route = useRoute()
const activeTab = ref('/home')

// 监听路由变化，更新激活的Tab
watch(
  () => route.path,
  (newPath) => {
    // 匹配Tab路径或设置默认首页
    const matchedTab = tabs.find(tab => newPath.startsWith(tab.path))
    if (matchedTab) {
      activeTab.value = matchedTab.path
    } else {
      activeTab.value = '/home'
    }
  },
  { immediate: true }
)

// Tab点击事件处理
const handleTabClick = (path: string) => {
  activeTab.value = path
  router.push(path)
}
</script>

<template>
  <div class="el-tab-bar">
    <el-tabs v-model="activeTab" @tab-click="(tab) => handleTabClick(tab.props.name as string)" class="tab-container">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.path"
        :name="tab.path"
        :label="tab.name"
      />
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.el-tab-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 添加底部阴影以增强视觉分离效果
  
  :deep(.tab-container) {
    .el-tabs__header {
      margin: 0;
      
      .el-tabs__nav-wrap {
        position: relative;
        
        &::after {
          content: none; // 移除默认的底部边框
        }
      }
      
      .el-tabs__nav {
        display: flex;
        justify-content: space-between; // 在Tab之间添加间距
        padding: 0 20px; // 添加左右内边距以创建边缘间距
      }
      
      .el-tabs__item {
        height: 60px; // 将Tab栏高度改为60px
        padding: 0 15px; // 为每个Tab添加左右内边距
        font-size: 20px; // 增大字体到20px
        color: #666;
        flex: none; // 不再拉伸Tab项
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap; // 防止文字换行
        
        &.is-active {
          color: #ff5000;
          font-weight: bold;
        }
      }
      
      .el-tabs__active-bar {
        background-color: #ff5000; // 将激活的Tab进度条颜色改为橙色
      }
    }
    
    .el-tabs__content {
      display: none; // 隐藏内容区域
    }
  }
}
</style>