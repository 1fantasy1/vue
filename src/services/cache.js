// 数据缓存服务
import { config } from '@/config'

class CacheService {
  constructor() {
    this.cache = new Map()
    this.ttl = config.database.cache.ttl
    this.maxSize = config.database.cache.maxSize
    this.enabled = config.database.cache.enabled
  }

  // 生成缓存键
  generateKey(url, params = {}) {
    const paramString = JSON.stringify(params)
    return `${url}:${paramString}`
  }

  // 设置缓存
  set(key, data) {
    if (!this.enabled) return

    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.ttl
    })
  }

  // 获取缓存
  get(key) {
    if (!this.enabled) return null

    const cached = this.cache.get(key)
    if (!cached) return null

    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  // 删除缓存
  delete(key) {
    this.cache.delete(key)
  }

  // 清空缓存
  clear() {
    this.cache.clear()
  }

  // 清理过期缓存
  cleanup() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 创建全局缓存实例
export const cacheService = new CacheService()

// 定期清理过期缓存
setInterval(() => {
  cacheService.cleanup()
}, 60000) // 每分钟清理一次

// 带缓存的API请求装饰器
export function withCache(apiFunction) {
  return async function(...args) {
    const cacheKey = cacheService.generateKey(apiFunction.name, args)
    
    // 尝试从缓存获取
    const cachedData = cacheService.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // 缓存中没有，执行API请求
    try {
      const result = await apiFunction.apply(this, args)
      cacheService.set(cacheKey, result)
      return result
    } catch (error) {
      throw error
    }
  }
}
