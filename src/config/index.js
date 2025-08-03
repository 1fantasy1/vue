// 应用配置文件
export const config = {
  // API配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000
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
