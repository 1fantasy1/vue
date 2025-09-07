import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/dashboard'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const dashboardAdapter = {
  async getSummary() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/summary` })
  },
  async getProjects(statusFilter = null) {
    const query = nonEmptyQuery({ status_filter: statusFilter })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/projects`, query })
  },
  async getCourses(statusFilter = null) {
    const query = nonEmptyQuery({ status_filter: statusFilter })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/courses`, query })
  },
}

export default dashboardAdapter
