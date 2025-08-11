// LLM配置管理 composable
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'

export function useLLMConfig() {
  const globalStore = useGlobalStore()

  // 响应式的LLM配置
  const config = computed(() => globalStore.llmConfig)

  // 检查是否已配置
  const isConfigured = computed(() => globalStore.isLLMConfigured())

  // 获取API调用所需的配置
  const getApiConfig = () => {
    const llmConfig = globalStore.getLLMConfig()
    return {
      apiType: llmConfig.llm_api_type,
      apiKey: llmConfig.llm_api_key,
      baseUrl: llmConfig.llm_api_base_url,
      modelId: llmConfig.llm_model_id,
      temperature: llmConfig.temperature
    }
  }

  // 加载配置
  const loadConfig = async (fromServer = false) => {
    return await globalStore.loadLLMConfig(fromServer)
  }

  // 更新配置
  const updateConfig = (configData) => {
    globalStore.updateLLMConfig(configData)
  }

  // 检查特定API类型是否可用
  const isApiTypeSupported = (apiType) => {
    const supportedTypes = ['openai', 'azure', 'anthropic', 'google']
    return supportedTypes.includes(apiType)
  }

  // 获取默认配置
  const getDefaultConfig = (apiType = 'openai') => {
    const defaults = {
      openai: {
        llm_api_base_url: 'https://api.openai.com/v1',
        llm_model_id: 'gpt-3.5-turbo'
      },
      azure: {
        llm_api_base_url: 'https://your-resource.openai.azure.com',
        llm_model_id: 'gpt-35-turbo'
      },
      anthropic: {
        llm_api_base_url: 'https://api.anthropic.com',
        llm_model_id: 'claude-3-sonnet-20240229'
      },
      google: {
        llm_api_base_url: 'https://generativelanguage.googleapis.com/v1beta',
        llm_model_id: 'gemini-pro'
      }
    }
    
    return {
      llm_api_type: apiType,
      llm_api_key: '',
      temperature: 0.7,
      ...defaults[apiType]
    }
  }

  return {
    config,
    isConfigured,
    getApiConfig,
    loadConfig,
    updateConfig,
    isApiTypeSupported,
    getDefaultConfig
  }
}
