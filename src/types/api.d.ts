// API相关类型定义
// 此文件已拆分为多个独立文件：
// - common/index.ts: 通用类型定义
// - user/index.ts: 用户相关类型定义
// - product/index.ts: 商品相关类型定义

// 为了保持向后兼容性，这里重新导出所有类型

// 通用类型
export type { BaseResponse, PageResponse } from './common'

// 用户相关类型
export type { UserInfo, LoginParams, RegisterParams } from './user'

// 商品相关类型
export type { Product, Category, SearchParams, ProductListParams } from './product'