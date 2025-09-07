// 知识库模块适配器：保持与旧接口一致的签名，底层基于 OpenAPI 客户端实现
import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/knowledge-bases'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const knowledgeBasesAdapter = {
  async getAllKnowledgeBases() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/` })
  },

  async getKnowledgeBaseById(kbId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${kbId}` })
  },

  async createKnowledgeBase(kbData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, body: kbData })
  },

  async updateKnowledgeBase(kbId, kbData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${kbId}` , body: kbData })
  },

  async deleteKnowledgeBase(kbId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${kbId}` })
  },

  async getArticles(kbId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${kbId}/articles/` })
  },

  async createArticle(kbId, articleData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${kbId}/articles/`, body: articleData })
  },

  async getDocuments(kbId, statusFilter = null) {
    const query = nonEmptyQuery({ status_filter: statusFilter })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${kbId}/documents/`, query })
  },

  async uploadDocument(kbId, file) {
    const formData = { file }
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${kbId}/documents/`, formData })
  },

  async getDocumentDetail(kbId, documentId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${kbId}/documents/${documentId}` })
  },

  async deleteDocument(kbId, documentId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${kbId}/documents/${documentId}` })
  },

  async getDocumentContent(kbId, documentId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${kbId}/documents/${documentId}/content` })
  },

  async getDocumentChunks(kbId, documentId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${kbId}/documents/${documentId}/chunks` })
  },
}

export default knowledgeBasesAdapter
