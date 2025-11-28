// 用户认证表
export interface UserAuth {
  user_id: number;
  account: string;
  password: string;
  user_type: 'operator' | 'merchant' | 'customer' | 'visitor';
  create_time: string;
  update_time: string;
  status: 'active' | 'inactive' | 'locked';
}

// 用户详情表
export interface UserProfile {
  profile_id: number;
  user_id: number;
  username?: string;
  gender: 'male' | 'female' | 'unknown';
  birthday?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  create_time: string;
  update_time: string;
}

// 地址表
export interface Address {
  address_id: number;
  user_id: number;
  full_address: string;
  recipient_name: string;
  phone: string;
  is_default: boolean;
  create_time: string;
  update_time: string;
}

export interface AddressFormData {
  full_address: string;
  recipient_name: string;
  phone: string;
  is_default: boolean;
}

// 商品相关类型定义

// 商品表
export interface Product {
  product_id: number;
  product_name: string;
  description?: string;
  main_images: string[];
  detail_images: string[];
  category_id?: number;
  merchant_id: number;
  status: 'on_sale' | 'off_sale';
  create_time: string;
  update_time: string;
}

// 商品SKU表
export interface ProductSku {
  sku_id: number;
  product_id: number;
  sku_name?: string;
  sku_type?: string;
  price: number;
  stock: number;
  sold_count: number;
  sku_image?: string;
  status: 'on_sale' | 'off_sale';
  create_time: string;
  update_time: string;
}

// 购物车表
export interface CartItem {
  cart_item_id: number;
  user_id: number;
  sku_id: number;
  quantity: number;
  create_time: string;
  update_time: string;
}

// 订单相关类型定义
export interface Order {
  order_id: number;
  order_no: string;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  shipping_address: string;
  payment_time?: string;
  create_time: string;
  update_time: string;
}

export interface OrderItem {
  item_id: number;
  order_id: number;
  sku_id: number;
  product_name: string;
  sku_type?: string;
  price: number;
  quantity: number;
  total_price: number;
  create_time: string;
}

// 用户信息（兼容旧版本）
export interface UserInfo {
  user_id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'unknown';
  birthday?: string;
  create_time: string;
  update_time: string;
}

// 登录参数
export interface LoginParams {
  account: string;
  password: string;
}

// 注册参数
export interface RegisterParams {
  account: string;
  password: string;
  username: string;
  email?: string;
  phone?: string;
}