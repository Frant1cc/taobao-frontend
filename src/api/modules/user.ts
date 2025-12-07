// 用户相关API接口
import request from '@/api/request'
import type { LoginParams, RegisterParams, UpdateUserInfoParams } from '@/types/user/index'

// 用户登录
export function login(data: LoginParams) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data: RegisterParams) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/profile',
    method: 'get'
  })
}

// 更新用户个人详情（不包含头像）
export function updateUserInfo(data: UpdateUserInfoParams) {
  return request({
    url: '/api/user/profile/update',
    method: 'put',
    data
  })
}

// 上传用户头像
export function uploadUserAvatar(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return request({
    url: '/api/user/profile/avatar/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}



