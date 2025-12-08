// 订单相关类型定义

// 商家端订单管理相关类型定义

// 获取订单列表请求参数
export interface OrderListParams {
  pageNum: number
  pageSize: number
  status?: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
}

// 订单列表响应数据
export interface OrderListResponse {
  total: number
  list: OrderListItem[]
}

// 订单列表项
export interface OrderListItem {
  orderId: number
  orderNo: string
  userId: number
  totalAmount: number
  status: string
  shippingAddress: string
  createTime: string
  updateTime: string
}

// 订单详情
export interface OrderDetail {
  orderId: number
  orderNo: string
  userId: number
  totalAmount: number
  status: string
  shippingAddress: string
  createTime: string
  updateTime: string
}

// 发货请求参数
export interface ShipOrderParams {
  logisticsCompany: string
  logisticsNo: string
}

// 分页响应通用接口
export interface PaginationResponse<T> {
  code: number
  msg: string
  data: {
    total: number
    list: T[]
  }
}