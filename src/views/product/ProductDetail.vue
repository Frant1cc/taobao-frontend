<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/modules/product'
import type { Product, ProductSku } from '@/types/product'

// 路由信息
const route = useRoute()
const router = useRouter()
const productId = computed(() => route.params.id as string)

// 图片基础URL
const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || ''

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 计算当前选中的SKU
const selectedSku = computed(() => {
  if (!product.value.skus || product.value.skus.length === 0) return null
  
  // 查找完全匹配的SKU
  const matchedSku = product.value.skus.find(sku => {
    return Object.keys(selectedSpecs.value).every(key => {
      // 对于尺寸规格，检查skuName是否匹配
      if (key === 'size') {
        return sku.skuName === selectedSpecs.value[key]
      }
      return true
    })
  })
  
  return matchedSku || null
})

// 计算完整的图片URL列表（只包含当前选中SKU的图片）
const fullImages = computed(() => {
  // 如果没有选中的SKU，返回空数组
  if (!selectedSku.value || !selectedSku.value.skuImage) {
    return []
  }
  
  // 只获取当前选中SKU的图片
  const skuImage = selectedSku.value.skuImage
  
  // 拼接完整URL
  const fullUrl = skuImage.startsWith('http') ? skuImage : imageBaseUrl + skuImage
  
  // 返回包含单张图片的数组，以保持与原代码的一致性
  return [fullUrl]
})

// 获取所有SKU的图片用于缩略图展示
const allSkuImages = computed(() => {
  if (!product.value.skus || product.value.skus.length === 0) return []
  
  // 收集所有SKU的图片，去重
  const images = product.value.skus
    .filter(sku => sku.skuImage)
    .map(sku => {
      const fullUrl = sku.skuImage.startsWith('http') ? sku.skuImage : imageBaseUrl + sku.skuImage
      return { url: fullUrl, sku }
    })
    
  // 去重逻辑：基于URL去重
  const uniqueImages = []
  const seenUrls = new Set()
  
  for (const image of images) {
    if (!seenUrls.has(image.url)) {
      seenUrls.add(image.url)
      uniqueImages.push(image)
    }
  }
  
  return uniqueImages
})

// 商品数据
const product = ref<Product>({
  id: '',
  name: '',
  price: 0,
  description: '',
  images: [],
  mainImages: '[]',
  detailImages: '[]',
  categoryId: '',
  categoryName: '',
  skus: []
})

// 轮播图当前索引
const currentImageIndex = ref(0)

// 商品数量
const quantity = ref(1)

// 已选规格
const selectedSpecs = ref<Record<string, string>>({})

// 规格选项 - 初始为空数组，通过API获取数据后动态填充
const specsOptions: Array<{ name: string; label: string; options: string[] }> = []

// 选择规格
const selectSpec = (specName: string, option: string) => {
  selectedSpecs.value[specName] = option
  // 重置图片轮播索引为0，确保显示新SKU的第一张图片
  currentImageIndex.value = 0
}

// 加入购物车
const addToCart = () => {
  // 检查是否有商品数据
  if (!product.value.id) {
    alert('商品信息加载失败，请稍后重试~')
    return
  }
  
  // 检查是否选择了所有规格
  const allSpecsSelected = specsOptions.every(spec => 
    selectedSpecs.value[spec.name] !== undefined && selectedSpecs.value[spec.name] !== ''
  )
  
  if (!allSpecsSelected) {
    alert('请选择完整的商品规格')
    return
  }
  
  // 检查是否有选中的SKU
  if (!selectedSku.value) {
    alert('请选择有效的商品规格')
    return
  }
  
  alert(`已成功加入购物车：${product.value.name} x ${quantity.value}，SKU: ${selectedSku.value.skuName}，价格: ¥${selectedSku.value.price.toFixed(2)}，库存: ${selectedSku.value.stock}`)
}

// 立即购买
const buyNow = () => {
  // 检查是否有商品数据
  if (!product.value.id) {
    alert('商品信息加载失败，请稍后重试~')
    return
  }
  
  // 检查是否选择了所有规格
  const allSpecsSelected = specsOptions.every(spec => 
    selectedSpecs.value[spec.name] !== undefined && selectedSpecs.value[spec.name] !== ''
  )
  
  if (!allSpecsSelected) {
    alert('请选择完整的商品规格')
    return
  }
  
  // 检查是否有选中的SKU
  if (!selectedSku.value) {
    alert('请选择有效的商品规格')
    return
  }
  
  alert(`准备购买：${product.value.name} x ${quantity.value}，SKU: ${selectedSku.value.skuName}，价格: ¥${selectedSku.value.price.toFixed(2)}，库存: ${selectedSku.value.stock}`)
}

// 轮播图切换
const handleImageChange = (index: number) => {
  currentImageIndex.value = index
}

