// 鸿庆书云创新协作平台API服务
import httpClient from './httpClient.js'

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

  async getAllProjects() {
    return await this.request('GET', '/')
  }

  async getProjectById(projectId) {
    return await this.request('GET', `/${projectId}`)
  }

  async createProject(projectData) {
    return await this.request('POST', '/', projectData)
  }

  async updateProject(projectId, projectData) {
    return await this.request('PUT', `/${projectId}`, projectData)
  }

  async matchStudents(projectId, initialK = 50, finalK = 3) {
    return await this.request('GET', `/${projectId}/match-students`, null, {
      initial_k: initialK,
      final_k: finalK
    })
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

  async getAllNotes(noteType = null) {
    return await this.request('GET', '/', null,
      noteType ? { note_type: noteType } : null
    )
  }

  async getNoteById(noteId) {
    return await this.request('GET', `/${noteId}`)
  }

  async createNote(noteData) {
    return await this.request('POST', '/', noteData)
  }

  async updateNote(noteId, noteData) {
    return await this.request('PUT', `/${noteId}`, noteData)
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
    const requestData = {
      query,
      kb_ids: options.kbIds || null,
      note_ids: options.noteIds || null,
      use_tools: options.useTools || false,
      preferred_tools: options.preferredTools || null,
      llm_model_id: options.llmModelId || null
    }
    
    return await this.request('POST', '/qa', requestData)
  }

  async webSearch(query, engineConfigId, limit = 5) {
    return await this.request('POST', '/web-search', {
      query,
      engine_config_id: engineConfigId,
      limit
    })
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
    return await this.requestTo(this.baseRooms, 'POST', `/${roomId}/messages/`, messageData)
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
    return await this.request('POST', '/topics/', topicData)
  }

  async updateTopic(topicId, topicData) {
    return await this.request('PUT', `/topics/${topicId}`, topicData)
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
    return await this.request('POST', `/topics/${topicId}/comments/`, commentData)
  }

  async updateComment(commentId, commentData) {
    return await this.request('PUT', `/comments/${commentId}`, commentData)
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
    return await this.request('POST', '/follow/', { user_id: userId })
  }

  async unfollowUser(userId) {
    return await this.request('DELETE', '/unfollow/', { user_id: userId })
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
