// 管理端相关类型定义

// 管理员登录参数
export interface AdminLoginParams {
  account: string
  password: string
}

// 管理员登录响应
export interface AdminLoginResponse {
  code: number
  msg: string
  data: {
    account: string
    username: string
    userType: string
    token: string
  }
}

// 管理员首页数据
export interface AdminDashboardData {
  newUserCount: number
  todayTransactionAmount: number
  newOrderCount: number
  completedOrderCount: number
}

// 用户列表请求参数
export interface UserListParams {
  pageNum?: number
  pageSize?: number
  account?: string
  userType?: string
  status?: string
}

// 用户信息
export interface AdminUserInfo {
  userId: number
  account: string
  password: string
  userType: string
  status: string
  username: string | null
  gender: string | null
  birthday: string | null
  phone: string | null
  email: string | null
  avatarUrl: string
  createTime: string
  updateTime: string
}

// 用户列表响应
export interface UserListResponse {
  total: number
  totalPage: number
  pageNum: number
  pageSize: number
  list: AdminUserInfo[]
}

// 商家信息
export interface MerchantInfo {
  shopId: number
  shopName: string
  shopDescription: string
  shopLogo: string
  shopBanner: string
  shopAddress: string
  shopPhone: string
  shopEmail: string
  shopStatus: string
  createTime: string
  updateTime: string
  userId: number
  account: string
}

// 商家列表响应
export interface MerchantListResponse {
  total: number
  totalPage: number
  pageNum: number
  pageSize: number
  list: MerchantInfo[]
}

// 商家审核参数
export interface MerchantAuditParams {
  shopId: number
  auditStatus: 'approved' | 'rejected'
  auditReason?: string
}

// 订单信息
export interface AdminOrderInfo {
  orderId: number
  orderNumber: string
  userId: number
  account: string
  username: string | null
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  shippingStatus: string
  createTime: string
  updateTime: string
  items: OrderItem[]
}

// 订单项
export interface OrderItem {
  itemId: number
  productId: number
  productName: string
  productImage: string
  quantity: number
  price: number
  totalPrice: number
}

// 根据接口文档新增的订单相关类型

// 订单项（根据接口文档）
export interface OrderItemDetail {
  itemId: number
  orderId: number
  skuId: number
  productName: string
  skuName: string
  skuType: string
  price: number
  quantity: number
  totalPrice: number
  createTime: string
  skuImage: string
}

// 订单详情（根据接口文档）
export interface AdminOrderDetail {
  orderId: number
  orderNo: string
  userId: number
  totalAmount: number
  status: string
  shippingAddress: string
  consigneeName: string | null
  phone: string | null
  paymentTime: string | null
  createTime: string
  updateTime: string
  orderItems: OrderItemDetail[]
}

// 订单列表项（根据接口文档）
export interface AdminOrderListItem {
  orderId: number
  orderNo: string
  userId: number
  totalAmount: number
  status: string
  shippingAddress: string
  consigneeName: string | null
  phone: string | null
  paymentTime: string | null
  createTime: string
  updateTime: string
  orderItems: OrderItemDetail[]
}

// 订单列表响应（根据接口文档）
export interface AdminOrderListResponse {
  code: number
  msg: string
  data: {
    total: number
    totalPage: number
    pageNum: number
    pageSize: number
    list: AdminOrderListItem[]
  }
}

// 订单详情响应
export interface AdminOrderDetailResponse {
  code: number
  msg: string
  data: AdminOrderDetail
}

// 订单列表响应
export interface OrderListResponse {
  total: number
  totalPage: number
  pageNum: number
  pageSize: number
  list: AdminOrderInfo[]
}

// 统计数据响应
export interface StatisticsResponse {
  totalUsers: number
  totalMerchants: number
  totalOrders: number
  totalRevenue: number
  todayUsers: number
  todayOrders: number
  todayRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
}

// 通用API响应格式（适应后端不可靠性）
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data?: T
}

// 分页参数
export interface PaginationParams {
  pageNum?: number
  pageSize?: number
}

// 通用列表响应
export interface ListResponse<T> {
  total: number
  totalPage: number
  pageNum: number
  pageSize: number
  list: T[]
}

// 状态更新参数
export interface StatusUpdateParams {
  id: number
  status: string
  reason?: string
}

// 搜索参数
export interface SearchParams {
  keyword?: string
  startTime?: string
  endTime?: string
  status?: string
  type?: string
}

// 文件上传响应
export interface FileUploadResponse {
  url: string
  fileName: string
  fileSize: number
  uploadTime: string
}

// 系统设置
export interface SystemSettings {
  siteName: string
  siteDescription: string
  siteLogo: string
  siteFavicon: string
  contactEmail: string
  contactPhone: string
  companyAddress: string
  copyrightInfo: string
  seoKeywords: string
  seoDescription: string
}

// 操作日志
export interface OperationLog {
  logId: number
  operatorId: number
  operatorName: string
  operationType: string
  operationTarget: string
  operationDetails: string
  operationTime: string
  ipAddress: string
  userAgent: string
}

// 操作日志列表响应
export interface OperationLogResponse {
  total: number
  totalPage: number
  pageNum: number
  pageSize: number
  list: OperationLog[]
}

// 订单取消请求参数
export interface OrderCancelParams {
  id: number
  status: string
}

// 订单取消响应
export interface OrderCancelResponse {
  code: number
  msg: string
  data: string
}