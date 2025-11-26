// 封装axios请求
import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // API基础路径
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加token
    // if (localStorage.getItem('token')) {
    //   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    // }
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
    
    // 根据实际业务需求处理响应数据
    // 例如：统一处理错误码
    if (res.code !== 200) {
      console.error('响应错误:', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error: AxiosError) => {
    // 对响应错误做些什么
    console.error('响应错误:', error)
    return Promise.reject(error)
  }
)

export default service