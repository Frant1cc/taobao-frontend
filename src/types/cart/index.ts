// 购物车相关类型定义

// SKU信息
export interface Sku {
  skuId: number
  productId: number
  skuName: string
  skuType: string
  price: number
  stock: number
  soldCount: number
  skuImage: string
  status: string
  createTime: string
  updateTime: string
}

// 购物车商品项
export interface CartItem {
  cartItemId: number
  userId: number
  skuId: number
  quantity: number
  checked: boolean
  createTime: string
  updateTime: string
  sku: Sku
}

// 购物车状态
export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  allChecked: boolean;
}

// 购物车操作参数
export interface CartOperationParams {
  itemId: string;
  quantity?: number;
}

// 添加购物车参数
export interface AddToCartParams {
  skuId: number;
  quantity: number;
}

// 单个商品数量更新参数
export interface UpdateCartQuantityParams {
  cartItemId: number;
  quantity: number;
}

// 批量更新购物车商品数量参数
export interface BatchUpdateCartQuantityParams {
  items: UpdateCartQuantityParams[];
}

// 购物车列表响应
export type CartListResponse = CartItem[]