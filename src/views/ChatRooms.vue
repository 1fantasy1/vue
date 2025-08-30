<template>
  <div class="page">
    <div class="chat-layout">
      <!-- 移动端遮罩层 -->
      <div 
        v-if="sidebarOpen" 
        class="mobile-overlay"
        @click="closeSidebar"
      ></div>
      
      <div 
        class="sidebar" 
        :class="{ 'mobile-open': sidebarOpen }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <!-- 移动端关闭按钮 -->
        <button class="mobile-close-btn" @click="closeSidebar">×</button>
        
        <!-- 聊天室操作按钮 -->
        <div class="sidebar-actions">
          <button class="sidebar-btn join-btn" @click="openApplyByIdModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"/>
            </svg>
            加入聊天室
          </button>
          <button class="sidebar-btn primary-btn" @click="openCreateRoomModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            新建聊天室
          </button>
        </div>
        
        <div class="search-box">
          <el-input v-model="searchQuery" placeholder="搜索聊天室..." clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <el-tabs v-model="activeTab" class="elevated-tabs">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="项目群" name="project_group" />
          <el-tab-pane label="课程群" name="course_group" />
        </el-tabs>

        <div class="room-list">
          <template v-if="loading">
            <el-skeleton :rows="5" animated style="padding:8px" />
          </template>
          <template v-else>
            <div
              class="room-item"
              v-for="room in filteredRooms"
              :key="room.id"
              :class="{ active: selectedRoom?.id === room.id }"
              :style="selectedRoom?.id === room.id ? { borderLeft: `4px solid ${room.color || '#4facfe'}` } : {}"
              @click="selectRoom(room)"
            >
              <div class="room-avatar">
                <el-badge :value="room.unread_messages_count" :hidden="!(room.unread_messages_count > 0)">
                  <div class="avatar-icon" :style="{ background: room.color || '#4facfe' }">
                    {{ (room.name || '?').charAt(0) }}
                  </div>
                </el-badge>
                <div class="online-indicator" v-if="(room.online_members_count || 0) > 0"></div>
              </div>
              <div class="room-info">
                <div class="room-header">
                  <h4 class="room-name">{{ room.name }}</h4>
                  <span class="room-time">{{ formatTime(room.last_message?.sent_at) }}</span>
                </div>
                <div class="room-message">
                  <span class="message-sender" v-if="room.last_message?.sender_name">{{ room.last_message.sender_name }}:</span>
                  {{ room.last_message?.content_text || '暂无消息' }}
                </div>
              </div>
            </div>
            <el-empty description="暂无聊天室" v-if="filteredRooms.length === 0" />
            <div class="empty-rooms" v-if="filteredRooms.length === 0" style="font-size:12px;">
              你可以 <a href="javascript:void(0)" @click="openCreateRoomModal">创建一个</a>
              或 <a href="javascript:void(0)" @click="openApplyByIdModal">按ID申请加入</a>
            </div>
            <div class="error" v-if="roomsError">{{ roomsError }}</div>
          </template>
        </div>
      </div>

      <div class="chat-area">
        <div class="chat-header" v-if="selectedRoom">
          <div class="chat-info">
            <!-- 移动端侧边栏切换按钮 -->
            <button class="mobile-sidebar-toggle" @click="toggleSidebar" v-show="!sidebarOpen">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
              </svg>
            </button>
            <div class="chat-avatar" :style="{ background: currentColor }">
              {{ (selectedRoom.name || '?').charAt(0) }}
            </div>
            <div>
              <h3 class="chat-name">{{ selectedRoom.name }}</h3>
              <p class="chat-members">
                {{ selectedRoom.members_count || 0 }}人 · {{ typeLabel(selectedRoom.type) }}
                <span v-if="currentUserRole" class="user-role" :class="{ king: currentUserRole === 'king' }">
                  · 我的角色: {{ getRoleLabel(currentUserRole) }}
                </span>
              </p>
              <p class="chat-id">
                群聊ID: <span class="id-text">{{ selectedRoom.id }}</span>
                <el-button 
                  size="small" 
                  text 
                  type="primary" 
                  @click="copyRoomId"
                  title="复制群聊ID"
                >
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
              </p>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" @click="viewMembers" title="成员列表">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z" />
              </svg>
            </button>
            <button 
              class="action-btn" 
              @click="openApplyModal" 
              title="申请加入"
              v-if="!currentUserRole"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,17L15,12L10,7V17Z" />
              </svg>
            </button>
            <button 
              class="action-btn" 
              @click="openJoinRequestsModal" 
              title="入群申请"
              v-if="canManageMembers"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M7,9H17V11H7V9M7,13H14V15H7V13Z" />
              </svg>
            </button>
            <button 
              class="action-btn" 
              @click="openUpdateRoomModal" 
              title="房间设置"
              v-if="canManageRoom"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </button>
            <button 
              class="action-btn" 
              @click="deleteRoom" 
              title="删除聊天室"
              v-if="canDeleteRoom"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6Z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="messages-container" v-if="selectedRoom" ref="messagesContainer">
          <div v-if="messagesLoading" class="loading">消息加载中...</div>
          <div v-else-if="messages.length === 0" class="empty-messages">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <p>暂无消息记录</p>
            <small v-if="!currentUserRole">加入聊天室后即可查看历史消息</small>
          </div>
          <template v-else>
            <div class="message" v-for="message in messages" :key="message.id" :class="{ own: message.isOwn }">
              <div class="message-avatar" v-if="!message.isOwn">
                {{ (message.sender || '?').charAt(0) }}
              </div>
              <div class="message-content">
                <div class="message-header" v-if="!message.isOwn">
                  <span class="message-sender">{{ message.sender }}</span>
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <div class="message-bubble" :class="{ media: !!message.media_url }">
                  <template v-if="message.media_url && message.message_type === 'image'">
                    <img :src="message.media_url" alt="图片" class="msg-image" @load="scrollToBottom" />
                  </template>
                  <template v-else-if="message.media_url && message.message_type === 'video'">
                    <video :src="message.media_url" class="msg-video" controls @loadeddata="scrollToBottom"></video>
                  </template>
                  <template v-else-if="message.media_url && message.isAudio">
                    <audio :src="message.media_url" class="msg-audio" controls @loadeddata="scrollToBottom"></audio>
                  </template>
                  <template v-else-if="message.media_url && message.message_type === 'file'">
                    <a :href="message.media_url" target="_blank" rel="noopener" class="msg-file-link">{{ fileNameFromUrl(message.media_url) }}</a>
                  </template>
                  <div v-if="message.hasCaption" class="msg-text">{{ message.content }}</div>
                  <div class="message-actions">
                    <CollectButton
                      content-type="chat_message"
                      :content-id="message.id"
                      :initial-collected="message.isInCollection"
                      @collected="onMessageCollected"
                      @message="showMessage"
                      :show-text="false"
                    />
                  </div>
                </div>
                <div class="message-time" v-if="message.isOwn">{{ message.time }}</div>
              </div>
            </div>
          </template>
        </div>

        <div class="chat-input" v-if="selectedRoom && currentUserRole">
          <div class="input-container">
            <el-button class="attach-btn" circle @click="() => fileInput?.click()">
              <el-icon><Paperclip /></el-icon>
            </el-button>
            <input ref="fileInput" type="file" @change="onFileChange" accept="image/*,video/*,audio/*,*/*" style="display:none" />
            <el-input
              v-model="newMessage"
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
              clearable
            />
            <el-button type="primary" :loading="sending" :disabled="!newMessage.trim() && !selectedFile" @click="sendMessage">
              <el-icon><Position /></el-icon>
              发送
            </el-button>
          </div>
          <div v-if="selectedFile" class="attachment-preview">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
            <el-button text type="danger" size="small" @click="clearSelectedFile">移除</el-button>
          </div>
          <div class="error" v-if="errorMsg">{{ errorMsg }}</div>
        </div>

        <!-- 角色加载中：避免误判为非成员 -->
        <div class="chat-input-disabled" v-else-if="selectedRoom && roleLoading">
          <div class="join-prompt">
            <p>正在确认你的成员身份...</p>
          </div>
        </div>

        <!-- 确认非成员才提示无法发送 -->
        <div class="chat-input-disabled" v-else-if="selectedRoom && currentUserRole === 'not-member'">
          <div class="join-prompt">
            <p>你还不是该聊天室成员，无法发送消息</p>
            <el-button type="primary" @click="openApplyModal">申请加入</el-button>
          </div>
        </div>

        <div class="empty-state" v-else>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <h3>还没有可用的聊天室</h3>
          <p>你可以创建一个聊天室，或让管理员邀请你加入</p>
          <div class="empty-actions">
            <el-button type="primary" @click="openCreateRoomModal">新建聊天室</el-button>
            <el-button @click="openApplyByIdModal">按ID加入</el-button>
            <el-button class="only-mobile" @click="toggleSidebar" v-show="!sidebarOpen">打开侧边栏</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑聊天室 Dialog -->
    <el-dialog v-model="showCreateModal" :title="editMode ? '编辑聊天室' : '新建聊天室'" width="520px">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="createForm.name" placeholder="请输入聊天室名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="createForm.type" placeholder="请选择类型" style="width:100%">
            <el-option label="普通群" value="general" />
            <el-option label="项目群" value="project_group" />
            <el-option label="课程群" value="course_group" />
            <el-option label="私密群" value="private" />
          </el-select>
        </el-form-item>
        <div class="form-two">
          <el-form-item label="项目ID">
            <el-input v-model.number="createForm.project_id" placeholder="可选" />
          </el-form-item>
          <el-form-item label="课程ID">
            <el-input v-model.number="createForm.course_id" placeholder="可选" />
          </el-form-item>
        </div>
        <el-form-item label="颜色">
          <div style="display:flex;align-items:center;gap:12px;">
            <el-color-picker
              v-model="createForm.color"
              :predefine="predefinedColors"
              :show-alpha="false"
            />
            <el-button size="small" @click="createForm.color = '#4facfe'">重置默认色</el-button>
            <span style="font-size:12px;color:#6c757d;">用于头像、我方气泡等主题色</span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeCreateRoomModal">取消</el-button>
        <el-button type="primary" :loading="creating" @click="submitRoom">{{ editMode ? '保存' : '创建' }}</el-button>
      </template>
      <div class="error" v-if="modalError">{{ modalError }}</div>
    </el-dialog>

    <!-- 成员列表 Modal -->
    <el-dialog v-model="showMembersModal" title="成员列表" width="720px">
      <div class="members-list">
        <div class="member-item" v-for="m in members" :key="m.id">
          <div class="member-left">
            <el-avatar :style="{ background: '#8aa1ff', color: '#fff' }">{{ (m.member_name || String(m.member_id)).charAt(0) }}</el-avatar>
            <div>
              <div class="name">{{ m.member_name || '用户' + m.member_id }}</div>
              <div class="desc">
                角色：<el-tag size="small" :type="getRoleTagType(m.role)">{{ getRoleLabel(m.role) }}</el-tag> 
                · 状态：{{ m.status }} · 加入：{{ formatTime(m.joined_at) }}
              </div>
            </div>
          </div>
          <div class="member-actions">
            <el-select 
              v-model="memberRoleEdit[m.member_id]" 
              size="small" 
              @change="changeMemberRole(m)"
              :disabled="!canManageMembers || m.member_id === currentUserId || m.role === 'king'"
            >
              <el-option label="member" value="member" />
              <el-option label="admin" value="admin" />
              <el-option label="king" value="king" v-if="isRoomKing" />
            </el-select>
            <el-button 
              type="danger" 
              size="small" 
              @click="removeMember(m)"
              :disabled="!canManageMembers || m.member_id === currentUserId || m.role === 'king'"
            >
              移除
            </el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="closeMembersModal">关闭</el-button>
      </template>
      <div class="error" v-if="modalError">{{ modalError }}</div>
    </el-dialog>

    <!-- 入群申请 Modal -->
    <el-dialog v-model="showJoinModal" title="入群申请" width="720px">
      <div class="filter-row">
        <span>状态筛选</span>
        <el-select v-model="joinStatusFilter" size="small" style="width:160px" @change="loadJoinRequests">
          <el-option label="全部" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
      </div>
      <div class="members-list">
        <div class="member-item" v-for="jr in joinRequests" :key="jr.id">
          <div class="member-left">
            <el-avatar>{{ String(jr.requester_id).charAt(0) }}</el-avatar>
            <div>
              <div class="name">申请人：{{ jr.requester_id }}</div>
              <div class="desc">
                理由：{{ jr.reason || '无' }} · 状态：<el-tag size="small" :type="getStatusTagType(jr.status)">{{ jr.status }}</el-tag> 
                · 时间：{{ formatTime(jr.requested_at) }}
              </div>
            </div>
          </div>
          <div class="member-actions" v-if="jr.status === 'pending' && canManageMembers">
            <el-button type="primary" size="small" @click="processJoin(jr, 'approved')">通过</el-button>
            <el-button type="danger" size="small" @click="processJoin(jr, 'rejected')">拒绝</el-button>
          </div>
        </div>
        <el-empty description="暂无申请" v-if="!joinLoading && joinRequests.length === 0" />
        <el-skeleton :rows="3" animated v-if="joinLoading" />
      </div>
      <template #footer>
        <el-button @click="closeJoinRequestsModal">关闭</el-button>
      </template>
      <div class="error" v-if="modalError">{{ modalError }}</div>
    </el-dialog>

    <!-- 申请加入 Modal -->
    <el-dialog v-model="showApplyModal" :title="`申请加入：${selectedRoom?.name || ''}`" width="520px">
      <el-form label-width="100px">
        <el-form-item label="申请理由">
          <el-input v-model="applyReason" placeholder="简单说明加入理由" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeApplyModal">取消</el-button>
        <el-button type="primary" :loading="applying" @click="submitApply">提交申请</el-button>
      </template>
      <div class="error" v-if="modalError">{{ modalError }}</div>
    </el-dialog>

    <!-- 按ID申请加入 Modal -->
    <el-dialog v-model="showApplyByIdModal" title="按ID申请加入聊天室" width="520px">
      <el-form label-width="100px">
        <el-form-item label="聊天室ID">
          <el-input v-model.number="applyByIdRoomId" type="number" placeholder="请输入房间ID" />
          <div style="font-size: 12px; color: #6c757d; margin-top: 4px;">
            💡 提示：可在任意聊天室页面找到群聊ID，点击复制按钮即可获取
          </div>
        </el-form-item>
        <el-form-item label="申请理由">
          <el-input v-model="applyByIdReason" placeholder="简单说明加入理由" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeApplyByIdModal">取消</el-button>
        <el-button type="primary" :loading="applying" :disabled="!applyByIdRoomId" @click="submitApplyById">提交申请</el-button>
      </template>
      <div class="error" v-if="modalError">{{ modalError }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Search, Paperclip, Position, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import remoteApiService from '@/services/remoteApi.js'
import CollectButton from '@/components/CollectButton.vue'

export default {
  name: 'ChatRooms',
  components: { Search, Paperclip, Position, DocumentCopy, CollectButton },
  setup() {
    const router = useRouter()
    const activeTab = ref('all')
    const searchQuery = ref('')
    const selectedRoom = ref(null)
    const newMessage = ref('')
    const sending = ref(false)
  const loading = ref(false)
  const roomsError = ref('')
    const messagesLoading = ref(false)
    const errorMsg = ref('')
    const modalError = ref('')
    const rooms = ref([])
  const messages = ref([])
  const messagesContainer = ref(null)
    const currentUser = ref(null)
    const currentUserId = ref(null)
    // 权限标记（若外层或模板存在引用，避免未定义告警）
  const noAccess = ref(false)
  // 当前用户在选中房间的角色信息
  const currentUserRole = ref(null)
  const roleLoading = ref(false)
  const userRoomRoles = ref({})

    // 移动端侧边栏状态
    const sidebarOpen = ref(false)

    // Modals state
  const showCreateModal = ref(false)
    const showMembersModal = ref(false)
    const showJoinModal = ref(false)
    const creating = ref(false)
  const editMode = ref(false)
  const createForm = ref({ name: '', type: 'general', project_id: null, course_id: null, color: '#4facfe' })
    const members = ref([])
    const memberRoleEdit = ref({})
    const joinRequests = ref([])
    const joinStatusFilter = ref('')
    const joinLoading = ref(false)
  const showApplyModal = ref(false)
  const applyReason = ref('')
  const applying = ref(false)
  const showApplyByIdModal = ref(false)
  const applyByIdRoomId = ref(null)
  const applyByIdReason = ref('')

    // 预设颜色（与常见 IM/品牌色系接近）
    const predefinedColors = [
      '#4facfe', '#3a9afd', '#2f80ed', '#8aa1ff',
      '#34d399', '#10b981', '#22c55e',
      '#f59e0b', '#f97316', '#ef4444',
      '#a855f7', '#ec4899', '#06b6d4',
      '#64748b', '#0ea5e9'
    ]

  const filteredRooms = computed(() => {
      let filtered = rooms.value || []
      if (activeTab.value !== 'all') {
        filtered = filtered.filter(room => room.type === activeTab.value)
      }
      if (searchQuery.value) {
        filtered = filtered.filter(room => (room.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()))
      }
      return filtered
    })

  // 当前房间主题色（带回退）
  const currentColor = computed(() => selectedRoom.value?.color || '#4facfe')

    // 权限计算
    const isRoomCreator = computed(() => {
      return selectedRoom.value && currentUserId.value && 
             selectedRoom.value.creator_id === currentUserId.value
    })

    const isRoomAdmin = computed(() => {
      return currentUserRole.value === 'admin' || currentUserRole.value === 'king'
    })

    const isRoomKing = computed(() => {
      return currentUserRole.value === 'king'
    })

    const canManageRoom = computed(() => {
      return isRoomCreator.value || isRoomAdmin.value
    })

    const canManageMembers = computed(() => {
      return canManageRoom.value
    })

    const canDeleteRoom = computed(() => {
      return isRoomCreator.value || isRoomKing.value
    })

    // 移动端侧边栏控制
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    // 触摸滑动控制
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (!sidebarOpen.value) return
      
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const diffX = currentX - touchStartX
      const diffY = Math.abs(currentY - touchStartY)
      
      // 如果水平滑动距离大于垂直滑动距离，且向左滑动超过100px，关闭侧边栏
      if (Math.abs(diffX) > diffY && diffX < -100) {
        closeSidebar()
      }
    }

    const selectRoom = async (room) => {
      selectedRoom.value = room
      errorMsg.value = ''
      messages.value = []
      // 移动端选择房间后自动关闭侧边栏
      sidebarOpen.value = false
      // 更新当前用户在该房间的角色
      await updateCurrentUserRole(room.id)
      await loadMessages(room.id)
    }

    // 更新当前用户在房间的角色
    const updateCurrentUserRole = async (roomId) => {
      roleLoading.value = true
      currentUserRole.value = null
      if (!currentUserId.value) { roleLoading.value = false; return }
      
      // 如果已缓存该房间的角色信息，直接使用
      if (userRoomRoles.value[roomId]) {
        currentUserRole.value = userRoomRoles.value[roomId]
        roleLoading.value = false
        return
      }

      try {
        const resp = await remoteApiService.chatRooms.getMembers(roomId)
        const payload = resp?.data ?? resp
        const data = payload?.data || (Array.isArray(payload) ? payload : [])
        const currentMember = data.find(m => m.member_id === currentUserId.value)
        if (currentMember) {
          currentUserRole.value = currentMember.role
          userRoomRoles.value[roomId] = currentMember.role
        } else {
          // 明确标记为非成员，避免 UI 误判
          currentUserRole.value = 'not-member'
        }
      } catch (e) {
        console.warn('获取用户角色失败:', e.message)
        // 出错时也避免出现可发送的状态
        currentUserRole.value = 'not-member'
      } finally {
        roleLoading.value = false
      }
    }

    const sendMessage = async () => {
      if ((!newMessage.value.trim() && !selectedFile.value) || !selectedRoom.value) return
      try {
        sending.value = true
        const payload = { content_text: newMessage.value || '', media_url: null }
        if (selectedFile.value) {
          payload.file = selectedFile.value
          payload.message_type = inferMessageType(selectedFile.value)
        } else {
          payload.message_type = 'text'
        }
  const resp = await remoteApiService.chatRooms.sendMessage(selectedRoom.value.id, payload)
  const data = resp?.data?.data || resp?.data || resp
        // 追加本地展示
        messages.value.push(mapMessageToView(data))
        newMessage.value = ''
        clearSelectedFile()
      } catch (e) {
        errorMsg.value = e.message || '发送失败'
      } finally {
        sending.value = false
      }
    }

    const onMessageCollected = (data) => {
      console.log('聊天消息已收藏:', data)
      // 可以在这里更新消息的收藏状态
      const message = messages.value.find(m => m.id == data.contentId)
      if (message) {
        message.isInCollection = true
      }
    }

    const showMessage = (messageData) => {
      // 使用 Element Plus 的消息组件
      if (messageData.type === 'success') {
        ElMessage.success(messageData.text)
      } else if (messageData.type === 'error') {
        ElMessage.error(messageData.text)
      }
    }

    const viewMembers = async () => {
      if (!selectedRoom.value) return
      modalError.value = ''
      showMembersModal.value = true
      try {
        const resp = await remoteApiService.chatRooms.getMembers(selectedRoom.value.id)
        const payload = resp?.data ?? resp
        const data = payload?.data || (Array.isArray(payload) ? payload : [])
        members.value = data
        // 初始化可编辑role
        memberRoleEdit.value = {}
        data.forEach(m => { memberRoleEdit.value[m.member_id] = m.role })
      } catch (e) {
        modalError.value = e.message || '加载成员失败'
      }
    }

    const openUpdateRoomModal = () => {
      // 简化处理：沿用创建表单作为编辑，预填
      if (!selectedRoom.value) return
      createForm.value = {
        name: selectedRoom.value.name || '',
        type: selectedRoom.value.type || 'general',
        project_id: selectedRoom.value.project_id || null,
        course_id: selectedRoom.value.course_id || null,
        color: selectedRoom.value.color || '#4facfe'
      }
      editMode.value = true
      showCreateModal.value = true
    }

    const changeMemberRole = async (m) => {
      try {
        const newRole = memberRoleEdit.value[m.member_id]
        await remoteApiService.chatRooms.setMemberRole(selectedRoom.value.id, m.member_id, newRole)
      } catch (e) {
        modalError.value = e.message || '更新角色失败'
      }
    }

    const removeMember = async (m) => {
      try {
        await remoteApiService.chatRooms.removeMember(selectedRoom.value.id, m.member_id)
        members.value = members.value.filter(x => x.member_id !== m.member_id)
      } catch (e) {
        modalError.value = e.message || '移除失败'
      }
    }

    const changeTab = async (tab) => {
      activeTab.value = tab
      await loadRooms()
    }

    const typeLabel = (t) => {
      const map = { project_group: '项目群', course_group: '课程群', private: '私密群', general: '普通群' }
      return map[t] || t || '聊天'
    }

    const getRoleLabel = (role) => {
      const map = { 
        king: '群主',
        admin: '管理员', 
        member: '成员' 
      }
      return map[role] || role || '成员'
    }

    const getRoleTagType = (role) => {
      const map = {
        king: 'danger',    // 红色 - 最高权限
        admin: 'warning',  // 橙色 - 管理权限
        member: ''         // 默认灰色 - 普通成员
      }
      return map[role] || ''
    }

    const getStatusTagType = (status) => {
      const map = {
        pending: 'warning',   // 橙色 - 待处理
        approved: 'success',  // 绿色 - 已通过
        rejected: 'danger'    // 红色 - 已拒绝
      }
      return map[status] || ''
    }

    const copyRoomId = async () => {
      if (!selectedRoom.value) return
      
      try {
        await navigator.clipboard.writeText(String(selectedRoom.value.id))
        // 使用 Element Plus 的消息提示
        ElMessage({
          message: '群聊ID已复制到剪贴板',
          type: 'success',
          duration: 2000
        })
      } catch (err) {
        // 如果浏览器不支持剪贴板API，使用传统方式
        const textArea = document.createElement('textarea')
        textArea.value = String(selectedRoom.value.id)
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          ElMessage({
            message: '群聊ID已复制到剪贴板',
            type: 'success',
            duration: 2000
          })
        } catch {
          ElMessage({
            message: '复制失败，请手动复制群聊ID',
            type: 'error',
            duration: 3000
          })
        } finally {
          document.body.removeChild(textArea)
        }
      }
    }

    const formatTime = (isoStr) => {
      if (!isoStr) return ''
      try {
        const d = new Date(isoStr)
        if (isNaN(d.getTime())) return ''
        return d.toLocaleString('zh-CN', { hour12: false })
      } catch {
        return ''
      }
    }

    const mapMessageToView = (m) => {
      const senderName = m.sender_name || `用户${m.sender_id}`
      const rawContent = m.content_text || ''
      const mediaUrl = m.media_url || null
      // 某些后端会在纯媒体消息生成占位文本，如 “文件: xxx” 或“图片: xxx”
      const looksLikeAutoLabel = () => {
        if (!rawContent) return false
        const c = rawContent.trim()
        // 前缀匹配：文件:/图片:/视频:
        const prefixes = ['文件:', '图片:', '视频:', 'file:', 'image:', 'video:']
        if (prefixes.some(p => c.toLowerCase().startsWith(p.toLowerCase()))) return true
        // 仅为文件名（与 media_url 文件名一致）也视为占位
        if (mediaUrl) {
          try {
            const nameFromUrl = decodeURIComponent(mediaUrl.split('?')[0].split('#')[0].split('/').pop() || '')
            if (nameFromUrl && (c === nameFromUrl || c === `文件: ${nameFromUrl}`)) return true
          } catch {}
        }
        return false
      }
      return {
        id: m.id,
        sender: senderName,
        content: rawContent,
    message_type: m.message_type || (m.media_url ? 'file' : 'text'),
        media_url: mediaUrl,
  isAudio: m.media_url ? isAudioUrl(m.media_url) : false,
        hasCaption: rawContent ? !looksLikeAutoLabel() : false,
        time: formatTime(m.sent_at),
        isOwn: currentUserId.value ? m.sender_id === currentUserId.value : false
      }
    }

  const loadRooms = async () => {
      loading.value = true
      try {
  roomsError.value = ''
  const resp = await remoteApiService.chatRooms.getAllChatRooms(activeTab.value === 'all' ? null : activeTab.value)
    const payload = resp?.data ?? resp
    const data = payload?.data || (Array.isArray(payload) ? payload : [])
        rooms.value = data
        
        // 检查当前选中的房间是否还在新的房间列表中
        const currentRoomStillExists = selectedRoom.value && 
          data.some(room => room.id === selectedRoom.value.id)
        
        // 如果当前没有选择聊天室，或者当前选择的聊天室不在新列表中，自动选择第一个
        if ((!selectedRoom.value || !currentRoomStillExists) && data.length > 0) {
          selectedRoom.value = data[0]
          // 加载第一个房间的消息
          if (data[0].id) {
            await updateCurrentUserRole(data[0].id)
            await loadMessages(data[0].id)
          }
        } else if (data.length === 0) {
          // 没有任何聊天室：清空选择与消息，进入空态
          selectedRoom.value = null
          messages.value = []
          currentUserRole.value = null
          roleLoading.value = false
        }
      } catch (e) {
    console.error(e)
    roomsError.value = e.message || '拉取失败'
      } finally {
        loading.value = false
      }
    }

    const scrollToBottom = () => {
      nextTick(() => {
        const el = messagesContainer.value
        if (el) el.scrollTop = el.scrollHeight
      })
    }

  const loadMessages = async (roomId) => {
      messagesLoading.value = true
      try {
    const resp = await remoteApiService.chatRooms.getMessages(roomId, 50, 0)
    const payload = resp?.data ?? resp
    const data = payload?.data || (Array.isArray(payload) ? payload : [])
        messages.value = data.map(mapMessageToView)
        scrollToBottom()
      } catch (e) {
        console.warn('消息加载失败:', e.message)
        // 如果是权限问题，提供友好提示
        if (e.message?.includes('404') || e.message?.includes('Not Found')) {
          errorMsg.value = '暂无权限查看历史消息或消息为空'
        } else {
          errorMsg.value = e.message || '消息加载失败'
        }
        messages.value = []
      } finally {
        messagesLoading.value = false
      }
    }

    const openCreateRoomModal = () => {
      createForm.value = { name: '', type: 'general', project_id: null, course_id: null, color: '#4facfe' }
      modalError.value = ''
      editMode.value = false
      showCreateModal.value = true
    }
    const closeCreateRoomModal = () => { showCreateModal.value = false }

    const submitRoom = async () => {
      if (!createForm.value.name?.trim()) {
        modalError.value = '请输入名称'
        return
      }
      creating.value = true
      try {
  const payload = { ...createForm.value }
  if (!payload.color) payload.color = '#4facfe'
        if (!payload.project_id) delete payload.project_id
        if (!payload.course_id) delete payload.course_id
        if (editMode.value && selectedRoom.value) {
          const resp = await remoteApiService.chatRooms.updateChatRoom(selectedRoom.value.id, payload)
          const data = resp?.data?.data || resp?.data || resp
          // 更新本地列表与选择
          const idx = rooms.value.findIndex(r => r.id === selectedRoom.value.id)
          if (idx !== -1) rooms.value[idx] = { ...rooms.value[idx], ...data }
          selectedRoom.value = { ...selectedRoom.value, ...data }
          showCreateModal.value = false
        } else {
          const resp = await remoteApiService.chatRooms.createChatRoom(payload)
          const data = resp?.data?.data || resp?.data || resp
          rooms.value.unshift(data)
          showCreateModal.value = false

          // 成功后自动进入新聊天室
          if (data && data.id) {
            await selectRoom(data)
          } else {
            // 若无 id，刷新列表后进入第一个
            await loadRooms()
            if (rooms.value.length > 0) await selectRoom(rooms.value[0])
          }
        }
      } catch (e) {
        modalError.value = e.message || '创建失败'
      } finally {
        creating.value = false
      }
    }

    const deleteRoom = async () => {
      if (!selectedRoom.value) return
      if (!confirm('确认删除该聊天室及其数据？')) return
      try {
        await remoteApiService.chatRooms.deleteChatRoom(selectedRoom.value.id)
        rooms.value = rooms.value.filter(r => r.id !== selectedRoom.value.id)
        selectedRoom.value = null
        messages.value = []
      } catch (e) {
        alert(e.message || '删除失败')
      }
    }

    const openJoinRequestsModal = async () => {
      if (!selectedRoom.value) return
      showJoinModal.value = true
      await loadJoinRequests()
    }
    const closeJoinRequestsModal = () => { showJoinModal.value = false }

    const loadJoinRequests = async () => {
      if (!selectedRoom.value) return
      joinLoading.value = true
      modalError.value = ''
      try {
        const resp = await remoteApiService.chatRooms.getJoinRequests(selectedRoom.value.id, joinStatusFilter.value || null)
        joinRequests.value = resp?.data?.data || []
      } catch (e) {
        modalError.value = e.message || '获取申请失败'
      } finally {
        joinLoading.value = false
      }
    }

    const processJoin = async (jr, status) => {
      try {
        await remoteApiService.chatRooms.processJoinRequest(jr.id, status)
        // 更新本地状态
        jr.status = status
      } catch (e) {
        modalError.value = e.message || '处理失败'
      }
    }

    // 申请加入
    const openApplyModal = () => { modalError.value = ''; applyReason.value = ''; showApplyModal.value = true }
    const closeApplyModal = () => { showApplyModal.value = false }
    const submitApply = async () => {
      if (!selectedRoom.value) return
      applying.value = true
      try {
        const payload = { room_id: selectedRoom.value.id, reason: applyReason.value || null }
        await remoteApiService.chatRooms.createJoinRequest(selectedRoom.value.id, payload)
        showApplyModal.value = false
      } catch (e) {
        modalError.value = e.message || '申请失败'
      } finally {
        applying.value = false
      }
    }

    // 按ID申请加入
    const openApplyByIdModal = () => { modalError.value = ''; applyByIdRoomId.value = null; applyByIdReason.value = ''; showApplyByIdModal.value = true }
    const closeApplyByIdModal = () => { showApplyByIdModal.value = false }
    const submitApplyById = async () => {
      if (!applyByIdRoomId.value) return
      applying.value = true
      try {
        const payload = { room_id: applyByIdRoomId.value, reason: applyByIdReason.value || null }
        await remoteApiService.chatRooms.createJoinRequest(applyByIdRoomId.value, payload)
        showApplyByIdModal.value = false
      } catch (e) {
        modalError.value = e.message || '申请失败'
      } finally {
        applying.value = false
      }
    }

    const closeMembersModal = () => { showMembersModal.value = false }

    // 文件选择/预览
    const selectedFile = ref(null)
    const fileInput = ref(null)
    const onFileChange = (e) => {
      const file = e.target?.files?.[0]
      if (!file) return
      selectedFile.value = file
      // 清理 input 以便选择同一个文件也能触发 change
      e.target.value = ''
    }
    const clearSelectedFile = () => { selectedFile.value = null }
    const formatFileSize = (bytes) => {
      if (!bytes && bytes !== 0) return ''
      const units = ['B','KB','MB','GB']
      let size = bytes
      let idx = 0
      while (size >= 1024 && idx < units.length - 1) { size /= 1024; idx++ }
      return `${size.toFixed(idx === 0 ? 0 : 1)}${units[idx]}`
    }
    const fileNameFromUrl = (url) => {
      try { return decodeURIComponent(url.split('?')[0].split('#')[0].split('/').pop() || '文件') } catch { return '文件' }
    }
    const isAudioUrl = (url) => {
      if (!url) return false
      try {
        const u = url.split('?')[0].split('#')[0]
        const ext = (u.split('.').pop() || '').toLowerCase()
        return ['mp3','wav','ogg','m4a','aac','flac','oga','weba'].includes(ext)
      } catch { return false }
    }
    const inferMessageType = (file) => {
      if (!file) return 'file'
      const mime = file.type || ''
      if (mime.startsWith('image/')) return 'image'
      if (mime.startsWith('video/')) return 'video'
      // fallback by extension
      const name = (file.name || '').toLowerCase()
      const ext = name.split('.').pop()
      const imageExts = ['png','jpg','jpeg','gif','webp','bmp','svg','tiff','avif']
      const videoExts = ['mp4','webm','ogg','mov','m4v','avi','mkv']
      if (imageExts.includes(ext)) return 'image'
      if (videoExts.includes(ext)) return 'video'
      return 'file'
    }

  onMounted(async () => {
      try {
        // 当前用户用于标识自己消息
        const me = JSON.parse(localStorage.getItem('currentUser') || 'null')
        currentUser.value = me
        currentUserId.value = me?.id || me?.user_id || null
      } catch {
        currentUserId.value = null
      }
      await loadRooms()
    })

  // 监听 activeTab 切换自动刷新
  watch(activeTab, async () => { await loadRooms() })
  // 监听消息变化滚动到底部
  watch(messages, () => { scrollToBottom() })

    return {
      activeTab,
      searchQuery,
      selectedRoom,
      newMessage,
      rooms,
  messages,
  messagesContainer,
      loading,
      messagesLoading,
      errorMsg,
      sending,
  roomsError,
      filteredRooms,
      selectRoom,
      sendMessage,
      onMessageCollected,
      showMessage,
      viewMembers,
      openCreateRoomModal,
      closeCreateRoomModal,
  createForm,
      showCreateModal,
      creating,
      modalError,
  editMode,
      typeLabel,
      getRoleLabel,
      getRoleTagType,
      getStatusTagType,
      copyRoomId,
      formatTime,
  currentColor,
  // 文件上传
  selectedFile,
  fileInput,
  onFileChange,
  clearSelectedFile,
  formatFileSize,
  fileNameFromUrl,
  isAudioUrl,
      // 权限相关
  currentUserRole,
  roleLoading,
      isRoomCreator,
      isRoomAdmin,
      isRoomKing,
      canManageRoom,
      canManageMembers,
      canDeleteRoom,
      updateCurrentUserRole,
      // members
      showMembersModal,
      members,
      memberRoleEdit,
      changeMemberRole,
      removeMember,
      closeMembersModal,
      // join requests
      showJoinModal,
      openJoinRequestsModal,
      closeJoinRequestsModal,
      joinRequests,
      joinStatusFilter,
      loadJoinRequests,
      processJoin,
      changeTab,
  openUpdateRoomModal,
  deleteRoom,
  predefinedColors,
  // 权限
  noAccess,
  // apply join
  showApplyModal,
  openApplyModal,
  closeApplyModal,
  applyReason,
  applying,
  submitApply,
  // apply by id
  showApplyByIdModal,
  openApplyByIdModal,
  closeApplyByIdModal,
  applyByIdRoomId,
  applyByIdReason,
  submitApplyById,
  submitRoom,
  // 移动端侧边栏
  sidebarOpen,
  toggleSidebar,
  closeSidebar,
  handleTouchStart,
  handleTouchMove
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

.primary-btn {
  background: #4facfe;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}
.primary-btn:disabled { opacity: .6; cursor: not-allowed; }
.btn {
  background: #fff;
  color: #2c3e50;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.btn:hover {
  border-color: #4facfe;
  color: #4facfe;
}

.join-btn {
  border-color: #28a745;
  color: #28a745;
}

.join-btn:hover {
  background: #28a745;
  color: white;
}
.danger-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
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
  height: calc(100vh - 180px);
}

.sidebar {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.sidebar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  justify-content: center;
}

.sidebar-btn.join-btn {
  background: #f8f9fa;
  color: #28a745;
  border: 1px solid #28a745;
}

.sidebar-btn.join-btn:hover {
  background: #28a745;
  color: white;
}

.sidebar-btn.primary-btn {
  background: #4facfe;
  color: white;
}

.sidebar-btn.primary-btn:hover {
  background: #3a9afd;
}


.search-box {
  margin-bottom: 16px;
}

.search-box :deep(.el-input__prefix) {
  color: #6c757d;
}

.search-box :deep(.el-input__wrapper){
  box-shadow: none;
  border: 2px solid #e9ecef;
}

.elevated-tabs{ margin-bottom: 8px; }

.room-list {
  flex: 1;
  overflow-y: auto;
}

.empty-rooms { color: #6c757d; text-align: center; padding: 12px; }
.loading { color: #6c757d; text-align: center; padding: 12px; }

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

/* unread badge交由 el-badge 渲染 */

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

.chat-id {
  font-size: 11px;
  color: #6c757d;
  margin: 2px 0 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.id-text {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  color: #495057;
  font-weight: 500;
}

.user-role {
  color: #4facfe;
  font-weight: 500;
}

.user-role.king {
  color: #f56565;
  font-weight: 600;
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
  background: #f5f5f5; /* 微信风格：他人消息浅灰 */
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}

.message-bubble.media {
  padding: 8px; /* 媒体控件占主视觉，缩小内边距 */
  background: transparent; /* 去掉气泡底色 */
}
.message-bubble.media .msg-image,
.message-bubble.media .msg-video,
.message-bubble.media .msg-audio {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.message.own .message-bubble.media .msg-image,
.message.own .message-bubble.media .msg-video,
.message.own .message-bubble.media .msg-audio {
  border-color: rgba(0,0,0,0.06);
}

.msg-text { white-space: pre-wrap; }
.msg-image { max-width: 320px; max-height: 360px; display: block; border-radius: 8px; }
.msg-video { max-width: 360px; display: block; border-radius: 8px; }
.msg-audio { width: 320px; display: block; }
.msg-file-link { color: #2563eb; text-decoration: none; word-break: break-all; }
.msg-file-link:hover { text-decoration: underline; }

.message-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-bubble:hover .message-actions {
  opacity: 1;
}

.message.own .message-bubble {
  background: #95ec69; /* 微信风格：我方消息浅绿 */
  color: #111;
}

.message.own .message-bubble.media {
  background: transparent; /* 媒体消息不使用绿色背景 */
}

.chat-input {
  padding: 20px;
  border-top: 2px solid #e9ecef;
}

.error { color: #dc3545; margin-top: 8px; font-size: 12px; }

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.attachment-preview {
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 8px;
}
.attachment-preview .file-name { font-weight: 500; color: #2c3e50; }
.attachment-preview .file-size { opacity: .8; }

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

.empty-actions { margin-top: 8px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

@media (min-width: 769px) {
  .only-mobile { display: none !important; }
}

.empty-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  text-align: center;
  color: #6c757d;
}

.empty-messages p {
  margin: 0;
  font-size: 14px;
}

.empty-messages small {
  font-size: 12px;
  opacity: 0.7;
}

.chat-input-disabled {
  padding: 20px;
  border-top: 2px solid #e9ecef;
  background: #f8f9fa;
}

.join-prompt {
  text-align: center;
  color: #6c757d;
}

.join-prompt p {
  margin: 0 0 12px 0;
  font-size: 14px;
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal { background: #fff; border-radius: 12px; padding: 20px; width: 520px; max-width: 90vw; }
.modal.large { width: 800px; max-width: 95vw; }
.modal h3 { margin: 0 0 12px; }
.form-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.form-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row label { font-size: 12px; color: #6c757d; }
.form-row input, .form-row select { border: 2px solid #e9ecef; border-radius: 8px; padding: 8px 10px; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
.members-list { display: flex; flex-direction: column; gap: 10px; max-height: 55vh; overflow: auto; }
.member-item { display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid #f1f3f5; border-radius: 8px; }
.member-left { display: flex; align-items: center; gap: 10px; }
.member-left .avatar { width: 36px; height: 36px; border-radius: 50%; background: #8aa1ff; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.member-actions { display: flex; align-items: center; gap: 8px; }

@media (max-width: 768px) {
  .page {
    padding: 8px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .chat-layout {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    gap: 0;
  }

  .sidebar {
    display: none; /* 默认隐藏侧边栏 */
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    max-width: 320px;
    bottom: 0;
    background: white;
    z-index: 1001;
    padding: 20px;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }

  .sidebar.mobile-open {
    display: flex;
    flex-direction: column;
    transform: translateX(0);
  }

  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .chat-area {
    flex: 1;
    border-radius: 12px;
    margin: 0;
  }

  .chat-header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .chat-info {
    flex: 1;
    min-width: 0;
  }

  .chat-name {
    font-size: 1rem;
  }

  .chat-members {
    font-size: 11px;
  }

  .chat-id {
    font-size: 10px;
  }

  .chat-actions {
    flex-shrink: 0;
    gap: 4px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .messages-container {
    padding: 12px 16px;
  }

  .message {
    margin-bottom: 12px;
  }

  .message-avatar {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .message-content {
    max-width: 85%;
  }

  .message-bubble {
    padding: 10px 14px;
    font-size: 14px;
    line-height: 1.4;
  }

  .message-header {
    margin-bottom: 2px;
  }

  .message-sender {
    font-size: 11px;
  }

  .message-time {
    font-size: 10px;
  }

  .chat-input {
    padding: 12px 16px;
  }

  .input-container {
    gap: 6px;
  }

  .attach-btn {
    width: 36px;
    height: 36px;
  }

  /* Element Plus 组件移动端优化 */
  .input-container :deep(.el-input__wrapper) {
    padding: 8px 12px;
  }

  .input-container :deep(.el-button) {
    padding: 8px 12px;
    font-size: 14px;
  }

  /* 移动端侧边栏顶部按钮 */
  .sidebar .mobile-close-btn {
    display: block;
    align-self: flex-end;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    margin-bottom: 8px;
    color: #6c757d;
  }

  /* 移动端侧边栏按钮优化 */
  .sidebar-actions {
    margin-bottom: 12px;
  }

  .sidebar-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  /* 移动端显示侧边栏按钮 */
  .mobile-sidebar-toggle {
    display: block;
    width: 32px;
    height: 32px;
    background: #4facfe;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-right: 8px;
  }

  /* 房间列表移动端优化 */
  .room-item {
    padding: 10px 8px;
    margin-bottom: 6px;
  }

  .room-avatar .avatar-icon {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .room-name {
    font-size: 13px;
  }

  .room-message {
    font-size: 11px;
  }

  .room-time {
    font-size: 10px;
  }

  /* 搜索框移动端优化：保留默认内边距，避免与prefix重叠 */
  /* .search-box :deep(.el-input__wrapper) { padding: 6px 10px; } */

  /* Tab 移动端优化 */
  .elevated-tabs :deep(.el-tabs__nav-wrap) {
    padding: 0 8px;
  }

  .elevated-tabs :deep(.el-tabs__item) {
    font-size: 13px;
    padding: 0 12px;
  }

  /* Modal 移动端优化 */
  .modal {
    width: calc(100vw - 32px);
    max-width: none;
    margin: 16px;
  }

  .form-two {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

/* 桌面端隐藏移动端专用元素 */
@media (min-width: 769px) {
  .mobile-close-btn,
  .mobile-sidebar-toggle {
    display: none !important;
  }
}
</style>
