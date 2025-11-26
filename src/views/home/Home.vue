<script setup lang="ts">
// 主页组件逻辑
</script>

<template>
  <div class="home-page">
    <header class="header">
      <h1>欢迎来到淘宝首页</h1>
    </header>
    <main class="main-content">
      <section class="banner">
        <p>这里是轮播图区域</p>
      </section>
      <section class="categories">
        <h2>商品分类</h2>
        <div class="category-list">
          <div class="category-item" v-for="i in 5" :key="i">
            分类 {{ i }}
          </div>
        </div>
      </section>
      <section class="featured-products">
        <h2>推荐商品</h2>
        <div class="product-list">
          <div class="product-item" v-for="i in 6" :key="i">
            商品 {{ i }}
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
// 首页组件局部样式
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button-style($bg-color: $primary-color, $text-color: $white) {
  background-color: $bg-color;
  color: $text-color;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
  }
}

.home-page {
  padding: 20px;
  
  .header {
    text-align: center;
    margin-bottom: 30px;
    
    h1 {
      color: $primary-color;
      font-size: 24px;
    }
  }
  
  .main-content {
    .banner {
      background-color: $gray-light;
      height: 200px;
      @include flex-center;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    
    .categories {
      margin-bottom: 30px;
      
      h2 {
        font-size: 20px;
        margin-bottom: 15px;
        color: $text-primary;
      }
      
      .category-list {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        
        .category-item {
          flex: 1;
          min-width: 100px;
          height: 100px;
          background-color: $white;
          border: 1px solid $border-color;
          border-radius: 4px;
          @include flex-center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          
          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
        }
      }
    }
    
    .featured-products {
      h2 {
        font-size: 20px;
        margin-bottom: 15px;
        color: $text-primary;
      }
      
      .product-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        
        .product-item {
          height: 150px;
          background-color: $white;
          border: 1px solid $border-color;
          border-radius: 4px;
          @include flex-center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          
          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>