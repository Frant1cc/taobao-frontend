// 商家商品管理相关API接口
import request from '@/api/request'
import type { 
  AddProductParams, 
  UpdateProductParams, 
  ProductListResponse,
  AddSkuParams,
  UpdateSkuParams
} from '@/types/product'
import type { ShopResponse } from '@/types/shop'

/**
 * 商家添加商品
 * @param params 商品信息
 * @returns 添加结果
 */
export const addProduct = (params: AddProductParams): Promise<ShopResponse<string>> => {
  return request({
    url: '/api/shop/product/add',
    method: 'POST',
    data: params
  })
}

/**
 * 商家获取商品列表
 * @param pageNum 页码
 * @param pageSize 每页数量
 * @param queryParams 查询参数
 * @returns 商品列表
 */
export const getProductList = (
  pageNum: number = 1, 
  pageSize: number = 10,
  queryParams?: {
    productName?: string
    status?: string
    categoryId?: number | string
  }
): Promise<ShopResponse<ProductListResponse>> => {
  const params = {
    pageNum,
    pageSize,
    ...queryParams
  }
  
  return request({
    url: '/api/shop/product/list',
    method: 'GET',
    params
  })
}

/**
 * 商家更新商品
 * @param productId 商品ID
 * @param params 商品更新信息
 * @returns 更新结果
 */
export const updateProduct = (
  productId: number, 
  params: UpdateProductParams
): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/update/${productId}`,
    method: 'PUT',
    data: params
  })
}

/**
 * 商家删除商品
 * @param productId 商品ID
 * @returns 删除结果
 */
export const deleteProduct = (productId: number): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/${productId}`,
    method: 'DELETE'
  })
}

/**
 * 商家添加SKU
 * @param params SKU信息
 * @returns 添加结果
 */
export const addSku = (params: AddSkuParams): Promise<ShopResponse<string>> => {
  return request({
    url: '/api/shop/product/sku/add',
    method: 'POST',
    data: params
  })
}

/**
 * 商家更新SKU
 * @param skuId SKU ID
 * @param params SKU更新信息
 * @returns 更新结果
 */
export const updateSku = (
  skuId: number, 
  params: UpdateSkuParams
): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/sku/update/${skuId}`,
    method: 'PUT',
    data: params
  })
}

/**
 * 商家删除SKU
 * @param skuId SKU ID
 * @returns 删除结果
 */
export const deleteSku = (skuId: number): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/sku/${skuId}`,
    method: 'DELETE'
  })
}