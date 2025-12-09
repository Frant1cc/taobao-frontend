import request from '../request'
import type { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  UpdateOrderStatusRequest, 
  UpdateOrderStatusResponse,
  GetOrderListRequest,
  GetOrderListResponse
} from '@/types/order'

/**
 * 创建订单
 * @param data 订单数据
 * @returns Promise<CreateOrderResponse>
 */
export const createOrder = (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  return request({
    url: '/api/order/create',
    method: 'POST',
    data
  })
}

/**
 * 更新订单状态
 * @param params 包含orderId和status的对象
 * @returns Promise<UpdateOrderStatusResponse>
 */
export const updateOrderStatus = (params: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> => {
  return request({
    url: `/api/order/status/${params.orderId}`,
    method: 'PUT',
    params: {
      status: params.status
    }
  })
}

/**
 * 获取订单列表
 * @param params 包含分页和状态筛选参数的对象
 * @returns Promise<GetOrderListResponse>
 */
export const getOrderList = (params: GetOrderListRequest): Promise<GetOrderListResponse> => {
  return request({
    url: '/api/order/list',
    method: 'GET',
    params
  })
}