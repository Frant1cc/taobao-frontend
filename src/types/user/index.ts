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

// 登录响应数据
export interface LoginResponse {
  userId: number
  account: string
  username: string
  token: string
}

