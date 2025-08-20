// 应用配置文件
export const config = {
  // API配置
  api: {
    // 除课程外，所有功能都使用远程API
    useLocalData: false,
    // 优先读取 Vite 环境变量（构建时注入）
    // 开发环境可设为 '/api' 走 Vite 代理；生产环境设为完整线上地址
    baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
      ? import.meta.env.VITE_API_BASE_URL
      : '/api',
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