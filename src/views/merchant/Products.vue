<template>
  <div class="merchant-products no-focus-all">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <h2>商品管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
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
          placeholder="搜索商品名称、SKU..."
          prefix-icon="Search"
          style="width: 300px"
        />
        <el-select v-model="filterStatus" placeholder="商品状态" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="在售" value="onSale" />
          <el-option label="下架" value="offSale" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-select v-model="filterCategory" placeholder="商品分类" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="电子产品" value="electronics" />
          <el-option label="服装" value="clothing" />
          <el-option label="家居" value="home" />
          <el-option label="美妆" value="beauty" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <!-- 商品列表 -->
    <el-card>
      <el-table :data="filteredProducts" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                :src="row.image"
                :alt="row.name"
                fit="cover"
                class="product-image"
              />
              <div class="product-details">
                <div class="product-name clickable" @click="handleView(row)">{{ row.name }}</div>
                <div class="product-sku">SKU: {{ row.sku }}</div>
                <div class="product-category">{{ getCategoryName(row.category) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 'onSale' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'onSale' ? '下架' : '上架' }}
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
        />
      </div>
    </el-card>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingProduct ? '编辑商品' : '发布商品'"
      width="800px"
      align-center
      style="margin-top: 5vh"
    >
      <el-form :model="productForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="productForm.category" placeholder="请选择分类">
            <el-option label="电子产品" value="electronics" />
            <el-option label="服装" value="clothing" />
            <el-option label="家居" value="home" />
            <el-option label="美妆" value="beauty" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="productForm.price" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="productForm.stock" :min="0" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>
            <el-button v-if="editingProduct" type="danger" @click="handleDelete(editingProduct)">
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
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Plus,
  Upload,
  Search
} from '@element-plus/icons-vue'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  sales: number
  status: string
  image: string
  description: string
}

// 搜索和筛选
const searchKeyword = ref('')
const filterStatus = ref('')
const filterCategory = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const showAddDialog = ref(false)
const editingProduct = ref<Product | null>(null)

// 商品表单
const productForm = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: ''
})

// 模拟商品数据
const products = ref<Product[]>([
  {
    id: '1',
    name: '新款智能手机',
    sku: 'SM001',
    category: 'electronics',
    price: 2999,
    stock: 100,
    sales: 45,
    status: 'onSale',
    image: 'https://via.placeholder.com/80x80',
    description: '高性能智能手机'
  },
  {
    id: '2',
    name: '无线蓝牙耳机',
    sku: 'BE002',
    category: 'electronics',
    price: 399,
    stock: 200,
    sales: 89,
    status: 'onSale',
    image: 'https://via.placeholder.com/80x80',
    description: '高品质无线耳机'
  },
  {
    id: '3',
    name: '时尚连衣裙',
    sku: 'CL003',
    category: 'clothing',
    price: 199,
    stock: 50,
    sales: 23,
    status: 'offSale',
    image: 'https://via.placeholder.com/80x80',
    description: '时尚女装连衣裙'
  },
  {
    id: '4',
    name: '智能手表',
    sku: 'SW004',
    category: 'electronics',
    price: 1299,
    stock: 30,
    sales: 12,
    status: 'draft',
    image: 'https://via.placeholder.com/80x80',
    description: '多功能智能手表'
  }
])

// 计算属性：过滤商品
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchKeyword.value) {
    filtered = filtered.filter(product => 
      product.name.includes(searchKeyword.value) || 
      product.sku.includes(searchKeyword.value)
    )
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(product => product.status === filterStatus.value)
  }
  
  if (filterCategory.value) {
    filtered = filtered.filter(product => product.category === filterCategory.value)
  }
  
  total.value = filtered.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterCategory.value = ''
  currentPage.value = 1
}

const handleEdit = (product: Product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showAddDialog.value = true
}

const handleToggleStatus = (product: Product) => {
  product.status = product.status === 'onSale' ? 'offSale' : 'onSale'
}

const handleView = (product: Product) => {
  // 查看商品详情逻辑
  console.log('查看商品:', product)
}

const handleDelete = (product: Product) => {
  ElMessageBox.confirm(
    `确定要删除商品"${product.name}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 删除商品逻辑
    const index = products.value.findIndex(p => p.id === product.id)
    if (index !== -1) {
      products.value.splice(index, 1)
      ElMessage.success('商品删除成功')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const handleSaveProduct = () => {
  // 保存商品逻辑
  showAddDialog.value = false
  productForm.value = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: ''
  }
  editingProduct.value = null
}

const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'onSale': 'success',
    'offSale': 'warning',
    'draft': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'onSale': '在售',
    'offSale': '下架',
    'draft': '草稿'
  }
  return statusMap[status] || '未知'
}

const getCategoryName = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'electronics': '电子产品',
    'clothing': '服装',
    'home': '家居',
    'beauty': '美妆'
  }
  return categoryMap[category] || '其他'
}
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
    }
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .product-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      object-fit: cover;
    }

    .product-details {
    .product-name {
      font-weight: 500;
      margin-bottom: 4px;
      color: $text-primary;
      
      &.clickable {
        cursor: pointer;
        transition: color 0.2s;
        
        &:hover {
          color: $primary-color;
          text-decoration: underline;
        }
      }
    }

      .product-sku {
        font-size: 12px;
        color: $text-secondary;
        margin-bottom: 2px;
      }

      .product-category {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 16px 0;
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