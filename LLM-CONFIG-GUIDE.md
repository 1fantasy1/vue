# LLM 配置使用指南

## 概述

本项目实现了统一的LLM（大语言模型）配置管理系统，支持OpenAI兼容的API配置。配置信息通过全局状态管理，可以在多个组件中复用。

## 架构说明

### 1. 核心组件

- **全局存储** (`stores/global.js`): 使用Pinia管理LLM配置的全局状态
- **Composable** (`composables/useLLMConfig.js`): 提供LLM配置的便捷访问接口
- **API服务** (`services/remoteApi.js`): 处理与后端的配置同步
- **用户界面** (`views/Profile.vue`): LLM配置的设置界面

### 2. 配置字段

```json
{
  "llm_api_type": "openai",           // API类型 (openai, azure, anthropic, google)
  "llm_api_key": "sk-xxxx",          // API密钥
  "llm_api_base_url": "https://...",  // API基础地址
  "llm_model_id": "gpt-3.5-turbo"    // 模型ID
}
```

## 使用方法

### 1. 在组件中使用LLM配置

```vue
<script>
import { useLLMConfig } from '@/composables/useLLMConfig'
import { onMounted } from 'vue'

export default {
  setup() {
    const { 
      config,           // 响应式的配置对象
      isConfigured,     // 是否已配置
      getApiConfig,     // 获取API调用配置
      loadConfig,       // 加载配置
      updateConfig      // 更新配置
    } = useLLMConfig()
    
    onMounted(async () => {
      // 加载配置
      await loadConfig()
      
      if (isConfigured.value) {
        console.log('LLM已配置:', config.value)
      }
    })
    
    const callLLMAPI = async (message) => {
      // 获取API配置用于调用
      const apiConfig = getApiConfig()
      
      // 使用配置调用API
      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: apiConfig.modelId,
          messages: [{ role: 'user', content: message }]
        })
      })
      
      return response.json()
    }
    
    return {
      config,
      isConfigured,
      callLLMAPI
    }
  }
}
</script>
```

### 2. 支持的API类型

#### OpenAI
```json
{
  "llm_api_type": "openai",
  "llm_api_base_url": "https://api.openai.com/v1",
  "llm_model_id": "gpt-3.5-turbo"
}
```

#### Azure OpenAI
```json
{
  "llm_api_type": "azure",
  "llm_api_base_url": "https://your-resource.openai.azure.com",
  "llm_model_id": "gpt-35-turbo"
}
```

#### Anthropic Claude
```json
{
  "llm_api_type": "anthropic",
  "llm_api_base_url": "https://api.anthropic.com",
  "llm_model_id": "claude-3-sonnet-20240229"
}
```

#### Google Gemini
```json
{
  "llm_api_type": "google",
  "llm_api_base_url": "https://generativelanguage.googleapis.com/v1beta",
  "llm_model_id": "gemini-pro"
}
```

### 3. 配置管理方法

```javascript
import { useLLMConfig } from '@/composables/useLLMConfig'

const { 
  loadConfig,
  updateConfig,
  getDefaultConfig,
  isApiTypeSupported 
} = useLLMConfig()

// 从服务器加载配置
await loadConfig(true)

// 更新配置（仅本地）
updateConfig({
  llm_api_type: 'openai',
  llm_api_key: 'sk-new-key',
  llm_api_base_url: 'https://api.openai.com/v1',
  llm_model_id: 'gpt-4'
})

// 获取默认配置
const defaultConfig = getDefaultConfig('openai')

// 检查API类型支持
if (isApiTypeSupported('openai')) {
  console.log('支持OpenAI API')
}
```

### 4. 实际应用场景

#### 聊天组件
```vue
<!-- ChatComponent.vue -->
<template>
  <div class="chat">
    <div v-if="!isConfigured" class="config-warning">
      请先配置LLM设置
    </div>
    <div v-else class="chat-interface">
      <!-- 聊天界面 -->
    </div>
  </div>
</template>

<script>
import { useLLMConfig } from '@/composables/useLLMConfig'

export default {
  setup() {
    const { config, isConfigured, getApiConfig } = useLLMConfig()
    
    const sendMessage = async (message) => {
      if (!isConfigured.value) return
      
      const apiConfig = getApiConfig()
      // 调用LLM API
    }
    
    return { config, isConfigured, sendMessage }
  }
}
</script>
```

#### 知识库问答组件
```vue
<!-- KnowledgeBase.vue -->
<script>
import { useLLMConfig } from '@/composables/useLLMConfig'

export default {
  setup() {
    const { isConfigured, getApiConfig } = useLLMConfig()
    
    const searchKnowledge = async (query) => {
      if (!isConfigured.value) {
        throw new Error('LLM未配置，无法使用智能搜索')
      }
      
      const apiConfig = getApiConfig()
      // 使用LLM增强搜索结果
    }
    
    return { searchKnowledge }
  }
}
</script>
```

## API接口

### 后端接口

#### 获取用户配置
```http
GET /users/me
Authorization: Bearer {token}

Response:
{
  "llm_api_type": "openai",
  "llm_api_key": "encrypted_key",
  "llm_api_base_url": "https://api.openai.com/v1",
  "llm_model_id": "gpt-3.5-turbo"
}
```

#### 更新LLM配置
```http
PUT /users/me/llm-config
Authorization: Bearer {token}
Content-Type: application/json

{
  "llm_api_type": "openai",
  "llm_api_key": "sk-xxxx",
  "llm_api_base_url": "https://api.openai.com/v1",
  "llm_model_id": "gpt-3.5-turbo"
}
```

## 安全考虑

1. **API密钥加密**: 后端存储时对API密钥进行加密
2. **本地缓存**: 客户端不在localStorage中存储明文API密钥
3. **传输安全**: 使用HTTPS确保传输过程中的安全性
4. **访问控制**: 只有登录用户才能访问和修改配置

## 错误处理

```javascript
import { useLLMConfig } from '@/composables/useLLMConfig'
import { ElMessage } from 'element-plus'

const { loadConfig, isConfigured } = useLLMConfig()

try {
  await loadConfig(true)
  
  if (!isConfigured.value) {
    ElMessage.warning('请先配置LLM设置')
    return
  }
  
  // 使用配置进行API调用
} catch (error) {
  console.error('LLM配置加载失败:', error)
  ElMessage.error('配置加载失败: ' + error.message)
}
```

## 调试

在开发环境中，可以通过浏览器控制台查看配置状态：

```javascript
// 在浏览器控制台中执行
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps[0].$stores.global.llmConfig
```

## 示例组件

参考 `components/LLMExampleComponent.vue` 查看完整的使用示例，包括：
- 配置状态检查
- API调用示例
- 错误处理
- 用户界面集成

---

如有问题，请查看相关组件的实现或联系开发团队。
