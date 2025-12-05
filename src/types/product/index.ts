// 商品相关类型定义

// home页面商品列表参数
export interface ProductListParams {
  categoryId?: 1 | 2 | 3 | 4 | 5 | 6 //1-数码，2-生鲜，3-图书，4-衣服，5-零食，6-宠物
  limit?: number //默认18条
}

// 商品SKU信息
export interface ProductSku {
  skuId: number
  productId: number
  skuName: string
  skuType: string
  price: number
  stock: number
  soldCount: number
  skuImage: string
  status: string
  createTime: string
  updateTime: string
}

// 商品信息
export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  categoryId: string
  categoryName: string
  // 新增字段以匹配后端返回的数据格式
  productId?: number
  productName?: string
  mainImages?: string
  detailImages?: string
  status?: string
  createTime?: string
  updateTime?: string
  skus?: ProductSku[]
}

// 商品分类
export interface Category {
  id: string
  name: string
  parentId?: string
}

// 搜索商品参数
export interface SearchParams {
  keyword: string
}

