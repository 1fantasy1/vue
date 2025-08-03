import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  // 用户信息
  const user = ref({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: '',
    skills: ['Vue.js', 'JavaScript', 'Python', 'AI'],
    interests: ['人工智能', '前端开发', '创新创业']
  })

  // 应用设置
  const settings = ref({
    theme: 'light',
    language: 'zh-CN',
    notifications: true
  })

  // 当前活动状态
  const currentPage = ref('home')

  // 更新用户信息
  const updateUser = (userData) => {
    Object.assign(user.value, userData)
  }

  // 更新设置
  const updateSettings = (settingsData) => {
    Object.assign(settings.value, settingsData)
  }

  // 设置当前页面
  const setCurrentPage = (page) => {
    currentPage.value = page
  }

  return {
    user,
    settings,
    currentPage,
    updateUser,
    updateSettings,
    setCurrentPage
  }
})
