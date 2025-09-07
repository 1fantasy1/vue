import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/collections'

function q(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined && v !== null && v !== '') out[k] = v
  }
  return Object.keys(out).length ? out : undefined
}

export const collectionsAdapter = {
  async getAllCollections(options = {}) {
    const query = q({
      folder_id: options.folderId,
      type_filter: options.typeFilter,
      tag_filter: options.tagFilter,
      is_starred: options.isStarred,
      status_filter: options.statusFilter,
    })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/`, query })
  },
  async getCollectionById(contentId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${contentId}` })
  },
  async createCollection(collectionData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, body: collectionData })
  },
  async updateCollection(contentId, collectionData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${contentId}`, body: collectionData })
  },
  async deleteCollection(contentId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${contentId}` })
  },
  async addFromPlatform(collectionData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/add-from-platform`, body: collectionData })
  },
}

export default collectionsAdapter
