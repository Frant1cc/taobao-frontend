// 商品相关类型定义

// home页面商品列表参数
export interface ProductListParams {
  /**
   * 分类ID
   * 1-数码, 2-生鲜, 3-图书, 4-衣服, 5-零食, 6-宠物
   */
  categoryId?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * 商品名称，用于模糊查询
   */
  productName?: string
  /**
   * 返回数量，默认18条
   */
  limit?: number
}

// 商品SKU信息
export interface ProductSku {
  skuId: number
  productId: number
  skuName: string
  skuType: string
  price: number
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

// 商家端商品管理相关类型定义

// 添加商品请求参数（支持文件上传）
export interface AddProductWithImagesParams {
  productName: string
  description: string
  categoryId: number
  status: 'on_sale' | 'off_sale'
  mainImageFiles?: File[]
  detailImageFiles?: File[]
}

// 添加商品请求参数
export interface AddProductParams {
  productName: string
  description: string
  categoryId: number
  mainImages: string
  detailImages: string
  status: 'on_sale' | 'off_sale'
}

// 更新商品请求参数
export interface UpdateProductParams {
  productId: number
  productName: string
  description: string
  categoryId: number
  mainImages: string
  detailImages: string
  status: 'on_sale' | 'off_sale'
}

// 商品列表响应数据
export interface ProductListResponse {
  total: number
  list: ProductListItem[]
}

// 商品列表项
export interface ProductListItem {
  productId: number
  productName: string
  description: string
  categoryId: number
  status: string
  createTime: string
  updateTime: string
  merchantId?: number
  shopId?: number
  price?: number | null
  mainImages?: string
  detailImages?: string
  skus?: any
}

// 添加SKU请求参数
export interface AddSkuParams {
  productId: number
  skuName: string
  skuType: string
  price: number
  skuImage: string
  status: 'on_sale' | 'off_sale'
}

// 更新SKU请求参数
export interface UpdateSkuParams {
  skuId: number
  skuName: string
  skuType: string
  price: number
  skuImage: string
  status: 'on_sale' | 'off_sale'
}

