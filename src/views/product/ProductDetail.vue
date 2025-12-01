<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types/product'

// 路由信息
const route = useRoute()
const productId = computed(() => route.params.id as string)

// 商品数据
const product = ref<Product>({
  id: '',
  name: '',
  price: 0,
  description: '',
  images: [],
  categoryId: '',
  categoryName: ''
})

// 轮播图当前索引
const currentImageIndex = ref(0)

// 商品数量
const quantity = ref(1)

// 已选规格
const selectedSpecs = ref<Record<string, string>>({})

// 规格选项 - 修改为使用英文键名
const specsOptions = [
  { name: 'color', label: '颜色', options: ['红色', '蓝色', '黑色', '白色'] },
  { name: 'size', label: '尺寸', options: ['XS', 'S', 'M', 'L', 'XL'] }
]

// 选择规格
const selectSpec = (specName: string, option: string) => {
  selectedSpecs.value[specName] = option
}

// 加入购物车
const addToCart = () => {
  // 检查是否选择了所有规格
  const allSpecsSelected = specsOptions.every(spec => 
    selectedSpecs.value[spec.name] !== undefined && selectedSpecs.value[spec.name] !== ''
  )
  
  if (!allSpecsSelected) {
    alert('请选择完整的商品规格')
    return
  }
  
  alert(`已成功加入购物车：${product.value.name} x ${quantity.value}`)
}

// 立即购买
const buyNow = () => {
  // 检查是否选择了所有规格
  const allSpecsSelected = specsOptions.every(spec => 
    selectedSpecs.value[spec.name] !== undefined && selectedSpecs.value[spec.name] !== ''
  )
  
  if (!allSpecsSelected) {
alert('请选择完整的商品规格')
    return
  }
  
  alert(`准备购买：${product.value.name} x ${quantity.value}`)
}

// 轮播图切换
const handleImageChange = (index: number) => {
  currentImageIndex.value = index
}

// 数量变更
const handleQuantityChange = (type: 'increase' | 'decrease') => {
  if (type === 'increase') {
    quantity.value++
  } else if (type === 'decrease' && quantity.value > 1) {
    quantity.value--
  }
}

