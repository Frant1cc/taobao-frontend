// 封装axios请求
import axios, { type AxiosResponse, type AxiosError, type AxiosRequestConfig } from 'axios'
import { BASE_URL, TIMEOUT, HEADERS } from './config'

// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL, // API基础路径
  timeout: TIMEOUT, // 请求超时时间
  headers: HEADERS // 默认请求头
})

// 封装请求函数，支持泛型
function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做些什么
    const res = response.data
    
    // 打印完整的响应数据用于调试
    console.log('API响应数据:', response)
    
    // 根据实际业务需求处理响应数据
    // 例如：统一处理错误码
    // 首先检查res是否为对象类型，避免TypeError
    if (typeof res === 'object' && res !== null) {
      if (res.code !== 200) {
        console.error('响应错误:', res.msg)
        return Promise.reject(new Error(res.msg || 'Error'))
      } else {
        // 返回处理后的数据，确保类型正确
        return res as any
      }
    } else {
      // 如果res不是对象，直接返回原始数据
      console.warn('API响应数据不是对象类型:', typeof res)
      return res as any
    }
  },
  (error: AxiosError) => {
    // 对响应错误做些什么
    console.error('响应错误:', error)
    
    // 检查是否是未授权错误(401)，如果是则清除本地token并跳转到登录页
    if (error.response?.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
      
      // 如果当前不在登录页面，则跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default request