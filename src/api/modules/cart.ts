import request from '@/api/request'
import type { CartListResponse, AddToCartParams, UpdateCartQuantityParams, BatchUpdateCartQuantityParams } from '@/types/cart'

/**
 * 获取购物车列表
 * @returns 购物车商品列表
 */
export const getCartList = () => {
  return request<CartListResponse>({
    url: '/api/cart/list',
    method: 'GET'
  })
}

/**
 * 添加商品到购物车
 * @param params 添加购物车参数
 * @returns 添加结果
 */
export const addCartItem = (params: AddToCartParams) => {
  return request({
    url: '/api/cart/add',
    method: 'POST',
    data: params
  })
}

/**
 * 删除购物车商品
 * @param cartItemId 购物车商品ID
 * @returns 删除结果
 */
export const deleteCartItem = (cartItemId: number) => {
  return request({
    url: `/api/cart/${cartItemId}`,
    method: 'DELETE'
  })
}

/**
 * 更新购物车商品数量
 * @param params 更新数量参数
 * @returns 更新结果
 */
export const updateCartQuantity = (params: UpdateCartQuantityParams) => {
  return request({
    url: '/api/cart/update/quantity',
    method: 'PUT',
    data: params
  })
}

/**
 * 批量更新购物车商品数量
 * @param params 批量更新数量参数
 * @returns 更新结果
 */
export const batchUpdateCartQuantity = (params: BatchUpdateCartQuantityParams) => {
  return request({
    url: '/api/cart/update/quantity',
    method: 'PUT',
    data: params
  })
}