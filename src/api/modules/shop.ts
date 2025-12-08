// 商家店铺相关API接口
import request from '@/api/request'
import type { ShopInfo, UpdateShopParams, ShopStatistics, ShopResponse } from '@/types/shop/index'

// 获取店铺信息
export function getShopInfo(): Promise<ShopResponse<ShopInfo>> {
  return request({
    url: '/shop/my',
    method: 'get'
  })
}

// 更新店铺信息
export function updateShopInfo(data: UpdateShopParams): Promise<ShopResponse<string>> {
  return request({
    url: '/shop/update',
    method: 'put',
    data
  })
}

// 获取店铺统计信息
export function getShopStatistics(): Promise<ShopResponse<ShopStatistics>> {
  return request({
    url: '/shop/statistics/my',
    method: 'get'
  })
}