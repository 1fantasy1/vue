<template>
  <div class="knowledge-hub">
    <!-- 移动端提示 -->
    <div class="mobile-hint" v-show="isMobile && sidebarCollapsed && showMobileHint">点击左上角菜单图标打开侧边栏</div>
    
    <div class="chat-container">
      <!-- 左侧边栏 -->
      <div class="chat-sidebar" :class="{ 'mobile-open': !sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="header-top">
            <button class="back-btn" @click="goBack" title="返回首页">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
              </svg>
            </button>
            <div class="logo-section">
              <div class="logo-icon">🧠</div>
              <h2>智库聊天AI</h2>
            </div>
          </div>
          <button class="new-chat-btn" @click="startNewChat">
            <span>➕</span>
            <span>新建对话</span>
          </button>
        </div>
        
        <div class="chat-history-section">
          <div class="history-header">
            <span>最近对话</span>
          </div>
          <div class="chat-history-list">
            <div 
              v-for="chat in chatHistoryList" 
              :key="chat.id"
              class="chat-history-item" 
              :class="{ active: chat.id === currentChatId }"
              @click="selectChat(chat)"
            >
              <div class="chat-content">
                <div class="chat-title">{{ chat.title }}</div>
                <div class="chat-time">{{ chat.time }}</div>
              </div>
              <button class="delete-chat-btn" @click.stop="deleteIndividualChat(chat.id)" title="删除对话">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="sidebar-footer">
          <div class="sidebar-actions">
            <button class="action-btn" @click="toggleSettings" title="设置">⚙️</button>
          </div>
          
          <!-- 设置面板 -->
          <div class="settings-panel" :class="{ 'show': showSettingsPanel }">
            <div class="settings-content">
              <h4>模型设置</h4>
              <div class="setting-item">
                <label>模型温度</label>
                <div class="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1" 
                    v-model="modelTemperature" 
                    class="slider"
                  >
                  <span class="slider-value">{{ modelTemperature }}</span>
                </div>
              </div>
              <div class="setting-item">
                <label>上下文长度</label>
                <div class="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="35" 
                    step="1" 
                    v-model="contextLength" 
                    class="slider"
                  >
                  <span class="slider-value">{{ contextLength }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏遮罩层 -->
      <div 
        class="sidebar-overlay" 
        :class="{ show: !sidebarCollapsed && isMobile }"
        @click="closeSidebar"
      ></div>

      <!-- 左上角菜单按钮 -->
      <button class="top-menu-toggle" @click="toggleSidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
        </svg>
      </button>

      <!-- 主聊天区域 -->
      <div class="chat-main">
        <!-- 顶部工具栏 -->
        <div class="chat-header">
          <div class="chat-title-section">
            <h3>{{ currentChatTitle }}</h3>
            <div class="chat-meta">
              <span class="model-indicator">{{ selectedModel.toUpperCase() }}</span>
              <span class="separator">•</span>
              <span class="message-count">{{ chatHistory.length }}条消息</span>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" @click="shareChat" title="分享对话">📤</button>
            <button class="action-btn" @click="goHome" title="返回首页">🏠</button>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="chat-messages-container" ref="chatMessagesRef">
          <div class="welcome-section" v-show="chatHistory.length === 0">
            <div class="welcome-avatar">🧠</div>
            <h2>你好！我是智库助手</h2>
            <p>我可以帮助您解答关于科研方法论、创新思维、技术知识等各种问题</p>
            
            <div class="suggestion-cards">
              <div class="suggestion-card" @click="sendSuggestion('如何在机器学习项目中应用创新思维？')">
                <div class="suggestion-icon">💡</div>
                <div class="suggestion-text">机器学习创新思维应用</div>
              </div>
              <div class="suggestion-card" @click="sendSuggestion('深度学习项目的最佳实践有哪些？')">
                <div class="suggestion-icon">🚀</div>
                <div class="suggestion-text">深度学习最佳实践</div>
              </div>
              <div class="suggestion-card" @click="sendSuggestion('如何进行有效的数据分析？')">
                <div class="suggestion-icon">📊</div>
                <div class="suggestion-text">数据分析方法论</div>
              </div>
              <div class="suggestion-card" @click="sendSuggestion('创新项目管理的核心要素是什么？')">
                <div class="suggestion-icon">📋</div>
                <div class="suggestion-text">创新项目管理</div>
              </div>
            </div>
          </div>

          <div class="chat-messages" v-show="chatHistory.length > 0">
            <div 
              v-for="message in chatHistory" 
              :key="message.id" 
              class="chat-message" 
              :class="message.type"
            >
              <!-- 用户/AI 普通消息 -->
              <template v-if="message.displayType !== 'tool-step'">
                <div class="message-avatar">
                  <span v-if="message.type === 'user'">👤</span>
                  <span v-else>🧠</span>
                </div>
                <div class="message-content">
                  <div v-if="message.type === 'ai'" class="model-name">{{ message.model ? message.model.toUpperCase() : selectedModel.toUpperCase() }}</div>
                  <div v-if="isEmbeddableHtml(message.content)" class="message-bubble">
                    <HtmlPreview :html="extractHtml(message.content)" :min-height="420" />
                  </div>
                  <div v-else class="message-bubble" :class="{ 'short': isShortMessage(message.content) }" v-html="formatMessage(message.content)"></div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </template>

              <!-- 工具调用分组消息 -->
              <template v-else>
                <div class="message-avatar">🛠️</div>
                <div class="message-content">
                  <div class="tool-step-card">
                    <div class="tool-step-header" @click="toggleToolStepExpanded(message)">
                      <div class="tool-step-title">
                        <span class="tool-badge">工具</span>
                        <strong>{{ message.toolName || '工具调用' }}</strong>
                        <span class="tool-step-status" :class="message.status">
                          <span v-if="message.status === 'running'">⏳ 进行中</span>
                          <span v-else>✅ 完成</span>
                        </span>
                      </div>
                      <div class="tool-step-actions">
                        <span class="toggle-text">{{ message.expanded ? '收起详情' : '展开详情' }}</span>
                        <span class="toggle-arrow" :class="{ expanded: message.expanded }">▶</span>
                      </div>
                    </div>
                    <div class="tool-step-summary">
                      {{ getToolStepSummary(message) }}
                    </div>
                    <div class="tool-step-details" v-show="message.expanded">
                      <div class="tool-detail-block">
                        <div class="detail-title">调用参数</div>
                        <pre class="json-view" v-html="formatJson(message.call?.calls || message.call)"></pre>
                      </div>
                      <div class="tool-detail-block">
                        <div class="detail-title">返回结果</div>
                        <div v-if="message.output">
                          <pre class="json-view" v-html="formatJson(message.output?.output || message.output)"></pre>
                        </div>
                        <div v-else class="no-output">暂无结果，工具仍在执行或日志未返回。</div>
                      </div>
                    </div>
                  </div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </template>
            </div>

            <div v-if="isTyping" class="chat-message ai">
              <div class="message-avatar">🧠</div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部输入区域 -->
        <div class="chat-input-section">
          <div class="input-tools">
            <!-- AI工具下拉菜单 -->
            <div class="tool-dropdown ai-tools-dropdown" :class="{ active: aiToolsEnabled }">
              <button 
                class="tool-btn dropdown-toggle"
                :class="{ active: aiToolsEnabled }"
                @click="toggleAiToolsDropdown"
                title="AI 智能工具选择"
              >
                <span class="tool-icon">🤖</span>
                <span class="tool-text">AI工具</span>
                <span class="dropdown-arrow">▲</span>
              </button>
              
              <div class="dropdown-menu" v-show="showAiToolsDropdown">
                <div class="dropdown-header">
                  <label class="dropdown-switch">
                    <input 
                      type="checkbox" 
                      v-model="aiToolsEnabled"
                    >
                    <span class="switch-slider"></span>
                    <span class="switch-label">启用 AI 工具</span>
                  </label>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-options" :class="{ disabled: !aiToolsEnabled }">
                  <label class="dropdown-option">
                    <input 
                      type="checkbox" 
                      :checked="enabledTools.includes('knowledge')"
                      :disabled="!aiToolsEnabled"
                      @change="toggleTool('knowledge')"
                    >
                    <span class="option-icon">📚</span>
                    <span class="option-text">知识库检索</span>
                  </label>
                  
                  <label class="dropdown-option">
                    <input 
                      type="checkbox" 
                      :checked="enabledTools.includes('web')"
                      :disabled="!aiToolsEnabled"
                      @change="toggleTool('web')"
                    >
                    <span class="option-icon">🌐</span>
                    <span class="option-text">网络搜索</span>
                  </label>
                  
                  <label class="dropdown-option">
                    <input 
                      type="checkbox" 
                      :checked="enabledTools.includes('mcp')"
                      :disabled="!aiToolsEnabled"
                      @change="toggleTool('mcp')"
                    >
                    <span class="option-icon">🔌</span>
                    <span class="option-text">MCP工具</span>
                  </label>
                </div>
              </div>
            </div>

            <button 
              class="tool-btn" 
              :class="{ active: enabledTools.includes('upload') }"
              @click="triggerFileUpload" 
              title="上传文件"
            >
              <svg class="tool-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,12L16,16H13.5V19H10.5V16H8L12,12Z"></path>
              </svg>
              <span class="tool-text">上传文件</span>
            </button>
            
            
          </div>
          
          <!-- 上传文件预览区域 -->
          <div v-if="uploadedFileName" class="uploaded-file-preview">
            <div class="file-item">
              <div class="file-info">
                <svg class="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span class="file-name">{{ uploadedFileName }}</span>
              </div>
              <button class="remove-file-btn" @click="clearUploadedFile" title="移除文件">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="input-area">
            <div class="input-wrapper">
              <input 
                type="file" 
                ref="fileUploadInput" 
                style="display: none;" 
                @change="handleFileUpload" 
                accept=".txt,.md,.pdf,.docx,.jpg,.jpeg,.png,.gif,.webp"
              >
              <textarea 
                v-model="currentMessage"
                placeholder="请输入您的问题，支持Shift+Enter换行..."
                rows="1"
                @keydown="handleInputKeydown"
                @input="adjustTextareaHeight"
                ref="chatInputRef"
                class="chat-input"
              ></textarea>
              <button 
                class="send-button" 
                @click="sendMessage" 
                :disabled="!currentMessage.trim() || isTyping"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="input-footer">
            <div class="model-display">
              <span>当前模型：{{ getCurrentModel }}</span>
            </div>
            <div class="usage-info">
              <span>今日已使用：<strong>{{ dailyUsage }}/100</strong> 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import remoteApiService from '@/services/remoteApi.js'
import HtmlPreview from '@/components/HtmlPreview.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import ElectronDiagnostics from '@/utils/electronDiagnostics.js'

export default {
  name: 'KnowledgeHub',
  components: { HtmlPreview },
  setup() {
    const router = useRouter()
    const sidebarCollapsed = ref(true) // 默认隐藏侧边栏
    const selectedModel = ref('默认模型') // 保留作为兼容，但不再用于选择
    const userDefaultModel = ref('') // 用户的默认模型
    const currentMessage = ref('')
    // 工具偏好（知识库/网络搜索/MCP），仅在 aiToolsEnabled 开启时生效
    const enabledTools = ref(['knowledge'])
    // AI 智能工具调用总开关（use_tools）
    const aiToolsEnabled = ref(false)
    // 下拉菜单显示状态
    const showAiToolsDropdown = ref(false)

    // 从本地存储恢复工具设置
    try {
      const savedEnabled = localStorage.getItem('ai_enabled_tools')
      const savedSwitch = localStorage.getItem('ai_tools_enabled')
      if (savedEnabled) {
        const parsed = JSON.parse(savedEnabled)
        if (Array.isArray(parsed)) enabledTools.value = parsed
      }
      if (savedSwitch === 'true' || savedSwitch === 'false') {
        aiToolsEnabled.value = savedSwitch === 'true'
      }
    } catch {}

    // 监听工具设置变化并自动保存到localStorage
    watch(aiToolsEnabled, (newValue) => {
      try {
        localStorage.setItem('ai_tools_enabled', newValue ? 'true' : 'false')
      } catch {}
    })

    watch(enabledTools, (newValue) => {
      try {
        localStorage.setItem('ai_enabled_tools', JSON.stringify(newValue))
      } catch {}
    }, { deep: true })

    const isTyping = ref(false)
    const chatMessagesRef = ref(null)
    const chatInputRef = ref(null)
    // 文件上传相关
    const fileUploadInput = ref(null)
    const uploadedFile = ref(null) // 当前上传的文件
    const uploadedFileName = ref('') // 文件名用于显示
    const currentChatId = ref(null) // 初始值为null，让后端创建新对话
    const dailyUsage = ref(12)
    const modelTemperature = ref(0.7)
    const contextLength = ref(35)
    const showSettingsPanel = ref(false)

    // 检查是否为移动设备
    const isMobile = ref(window.innerWidth <= 768)
    
    // 控制移动端提示显示
    const showMobileHint = ref(false)
    let mobileHintTimer = null

    // 聊天历史列表 - 将从API加载
    const chatHistoryList = ref([])

    // 当前对话历史 - 将从API加载
    const chatHistory = ref([])

    // 加载对话列表
    const loadConversations = async () => {
      try {
        const res = await remoteApiService.userMe.getAIConversations(20, 0) // 获取最近20个对话
        const payload = res?.data ?? res
        const list = payload?.success && Array.isArray(payload.data)
          ? payload.data
          : (Array.isArray(payload) ? payload : [])
        if (Array.isArray(list)) {
          chatHistoryList.value = list.map(conv => ({
            id: conv.id,
            title: conv.title || '未命名对话',
            time: formatRelativeTime(conv.last_updated || conv.created_at),
            created_at: conv.created_at,
            last_updated: conv.last_updated,
            total_messages_count: conv.total_messages_count || 0
          }))
        }
      } catch (error) {
        console.error('加载对话列表失败:', error)
      }
    }

    // 安全解析 JSON（可能为对象或字符串），失败返回原值或 null
    const safeParseJson = (maybeJson) => {
      if (maybeJson == null) return null
      if (typeof maybeJson === 'object') return maybeJson
      if (typeof maybeJson === 'string') {
        try { return JSON.parse(maybeJson) } catch { return maybeJson }
      }
      return maybeJson
    }

    // 从 AI 文本中提取“我决定调用工具: ... 工具执行结果: ...”的日志，并返回清理后的正文与工具步骤
    // 返回: { cleanedText: string, steps: Array<{ toolName, callText, outputText }> }
    const parseToolLogsFromText = (text) => {
      if (!text || typeof text !== 'string') return { cleanedText: text || '', steps: [] }
      const steps = []
      let cleaned = text
      // 全局非贪婪匹配，捕获每个调用段
      const pattern = /我决定调用工具\s*:\s*([\s\S]*?)工具执行结果\s*:\s*([\s\S]*?)(?=(?:\n{2,}|$|我决定调用工具\s*:))/g
      let match
      while ((match = pattern.exec(text)) !== null) {
        const callText = (match[1] || '').trim()
        const outputText = (match[2] || '').trim()
        // 解析工具名（如果存在）
        let toolName = '工具'
        const nameMatch = callText.match(/"name"\s*:\s*"([^"]+)"/)
        if (nameMatch && nameMatch[1]) toolName = nameMatch[1]
        steps.push({ toolName, callText, outputText })
      }
      if (steps.length) {
        // 移除已匹配的整段日志，保留正文
        cleaned = cleaned.replace(pattern, '').replace(/\n{3,}/g, '\n\n').trim()
      }
      return { cleanedText: cleaned, steps }
    }

    // 构建用于展示的消息列表：将 tool_call 和紧随其后的 tool_output 分组
    const buildDisplayMessages = (rawList) => {
      const result = []
      // 若后端已返回 tool_call/tool_output 角色，则不再从 AI 文本里拆日志，避免重复
      const hasToolRoles = Array.isArray(rawList) && rawList.some(m => m.role === 'tool_call' || m.role === 'tool_output')
      for (let i = 0; i < rawList.length; i++) {
        const m = rawList[i]
        const role = m.role
        // 分组工具步骤
        if (role === 'tool_call') {
          const callParsed = safeParseJson(m.tool_calls_json)
          const firstCall = Array.isArray(callParsed) ? callParsed[0] : null
          let outputMsg = null
          if (i + 1 < rawList.length && rawList[i + 1].role === 'tool_output') {
            outputMsg = rawList[i + 1]
            i++ // 跳过已配对的输出
          }
          // 使用 tool_call 的时间戳作为整个步骤的时间戳
          const step = {
            id: m.id,
            displayType: 'tool-step',
            type: 'ai', // 外观靠左展示
            timestamp: new Date(m.sent_at || Date.now()),
            toolName: firstCall?.function?.name || '工具',
            call: { raw: m, calls: callParsed },
            output: outputMsg ? { raw: outputMsg, output: safeParseJson(outputMsg.tool_output_json) } : null,
            status: outputMsg ? 'done' : 'running',
            expanded: false,
            // 保存原始消息索引，用于调试
            originalIndex: i
          }
          result.push(step)
          continue
        }
        if (role === 'tool_output') {
          // 孤立的输出（未配对上一条调用），也以步骤卡片显示
          const outputParsed = safeParseJson(m.tool_output_json)
          result.push({
            id: m.id,
            displayType: 'tool-step',
            type: 'ai',
            timestamp: new Date(m.sent_at || Date.now()),
            toolName: '工具',
            call: null,
            output: { raw: m, output: outputParsed },
            status: 'done',
            expanded: false,
            originalIndex: i
          })
          continue
        }

        // 普通消息
        // 对 AI 文本尝试拆出工具日志（仅当后端未提供 tool_* 角色时）
        if (role !== 'user' && !hasToolRoles && typeof m.content === 'string' && m.content.includes('我决定调用工具')) {
          const { cleanedText, steps } = parseToolLogsFromText(m.content)
          // 先插入解析出的工具步骤
          steps.forEach((s, idx) => {
            result.push({
              id: `${m.id || 'ai'}-parsed-step-${idx}`,
              displayType: 'tool-step',
              type: 'ai',
              timestamp: new Date(m.sent_at || Date.now()),
              toolName: s.toolName,
              call: s.callText, // 原样字符串，详情视图会格式化
              output: s.outputText ? { output: s.outputText } : null,
              status: 'done',
              expanded: false,
              originalIndex: i + idx * 0.001
            })
          })
          // 再插入清理后的 AI 正文
          result.push({
            id: m.id,
            type: 'ai',
            content: cleanedText,
            timestamp: new Date(m.sent_at),
            model: m.llm_model_used || 'unknown',
            originalIndex: i + 0.5
          })
        } else {
          result.push({
            id: m.id,
            type: role === 'user' ? 'user' : 'ai',
            content: m.content,
            timestamp: new Date(m.sent_at),
            model: m.llm_model_used || 'unknown',
            originalIndex: i
          })
        }
      }
      
      // 按时间戳排序，如果时间戳相同则按原始索引排序
      return result.sort((a, b) => {
        const timeA = a.timestamp.getTime()
        const timeB = b.timestamp.getTime()
        if (timeA === timeB) {
          // 时间戳相同时，按原始索引排序
          return (a.originalIndex || 0) - (b.originalIndex || 0)
        }
        return timeA - timeB
      })
    }

    // 加载指定对话的消息历史
    const loadConversationMessages = async (conversationId) => {
      try {
        const res = await remoteApiService.userMe.getAIConversationMessages(conversationId, 100, 0) // 获取最近100条消息
        const payload = res?.data ?? res
        const raw = payload?.success && Array.isArray(payload.data) ? payload.data : (Array.isArray(payload) ? payload : [])
        if (Array.isArray(raw)) {
          // 确保消息按时间排序（升序，旧消息在前）
          const sortedMessages = raw.sort((a, b) => {
            const timeA = new Date(a.sent_at || 0).getTime()
            const timeB = new Date(b.sent_at || 0).getTime()
            return timeA - timeB
          })
          
          // 调试信息：打印原始消息顺序
          console.log('原始消息顺序:', sortedMessages.map(m => ({
            id: m.id,
            role: m.role,
            sent_at: m.sent_at,
            content: m.content?.substring(0, 50) + '...'
          })))
          
          const displayMessages = buildDisplayMessages(sortedMessages)
          
          // 调试信息：打印处理后的显示消息顺序
          console.log('处理后消息顺序:', displayMessages.map(m => ({
            id: m.id,
            type: m.type,
            displayType: m.displayType,
            timestamp: m.timestamp.toISOString(),
            content: m.content?.substring(0, 50) + '...' || m.toolName
          })))
          
          chatHistory.value = displayMessages
          scrollToBottom()
        }
      } catch (error) {
        console.error('加载对话消息失败:', error)
        chatHistory.value = []
      }
    }

    // 加载用户信息和默认模型
    // 获取当前实际使用的模型名称
    const getCurrentModel = computed(() => {
      // 优先从聊天历史中获取最新的AI响应使用的模型
      const lastAiMessage = chatHistory.value
        .slice()
        .reverse()
        .find(msg => msg.type === 'ai' && msg.model && msg.model !== 'unknown')
      
      if (lastAiMessage && lastAiMessage.model) {
        return lastAiMessage.model
      }
      
      // 如果没有聊天记录，使用用户配置的默认模型
      return userDefaultModel.value || '默认模型'
    })

    // 加载用户信息和默认模型
  const loadUserInfo = async () => {
      try {
    const res = await remoteApiService.users.getMe()
        console.log('用户信息API响应:', res) // 调试信息
    const payload = res?.data ?? res
        if (payload?.success && payload.data) {
          const userData = payload.data
          console.log('用户数据:', userData) // 调试信息
          console.log('默认LLM模型:', userData.default_llm_model) // 调试信息
          // 获取用户的默认LLM模型
          if (userData.default_llm_model) {
            userDefaultModel.value = userData.default_llm_model
          } else {
            userDefaultModel.value = '系统默认模型'
          }
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
        userDefaultModel.value = '系统默认模型'
      }
    }

    // 格式化相对时间
    const formatRelativeTime = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return '刚刚'
      if (diffMins < 60) return `${diffMins}分钟前`
      if (diffHours < 24) return `${diffHours}小时前`
      if (diffDays < 7) return `${diffDays}天前`
      return date.toLocaleDateString('zh-CN')
    }

    // 计算当前聊天标题
    const currentChatTitle = computed(() => {
      const currentChat = chatHistoryList.value.find(chat => chat.id === currentChatId.value)
      return currentChat ? currentChat.title : '新建对话'
    })

    // 检查是否为短消息（用于动态调整气泡宽度）
    const isShortMessage = (content) => {
      if (!content) return true
      // 移除HTML标签计算纯文本长度
      const textContent = content.replace(/<[^>]*>/g, '')
      return textContent.length <= 50
    }

    // 将 Markdown 转为安全的 HTML
    // 支持标题、列表、代码块、表格、行内代码、粗体/斜体、链接/图片等
    const formatMessage = (content) => {
      if (!content) return ''
      try {
        const html = marked.parse(String(content), {
          gfm: true,
          breaks: true
        })
        // 统一在此净化，避免 XSS
        return DOMPurify.sanitize(html, {
          USE_PROFILES: { html: true }
        })
      } catch (e) {
        // 回退：纯文本换行
        return String(content).replace(/\n/g, '<br>')
      }
    }

    // 判断是否为可内嵌渲染的图表/可视化 HTML（Chart.js/ECharts/Mermaid 等）
    const isEmbeddableHtml = (content) => {
      if (!content) return false
      const lower = String(content).toLowerCase()
      // 关键特征：
      const hasCanvas = lower.includes('<canvas')
      const hasChartJs = lower.includes('chart.js') || lower.includes('cdn.jsdelivr.net/npm/chart') || lower.includes('new chart(')
      const hasEcharts = lower.includes('echarts') || lower.includes('cdn.jsdelivr.net/npm/echarts') || lower.includes('echarts.init(')
      const hasMermaid = lower.includes('mermaid') || lower.includes('<div class="mermaid"') || lower.includes('mermaid.min.js')
      return (hasCanvas && hasChartJs) || hasEcharts || hasMermaid
    }

    // 尝试从 Markdown 代码围栏中提取 HTML
    const extractHtml = (content) => {
      if (!content) return ''
      const fence = content.match(/```html[\r\n]+([\s\S]*?)```/i)
      if (fence) return fence[1]
      return content
    }

    // 格式化时间
    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 切换侧边栏
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
      // 打开侧边栏时隐藏提示
      if (!sidebarCollapsed.value) {
        showMobileHint.value = false
        clearMobileHintTimer()
      }
    }

    // 关闭侧边栏
    const closeSidebar = () => {
      if (isMobile.value) {
        sidebarCollapsed.value = true
        // 关闭侧边栏时显示提示，3秒后自动隐藏
        showMobileHintWithTimer()
      }
    }

    // 显示移动端提示并设置定时器
    const showMobileHintWithTimer = () => {
      if (isMobile.value && sidebarCollapsed.value) {
        showMobileHint.value = true
        clearMobileHintTimer()
        mobileHintTimer = setTimeout(() => {
          showMobileHint.value = false
        }, 3000) // 3秒后自动隐藏
      }
    }

    // 清除移动端提示定时器
    const clearMobileHintTimer = () => {
      if (mobileHintTimer) {
        clearTimeout(mobileHintTimer)
        mobileHintTimer = null
      }
    }

    // 新建对话
    const startNewChat = () => {
      chatHistory.value = []
      currentMessage.value = ''
      currentChatId.value = null // 新对话从null开始，让后端创建
      if (isMobile.value) {
        sidebarCollapsed.value = true
        showMobileHintWithTimer()
      }
      // 加载用户信息和默认模型
      loadUserInfo()
    }

    // 选择对话
    const selectChat = async (chat) => {
      currentChatId.value = chat.id
      // 加载对话的消息历史
      await loadConversationMessages(chat.id)
      if (isMobile.value) {
        sidebarCollapsed.value = true
        showMobileHintWithTimer()
      }
    }

    // 清空所有对话
    const clearAllChats = async () => {
      if (confirm('确定要清空所有对话记录吗？')) {
        try {
          // 删除所有对话
          const deletePromises = chatHistoryList.value.map(chat => 
            remoteApiService.userMe.deleteAIConversation(chat.id)
          )
          await Promise.all(deletePromises)
          
          // 清空本地状态
          chatHistoryList.value = []
          chatHistory.value = []
          currentChatId.value = null
        } catch (error) {
          console.error('删除对话失败:', error)
          alert('删除对话失败，请重试')
        }
      }
    }

    // 删除单个对话
    const deleteIndividualChat = async (chatId) => {
      if (confirm('确定要删除此对话吗？')) {
        try {
          await remoteApiService.userMe.deleteAIConversation(chatId)
          
          const index = chatHistoryList.value.findIndex(chat => chat.id === chatId)
          if (index > -1) {
            chatHistoryList.value.splice(index, 1)
            // 如果删除的是当前对话，清空聊天记录
            if (chatId === currentChatId.value) {
              chatHistory.value = []
              // 如果还有其他对话，切换到第一个
              if (chatHistoryList.value.length > 0) {
                currentChatId.value = chatHistoryList.value[0].id
                await loadConversationMessages(currentChatId.value)
              } else {
                currentChatId.value = null
              }
            }
          }
        } catch (error) {
          console.error('删除对话失败:', error)
          alert('删除对话失败，请重试')
        }
      }
    }

    // 切换工具
    const toggleTool = (tool) => {
      if (!aiToolsEnabled.value) return
      const index = enabledTools.value.indexOf(tool)
      if (index > -1) {
        enabledTools.value.splice(index, 1)
      } else {
        enabledTools.value.push(tool)
      }
    }

    // 切换下拉菜单显示状态
    const toggleAiToolsDropdown = () => {
      showAiToolsDropdown.value = !showAiToolsDropdown.value
    }

    // 触发文件上传
    const triggerFileUpload = () => {
      fileUploadInput.value?.click()
    }

    // 处理文件上传
    const handleFileUpload = (event) => {
      const files = event.target.files
      if (files && files.length > 0) {
        const file = files[0]
        
        // 检查文件大小（限制为10MB）
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          alert('文件大小不能超过10MB')
          return
        }
        
        // 检查文件类型
        const allowedTypes = [
          'text/plain', 'text/markdown', 'text/x-markdown',
          'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          alert('不支持的文件类型。支持的格式：TXT, MD, PDF, DOCX, JPG, PNG, GIF, WEBP')
          return
        }
        
        // 保存文件
        uploadedFile.value = file
        uploadedFileName.value = file.name
        
        // 清空input，允许重复选择同一文件
        event.target.value = ''
        
        // 计算文件大小显示
        const sizeKB = (file.size / 1024).toFixed(1)
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
        const sizeDisplay = file.size > 1024 * 1024 ? `${sizeMB}MB` : `${sizeKB}KB`
        
        console.log('文件已选择:', file.name, '大小:', sizeDisplay, '类型:', file.type)
      }
    }

    // 清除上传的文件
    const clearUploadedFile = () => {
      uploadedFile.value = null
      uploadedFileName.value = ''
    }

    // 发送建议问题
    const sendSuggestion = (suggestion) => {
      currentMessage.value = suggestion
      sendMessage()
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
        }
      })
    }

  // 发送消息（对接后端 /ai/qa）
  const sendMessage = async () => {
      if (!currentMessage.value.trim() || isTyping.value) return

      const userMessage = currentMessage.value.trim()
      const timestamp = new Date()

      // 添加用户消息
      chatHistory.value.push({
        id: Date.now(),
        type: 'user',
        content: userMessage,
        timestamp
      })

      currentMessage.value = ''
      isTyping.value = true
      scrollToBottom()
      dailyUsage.value++
      
      // 组装 AI 选项
      let preferredTools = null
      
      if (aiToolsEnabled.value) {
        // 检查是否启用了所有工具（当所有三个工具都选中时发送 "all"）
        const allToolsSelected = enabledTools.value.includes('knowledge') && 
                                 enabledTools.value.includes('web') && 
                                 enabledTools.value.includes('mcp')
        
        if (allToolsSelected) {
          preferredTools = "all"
        } else if (enabledTools.value.length > 0) {
          // 构建工具数组
          const toolsArray = []
          if (enabledTools.value.includes('knowledge')) toolsArray.push('rag')
          if (enabledTools.value.includes('web')) toolsArray.push('web_search')
          if (enabledTools.value.includes('mcp')) toolsArray.push('mcp_tool')
          
          preferredTools = toolsArray.length > 0 ? toolsArray : null
        }
        // 如果 aiToolsEnabled 为 true 但没有选择工具，preferredTools 保持 null
      }

      // 后端开关：use_tools；当存在上传文件时也开启，避免工具链无法处理文件
      const useTools = aiToolsEnabled.value || (uploadedFile.value !== null)

      // 调试信息 - 显示当前配置对应的测试用例
      const getTestCase = () => {
        if (!aiToolsEnabled.value) return '场景: 未启用 | use_tools: false | preferred_tools: null'
        if (enabledTools.value.length === 0) return '场景: 无偏好 | use_tools: true | preferred_tools: null'
        if (enabledTools.value.length === 3) return '场景: 所有工具 | use_tools: true | preferred_tools: "all"'
        if (enabledTools.value.includes('knowledge') && enabledTools.value.includes('web')) return '场景: 多工具 | use_tools: true | preferred_tools: ["rag", "web_search"]'
        if (enabledTools.value.includes('knowledge')) return '场景: 基础RAG | use_tools: true | preferred_tools: ["rag"]'
        return '场景: 其他组合'
      }
      
      console.log('工具调用参数:', {
        aiToolsEnabled: aiToolsEnabled.value,
        enabledTools: enabledTools.value,
        useTools,
        preferredTools,
        测试用例: getTestCase()
      })

      // 若后端未要求强制指定模型，这里传 null 使用用户默认；保留 UI 下拉但不强绑 ID
      const llmModelId = null

      try {
        const res = await remoteApiService.ai.qa(userMessage, {
          conversationId: currentChatId.value || null, // 传递对话ID用于上下文
          kbIds: null, // 可后续在界面添加选择后传入数组
          noteIds: null,
          useTools,
          preferredTools, // 直接传递 preferredTools（可能是 null、数组或 "all"）
          llmModelId,
          uploadedFile: uploadedFile.value // 传递上传的文件
        })

        const payload = res?.data ?? res
        if (!payload?.success) {
          const errMsg = payload?.message || 'AI 服务暂不可用，请稍后重试。'
          chatHistory.value.push({
            id: Date.now(),
            type: 'ai',
            content: `❗${errMsg}`,
            timestamp: new Date(),
            model: selectedModel.value
          })
        } else {
          // 根据API文档，直接从响应中获取数据
          const ai = payload.data || {}
          const answer = ai.answer || '（无内容）'
          const usedModel = ai.llm_model_used || selectedModel.value
          const mode = ai.answer_mode
          
          // 更新当前对话ID
          if (ai.conversation_id && ai.conversation_id !== currentChatId.value) {
            currentChatId.value = ai.conversation_id
            // 刷新对话列表以获取最新的对话信息
            await loadConversations()
          }

          // 附带少量元信息（模式/来源/搜索）
          const sources = Array.isArray(ai.source_articles) ? ai.source_articles : []
          const searches = Array.isArray(ai.search_results) ? ai.search_results : []
          const tools = Array.isArray(ai.tool_calls) ? ai.tool_calls : []

          // 先立即添加AI回复消息给用户即时反馈
          const metaParts = []
          if (mode) metaParts.push(`模式：${mode}`)
          if (sources.length) metaParts.push(`来源：${sources.length}`)
          if (searches.length) metaParts.push(`搜索：${searches.length}`)
          if (tools.length) metaParts.push(`工具：${tools.length}`)
          const metaLine = metaParts.length ? `<br><div style="color:#6b7280;font-size:12px;">${metaParts.join(' ｜ ')}</div>` : ''

          // 将 AI 文本中的“工具调用日志”剥离成独立展示
          const { cleanedText, steps } = parseToolLogsFromText(answer)
          // 先插入工具步骤（临时展示，稍后会用历史刷新替换为后端真实记录）
          steps.forEach((s, idx) => {
            chatHistory.value.push({
              id: `temp-step-${Date.now()}-${idx}`,
              displayType: 'tool-step',
              type: 'ai',
              timestamp: new Date(),
              toolName: s.toolName,
              call: s.callText,
              output: s.outputText ? { output: s.outputText } : null,
              status: 'done',
              expanded: false
            })
          })

          // 再插入清理后的 AI 正文
          chatHistory.value.push({
            id: Date.now(),
            type: 'ai',
            content: `${cleanedText || ''}${metaLine}`.trim(),
            timestamp: new Date(),
            model: usedModel
          })

          // 如果有工具调用，可以在后台异步刷新消息历史以显示工具步骤（可选）
          // 这样用户立即看到AI回复，工具步骤稍后加载
          if (currentChatId.value && tools.length > 0) {
            setTimeout(async () => {
              try { 
                await loadConversationMessages(currentChatId.value)
              } catch (error) {
                console.log('后台刷新消息历史失败:', error)
              }
            }, 1000) // 1秒后刷新，给后端时间保存工具调用记录
          }
        }
      } catch (err) {
        chatHistory.value.push({
          id: Date.now(),
          type: 'ai',
          content: `❗请求失败：${err?.message || '未知错误'}`,
          timestamp: new Date(),
          model: selectedModel.value
        })
      } finally {
        isTyping.value = false
        clearUploadedFile() // 清除上传的文件
        scrollToBottom()
      }
    }

    // 处理输入键盘事件
    const handleInputKeydown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    }

    // 自动调整输入框高度
    const adjustTextareaHeight = () => {
      nextTick(() => {
        if (chatInputRef.value) {
          chatInputRef.value.style.height = 'auto'
          chatInputRef.value.style.height = Math.min(chatInputRef.value.scrollHeight, 120) + 'px'
        }
      })
    }

    // 切换模型
    const switchModel = () => {
      console.log('切换到模型:', selectedModel.value)
    }

    // 用户相关操作
    const toggleSettings = () => {
      showSettingsPanel.value = !showSettingsPanel.value
    }

    const goHome = () => {
      // 返回首页
      window.location.href = '/'
    }

    const goBack = async () => {
      ElectronDiagnostics.debug('智库返回首页按钮被点击')
      
      // 添加更详细的环境检测
      const isElectron = window.navigator.userAgent.indexOf('Electron') !== -1
      const currentURL = window.location.href
      const currentHash = window.location.hash
      
      console.log('导航环境信息:', {
        isElectron,
        currentURL,
        currentHash,
        routerPath: router.currentRoute.value.path
      })
      
      try {
        if (isElectron) {
          console.log('Electron环境 - 尝试router.push')
          await router.push('/')
          console.log('router.push 成功')
        } else {
          console.log('浏览器环境 - 尝试router.push')
          await router.push('/')
          console.log('router.push 成功')
        }
      } catch (error) {
        console.error('router.push 失败:', error)
        
        // 在Electron环境中的特殊处理
        if (isElectron) {
          try {
            console.log('Electron - 尝试hash导航')
            // 直接设置hash为根路径
            window.location.hash = '#/'
            console.log('hash导航完成')
          } catch (hashError) {
            console.error('hash导航失败:', hashError)
            // 最后的备选方案：重新加载页面到根路径
            const baseUrl = window.location.href.split('#')[0]
            window.location.href = baseUrl + '#/'
          }
        } else {
          // 浏览器环境的备选方案
          if (window.history.length > 1) {
            window.history.back()
          } else {
            window.location.href = '/'
          }
        }
      }
    }

    // 聊天操作
    const shareChat = () => {
      console.log('分享对话')
    }

    // 监听窗口大小变化
    onMounted(async () => {
      const handleResize = () => {
        const wasMobile = isMobile.value
        isMobile.value = window.innerWidth <= 768
        
        // 如果从桌面端切换到移动端，显示提示
        if (!wasMobile && isMobile.value && sidebarCollapsed.value) {
          showMobileHintWithTimer()
        }
        // 如果从移动端切换到桌面端，隐藏提示
        if (wasMobile && !isMobile.value) {
          showMobileHint.value = false
          clearMobileHintTimer()
        }
      }
      
      // 点击外部关闭下拉菜单
      const handleClickOutside = (event) => {
        const dropdown = event.target.closest('.ai-tools-dropdown')
        if (!dropdown && showAiToolsDropdown.value) {
          showAiToolsDropdown.value = false
        }
      }
      
      window.addEventListener('resize', handleResize)
      document.addEventListener('click', handleClickOutside)
      scrollToBottom()
      
      // 初始化时如果是移动端则显示提示
      if (isMobile.value && sidebarCollapsed.value) {
        showMobileHintWithTimer()
      }

      // 加载对话列表
      await loadConversations()
      
      // 加载用户信息和默认模型
      await loadUserInfo()
      
      // 如果有对话，默认选择第一个
      if (chatHistoryList.value.length > 0) {
        currentChatId.value = chatHistoryList.value[0].id
        await loadConversationMessages(currentChatId.value)
      }

      return () => {
        window.removeEventListener('resize', handleResize)
        document.removeEventListener('click', handleClickOutside)
        clearMobileHintTimer()
      }
    })

    return {
      sidebarCollapsed,
      selectedModel,
      userDefaultModel,
      getCurrentModel,
      currentMessage,
  enabledTools,
  aiToolsEnabled,
      isTyping,
      chatHistory,
      chatHistoryList,
      currentChatId,
      currentChatTitle,
      dailyUsage,
      isMobile,
      showMobileHint,
      modelTemperature,
      contextLength,
      showSettingsPanel,
      chatMessagesRef,
      chatInputRef,
      fileUploadInput,
      uploadedFile,
      uploadedFileName,
      toggleSidebar,
      closeSidebar,
      startNewChat,
      selectChat,
      clearAllChats,
      deleteIndividualChat,
      toggleTool,
      toggleAiToolsDropdown,
      showAiToolsDropdown,
      triggerFileUpload,
      handleFileUpload,
      clearUploadedFile,
      sendSuggestion,
      formatMessage,
  isEmbeddableHtml,
  extractHtml,
      formatTime,
      isShortMessage,
      sendMessage,
      // 工具步骤交互
      toggleToolStepExpanded: (msg) => { msg.expanded = !msg.expanded },
      getToolStepSummary: (msg) => {
        const tool = msg?.toolName || '工具'
        if (!msg.output) {
          // 构造简要提示（例如：正在搜索天气...）
          const first = Array.isArray(msg.call?.calls) ? msg.call.calls[0] : null
          const argStr = first?.function?.arguments || ''
          let hint = ''
          if (typeof argStr === 'string') {
            hint = (() => { try { const j = JSON.parse(argStr); return j.query || '' } catch { return '' } })()
          } else if (argStr && typeof argStr === 'object') {
            hint = argStr.query || ''
          }
          return `正在调用 ${tool}${hint ? `：${hint}` : ''}...`
        }
        // 已完成，给出简短总结
        return `调用 ${tool} 已完成`
      },
      formatJson: (obj) => {
        try {
          const str = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2)
          // 简单转义并换行转 <br>，保留缩进
          return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>')
            .replace(/\s{2}/g, '&nbsp;&nbsp;')
        } catch {
          return String(obj)
        }
      },
      handleInputKeydown,
      adjustTextareaHeight,
      switchModel,
      toggleSettings,
      goHome,
      goBack,
      shareChat,
      loadConversations,
      loadConversationMessages,
      loadUserInfo,
      formatRelativeTime
    }
  }
}
</script>

