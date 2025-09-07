// 推荐模块适配器：保持与旧接口一致的签名，底层基于 OpenAPI 客户端实现
import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/recommend'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const recommendAdapter = {
  async recommendProjects(studentId, initialK = 50, finalK = 3) {
    const query = nonEmptyQuery({ initial_k: initialK, final_k: finalK })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/projects/${studentId}`, query })
  },
  async recommendCourses(studentId, initialK = 50, finalK = 3) {
    const query = nonEmptyQuery({ initial_k: initialK, final_k: finalK })
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/courses/${studentId}`, query })
  },
}

export default recommendAdapter
