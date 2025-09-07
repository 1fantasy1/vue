import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/courses'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const coursesAdapter = {
  async getAllCourses() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/` })
  },

  async getAvailableCourses() {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/available` })
  },

  async getCourseById(courseId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${courseId}` })
  },

  async createCourse(courseData) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/`, body: courseData })
  },

  async updateCourse(courseId, courseData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${courseId}`, body: courseData })
  },

  async enrollCourse(courseId) {
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${courseId}/enroll` })
  },

  async getMaterials(courseId, typeFilter = null) {
    const query = nonEmptyQuery({ type_filter: typeFilter })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${courseId}/materials/`, query })
  },

  async getMaterialById(courseId, materialId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${courseId}/materials/${materialId}` })
  },

  async createMaterial(courseId, materialData, file = null) {
    // 后端需要 multipart/form-data；即使无文件也发送一个空的 file 字段
    const query = nonEmptyQuery({
      title: materialData?.title,
      type: materialData?.type,
      url: materialData?.url,
      content: materialData?.content,
    })
    const formData = {}
    formData['file'] = file || new Blob([''])
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/${courseId}/materials/`, query, formData })
  },

  async updateMaterial(courseId, materialId, materialData, file = null) {
    const query = nonEmptyQuery({
      title: materialData?.title,
      type: materialData?.type,
      url: materialData?.url,
      content: materialData?.content,
    })
    const formData = {}
    formData['file'] = file || new Blob([''])
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${courseId}/materials/${materialId}`, query, formData })
  },

  async deleteMaterial(courseId, materialId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${courseId}/materials/${materialId}` })
  },

  async getCompletionCount(courseId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${courseId}/completed-by-count` })
  },
}

export default coursesAdapter