<style scoped>
.knowledge-hub {
  display: flex;
  height: 100vh;
  background: #f7f8fa;
  overflow: hidden;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* 移动端提示 */
.mobile-hint {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 1001;
  display: none;
}

@media (max-width: 768px) {
  .mobile-hint {
    display: block;
  }
}

/* 左上角菜单按钮 */
.top-menu-toggle {
  position: fixed;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top-menu-toggle:hover {
  background: #f5f5f5;
  color: #333;
}

/* 聊天容器 */
.chat-container {
  display: flex;
  width: 100%;
  height: 100%;
}

/* 侧边栏遮罩层 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* 聊天侧边栏 */
.chat-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e6ea;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 999;
}

@media (max-width: 768px) {
  .chat-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
  }
  
  .chat-sidebar.mobile-open {
    transform: translateX(0);
  }
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e5e6ea;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.logo-icon {
  font-size: 24px;
}

.logo-section h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.new-chat-btn {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* 聊天历史区域 */
.chat-history-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.history-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.chat-history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-history-item {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.delete-chat-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
  opacity: 0;
}

.chat-history-item:hover .delete-chat-btn {
  opacity: 1;
}

.delete-chat-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

.chat-history-item:hover {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.chat-history-item.active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.chat-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 12px;
  color: #6b7280;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e5e6ea;
  position: relative;
}

.sidebar-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #e5e6ea;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 16px;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* 设置面板 */
.settings-panel {
  position: absolute;
  bottom: 100%;
  left: 20px;
  right: 20px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.settings-panel.show {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.settings-content {
  padding: 20px;
}

.settings-content h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  appearance: none;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #e5e6ea;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-value {
  min-width: 40px;
  font-size: 12px;
  font-weight: 500;
  color: #3b82f6;
  text-align: right;
}

/* 主聊天区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  margin-left: 0;
}

@media (max-width: 768px) {
  .chat-main {
    margin-left: 0;
    width: 100%;
  }
}

/* 聊天头部 */
.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e6ea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: relative;
}

.chat-title-section {
  text-align: center;
  flex: 1;
}

.chat-title-section h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.chat-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.model-indicator {
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.separator {
  color: #d1d5db;
}

.chat-actions {
  display: flex;
  gap: 8px;
  position: absolute;
  right: 24px;
}

/* 聊天消息容器 */
.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  /* 防止超长内容将容器横向撑破 */
  overflow-x: hidden;
  background: #f7f8fa;
  position: relative;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.welcome-avatar {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-section h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.welcome-section p {
  margin: 0 0 32px 0;
  font-size: 16px;
  color: #6b7280;
  max-width: 400px;
}

.suggestion-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 600px;
  width: 100%;
}

.suggestion-card {
  padding: 20px;
  border: 1px solid #e5e6ea;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.suggestion-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.suggestion-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.suggestion-text {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

/* 聊天消息 */
.chat-messages {
  padding: 24px;
  min-height: 100%;
}

.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  background: #f3f4f6;
}

.chat-message.user .message-avatar {
  background: #3b82f6;
  color: white;
}

.chat-message.ai .message-avatar {
  background: #10b981;
  color: white;
}

.message-content {
  flex: 1;
  max-width: calc(100% - 44px);
  display: flex;
  flex-direction: column;
}

.chat-message.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.5;
  font-size: 14px;
  /* 强化长文本断行策略，处理超长URL/连续字符 */
  word-wrap: break-word;          /* 兼容旧规范 */
  overflow-wrap: anywhere;        /* 优先使用 */
  word-break: break-word;         /* 多数浏览器生效 */
  max-width: 100%;
  display: inline-block;
}

/* 限制富文本内容不溢出，图片/表格自适应（v-html 需使用 :deep） */
.message-bubble :deep(*) {
  max-width: 100%;
}

.message-bubble :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}

.message-bubble :deep(table) {
  width: 100%;
  table-layout: fixed;
  word-break: break-word;
}

/* Markdown 列表与序号与气泡左边距拉开 */
.message-bubble :deep(ul),
.message-bubble :deep(ol) {
  padding-left: 1.25rem;   /* 增加整体左内边距 */
  margin-left: 0;          /* 避免双重缩进 */
  list-style-position: outside; /* 标记在外，避免与文本重叠 */
  margin-top: 0.4em;
  margin-bottom: 0.4em;
}

.message-bubble :deep(li) {
  margin: 0.2em 0;         /* 行间距更舒适 */
  padding-left: 0.1rem;    /* 文本与标记再留一点空间 */
}

/* 代码块和链接的溢出处理 */
.message-bubble :deep(pre),
.message-bubble :deep(code) {
  white-space: pre-wrap;      /* 保留换行并可换行 */
  word-break: break-word;
}

.message-bubble :deep(pre) {
  overflow: auto;
  background: #f8fafc;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  padding: 10px;
}

.message-bubble :deep(a) {
  word-break: break-all;      /* 超长URL可任意断开 */
}

.message-bubble.short {
  max-width: fit-content;
  min-width: 60px;
}

.chat-message.user .message-bubble {
  background: #3b82f6;
  color: white;
}

.chat-message.user .message-bubble.short {
  margin-left: 0;
}

.chat-message.ai .message-bubble {
  background: white;
  color: #1f2937;
  border: 1px solid #e5e6ea;
  margin-right: 10%;
}

.chat-message.ai .message-bubble.short {
  margin-right: auto;
  margin-left: 0;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  margin-left: 16px;
}

.chat-message.user .message-time {
  text-align: right;
  margin-right: 16px;
  margin-left: 0;
}

/* 模型名称显示 */
.model-name {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  margin-left: 16px;
  font-weight: 500;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 16px;
  margin-right: 10%;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.chat-input-section {
  border-top: 1px solid #e5e6ea;
  background: white;
  padding: 16px 24px;
}

/* 工具步骤卡片样式 */
.tool-step-card {
  background: #f8fafc;
  border: 1px solid #e5e6ea;
  border-left: 4px solid #8b5cf6; /* 紫色强调 */
  border-radius: 12px;
  padding: 10px 12px;
  margin-right: 10%;
}

.tool-step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.tool-step-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111827;
}

.tool-badge {
  background: #ede9fe;
  color: #6d28d9;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.tool-step-status {
  margin-left: 6px;
  font-size: 12px;
  color: #6b7280;
}

.tool-step-status.running { color: #d97706; }
.tool-step-status.done { color: #059669; }

.tool-step-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
}

.toggle-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}
.toggle-arrow.expanded {
  transform: rotate(90deg);
}

.tool-step-summary {
  margin-top: 6px;
  font-size: 13px;
  color: #374151;
}

.tool-step-details {
  margin-top: 10px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  padding: 10px;
}

.tool-detail-block {
  margin-bottom: 10px;
}
.tool-detail-block:last-child { margin-bottom: 0; }

.detail-title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

.json-view {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.4;
  background: #f8fafc;
  border: 1px solid #e5e6ea;
  border-radius: 6px;
  padding: 8px;
  overflow-x: auto;
}

.no-output {
  font-size: 12px;
  color: #9ca3af;
}

/* 输入工具栏 */
.input-tools {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e5e6ea;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #6b7280;
}

.tool-btn:hover,
.tool-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

.tool-icon {
  font-size: 14px;
}

.tool-text {
  font-weight: 500;
}

/* 总开关关闭时的视觉弱化 */
.tool-btn.dimmed {
  opacity: 0.5;
  filter: grayscale(10%);
}

/* 已移除工具提示文案，无需样式 */

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(10%);
}

