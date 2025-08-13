// 前端数据服务 - 统一API接口
// 删除本地示例，直接使用远程API，课程功能使用本地实现

import remoteApiService from './remoteApi.js'

// 配置：课程功能仍使用本地数据，因为后端暂无课程API
const COURSES_USE_LOCAL = true

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

// 初始化课程默认数据（仅课程功能使用）
const initializeCourseData = () => {
  if (!localStorageAPI.get('courses')) {
    const defaultCourses = [
      {
        id: '1',
        title: 'Vue.js 前端开发基础',
        description: '学习现代前端框架 Vue.js 的基础知识和实践',
        instructor: 'demo_instructor',
        status: 'active',
        enrolledStudents: [],
        chapters: [
          { id: '1', title: '环境搭建与项目创建', completed: false },
          { id: '2', title: 'Vue组件基础', completed: false },
          { id: '3', title: '数据绑定与指令', completed: false }
        ],
        resources: [
          { type: 'video', title: 'Vue.js 入门教程', url: '#' },
          { type: 'document', title: 'Vue.js 官方文档', url: 'https://vuejs.org' }
        ],
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'JavaScript 高级编程',
        description: 'JavaScript 高级特性和最佳实践',
        instructor: 'demo_instructor',
        status: 'active',
        enrolledStudents: [],
        chapters: [
          { id: '1', title: '异步编程与Promise', completed: false },
          { id: '2', title: 'ES6+ 新特性', completed: false },
          { id: '3', title: '函数式编程', completed: false }
        ],
        resources: [],
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    localStorageAPI.set('courses', defaultCourses)
  }
}

// API服务类 - 统一API接口
export class ApiService {
  // 初始化课程数据（仅课程功能需要）
  static initialize() {
    if (COURSES_USE_LOCAL) {
      initializeCourseData()
    }
  }

  // ========== 认证相关API ==========
  static async login(credentials) {
    try {
      const response = await remoteApiService.auth.login(credentials)
      // 获取用户信息
      const userInfo = await remoteApiService.users.getMe()
      localStorageAPI.set('currentUser', userInfo)
      return createResponse({ user: userInfo, ...response })
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async register(userData) {
    try {
      const response = await remoteApiService.auth.register(userData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static logout() {
    remoteApiService.auth.logout()
    localStorageAPI.remove('currentUser')
  }

  static async sendSmsCode(phoneData) {
    try {
      const response = await remoteApiService.auth.sendSmsCode(phoneData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 用户相关API ==========
  static async getUser(userId) {
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

  static async updateUser(userId, userData) {
    try {
      const response = await remoteApiService.users.updateMe(userData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 学生相关API ==========
  static async getStudents() {
    try {
      const response = await remoteApiService.students.getAllStudents()
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getStudent(studentId) {
    try {
      const response = await remoteApiService.students.getStudentById(studentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 项目相关API ==========
  static async getProjects() {
    try {
      const response = await remoteApiService.projects.getAllProjects()
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getProject(projectId) {
    try {
      const response = await remoteApiService.projects.getProjectById(projectId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createProject(projectData) {
    try {
      const response = await remoteApiService.projects.createProject(projectData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateProject(projectId, projectData) {
    try {
      const response = await remoteApiService.projects.updateProject(projectId, projectData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async recommendProjects(studentId, options = {}) {
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

  static async matchStudents(projectId, options = {}) {
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

  // ========== 课程相关API（本地实现 - 后端API暂不支持） ==========
  static async getCourse(courseId) {
    const courses = localStorageAPI.get('courses') || []
    const course = courses.find(c => c.id === courseId)
    if (course) {
      // 增强课程信息
      course.progress = course.progress || 0
      course.enrolledStudents = course.enrolledStudents || []
      course.chapters = course.chapters || []
      course.resources = course.resources || []
    }
    return createResponse(course)
  }

  static async getCourses() {
    const courses = localStorageAPI.get('courses') || []
    // 增强课程列表信息
    const enrichedCourses = courses.map(course => ({
      ...course,
      progress: course.progress || 0,
      enrolledStudents: course.enrolledStudents || [],
      totalStudents: (course.enrolledStudents || []).length,
      isActive: course.status === 'active'
    }))
    return createResponse(enrichedCourses)
  }

  static async createCourse(courseData) {
    const courses = localStorageAPI.get('courses') || []
    const newCourse = {
      id: generateId(),
      ...courseData,
      status: 'active',
      enrolledStudents: [],
      chapters: [],
      resources: [],
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    courses.push(newCourse)
    localStorageAPI.set('courses', courses)
    return createResponse(newCourse)
  }

  static async updateCourse(courseId, courseData) {
    const courses = localStorageAPI.get('courses') || []
    const index = courses.findIndex(c => c.id === courseId)
    if (index !== -1) {
      courses[index] = { 
        ...courses[index], 
        ...courseData, 
        updatedAt: new Date().toISOString() 
      }
      localStorageAPI.set('courses', courses)
      return createResponse(courses[index])
    }
    return createResponse(null, false, '课程不存在')
  }

  static async deleteCourse(courseId) {
    const courses = localStorageAPI.get('courses') || []
    const filteredCourses = courses.filter(c => c.id !== courseId)
    localStorageAPI.set('courses', filteredCourses)
    return createResponse(true, true, '删除成功')
  }

  static async enrollCourse(courseId, studentId) {
    const courses = localStorageAPI.get('courses') || []
    const courseIndex = courses.findIndex(c => c.id === courseId)
    if (courseIndex !== -1) {
      const course = courses[courseIndex]
      if (!course.enrolledStudents) course.enrolledStudents = []
      if (!course.enrolledStudents.includes(studentId)) {
        course.enrolledStudents.push(studentId)
        course.updatedAt = new Date().toISOString()
        localStorageAPI.set('courses', courses)
        return createResponse(course)
      }
      return createResponse(null, false, '已经报名过该课程')
    }
    return createResponse(null, false, '课程不存在')
  }

  // ========== 笔记相关API ==========
  static async getNotes(userId, noteType = null) {
    try {
      const response = await remoteApiService.notes.getAllNotes(noteType)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getNote(noteId) {
    try {
      const response = await remoteApiService.notes.getNoteById(noteId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createNote(noteData) {
    try {
      const response = await remoteApiService.notes.createNote(noteData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateNote(noteId, noteData) {
    try {
      const response = await remoteApiService.notes.updateNote(noteId, noteData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteNote(noteId) {
    try {
      await remoteApiService.notes.deleteNote(noteId)
      return createResponse(true, true, '删除成功')
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 工作台相关API ==========
  static async getDashboardSummary() {
    try {
      const response = await remoteApiService.dashboard.getSummary()
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getDashboardProjects(statusFilter = null) {
    try {
      const response = await remoteApiService.dashboard.getProjects(statusFilter)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getDashboardCourses(statusFilter = null) {
    // 课程仍然使用本地实现，因为后端没有课程API
    const courses = localStorageAPI.get('courses') || []
    let filteredCourses = courses
    if (statusFilter) {
      filteredCourses = courses.filter(c => c.status === statusFilter)
    }
    return createResponse(filteredCourses.map(c => ({
      id: c.id,
      title: c.title,
      progress: c.progress || 0,
      status: c.status || 'active'
    })))
  }

  // ========== 知识库相关API ==========
  static async getKnowledgeBases() {
    try {
      const response = await remoteApiService.knowledgeBases.getAllKnowledgeBases()
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createKnowledgeBase(kbData) {
    try {
      const response = await remoteApiService.knowledgeBases.createKnowledgeBase(kbData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== AI相关API ==========
  static async aiQA(query, options = {}) {
    try {
      const response = await remoteApiService.ai.qa(query, options)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 搜索相关API ==========
  static async search(query) {
    try {
      const response = await remoteApiService.search.semanticSearch(query)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async semanticSearch(query, itemTypes = null, limit = 10) {
    try {
      const response = await remoteApiService.search.semanticSearch(query, itemTypes, limit)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 随手记录相关API ==========
  static async getDailyRecords(mood = null, tag = null) {
    try {
      const response = await remoteApiService.dailyRecords.getAllRecords(mood, tag)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createDailyRecord(recordData) {
    try {
      const response = await remoteApiService.dailyRecords.createRecord(recordData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getDailyRecord(recordId) {
    try {
      const response = await remoteApiService.dailyRecords.getRecordById(recordId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateDailyRecord(recordId, recordData) {
    try {
      const response = await remoteApiService.dailyRecords.updateRecord(recordId, recordData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteDailyRecord(recordId) {
    try {
      const response = await remoteApiService.dailyRecords.deleteRecord(recordId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 聊天室相关API ==========
  static async getChatRooms(roomType = null) {
    try {
      const response = await remoteApiService.chatRooms.getAllChatRooms(roomType)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createChatRoom(roomData) {
    try {
      const response = await remoteApiService.chatRooms.createChatRoom(roomData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 健康检查API ==========
  static async healthCheck() {
    try {
      const response = await remoteApiService.health.healthCheck()
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 论坛相关API ==========
  static async getForumTopics(options = {}) {
    try {
      const response = await remoteApiService.forum.getTopics(options)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getForumTopic(topicId) {
    try {
      const response = await remoteApiService.forum.getTopicById(topicId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createForumTopic(topicData) {
    try {
      const response = await remoteApiService.forum.createTopic(topicData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getForumComments(topicId, parentCommentId = null, limit = 50, offset = 0) {
    try {
      const response = await remoteApiService.forum.getComments(topicId, parentCommentId, limit, offset)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async addForumComment(topicId, commentData) {
    try {
      const response = await remoteApiService.forum.addComment(topicId, commentData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 音频相关API ==========
  static async textToSpeech(text, lang = 'zh-CN') {
    try {
      const response = await remoteApiService.audio.textToSpeech(text, lang)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 文档上传相关API ==========
  static async uploadDocument(kbId, file) {
    try {
      const response = await remoteApiService.knowledgeBases.uploadDocument(kbId, file)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getKnowledgeBaseDocuments(kbId, statusFilter = null) {
    try {
      const response = await remoteApiService.knowledgeBases.getDocuments(kbId, statusFilter)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 配置相关方法 ==========
  static isUsingLocalData() {
    return false // 除课程外都使用远程API
  }

  static isCoursesUsingLocalData() {
    return COURSES_USE_LOCAL
  }
}

// 在应用启动时初始化数据
ApiService.initialize()

// 导出本地存储API工具
export { localStorageAPI }
