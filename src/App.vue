<script setup lang="ts">
import ElTabBar from './components/ElTabBar.vue'
</script>

<template>
  <div class="app-container">
    <router-view />
    <ElTabBar />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding-top: 60px; // 为顶部Tab栏留出空间
  padding-bottom: 0;
}
</style>
