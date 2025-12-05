<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getProductList } from '@/api/modules/product'
import { IMAGE_BASE_URL } from '@/api/config'
import type { Product } from '@/types/product'

const searchQuery = ref('')
const router = useRouter()
const userStore = useUserStore()
const currentBannerIndex = ref(0)
let bannerInterval: number | null = null

// 模拟轮播图数据
const bannerImages = [
  'https://picsum.photos/800/300?random=1',
  'https://picsum.photos/800/300?random=2',
  'https://picsum.photos/800/300?random=3',
  'https://picsum.photos/800/300?random=4'
]

// 商品分类数据
const categories = ref([
  { id: 1, name: '数码' },
  { id: 2, name: '生鲜' },
  { id: 3, name: '图书' },
  { id: 4, name: '衣服' },
  { id: 5, name: '零食' },
  { id: 6, name: '宠物' }
])

// 轮播图自动播放
const startBannerRotation = () => {
  // 如果已经有定时器在运行，则不重复创建
  if (bannerInterval) return
  
  bannerInterval = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % bannerImages.length
  }, 3000)
}

// 停止轮播图自动播放
const stopBannerRotation = () => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
    bannerInterval = null
  }
}

// 切换到下一张图片
const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % bannerImages.length
}

// 切换到上一张图片
const prevBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value - 1 + bannerImages.length) % bannerImages.length
}

// 真实商品数据
const featuredProducts = ref<Product[]>([])

// 获取图片完整URL
const getImageUrl = (imagePath: string) => {
  // 如果imagePath已经是完整URL，则直接返回
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath
  }
  // 否则拼接基础URL
  return imagePath ? `${IMAGE_BASE_URL}/${imagePath}` : ''
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  // 图片加载错误时不使用默认图片，保持空白
  target.style.display = 'none'
}

