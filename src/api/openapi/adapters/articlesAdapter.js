// 文章模块适配器：保持与旧接口一致的签名，底层基于 OpenAPI 客户端实现
import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/articles'

export const articlesAdapter = {
  async getArticleById(articleId) {
    return __request(OpenAPI, { method: 'GET', url: `${BASE}/${articleId}` })
  },

  async updateArticle(articleId, articleData) {
    return __request(OpenAPI, { method: 'PUT', url: `${BASE}/${articleId}`, body: articleData })
  },

  async deleteArticle(articleId) {
    return __request(OpenAPI, { method: 'DELETE', url: `${BASE}/${articleId}` })
  },
}

export default articlesAdapter