// 通过图片选择SKU
const selectSkuByImage = (sku: ProductSku) => {
  // 根据SKU的规格名称设置选中的规格
  // 解析SKU名称，例如："颜色:红色 尺寸:L"
  const skuParts = sku.skuName.split(' ')
  
  // 清除当前选择
  selectedSpecs.value = {}
  
  // 设置新的选择
  skuParts.forEach(part => {
    const [specName, specValue] = part.split(':')
    if (specName && specValue) {
      // 特殊处理尺寸规格
      if (specName === '尺寸') {
        selectedSpecs.value['size'] = specValue
      } else {
        selectedSpecs.value[specName] = specValue
      }
    }
  })
  
  // 重置图片轮播索引为0，确保显示新SKU的第一张图片
  currentImageIndex.value = 0
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
    // 调用API获取商品详情
    const response = await getProductDetail(parseInt(productId.value))
    const productData = response.data
    
    // 设置商品数据（注意：这里不再合并详情图到images字段）
    product.value = {
      id: productId.value,
      name: productData.productName || productData.name || '',
      price: productData.skus && productData.skus.length > 0 ? productData.skus[0].price : 0,
      description: productData.description || '',
      images: [], // 这个字段现在不再使用，因为我们有专门的fullImages计算属性
      mainImages: productData.mainImages || '[]', // 保留原始的mainImages字符串
      detailImages: productData.detailImages || '[]', // 保留原始的detailImages字符串
      categoryId: productData.categoryId?.toString() || '',
      categoryName: '', // 需要根据categoryId获取分类名称
      skus: productData.skus || []
    }
    
    // 更新规格选项
    if (productData.skus && productData.skus.length > 0) {
      // 清空原有规格选项
      specsOptions.length = 0
      
      // 根据SKU数据生成新的规格选项
      specsOptions.push({
        name: 'size',
        label: '尺码',
        options: productData.skus.map((sku: ProductSku) => sku.skuName)
      })
      
      // 初始化默认规格
      selectedSpecs.value.size = productData.skus[0].skuName
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    // 如果API调用失败，不使用模拟数据，保持页面空白或显示错误信息
    product.value = {
      id: '',
      name: '',
      price: 0,
      description: '',
      images: [],
      mainImages: '[]',
      detailImages: '[]',
      categoryId: '',
      categoryName: '',
      skus: []
    }
  }
}

// 生命周期钩子
onMounted(() => {
  fetchProductData()
})
</script>

<template>
  <div class="product-detail-page">
    <!-- 返回首页按钮 -->
    <div class="back-to-home">
      <button @click="goToHome" class="back-button">
        ← 返回首页
      </button>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="!product.id" class="error-message">
      <p>商品信息加载失败，请稍后重试~</p>
    </div>
    
    <!-- 商品图片轮播 -->
    <section v-else class="product-gallery">
      <div class="main-image-wrapper">
        <img 
          v-for="(image, index) in fullImages" 
          :key="index"
          :src="image" 
          :alt="`${product.name} - 图片${index + 1}`"
          class="main-image" 
          :class="{ active: index === currentImageIndex }"
        />
        <!-- 无图片占位符 -->
        <div v-if="fullImages.length === 0" class="no-image-placeholder">
          暂无商品图片
        </div>
      </div>
      
      <!-- 缩略图列表 -->
      <div class="thumbnail-list">
        <div 
          v-for="(imageObj, index) in allSkuImages" 
          :key="index"
          class="thumbnail-item" 
          :class="{ active: selectedSku && selectedSku.skuName === imageObj.sku.skuName }"
          @click="selectSkuByImage(imageObj.sku)"
        >
          <img :src="imageObj.url" :alt="`缩略图${index + 1}`" />
        </div>
        <!-- 无缩略图占位符 -->
        <div v-if="allSkuImages.length === 0" class="no-thumbnail-placeholder">
          暂无缩略图
        </div>
      </div>
    </section>

    <!-- 商品信息 -->
    <section class="product-info">
      <!-- 商品标题 -->
      <h1 class="product-title">{{ product.name || '商品名称加载中...' }}</h1>
      
      <!-- 价格区域 -->
      <div class="price-section">
        <div class="price-main">
          <span class="price-symbol">¥</span>
          <span class="price-value" v-if="selectedSku && selectedSku.price > 0">{{ selectedSku.price.toFixed(2) }}</span>
          <span class="price-value" v-else-if="product.price > 0">{{ product.price.toFixed(2) }}</span>
          <span class="price-value" v-else>暂无价格</span>
        </div>
      </div>
      
      <!-- 销量信息 -->
      <div class="sales-info">
        <span v-if="selectedSku && selectedSku.stock !== undefined">库存 {{ selectedSku.stock }} 件</span>
        <span v-else-if="product?.skus?.length && product.skus[0]?.stock !== undefined">库存 {{ product.skus[0].stock }} 件</span>
        <span v-else>库存 0 件</span>
      </div>
      
      <!-- 规格选择 -->
      <div v-if="specsOptions.length > 0" class="specs-section">
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
        <p class="product-description">{{ product.description || '商品详情加载中...' }}</p>
        
        <!-- 详情图片 -->
        <div class="detail-images">
          <img 
            v-for="(image, index) in fullImages" 
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
  
  // 返回首页按钮
  .back-to-home {
    padding: 15px 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    
    .back-button {
      background-color: #f5f5f5;
      border: none;
      border-radius: 20px;
      padding: 8px 15px;
      font-size: 14px;
      color: #333333;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
  
  // 错误提示样式
  .error-message {
    text-align: center;
    padding: 50px 20px;
    background: #fff;
    margin: 10px;
    border-radius: 8px;
    
    p {
      font-size: 16px;
      color: #666;
    }
  }
  
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
      
      .no-image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
        color: #999;
        font-size: 16px;
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
      
      .no-thumbnail-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background-color: #f5f5f5;
        color: #999;
        font-size: 12px;
        border-radius: 4px;
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