import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

export const healthAdapter = {
  async check() {
    return __request(OpenAPI, { method: 'GET', url: `/health` })
  },
}

export default healthAdapter
