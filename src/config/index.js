// 应用配置文件
export const config = {
  // API配置
  api: {
    // 设置为 false 使用远程API，设置为 true 使用本地数据
    useLocalData: false,
    baseURL: 'http://localhost:8001',
    timeout: 30000
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
    mobileDebug: true
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