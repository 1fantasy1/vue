import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/search'

export const searchAdapter = {
  async semanticSearch(query, itemTypes = null, limit = 10) {
    const body = {
      query,
      item_types: itemTypes,
      limit,
    }
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/semantic`, body })
  },
}

export default searchAdapter
