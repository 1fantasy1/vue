import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/search-engine-configs'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const searchEngineConfigsAdapter = {
  async getAllConfigs(isActive = null) {
    const query = nonEmptyQuery({ is_active: isActive })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/`, query })
  },
  async getConfigById(configId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${configId}` })
  },
  async createConfig(configData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, body: configData })
  },
  async updateConfig(configId, configData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${configId}`, body: configData })
  },
  async deleteConfig(configId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${configId}` })
  },
  async checkStatus(configId) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${configId}/check-status` })
  },
}

export default searchEngineConfigsAdapter
