// 订单相关类型定义

/**
 * 后端订单项类型 - 用于与后端API通信
 * 包含创建订单所需的核心商品信息
 */
export interface OrderItem {
  productId: number
  skuId: number
  quantity: number
  price: number
}

/**
 * 创建订单的请求参数类型
 * 用于向后端发送创建订单的请求
 */
export interface CreateOrderRequest {
  consignee: string
  phone: string
  address: string
  orderItems: OrderItem[]
}

/**
 * 创建订单响应类型
 * 后端创建订单接口的响应格式
 */
export interface CreateOrderResponse {
  code: number
  msg: string
  data: number // 实际返回的是订单ID
}

/**
 * 更新订单状态的请求参数类型
 */
export interface UpdateOrderStatusRequest {
  orderId: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
}

/**
 * 更新订单状态响应类型
 */
export interface UpdateOrderStatusResponse {
  code: number
  msg: string
  data: null
}