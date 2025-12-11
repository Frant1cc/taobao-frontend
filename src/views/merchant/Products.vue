<template>
  <div class="merchant-products no-focus-all">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <h2>商品管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddProduct">
          <el-icon><Plus /></el-icon>
          发布商品
        </el-button>
        <el-button>
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称..."
          prefix-icon="Search"
          style="width: 300px"
        />
        <el-select v-model="filterStatus" placeholder="商品状态" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="在售" value="on_sale" />
          <el-option label="下架" value="off_sale" />
        </el-select>
        <el-select v-model="filterCategory" placeholder="商品分类" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="数码" :value="1" />
          <el-option label="生鲜" :value="2" />
          <el-option label="图书" :value="3" />
          <el-option label="衣服" :value="4" />
          <el-option label="零食" :value="5" />
          <el-option label="宠物" :value="6" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <!-- 商品列表 -->
    <el-card>
      <el-table :data="filteredProducts" style="width: 100%" v-loading="loading">
        <el-table-column label="商品信息" min-width="350">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                v-if="getMainImageUrl(row)"
                :src="getMainImageUrl(row)"
                :alt="row.productName"
                fit="cover"
                class="product-image"
              />
              <div class="product-details">
                <div class="product-name clickable" @click="handleView(row)">{{ row.productName }}</div>
                <div class="product-description">{{ row.description }}</div>
                <div class="product-meta">
                  <span class="product-category">{{ getCategoryNameById(row.categoryId) }}</span>
                  <span class="product-time">{{ formatTime(row.createTime) }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品ID" width="100" align="center">
          <template #default="{ row }">
            {{ row.productId }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'on_sale' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'on_sale' ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingProduct ? '编辑商品' : '发布商品'"
      width="900px"
      align-center
      style="margin-top: 5vh"
    >
      <el-form :model="productForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="productForm.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="productForm.categoryId" placeholder="请选择分类">
            <el-option label="数码" :value="1" />
            <el-option label="生鲜" :value="2" />
            <el-option label="图书" :value="3" />
            <el-option label="衣服" :value="4" />
            <el-option label="零食" :value="5" />
            <el-option label="宠物" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        <!-- 商品主图上传 -->
        <el-form-item label="商品主图">
          <el-upload
            ref="mainImageUpload"
            action="/api/oss/upload"
            list-type="picture-card"
            :headers="{ 'Content-Type': 'multipart/form-data' }"
            :data="{ folder: 'product_main' }"
            :on-success="handleMainImageSuccess"
            :on-remove="handleMainImageRemove"
            :on-error="handleImageError"
            multiple
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                建议尺寸：800x800像素，最多上传5张主图
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- 商品详情图上传 -->
        <el-form-item label="商品详情图">
          <el-upload
            ref="detailImageUpload"
            action="/api/oss/upload"
            list-type="picture-card"
            :headers="{ 'Content-Type': 'multipart/form-data' }"
            :data="{ folder: 'product_detail' }"
            :on-success="handleDetailImageSuccess"
            :on-remove="handleDetailImageRemove"
            :on-error="handleImageError"
            multiple
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                建议尺寸：宽度800像素，高度自适应，最多上传10张详情图
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- SKU管理区域 -->
        <el-form-item label="SKU管理">
          <div class="sku-management">
            <div class="sku-header">
              <span class="sku-title">商品规格和库存</span>
              <el-button type="primary" size="small" @click="handleAddSku">
                <el-icon><Plus /></el-icon>
                添加SKU
              </el-button>
            </div>
            
            <!-- SKU列表 -->
            <div class="sku-list" v-if="productForm.skus && productForm.skus.length > 0">
              <div v-for="(sku, index) in productForm.skus" :key="index" class="sku-item">
                <div class="sku-info">
                  <div class="sku-name">
                    <el-input
                      v-model="sku.skuName"
                      placeholder="规格名称（如：颜色:红色 尺寸:L）"
                      size="small"
                    />
                  </div>
                  <div class="sku-price">
                    <el-input-number
                      v-model="sku.price"
                      :min="0"
                      :precision="2"
                      placeholder="价格"
                      size="small"
                    />
                    <span style="margin-left: 4px; color: #666;">元</span>
                  </div>
                </div>
                <div class="sku-actions">
                  <el-button type="danger" size="small" @click="handleRemoveSku(index)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 无SKU提示 -->
            <div v-else class="no-sku">
              <el-empty description="暂无SKU，点击添加SKU按钮创建规格" :image-size="80" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>
            <el-button v-if="editingProduct" type="danger" @click="handleDelete(editingProduct as ProductListItem)">
              删除商品
            </el-button>
          </div>
          <div>
            <el-button @click="showAddDialog = false">取消</el-button>
            <el-button type="primary" @click="handleSaveProduct">
              保存
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Plus,
  Upload,
  Delete,
} from '@element-plus/icons-vue'
import { 
  addProduct, 
  getProductList, 
  updateProduct, 
  deleteProduct,
  addSku,
  updateSku,
  deleteSku
} from '@/api/modules/merchant-product'
import { uploadToOss, batchUploadToOss } from '@/api/modules/oss-upload'
import type { ProductListItem, AddProductParams, UpdateProductParams, ProductSku, AddSkuParams, UpdateSkuParams } from '@/types/product'

// 搜索和筛选
const searchKeyword = ref('')
const filterStatus = ref('')
const filterCategory = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 对话框控制
const showAddDialog = ref(false)
const editingProduct = ref<ProductListItem | null>(null)

// 商品表单
const productForm = ref<AddProductParams & { skus?: ProductSku[] }>({
  productName: '',
  description: '',
  categoryId: 1,
  mainImages: '',
  detailImages: '',
  status: 'on_sale',
  skus: []
})

// 主图URL列表
const mainImageUrls = ref<string[]>([])

// 详情图URL列表
const detailImageUrls = ref<string[]>([])

// 商品数据
const products = ref<ProductListItem[]>([])

// 上传组件引用
const mainImageUpload = ref()
const detailImageUpload = ref()

// 加载商品列表
const loadProducts = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      productName: searchKeyword.value || undefined,
      status: filterStatus.value || undefined,
      categoryId: filterCategory.value || undefined
    }
    
    // 移除空值参数
    Object.keys(params).forEach((key: string) => {
      if (params[key as keyof typeof params] === undefined || params[key as keyof typeof params] === '') {
        delete params[key as keyof typeof params]
      }
    })
    
    // 提取查询参数（排除pageNum和pageSize）
    const { pageNum: pNum, pageSize: pSize, ...queryParams } = params
    
    const response = await getProductList(pNum, pSize, queryParams)
    if (response.code === 200 && response.data) {
      const data = response.data
      // 修复：根据实际数据结构，data直接是数组，而不是data.list
      products.value = Array.isArray(data) ? data : []
      total.value = products.value.length
    } else {
      products.value = []
      total.value = 0
      ElMessage.warning('获取商品列表失败，请稍后重试')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    products.value = []
    total.value = 0
    ElMessage.error('获取商品列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 计算属性：商品列表（直接返回API返回的数据）
const filteredProducts = computed(() => {
  // 确保products是数组
  if (!Array.isArray(products.value)) {
    return []
  }
  
  return products.value
})

// 主图上传成功处理
const handleMainImageSuccess = (response: any, file: any, fileList: any[]) => {
  if (response.code === 200 && response.data) {
    const imageUrl = response.data.url
    if (imageUrl && !mainImageUrls.value.includes(imageUrl)) {
      mainImageUrls.value.push(imageUrl)
      ElMessage.success('主图上传成功')
    }
  } else {
    ElMessage.error('主图上传失败：' + (response.msg || '未知错误'))
  }
}

// 主图删除处理
const handleMainImageRemove = (file: any, fileList: any[]) => {
  const imageUrl = file.response?.data?.url || file.url
  if (imageUrl) {
    const index = mainImageUrls.value.indexOf(imageUrl)
    if (index > -1) {
      mainImageUrls.value.splice(index, 1)
    }
  }
}

// 详情图上传成功处理
const handleDetailImageSuccess = (response: any, file: any, fileList: any[]) => {
  if (response.code === 200 && response.data) {
    const imageUrl = response.data.url
    if (imageUrl && !detailImageUrls.value.includes(imageUrl)) {
      detailImageUrls.value.push(imageUrl)
      ElMessage.success('详情图上传成功')
    }
  } else {
    ElMessage.error('详情图上传失败：' + (response.msg || '未知错误'))
  }
}

// 详情图删除处理
const handleDetailImageRemove = (file: any, fileList: any[]) => {
  const imageUrl = file.response?.data?.url || file.url
  if (imageUrl) {
    const index = detailImageUrls.value.indexOf(imageUrl)
    if (index > -1) {
      detailImageUrls.value.splice(index, 1)
    }
  }
}

// 图片上传错误处理
const handleImageError = (error: any, file: any, fileList: any[]) => {
  console.error('图片上传失败:', error)
  ElMessage.error('图片上传失败，请重试')
}

// 方法
const handleAddProduct = () => {
  editingProduct.value = null
  productForm.value = {
    productName: '',
    description: '',
    categoryId: 1,
    mainImages: '',
    detailImages: '',
    status: 'on_sale'
  }
  // 清空URL列表
  mainImageUrls.value = []
  detailImageUrls.value = []
  // 清空上传组件
  if (mainImageUpload.value) {
    mainImageUpload.value.clearFiles()
  }
  if (detailImageUpload.value) {
    detailImageUpload.value.clearFiles()
  }
  showAddDialog.value = true
}

const handleSearch = () => {
  currentPage.value = 1 // 搜索时重置到第一页
  loadProducts() // 重新加载数据
}

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterCategory.value = ''
  currentPage.value = 1
  loadProducts() // 重新加载数据
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleEdit = (product: ProductListItem) => {
  editingProduct.value = product
  
  // 解析SKU数据
  let skus: ProductSku[] = []
  if (product.skus && typeof product.skus === 'string') {
    try {
      skus = JSON.parse(product.skus)
    } catch (error) {
      console.warn('解析SKU数据失败:', error)
      skus = []
    }
  } else if (Array.isArray(product.skus)) {
    skus = product.skus
  }
  
  productForm.value = {
    productName: product.productName,
    description: product.description,
    categoryId: product.categoryId,
    mainImages: product.mainImages ? JSON.parse(product.mainImages) : [],
    detailImages: product.detailImages ? JSON.parse(product.detailImages) : [],
    status: product.status as 'on_sale' | 'off_sale',
    skus: skus
  }
  showAddDialog.value = true
}

// SKU管理方法
const handleAddSku = () => {
  if (!productForm.value.skus) {
    productForm.value.skus = []
  }
  
  // 生成临时ID，从1开始递减（负数表示临时SKU）
  const tempSkuId = - (productForm.value.skus.filter(sku => sku.skuId <= 0).length + 1)
  
  productForm.value.skus.push({
    skuId: tempSkuId, // 临时ID（负数）
    productId: editingProduct.value?.productId || 0,
    skuName: '',
    skuType: 'normal',
    price: 0,
    soldCount: 0,
    skuImage: '',
    status: 'on_sale',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  })
}

const handleRemoveSku = (index: number) => {
  if (productForm.value.skus) {
    const sku = productForm.value.skus[index]
    
    // 如果是已存在的SKU（有真实ID，ID > 0），需要确认删除
    if (sku && sku.skuId > 0) {
      ElMessageBox.confirm(
        `确定要删除SKU "${sku.skuName}" 吗？此操作不可恢复。`,
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        productForm.value.skus?.splice(index, 1)
        ElMessage.success('SKU删除成功')
      }).catch(() => {
        // 用户取消删除
      })
    } else {
      // 如果是新添加的SKU（临时ID，ID <= 0），直接删除
      productForm.value.skus?.splice(index, 1)
      ElMessage.success('SKU删除成功')
    }
  }
}

const handleToggleStatus = async (product: ProductListItem) => {
  try {
    const newStatus = product.status === 'on_sale' ? 'off_sale' : 'on_sale'
    const updateParams: UpdateProductParams = {
      productId: product.productId,
      productName: product.productName,
      description: product.description,
      categoryId: product.categoryId,
      mainImages: product.mainImages ? JSON.parse(product.mainImages) : [],
      detailImages: product.detailImages ? JSON.parse(product.detailImages) : [],
      status: newStatus
    }
    
    const response = await updateProduct(updateParams.productId, updateParams)
    if (response.code === 200) {
      ElMessage.success('商品状态更新成功')
      await loadProducts()
    } else {
      ElMessage.error(response.msg || '更新失败')
    }
  } catch (error) {
    ElMessage.error('更新商品状态失败')
    console.error('更新商品状态失败:', error)
  }
}

const handleView = (product: ProductListItem) => {
  console.log('查看商品:', product)
}

const handleDelete = async (product: ProductListItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${product.productName}"吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const response = await deleteProduct(product.productId)
    if (response.code === 200) {
      ElMessage.success('商品删除成功')
      await loadProducts()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const handleSaveProduct = async () => {
  try {
    // 表单验证
    if (!productForm.value.productName.trim()) {
      ElMessage.error('请输入商品名称')
      return
    }
    
    if (!productForm.value.description.trim()) {
      ElMessage.error('请输入商品描述')
      return
    }
    
    if (productForm.value.skus && productForm.value.skus.length > 0) {
      for (const sku of productForm.value.skus) {
        if (!sku.skuName.trim()) {
          ElMessage.error('请输入SKU名称')
          return
        }
        if (!sku.price || sku.price <= 0) {
          ElMessage.error('请输入有效的SKU价格')
          return
        }
      }
    }
    
    if (editingProduct.value) {
      // 更新商品
      const updateParams: UpdateProductParams = {
        productId: editingProduct.value.productId,
        productName: productForm.value.productName,
        description: productForm.value.description,
        categoryId: productForm.value.categoryId,
        mainImages: mainImageUrls.value.length > 0 ? mainImageUrls.value.join(',') : '',
        detailImages: detailImageUrls.value.length > 0 ? detailImageUrls.value.join(',') : '',
        status: productForm.value.status
      }
      
      const response = await updateProduct(updateParams.productId, updateParams)
      if (response.code === 200) {
        // 处理SKU更新
        await handleSkuOperations(editingProduct.value.productId)
        ElMessage.success('商品更新成功')
      } else {
        ElMessage.error(response.msg || '更新失败')
        return
      }
    } else {
      // 添加商品 - 使用URL字符串而不是文件上传
      const addParams: AddProductParams = {
        productName: productForm.value.productName,
        description: productForm.value.description,
        categoryId: productForm.value.categoryId,
        mainImages: mainImageUrls.value.length > 0 ? mainImageUrls.value.join(',') : '',
        detailImages: detailImageUrls.value.length > 0 ? detailImageUrls.value.join(',') : '',
        status: productForm.value.status
      }
      
      // 先添加商品
      const response = await addProduct(addParams)
      
      if (response.code === 200) {
        // 获取新创建的商品ID
        const newProductId = response.data
        
        // 如果有SKU数据，单独添加SKU
        if (productForm.value.skus && productForm.value.skus.length > 0 && newProductId) {
          try {
            for (const sku of productForm.value.skus) {
              const skuData = {
                productId: parseInt(newProductId),
                skuName: sku.skuName,
                skuType: sku.skuType || '',
                price: sku.price,
                soldCount: sku.soldCount || 0,
                skuImage: sku.skuImage || '',
                status: 'on_sale' as const
              }
              await addSku(skuData)
            }
          } catch (error) {
            console.error('添加SKU失败:', error)
            ElMessage.warning('商品添加成功，但SKU添加失败')
          }
        }
        
        ElMessage.success('商品添加成功')
      } else {
        ElMessage.error(response.msg || '添加失败')
        return
      }
    }
    
    showAddDialog.value = false
    productForm.value = {
    productName: '',
    description: '',
    categoryId: 1,
    mainImages: '',
    detailImages: '',
    status: 'on_sale',
    skus: []
  }
    editingProduct.value = null
    await loadProducts()
  } catch (error) {
    ElMessage.error('保存商品失败')
    console.error('保存商品失败:', error)
  }
}

// SKU操作处理
const handleSkuOperations = async (productId: number) => {
  if (!productForm.value.skus || productForm.value.skus.length === 0) return
  
  for (const sku of productForm.value.skus) {
    // 确保sku对象有默认值
    const safeSku = {
      skuId: sku.skuId || 0,
      skuName: sku.skuName || '',
      skuType: sku.skuType || '',
      price: sku.price || 0,
      skuImage: sku.skuImage || '',
      status: (sku.status || 'on_sale') as "on_sale" | "off_sale",
      productId: productId
    }
    
    if (safeSku.skuId > 0) {
      // 更新已存在的SKU（真实ID）
      const updateParams: UpdateSkuParams = {
        skuId: safeSku.skuId,
        skuName: safeSku.skuName,
        skuType: safeSku.skuType,
        price: safeSku.price,
        skuImage: safeSku.skuImage,
        status: safeSku.status
      }
      await updateSku(safeSku.skuId, updateParams)
    } else {
      // 添加新的SKU（临时ID）
      const addParams: AddSkuParams = {
        productId: productId,
        skuName: safeSku.skuName,
        skuType: safeSku.skuType,
        price: safeSku.price,
        skuImage: safeSku.skuImage,
        status: safeSku.status
      }
      await addSku(addParams)
    }
  }
}

const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'on_sale': 'success',
    'off_sale': 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'on_sale': '在售',
    'off_sale': '下架'
  }
  return statusMap[status] || '未知'
}

const getCategoryNameById = (categoryId: number) => {
  const categoryMap: { [key: number]: string } = {
    1: '数码',
    2: '生鲜',
    3: '图书',
    4: '衣服',
    5: '零食',
    6: '宠物'
  }
  return categoryMap[categoryId] || '其他'
}

const getMainImageUrl = (product: ProductListItem) => {
  if (!product.mainImages) return null
  try {
    const images = JSON.parse(product.mainImages)
    if (images.length === 0) return null
    
    const imagePath = images[0]
    // 如果图片路径已经是完整URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    // 处理路径格式，避免双斜杠问题
    const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || ''
    if (!baseUrl) return imagePath
    
    // 确保baseUrl以斜杠结尾，imagePath不以斜杠开头
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const cleanImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    
    return `${cleanBaseUrl}/${cleanImagePath}`
  } catch {
    return null
  }
}

const formatTime = (timeStr: string) => {
  try {
    const date = new Date(timeStr)
    return date.toLocaleDateString('zh-CN')
  } catch {
    return timeStr
  }
}

// 页面加载时获取商品列表
onMounted(() => {
  loadProducts()
})
</script>

<style scoped lang="scss">
@use "sass:color";

// 使用客户端相同的颜色主题
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;

.merchant-products {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      color: $text-primary;
      font-size: 24px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .filter-card {
    margin-bottom: 16px;

    .filter-row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
  }

  .product-info {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    .product-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .product-details {
      flex: 1;
      min-width: 0;

      .product-name {
        font-weight: 600;
        margin-bottom: 4px;
        color: $text-primary;
        font-size: 14px;
        line-height: 1.4;
        
        &.clickable {
          cursor: pointer;
          transition: color 0.2s;
          
          &:hover {
            color: $primary-color;
            text-decoration: underline;
          }
        }
      }

      .product-description {
        font-size: 12px;
        color: $text-secondary;
        margin-bottom: 6px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-meta {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: #999;

        .product-category {
          background: #f0f2f5;
          padding: 2px 6px;
          border-radius: 3px;
        }

        .product-time {
          font-style: italic;
        }
      }
    }
  }

  .price-null {
    color: #999;
    font-style: italic;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 16px 0;
    border-top: 1px solid $border-color;
  }

  .el-table {
    .el-table__header-wrapper th {
      background-color: #f5f7fa;
      font-weight: 600;
    }

    .el-table__body tr:hover > td {
      background-color: #f5f7fa;
    }
  }

  // SKU管理样式
  .sku-management {
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    padding: 20px;
    background-color: #fafafa;

    .sku-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .sku-title {
        font-weight: 600;
        color: #303133;
        font-size: 16px;
      }
    }

    .sku-list {
      .sku-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        margin-bottom: 12px;
        background-color: white;
        border: 1px solid #e4e7ed;
        border-radius: 6px;

        &:last-child {
          margin-bottom: 0;
        }

        .sku-info {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;

          .sku-name {
            width: 280px;
          }

          .sku-price,
          .sku-stock {
            width: 150px;
            display: flex;
            align-items: center;
          }
        }

        .sku-actions {
          flex-shrink: 0;
        }
      }
    }

    .no-sku {
      text-align: center;
      padding: 30px;
      color: #909399;
    }
  }
}
</style>

<style lang="scss">
// 专门针对商品管理页面的焦点样式覆盖
.merchant-products.no-focus-all {
  // 移除所有交互元素的焦点边框
  *:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  
  // 按钮相关
  .el-button {
    &:focus,
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  
  // 下拉菜单相关
  .el-dropdown {
    .el-button:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  
  .el-dropdown-menu {
    .el-dropdown-menu__item {
      &:focus {
        outline: none !important;
        background-color: #f5f7fa !important;
      }
      
      &:hover {
        background-color: #f5f7fa !important;
      }
    }
  }
  
  // 表单相关
  .el-input,
  .el-select,
  .el-textarea {
    .el-input__wrapper {
      &:focus-within {
        outline: none !important;
        box-shadow: none !important;
        border-color: #DCDFE6 !important;
      }
      
      &.is-focus {
        box-shadow: none !important;
        border-color: #ff5000 !important;
      }
    }
  }
  
  // 表格相关
  .el-table {
    .el-button {
      &:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    }
  }
}
</style>