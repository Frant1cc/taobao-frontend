// 商品相关API接口
import request from '@/api/request'
import type { ProductListParams, SearchParams } from '@/types/product'
import type { BaseResponse, PageResponse } from '@/types/common'
import type { Category } from '@/types/product'
import type { Product } from '@/types/product'

// 获取商品列表
export function getProductList(params?: ProductListParams) {
  return request<BaseResponse<PageResponse<Product>>>({
    url: '/products',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getProductDetail(id: string) {
  return request<BaseResponse<Product>>({
    url: `/products/${id}`,
    method: 'get'
  })
}

// 搜索商品
export function searchProducts(params: SearchParams) {
  return request<BaseResponse<PageResponse<Product>>>({
    url: '/products/search',
    method: 'get',
    params
  })
}

// 获取分类列表
export function getCategoryList() {
  return request<BaseResponse<Category[]>>({
    url: '/categories',
    method: 'get'
  })
}