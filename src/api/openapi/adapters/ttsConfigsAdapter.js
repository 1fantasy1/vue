import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/users/me/tts_configs'

export const ttsConfigsAdapter = {
  async getAllConfigs() {
    // 注意 legacy 用 ''，这里统一为 trailing slash 影响不大
    return __request(OpenAPI, { method: 'GET', url: `${BASE}` })
  },
  async getConfigById(configId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${configId}` })
  },
  async createConfig(configData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}`, body: configData })
  },
  async updateConfig(configId, configData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${configId}`, body: configData })
  },
  async deleteConfig(configId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${configId}` })
  },
  async setActive(configId) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${configId}/set_active` })
  },
  async checkStatus(configId) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${configId}/check-status` })
  },
}

export default ttsConfigsAdapter
