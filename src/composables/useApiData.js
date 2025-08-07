// 统一API数据管理 Composable
import { ref, reactive, onMounted } from 'vue'
import { ApiService } from '@/services/api.js'
import remoteApiService from '@/services/remoteApi.js'
import { config } from '@/config/index.js'

// 用户数据管理
export function useUserData() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await ApiService.login(credentials)
      
      if (response.data.success) {
        user.value = response.data.data.user
        return { success: true, user: response.data.data.user }
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await ApiService.register(userData)
      
      if (response.data.success) {
        return { success: true, user: response.data.data }
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    ApiService.logout()
  }

  const getCurrentUser = async () => {
    if (!user.value) {
      try {
        const response = await ApiService.getUser('me')
        if (response.data.success) {
          user.value = response.data.data
        }
      } catch (err) {
        console.warn('获取用户信息失败:', err)
      }
    }
    return user.value
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      const response = await ApiService.updateUser(user.value?.id || 'me', profileData)
      
      if (response.data.success) {
        user.value = response.data.data
        return { success: true, user: response.data.data }
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile
  }
}

// 学生数据管理
export function useStudentsData() {
  const students = ref([])
  const currentStudent = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchStudents = async () => {
    try {
      loading.value = true
      const response = await ApiService.getStudents()
      
      if (response.data.success) {
        students.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchStudent = async (studentId) => {
    try {
      loading.value = true
      const response = await ApiService.getStudent(studentId)
      
      if (response.data.success) {
        currentStudent.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    currentStudent,
    loading,
    error,
    fetchStudents,
    fetchStudent
  }
}

// 项目数据管理
export function useProjectsData() {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchProjects = async () => {
    try {
      loading.value = true
      const response = await ApiService.getProjects()
      
      if (response.data.success) {
        projects.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (projectId) => {
    try {
      loading.value = true
      const response = await ApiService.getProject(projectId)
      
      if (response.data.success) {
        currentProject.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData) => {
    try {
      loading.value = true
      const response = await ApiService.createProject(projectData)
      
      if (response.data.success) {
        projects.value.push(response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const recommendProjects = async (studentId, options = {}) => {
    try {
      loading.value = true
      const response = await ApiService.recommendProjects(studentId, options)
      
      if (response.data.success) {
        return response.data.data
      }
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  const matchStudents = async (projectId, options = {}) => {
    try {
      loading.value = true
      const response = await ApiService.matchStudents(projectId, options)
      
      if (response.data.success) {
        return response.data.data
      }
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    recommendProjects,
    matchStudents
  }
}

// 笔记数据管理
export function useNotesData() {
  const notes = ref([])
  const currentNote = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchNotes = async (userId, noteType = null) => {
    try {
      loading.value = true
      const response = await ApiService.getNotes(userId, noteType)
      
      if (response.data.success) {
        notes.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchNote = async (noteId) => {
    try {
      loading.value = true
      const response = await ApiService.getNote(noteId)
      
      if (response.data.success) {
        currentNote.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createNote = async (noteData) => {
    try {
      loading.value = true
      const response = await ApiService.createNote(noteData)
      
      if (response.data.success) {
        notes.value.push(response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (noteId, noteData) => {
    try {
      loading.value = true
      const response = await ApiService.updateNote(noteId, noteData)
      
      if (response.data.success) {
        const index = notes.value.findIndex(n => n.id === noteId)
        if (index !== -1) {
          notes.value[index] = response.data.data
        }
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (noteId) => {
    try {
      loading.value = true
      const response = await ApiService.deleteNote(noteId)
      
      if (response.data.success) {
        notes.value = notes.value.filter(n => n.id !== noteId)
        return true
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    notes,
    currentNote,
    loading,
    error,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote
  }
}

// 工作台数据管理
export function useDashboardData() {
  const summary = ref(null)
  const projects = ref([])
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSummary = async () => {
    try {
      loading.value = true
      const response = await ApiService.getDashboardSummary()
      
      if (response.data.success) {
        summary.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchDashboardProjects = async (statusFilter = null) => {
    try {
      const response = await ApiService.getDashboardProjects(statusFilter)
      
      if (response.data.success) {
        projects.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    }
  }

  const fetchDashboardCourses = async (statusFilter = null) => {
    try {
      const response = await ApiService.getDashboardCourses(statusFilter)
      
      if (response.data.success) {
        courses.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    summary,
    projects,
    courses,
    loading,
    error,
    fetchSummary,
    fetchDashboardProjects,
    fetchDashboardCourses
  }
}

// AI相关功能
export function useAI() {
  const loading = ref(false)
  const error = ref(null)

  const askQuestion = async (query, options = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await ApiService.aiQA(query, options)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    askQuestion
  }
}

// 搜索功能
export function useSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  const search = async (query) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await ApiService.search(query)
      
      if (response.data.success) {
        results.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const semanticSearch = async (query, itemTypes = null, limit = 10) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await ApiService.semanticSearch(query, itemTypes, limit)
      
      if (response.data.success) {
        results.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    results,
    loading,
    error,
    search,
    semanticSearch
  }
}

// 系统状态检查
export function useSystemHealth() {
  const status = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const checkHealth = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await ApiService.healthCheck()
      
      if (response.data.success) {
        status.value = response.data.data
        return response.data.data
      }
    } catch (err) {
      error.value = err.message
      status.value = {
        status: 'error',
        message: err.message,
        mode: config.api.useLocalData ? 'local' : 'remote'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    status,
    loading,
    error,
    checkHealth
  }
}

// 应用配置管理
export function useAppConfig() {
  return {
    config: reactive(config),
    isUsingLocalData: () => config.api.useLocalData,
    switchToRemoteAPI: () => {
      config.api.useLocalData = false
      console.log('已切换到远程API模式，请刷新页面')
    },
    switchToLocalData: () => {
      config.api.useLocalData = true
      console.log('已切换到本地数据模式，请刷新页面')
    }
  }
}
