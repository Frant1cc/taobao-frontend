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

// 商家订单列表响应数据（后端直接返回数组）
export interface MerchantOrderListResponse extends Array<OrderListItem> {}

// 订单列表项
export interface OrderListItem {
  id?: string // 添加id字段，用于列表渲染key
  orderId: number
  orderNo: string
  userId: number
  totalAmount: number
  status: string
  shippingAddress: string
  createTime: string
  updateTime: string
  // 新增字段
  consigneeName?: string
  phone?: string
  paymentTime?: string | null
  paid: boolean
  // 用于前端展示的字段
  productCount?: number
  address?: string
  // 商品信息
  products?: Array<{
    id: string
    name: string
    image: string
    spec: string
    quantity: number
    price: number
  }>
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

// 创建订单请求参数
export interface CreateOrderRequest {
  userId: number
  products: Array<{
    productId: number
    quantity: number
    price: number
    specId?: number
  }>
  shippingAddress: string
  remark?: string
}

// 创建订单响应数据
export interface CreateOrderResponse {
  orderId: number
  orderNo: string
  totalAmount: number
  status: string
}

// 更新订单状态请求参数
export interface UpdateOrderStatusRequest {
  orderId: number
  status: string
}

// 更新订单状态响应数据
export interface UpdateOrderStatusResponse {
  success: boolean
  message: string
}

// 获取订单列表请求参数
export interface GetOrderListRequest {
  pageNum: number
  pageSize: number
  status?: string
  orderStatus?: string
  keyword?: string
}

// 获取订单列表响应数据
export interface GetOrderListResponse {
  total: number
  list: OrderListItem[]
  pageNum: number
  pageSize: number
}