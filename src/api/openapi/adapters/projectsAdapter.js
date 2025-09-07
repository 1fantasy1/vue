// 项目模块适配器：保持与旧接口一致的签名，底层基于 OpenAPI 客户端实现
import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/projects'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const projectsAdapter = {
  async getAllProjects() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/` })
  },

  async getProjectById(projectId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${projectId}` })
  },

  async createProject(projectData) {
    // 兼容后端表单 key: project_data_json
    const formData = { project_data_json: JSON.stringify(projectData || {}) }
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, formData })
  },

  async updateProject(projectId, projectData) {
    const formData = { project_data_json: JSON.stringify(projectData || {}) }
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${projectId}`, formData })
  },

  async deleteProject(projectId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${projectId}` })
  },

  async applyToProject(projectId, applicationData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${projectId}/apply`, body: applicationData })
  },

  async getProjectApplications(projectId, statusFilter = null) {
    const query = nonEmptyQuery({ status_filter: statusFilter })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${projectId}/applications`, query })
  },

  async processProjectApplication(applicationId, processData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/applications/${applicationId}/process`, body: processData })
  },

  async getProjectMembers(projectId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${projectId}/members` })
  },

  async matchStudents(projectId, initialK = 50, finalK = 3) {
    const query = nonEmptyQuery({ initial_k: initialK, final_k: finalK })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${projectId}/match-students`, query })
  },
}

export default projectsAdapter
