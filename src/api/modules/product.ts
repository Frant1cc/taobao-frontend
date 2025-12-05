// 商品相关API接口
import request from '@/api/request'
import type { ProductListParams, SearchParams } from '@/types/product'

// 获取home页面商品列表
export function getProductList(params?: ProductListParams) {
  return request({
    url: '/api/product/home/list',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getProductDetail(id: number) {
  return request({
    url: `/api/product/detail/${id}`,
    method: 'get'
  })
}

// 搜索商品
export function searchProducts(params: SearchParams) {
  return request({
    url: '/api/products/search',
    method: 'get',
    params
  })
}

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/api/categories',
    method: 'get'
  })
}