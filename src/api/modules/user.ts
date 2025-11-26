// 用户相关API接口
import request from '@/api/request'
import type { LoginParams, RegisterParams } from '@/types/user'
import type { UserInfo } from '@/types/user'
import type { BaseResponse } from '@/types/common'

// 用户登录
export function login(data: LoginParams) {
  return request<BaseResponse<UserInfo>>({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data: RegisterParams) {
  return request<BaseResponse<UserInfo>>({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request<BaseResponse<UserInfo>>({
    url: '/user/info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request<BaseResponse<null>>({
    url: '/user/logout',
    method: 'post'
  })
}