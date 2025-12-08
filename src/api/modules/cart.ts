import request from '@/api/request'
import type { CartListResponse } from '@/types/cart'

/**
 * 获取购物车列表
 * @returns 购物车商品列表
 */
export const getCartList = () => {
  return request<{code: number, msg: string, data: CartListResponse}>({
    url: '/api/cart/list',
    method: 'GET'
  })
}