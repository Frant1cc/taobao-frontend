// 商品相关类型定义

// 商品信息
export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  categoryId: string
  categoryName: string
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

// 商品列表查询参数
export interface ProductListParams {
  categoryId?: string
  page?: number
  pageSize?: number
}