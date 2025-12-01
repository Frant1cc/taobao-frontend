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
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

/** API基础URL */
export const BASE_URL = apiConfig.baseURL

/** 请求超时时间 */
export const TIMEOUT = apiConfig.timeout

/** 默认请求头 */
export const HEADERS = apiConfig.headers

export default {
  BASE_URL,
  TIMEOUT,
  HEADERS
}