// OpenAPI SDK 一次性初始化（可安全在未生成SDK时跳过）
import { API_BASE_URL } from '@/services/httpClient.js'
import { STORAGE_KEYS } from '@/utils/storageKeys.js'

/**
 * 配置 openapi-typescript-codegen 生成的客户端：
 * - 设置 BASE（后端地址）
 * - 注入 TOKEN 读取器（从 localStorage 读取并兼容历史键名）
 * - 保持与现有 httpClient 一致的 Accept 头
 *
 * 说明：
 * - 采用动态导入，若 SDK 尚未生成（src/api/generated 不存在），将静默跳过，不影响现有代码。
 */
export async function setupOpenAPI() {
  try {
    // 通过 Vite 的按需导入特性可选加载 SDK（不存在则返回空对象，不会报错）
    const matches = import.meta.glob(
      [
        '/src/api/generated/index.ts',
        '/src/api/generated/index.js',
        '/src/api/generated/*.ts',
        '/src/api/generated/*.js'
      ],
      { eager: false }
    )
    const loader = Object.values(matches)[0]
    if (!loader) {
      if (import.meta?.env?.DEV) console.debug('[OpenAPI] 未检测到生成的 SDK，跳过初始化')
      return
    }
    const mod = await loader()
    const OpenAPI = mod?.OpenAPI || mod?.default?.OpenAPI
    if (!OpenAPI) return

    OpenAPI.BASE = API_BASE_URL
    OpenAPI.WITH_CREDENTIALS = false
    OpenAPI.HEADERS = {
      Accept: 'application/json'
    }
    // Token 可为字符串或函数；用函数可确保每次请求读取最新值
    OpenAPI.TOKEN = () => {
      return (
        localStorage.getItem(STORAGE_KEYS.token) ||
        localStorage.getItem(STORAGE_KEYS.legacyToken) ||
        undefined
      )
    }

    if (import.meta?.env?.DEV) {
      // 仅开发环境提示，便于确认已加载成功
      console.debug('[OpenAPI] SDK 已初始化:', { base: OpenAPI.BASE })
    }
  } catch (e) {
    // 未找到 SDK 或运行环境不支持动态导入时静默忽略
    if (import.meta?.env?.DEV) {
      console.debug('[OpenAPI] 初始化失败，已跳过：', e?.message)
    }
  }
}

export default setupOpenAPI
