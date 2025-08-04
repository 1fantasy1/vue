// 数据库连接使用示例
import { ref, reactive, onMounted } from 'vue'
import { 
  userService, 
  courseService, 
  noteService, 
  knowledgeService,
  projectService,
  chatService 
} from '@/services/database.js'
import { cacheService, withCache } from '@/services/cache.js'

// 用户数据管理示例
export function useUserData() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const login = async (credentials) => {
    try {
      loading.value = true
      const response = await userService.login(credentials)
      user.value = response.user
      
      // 存储token
      localStorage.setItem('authToken', response.token)
      
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    cacheService.clear()
  }

  const updateProfile = async (userData) => {
    try {
      loading.value = true
      const response = await userService.updateProfile(user.value.id, userData)
      user.value = { ...user.value, ...response }
      return response
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
    logout,
    updateProfile
  }
}

// 课程数据管理示例
export function useCourseData() {
  const courses = ref([])
  const currentCourse = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 使用缓存的课程获取函数
  const getCachedCourses = withCache(courseService.getCourses)

  const fetchCourses = async (params = {}) => {
    try {
      loading.value = true
      courses.value = await getCachedCourses(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCourseDetail = async (courseId) => {
    try {
      loading.value = true
      currentCourse.value = await courseService.getCourseDetail(courseId)
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
      const newCourse = await courseService.createCourse(courseData)
      courses.value.unshift(newCourse)
      return newCourse
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
    fetchCourseDetail,
    createCourse
  }
}

// 笔记数据管理示例
export function useNoteData() {
  const notes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUserNotes = async (userId, params = {}) => {
    try {
      loading.value = true
      notes.value = await noteService.getUserNotes(userId, params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNote = async (noteData) => {
    try {
      loading.value = true
      const newNote = await noteService.createNote(noteData)
      notes.value.unshift(newNote)
      return newNote
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
      const updatedNote = await noteService.updateNote(noteId, noteData)
      
      const index = notes.value.findIndex(note => note.id === noteId)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      
      return updatedNote
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
      await noteService.deleteNote(noteId)
      notes.value = notes.value.filter(note => note.id !== noteId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchNotes = async (query, params = {}) => {
    try {
      loading.value = true
      return await noteService.searchNotes(query, params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    notes,
    loading,
    error,
    fetchUserNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes
  }
}

// 知识库数据管理示例
export function useKnowledgeData() {
  const documents = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchDocuments = async (params = {}) => {
    try {
      loading.value = true
      documents.value = await knowledgeService.getDocuments(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadDocument = async (file, metadata = {}) => {
    try {
      loading.value = true
      const formData = new FormData()
      formData.append('file', file)
      formData.append('metadata', JSON.stringify(metadata))
      
      const document = await knowledgeService.uploadDocument(formData)
      documents.value.unshift(document)
      return document
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const askQuestion = async (question, context = {}) => {
    try {
      loading.value = true
      return await knowledgeService.askQuestion(question, context)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    askQuestion
  }
}

// 实时聊天数据管理示例
export function useChatData() {
  const rooms = ref([])
  const messages = ref([])
  const loading = ref(false)
  const error = ref(null)
  let websocket = null

  const fetchRooms = async () => {
    try {
      loading.value = true
      rooms.value = await chatService.getRooms()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMessages = async (roomId, params = {}) => {
    try {
      loading.value = true
      messages.value = await chatService.getMessages(roomId, params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (roomId, message) => {
    try {
      const sentMessage = await chatService.sendMessage(roomId, message)
      messages.value.push(sentMessage)
      return sentMessage
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // WebSocket连接管理
  const connectWebSocket = (roomId) => {
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/rooms/${roomId}`
    websocket = new WebSocket(wsUrl)

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      messages.value.push(message)
    }

    websocket.onerror = (error) => {
      console.error('WebSocket错误:', error)
    }
  }

  const disconnectWebSocket = () => {
    if (websocket) {
      websocket.close()
      websocket = null
    }
  }

  return {
    rooms,
    messages,
    loading,
    error,
    fetchRooms,
    fetchMessages,
    sendMessage,
    connectWebSocket,
    disconnectWebSocket
  }
}

// 综合数据管理示例（在Vue组件中使用）
export function useAppData() {
  const state = reactive({
    user: null,
    courses: [],
    notes: [],
    projects: [],
    loading: false,
    error: null
  })

  const initializeApp = async () => {
    try {
      state.loading = true
      
      // 检查本地token
      const token = localStorage.getItem('authToken')
      if (token) {
        // 验证token并获取用户信息
        // state.user = await userService.getProfile()
      }
      
      // 预加载重要数据
      if (state.user) {
        await Promise.all([
          loadUserCourses(),
          loadUserNotes(),
          loadUserProjects()
        ])
      }
    } catch (err) {
      state.error = err.message
    } finally {
      state.loading = false
    }
  }

  const loadUserCourses = async () => {
    state.courses = await courseService.getCourses()
  }

  const loadUserNotes = async () => {
    if (state.user) {
      state.notes = await noteService.getUserNotes(state.user.id)
    }
  }

  const loadUserProjects = async () => {
    state.projects = await projectService.getProjects()
  }

  // 在组件挂载时初始化
  onMounted(() => {
    initializeApp()
  })

  return {
    state,
    initializeApp,
    loadUserCourses,
    loadUserNotes,
    loadUserProjects
  }
}
