// 用户相关类型定义

// 用户信息
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar: string
}

// 用户登录参数
export interface LoginParams {
  username: string
  password: string
}

// 用户注册参数
export interface RegisterParams {
  username: string
  password: string
  email: string
}