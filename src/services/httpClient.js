// HTTP客户端配置
import axios from 'axios'
import { config } from '@/config/index.js'

// API基础配置
const API_BASE_URL = config.api.baseURL
const API_TIMEOUT = config.api.timeout

// 在生产环境中输出API配置信息
console.log('API配置信息:', {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  isDev: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV,
  envViteApiBaseUrl: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
})

// 创建axios实例
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: false // 跨域请求不发送cookies
})

// 请求拦截器
httpClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token（如果有的话）
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 如果数据是FormData，删除默认的Content-Type让axios自动设置（包含大小写与方法级别）
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type']
        delete config.headers['content-type']
      }
      // 兼容 axios 可能合并的方法级别头
      if (config.headers && typeof config.headers === 'object') {
        const method = (config.method || '').toLowerCase()
        if (method && config.headers[method]) {
          delete config.headers[method]['Content-Type']
          delete config.headers[method]['content-type']
        }
      }
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
httpClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API请求错误:', error)
    
    // 处理常见错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('access_token')
          localStorage.removeItem('currentUser')
          // 这里可以触发路由跳转到登录页
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('资源不存在')
          break
        case 422:
          console.error('请求参数验证失败:', data.detail)
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(`HTTP错误 ${status}:`, data.detail || data.message || '未知错误')
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接')
    } else {
      console.error('请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default httpClient
export { API_BASE_URL }
