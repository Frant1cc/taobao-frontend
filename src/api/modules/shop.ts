// 商家店铺相关API接口
import request from '@/api/request'
import type { ShopInfo, UpdateShopParams, ShopResponse } from '@/types/shop/index'

// 获取店铺信息
export function getShopInfo(): Promise<ShopResponse<ShopInfo>> {
  return request({
    url: '/api/shop/my',
    method: 'get'
  })
}

// 更新店铺信息
export function updateShopInfo(data: UpdateShopParams): Promise<ShopResponse<string>> {
  return request({
    url: '/api/shop/update',
    method: 'put',
    data
  })
}

// 上传店铺Logo
export function uploadShopLogo(data: FormData): Promise<ShopResponse<string>> {
  return request({
    url: '/api/shop/logo/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}