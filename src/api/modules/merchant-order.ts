// 商家订单管理相关API接口
import request from '@/api/request'
import type { 
  OrderListParams, 
  OrderListResponse,
  OrderDetail,
  ShipOrderParams
} from '@/types/order'
import type { ShopResponse } from '@/types/shop'

/**
 * 商家获取订单列表
 * @param params 查询参数
 * @returns 订单列表
 */
export const getOrderList = (
  params: OrderListParams
): Promise<ShopResponse<OrderListResponse>> => {
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
 * 商家发货
 * @param orderId 订单ID
 * @param params 发货信息
 * @returns 发货结果
 */
export const shipOrder = (
  orderId: number, 
  params: ShipOrderParams
): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/order/ship/${orderId}`,
    method: 'PUT',
    data: params
  })
}