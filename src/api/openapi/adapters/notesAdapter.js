import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/notes'

function nonEmptyQuery(obj) {
  const q = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q[k] = v
  })
  return Object.keys(q).length ? q : undefined
}

export const notesAdapter = {
  async getAllNotes(params = {}) {
    const query = nonEmptyQuery({
      note_type: params.note_type,
      course_id: params.course_id,
      chapter: params.chapter,
      folder_id: params.folder_id,
      tags: params.tags,
      limit: params.limit,
      offset: params.offset,
    })
    return __request(OpenAPI, {
      method: 'GET',
      url: `${BASE}/`,
      query,
    })
  },

  async getNoteById(noteId) {
    return __request(OpenAPI, {
      method: 'GET',
      url: `${BASE}/${noteId}`,
    })
  },

  async createNote(noteData) {
    // 文件存在时使用 formData；且与旧实现一致：有 file 时跳过 media_type，让后端确定
    if (noteData?.file) {
      const formData = {}
      for (const [k, v] of Object.entries(noteData)) {
        if (v === undefined || v === null) continue
        if (k === 'media_type') continue
        formData[k] = v
      }
      return __request(OpenAPI, {
        method: 'POST',
        url: `${BASE}/`,
        formData,
      })
    }
    return __request(OpenAPI, {
      method: 'POST',
      url: `${BASE}/`,
      body: noteData,
    })
  },

  async updateNote(noteId, noteData) {
    if (noteData?.file) {
      const formData = {}
      for (const [k, v] of Object.entries(noteData)) {
        if (v === undefined || v === null) continue
        if (k === 'media_type') continue
        formData[k] = v
      }
      return __request(OpenAPI, {
        method: 'PUT',
        url: `${BASE}/${noteId}`,
        formData,
      })
    }
    return __request(OpenAPI, {
      method: 'PUT',
      url: `${BASE}/${noteId}`,
      body: noteData,
    })
  },

  async deleteNote(noteId) {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `${BASE}/${noteId}`,
    })
  },
}

export default notesAdapter
