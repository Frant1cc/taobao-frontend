<script setup lang="ts">
import ElTabBar from './components/ElTabBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 判断当前是否在商家端或管理员页面
const shouldShowTabBar = computed(() => {
  return !route.path.startsWith('/merchant') && !route.path.startsWith('/admin')
})
</script>

<template>
  <div class="app-container" :class="{ 'no-tabbar': !shouldShowTabBar }">
    <router-view />
    <ElTabBar v-if="shouldShowTabBar" />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding-top: 60px; // 为顶部Tab栏留出空间
  padding-bottom: 60px; // 为底部导航栏留出空间
  
  &.no-tabbar {
    padding-top: 0; // 商家端和管理员页面不需要顶部Tab栏的padding
    padding-bottom: 0; // 商家端和管理员页面不需要底部导航栏的padding
  }
}
</style>
