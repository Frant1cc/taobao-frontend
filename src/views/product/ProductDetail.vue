<script setup lang="ts">
// 商品详情页组件逻辑
</script>

<template>
  <div class="product-detail-page">
    <header class="header">
      <h1>商品详情页</h1>
    </header>
    <main class="main-content">
      <section class="product-gallery">
        <p>商品图片展示区域</p>
      </section>
      <section class="product-info">
        <h2>商品名称</h2>
        <p class="price">¥99.00</p>
        <div class="actions">
          <button class="add-to-cart">加入购物车</button>
          <button class="buy-now">立即购买</button>
        </div>
      </section>
      <section class="product-description">
        <h3>商品描述</h3>
        <p>这是商品的详细描述信息。</p>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
// 商品详情页组件局部样式
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;
$secondary-color: #ff9900;

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

.product-detail-page {
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
    .product-gallery {
      background-color: $gray-light;
      height: 300px;
      @include flex-center;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    
    .product-info {
      margin-bottom: 30px;
      
      h2 {
        font-size: 20px;
        margin-bottom: 10px;
        color: $text-primary;
      }
      
      .price {
        font-size: 24px;
        color: $primary-color;
        font-weight: bold;
        margin-bottom: 20px;
      }
      
      .actions {
        display: flex;
        gap: 15px;
        
        .add-to-cart {
          @include button-style($secondary-color);
          flex: 1;
        }
        
        .buy-now {
          @include button-style();
          flex: 1;
        }
      }
    }
    
    .product-description {
      h3 {
        font-size: 16px;
        margin-bottom: 10px;
        color: $text-primary;
      }
      
      p {
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
}
</style>