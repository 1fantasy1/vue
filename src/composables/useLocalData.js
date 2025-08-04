// 本地数据管理 Composable
import { ref, reactive, onMounted } from 'vue'
import { ApiService, localStorageAPI } from '@/services/api.js'

// 用户数据管理
export function useUserData() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async (username, password) => {
    try {
      loading.value = true
      // 简单的本地认证示例
      const users = localStorageAPI.get('users') || []
      const foundUser = users.find(u => u.username === username)
      
      if (foundUser) {
        user.value = foundUser
        localStorageAPI.set('currentUser', foundUser)
        return { success: true, user: foundUser }
      } else {
        throw new Error('用户名或密码错误')
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
    localStorageAPI.remove('currentUser')
  }

  const getCurrentUser = () => {
    if (!user.value) {
      user.value = localStorageAPI.get('currentUser')
    }
    return user.value
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      if (user.value) {
        const response = await ApiService.updateUser(user.value.id, profileData)
        if (response.data.success) {
          user.value = response.data.data
          localStorageAPI.set('currentUser', user.value)
        }
        return response
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getCurrentUser()
  })

  return {
    user,
    loading,
    error,
    login,
    logout,
    getCurrentUser,
    updateProfile
  }
}

// 课程数据管理
export function useCourseData() {
  const courses = ref([])
  const currentCourse = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchCourses = async () => {
    try {
      loading.value = true
      const response = await ApiService.getCourses()
      if (response.data.success) {
        courses.value = response.data.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getCourse = async (courseId) => {
    try {
      loading.value = true
      const response = await ApiService.getCourse(courseId)
      if (response.data.success) {
        currentCourse.value = response.data.data
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCourse = async (courseData) => {
    try {
      loading.value = true
      const response = await ApiService.createCourse(courseData)
      if (response.data.success) {
        courses.value.push(response.data.data)
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    currentCourse,
    loading,
    error,
    fetchCourses,
    getCourse,
    createCourse
  }
}

// 笔记数据管理
export function useNoteData() {
  const notes = ref([])
  const currentNote = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchNotes = async (userId) => {
    try {
      loading.value = true
      const response = await ApiService.getNotes(userId)
      if (response.data.success) {
        notes.value = response.data.data
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
      }
      return response
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
      }
      return response
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
      }
      return response
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
    createNote,
    updateNote,
    deleteNote
  }
}

// 项目数据管理
export function useProjectData() {
  const projects = ref([])
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

  const createProject = async (projectData) => {
    try {
      loading.value = true
      const response = await ApiService.createProject(projectData)
      if (response.data.success) {
        projects.value.push(response.data.data)
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject
  }
}

// 搜索功能
export function useSearch() {
  const searchResults = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const search = async (query) => {
    try {
      loading.value = true
      const response = await ApiService.search(query)
      if (response.data.success) {
        searchResults.value = response.data.data
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    searchResults,
    loading,
    error,
    search
  }
}