// 获取商品数据
const fetchProductData = async () => {
  try {
    // 由于是模拟环境，使用模拟数据
    product.value = {
      id: productId.value,
      name: 'Apple iPhone 15 Pro Max 256GB 原色钛金属 移动联通电信5G双卡双待手机',
      price: 9999,
      description: 'iPhone 15 Pro Max 采用航空级钛金属设计，配备 A17 Pro 芯片，搭载 4800 万像素主摄系统，支持 USB-C 充电，带来前所未有的强大性能和拍摄体验。',
      images: [
        'https://img.alicdn.com/imgextra/i4/O1CN01Qf1Z7C1hQmJ0Kj7Iq_!!6000000004368-0-picassoopen.jpg',
        'https://img.alicdn.com/imgextra/i2/O1CN01Bw9mUu1hQmJ4qZJ14_!!6000000004372-0-picassoopen.jpg',
        'https://img.alicdn.com/imgextra/i1/O1CN01G47N5g1hQmJ460xNf_!!6000000004371-0-picassoopen.jpg',
        'https://img.alicdn.com/imgextra/i3/O1CN01L8VJcM1hQmKzK3W8P_!!6000000004370-0-picassoopen.jpg'
      ],
      categoryId: 'electronics',
      categoryName: '手机数码'
    }
    
    // 初始化默认规格
    specsOptions.forEach(spec => {
      if (spec.options.length > 0) {
        selectedSpecs.value[spec.name] = spec.options[0] || ''
      }
    })
  } catch (error) {
    console.error('获取商品详情失败:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  fetchProductData()
})
</script>

<template>
  <div class="product-detail-page">
    <!-- 商品图片轮播 -->
    <section class="product-gallery">
      <div class="main-image-wrapper">
        <img 
          v-for="(image, index) in product.images" 
          :key="index"
          :src="image" 
          :alt="`${product.name} - 图片${index + 1}`"
          class="main-image" 
          :class="{ active: index === currentImageIndex }"
        />
      </div>
      
      <!-- 缩略图列表 -->
      <div class="thumbnail-list">
        <div 
          v-for="(image, index) in product.images" 
          :key="index"
          class="thumbnail-item" 
          :class="{ active: index === currentImageIndex }"
          @click="handleImageChange(index)"
        >
          <img :src="image" :alt="`缩略图${index + 1}`" />
        </div>
      </div>
    </section>

    <!-- 商品信息 -->
    <section class="product-info">
      <!-- 商品标题 -->
      <h1 class="product-title">{{ product.name }}</h1>
      
      <!-- 价格区域 -->
      <div class="price-section">
        <div class="price-main">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ product.price }}</span>
        </div>
        <div class="price-extra">
          <span class="price-tag">促销价</span>
        </div>
      </div>
      
      <!-- 销量信息 -->
      <div class="sales-info">
        <span>月销 {{ Math.floor(Math.random() * 1000) + 100 }} 件</span>
      </div>
      
      <!-- 规格选择 -->
      <div class="specs-section">
        <div 
          v-for="spec in specsOptions" 
          :key="spec.name" 
          class="spec-group"
        >
          <span class="spec-name">{{ spec.label }}:</span>
          <div class="spec-options">
            <button 
              v-for="option in spec.options" 
              :key="option"
              class="spec-option"
              :class="{ active: selectedSpecs[spec.name] === option }"
              @click="selectSpec(spec.name, option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 数量选择 -->
      <div class="quantity-section">
        <span class="quantity-label">数量:</span>
        <div class="quantity-control">
          <button class="quantity-btn" @click="handleQuantityChange('decrease')" :disabled="quantity <= 1">-
          </button>
          <span class="quantity-value">{{ quantity }}</span>
          <button class="quantity-btn" @click="handleQuantityChange('increase')">+
          </button>
        </div>
      </div>
      
      <!-- 优惠信息 -->
      <div class="promotion-section">
        <div class="promotion-item">
          <span class="promotion-tag">优惠券</span>
          <span class="promotion-desc">满1000减50，满2000减100</span>
        </div>
      </div>
    </section>

    <!-- 操作按钮 -->
    <section class="action-buttons">
      <button class="add-to-cart-btn" @click="addToCart">加入购物车</button>
      <button class="buy-now-btn" @click="buyNow">立即购买</button>
    </section>

    <!-- 商品详情 -->
    <section class="product-detail-section">
      <div class="detail-content">
        <h3 class="detail-section-title">商品详情</h3>
        <p class="product-description">{{ product.description }}</p>
        
        <!-- 详情图片 -->
        <div class="detail-images">
          <img 
            v-for="(image, index) in product.images" 
            :key="`detail-${index}`"
            :src="image" 
            :alt="`详情图片${index + 1}`" 
            class="detail-image"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">

