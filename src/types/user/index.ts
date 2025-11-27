// 用户相关类型定义

// 用户信息
export interface UserInfo {
  id: string
  username: string
  email: string
  avatar: string
}

// 用户地址信息
export interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
  tag?: '家' | '公司' | '学校' | '其他'
}

// 地址表单数据
export interface AddressFormData {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
  tag?: '家' | '公司' | '学校' | '其他'
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