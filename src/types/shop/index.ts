// 店铺相关类型定义

// 店铺基本信息
export interface ShopInfo {
  shopId: number
  shopName: string
  shopDescription: string
  shopLogo: string
  shopBanner: string
  status: 'active' | 'inactive' | 'pending'
  createTime: string
  updateTime: string
}

// 更新店铺信息参数
export interface UpdateShopParams {
  shopName: string
  shopDescription: string
  shopLogo: string
  shopBanner: string
}

// 店铺统计信息
export interface ShopStatistics {
  shopId: number
  shopName: string
  productCount: number
  orderCount: number
  totalSales: number
  pendingOrderCount: number
  onSaleProductCount: number
  offSaleProductCount: number
}

// API响应类型
export interface ShopResponse<T> {
  code: number
  msg: string
  data: T
}