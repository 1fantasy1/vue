<!-- 
  示例组件：演示如何在其他组件中使用LLM配置
  使用场景：聊天室、AI助手、知识库问答等需要调用LLM API的功能
-->
<template>
  <div class="llm-example-component">
    <h3>LLM 配置使用示例</h3>
    
    <!-- 配置状态显示 -->
    <div class="config-status">
      <p>配置状态: 
        <span :class="{ 'status-ok': isConfigured, 'status-error': !isConfigured }">
          {{ isConfigured ? '已配置' : '未配置' }}
        </span>
      </p>
      
      <div v-if="isConfigured" class="config-info">
        <p>API类型: {{ config.llm_api_type }}</p>
        <p>模型ID: {{ config.llm_model_id }}</p>
        <p>API地址: {{ config.llm_api_base_url }}</p>
        <p>API密钥: {{ config.llm_api_key ? '已配置' : '未配置' }}</p>
      </div>
    </div>
    
    <!-- 简单的聊天界面示例 -->
    <div v-if="isConfigured" class="chat-demo">
      <h4>AI 对话示例</h4>
      <div class="chat-messages">
        <div v-for="message in messages" :key="message.id" 
             :class="['message', message.role]">
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>
      
      <div class="chat-input">
        <input v-model="userInput" 
               @keyup.enter="sendMessage"
               placeholder="输入消息..." />
        <button @click="sendMessage" :disabled="isLoading">
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>
    
    <!-- 配置未完成时的提示 -->
    <div v-else class="config-prompt">
      <p>请先在"个人资料"页面配置LLM设置</p>
      <button @click="goToProfile">前往配置</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLLMConfig } from '@/composables/useLLMConfig'
import { ElMessage } from 'element-plus'

export default {
  name: 'LLMExampleComponent',
  setup() {
    const router = useRouter()
    const { config, isConfigured, getApiConfig, loadConfig } = useLLMConfig()
    
    // 聊天相关状态
    const messages = ref([
      { id: 1, role: 'assistant', content: '你好！我是AI助手，有什么可以帮助您的吗？' }
    ])
    const userInput = ref('')
    const isLoading = ref(false)
    
    // 组件挂载时加载配置
    onMounted(async () => {
      await loadConfig()
      if (!isConfigured.value) {
        ElMessage.warning('请先配置LLM设置')
      }
    })
    
    // 发送消息
    const sendMessage = async () => {
      if (!userInput.value.trim() || isLoading.value) return
      
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: userInput.value
      }
      
      messages.value.push(userMessage)
      const currentInput = userInput.value
      userInput.value = ''
      isLoading.value = true
      
      try {
        // 获取API配置
        const apiConfig = getApiConfig()
        
        // 这里是调用LLM API的示例代码
        // 实际项目中需要根据具体的API格式调用
        const response = await callLLMAPI(currentInput, apiConfig)
        
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response
        }
        
        messages.value.push(assistantMessage)
      } catch (error) {
        console.error('调用LLM API失败:', error)
        ElMessage.error('AI响应失败: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }
    
    // 模拟LLM API调用
    const callLLMAPI = async (message, apiConfig) => {
      // 这是一个示例函数，展示如何使用配置
      console.log('使用配置调用LLM API:')
      console.log('API类型:', apiConfig.apiType)
      console.log('API地址:', apiConfig.baseUrl) 
      console.log('模型ID:', apiConfig.modelId)
      console.log('用户消息:', message)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 返回模拟响应
      return `这是对"${message}"的AI回复（使用${apiConfig.modelId}模型）`
    }
    
    // 跳转到配置页面
    const goToProfile = () => {
      router.push('/profile')
    }
    
    return {
      config,
      isConfigured,
      messages,
      userInput,
      isLoading,
      sendMessage,
      goToProfile
    }
  }
}
</script>

<style scoped>
.llm-example-component {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.config-status {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-ok {
  color: #28a745;
  font-weight: bold;
}

.status-error {
  color: #dc3545;
  font-weight: bold;
}

.config-info {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.config-info p {
  margin: 5px 0;
}

.chat-demo {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background: #007bff;
  color: white;
  margin-left: auto;
  text-align: right;
}

.message.assistant {
  background: #f1f3f4;
  color: #333;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.config-prompt {
  text-align: center;
  padding: 40px;
  color: #666;
}

.config-prompt button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
