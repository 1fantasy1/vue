// 应用配置文件
export const config = {
  // API配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 15000,
    retryTimes: 3,
    retryDelay: 1000
  },

  // WebSocket配置
  websocket: {
    url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000/ws',
    reconnectInterval: 5000,
    maxReconnectAttempts: 5
  },

  // 数据库连接配置（前端不直接连接数据库，这里是API相关配置）
  database: {
    // 分页配置
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100
    },
    // 缓存配置
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5分钟
      maxSize: 50
    }
  },

  // 应用信息
  app: {
    name: 'AI教育平台',
    version: '1.0.0',
    description: '基于AI的项目推荐和智能问答平台'
  },

  // 功能配置
  features: {
    enableRAG: true,
    enableRecommendation: true,
    enableSearch: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFileTypes: ['.txt', '.pdf', '.doc', '.docx']
  },

  // UI配置
  ui: {
    primaryColor: '#409EFF',
    successColor: '#67C23A',
    warningColor: '#E6A23C',
    dangerColor: '#F56C6C',
    infoColor: '#909399'
  },

  // 分页配置
  pagination: {
    defaultPageSize: 10,
    pageSizes: [10, 20, 50, 100]
  }
}

export default config
