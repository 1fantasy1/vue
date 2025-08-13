<template>
  <div class="page">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
        </svg>
        返回首页
      </button>
      <div class="header-actions">
        <button class="primary-btn" @click="openCreateRoomModal">新建聊天室</button>
      </div>
    </div>

    <div class="chat-layout">
      <div class="sidebar">
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
              @click="selectRoom(room)"
            >
              <div class="room-avatar">
                <el-badge :value="room.unread_messages_count" :hidden="!(room.unread_messages_count > 0)">
                  <div class="avatar-icon" :style="{ background: room.color || '#8aa1ff' }">
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
            <div class="chat-avatar" :style="{ background: selectedRoom.color || '#8aa1ff' }">
              {{ (selectedRoom.name || '?').charAt(0) }}
            </div>
            <div>
              <h3 class="chat-name">{{ selectedRoom.name }}</h3>
              <p class="chat-members">{{ selectedRoom.members_count || 0 }}人 · {{ typeLabel(selectedRoom.type) }}</p>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" @click="viewMembers" title="成员列表">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z" />
              </svg>
            </button>
            <button class="action-btn" @click="openApplyModal" title="申请加入">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10,17L15,12L10,7V17Z" />
              </svg>
            </button>
            <button class="action-btn" @click="openJoinRequestsModal" title="入群申请">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M7,9H17V11H7V9M7,13H14V15H7V13Z" />
              </svg>
            </button>
            <button class="action-btn" @click="openUpdateRoomModal" title="房间设置">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </button>
            <button class="action-btn" @click="deleteRoom" title="删除聊天室">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6Z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="messages-container" v-if="selectedRoom" ref="messagesContainer">
          <div class="message" v-for="message in messages" :key="message.id" :class="{ own: message.isOwn }">
            <div class="message-avatar" v-if="!message.isOwn">
              {{ (message.sender || '?').charAt(0) }}
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
          <div v-if="messagesLoading" class="loading">消息加载中...</div>
        </div>

        <div class="chat-input" v-if="selectedRoom">
          <div class="input-container">
            <el-button class="attach-btn" circle :disabled="true">
              <el-icon><Paperclip /></el-icon>
            </el-button>
            <el-input
              v-model="newMessage"
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
              clearable
            />
            <el-button type="primary" :loading="sending" :disabled="!newMessage.trim()" @click="sendMessage">
              <el-icon><Position /></el-icon>
              发送
            </el-button>
          </div>
          <div class="error" v-if="errorMsg">{{ errorMsg }}</div>
        </div>

        <div class="empty-state" v-else>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <h3>选择一个聊天室开始对话</h3>
          <p>点击左侧的聊天室开始与团队成员交流</p>
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
          <el-input v-model="createForm.color" placeholder="#4facfe" />
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
              <div class="desc">角色：<el-tag size="small">{{ m.role }}</el-tag> · 状态：{{ m.status }} · 加入：{{ formatTime(m.joined_at) }}</div>
            </div>
          </div>
          <div class="member-actions">
            <el-select v-model="memberRoleEdit[m.member_id]" size="small" @change="changeMemberRole(m)">
              <el-option label="member" value="member" />
              <el-option label="admin" value="admin" />
            </el-select>
            <el-button type="danger" size="small" @click="removeMember(m)">移除</el-button>
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
              <div class="desc">理由：{{ jr.reason || '无' }} · 状态：<el-tag size="small">{{ jr.status }}</el-tag> · 时间：{{ formatTime(jr.requested_at) }}</div>
            </div>
          </div>
          <div class="member-actions" v-if="jr.status === 'pending'">
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
import { Search, Paperclip, Position } from '@element-plus/icons-vue'
import { ApiService } from '@/services/api.js'

