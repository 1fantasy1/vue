<template>
  <div class="knowledge-hub">
    <!-- 移动端提示 -->
    <div class="mobile-hint" v-show="isMobile && sidebarCollapsed">点击左上角菜单图标打开侧边栏</div>
    
    <div class="doubao-container">
      <!-- 左侧边栏 -->
      <div class="doubao-sidebar" :class="{ 'mobile-open': !sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="header-top">
            <button class="back-btn" @click="goBack" title="返回首页">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
              </svg>
            </button>
            <div class="logo-section">
              <div class="logo-icon">🧠</div>
              <h2>智库助手</h2>
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
            <button class="clear-btn" @click="clearAllChats">🗑️</button>
          </div>
          <div class="chat-history-list">
            <div 
              v-for="chat in chatHistoryList" 
              :key="chat.id"
              class="chat-history-item" 
              :class="{ active: chat.id === currentChatId }"
              @click="selectChat(chat)"
            >
              <div class="chat-title">{{ chat.title }}</div>
              <div class="chat-time">{{ chat.time }}</div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-footer">
          <div class="user-profile" @click="showUserProfile">
            <div class="user-avatar">👤</div>
            <div class="user-info">
              <div class="user-name">用户</div>
              <div class="user-plan">智库专业版</div>
            </div>
          </div>
          <div class="sidebar-actions">
            <button class="action-btn" @click="showSettings" title="设置">⚙️</button>
            <button class="action-btn" @click="showHelp" title="帮助">❓</button>
            <button class="action-btn" @click="goHome" title="返回首页">🏠</button>
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
      <div class="doubao-main">
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
            <button class="action-btn" @click="exportChat" title="导出对话">💾</button>
            <button class="action-btn" @click="deleteChat" title="删除对话">🗑️</button>
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

          <div class="chat-messages">
            <div 
              v-for="message in chatHistory" 
              :key="message.id" 
              class="doubao-message" 
              :class="message.type"
            >
              <div class="doubao-message-avatar">
                <span v-if="message.type === 'user'">👤</span>
                <span v-else>🧠</span>
              </div>
              <div class="doubao-message-content">
                <div class="doubao-message-bubble" v-html="formatMessage(message.content)"></div>
                <div class="doubao-message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>

            <div v-if="isTyping" class="doubao-message ai">
              <div class="doubao-message-avatar">🧠</div>
              <div class="doubao-message-content">
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
            <button 
              class="tool-btn" 
              :class="{ active: enabledTools.includes('knowledge') }"
              @click="toggleTool('knowledge')" 
              title="知识库检索"
            >
              <span class="tool-icon">�</span>
              <span class="tool-text">知识库</span>
            </button>
            <button 
              class="tool-btn" 
              :class="{ active: enabledTools.includes('web') }"
              @click="toggleTool('web')" 
              title="网络搜索"
            >
              <span class="tool-icon">🌐</span>
              <span class="tool-text">网络搜索</span>
            </button>
            <button 
              class="tool-btn" 
              :class="{ active: enabledTools.includes('code') }"
              @click="toggleTool('code')" 
              title="代码执行"
            >
              <span class="tool-icon">💻</span>
              <span class="tool-text">代码执行</span>
            </button>
          </div>
          
          <div class="input-area">
            <div class="input-wrapper">
              <button class="upload-btn" @click="triggerFileUpload" title="上传文件">
                <svg class="upload-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,12L16,16H13.5V19H10.5V16H8L12,12Z"></path>
                </svg>
              </button>
              <input 
                type="file" 
                ref="fileUploadInput" 
                style="display: none;" 
                @change="handleFileUpload" 
                multiple 
                accept=".txt,.pdf,.doc,.docx,.jpg,.png,.gif"
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
            <div class="model-selector">
              <label>模型：</label>
              <select v-model="selectedModel" @change="switchModel" class="model-select">
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude-3</option>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="local">本地模型</option>
              </select>
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
import { ref, computed, nextTick, onMounted } from 'vue'

