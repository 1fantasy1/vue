// 鸿庆书云创新协作平台API服务
import httpClient from './httpClient.js'
import { config } from '@/config/index.js'

// 基础API类
class BaseAPI {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  async request(method, url, data = null, params = null) {
    try {
      const config = {
        method,
        url: `${this.endpoint}${url}`,
        ...(data && { data }),
        ...(params && { params })
      }
      
      const response = await httpClient(config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  handleError(error) {
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        // 处理验证错误
        const validationErrors = error.response.data.detail
          .map(err => {
            const loc = Array.isArray(err.loc) ? err.loc.join('.') : err.loc || 'field'
            return `${loc}: ${err.msg}`
          })
          .join('; ')
        return new Error(`请求参数错误: ${validationErrors}`)
      } else {
        return new Error(error.response.data.detail)
      }
    }
    return error
  }
}

// 认证API
export class AuthAPI extends BaseAPI {
  constructor() {
    super('')
  }

  async register(userData) {
    return await this.request('POST', '/register', userData)
  }

  async login(credentials) {
    // OAuth2 token endpoint 需要 application/x-www-form-urlencoded 格式
    const params = new URLSearchParams()
    
    // 支持邮箱和手机号登录
    if (credentials.email) {
      params.append('username', credentials.email)
    } else if (credentials.phone_number) {  // 修正字段名为 phone_number
      params.append('username', credentials.phone_number)
    } else {
      throw new Error('请提供邮箱或手机号')
    }
    
    params.append('password', credentials.password)
    
    try {
      const config = {
        method: 'POST',
        url: '/token',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      
      const response = await httpClient(config)
      const data = response.data
      
      // 如果登录成功，保存token
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
      
      return data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('currentUser')
  }

  async sendSmsCode(phoneData) {
    return await this.request('POST', '/send-sms-code', phoneData)
  }
}

// 用户API
export class UsersAPI extends BaseAPI {
  constructor() {
    super('/users')
  }

  async getMe() {
    return await this.request('GET', '/me')
  }

  async updateMe(userData) {
    return await this.request('PUT', '/me', userData)
  }

  async updateLLMConfig(config) {
    return await this.request('PUT', '/me/llm-config', config)
  }

  // 更新当前用户的课程进度/状态
  async updateMyCourseProgress(courseId, progressData) {
    return await this.request('PUT', `/me/courses/${courseId}`, progressData)
  }

  // 获取当前用户的课程列表（只返回用户已关联/报名的课程条目）
  async getMyCourses(statusFilter = null) {
    return await this.request('GET', '/me/courses', null,
      statusFilter ? { status_filter: statusFilter } : null
    )
  }
}

// 学生API
export class StudentsAPI extends BaseAPI {
  constructor() {
    super('/students')
  }

  async getAllStudents() {
    return await this.request('GET', '/')
  }

  async getStudentById(studentId) {
    return await this.request('GET', `/${studentId}`)
  }
}

// 项目API
export class ProjectsAPI extends BaseAPI {
  constructor() {
    super('/projects')
  }

  // 3.4.2 获取所有项目列表
  async getAllProjects() {
    return await this.request('GET', '/')
  }

  // 3.4.3 获取指定项目详情
  async getProjectById(projectId) {
    return await this.request('GET', `/${projectId}`)
  }

  // 3.4.1 创建新项目
  async createProject(projectData) {
    // 后端要求在 body 中提供 `project_data_json` 字段
    // 使用 multipart/form-data 以最大兼容性
    const formData = new FormData()
    // 确保传入字符串，避免 422: Field required
    formData.append('project_data_json', JSON.stringify(projectData || {}))
    try {
      const response = await httpClient.post(`/projects/`, formData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 3.4.4 更新指定项目
  async updateProject(projectId, projectData) {
    // 后端校验报错提示缺少 `project_data_json`，改为表单提交该字段
    const formData = new FormData()
    formData.append('project_data_json', JSON.stringify(projectData || {}))
    try {
      const response = await httpClient.put(`/projects/${projectId}`, formData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 3.4.5 删除指定项目
  async deleteProject(projectId) {
    return await this.request('DELETE', `/${projectId}`)
  }

  // 3.4.6 学生申请加入项目
  async applyToProject(projectId, applicationData) {
    return await this.request('POST', `/${projectId}/apply`, applicationData)
  }

  // 3.4.7 获取项目所有申请列表
  async getProjectApplications(projectId, statusFilter = null) {
    const params = statusFilter ? { status_filter: statusFilter } : null
    return await this.request('GET', `/${projectId}/applications`, null, params)
  }

  // 3.4.8 处理项目申请
  async processProjectApplication(applicationId, processData) {
    return await this.request('POST', `/applications/${applicationId}/process`, processData)
  }

  // 3.4.9 获取项目成员列表
  async getProjectMembers(projectId) {
    return await this.request('GET', `/${projectId}/members`)
  }

  // 5.2.3 为指定项目推荐学生
  async matchStudents(projectId, initialK = 50, finalK = 3) {
    return await this.request('GET', `/${projectId}/match-students`, null, {
      initial_k: initialK,
      final_k: finalK
    })
  }
}

// 课程API
export class CoursesAPI extends BaseAPI {
  constructor() {
    super('/courses')
  }

  async getAllCourses() {
    return await this.request('GET', '/')
  }

  async getAvailableCourses() {
    return await this.request('GET', '/available')
  }

  async getCourseById(courseId) {
    return await this.request('GET', `/${courseId}`)
  }

  async createCourse(courseData) {
    return await this.request('POST', '/', courseData)
  }

  async updateCourse(courseId, courseData) {
    return await this.request('PUT', `/${courseId}`, courseData)
  }

  // 报名课程：当前认证用户报名指定课程
  async enrollCourse(courseId) {
    return await this.request('POST', `/${courseId}/enroll`)
  }

  async getMaterials(courseId, typeFilter = null) {
    return await this.request('GET', `/${courseId}/materials/`, null,
      typeFilter ? { type_filter: typeFilter } : null
    )
  }

  async getMaterialById(courseId, materialId) {
    return await this.request('GET', `/${courseId}/materials/${materialId}`)
  }

  async createMaterial(courseId, materialData, file = null) {
    // 统一构造查询参数（仅包含有值的字段）
    const q = {}
    if (materialData?.title) q.title = materialData.title
    if (materialData?.type) q.type = materialData.type
    if (materialData?.url) q.url = materialData.url
    if (materialData?.content) q.content = materialData.content

    // 后端总是期望 multipart/form-data 格式，即使没有文件也要发送空的 file 字段
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    } else {
      // 发送空的 file 字段，匹配后端期望的格式
      formData.append('file', new Blob([]), '')
    }
    
    try {
      const response = await httpClient.post(`/courses/${courseId}/materials/`, formData, {
        // 不要手动设置 Content-Type，交给浏览器自动带上 boundary
        params: q
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateMaterial(courseId, materialId, materialData, file = null) {
    const q = {}
    if (materialData?.title) q.title = materialData.title
    if (materialData?.type) q.type = materialData.type
    if (materialData?.url) q.url = materialData.url
    if (materialData?.content) q.content = materialData.content

    // 后端总是期望 multipart/form-data 格式
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    } else {
      // 发送空的 file 字段
      formData.append('file', new Blob([]), '')
    }
    
    try {
      const response = await httpClient.put(`/courses/${courseId}/materials/${materialId}`, formData, {
        params: q
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteMaterial(courseId, materialId) {
    return await this.request('DELETE', `/${courseId}/materials/${materialId}`)
  }

  async getCompletionCount(courseId) {
    return await this.request('GET', `/${courseId}/completed-by-count`)
  }
}

// 推荐API
export class RecommendAPI extends BaseAPI {
  constructor() {
    super('/recommend')
  }

  async recommendProjects(studentId, initialK = 50, finalK = 3) {
    return await this.request('GET', `/projects/${studentId}`, null, {
      initial_k: initialK,
      final_k: finalK
    })
  }

  async recommendCourses(studentId, initialK = 50, finalK = 3) {
    return await this.request('GET', `/courses/${studentId}`, null, {
      initial_k: initialK,
      final_k: finalK
    })
  }
}

// 工作台API
export class DashboardAPI extends BaseAPI {
  constructor() {
    super('/dashboard')
  }

  async getSummary() {
    return await this.request('GET', '/summary')
  }

  async getProjects(statusFilter = null) {
    return await this.request('GET', '/projects', null, 
      statusFilter ? { status_filter: statusFilter } : null
    )
  }

  async getCourses(statusFilter = null) {
    return await this.request('GET', '/courses', null,
      statusFilter ? { status_filter: statusFilter } : null
    )
  }
}

// 笔记API
export class NotesAPI extends BaseAPI {
  constructor() {
    super('/notes')
  }

  // 获取当前用户所有笔记 - 支持多种过滤参数
  async getAllNotes(params = {}) {
    const queryParams = {}
    
    // 支持的查询参数
    if (params.note_type) queryParams.note_type = params.note_type
    if (params.course_id) queryParams.course_id = params.course_id
    if (params.chapter) queryParams.chapter = params.chapter
    if (params.folder_id !== undefined) queryParams.folder_id = params.folder_id
    if (params.tags) queryParams.tags = params.tags
    if (params.limit) queryParams.limit = params.limit
    if (params.offset) queryParams.offset = params.offset
    
    return await this.request('GET', '/', null, queryParams)
  }

  async getNoteById(noteId) {
    return await this.request('GET', `/${noteId}`)
  }

  // 创建新笔记 - 支持文件上传
  async createNote(noteData) {
    // 如果包含文件，使用FormData
    if (noteData.file || noteData instanceof FormData) {
      let formData = noteData instanceof FormData ? noteData : new FormData()
      
      if (!(noteData instanceof FormData)) {
        // 添加所有字段到FormData，但文件上传时排除 media_type
        Object.keys(noteData).forEach(key => {
          if (noteData[key] !== undefined && noteData[key] !== null) {
            // 🚨 重要修正：文件上传时不设置 media_type，让后端自动确定
            if (key === 'media_type' && noteData.file) {
              return // 跳过 media_type 字段
            }
            formData.append(key, noteData[key])
          }
        })
      }
      
      try {
        const config = {
          method: 'POST',
          url: `${this.endpoint}/`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        
        const response = await httpClient(config)
        return response.data
      } catch (error) {
        throw this.handleError(error)
      }
    } else {
      // JSON请求（纯文本或外部媒体链接）
      return await this.request('POST', '/', noteData)
    }
  }

  // 更新笔记 - 支持文件上传
  async updateNote(noteId, noteData) {
    // 如果包含文件，使用FormData
    if (noteData.file || noteData instanceof FormData) {
      let formData = noteData instanceof FormData ? noteData : new FormData()
      
      if (!(noteData instanceof FormData)) {
        // 添加所有字段到FormData，但文件上传时排除 media_type
        Object.keys(noteData).forEach(key => {
          if (noteData[key] !== undefined && noteData[key] !== null) {
            // 🚨 重要修正：文件上传时不设置 media_type，让后端自动确定
            if (key === 'media_type' && noteData.file) {
              return // 跳过 media_type 字段
            }
            formData.append(key, noteData[key])
          }
        })
      }
      
      try {
        const config = {
          method: 'PUT',
          url: `${this.endpoint}/${noteId}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        
        const response = await httpClient(config)
        return response.data
      } catch (error) {
        throw this.handleError(error)
      }
    } else {
      // JSON请求（纯文本或外部媒体链接）
      return await this.request('PUT', `/${noteId}`, noteData)
    }
  }

  async deleteNote(noteId) {
    return await this.request('DELETE', `/${noteId}`)
  }
}

// 知识库API
export class KnowledgeBasesAPI extends BaseAPI {
  constructor() {
    super('/knowledge-bases')
  }

  async getAllKnowledgeBases() {
    return await this.request('GET', '/')
  }

  async getKnowledgeBaseById(kbId) {
    return await this.request('GET', `/${kbId}`)
  }

  async createKnowledgeBase(kbData) {
    return await this.request('POST', '/', kbData)
  }

  async updateKnowledgeBase(kbId, kbData) {
    return await this.request('PUT', `/${kbId}`, kbData)
  }

  async deleteKnowledgeBase(kbId) {
    return await this.request('DELETE', `/${kbId}`)
  }

  // 知识库文章
  async getArticles(kbId) {
    return await this.request('GET', `/${kbId}/articles/`)
  }

  async createArticle(kbId, articleData) {
    return await this.request('POST', `/${kbId}/articles/`, articleData)
  }

  // 知识库文档
  async getDocuments(kbId, statusFilter = null) {
    return await this.request('GET', `/${kbId}/documents/`, null,
      statusFilter ? { status_filter: statusFilter } : null
    )
  }

  async uploadDocument(kbId, file) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await httpClient.post(`/knowledge-bases/${kbId}/documents/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getDocumentDetail(kbId, documentId) {
    return await this.request('GET', `/${kbId}/documents/${documentId}`)
  }

  async deleteDocument(kbId, documentId) {
    return await this.request('DELETE', `/${kbId}/documents/${documentId}`)
  }

  // DEBUG: 文档原文内容
  async getDocumentContent(kbId, documentId) {
    return await this.request('GET', `/${kbId}/documents/${documentId}/content`)
  }

  // DEBUG: 文档分块
  async getDocumentChunks(kbId, documentId) {
    return await this.request('GET', `/${kbId}/documents/${documentId}/chunks`)
  }
}

// 文章API
export class ArticlesAPI extends BaseAPI {
  constructor() {
    super('/articles')
  }

  async getArticleById(articleId) {
    return await this.request('GET', `/${articleId}`)
  }

  async updateArticle(articleId, articleData) {
    return await this.request('PUT', `/${articleId}`, articleData)
  }

  async deleteArticle(articleId) {
    return await this.request('DELETE', `/${articleId}`)
  }
}

// AI API
export class AIAPI extends BaseAPI {
  constructor() {
    super('/ai')
  }

  async qa(query, options = {}) {
    // 根据API文档，使用 multipart/form-data 格式
    const formData = new FormData()
    
    // 必需字段
    formData.append('query', query)
    
    // 可选字段 - 只有在有值时才添加
    if (options.conversationId) {
      formData.append('conversation_id', options.conversationId.toString())
    }
    
    if (options.kbIds && Array.isArray(options.kbIds) && options.kbIds.length > 0) {
      // 后端要求 *_json 字段名
      formData.append('kb_ids_json', JSON.stringify(options.kbIds))
    }
    
    if (options.noteIds && Array.isArray(options.noteIds) && options.noteIds.length > 0) {
      // 后端要求 *_json 字段名
      formData.append('note_ids_json', JSON.stringify(options.noteIds))
    }
    
    if (typeof options.useTools === 'boolean') {
      formData.append('use_tools', options.useTools.toString())
    }
    
    if (options.preferredTools !== null && options.preferredTools !== undefined) {
      // 后端字段名为 preferred_tools_json；支持字符串 "all" 或 JSON 数组
      if (typeof options.preferredTools === 'string') {
        formData.append('preferred_tools_json', options.preferredTools)
      } else if (Array.isArray(options.preferredTools) && options.preferredTools.length > 0) {
        formData.append('preferred_tools_json', JSON.stringify(options.preferredTools))
      }
    }
    
    if (options.llmModelId) {
      formData.append('llm_model_id', options.llmModelId)
    }
    
    if (options.uploadedFile) {
      formData.append('uploaded_file', options.uploadedFile)
    }
    
    try {
      const requestConfig = {
        method: 'POST',
        url: `${this.endpoint}/qa`,
        data: formData,
        timeout: config.api.aiTimeout || 120000 // 使用AI专用超时时间
      }
      
      const response = await httpClient(requestConfig)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async webSearch(query, engineConfigId, limit = 5) {
    try {
      const requestConfig = {
        method: 'POST',
        url: `${this.endpoint}/web-search`,
        data: {
          query,
          engine_config_id: engineConfigId,
          limit
        },
        timeout: config.api.aiTimeout || 120000 // 使用AI专用超时时间
      }
      
      const response = await httpClient(requestConfig)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

// 用户API - 处理用户相关的接口
export class UserAPI extends BaseAPI {
  constructor() {
    super('/users/me')
  }

  // AI对话管理相关API
  async getAIConversations(limit = 10, offset = 0) {
    return await this.request('GET', '/ai-conversations', null, { limit, offset })
  }

  async getAIConversation(conversationId) {
    return await this.request('GET', `/ai-conversations/${conversationId}`)
  }

  async getAIConversationMessages(conversationId, limit = 50, offset = 0) {
    return await this.request('GET', `/ai-conversations/${conversationId}/messages`, null, { limit, offset })
  }

  async updateAIConversationTitle(conversationId, title) {
    return await this.request('PUT', `/ai-conversations/${conversationId}`, { title })
  }

  async deleteAIConversation(conversationId) {
    return await this.request('DELETE', `/ai-conversations/${conversationId}`)
  }
}

// 搜索API
export class SearchAPI extends BaseAPI {
  constructor() {
    super('/search')
  }

  async semanticSearch(query, itemTypes = null, limit = 10) {
    return await this.request('POST', '/semantic', {
      query,
      item_types: itemTypes,
      limit
    })
  }
}

// 随手记录API
export class DailyRecordsAPI extends BaseAPI {
  constructor() {
    super('/daily-records')
  }

  async getAllRecords(mood = null, tag = null) {
    const params = {}
    if (mood) params.mood = mood
    if (tag) params.tag = tag
    
    return await this.request('GET', '/', null, Object.keys(params).length ? params : null)
  }

  async getRecordById(recordId) {
    return await this.request('GET', `/${recordId}`)
  }

  async createRecord(recordData) {
    return await this.request('POST', '/', recordData)
  }

  async updateRecord(recordId, recordData) {
    return await this.request('PUT', `/${recordId}`, recordData)
  }

  async deleteRecord(recordId) {
    return await this.request('DELETE', `/${recordId}`)
  }
}

// 文件夹API
export class FoldersAPI extends BaseAPI {
  constructor() {
    super('/folders')
  }

  async getAllFolders(parentId = null) {
    return await this.request('GET', '/', null,
      parentId ? { parent_id: parentId } : null
    )
  }

  async getFolderById(folderId) {
    return await this.request('GET', `/${folderId}`)
  }

  async createFolder(folderData) {
    return await this.request('POST', '/', folderData)
  }

  async updateFolder(folderId, folderData) {
    return await this.request('PUT', `/${folderId}`, folderData)
  }

  async deleteFolder(folderId, options = {}) {
    const params = {}
    if (options.cascade) params.cascade = true
    if (options.recursive) params.recursive = true
    if (options.force) params.force = true
    return await this.request('DELETE', `/${folderId}`, null, Object.keys(params).length ? params : null)
  }
}

// 收藏内容API
export class CollectionsAPI extends BaseAPI {
  constructor() {
    super('/collections')
  }

  async getAllCollections(options = {}) {
    const params = {}
    if (options.folderId !== undefined) params.folder_id = options.folderId
    if (options.typeFilter) params.type_filter = options.typeFilter
    if (options.tagFilter) params.tag_filter = options.tagFilter
    if (options.isStarred !== undefined) params.is_starred = options.isStarred
    if (options.statusFilter) params.status_filter = options.statusFilter
    
    return await this.request('GET', '/', null, Object.keys(params).length ? params : null)
  }

  async getCollectionById(contentId) {
    return await this.request('GET', `/${contentId}`)
  }

  async createCollection(collectionData) {
    return await this.request('POST', '/', collectionData)
  }

  async updateCollection(contentId, collectionData) {
    return await this.request('PUT', `/${contentId}`, collectionData)
  }

  async deleteCollection(contentId) {
    return await this.request('DELETE', `/${contentId}`)
  }

  // 快速收藏平台内部内容
  async addFromPlatform(collectionData) {
    return await this.request('POST', '/add-from-platform', collectionData)
  }
}

// 聊天室API
export class ChatRoomsAPI extends BaseAPI {
  constructor() {
    // 不同端点前缀混用：读取走 /chatrooms，管理/创建走 /chat-rooms
    super('/chatrooms')
    this.baseRooms = '/chatrooms'
    this.baseMgmt = '/chat-rooms'
  }

  async requestTo(base, method, path, data = null, params = null) {
    try {
      const cfg = { method, url: `${base}${path}` }
      if (data) cfg.data = data
      if (params) cfg.params = params
      const resp = await httpClient(cfg)
      return resp.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 列表/详情/更新/删除：/chatrooms
  async getAllChatRooms(roomType = null) {
    return await this.requestTo(this.baseRooms, 'GET', '/', null,
      roomType ? { room_type: roomType } : null
    )
  }

  async getChatRoomById(roomId) {
    return await this.requestTo(this.baseRooms, 'GET', `/${roomId}`)
  }

  async updateChatRoom(roomId, roomData) {
  return await this.requestTo(this.baseRooms, 'PUT', `/${roomId}/`, roomData)
  }

  async deleteChatRoom(roomId) {
    return await this.requestTo(this.baseRooms, 'DELETE', `/${roomId}`)
  }

  async getMessages(roomId, limit = 50, offset = 0) {
    return await this.requestTo(this.baseRooms, 'GET', `/${roomId}/messages/`, null, { limit, offset })
  }

  async sendMessage(roomId, messageData) {
    // 后端消息创建端点期望表单数据（兼容文本与文件消息），避免 JSON 导致 content_text 解析为 None
    const formData = new FormData()
    if (messageData && typeof messageData === 'object') {
      if (messageData.file instanceof Blob) {
        formData.append('file', messageData.file)
      }
      if (messageData.content_text) {
        formData.append('content_text', String(messageData.content_text))
      }
      if (messageData.media_url) {
        formData.append('media_url', String(messageData.media_url))
      }
      if (messageData.message_type) {
        formData.append('message_type', String(messageData.message_type))
      }
    }
    // 确保 multipart 不为空，防止某些服务器拒绝空表单
    if (![...formData.keys()].length) formData.append('noop', '1')

    try {
      const resp = await httpClient.post(`${this.baseRooms}/${roomId}/messages/`, formData)
      return resp.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getMembers(roomId) {
    return await this.requestTo(this.baseRooms, 'GET', `/${roomId}/members`)
  }

  // 创建/角色/入群申请：/chat-rooms
  async createChatRoom(roomData) {
    return await this.requestTo(this.baseMgmt, 'POST', '/', roomData)
  }

  async setMemberRole(roomId, memberId, role) {
    return await this.requestTo(this.baseMgmt, 'PUT', `/${roomId}/members/${memberId}/set-role`, { role })
  }

  async removeMember(roomId, memberId) {
    return await this.requestTo(this.baseMgmt, 'DELETE', `/${roomId}/members/${memberId}`)
  }

  async createJoinRequest(roomId, requestData) {
    return await this.requestTo(this.baseMgmt, 'POST', `/${roomId}/join-request`, requestData)
  }

  async getJoinRequests(roomId, statusFilter = null) {
    const params = statusFilter ? { status_filter: statusFilter } : null
    return await this.requestTo(this.baseMgmt, 'GET', `/${roomId}/join-requests`, null, params)
  }

  async processJoinRequest(requestId, status) {
    return await this.requestTo(this.baseMgmt, 'POST', `/join-requests/${requestId}/process`, { status })
  }
}

// 论坛API
export class ForumAPI extends BaseAPI {
  constructor() {
    super('/forum')
  }

  // 将普通对象转换为 FormData（仅附加非空字段）
  buildFormData(data) {
    if (data instanceof FormData) return data
    const fd = new FormData()
    if (!data) return fd
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      // File/Blob 直接追加，其余转为字符串
      if (value instanceof Blob) {
        fd.append(key, value)
      } else {
        fd.append(key, String(value))
      }
    })
    return fd
  }

  async getTopics(options = {}) {
    const params = {}
    if (options.queryStr) params.query_str = options.queryStr
    if (options.tag) params.tag = options.tag
    if (options.sharedType) params.shared_type = options.sharedType
    if (options.limit) params.limit = options.limit
    if (options.offset) params.offset = options.offset
    
    return await this.request('GET', '/topics/', null, Object.keys(params).length ? params : null)
  }

  async getTopicById(topicId) {
    return await this.request('GET', `/topics/${topicId}`)
  }

  async createTopic(topicData) {
  // 后端要求 content 位于查询参数（必填）。即使只有图片/文件也要传空字符串，避免 422 缺少字段。
  const q = { content: topicData?.content ?? '' }
  if (topicData?.tags) q.tags = topicData.tags
  if (topicData?.media_url) q.media_url = topicData.media_url
  if (topicData?.media_type) q.media_type = topicData.media_type

  const formData = new FormData()
  if (topicData?.file) {
    formData.append('file', topicData.file)
  } else {
    // 保证 multipart 非空，避免 FastAPI 解析失败
    formData.append('noop', '1')
  }
  return await this.request('POST', '/topics/', formData, q)
  }

  async updateTopic(topicId, topicData) {
  // 与创建保持一致：content 为查询参数且必填，未提供则用空字符串
  const q = { content: topicData?.content ?? '' }
  if (topicData?.tags) q.tags = topicData.tags
  if (topicData?.media_url) q.media_url = topicData.media_url
  if (topicData?.media_type) q.media_type = topicData.media_type

  const formData = new FormData()
  if (topicData?.file) {
    formData.append('file', topicData.file)
  } else {
    formData.append('noop', '1')
  }
  return await this.request('PUT', `/topics/${topicId}`, formData, q)
  }

  async deleteTopic(topicId) {
    return await this.request('DELETE', `/topics/${topicId}`)
  }

  async getComments(topicId, parentCommentId = null, limit = 50, offset = 0) {
    const params = { limit, offset }
    if (parentCommentId) params.parent_comment_id = parentCommentId
    
    return await this.request('GET', `/topics/${topicId}/comments/`, null, params)
  }

  async addComment(topicId, commentData) {
  // 后端要求 content 在查询参数中，必填；无文本时传空字符串
  const q = { content: commentData?.content ?? '' }
  const formData = new FormData()
  if (commentData?.file) {
    formData.append('file', commentData.file)
  }
  if (commentData?.parent_comment_id) formData.append('parent_comment_id', String(commentData.parent_comment_id))
  if (commentData?.media_url) formData.append('media_url', String(commentData.media_url))
  if (commentData?.media_type) formData.append('media_type', String(commentData.media_type))
  if (![...formData.keys()].length) formData.append('noop', '1')
  return await this.request('POST', `/topics/${topicId}/comments/`, formData, q)
  }

  async updateComment(commentId, commentData) {
  // 与新增一致：content 走查询参数且必填
  const q = { content: commentData?.content ?? '' }
  const formData = new FormData()
  if (commentData?.file) {
    formData.append('file', commentData.file)
  }
  if (commentData?.media_url) formData.append('media_url', String(commentData.media_url))
  if (commentData?.media_type) formData.append('media_type', String(commentData.media_type))
  if (![...formData.keys()].length) formData.append('noop', '1')
  return await this.request('PUT', `/comments/${commentId}`, formData, q)
  }

  async deleteComment(commentId) {
    return await this.request('DELETE', `/comments/${commentId}`)
  }

  async likeTopic(topicId) {
    return await this.request('POST', '/likes/', { topic_id: topicId })
  }

  async unlikeTopic(topicId) {
    return await this.request('DELETE', '/likes/', { topic_id: topicId })
  }

  async likeComment(commentId) {
    return await this.request('POST', '/likes/', { comment_id: commentId })
  }

  async unlikeComment(commentId) {
    return await this.request('DELETE', '/likes/', { comment_id: commentId })
  }

  async followUser(userId) {
  // 按后端规范，字段为 followed_id
  return await this.request('POST', '/follow/', { followed_id: userId })
  }

  async unfollowUser(userId) {
  // DELETE 也需要在 body 中传入 followed_id
  return await this.request('DELETE', '/unfollow/', { followed_id: userId })
  }
}

// 搜索引擎配置API
export class SearchEngineConfigsAPI extends BaseAPI {
  constructor() {
    super('/search-engine-configs')
  }

  async getAllConfigs(isActive = null) {
    return await this.request('GET', '/', null,
      isActive !== null ? { is_active: isActive } : null
    )
  }

  async getConfigById(configId) {
    return await this.request('GET', `/${configId}`)
  }

  async createConfig(configData) {
    return await this.request('POST', '/', configData)
  }

  async updateConfig(configId, configData) {
    return await this.request('PUT', `/${configId}`, configData)
  }

  async deleteConfig(configId) {
    return await this.request('DELETE', `/${configId}`)
  }

  async checkStatus(configId) {
    return await this.request('POST', `/${configId}/check-status`)
  }
}

// MCP配置API
export class McpConfigsAPI extends BaseAPI {
  constructor() {
    super('/mcp-configs')
  }

  async getAllConfigs(isActive = null) {
    return await this.request('GET', '/', null,
      isActive !== null ? { is_active: isActive } : null
    )
  }

  async getConfigById(configId) {
    return await this.request('GET', `/${configId}`)
  }

  async createConfig(configData) {
    return await this.request('POST', '/', configData)
  }

  async updateConfig(configId, configData) {
    return await this.request('PUT', `/${configId}`, configData)
  }

  async deleteConfig(configId) {
    return await this.request('DELETE', `/${configId}`)
  }

  async checkStatus(configId) {
    return await this.request('POST', `/${configId}/check-status`)
  }
}

// TTS配置API
export class TTSConfigsAPI extends BaseAPI {
  constructor() {
    super('/users/me/tts_configs')
  }

  // 获取所有TTS配置
  async getAllConfigs() {
    return await this.request('GET', '')
  }

  // 获取指定TTS配置详情
  async getConfigById(configId) {
    return await this.request('GET', `/${configId}`)
  }

  // 创建新的TTS配置
  async createConfig(configData) {
    return await this.request('POST', '', configData)
  }

  // 更新TTS配置
  async updateConfig(configId, configData) {
    return await this.request('PUT', `/${configId}`, configData)
  }

  // 删除TTS配置
  async deleteConfig(configId) {
    return await this.request('DELETE', `/${configId}`)
  }

  // 设置TTS配置为激活状态
  async setActive(configId) {
    return await this.request('PUT', `/${configId}/set_active`)
  }

  async checkStatus(configId) {
    return await this.request('POST', `/${configId}/check-status`)
  }
}

// LLM API
export class LLMAPI extends BaseAPI {
  constructor() {
    super('/llm')
  }

  async getAvailableModels() {
    return await this.request('GET', '/available-models')
  }

  async getMcpAvailableTools() {
    return await this.request('GET', '/mcp-available-tools')
  }
}

// 音频API
export class AudioAPI extends BaseAPI {
  constructor() {
    super('/audio')
  }

  async textToSpeech(text, lang = 'zh-CN') {
    return await this.request('POST', '/tts', { text, lang })
  }
}

// 健康检查API
export class HealthAPI extends BaseAPI {
  constructor() {
    super('')
  }

  async healthCheck() {
    return await this.request('GET', '/health')
  }
}

// 统一API服务类
export class RemoteApiService {
  constructor() {
    this.auth = new AuthAPI()
    this.users = new UsersAPI()
    this.userMe = new UserAPI() // 当前用户相关的API
    this.courses = new CoursesAPI()
    this.students = new StudentsAPI()
    this.projects = new ProjectsAPI()
    this.recommend = new RecommendAPI()
    this.dashboard = new DashboardAPI()
    this.notes = new NotesAPI()
    this.knowledgeBases = new KnowledgeBasesAPI()
    this.articles = new ArticlesAPI()
    this.ai = new AIAPI()
    this.search = new SearchAPI()
    this.dailyRecords = new DailyRecordsAPI()
    this.folders = new FoldersAPI()
    this.collections = new CollectionsAPI()
    this.chatRooms = new ChatRoomsAPI()
    this.forum = new ForumAPI()
    this.searchEngineConfigs = new SearchEngineConfigsAPI()
    this.mcpConfigs = new McpConfigsAPI()
    this.ttsConfigs = new TTSConfigsAPI()
    this.llm = new LLMAPI()
    this.audio = new AudioAPI()
    this.health = new HealthAPI()
  }
}

// 导出默认实例
export default new RemoteApiService()
