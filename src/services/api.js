// 前端数据服务 - 支持本地数据和远程API切换
// 通过配置可以选择使用本地 localStorage 还是远程后端 API

import remoteApiService from './remoteApi.js'
import { config } from '@/config/index.js'

// 配置：从配置文件读取是否使用本地数据
const USE_LOCAL_DATA = config.api.useLocalData

// 本地存储工具函数
const localStorageAPI = {
  get(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('读取本地数据失败:', error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('保存本地数据失败:', error)
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('删除本地数据失败:', error)
      return false
    }
  }
}

// 模拟 API 响应格式
const createResponse = (data, success = true, message = '') => {
  return Promise.resolve({
    data: {
      success,
      data,
      message
    }
  })
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 初始化默认数据
const initializeDefaultData = () => {
  // 初始化用户数据
  if (!localStorageAPI.get('users')) {
    const defaultUsers = [
      {
        id: '1',
        username: 'demo_user',
        email: 'demo@example.com',
        role: 'student',
        profile: {
          nickname: '演示用户',
          avatar: '',
          bio: '这是一个演示用户账户',
          skills: ['Vue.js', 'JavaScript', 'CSS'],
          university: '演示大学',
          major: '计算机科学'
        }
      }
    ]
    localStorageAPI.set('users', defaultUsers)
  }

  // 初始化课程数据
  if (!localStorageAPI.get('courses')) {
    const defaultCourses = [
      {
        id: '1',
        title: 'Vue.js 前端开发',
        description: '学习现代前端框架 Vue.js',
        instructor: 'demo_user',
        students: [],
        status: 'active'
      }
    ]
    localStorageAPI.set('courses', defaultCourses)
  }

  // 初始化笔记数据
  if (!localStorageAPI.get('notes')) {
    localStorageAPI.set('notes', [])
  }

  // 初始化项目数据
  if (!localStorageAPI.get('projects')) {
    localStorageAPI.set('projects', [])
  }
}

// API服务类 - 支持本地和远程数据
export class ApiService {
  // 初始化数据
  static initialize() {
    if (USE_LOCAL_DATA) {
      initializeDefaultData()
    }
  }

  // ========== 认证相关API ==========
  static async login(credentials) {
    if (USE_LOCAL_DATA) {
      // 本地认证逻辑
      const users = localStorageAPI.get('users') || []
      const user = users.find(u => u.username === credentials.username)
      if (user) {
        localStorageAPI.set('currentUser', user)
        return createResponse({ user, token: 'local-token' })
      }
      return createResponse(null, false, '用户名或密码错误')
    } else {
      try {
        const response = await remoteApiService.auth.login({
          email: credentials.email || credentials.username,
          password: credentials.password
        })
        // 获取用户信息
        const userInfo = await remoteApiService.users.getMe()
        localStorageAPI.set('currentUser', userInfo)
        return createResponse({ user: userInfo, ...response })
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async register(userData) {
    if (USE_LOCAL_DATA) {
      const users = localStorageAPI.get('users') || []
      const newUser = {
        id: generateId(),
        ...userData,
        createdAt: new Date().toISOString()
      }
      users.push(newUser)
      localStorageAPI.set('users', users)
      return createResponse(newUser)
    } else {
      try {
        const response = await remoteApiService.auth.register(userData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static logout() {
    if (USE_LOCAL_DATA) {
      localStorageAPI.remove('currentUser')
    } else {
      remoteApiService.auth.logout()
    }
  }

  // ========== 用户相关API ==========
  static async getUser(userId) {
    if (USE_LOCAL_DATA) {
      const users = localStorageAPI.get('users') || []
      const user = users.find(u => u.id === userId)
      return createResponse(user)
    } else {
      try {
        if (userId === 'me') {
          const response = await remoteApiService.users.getMe()
          return createResponse(response)
        } else {
          const response = await remoteApiService.students.getStudentById(userId)
          return createResponse(response)
        }
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async updateUser(userId, userData) {
    if (USE_LOCAL_DATA) {
      const users = localStorageAPI.get('users') || []
      const index = users.findIndex(u => u.id === userId)
      if (index !== -1) {
        users[index] = { ...users[index], ...userData }
        localStorageAPI.set('users', users)
        return createResponse(users[index])
      }
      return createResponse(null, false, '用户不存在')
    } else {
      try {
        const response = await remoteApiService.users.updateMe(userData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 学生相关API ==========
  static async getStudents() {
    if (USE_LOCAL_DATA) {
      const users = localStorageAPI.get('users') || []
      return createResponse(users.filter(u => u.role === 'student'))
    } else {
      try {
        const response = await remoteApiService.students.getAllStudents()
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async getStudent(studentId) {
    if (USE_LOCAL_DATA) {
      const users = localStorageAPI.get('users') || []
      const student = users.find(u => u.id === studentId && u.role === 'student')
      return createResponse(student)
    } else {
      try {
        const response = await remoteApiService.students.getStudentById(studentId)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 项目相关API ==========
  static async getProjects() {
    if (USE_LOCAL_DATA) {
      const projects = localStorageAPI.get('projects') || []
      return createResponse(projects)
    } else {
      try {
        const response = await remoteApiService.projects.getAllProjects()
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async getProject(projectId) {
    if (USE_LOCAL_DATA) {
      const projects = localStorageAPI.get('projects') || []
      const project = projects.find(p => p.id === projectId)
      return createResponse(project)
    } else {
      try {
        const response = await remoteApiService.projects.getProjectById(projectId)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async createProject(projectData) {
    if (USE_LOCAL_DATA) {
      const projects = localStorageAPI.get('projects') || []
      const newProject = {
        id: generateId(),
        ...projectData,
        createdAt: new Date().toISOString()
      }
      projects.push(newProject)
      localStorageAPI.set('projects', projects)
      return createResponse(newProject)
    } else {
      try {
        // 注意：根据API文档，项目创建可能需要特定权限
        return createResponse(null, false, '项目创建功能暂未开放')
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async recommendProjects(studentId, options = {}) {
    if (USE_LOCAL_DATA) {
      // 简单的本地推荐逻辑
      const projects = localStorageAPI.get('projects') || []
      return createResponse(projects.slice(0, 3))
    } else {
      try {
        const response = await remoteApiService.recommend.recommendProjects(
          studentId, 
          options.initialK || 50, 
          options.finalK || 3
        )
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async matchStudents(projectId, options = {}) {
    if (USE_LOCAL_DATA) {
      // 简单的本地匹配逻辑
      const users = localStorageAPI.get('users') || []
      const students = users.filter(u => u.role === 'student')
      return createResponse(students.slice(0, 3))
    } else {
      try {
        const response = await remoteApiService.projects.matchStudents(
          projectId,
          options.initialK || 50,
          options.finalK || 3
        )
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 课程相关API（保持本地实现，因为后端API中没有课程相关接口） ==========
  static async getCourse(courseId) {
    // 课程功能暂时保持本地实现
    const courses = localStorageAPI.get('courses') || []
    const course = courses.find(c => c.id === courseId)
    return createResponse(course)
  }

  static async getCourses() {
    // 课程功能暂时保持本地实现
    const courses = localStorageAPI.get('courses') || []
    return createResponse(courses)
  }

  static async createCourse(courseData) {
    // 课程功能暂时保持本地实现
    const courses = localStorageAPI.get('courses') || []
    const newCourse = {
      id: generateId(),
      ...courseData,
      createdAt: new Date().toISOString()
    }
    courses.push(newCourse)
    localStorageAPI.set('courses', courses)
    return createResponse(newCourse)
  }

  // ========== 笔记相关API ==========
  static async getNotes(userId, noteType = null) {
    if (USE_LOCAL_DATA) {
      const notes = localStorageAPI.get('notes') || []
      let userNotes = notes.filter(n => n.userId === userId)
      if (noteType) {
        userNotes = userNotes.filter(n => n.note_type === noteType)
      }
      return createResponse(userNotes)
    } else {
      try {
        const response = await remoteApiService.notes.getAllNotes(noteType)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async getNote(noteId) {
    if (USE_LOCAL_DATA) {
      const notes = localStorageAPI.get('notes') || []
      const note = notes.find(n => n.id === noteId)
      return createResponse(note)
    } else {
      try {
        const response = await remoteApiService.notes.getNoteById(noteId)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async createNote(noteData) {
    if (USE_LOCAL_DATA) {
      const notes = localStorageAPI.get('notes') || []
      const newNote = {
        id: generateId(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      notes.push(newNote)
      localStorageAPI.set('notes', notes)
      return createResponse(newNote)
    } else {
      try {
        const response = await remoteApiService.notes.createNote(noteData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async updateNote(noteId, noteData) {
    if (USE_LOCAL_DATA) {
      const notes = localStorageAPI.get('notes') || []
      const index = notes.findIndex(n => n.id === noteId)
      if (index !== -1) {
        notes[index] = { 
          ...notes[index], 
          ...noteData, 
          updatedAt: new Date().toISOString() 
        }
        localStorageAPI.set('notes', notes)
        return createResponse(notes[index])
      }
      return createResponse(null, false, '笔记不存在')
    } else {
      try {
        const response = await remoteApiService.notes.updateNote(noteId, noteData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async deleteNote(noteId) {
    if (USE_LOCAL_DATA) {
      const notes = localStorageAPI.get('notes') || []
      const filteredNotes = notes.filter(n => n.id !== noteId)
      localStorageAPI.set('notes', filteredNotes)
      return createResponse(true, true, '删除成功')
    } else {
      try {
        await remoteApiService.notes.deleteNote(noteId)
        return createResponse(true, true, '删除成功')
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 工作台相关API ==========
  static async getDashboardSummary() {
    if (USE_LOCAL_DATA) {
      // 本地统计逻辑
      const projects = localStorageAPI.get('projects') || []
      const courses = localStorageAPI.get('courses') || []
      
      return createResponse({
        active_projects_count: projects.length,
        completed_projects_count: 0,
        learning_courses_count: courses.length,
        completed_courses_count: 0,
        active_chats_count: 0,
        unread_messages_count: 0,
        resume_completion_percentage: 75.0
      })
    } else {
      try {
        const response = await remoteApiService.dashboard.getSummary()
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async getDashboardProjects(statusFilter = null) {
    if (USE_LOCAL_DATA) {
      const projects = localStorageAPI.get('projects') || []
      return createResponse(projects.map(p => ({
        id: p.id,
        title: p.title,
        progress: Math.random() * 100 // 随机进度
      })))
    } else {
      try {
        const response = await remoteApiService.dashboard.getProjects(statusFilter)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async getDashboardCourses(statusFilter = null) {
    if (USE_LOCAL_DATA) {
      const courses = localStorageAPI.get('courses') || []
      return createResponse(courses.map(c => ({
        id: c.id,
        title: c.title,
        progress: Math.random() * 100 // 随机进度
      })))
    } else {
      try {
        const response = await remoteApiService.dashboard.getCourses(statusFilter)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 知识库相关API ==========
  static async getKnowledgeBases() {
    if (USE_LOCAL_DATA) {
      const knowledgeBases = localStorageAPI.get('knowledgeBases') || []
      return createResponse(knowledgeBases)
    } else {
      try {
        const response = await remoteApiService.knowledgeBases.getAllKnowledgeBases()
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async createKnowledgeBase(kbData) {
    if (USE_LOCAL_DATA) {
      const knowledgeBases = localStorageAPI.get('knowledgeBases') || []
      const newKB = {
        id: generateId(),
        ...kbData,
        createdAt: new Date().toISOString()
      }
      knowledgeBases.push(newKB)
      localStorageAPI.set('knowledgeBases', knowledgeBases)
      return createResponse(newKB)
    } else {
      try {
        const response = await remoteApiService.knowledgeBases.createKnowledgeBase(kbData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== AI相关API ==========
  static async aiQA(query, options = {}) {
    if (USE_LOCAL_DATA) {
      // 模拟AI回答
      return createResponse({
        answer: '这是一个模拟的AI回答。在本地模式下，无法提供真实的AI功能。',
        answer_mode: 'local_mock',
        source_articles: [],
        search_results: []
      })
    } else {
      try {
        const response = await remoteApiService.ai.qa(query, options)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 搜索相关API ==========
  static async search(query) {
    if (USE_LOCAL_DATA) {
      const courses = localStorageAPI.get('courses') || []
      const notes = localStorageAPI.get('notes') || []
      const projects = localStorageAPI.get('projects') || []
      
      const results = {
        courses: courses.filter(c => 
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
        ),
        notes: notes.filter(n => 
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content.toLowerCase().includes(query.toLowerCase())
        ),
        projects: projects.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        )
      }
      
      return createResponse(results)
    } else {
      try {
        const response = await remoteApiService.search.semanticSearch(query)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async semanticSearch(query, itemTypes = null, limit = 10) {
    if (USE_LOCAL_DATA) {
      // 调用本地搜索
      return await this.search(query)
    } else {
      try {
        const response = await remoteApiService.search.semanticSearch(query, itemTypes, limit)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 随手记录相关API ==========
  static async getDailyRecords(mood = null, tag = null) {
    if (USE_LOCAL_DATA) {
      const records = localStorageAPI.get('dailyRecords') || []
      let filteredRecords = records
      if (mood) filteredRecords = filteredRecords.filter(r => r.mood === mood)
      if (tag) filteredRecords = filteredRecords.filter(r => r.tags && r.tags.includes(tag))
      return createResponse(filteredRecords)
    } else {
      try {
        const response = await remoteApiService.dailyRecords.getAllRecords(mood, tag)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async createDailyRecord(recordData) {
    if (USE_LOCAL_DATA) {
      const records = localStorageAPI.get('dailyRecords') || []
      const newRecord = {
        id: generateId(),
        ...recordData,
        createdAt: new Date().toISOString()
      }
      records.push(newRecord)
      localStorageAPI.set('dailyRecords', records)
      return createResponse(newRecord)
    } else {
      try {
        const response = await remoteApiService.dailyRecords.createRecord(recordData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 聊天室相关API ==========
  static async getChatRooms(roomType = null) {
    if (USE_LOCAL_DATA) {
      const chatRooms = localStorageAPI.get('chatRooms') || []
      return createResponse(roomType ? chatRooms.filter(r => r.type === roomType) : chatRooms)
    } else {
      try {
        const response = await remoteApiService.chatRooms.getAllChatRooms(roomType)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  static async createChatRoom(roomData) {
    if (USE_LOCAL_DATA) {
      const chatRooms = localStorageAPI.get('chatRooms') || []
      const newRoom = {
        id: generateId(),
        ...roomData,
        createdAt: new Date().toISOString()
      }
      chatRooms.push(newRoom)
      localStorageAPI.set('chatRooms', chatRooms)
      return createResponse(newRoom)
    } else {
      try {
        const response = await remoteApiService.chatRooms.createChatRoom(roomData)
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 健康检查API ==========
  static async healthCheck() {
    if (USE_LOCAL_DATA) {
      return createResponse({
        status: 'ok',
        message: '本地数据服务运行正常',
        mode: 'local'
      })
    } else {
      try {
        const response = await remoteApiService.health.healthCheck()
        return createResponse(response)
      } catch (error) {
        return createResponse(null, false, error.message)
      }
    }
  }

  // ========== 配置相关方法 ==========
  static setUseLocalData(useLocal) {
    // 注意：这只是示例，实际应用中建议通过配置文件或环境变量控制
    console.warn('数据源切换功能需要重新加载页面才能生效')
  }

  static isUsingLocalData() {
    return USE_LOCAL_DATA
  }
}

// 在应用启动时初始化数据
ApiService.initialize()

// 导出本地存储API工具
export { localStorageAPI }
