// 应用配置文件
export const config = {
  // API配置
  api: {
    // 除课程外，所有功能都使用远程API
    useLocalData: false,
    // 根据环境变量或开发/生产模式设置API地址
    baseURL: (() => {
      // 首先检查环境变量
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL
      }
      
      // 检查是否为开发模式
      const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
      
      // 开发环境使用代理，生产环境使用完整URL
      return isDev ? '/api' : 'https://cosbrain.675222.xyz/api'
    })(),
    timeout: 60000, // 默认超时60秒
    // AI相关请求的特殊超时配置
    aiTimeout: 120000 // AI聊天超时120秒
  },

  // 数据库/缓存配置
  database: {
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5分钟
      maxSize: 100
    }
  },

  // 应用基本信息
  app: {
    name: '鸿庆书云创新协作平台',
    version: '1.0.0',
    description: '为学生提供智能匹配、知识管理、课程学习和协作支持的综合平台'
  },

  // 功能开关
  features: {
    aiChat: true,
    knowledgeBase: true,
    projectRecommendation: true,
    studentMatching: true,
    forum: true,
    chatRooms: true,
  mobileDebug: true,
  // 是否启用课程完成统计（调用 /courses/{id}/completed-by-count）
  courseCompletionStats: false
  },

  // UI配置
  ui: {
    theme: 'light',
    primaryColor: '#1976d2',
    sidebarCollapsed: false
  },

  // 开发配置
  dev: {
    enableMobileDebug: true,
    showApiLogs: true
  }
}

export default config