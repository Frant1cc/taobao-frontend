// 商品相关API接口
import request from '@/api/request'
import type { ProductListParams, SearchParams } from '@/types/product'

/**
 * ### 获取首页商品列表
 * 接口地址：`/product/home/list`
 * **请求方法**：GET
 * **请求头**：`Content-Type: application/json`
 * 
 * **请求参数**：
 * 
 * - `categoryId`: 1（可选，分类ID：1-数码, 2-生鲜, 3-图书, 4-衣服, 5-零食, 6-宠物）
 * 
 * - `productName`: iPhone（可选，商品名称，用于模糊查询）
 * 
 * - `limit`: 18（可选，返回数量，默认18）
 * 
 * **预期响应**：
 */
//获取首页商品列表，分类和搜索都用同一个接口
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

