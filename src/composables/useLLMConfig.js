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
    const supportedTypes = ['siliconflow', 'openai', 'deepseek', 'doubashanglong', 'kimi', 'zhipu']
    return supportedTypes.includes(apiType)
  }

  // 获取默认配置
  const getDefaultConfig = (apiType = 'siliconflow') => {
    const defaults = {
      siliconflow: {
        llm_api_base_url: 'https://api.siliconflow.cn/v1',
        llm_model_id: 'deepseek-ai/DeepSeek-V3'
      },
      openai: {
        llm_api_base_url: 'https://api.openai.com/v1',
        llm_model_id: 'gpt-3.5-turbo'
      },
      deepseek: {
        llm_api_base_url: 'https://api.deepseek.com/v1',
        llm_model_id: 'deepseek-chat'
      },
      doubashanglong: {
        llm_api_base_url: 'https://ark.cn-beijing.volces.com/api/v3',
        llm_model_id: 'doubao-5-thinking-pro-256045'
      },
      kimi: {
        llm_api_base_url: 'https://api.moonshot.cn/v1',
        llm_model_id: 'kimi-k2-0711-preview'
      },
      zhipu: {
        llm_api_base_url: 'https://open.bigmodel.cn/api/paas/v4',
        llm_model_id: 'glm-4.5v'
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
