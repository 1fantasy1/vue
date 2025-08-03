import axios from 'axios'

// 配置基础API URL - 在生产环境中应该从环境变量获取
const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 可以在这里添加认证token等
    return config
  },
  error => {
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
