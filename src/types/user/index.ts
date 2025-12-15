// 用户相关类型定义

// 用户登录参数
export interface LoginParams {
  account: string
  password: string
}

// 用户注册参数
export interface RegisterParams {
  account: string
  password: string
  userType: 'operator' | 'merchant' | 'customer' | 'visitor';
}

// 更新用户信息参数（不包含头像）
export interface UpdateUserInfoParams {
  username?: string
  gender?: string
  birthday?: string
  phone?: string
  email?: string
  password?: string
  description?: string
  avatarUrl?: string
}

// 登录响应数据
export interface LoginResponse {
  account: string
  username: string
  userType: string
  token: string
  avatarUrl?: string
}

// 用户详细信息
export interface UserInfo {
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
  avatarUrl: string | null
  createTime: string
  updateTime: string
  pendingOrderCount?: number
  paidOrderCount?: number
  shippedOrderCount?: number
  completedOrderCount?: number
  cancelledOrderCount?: number
}


