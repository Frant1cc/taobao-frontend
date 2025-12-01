
// 通用类型
export type { BaseResponse, PageResponse } from './common'

// 用户相关类型
export type { LoginParams, RegisterParams } from './user'
// UserInfo类型已移动到使用它的文件中，不再从这里导出

// 商品相关类型
export type { Product, Category, SearchParams, ProductListParams } from './product'