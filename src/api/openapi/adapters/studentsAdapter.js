import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/students'

export const studentsAdapter = {
  async getAllStudents() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/` })
  },
  async getStudentById(studentId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${studentId}` })
  },
}

export default studentsAdapter
