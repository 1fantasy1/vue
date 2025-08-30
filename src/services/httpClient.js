// HTTP客户端配置
import axios from 'axios'
import { config } from '@/config/index.js'
import { STORAGE_KEYS } from '@/utils/storageKeys.js'

// API基础配置
const API_BASE_URL = config.api.baseURL
const API_TIMEOUT = config.api.timeout

// 仅在开发或显式开启时输出API配置信息
const __DEV__ = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) || config?.dev?.showApiLogs
if (config?.dev?.showApiLogs && __DEV__) {
  console.log('API配置信息:', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    isDev: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV,
    envViteApiBaseUrl: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
  })
}

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
    // 统一读取 token，兼容历史键名
    let token = localStorage.getItem(STORAGE_KEYS.token)
    if (!token) {
      token = localStorage.getItem(STORAGE_KEYS.legacyToken)
      if (token) {
        // 迁移到新键名
        try {
          localStorage.setItem(STORAGE_KEYS.token, token)
          localStorage.removeItem(STORAGE_KEYS.legacyToken)
        } catch {}
      }
    }
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
    
    if (config?.dev?.showApiLogs || __DEV__) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    if (__DEV__) console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
httpClient.interceptors.response.use(
  (response) => {
    if (config?.dev?.showApiLogs || __DEV__) {
      console.log(`API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (__DEV__) console.error('API请求错误:', error)
    
    // 处理常见错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除token与用户信息（含历史键名）
          localStorage.removeItem(STORAGE_KEYS.token)
          localStorage.removeItem(STORAGE_KEYS.user)
          localStorage.removeItem(STORAGE_KEYS.legacyToken)
          localStorage.removeItem(STORAGE_KEYS.legacyUser)
          // 这里可以触发路由跳转到登录页
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('资源不存在')
          break
        case 422:
          if (__DEV__) console.error('请求参数验证失败:', data.detail)
          break
        case 500:
      if (__DEV__) console.error('服务器内部错误')
          break
        default:
      if (__DEV__) console.error(`HTTP错误 ${status}:`, data.detail || data.message || '未知错误')
      }
    } else if (error.request) {
    if (__DEV__) console.error('网络错误，请检查网络连接')
    } else {
    if (__DEV__) console.error('请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default httpClient
export { API_BASE_URL }