// 获取商品列表
const fetchProductList = async () => {
  try {
    const response = await getProductList()
    console.log('商品列表数据:', response)
    
    // 处理API返回的数据格式
    if (response && response.data) {
      // 将API返回的数据转换为前端需要的格式
      featuredProducts.value = response.data.map((item: any) => {
        // 解析主图数组
        let images: string[] = []
        try {
          if (typeof item.mainImages === 'string') {
            images = JSON.parse(item.mainImages)
          } else if (Array.isArray(item.mainImages)) {
            images = item.mainImages
          }
        } catch (e) {
          console.warn('解析商品图片失败:', e)
          images = []
        }
        
        return {
          id: item.productId?.toString() || item.id?.toString() || '',
          name: item.productName || item.name || '未知商品',
          price: item.price || item.salePrice || 0,
          description: item.description || '',
          images: images,
          categoryId: item.categoryId?.toString() || '',
          categoryName: item.categoryName || ''
        }
      })
    } else {
      // 如果没有数据，清空商品列表
      featuredProducts.value = []
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    // 接口响应失败时不清空数据，保持原有状态或空状态
    featuredProducts.value = []
  }
}

onMounted(() => {
  startBannerRotation()
  fetchProductList()
})

onUnmounted(() => {
  stopBannerRotation()
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

// 处理商品点击事件
const handleProductClick = (product: Product) => {
  console.log('点击的商品ID:', product.id)
  // 跳转到商品详情页面，携带商品ID
  router.push(`/product/${product.id}`)
}

// 处理分类点击事件
const handleCategoryClick = (category: { id: number; name: string }) => {
  console.log('点击的分类ID:', category.id)
}
</script>
<template>
  <div class="home-page">
    <header class="header">
      <h1>欢迎来到黄启华首页</h1>
      <div class="header-actions" v-if="!userStore.isLoggedIn">
        <router-link to="/login" class="auth-btn login-btn">登录</router-link>
        <router-link to="/register" class="auth-btn register-btn">注册</router-link>
      </div>
      <div class="search-container">
        <input 
          type="text" 
          placeholder="搜索商品" 
          class="search-input"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">搜索</button>
      </div>
    </header>
    <main class="main-content">
      <section class="banner" @mouseenter="stopBannerRotation" @mouseleave="startBannerRotation">
        <div class="carousel-container">
          <img 
            v-for="(image, index) in bannerImages" 
            :key="index"
            :src="image" 
            :alt="'轮播图 ' + (index + 1)"
            class="carousel-image"
            :class="{ active: index === currentBannerIndex }"
          />
          <button class="carousel-btn prev-btn" @click="prevBanner">‹</button>
          <button class="carousel-btn next-btn" @click="nextBanner">›</button>
        </div>
      </section>
      <section class="categories">
        <h2>商品分类</h2>
        <div class="category-list">
          <div class="category-item" v-for="category in categories" :key="category.id" @click="handleCategoryClick(category)">
            {{ category.name }}
          </div>
        </div>
      </section>
      <section class="featured-products">
        <h2>推荐商品</h2>
        <div class="product-list">
          <div class="product-item" v-for="product in featuredProducts" :key="product.id" @click="handleProductClick(product)">
            <div class="product-image">
              <img :src="getImageUrl(product.images[0] || '')" :alt="product.name" @error="handleImageError">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>购物指南</h3>
          <ul>
            <li><a href="#">购物流程</a></li>
            <li><a href="#">会员介绍</a></li>
            <li><a href="#">生活旅行</a></li>
            <li><a href="#">常见问题</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>配送方式</h3>
          <ul>
            <li><a href="#">上门自提</a></li>
            <li><a href="#">211限时达</a></li>
            <li><a href="#">配送服务查询</a></li>
            <li><a href="#">海外配送</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>支付方式</h3>
          <ul>
            <li><a href="#">货到付款</a></li>
            <li><a href="#">在线支付</a></li>
            <li><a href="#">分期付款</a></li>
            <li><a href="#">邮局汇款</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>售后服务</h3>
          <ul>
            <li><a href="#">售后政策</a></li>
            <li><a href="#">价格保护</a></li>
            <li><a href="#">退款说明</a></li>
            <li><a href="#">返修/退换货</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 仲恺602 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  .header {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
    
    h1 {
      color: $primary-color;
      font-size: 24px;
      margin-top: -5px; // 向上移动6px
    }
    
    .header-actions {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      gap: 10px;
      
      .auth-btn {
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &.login-btn {
          background-color: transparent;
          color: $primary-color;
          border: 1px solid $primary-color;
          
          &:hover {
            background-color: $primary-color;
            color: $white;
          }
        }
        
        &.register-btn {
          background-color: $primary-color;
          color: $white;
          border: 1px solid $primary-color;
          
          &:hover {
            background-color: color.adjust($primary-color, $lightness: -10%);
            border-color: color.adjust($primary-color, $lightness: -10%);
          }
        }
      }
    }
    .search-container {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
      
      .search-input {
        width: 60%;
        max-width: 400px;
        padding: 10px 15px;
        border: 2px solid $primary-color;
        border-radius: 20px;
        font-size: 16px;
        outline: none;
        
        &:focus {
          box-shadow: 0 0 5px rgba($primary-color, 0.3);
        }
      }
      
      .search-button {
        @include button-style;
        border-radius: 20px;
        padding: 10px 20px;
      }
    }
  }
  
  .main-content {
    flex: 1; // 占据剩余空间
    
    .banner {
      background-color: $gray-light;
      height: 270px; // 增加轮播图区域高度
      margin-bottom: 30px;
      border-radius: 8px;
      max-width: 80%; // 减小轮播图区域宽度
      margin-left: auto;
      margin-right: auto;
      overflow: hidden;
      position: relative;
    }
    
    .carousel-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .carousel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      
      &.active {
        opacity: 1;
      }
    }
    
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.3);
      color: white;
      border: none;
      font-size: 24px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    
    .prev-btn {
      left: 10px;
    }
    
    .next-btn {
      right: 10px;
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
        gap: 12px;  // 减小间距
        flex-wrap: wrap;
        
        .category-item {
          flex: none;  // 不拉伸项
          padding: 8px 16px;  // 使用内边距而不是固定高度
          background-color: $white;
          border: 1px solid $border-color;
          border-radius: 20px;  // 胶囊形状
          @include flex-center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-size: 14px;  // 字体大小
          cursor: pointer;
          
          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            background-color: #f5f5f5;  // 悬停背景色
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
        grid-template-columns: repeat(6, 1fr);
        gap: 20px; // 增加卡片间距
        padding: 0 15px; // 增加左右两侧的内边距
        
        .product-item {
          background-color: $white;
          border: 1px solid $border-color;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden; // 防止内容溢出
          transition: box-shadow 0.3s ease; // 添加过渡效果
          width: 200px; // 设置卡片固定宽度
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 220px; // 增加卡片最小高度以防止重叠
          
          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
          
          .product-image {
            width: 200px; // 设置固定宽度
            height: 200px; // 设置固定高度
            overflow: hidden;
            margin: 0 auto; // 居中显示
            flex-shrink: 0; // 防止图片区域被压缩
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover; // 确保图片填充整个容器
              transition: transform 0.3s ease;
              
            }
          }
          
          .product-info {
            padding: 8px;
            width: 100%; // 确保信息区域占满宽度
            height: 80px; // 设置固定高度
            box-sizing: border-box; // 包含padding在内的高度计算
            display: flex;
            flex-direction: column;
            justify-content: space-between; // 均匀分布内容
            
            .product-name {
              font-size: 14px; // 增大字体
              color: $text-primary;
              margin: 0 0 4px 0;
              font-weight: bold; // 加粗字体
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              flex-grow: 1; // 允许名称区域扩展
            }
            
            .product-price {
              font-size: 16px; // 增大字体
              color: $primary-color;
              margin: 0 0 4px 0;
              font-weight: bold;
              flex-shrink: 0; // 防止价格信息被压缩
            }
            
            .product-sales {
              font-size: 10px;
              color: $text-secondary;
              margin: 0;
              flex-shrink: 0; // 防止销售信息被压缩
            }
          }
        }
      }
    }
  }
.home-footer {
    background-color: #f5f5f5;
    padding: 30px 20px 20px;
    margin-top: 40px;
    border-top: 1px solid #ddd;
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      max-width: 1200px;
      margin: 0 auto;
      
      .footer-section {
        flex: 1;
        min-width: 200px;
        margin-bottom: 20px;
        
        h3 {
          font-size: 16px;
          margin-bottom: 15px;
          color: #333;
        }
        
        ul {
          list-style: none;
          padding: 0;
          
          li {
            margin-bottom: 8px;
            
            a {
              text-decoration: none;
              color: #666;
              font-size: 14px;
              
              &:hover {
                color: #ff5000;
              }
            }
          }
        }
      }
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      margin-top: 20px;
      
      p {
        color: #666;
        font-size: 14px;
        margin: 0;
      }
    }
  }
}

</style>