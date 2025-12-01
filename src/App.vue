<script setup lang="ts">
import ElTabBar from './components/ElTabBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 判断当前是否在商家端页面
const isMerchantPage = computed(() => {
  return route.path.startsWith('/merchant')
})
</script>

<template>
  <div class="app-container" :class="{ 'merchant-page': isMerchantPage }">
    <router-view />
    <ElTabBar v-if="!isMerchantPage" />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding-top: 60px; // 为顶部Tab栏留出空间
  padding-bottom: 0;
  
  &.merchant-page {
    padding-top: 0; // 商家端不需要顶部Tab栏的padding
  }
}
</style>
