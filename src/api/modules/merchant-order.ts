// 商家订单管理相关API接口
import request from '@/api/request'
import type { 
  OrderListParams, 
  OrderDetail
} from '@/types/order'
import type { ShopResponse } from '@/types/shop'

/**
 * 商家获取订单列表
 * @param params 查询参数
 * @returns 订单列表
 */
export const getOrderList = (
  params: OrderListParams
): Promise<ShopResponse<any>> => {
  return request({
    url: '/api/shop/order/list',
    method: 'GET',
    params
  })
}

/**
 * 商家获取订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export const getOrderDetail = (orderId: number): Promise<ShopResponse<OrderDetail>> => {
  return request({
    url: `/api/shop/order/${orderId}`,
    method: 'GET'
  })
}

/**
 * 修改订单状态（通用接口）
 * @param orderId 订单ID
 * @param status 订单状态
 * @returns 修改结果
 */
export const updateOrderStatus = (
  orderId: number, 
  status: string
): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/order/status/${orderId}?status=${status}`,
    method: 'PUT'
  })
}