import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/folders'

function q(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined && v !== null && v !== '') out[k] = v
  }
  return Object.keys(out).length ? out : undefined
}

export const foldersAdapter = {
  async getAllFolders(parentId = null) {
    const query = q({ parent_id: parentId })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/`, query })
  },
  async getFolderById(folderId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${folderId}` })
  },
  async createFolder(folderData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, body: folderData })
  },
  async updateFolder(folderId, folderData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${folderId}`, body: folderData })
  },
  async deleteFolder(folderId, options = {}) {
    const query = q({
      cascade: options.cascade ? true : undefined,
      recursive: options.recursive ? true : undefined,
      force: options.force ? true : undefined,
    })
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${folderId}`, query })
  },
}

export default foldersAdapter
