import axios from 'axios'
import { config } from '@/config'

// 从配置文件获取API URL
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加认证token支持
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 添加认证token
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求时间戳（防止缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API服务类
export class ApiService {
  // 学生相关API
  static async getStudent(studentId) {
    return await api.get(`/student/${studentId}`)
  }

  static async updateStudent(studentData) {
    return await api.post('/student/update', studentData)
  }

  // 项目推荐API
  static async getProjectRecommendations(studentId) {
    return await api.get(`/recommend_projects/${studentId}`)
  }

  static async getStudentRecommendations(projectId) {
    return await api.get(`/recommend_students/${projectId}`)
  }

  // 项目相关API
  static async getProject(projectId) {
    return await api.get(`/project/${projectId}`)
  }

  static async createProject(projectData) {
    return await api.post('/project/create', projectData)
  }

  // 智能搜索API
  static async intelligentSearch(query) {
    return await api.post('/search', { query })
  }

  // RAG相关API
  static async uploadDocument(file) {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post('/upload_document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static async askQuestion(question, documentId = null) {
    return await api.post('/ask_question', {
      question,
      document_id: documentId
    })
  }

  // 健康检查
  static async healthCheck() {
    return await api.get('/health')
  }
}

export default api
