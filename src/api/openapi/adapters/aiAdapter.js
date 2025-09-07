import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'

const BASE = '/ai'

export const aiAdapter = {
  async qa(query, options = {}) {
    // multipart/form-data，字段名与 legacy 保持一致
    const formData = {
      query,
      conversation_id: options?.conversationId ?? undefined,
      kb_ids_json: Array.isArray(options?.kbIds) && options.kbIds.length ? JSON.stringify(options.kbIds) : undefined,
      note_ids_json: Array.isArray(options?.noteIds) && options.noteIds.length ? JSON.stringify(options.noteIds) : undefined,
      use_tools: typeof options?.useTools === 'boolean' ? String(options.useTools) : undefined,
      preferred_tools_json: (typeof options?.preferredTools === 'string') ? options.preferredTools
        : (Array.isArray(options?.preferredTools) && options.preferredTools.length ? JSON.stringify(options.preferredTools) : undefined),
      llm_model_id: options?.llmModelId ?? undefined,
      uploaded_file: options?.uploadedFile ?? undefined,
      noop: undefined,
    }
    if (!Object.values(formData).some(v => v !== undefined)) {
      formData.noop = '1'
    }
    return __request(OpenAPI, { method: 'POST', url: `${BASE}/qa`, formData, 
      // 自定义超时由全局 axios 拦截器处理；如需可在生成请求中扩展
    })
  },
}

export default aiAdapter
