// 用户相关API接口
import request from '@/api/request'
import type { LoginParams, RegisterParams } from '@/types/user/index'

// 用户登录
export function login(data: LoginParams) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data: RegisterParams) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

