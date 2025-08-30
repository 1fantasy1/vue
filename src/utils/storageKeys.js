// 统一 localStorage 键名，避免各处硬编码与不一致
export const STORAGE_KEYS = {
  token: 'access_token',
  user: 'currentUser',
  // 兼容历史键名（仅读取/清理）
  legacyToken: 'auth_token',
  legacyUser: 'user_info',
  userRole: 'userRole',
  llmConfig: 'llm_config'
}

export default STORAGE_KEYS
