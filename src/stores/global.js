import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  // 认证状态
  const isAuthenticated = ref(false)
  const token = ref(localStorage.getItem('auth_token') || '')
  
  // 用户信息
  const user = ref({
    id: null,
    username: '',
    name: '',
    email: '',
    avatar: '',
    skills: [],
    interests: []
  })

  // 应用设置
  const settings = ref({
    theme: 'light',
    language: 'zh-CN',
    notifications: true
  })

  // LLM配置
  const llmConfig = ref({
    llm_api_type: 'siliconflow',
    llm_api_key: '',
    llm_api_base_url: 'https://api.siliconflow.cn/v1',
    llm_model_id: 'deepseek-ai/DeepSeek-V3',
    temperature: 0.7,
    isConfigured: false // 标记是否已配置
  })

  // 当前活动状态
  const currentPage = ref('home')

  // 初始化认证状态
  const initAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_info')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  // 登录
  const login = (userData) => {
    user.value = {
      id: userData.id || 1,
      username: userData.username || '',
      name: userData.name || userData.username || '',
      email: userData.email || '',
      avatar: userData.avatar || '',
      skills: userData.skills || [],
      interests: userData.interests || []
    }
    
    // 生成模拟token
    const mockToken = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    token.value = mockToken
    isAuthenticated.value = true
    
    // 保存到localStorage
    localStorage.setItem('auth_token', mockToken)
    localStorage.setItem('user_info', JSON.stringify(user.value))
  }

  // 登出
  const logout = () => {
    user.value = {
      id: null,
      username: '',
      name: '',
      email: '',
      avatar: '',
      skills: [],
      interests: []
    }
    token.value = ''
    isAuthenticated.value = false
    
    // 清除localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  }

  // 更新用户信息
  const updateUser = (userData) => {
    Object.assign(user.value, userData)
    // 同步更新localStorage
    localStorage.setItem('user_info', JSON.stringify(user.value))
  }

  // 更新设置
  const updateSettings = (settingsData) => {
    Object.assign(settings.value, settingsData)
  }

  // 更新LLM配置
  const updateLLMConfig = (configData) => {
    Object.assign(llmConfig.value, configData)
    llmConfig.value.isConfigured = !!(configData.llm_api_key && configData.llm_api_base_url)
    
    // 保存到localStorage作为备份
    localStorage.setItem('llm_config', JSON.stringify(llmConfig.value))
  }

  // 加载LLM配置（从localStorage或服务器）
  const loadLLMConfig = async (fromServer = false) => {
    if (fromServer) {
      try {
        const remoteApiService = await import('@/services/remoteApi.js')
        const userData = await remoteApiService.default.users.getMe()
        
        if (userData) {
          const serverConfig = {
            llm_api_type: userData.llm_api_type || 'siliconflow',
            llm_api_key: userData.llm_api_key_encrypted || '',
            llm_api_base_url: userData.llm_api_base_url || 'https://api.siliconflow.cn/v1',
            llm_model_id: userData.llm_model_id || 'deepseek-ai/DeepSeek-V3'
          }
          updateLLMConfig(serverConfig)
          return serverConfig
        }
      } catch (error) {
        console.warn('从服务器加载LLM配置失败:', error)
      }
    } else {
      // 从localStorage加载
      const savedConfig = localStorage.getItem('llm_config')
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig)
          Object.assign(llmConfig.value, parsed)
        } catch (error) {
          console.error('解析本地LLM配置失败:', error)
        }
      }
    }
    return llmConfig.value
  }

  // 检查LLM是否已配置
  const isLLMConfigured = () => {
    return llmConfig.value.isConfigured && 
           llmConfig.value.llm_api_key && 
           llmConfig.value.llm_api_base_url
  }

  // 获取当前LLM配置（用于API调用）
  const getLLMConfig = () => {
    return {
      ...llmConfig.value
    }
  }

  // 设置当前页面
  const setCurrentPage = (page) => {
    currentPage.value = page
  }

  // 检查是否已登录
  const checkAuth = () => {
    return isAuthenticated.value && token.value
  }

  return {
    // 状态
    isAuthenticated,
    token,
    user,
    settings,
    llmConfig,
    currentPage,
    
    // 方法
    initAuth,
    login,
    logout,
    updateUser,
    updateSettings,
    updateLLMConfig,
    loadLLMConfig,
    isLLMConfigured,
    getLLMConfig,
    setCurrentPage,
    checkAuth
  }
})