export default {
  name: 'KnowledgeHub',
  setup() {
    const sidebarCollapsed = ref(true) // 默认隐藏侧边栏
    const selectedModel = ref('gpt-4')
    const currentMessage = ref('')
    const enabledTools = ref(['knowledge', 'web'])
    const isTyping = ref(false)
    const chatMessagesRef = ref(null)
    const chatInputRef = ref(null)
    const fileUploadInput = ref(null)
    const currentChatId = ref(1)
    const dailyUsage = ref(12)

    // 检查是否为移动设备
    const isMobile = ref(window.innerWidth <= 768)

    // 聊天历史列表
    const chatHistoryList = ref([
      {
        id: 1,
        title: '机器学习创新思维',
        time: '2小时前'
      },
      {
        id: 2,
        title: '深度学习项目规划',
        time: '昨天'
      },
      {
        id: 3,
        title: '数据分析方法论',
        time: '3天前'
      },
      {
        id: 4,
        title: '创新项目管理',
        time: '1周前'
      }
    ])

    // 当前对话历史
    const chatHistory = ref([
      {
        id: 1,
        type: 'user',
        content: '如何在机器学习项目中应用创新思维？',
        timestamp: new Date(Date.now() - 10000)
      },
      {
        id: 2,
        type: 'ai',
        content: '在机器学习项目中应用创新思维可以从以下几个维度考虑：<br><br><strong>🎯 问题重新定义</strong><br>• 不要局限于传统的解决方案<br>• 从多个角度审视问题本质<br>• 尝试将复杂问题分解为更简单的子问题<br><br><strong>📊 数据创新</strong><br>• 探索非传统数据源和特征工程<br>• 尝试数据增强和合成技术<br>• 考虑多模态数据融合<br><br><strong>🔬 模型融合</strong><br>• 尝试不同算法的创新组合<br>• 探索集成学习的新方法<br>• 引入领域知识指导模型设计<br><br><strong>🌐 跨领域应用</strong><br>• 将其他领域的方法引入机器学习<br>• 借鉴生物学、物理学等领域的原理<br>• 探索与其他技术的结合可能性',
        timestamp: new Date(Date.now() - 5000)
      }
    ])

    // 计算当前聊天标题
    const currentChatTitle = computed(() => {
      const currentChat = chatHistoryList.value.find(chat => chat.id === currentChatId.value)
      return currentChat ? currentChat.title : '新建对话'
    })

    // 格式化消息内容
    const formatMessage = (content) => {
      return content.replace(/\n/g, '<br>')
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
    }

    // 关闭侧边栏
    const closeSidebar = () => {
      if (isMobile.value) {
        sidebarCollapsed.value = true
      }
    }

    // 新建对话
    const startNewChat = () => {
      chatHistory.value = []
      currentMessage.value = ''
      currentChatId.value = Date.now()
      chatHistoryList.value.unshift({
        id: currentChatId.value,
        title: '新建对话',
        time: '刚刚'
      })
      if (isMobile.value) {
        sidebarCollapsed.value = true
      }
    }

    // 选择对话
    const selectChat = (chat) => {
      currentChatId.value = chat.id
      // 这里可以加载对应的聊天记录
      if (isMobile.value) {
        sidebarCollapsed.value = true
      }
    }

    // 清空所有对话
    const clearAllChats = () => {
      if (confirm('确定要清空所有对话记录吗？')) {
        chatHistoryList.value = []
        chatHistory.value = []
      }
    }

    // 切换工具
    const toggleTool = (tool) => {
      const index = enabledTools.value.indexOf(tool)
      if (index > -1) {
        enabledTools.value.splice(index, 1)
      } else {
        enabledTools.value.push(tool)
      }
    }

    // 触发文件上传
    const triggerFileUpload = () => {
      fileUploadInput.value?.click()
    }

    // 处理文件上传
    const handleFileUpload = (event) => {
      const files = event.target.files
      if (files && files.length > 0) {
        // 处理文件上传逻辑
        console.log('上传文件:', files)
      }
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

    // 发送消息
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

      // 模拟AI回复
      setTimeout(() => {
        const responses = [
          '这是一个非常有趣的问题！让我基于知识库为您分析...',
          '根据我的理解，这个问题可以从几个角度来看：<br><br>1. 首先考虑基本原理<br>2. 然后分析实际应用<br>3. 最后提供具体建议',
          '我建议您可以尝试以下方法来解决这个问题...',
          '这个话题确实值得深入探讨。基于相关研究和实践经验...'
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        chatHistory.value.push({
          id: Date.now(),
          type: 'ai',
          content: `${randomResponse}<br><br>针对您的问题"${userMessage}"，我认为需要从多个维度来分析。如果您需要更详细的解释，请随时告诉我！`,
          timestamp: new Date()
        })
        
        isTyping.value = false
        scrollToBottom()
      }, 1500 + Math.random() * 1000)
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
    const showUserProfile = () => {
      console.log('显示用户资料')
    }

    const showSettings = () => {
      console.log('显示设置')
    }

    const showHelp = () => {
      console.log('显示帮助')
    }

    const goHome = () => {
      console.log('返回首页')
    }

    const goBack = () => {
      // 使用 Vue Router 返回首页
      window.history.back() || (window.location.href = '/')
    }

    // 聊天操作
    const shareChat = () => {
      console.log('分享对话')
    }

    const exportChat = () => {
      console.log('导出对话')
    }

    const deleteChat = () => {
      if (confirm('确定要删除此对话吗？')) {
        console.log('删除对话')
      }
    }

    // 监听窗口大小变化
    onMounted(() => {
      const handleResize = () => {
        isMobile.value = window.innerWidth <= 768
      }
      
      window.addEventListener('resize', handleResize)
      scrollToBottom()

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    })

    return {
      sidebarCollapsed,
      selectedModel,
      currentMessage,
      enabledTools,
      isTyping,
      chatHistory,
      chatHistoryList,
      currentChatId,
      currentChatTitle,
      dailyUsage,
      isMobile,
      chatMessagesRef,
      chatInputRef,
      fileUploadInput,
      toggleSidebar,
      closeSidebar,
      startNewChat,
      selectChat,
      clearAllChats,
      toggleTool,
      triggerFileUpload,
      handleFileUpload,
      sendSuggestion,
      formatMessage,
      formatTime,
      sendMessage,
      handleInputKeydown,
      adjustTextareaHeight,
      switchModel,
      showUserProfile,
      showSettings,
      showHelp,
      goHome,
      goBack,
      shareChat,
      exportChat,
      deleteChat
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

/* 豆包容器 */
.doubao-container {
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

/* 豆包侧边栏 */
.doubao-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e6ea;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 999;
}

@media (max-width: 768px) {
  .doubao-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
  }
  
  .doubao-sidebar.mobile-open {
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
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #9ca3af;
  font-size: 16px;
}

.clear-btn:hover {
  color: #ef4444;
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
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: 16px;
}

.user-profile:hover {
  background: #f9fafb;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.user-plan {
  font-size: 12px;
  color: #6b7280;
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

/* 主聊天区域 */
.doubao-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  margin-left: 0;
}

@media (max-width: 768px) {
  .doubao-main {
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
}

/* 聊天消息容器 */
.chat-messages-container {
  flex: 1;
  overflow-y: auto;
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

.doubao-message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.doubao-message.user {
  flex-direction: row-reverse;
}

.doubao-message-avatar {
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

.doubao-message.user .doubao-message-avatar {
  background: #3b82f6;
  color: white;
}

.doubao-message.ai .doubao-message-avatar {
  background: #10b981;
  color: white;
}

.doubao-message-content {
  flex: 1;
  max-width: calc(100% - 44px);
}

.doubao-message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.5;
  font-size: 14px;
  word-wrap: break-word;
}

.doubao-message.user .doubao-message-bubble {
  background: #3b82f6;
  color: white;
  margin-left: 20%;
}

.doubao-message.ai .doubao-message-bubble {
  background: white;
  color: #1f2937;
  border: 1px solid #e5e6ea;
  margin-right: 20%;
}

.doubao-message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  margin-left: 16px;
}

.doubao-message.user .doubao-message-time {
  text-align: right;
  margin-right: 16px;
  margin-left: 0;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 16px;
  margin-right: 20%;
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

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  color: #6b7280;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: #f3f4f6;
  color: #374151;
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

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-select {
  border: none;
  background: none;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
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
  
  .doubao-message-bubble {
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: 85%;
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

.chat-messages-container::-webkit-scrollbar-thumb:hover,
.chat-history-section::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
