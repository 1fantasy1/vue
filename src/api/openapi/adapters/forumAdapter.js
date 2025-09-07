// 论坛模块适配器：保持与旧接口一致的签名，底层基于 OpenAPI 客户端实现
// 内部基于 openapi-typescript-codegen 的 OpenAPI + request 实现
import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/forum'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const forumAdapter = {
  async getTopics(options = {}) {
    const query = nonEmptyQuery({
      query_str: options.queryStr,
      tag: options.tag,
      shared_type: options.sharedType,
      limit: options.limit,
      offset: options.offset,
    })
    return __request(OpenAPI, {
      method: 'GET',
      url: `${BASE}/topics/`,
      query,
    })
  },

  async getTopicById(topicId) {
    return __request(OpenAPI, {
      method: 'GET',
      url: `${BASE}/topics/${topicId}`,
    })
  },

  async createTopic(topicData) {
    const query = {
      content: topicData?.content ?? '',
      ...(topicData?.tags ? { tags: topicData.tags } : {}),
      ...(topicData?.media_url ? { media_url: topicData.media_url } : {}),
      ...(topicData?.media_type ? { media_type: topicData.media_type } : {}),
    }
    const formData = {}
    if (topicData?.file) {
      formData.file = topicData.file
    } else {
      formData.noop = '1'
    }
    return __request(OpenAPI, {
      method: 'POST',
      url: `${BASE}/topics/`,
      query,
      formData,
    })
  },

  async updateTopic(topicId, topicData) {
    const query = {
      content: topicData?.content ?? '',
      ...(topicData?.tags ? { tags: topicData.tags } : {}),
      ...(topicData?.media_url ? { media_url: topicData.media_url } : {}),
      ...(topicData?.media_type ? { media_type: topicData.media_type } : {}),
    }
    const formData = {}
    if (topicData?.file) {
      formData.file = topicData.file
    } else {
      formData.noop = '1'
    }
    return __request(OpenAPI, {
      method: 'PUT',
      url: `${BASE}/topics/${topicId}`,
      query,
      formData,
    })
  },

  async deleteTopic(topicId) {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `${BASE}/topics/${topicId}`,
    })
  },

  async getComments(topicId, parentCommentId = null, limit = 50, offset = 0) {
    const query = nonEmptyQuery({
      parent_comment_id: parentCommentId,
      limit,
      offset,
    })
    return __request(OpenAPI, {
      method: 'GET',
      url: `${BASE}/topics/${topicId}/comments/`,
      query,
    })
  },

  async addComment(topicId, commentData) {
    const query = { content: commentData?.content ?? '' }
    const formData = {}
    if (commentData?.file) formData.file = commentData.file
    if (commentData?.parent_comment_id != null) formData.parent_comment_id = String(commentData.parent_comment_id)
    if (commentData?.media_url) formData.media_url = String(commentData.media_url)
    if (commentData?.media_type) formData.media_type = String(commentData.media_type)
    if (Object.keys(formData).length === 0) formData.noop = '1'
    return __request(OpenAPI, {
      method: 'POST',
      url: `${BASE}/topics/${topicId}/comments/`,
      query,
      formData,
    })
  },

  async updateComment(commentId, commentData) {
    const query = { content: commentData?.content ?? '' }
    const formData = {}
    if (commentData?.file) formData.file = commentData.file
    if (commentData?.media_url) formData.media_url = String(commentData.media_url)
    if (commentData?.media_type) formData.media_type = String(commentData.media_type)
    if (Object.keys(formData).length === 0) formData.noop = '1'
    return __request(OpenAPI, {
      method: 'PUT',
      url: `${BASE}/comments/${commentId}`,
      query,
      formData,
    })
  },

  async deleteComment(commentId) {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `${BASE}/comments/${commentId}`,
    })
  },

  async likeTopic(topicId) {
    return __request(OpenAPI, {
      method: 'POST',
      url: `${BASE}/likes/`,
      body: { topic_id: topicId },
    })
  },

  async unlikeTopic(topicId) {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `${BASE}/likes/`,
      body: { topic_id: topicId },
    })
  },

  async likeComment(commentId) {
    return __request(OpenAPI, {
      method: 'POST',
      url: `${BASE}/likes/`,
      body: { comment_id: commentId },
    })
  },

  async unlikeComment(commentId) {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `${BASE}/likes/`,
      body: { comment_id: commentId },
    })
  },

  async followUser(userId) {
    return __request(OpenAPI, {
      method: 'POST',
      url: `${BASE}/follow/`,
      body: { followed_id: userId },
    })
  },

  async unfollowUser(userId) {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `${BASE}/unfollow/`,
      body: { followed_id: userId },
    })
  },
}

export default forumAdapter
