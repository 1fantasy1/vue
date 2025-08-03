<template>
  <div class="page">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        返回首页
      </button>
      <h1 class="page-title">聊天室</h1>
    </div>

    <div class="chat-layout">
      <div class="sidebar">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          <input type="text" placeholder="搜索聊天室..." v-model="searchQuery">
        </div>

        <div class="chat-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            全部
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'project' }"
            @click="activeTab = 'project'"
          >
            项目群
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'course' }"
            @click="activeTab = 'course'"
          >
            课程群
          </button>
        </div>

        <div class="room-list">
          <div 
            class="room-item" 
            v-for="room in filteredRooms" 
            :key="room.id"
            :class="{ active: selectedRoom?.id === room.id }"
            @click="selectRoom(room)"
          >
            <div class="room-avatar">
              <div class="avatar-icon" :style="{ background: room.color }">
                {{ room.name.charAt(0) }}
              </div>
              <div class="online-indicator" v-if="room.online"></div>
            </div>
            <div class="room-info">
              <div class="room-header">
                <h4 class="room-name">{{ room.name }}</h4>
                <span class="room-time">{{ room.lastTime }}</span>
              </div>
              <div class="room-message">
                <span class="message-sender">{{ room.lastMessage.sender }}:</span>
                {{ room.lastMessage.content }}
              </div>
              <div class="unread-badge" v-if="room.unread > 0">{{ room.unread }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-area">
        <div class="chat-header" v-if="selectedRoom">
          <div class="chat-info">
            <div class="chat-avatar" :style="{ background: selectedRoom.color }">
              {{ selectedRoom.name.charAt(0) }}
            </div>
            <div>
              <h3 class="chat-name">{{ selectedRoom.name }}</h3>
              <p class="chat-members">{{ selectedRoom.members }}人 · {{ selectedRoom.type }}</p>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" @click="viewMembers">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
              </svg>
            </button>
            <button class="action-btn" @click="roomSettings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="messages-container" v-if="selectedRoom">
          <div class="message" v-for="message in messages" :key="message.id" :class="{ own: message.isOwn }">
            <div class="message-avatar" v-if="!message.isOwn">
              {{ message.sender.charAt(0) }}
            </div>
            <div class="message-content">
              <div class="message-header" v-if="!message.isOwn">
                <span class="message-sender">{{ message.sender }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-bubble">
                {{ message.content }}
              </div>
              <div class="message-time" v-if="message.isOwn">{{ message.time }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input" v-if="selectedRoom">
          <div class="input-container">
            <button class="attach-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z"/>
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="输入消息..." 
              v-model="newMessage"
              @keyup.enter="sendMessage"
            >
            <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="empty-state" v-else>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <h3>选择一个聊天室开始对话</h3>
          <p>点击左侧的聊天室开始与团队成员交流</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

export default {
  name: 'ChatRooms',
  setup() {
    const router = useRouter()
    const activeTab = ref('all')
    const searchQuery = ref('')
    const selectedRoom = ref(null)
    const newMessage = ref('')
    
    const rooms = ref([
      {
        id: 1,
        name: '智能学习系统开发团队',
        type: '项目群组',
        members: 4,
        lastTime: '2分钟前',
        lastMessage: {
          sender: '张三',
          content: '前端界面已经完成了80%'
        },
        unread: 3,
        online: true,
        color: '#667eea',
        category: 'project'
      },
      {
        id: 2,
        name: 'Vue.js学习小组',
        type: '课程群组',
        members: 12,
        lastTime: '10分钟前',
        lastMessage: {
          sender: '李四',
          content: '今天的作业有点难，大家一起讨论一下'
        },
        unread: 0,
        online: true,
        color: '#f093fb',
        category: 'course'
      },
      {
        id: 3,
        name: '移动端购物应用',
        type: '项目群组',
        members: 3,
        lastTime: '1小时前',
        lastMessage: {
          sender: '王五',
          content: '支付模块测试通过了'
        },
        unread: 1,
        online: false,
        color: '#4facfe',
        category: 'project'
      },
      {
        id: 4,
        name: 'Python数据分析交流群',
        type: '课程群组',
        members: 8,
        lastTime: '3小时前',
        lastMessage: {
          sender: '赵六',
          content: '分享一个很好用的数据可视化库'
        },
        unread: 5,
        online: true,
        color: '#43e97b',
        category: 'course'
      },
      {
        id: 5,
        name: '数据可视化平台',
        type: '项目群组',
        members: 2,
        lastTime: '昨天',
        lastMessage: {
          sender: '刘七',
          content: '项目已经上线，大家辛苦了！'
        },
        unread: 0,
        online: false,
        color: '#fa709a',
        category: 'project'
      }
    ])

    const messages = ref([
      {
        id: 1,
        sender: '张三',
        content: '大家好，今天的开发进度怎么样？',
        time: '10:30',
        isOwn: false
      },
      {
        id: 2,
        sender: '我',
        content: '我这边的用户界面基本完成了，正在做响应式适配',
        time: '10:32',
        isOwn: true
      },
      {
        id: 3,
        sender: '李四',
        content: '后端API已经部署到测试环境了，大家可以开始联调',
        time: '10:35',
        isOwn: false
      },
      {
        id: 4,
        sender: '我',
        content: '好的，我马上开始测试接口',
        time: '10:36',
        isOwn: true
      },
      {
        id: 5,
        sender: '张三',
        content: '前端界面已经完成了80%',
        time: '10:58',
        isOwn: false
      }
    ])

    const filteredRooms = computed(() => {
      let filtered = rooms.value
      
      if (activeTab.value !== 'all') {
        filtered = filtered.filter(room => room.category === activeTab.value)
      }
      
      if (searchQuery.value) {
        filtered = filtered.filter(room => 
          room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }
      
      return filtered
    })

    const goBack = () => {
      router.push('/')
    }

    const selectRoom = (room) => {
      selectedRoom.value = room
      // 标记为已读
      room.unread = 0
    }

    const sendMessage = () => {
      if (!newMessage.value.trim()) return
      
      const message = {
        id: Date.now(),
        sender: '我',
        content: newMessage.value,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      }
      
      messages.value.push(message)
      newMessage.value = ''
    }

    const viewMembers = () => {
      alert('查看群成员功能开发中...')
    }

    const roomSettings = () => {
      alert('群设置功能开发中...')
    }

    return {
      activeTab,
      searchQuery,
      selectedRoom,
      newMessage,
      rooms,
      messages,
      filteredRooms,
      goBack,
      selectRoom,
      sendMessage,
      viewMembers,
      roomSettings
    }
  }
}
</script>

<style scoped>
.page {
  padding: 24px;
  background: #f8f9fa;
  min-height: calc(100vh - 48px);
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 16px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.chat-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
}

.sidebar {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 36px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: #4facfe;
}

.chat-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 8px;
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #4facfe;
  color: white;
}

.room-list {
  flex: 1;
  overflow-y: auto;
}

.room-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 8px;
}

.room-item:hover {
  background: #f8f9fa;
}

.room-item.active {
  background: #e6f3ff;
  border-left: 4px solid #4facfe;
}

.room-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #28a745;
  border: 2px solid white;
  border-radius: 50%;
}

.room-info {
  flex: 1;
  min-width: 0;
  position: relative;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.room-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-time {
  font-size: 11px;
  color: #6c757d;
  flex-shrink: 0;
}

.room-message {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-sender {
  font-weight: 500;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #dc3545;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.chat-area {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 20px;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.chat-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chat-members {
  font-size: 12px;
  color: #6c757d;
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #4facfe;
  color: #4facfe;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 8px;
}

.message.own {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6c757d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.message.own .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.message-time {
  font-size: 11px;
  color: #6c757d;
}

.message-bubble {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.message.own .message-bubble {
  background: #4facfe;
  color: white;
}

.chat-input {
  padding: 20px;
  border-top: 2px solid #e9ecef;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.attach-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.attach-btn:hover {
  border-color: #4facfe;
  color: #4facfe;
}

.input-container input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
}

.input-container input:focus {
  outline: none;
  border-color: #4facfe;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #4facfe;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #3a9afd;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  text-align: center;
  color: #6c757d;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .chat-layout {
    grid-template-columns: 1fr;
    height: calc(100vh - 160px);
  }

  .sidebar {
    order: 2;
    height: 200px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
