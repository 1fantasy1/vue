import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/daily-records'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const dailyRecordsAdapter = {
  async getAllRecords(mood = null, tag = null) {
    const query = nonEmptyQuery({ mood, tag })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/`, query })
  },
  async getRecordById(recordId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${recordId}` })
  },
  async createRecord(recordData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, body: recordData })
  },
  async updateRecord(recordId, recordData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${recordId}` , body: recordData })
  },
  async deleteRecord(recordId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${recordId}` })
  },
}

export default dailyRecordsAdapter
