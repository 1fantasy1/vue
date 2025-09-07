import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/users/me/ai-conversations'

export const userMeConversationsAdapter = {
  async list(limit = 10, offset = 0) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}`, query: { limit, offset } })
  },
  async get(conversationId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${conversationId}` })
  },
  async messages(conversationId, limit = 50, offset = 0) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${conversationId}/messages`, query: { limit, offset } })
  },
  async updateTitle(conversationId, title) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${conversationId}`, body: { title } })
  },
  async remove(conversationId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${conversationId}` })
  },
}

export default userMeConversationsAdapter
