// 购物车相关类型定义

// 购物车商品项
export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  checked: boolean;
  spec?: string;
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