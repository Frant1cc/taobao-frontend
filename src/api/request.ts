// 封装axios请求
import axios, { type AxiosResponse, type AxiosError } from 'axios'
import { BASE_URL, TIMEOUT, HEADERS } from './config'

// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL, // API基础路径
  timeout: TIMEOUT, // 请求超时时间
  headers: HEADERS // 默认请求头
})

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
    if (res.code !== 200) {
      console.error('响应错误:', res.msg)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
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
      
      // 如果当前不在登录页面，则跳转到登录页面
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default service