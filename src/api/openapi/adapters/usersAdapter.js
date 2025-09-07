import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/users'

export const usersAdapter = {
  async getMe() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/me` })
  },
  async updateMe(userData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/me`, body: userData })
  },
  async updateLLMConfig(config) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/me/llm-config`, body: config })
  },
  async getMyCourses(statusFilter = null) {
    const query = statusFilter ? { status_filter: statusFilter } : undefined
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/me/courses`, query })
  },
}

export default usersAdapter