export default {
  name: 'ChatRooms',
  components: { Search, Paperclip, Position },
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

    const goBack = () => {
      router.push('/')
    }

    const selectRoom = async (room) => {
      selectedRoom.value = room
      errorMsg.value = ''
      messages.value = []
      await loadMessages(room.id)
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedRoom.value) return
      try {
        sending.value = true
        const payload = { content_text: newMessage.value, message_type: 'text', media_url: null }
        const resp = await ApiService.sendChatRoomMessage(selectedRoom.value.id, payload)
        const data = resp?.data?.data || resp?.data || resp
        // 追加本地展示
        messages.value.push(mapMessageToView(data))
        newMessage.value = ''
      } catch (e) {
        errorMsg.value = e.message || '发送失败'
      } finally {
        sending.value = false
      }
    }

    const viewMembers = async () => {
      if (!selectedRoom.value) return
      modalError.value = ''
      showMembersModal.value = true
      try {
        const resp = await ApiService.getChatRoomMembers(selectedRoom.value.id)
        const data = resp?.data?.data || []
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
        await ApiService.setChatRoomMemberRole(selectedRoom.value.id, m.member_id, newRole)
      } catch (e) {
        modalError.value = e.message || '更新角色失败'
      }
    }

    const removeMember = async (m) => {
      try {
        await ApiService.removeChatRoomMember(selectedRoom.value.id, m.member_id)
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
      return {
        id: m.id,
        sender: senderName,
        content: m.content_text || '',
        time: formatTime(m.sent_at),
        isOwn: currentUserId.value ? m.sender_id === currentUserId.value : false
      }
    }

  const loadRooms = async () => {
      loading.value = true
      try {
    roomsError.value = ''
    const resp = await ApiService.getChatRooms(activeTab.value === 'all' ? null : activeTab.value)
        const data = resp?.data?.data || []
        rooms.value = data
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
        const resp = await ApiService.getChatRoomMessages(roomId, 50, 0)
        const data = resp?.data?.data || []
        messages.value = data.map(mapMessageToView)
        scrollToBottom()
      } catch (e) {
        errorMsg.value = e.message || '消息加载失败'
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
        if (!payload.project_id) delete payload.project_id
        if (!payload.course_id) delete payload.course_id
        if (editMode.value && selectedRoom.value) {
          const resp = await ApiService.updateChatRoom(selectedRoom.value.id, payload)
          const data = resp?.data?.data || resp?.data || resp
          // 更新本地列表与选择
          const idx = rooms.value.findIndex(r => r.id === selectedRoom.value.id)
          if (idx !== -1) rooms.value[idx] = { ...rooms.value[idx], ...data }
          selectedRoom.value = { ...selectedRoom.value, ...data }
          showCreateModal.value = false
        } else {
          const resp = await ApiService.createChatRoom(payload)
          const data = resp?.data?.data || resp?.data || resp
          rooms.value.unshift(data)
          showCreateModal.value = false
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
        await ApiService.deleteChatRoom(selectedRoom.value.id)
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
        const resp = await ApiService.getJoinRequests(selectedRoom.value.id, joinStatusFilter.value || null)
        joinRequests.value = resp?.data?.data || []
      } catch (e) {
        modalError.value = e.message || '获取申请失败'
      } finally {
        joinLoading.value = false
      }
    }

    const processJoin = async (jr, status) => {
      try {
        await ApiService.processJoinRequest(jr.id, status)
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
        await ApiService.createJoinRequest(selectedRoom.value.id, payload)
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
        await ApiService.createJoinRequest(applyByIdRoomId.value, payload)
        showApplyByIdModal.value = false
      } catch (e) {
        modalError.value = e.message || '申请失败'
      } finally {
        applying.value = false
      }
    }

    const closeMembersModal = () => { showMembersModal.value = false }

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
      goBack,
      selectRoom,
      sendMessage,
      viewMembers,
      openCreateRoomModal,
      closeCreateRoomModal,
  createForm,
      showCreateModal,
      creating,
      modalError,
  editMode,
      typeLabel,
      formatTime,
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
  submitRoom
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

.header-actions { margin-left: auto; }
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
}
.danger-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
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

.error { color: #dc3545; margin-top: 8px; font-size: 12px; }

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
