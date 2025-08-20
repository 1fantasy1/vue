// 前端数据服务 - 统一API接口
// 删除本地示例，直接使用远程API，课程功能使用本地实现

import remoteApiService from './remoteApi.js'

// 配置：课程功能默认使用本地数据（用于开发测试）
const COURSES_USE_LOCAL = false

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
    } else {
      // 确保关闭本地模式时不残留本地示例课程
      try { localStorage.removeItem('courses') } catch {}
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

  static async getMe() {
    try {
      const response = await remoteApiService.users.getMe()
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
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

  static async deleteProject(projectId) {
    try {
      const response = await remoteApiService.projects.deleteProject(projectId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async applyToProject(projectId, applicationData) {
    try {
      const response = await remoteApiService.projects.applyToProject(projectId, applicationData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getProjectApplications(projectId, statusFilter = null) {
    try {
      const response = await remoteApiService.projects.getProjectApplications(projectId, statusFilter)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async processProjectApplication(applicationId, processData) {
    try {
      const response = await remoteApiService.projects.processProjectApplication(applicationId, processData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getProjectMembers(projectId) {
    try {
      const response = await remoteApiService.projects.getProjectMembers(projectId)
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

  // ========== 课程相关API（后端API实现） ==========
  
  // 1. 课程核心管理
  // 获取当前用户关联的课程（仅我参与/已报名/有进度的课程）
  static async getMyCourses(statusFilter = null) {
    try {
      // 新：使用工作台端点，返回当前用户课程卡片列表
      try {
        const response = await remoteApiService.dashboard.getCourses(statusFilter)
        return createResponse(response)
      } catch (err) {
        // 兼容旧实现：回退到 /users/me/courses（UserCourseResponse 列表）
        const fallback = await remoteApiService.users.getMyCourses(statusFilter)
        return createResponse(fallback)
      }
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getCourses() {
    try {
      if (COURSES_USE_LOCAL) {
        // 本地实现保持不变作为备用
        const courses = localStorageAPI.get('courses') || []
        const enrichedCourses = courses.map(course => ({
          ...course,
          progress: course.progress || 0,
          enrolledStudents: course.enrolledStudents || [],
          totalStudents: (course.enrolledStudents || []).length,
          isActive: course.status === 'active'
        }))
        return createResponse(enrichedCourses)
      }
      
      // 调用后端API获取所有课程列表
      const response = await remoteApiService.courses.getAllCourses()
      // 后端API直接返回课程数组，按照API文档格式处理
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 获取所有可用课程（用于课程浏览页面）
  static async getAllCourses() {
    try {
      if (COURSES_USE_LOCAL) {
        // 返回本地模拟数据，包含示例课程
        const sampleCourses = [
          {
            id: 1,
            title: 'Vue.js 从入门到精通',
            instructor: '张老师',
            description: '完整学习Vue.js框架，从基础语法到高级应用，包含实战项目。适合前端开发者提升技能。',
            level: 'intermediate',
            category: 'programming',
            duration: 24,
            thumbnail: '/api/placeholder/300/200',
            required_skills: ['JavaScript', 'HTML', 'CSS'],
            enrolled_count: 128,
            status: 'active',
            enrolled: false
          },
          {
            id: 2,
            title: 'React Native 移动开发',
            instructor: '李老师',
            description: '学习使用React Native开发跨平台移动应用，涵盖组件开发、导航、状态管理等核心技术。',
            level: 'advanced',
            category: 'programming',
            duration: 32,
            thumbnail: '/api/placeholder/300/200',
            required_skills: ['React', 'JavaScript', 'Mobile Development'],
            enrolled_count: 89,
            status: 'active',
            enrolled: false
          },
          {
            id: 3,
            title: 'UI/UX 设计基础',
            instructor: '王老师',
            description: '学习用户界面和用户体验设计的基础理论和实践技巧，掌握设计思维和工具使用。',
            level: 'beginner',
            category: 'design',
            duration: 18,
            thumbnail: '/api/placeholder/300/200',
            required_skills: ['Design Thinking', 'Figma', 'Sketch'],
            enrolled_count: 256,
            status: 'active',
            enrolled: false
          },
          {
            id: 4,
            title: 'Python 数据科学',
            instructor: '陈老师',
            description: '使用Python进行数据分析和机器学习，包含pandas、numpy、scikit-learn等核心库的使用。',
            level: 'intermediate',
            category: 'science',
            duration: 28,
            thumbnail: '/api/placeholder/300/200',
            required_skills: ['Python', 'Statistics', 'Mathematics'],
            enrolled_count: 167,
            status: 'active',
            enrolled: false
          },
          {
            id: 5,
            title: '商业计划书写作',
            instructor: '刘老师',
            description: '学习如何撰写专业的商业计划书，包含市场分析、财务预测、风险评估等关键内容。',
            level: 'beginner',
            category: 'business',
            duration: 16,
            thumbnail: '/api/placeholder/300/200',
            required_skills: ['Business Analysis', 'Financial Planning'],
            enrolled_count: 94,
            status: 'active',
            enrolled: false
          },
          {
            id: 6,
            title: '英语口语提升',
            instructor: 'Smith老师',
            description: '通过实用对话和场景模拟，快速提升英语口语表达能力，适合中级学习者。',
            level: 'intermediate',
            category: 'language',
            duration: 20,
            thumbnail: '/api/placeholder/300/200',
            required_skills: ['English Basics', 'Pronunciation'],
            enrolled_count: 203,
            status: 'active',
            enrolled: false
          }
        ]
        return createResponse(sampleCourses)
      }
      
  // 调用后端API获取所有课程（包含管理员新建的课程）
  const response = await remoteApiService.courses.getAllCourses()
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 获取公开可浏览课程，优先使用 /courses/available，不支持时回退到全部课程
  static async getPublicCourses() {
    try {
      // 直接使用全部课程，避免对不存在的 /available 发起失败请求
      const all = await remoteApiService.courses.getAllCourses()
      return createResponse(all)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getCourse(courseId) {
    try {
      if (COURSES_USE_LOCAL) {
        // 本地实现保持不变作为备用
        const courses = localStorageAPI.get('courses') || []
        const course = courses.find(c => c.id === courseId)
        if (course) {
          course.progress = course.progress || 0
          course.enrolledStudents = course.enrolledStudents || []
          course.chapters = course.chapters || []
          course.resources = course.resources || []
        }
        return createResponse(course)
      }
      
      // 调用后端API获取指定课程详情
      const response = await remoteApiService.courses.getCourseById(courseId)
      // 检查后端响应是否成功
      if (response && response.id) {
        return createResponse(response)
      } else {
        return createResponse(null, false, '课程不存在')
      }
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createCourse(courseData) {
    try {
      if (COURSES_USE_LOCAL) {
        // 本地实现保持不变作为备用
        const courses = localStorageAPI.get('courses') || []
        const newCourse = {
          id: generateId(),
          ...courseData,
          status: 'active',
          enrolledStudents: [],
          chapters: [],
          resources: [],
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        courses.push(newCourse)
        localStorageAPI.set('courses', courses)
        return createResponse(newCourse)
      }
      
      // 调用后端API创建新课程 - 需要管理员权限
      const response = await remoteApiService.courses.createCourse(courseData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateCourse(courseId, courseData) {
    try {
      if (COURSES_USE_LOCAL) {
        // 本地实现保持不变作为备用
        const courses = localStorageAPI.get('courses') || []
        const index = courses.findIndex(c => c.id === courseId)
        if (index !== -1) {
          courses[index] = { 
            ...courses[index], 
            ...courseData, 
            updated_at: new Date().toISOString() 
          }
          localStorageAPI.set('courses', courses)
          return createResponse(courses[index])
        }
        return createResponse(null, false, '课程不存在')
      }
      
      // 调用后端API更新指定课程 - 需要管理员权限
      const response = await remoteApiService.courses.updateCourse(courseId, courseData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 2. 课程推荐
  static async getRecommendedCourses(studentId, options = {}) {
    try {
      const { initial_k = 50, final_k = 3 } = options
  const response = await remoteApiService.recommend.recommendCourses(studentId, initial_k, final_k)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 3. 用户课程交互
  static async updateUserCourseProgress(courseId, progressData) {
    try {
  // progressData 包含 progress (0.0-1.0) 和 status ('registered', 'in_progress', 'completed', 'dropped')
  const response = await remoteApiService.users.updateMyCourseProgress(courseId, progressData)
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 4. 课程材料管理
  static async getCourseMaterials(courseId, typeFilter = null) {
    try {
  const response = await remoteApiService.courses.getMaterials(courseId, typeFilter)
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getCourseMaterial(courseId, materialId) {
    try {
  const response = await remoteApiService.courses.getMaterialById(courseId, materialId)
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createCourseMaterial(courseId, materialData, file = null) {
    try {
  // 若有文件，类型强制为 file，避免后端验证失败
  const payload = file ? { ...materialData, type: 'file', url: undefined } : { ...materialData }
  // 走课程API封装（内部已按 file/JSON 选择不同提交方式）
  const response = await remoteApiService.courses.createMaterial(courseId, payload, file)
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateCourseMaterial(courseId, materialId, materialData, file = null) {
    try {
  // 若有文件，类型强制为 file
  const payload = file ? { ...materialData, type: 'file', url: undefined } : { ...materialData }
  const response = await remoteApiService.courses.updateMaterial(courseId, materialId, payload, file)
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteCourseMaterial(courseId, materialId) {
    try {
  await remoteApiService.courses.deleteMaterial(courseId, materialId)
      return createResponse(true, true, '材料删除成功')
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 5. 课程统计
  static async getCourseCompletionCount(courseId) {
    try {
  const response = await remoteApiService.courses.getCompletionCount(courseId)
  return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 兼容性方法
  static async enrollCourse(courseId, studentId) {
    try {
      // 优先使用后端报名端点
      const response = await remoteApiService.courses.enrollCourse(courseId)
      // 后端直接返回报名信息，包装成统一格式
      return createResponse(response)
    } catch (error) {
      console.error('报名失败:', error)
      // 兼容旧后端：退化为设置当前用户课程状态为 registered
      try {
        const fallback = await remoteApiService.users.updateMyCourseProgress(courseId, { status: 'registered', progress: 0.0 })
        return createResponse(fallback)
      } catch (e2) {
        return createResponse(null, false, error.message || e2.message)
      }
    }
  }

  // ========== 笔记相关API ==========
  static async getNotes(params = {}) {
    try {
      const response = await remoteApiService.notes.getAllNotes(params)
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
    try {
      if (COURSES_USE_LOCAL) {
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
      const response = await remoteApiService.dashboard.getCourses(statusFilter)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
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

  static async getKnowledgeBase(kbId) {
    try {
      const response = await remoteApiService.knowledgeBases.getKnowledgeBaseById(kbId)
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

  static async updateKnowledgeBase(kbId, kbData) {
    try {
      const response = await remoteApiService.knowledgeBases.updateKnowledgeBase(kbId, kbData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteKnowledgeBase(kbId) {
    try {
      const response = await remoteApiService.knowledgeBases.deleteKnowledgeBase(kbId)
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

  // ========== AI对话管理API ==========
  static async getAIConversations(limit = 10, offset = 0) {
    try {
      const response = await remoteApiService.userMe.getAIConversations(limit, offset)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getAIConversation(conversationId) {
    try {
      const response = await remoteApiService.userMe.getAIConversation(conversationId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getAIConversationMessages(conversationId, limit = 50, offset = 0) {
    try {
      const response = await remoteApiService.userMe.getAIConversationMessages(conversationId, limit, offset)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateAIConversationTitle(conversationId, title) {
    try {
      const response = await remoteApiService.userMe.updateAIConversationTitle(conversationId, title)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteAIConversation(conversationId) {
    try {
      const response = await remoteApiService.userMe.deleteAIConversation(conversationId)
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
      const pickArrayDeep = (obj) => {
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        const candidates = [
          obj.data,
          obj.results,
          obj.items,
          obj.rooms,
          obj.room_list,
          obj.chatrooms,
          obj.chat_rooms
        ]
        for (const c of candidates) if (Array.isArray(c)) return c
        // 再深入一层 data
        if (obj.data && typeof obj.data === 'object') {
          const deep = pickArrayDeep(obj.data)
          if (Array.isArray(deep)) return deep
        }
        return []
      }
      const list = pickArrayDeep(response)
      return createResponse(list)
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

  static async getChatRoom(roomId) {
    try {
      const response = await remoteApiService.chatRooms.getChatRoomById(roomId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateChatRoom(roomId, roomData) {
    try {
      const response = await remoteApiService.chatRooms.updateChatRoom(roomId, roomData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteChatRoom(roomId) {
    try {
      const response = await remoteApiService.chatRooms.deleteChatRoom(roomId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getChatRoomMembers(roomId) {
    try {
      const response = await remoteApiService.chatRooms.getMembers(roomId)
      const list = (function pick(obj){
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        if (Array.isArray(obj.data)) return obj.data
        if (Array.isArray(obj.results)) return obj.results
        if (obj.data && typeof obj.data === 'object') return pick(obj.data)
        return []
      })(response)
      return createResponse(list)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async setChatRoomMemberRole(roomId, memberId, role) {
    try {
      const response = await remoteApiService.chatRooms.setMemberRole(roomId, memberId, role)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async removeChatRoomMember(roomId, memberId) {
    try {
      const response = await remoteApiService.chatRooms.removeMember(roomId, memberId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createJoinRequest(roomId, requestData) {
    try {
      const response = await remoteApiService.chatRooms.createJoinRequest(roomId, requestData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getJoinRequests(roomId, statusFilter = null) {
    try {
      const response = await remoteApiService.chatRooms.getJoinRequests(roomId, statusFilter)
      const list = (function pick(obj){
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        if (Array.isArray(obj.data)) return obj.data
        if (Array.isArray(obj.results)) return obj.results
        if (obj.data && typeof obj.data === 'object') return pick(obj.data)
        return []
      })(response)
      return createResponse(list)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async processJoinRequest(requestId, status) {
    try {
      const response = await remoteApiService.chatRooms.processJoinRequest(requestId, status)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getChatRoomMessages(roomId, limit = 50, offset = 0) {
    try {
      const response = await remoteApiService.chatRooms.getMessages(roomId, limit, offset)
      const list = (function pick(obj){
        if (Array.isArray(obj)) return obj
        if (!obj || typeof obj !== 'object') return []
        if (Array.isArray(obj.data)) return obj.data
        if (Array.isArray(obj.results)) return obj.results
        if (obj.data && typeof obj.data === 'object') return pick(obj.data)
        return []
      })(response)
      return createResponse(list)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async sendChatRoomMessage(roomId, messageData) {
    try {
      const response = await remoteApiService.chatRooms.sendMessage(roomId, messageData)
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

  static async updateForumTopic(topicId, topicData) {
    try {
      const response = await remoteApiService.forum.updateTopic(topicId, topicData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteForumTopic(topicId) {
    try {
      const response = await remoteApiService.forum.deleteTopic(topicId)
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

  static async updateForumComment(commentId, commentData) {
    try {
      const response = await remoteApiService.forum.updateComment(commentId, commentData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteForumComment(commentId) {
    try {
      const response = await remoteApiService.forum.deleteComment(commentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async likeForumTopic(topicId) {
    try {
      const response = await remoteApiService.forum.likeTopic(topicId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async unlikeForumTopic(topicId) {
    try {
      const response = await remoteApiService.forum.unlikeTopic(topicId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async likeForumComment(commentId) {
    try {
      const response = await remoteApiService.forum.likeComment(commentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async unlikeForumComment(commentId) {
    try {
      const response = await remoteApiService.forum.unlikeComment(commentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async followUser(userId) {
    try {
      const response = await remoteApiService.forum.followUser(userId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async unfollowUser(userId) {
    try {
      const response = await remoteApiService.forum.unfollowUser(userId)
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

  static async getKnowledgeDocumentDetail(kbId, documentId) {
    try {
      const response = await remoteApiService.knowledgeBases.getDocumentDetail(kbId, documentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteKnowledgeDocument(kbId, documentId) {
    try {
      const response = await remoteApiService.knowledgeBases.deleteDocument(kbId, documentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // DEBUG: 文档原文与分块
  static async getKnowledgeDocumentContent(kbId, documentId) {
    try {
      const response = await remoteApiService.knowledgeBases.getDocumentContent(kbId, documentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getKnowledgeDocumentChunks(kbId, documentId) {
    try {
      const response = await remoteApiService.knowledgeBases.getDocumentChunks(kbId, documentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 知识文章（Articles）相关API ==========
  static async getKnowledgeBaseArticles(kbId) {
    try {
      const response = await remoteApiService.knowledgeBases.getArticles(kbId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createKnowledgeBaseArticle(kbId, articleData) {
    try {
      const response = await remoteApiService.knowledgeBases.createArticle(kbId, articleData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getArticle(articleId) {
    try {
      const response = await remoteApiService.articles.getArticleById(articleId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateArticle(articleId, articleData) {
    try {
      const response = await remoteApiService.articles.updateArticle(articleId, articleData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteArticle(articleId) {
    try {
      const response = await remoteApiService.articles.deleteArticle(articleId)
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

  // ========== 文件夹（Folders）相关API ==========
  static async getFolders(parentId = null) {
    try {
      const response = await remoteApiService.folders.getAllFolders(parentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getFolder(folderId) {
    try {
      const response = await remoteApiService.folders.getFolderById(folderId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createFolder(folderData) {
    try {
      const response = await remoteApiService.folders.createFolder(folderData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateFolder(folderId, folderData) {
    try {
      const response = await remoteApiService.folders.updateFolder(folderId, folderData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteFolder(folderId, options = {}) {
    try {
      const response = await remoteApiService.folders.deleteFolder(folderId, options)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // ========== 收藏内容（Collections）相关API ==========
  static async getCollections(options = {}) {
    try {
      const response = await remoteApiService.collections.getAllCollections({
        folderId: options.folderId,
        typeFilter: options.typeFilter,
        tagFilter: options.tagFilter,
        isStarred: options.isStarred,
        statusFilter: options.statusFilter
      })
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async getCollection(contentId) {
    try {
      const response = await remoteApiService.collections.getCollectionById(contentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async createCollection(collectionData) {
    try {
      const response = await remoteApiService.collections.createCollection(collectionData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async updateCollection(contentId, collectionData) {
    try {
      const response = await remoteApiService.collections.updateCollection(contentId, collectionData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  static async deleteCollection(contentId) {
    try {
      const response = await remoteApiService.collections.deleteCollection(contentId)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }

  // 快速收藏平台内部内容
  static async addPlatformContentToCollection(collectionData) {
    try {
      const response = await remoteApiService.collections.addFromPlatform(collectionData)
      return createResponse(response)
    } catch (error) {
      return createResponse(null, false, error.message)
    }
  }
}

// 在应用启动时初始化数据
ApiService.initialize()

// 导出本地存储API工具
export { localStorageAPI }

// 默认导出 ApiService (因为类已经用 export class 导出了)
export default ApiService
