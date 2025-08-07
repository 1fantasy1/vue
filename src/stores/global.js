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
    currentPage,
    
    // 方法
    initAuth,
    login,
    logout,
    updateUser,
    updateSettings,
    setCurrentPage,
    checkAuth
  }
})
