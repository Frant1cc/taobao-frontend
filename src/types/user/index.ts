// 用户相关类型定义（与数据库表结构保持一致）

// 用户认证信息（user_auth表）
export interface UserAuth {
  user_id: number
  account: string
  password_hash: string
  account_type: 'email' | 'phone' | 'username'
  status: 'active' | 'inactive' | 'banned'
  create_time: string
  update_time: string
}

// 用户档案信息（user_profile表）
export interface UserProfile {
  profile_id: number
  user_id: number
  username: string
  gender: 'male' | 'female' | 'unknown'
  birthday?: string
  phone?: string
  email?: string
  avatar_url?: string
  create_time: string
  update_time: string
}

// 用户地址信息（user_address表）
export interface Address {
  address_id: number
  user_id: number
  full_address: string
  recipient_name: string
  phone: string
  is_default: boolean
  create_time: string
  update_time: string
}

// 地址表单数据
export interface AddressFormData {
  full_address: string
  recipient_name: string
  phone: string
  is_default: boolean
}

// 兼容性类型定义（保持与现有代码的兼容性）

// 用户信息（兼容旧版本）
export interface UserInfo {
  user_id: number
  username: string
  email?: string
  phone?: string
  avatar?: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  create_time: string
  update_time: string
}

// 用户登录参数
export interface LoginParams {
  account: string
  password: string
}

// 用户注册参数
export interface RegisterParams {
  account: string
  password: string
  username: string
  email?: string
  phone?: string
}