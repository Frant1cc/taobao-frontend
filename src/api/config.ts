// API 配置文件

/**
 * API基础配置
 */
export interface ApiConfig {
  /** API基础URL */
  baseURL: string
  /** 请求超时时间(毫秒) */
  timeout: number
  /** 默认请求头 */
  headers?: Record<string, string>
}

/** API配置 */
export const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

/** API基础URL */
export const BASE_URL = apiConfig.baseURL

/** 图片资源基础URL */
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || ''

/** 请求超时时间 */
export const TIMEOUT = apiConfig.timeout

/** 默认请求头 */
export const HEADERS = apiConfig.headers

export default {
  BASE_URL,
  IMAGE_BASE_URL,
  TIMEOUT,
  HEADERS
}