// 淘宝商品详情页样式
.product-detail-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
  padding-bottom: 80px; // 为底部操作栏留出空间
  
  // 商品图片轮播
  .product-gallery {
    background-color: #ffffff;
    padding: 20px;
    margin-bottom: 10px;
    
    .main-image-wrapper {
      position: relative;
      height: 400px;
      overflow: hidden;
      margin-bottom: 15px;
      
      .main-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        &.active {
          opacity: 1;
        }
      }
    }
    
    .thumbnail-list {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 10px;
      
      .thumbnail-item {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        transition: border-color 0.3s;
        
        &.active {
          border-color: #ff5021;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  
  // 商品信息
  .product-info {
    background-color: #ffffff;
    padding: 20px;
    margin-bottom: 10px;
    
    .product-title {
      font-size: 20px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 15px;
      line-height: 1.4;
    }
    
    .price-section {
      display: flex;
      align-items: baseline;
      margin-bottom: 15px;
      .price-main {
        display: flex;
        align-items: baseline;
        
        .price-symbol {
          font-size: 16px;
          color: #ff5021;
          margin-right: 2px;
        }
        
        .price-value {
          font-size: 30px;
          font-weight: bold;
          color: #ff5021;
        }
      }
      
      .price-extra {
        margin-left: 10px;
        
        .price-tag {
          background-color: #ff5021;
          color: #ffffff;
          padding: 2px 6px;
          font-size: 12px;
          border-radius: 4px;
        }
      }
    }
    
    .sales-info {
      color: #666666;
      font-size: 14px;
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    }
    
    .specs-section {
      margin-bottom: 20px;
      
      .spec-group {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        
        .spec-name {
          width: 80px;
          color: #666666;
          font-size: 14px;
        }
        
        .spec-options {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          
          .spec-option {
            padding: 8px 16px;
            border: 1px solid #e0e0e0;
            background-color: #ffffff;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            
            &:hover {
              border-color: #ff5021;
            }
            
            &.active {
              border-color: #ff5021;
              color: #ff5021;
              background-color: rgba(255, 80, 33, 0.05);
            }
          }
        }
      }
    }
    
    .quantity-section {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      
      .quantity-label {
        width: 80px;
        color: #666666;
        font-size: 14px;
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
        
        .quantity-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #e0e0e0;
          background-color: #ffffff;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          
          &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          
          &:disabled {
            color: #999999;
            cursor: not-allowed;
          }
        }
        
        .quantity-value {
          width: 50px;
          height: 32px;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
      }
    }
    
    .promotion-section {
      
      .promotion-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .promotion-tag {
          background-color: rgba(255, 80, 33, 0.1);
          color: #ff5021;
          padding: 2px 8px;
          font-size: 12px;
          border-radius: 4px;
          margin-right: 10px;
        }
        
        .promotion-desc {
          color: #666666;
          font-size: 14px;
        }
      }
    }
  }
  
  // 操作按钮
  .action-buttons {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #ffffff;
      display: flex;
      gap: 10px;
      padding: 10px 20px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      z-index: 100;
      
      button {
        flex: 1;
        height: 100%;
        border: none;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.3s;
        
        &:hover {
          opacity: 0.9;
        }
      }
      
      .add-to-cart-btn {
        background-color: #ffed4a;
        color: #333333;
      }
      
      .buy-now-btn {
        background-color: #ff5021;
        color: #ffffff;
      }
    }
  
  // 商品详情区域
  .product-detail-section {
    background-color: #ffffff;
    margin-top: 80px; // 为固定的操作按钮留出空间
    padding: 0;
    
    .detail-content {
      padding: 20px;
      
      .detail-section-title {
        font-size: 20px;
        color: #333333;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #ff5021;
        font-weight: 600;
      }
      
      .product-description {
        color: #666666;
        line-height: 1.6;
        margin-bottom: 25px;
        font-size: 15px;
      }
      
      .detail-images {
        margin-bottom: 30px;
        
        .detail-image {
          width: 100%;
          margin-bottom: 10px;
          border-radius: 8px;
        }
      }
        

        
        .reviews-section {
          
          .review-item {
            padding: 20px 0;
            border-bottom: 1px solid #e0e0e0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .review-header {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
              
              .user-name {
                font-weight: 500;
                color: #333333;
                margin-right: 15px;
              }
              
              .rating {
                display: flex;
                margin-right: auto;
                
                .star {
                  width: 16px;
                  height: 16px;
                  margin-right: 2px;
                  background-color: #cccccc;
                  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                  
                  &.filled {
                    background-color: #ffed4a;
                  }
                }
              }
              
              .review-date {
                color: #999999;
                font-size: 12px;
              }
            }
            
            .review-content {
              color: #666666;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
  
  // 推荐商品
  .recommended-products {
    background-color: #ffffff;
    margin-top: 10px;
    padding: 20px;
    
    h3 {
      font-size: 18px;
      color: #333333;
      margin-bottom: 20px;
    }
    
    .recommended-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      
      .recommended-item {
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .rec-product-image {
          height: 150px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        
        .rec-product-info {
          padding: 10px;
          
          .rec-product-title {
            font-size: 14px;
            color: #333333;
            margin-bottom: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .rec-product-price {
            font-size: 16px;
            color: #ff5021;
            font-weight: 500;
          }
        }
      }
    }
  }
</style>