.tool-btn:disabled:hover {
  background: white;
  border-color: #e5e6ea;
  color: #6b7280;
}

/* 上传文件预览区域 */
.uploaded-file-preview {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  color: #6b7280;
  flex-shrink: 0;
}

.file-name {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-file-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* 输入区域 */
.input-area {
  margin-bottom: 12px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e5e6ea;
  border-radius: 24px;
  background: white;
  transition: border-color 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  background: transparent;
  min-height: 32px;
  max-height: 120px;
}

.chat-input::placeholder {
  color: #9ca3af;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:hover:not(:disabled) {
  background: #2563eb;
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 输入底部 */
.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
}

.model-display {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;
}

.model-display label {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.current-model {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}

.model-note {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

.usage-info {
  font-size: 12px;
  color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 12px 16px;
  }
  
  .chat-actions {
    right: 16px;
  }
  
  .chat-messages {
    padding: 16px;
  }
  
  .chat-input-section {
    padding: 12px 16px;
  }
  
  .input-tools {
    gap: 8px;
  }
  
  .tool-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .suggestion-cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .message-bubble {
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: 90%;
  }
  
  .chat-message.user .message-bubble {
    margin-left: 8px !important;
  }
  
  .chat-message.user .message-bubble.short {
    margin-left: 8px !important;
  }
  
  .chat-message.ai .message-bubble {
    margin-right: 5% !important;
  }
  
  .message-bubble.short {
    max-width: 70% !important;
  }
}

/* 滚动条样式 */
.chat-messages-container::-webkit-scrollbar,
.chat-history-section::-webkit-scrollbar {
  width: 4px;
}

.chat-messages-container::-webkit-scrollbar-track,
.chat-history-section::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages-container::-webkit-scrollbar-thumb,
.chat-history-section::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

/* AI工具下拉菜单样式 */
.tool-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e5e6ea;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #6b7280;
}

.dropdown-toggle:hover,
.dropdown-toggle.active,
.tool-dropdown.active .dropdown-toggle {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.tool-dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 4px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
}

.dropdown-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.dropdown-switch input[type="checkbox"] {
  position: relative;
  width: 44px;
  height: 24px;
  appearance: none;
  background: #e5e6ea;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.dropdown-switch input[type="checkbox"]:checked {
  background: #3b82f6;
}

.dropdown-switch input[type="checkbox"]::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dropdown-switch input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}

.switch-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
}

.dropdown-options {
  padding: 8px 0;
}

.dropdown-options.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
}

.dropdown-option:hover {
  background: #f9fafb;
}

.dropdown-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  appearance: none;
  background: white;
  transition: all 0.2s ease;
}

.dropdown-option input[type="checkbox"]:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.dropdown-option input[type="checkbox"]:checked::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.dropdown-option input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-icon {
  font-size: 14px;
}

.option-text {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.chat-messages-container::-webkit-scrollbar-thumb:hover,
.chat-history-section::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
