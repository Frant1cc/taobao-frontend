// 通用类型定义

// 基础响应格式
export interface BaseResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应格式
export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}