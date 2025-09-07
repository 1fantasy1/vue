import { OpenAPI } from '@/api/generated'
import { request as __request } from '@/api/generated/core/request'
import { STORAGE_KEYS } from '@/utils/storageKeys.js'

export const authAdapter = {
  async register(userData) {
    return __request(OpenAPI, { method: 'POST', url: '/register', body: userData })
  },

  async login(credentials) {
    const params = new URLSearchParams()
    if (credentials.email) {
      params.append('username', credentials.email)
    } else if (credentials.phone_number) {
      params.append('username', credentials.phone_number)
    } else {
      throw new Error('请提供邮箱或手机号')
    }
    params.append('password', credentials.password)

    const data = await __request(OpenAPI, {
      method: 'POST',
      url: '/token',
      body: params.toString(),
      mediaType: 'application/x-www-form-urlencoded',
    })

    // 与 legacy 行为保持一致：登录成功即保存 token
    try {
      if (data?.access_token) {
        localStorage.setItem(STORAGE_KEYS.token, data.access_token)
        try { localStorage.removeItem(STORAGE_KEYS.legacyToken) } catch {}
      }
    } catch {}

    return data
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.token)
      localStorage.removeItem(STORAGE_KEYS.user)
      try {
        localStorage.removeItem(STORAGE_KEYS.legacyToken)
        localStorage.removeItem(STORAGE_KEYS.legacyUser)
      } catch {}
    } catch {}
  },

  async sendSmsCode(payload) {
    return __request(OpenAPI, { method: 'POST', url: '/send-sms-code', body: payload })
  },
}

export default authAdapter
