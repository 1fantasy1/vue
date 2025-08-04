// 数据库服务层 - 管理所有数据相关的API调用
import { api } from './api.js'

// 用户相关数据库操作
export const userService = {
  // 获取用户信息
  async getProfile(userId) {
    return await api.get(`/users/${userId}`)
  },

  // 更新用户信息
  async updateProfile(userId, userData) {
    return await api.put(`/users/${userId}`, userData)
  },

  // 用户登录
  async login(credentials) {
    return await api.post('/auth/login', credentials)
  },

  // 用户注册
  async register(userData) {
    return await api.post('/auth/register', userData)
  }
}

// 课程相关数据库操作
export const courseService = {
  // 获取课程列表
  async getCourses(params = {}) {
    return await api.get('/courses', { params })
  },

  // 获取课程详情
  async getCourseDetail(courseId) {
    return await api.get(`/courses/${courseId}`)
  },

  // 创建课程
  async createCourse(courseData) {
    return await api.post('/courses', courseData)
  },

  // 更新课程
  async updateCourse(courseId, courseData) {
    return await api.put(`/courses/${courseId}`, courseData)
  },

  // 删除课程
  async deleteCourse(courseId) {
    return await api.delete(`/courses/${courseId}`)
  }
}

// 笔记相关数据库操作
export const noteService = {
  // 获取用户笔记
  async getUserNotes(userId, params = {}) {
    return await api.get(`/users/${userId}/notes`, { params })
  },

  // 创建笔记
  async createNote(noteData) {
    return await api.post('/notes', noteData)
  },

  // 更新笔记
  async updateNote(noteId, noteData) {
    return await api.put(`/notes/${noteId}`, noteData)
  },

  // 删除笔记
  async deleteNote(noteId) {
    return await api.delete(`/notes/${noteId}`)
  },

  // 搜索笔记
  async searchNotes(query, params = {}) {
    return await api.get('/notes/search', { 
      params: { q: query, ...params }
    })
  }
}

// 知识库相关数据库操作
export const knowledgeService = {
  // 获取知识库文档
  async getDocuments(params = {}) {
    return await api.get('/knowledge/documents', { params })
  },

  // 上传文档
  async uploadDocument(formData) {
    return await api.post('/knowledge/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // AI问答
  async askQuestion(question, context = {}) {
    return await api.post('/knowledge/qa', {
      question,
      context
    })
  },

  // 搜索文档
  async searchDocuments(query, filters = {}) {
    return await api.get('/knowledge/search', {
      params: { q: query, ...filters }
    })
  },

  // 获取问答历史
  async getQAHistory(params = {}) {
    return await api.get('/knowledge/qa/history', { params })
  },

  // 文档评分
  async rateAnswer(qaId, rating, feedback = '') {
    return await api.post(`/knowledge/qa/${qaId}/rate`, {
      rating,
      feedback
    })
  },

  // 获取文档详情
  async getDocumentDetail(documentId) {
    return await api.get(`/knowledge/documents/${documentId}`)
  },

  // 删除文档
  async deleteDocument(documentId) {
    return await api.delete(`/knowledge/documents/${documentId}`)
  }
}

// 项目相关数据库操作
export const projectService = {
  // 获取项目列表
  async getProjects(params = {}) {
    return await api.get('/projects', { params })
  },

  // 获取项目详情
  async getProjectDetail(projectId) {
    return await api.get(`/projects/${projectId}`)
  },

  // 创建项目
  async createProject(projectData) {
    return await api.post('/projects', projectData)
  },

  // 更新项目
  async updateProject(projectId, projectData) {
    return await api.put(`/projects/${projectId}`, projectData)
  },

  // 获取项目推荐
  async getRecommendations(userId, preferences = {}) {
    return await api.post('/projects/recommendations', {
      userId,
      preferences
    })
  }
}

// 聊天室相关数据库操作
export const chatService = {
  // 获取聊天室列表
  async getRooms() {
    return await api.get('/chat/rooms')
  },

  // 获取聊天消息
  async getMessages(roomId, params = {}) {
    return await api.get(`/chat/rooms/${roomId}/messages`, { params })
  },

  // 发送消息
  async sendMessage(roomId, message) {
    return await api.post(`/chat/rooms/${roomId}/messages`, message)
  }
}

// 通用数据库操作工具
export const dbUtils = {
  // 批量操作
  async batchOperation(operations) {
    return await api.post('/batch', { operations })
  },

  // 数据统计
  async getStats(type, params = {}) {
    return await api.get(`/stats/${type}`, { params })
  },

  // 搜索功能
  async globalSearch(query, filters = {}) {
    return await api.get('/search', {
      params: { q: query, ...filters }
    })
  }
}
