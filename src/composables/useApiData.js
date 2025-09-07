// 统一API数据管理 Composable
import { ref, reactive, onMounted } from 'vue'
import { usersAdapter } from '@/api/openapi/adapters/usersAdapter.js'
import { studentsAdapter } from '@/api/openapi/adapters/studentsAdapter.js'
import { dashboardAdapter } from '@/api/openapi/adapters/dashboardAdapter.js'
import { config } from '@/config/index.js'
import { aiAdapter } from '@/api/openapi/adapters/aiAdapter.js'
import { searchAdapter } from '@/api/openapi/adapters/searchAdapter.js'
import { healthAdapter } from '@/api/openapi/adapters/healthAdapter.js'
import { authAdapter } from '@/api/openapi/adapters/authAdapter.js'

// 用户数据管理
export function useUserData() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
  const tokenData = await authAdapter.login(credentials)
  const me = await usersAdapter.getMe()
  user.value = me
  return { success: true, user: me, token: tokenData?.access_token }
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
      
  const data = await authAdapter.register(userData)
  return { success: true, user: data }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
  authAdapter.logout()
  }

  const getCurrentUser = async (forceRefresh = false) => {
    if (!user.value || forceRefresh) {
      try {
        console.log('获取用户信息...')
  const me = await usersAdapter.getMe()
  user.value = me
  console.log('用户信息获取成功:', user.value)
      } catch (err) {
        console.warn('获取用户信息失败:', err)
      }
    }
    return user.value
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
  const updated = await usersAdapter.updateMe(profileData)
  user.value = updated
  return { success: true, user: updated }
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
  const list = await studentsAdapter.getAllStudents()
  students.value = Array.isArray(list) ? list : (list?.data ?? [])
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchStudent = async (studentId) => {
    try {
      loading.value = true
  currentStudent.value = await studentsAdapter.getStudentById(studentId)
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
  const { projectsAdapter } = await import('@/api/openapi/adapters/projectsAdapter.js')
  const list = await projectsAdapter.getAllProjects()
  projects.value = Array.isArray(list) ? list : (list?.data ?? [])
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (projectId) => {
    try {
      loading.value = true
  const { projectsAdapter } = await import('@/api/openapi/adapters/projectsAdapter.js')
  currentProject.value = await projectsAdapter.getProjectById(projectId)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData) => {
    try {
      loading.value = true
  const { projectsAdapter } = await import('@/api/openapi/adapters/projectsAdapter.js')
  const created = await projectsAdapter.createProject(projectData)
  if (created) projects.value.push(created)
  return created
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
      const { recommendAdapter } = await import('@/api/openapi/adapters/recommendAdapter.js')
      const list = await recommendAdapter.recommendProjects(
        studentId,
        options.initialK || 50,
        options.finalK || 3
      )
      return Array.isArray(list) ? list : (list?.data ?? [])
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
      const { projectsAdapter } = await import('@/api/openapi/adapters/projectsAdapter.js')
      const list = await projectsAdapter.matchStudents(
        projectId,
        options.initialK || 50,
        options.finalK || 3
      )
      return Array.isArray(list) ? list : (list?.data ?? [])
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
  const { notesAdapter } = await import('@/api/openapi/adapters/notesAdapter.js')
  const list = await notesAdapter.getAllNotes({ user_id: userId, note_type: noteType })
  notes.value = Array.isArray(list) ? list : (list?.data ?? [])
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchNote = async (noteId) => {
    try {
      loading.value = true
  const { notesAdapter } = await import('@/api/openapi/adapters/notesAdapter.js')
  currentNote.value = await notesAdapter.getNoteById(noteId)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createNote = async (noteData) => {
    try {
      loading.value = true
  const { notesAdapter } = await import('@/api/openapi/adapters/notesAdapter.js')
  const created = await notesAdapter.createNote(noteData)
  if (created) notes.value.push(created)
  return created
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
  const { notesAdapter } = await import('@/api/openapi/adapters/notesAdapter.js')
  const updated = await notesAdapter.updateNote(noteId, noteData)
  const index = notes.value.findIndex(n => n.id === noteId)
  if (index !== -1) notes.value[index] = updated
  return updated
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
  const { notesAdapter } = await import('@/api/openapi/adapters/notesAdapter.js')
  await notesAdapter.deleteNote(noteId)
  notes.value = notes.value.filter(n => n.id !== noteId)
  return true
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
  summary.value = await dashboardAdapter.getSummary()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchDashboardProjects = async (statusFilter = null) => {
    try {
  const list = await dashboardAdapter.getProjects(statusFilter)
  projects.value = Array.isArray(list) ? list : (list?.data ?? [])
    } catch (err) {
      error.value = err.message
    }
  }

  const fetchDashboardCourses = async (statusFilter = null) => {
    try {
  const list = await dashboardAdapter.getCourses(statusFilter)
  courses.value = Array.isArray(list) ? list : (list?.data ?? [])
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
      
  const data = await aiAdapter.qa(query, options)
  return data
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
      
  const data = await searchAdapter.semanticSearch(query, null, 10)
  results.value = data
  return data
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
      
  const data = await searchAdapter.semanticSearch(query, itemTypes, limit)
  results.value = data
  return data
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
      
  const data = await healthAdapter.check()
  status.value = data
  return data
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
