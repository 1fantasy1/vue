<template>
  <div class="page">
  <div :class="['chat-layout', { 'full-screen': isFullScreen }]">
      <!-- 移动端遮罩层 -->
      <div 
        v-if="sidebarOpen" 
        class="mobile-overlay"
        @click="closeSidebar"
      ></div>
      
      <div 
        class="sidebar" 
        :class="{ 'mobile-open': sidebarOpen }"
  @touchstart.passive="handleTouchStart"
  @touchmove.passive="handleTouchMove"
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
            <button class="back-home-btn" @click="goHome" title="返回首页">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
              <span class="back-text">首页</span>
            </button>
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
            <!-- 更多（群聊详情） -->
            <button 
              class="action-btn" 
              @click="openDetailsDrawer" 
              title="群聊详情"
              v-if="selectedRoom"
            >
              <!-- 三个点图标 -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="6" cy="12" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="18" cy="12" r="1.8" />
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
          <!-- 微信风格工具栏 -->
          <div class="toolbar">
            <button class="tool-btn" title="表情（占位）">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3 7a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM7.34 14.94a5.98 5.98 0 009.32 0 .75.75 0 10-1.14-.96 4.48 4.48 0 01-7.04 0 .75.75 0 00-1.14.96z"/>
              </svg>
            </button>
            <button class="tool-btn" @click="() => fileInput?.click()" title="发送文件">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.5 6.5l-9 9a2.121 2.121 0 103 3l7.5-7.5a4.243 4.243 0 10-6-6L5.5 11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="tool-btn" title="截图（占位）">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 4a3 3 0 00-3 3v1h2V7a1 1 0 011-1h1V4H7zm9 0h-1v2h1a1 1 0 011 1v1h2V7a3 3 0 00-3-3zM4 14v3a3 3 0 003 3h1v-2H7a1 1 0 01-1-1v-3H4zm16 0h-2v3a1 1 0 01-1 1h-1v2h1a3 3 0 003-3v-3z"/>
              </svg>
            </button>
            <!-- 语音录制按钮 -->
            <button class="tool-btn mic" :class="{ active: isRecording }" @click="toggleRecording" :title="isRecording ? '停止录音' : '语音消息'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path v-if="!isRecording" d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 7a1 1 0 001-1v-1h-2v1a1 1 0 001 1z"/>
                <path v-else d="M8 8h8v8H8z"/>
              </svg>
              <span v-if="isRecording" class="record-dot"></span>
            </button>
            <div class="toolbar-spacer"></div>
          </div>

          <input ref="fileInput" type="file" @change="onFileChange" accept="image/*,video/*,audio/*,*/*" style="display:none" />

          <!-- 录音中/录音完成预览条 -->
          <div v-if="isRecording || recordedBlob" class="recording-row">
            <template v-if="isRecording">
              <span class="rec-indicator"><span class="dot"></span> 正在录音… {{ formattedRecordTime }}</span>
              <div class="rec-actions">
                <el-button size="small" type="primary" @click="stopRecording">停止</el-button>
                <el-button size="small" @click="cancelRecording">取消</el-button>
              </div>
            </template>
            <template v-else>
              <audio :src="recordedUrl" controls class="preview-audio"></audio>
              <div class="rec-actions">
                <el-button size="small" type="primary" @click="sendRecordedAudio" :loading="sending">发送语音</el-button>
                <el-button size="small" @click="redoRecording">重录</el-button>
                <el-button size="small" type="danger" @click="cancelRecording">删除</el-button>
              </div>
            </template>
          </div>

          <!-- 多行编辑器：Enter 发送，Shift+Enter 换行 -->
          <textarea
            v-model="newMessage"
            class="wechat-editor"
            placeholder="输入消息..."
            @keydown="handleEditorKeydown"
            rows="3"
          ></textarea>

          <div class="send-row">
            <span class="send-hint">按 Enter 发送，Shift+Enter 换行</span>
            <el-button type="primary" :loading="sending" :disabled="!newMessage.trim() && !selectedFile" @click="sendMessage">
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
          <el-select v-model="createForm.type" placeholder="请选择类型" style="width:100%" popper-class="chatrooms-popper">
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

    <!-- 群聊详情 Drawer -->
    <el-drawer
      v-model="showDetailsDrawer"
      title="群聊详情"
      direction="rtl"
      size="420px"
  :append-to-body="true"
  :z-index="3000"
      :with-header="true"
    >
      <div class="room-details" v-if="selectedRoom">
        <div class="detail-row">
          <span class="label">名称</span>
          <span class="value">{{ selectedRoom.name || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">群聊ID</span>
          <span class="value id">
            {{ selectedRoom.id }}
            <el-button size="small" text type="primary" @click="copyRoomId" title="复制群聊ID">
              <el-icon><DocumentCopy /></el-icon>
            </el-button>
          </span>
        </div>
        <div class="detail-row">
          <span class="label">类型</span>
          <span class="value">{{ typeLabel(selectedRoom.type) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">人数</span>
          <span class="value">{{ selectedRoom.members_count || 0 }}</span>
        </div>
        <div class="detail-row" v-if="selectedRoom.online_members_count != null">
          <span class="label">在线</span>
          <span class="value">{{ selectedRoom.online_members_count }}</span>
        </div>
        <div class="detail-row">
          <span class="label">主题色</span>
          <span class="value">
            <span class="color-dot" :style="{ background: selectedRoom.color || '#4facfe' }"></span>
            <span>{{ selectedRoom.color || '#4facfe' }}</span>
          </span>
        </div>
        <div class="detail-row" v-if="selectedRoom.created_at">
          <span class="label">创建时间</span>
          <span class="value">{{ formatTime(selectedRoom.created_at) }}</span>
        </div>
        <div class="detail-row" v-if="selectedRoom.description">
          <span class="label">简介</span>
          <span class="value">{{ selectedRoom.description }}</span>
        </div>

        <!-- 详情功能区：将原先的按钮改为直接在抽屉内展示内容 -->
        <div class="detail-section" style="margin-top:16px;">
          <el-tabs v-model="detailsTab">
            <el-tab-pane label="成员" name="members">
              <div class="members-list">
                <div class="member-item" v-for="m in members" :key="m.id || m.member_id">
                  <div class="member-left">
                    <el-avatar :size="36" :style="{ background: '#8aa1ff', color: '#fff' }">{{ (m.member_name || String(m.member_id)).charAt(0) }}</el-avatar>
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
                      popper-class="chatrooms-popper"
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
                <el-empty description="暂无成员" v-if="members && members.length === 0" />
              </div>
            </el-tab-pane>

            <el-tab-pane label="入群申请" name="joins" v-if="canManageMembers">
              <div class="filter-row" style="margin-bottom:8px;">
                <span>状态筛选</span>
                <el-select v-model="joinStatusFilter" size="small" style="width:160px" @change="loadJoinRequests" popper-class="chatrooms-popper">
                  <el-option label="全部" value="" />
                  <el-option label="待处理" value="pending" />
                  <el-option label="已通过" value="approved" />
                  <el-option label="已拒绝" value="rejected" />
                </el-select>
              </div>
              <div class="members-list">
                <div class="member-item" v-for="jr in joinRequests" :key="jr.id">
                  <div class="member-left">
                    <el-avatar :size="36">{{ String(jr.requester_id).charAt(0) }}</el-avatar>
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
            </el-tab-pane>

            <el-tab-pane label="房间设置" name="settings" v-if="canManageRoom">
              <el-form label-width="80px">
                <el-form-item label="名称">
                  <el-input v-model="createForm.name" placeholder="请输入聊天室名称" />
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="createForm.type" placeholder="请选择类型" style="width:100%" popper-class="chatrooms-popper">
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
              <div style="text-align:right;">
                <el-button type="primary" :loading="creating" @click="submitRoom">保存</el-button>
              </div>
              <div class="error" v-if="modalError">{{ modalError }}</div>
            </el-tab-pane>

            <el-tab-pane label="危险操作" name="danger" v-if="canDeleteRoom">
              <el-alert type="warning" title="此操作不可恢复，请谨慎" show-icon style="margin-bottom:8px;" />
              <el-button type="danger" plain @click="deleteRoom">删除聊天室</el-button>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Search, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import remoteApiService from '@/services/remoteApi.js'
import CollectButton from '@/components/CollectButton.vue'

export default {
  name: 'ChatRooms',
  components: { Search, DocumentCopy, CollectButton },
  setup() {
  const router = useRouter()
  const route = useRoute()
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
  const showDetailsDrawer = ref(false)
  const detailsTab = ref('members')
    const currentUser = ref(null)
    const currentUserId = ref(null)
    // 权限标记（若外层或模板存在引用，避免未定义告警）
  const noAccess = ref(false)
  // 当前用户在选中房间的角色信息
  const currentUserRole = ref(null)
  const roleLoading = ref(false)
  const userRoomRoles = ref({})

  // 是否全屏（由路由 meta 控制）
  const isFullScreen = computed(() => route.matched.some(r => r.meta && r.meta.fullScreen))

  // 移动端侧边栏状态
    const sidebarOpen = ref(false)

    // Modals state
  const showCreateModal = ref(false)
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

    // 语音录制相关
    const isRecording = ref(false)
    const recordedBlob = ref(null)
    const recordedUrl = ref('')
    const recordMs = ref(0)
    const formattedRecordTime = computed(() => {
      const s = Math.floor(recordMs.value / 1000)
      const mm = String(Math.floor(s / 60)).padStart(2, '0')
      const ss = String(s % 60).padStart(2, '0')
      return `${mm}:${ss}`
    })
    let mediaRecorder = null
    let recordTimer = null
    let recordChunks = []

    // 跳转首页
    const goHome = () => {
      // 直接按路由名或路径均可
      router.push({ name: 'Home' }).catch(() => {})
    }

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

      // 打开群聊详情抽屉（在移动端确保先关闭侧边栏以避免遮罩干扰）
      const openDetailsDrawer = async () => {
        sidebarOpen.value = false
        showDetailsDrawer.value = true
        detailsTab.value = 'members'
        // 初次打开加载成员列表
        await fetchMembers()
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

    const fetchMembers = async () => {
      if (!selectedRoom.value) return
      modalError.value = ''
      try {
        const resp = await remoteApiService.chatRooms.getMembers(selectedRoom.value.id)
        const payload = resp?.data ?? resp
        const data = payload?.data || (Array.isArray(payload) ? payload : [])
        members.value = data
        memberRoleEdit.value = {}
        data.forEach(m => { memberRoleEdit.value[m.member_id] = m.role })
      } catch (e) {
        modalError.value = e.message || '加载成员失败'
      }
    }

  // 旧成员弹窗逻辑已移除，改为抽屉内成员 Tab

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

    const populateFormFromRoom = () => {
      if (!selectedRoom.value) return
      createForm.value = {
        name: selectedRoom.value.name || '',
        type: selectedRoom.value.type || 'general',
        project_id: selectedRoom.value.project_id || null,
        course_id: selectedRoom.value.course_id || null,
        color: selectedRoom.value.color || '#4facfe'
      }
      editMode.value = true
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
      // 仅在需要高亮时返回合法类型；普通成员不传 type（undefined），避免 Element Plus 警告
      const map = {
        king: 'danger',    // 红色 - 最高权限
        admin: 'warning'   // 橙色 - 管理权限
      }
      return map[role] // 未匹配时为 undefined，不会绑定到 <el-tag type>
    }

    const getStatusTagType = (status) => {
      const map = {
        pending: 'warning',   // 橙色 - 待处理
        approved: 'success',  // 绿色 - 已通过
        rejected: 'danger'    // 红色 - 已拒绝
      }
      return map[status] // 未匹配时为 undefined，不会绑定到 <el-tag type>
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
  isAudio: m.message_type === 'audio' ? true : (m.media_url ? isAudioUrl(m.media_url) : false),
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

  // 旧入群申请弹窗逻辑已移除，改为抽屉内申请 Tab

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

  // 旧成员弹窗关闭函数已移除

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
      if (mime.startsWith('audio/')) return 'audio'
      if (mime.startsWith('image/')) return 'image'
      if (mime.startsWith('video/')) return 'video'
      // fallback by extension
      const name = (file.name || '').toLowerCase()
      const ext = name.split('.').pop()
      const imageExts = ['png','jpg','jpeg','gif','webp','bmp','svg','tiff','avif']
      const videoExts = ['mp4','mov','m4v','avi','mkv']
      const audioExts = ['mp3','wav','ogg','m4a','aac','flac','oga','weba','opus','amr','webm']
      if (imageExts.includes(ext)) return 'image'
      if (videoExts.includes(ext)) return 'video'
      if (audioExts.includes(ext)) return 'audio'
      return 'file'
    }

    const toggleRecording = async () => {
      if (isRecording.value) { await stopRecording(); return }
      await startRecording()
    }

    const startRecording = async () => {
      try {
        recordedBlob.value = null
        recordedUrl.value = ''
        recordMs.value = 0
        recordChunks = []
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) recordChunks.push(e.data) }
        mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(recordChunks, { type: mediaRecorder?.mimeType || 'audio/webm' })
            recordedBlob.value = blob
            recordedUrl.value = URL.createObjectURL(blob)
          } catch {}
          // 停止所有轨道
          stream.getTracks().forEach(t => t.stop())
          isRecording.value = false
          if (recordTimer) { clearInterval(recordTimer); recordTimer = null }
        }
        mediaRecorder.start()
        isRecording.value = true
        recordTimer = setInterval(() => { recordMs.value += 200 }, 200)
      } catch (e) {
        ElMessage.error('无法开始录音：' + (e.message || '请检查麦克风权限'))
      }
    }

    const stopRecording = async () => {
      try { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop() } catch {}
    }

    const cancelRecording = () => {
      try { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop() } catch {}
      if (recordedUrl.value) { URL.revokeObjectURL(recordedUrl.value) }
      recordedBlob.value = null
      recordedUrl.value = ''
      recordMs.value = 0
      isRecording.value = false
      if (recordTimer) { clearInterval(recordTimer); recordTimer = null }
    }

    const redoRecording = async () => { cancelRecording(); await startRecording() }

    const sendRecordedAudio = async () => {
      if (!recordedBlob.value) return
      try {
        const mime = recordedBlob.value.type || 'audio/webm'
        const file = new File([recordedBlob.value], `voice_${Date.now()}.webm`, { type: mime })
        selectedFile.value = file
        await sendMessage()
        cancelRecording()
      } catch (e) {
        ElMessage.error('发送语音失败：' + (e.message || '未知错误'))
      }
    }

    // 文本编辑器快捷键：Enter 发送，Shift+Enter 换行
    const handleEditorKeydown = (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault()
          sendMessage()
        }
      }
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
  // 切换详情抽屉内的 Tab 时，按需加载数据
  watch(detailsTab, async (tab) => {
    if (tab === 'members') {
      await fetchMembers()
    } else if (tab === 'joins') {
      await loadJoinRequests()
    } else if (tab === 'settings') {
      populateFormFromRoom()
    }
  })

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
  // 旧 viewMembers 已移除
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
  currentUserId,
  currentUserRole,
  roleLoading,
      isRoomCreator,
      isRoomAdmin,
      isRoomKing,
      canManageRoom,
      canManageMembers,
      canDeleteRoom,
      updateCurrentUserRole,
  // voice recording
  isRecording,
  recordedBlob,
  recordedUrl,
  formattedRecordTime,
  toggleRecording,
  startRecording,
  stopRecording,
  cancelRecording,
  redoRecording,
  sendRecordedAudio,
      // members
  // 旧 showMembersModal 已移除
      members,
      memberRoleEdit,
    fetchMembers,
      changeMemberRole,
      removeMember,
  // 旧 closeMembersModal 已移除
      // join requests
  // 旧入群申请弹窗字段与方法已移除
      joinRequests,
      joinStatusFilter,
  joinLoading,
      loadJoinRequests,
      processJoin,
      changeTab,
  openUpdateRoomModal,
  populateFormFromRoom,
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
  handleTouchMove,
  handleEditorKeydown,
  goHome,
  // layout
  isFullScreen,
  // details drawer
  showDetailsDrawer,
  openDetailsDrawer,
  detailsTab
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

/* 全屏时（由 App.vue 加类控制容器），让聊天占满视口 */
:global(body.full-screen-page) .container.full-screen-container .page {
  padding: 0 !important;            /* 去掉外边距 */
  min-height: 100vh !important;     /* 占满视口 */
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
  grid-template-columns: 280px 1fr; /* 更接近微信左栏宽度 */
  gap: 20px;
  height: calc(100vh - 180px);
}

/* 路由声明全屏时，直接拉满视口 */
.chat-layout.full-screen {
  height: 100vh;
  gap: 0;
}

:global(body.full-screen-page) .container.full-screen-container .chat-layout {
  height: 100vh;         /* 真正全屏高度 */
  gap: 0;                /* 去掉容器间隙 */
  grid-template-columns: 280px 1fr;
}

/* 全屏时，取消外围卡片式边框与圆角，让内容贴边更像桌面 IM */
:global(body.full-screen-page) .container.full-screen-container .sidebar,
:global(body.full-screen-page) .container.full-screen-container .chat-area {
  border-radius: 0;
}

:global(body.full-screen-page) .container.full-screen-container .sidebar { 
  border: none; 
  border-right: 1px solid #e9ecef; /* 细分割线，更像桌面 IM */
}
:global(body.full-screen-page) .container.full-screen-container .chat-area { border: none; }

/* 让滚动区域绝对填满高度 */
:global(body.full-screen-page) .container.full-screen-container .messages-container {
  min-height: 0;
}

.sidebar {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* 让左右拼接更自然：默认情况下，靠内侧改为直角 */
.sidebar { border-top-right-radius: 0; border-bottom-right-radius: 0; }

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
  /* 隐藏滚动条（仍可滚动），与消息列表保持一致 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ / Edge Legacy */
}

/* WebKit/Blink 隐藏滚动条 */
.room-list::-webkit-scrollbar {
  width: 0;
  height: 0;
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

/* 让左右拼接更自然：默认情况下，靠内侧改为直角 */
.chat-area { border-top-left-radius: 0; border-bottom-left-radius: 0; }

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

/* 返回首页按钮（替代 chat-avatar） */
.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: #fff;
  color: #2c3e50;
  cursor: pointer;
  transition: all .15s ease;
  /* 防止按钮被压缩过小导致文字换行变成竖排 */
  white-space: nowrap;
  flex: 0 0 auto;
}
.back-home-btn:hover { background: #f8f9fa; }
.back-home-btn:active { transform: translateY(1px); }
.back-home-btn .back-text { 
  font-size: 13px; 
  display: inline-block; 
  white-space: nowrap; 
}

.chat-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  /* 避免标题过长把左侧按钮挤压变窄，从而导致“首页”换行 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 群聊详情 Drawer 样式 */
.room-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #edf2f7;
}
.detail-row:last-child { border-bottom: none; }
.detail-row .label {
  color: #6c757d;
  font-size: 12px;
}
.detail-row .value {
  color: #2c3e50;
  font-weight: 500;
}
.detail-row .value.id {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  border: 1px solid #e9ecef;
}
.detail-section .el-button + .el-button { margin-left: 8px; }

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 隐藏滚动条（仍可滚动） */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ / Edge Legacy */
}

/* WebKit/Blink 隐藏滚动条 */
.messages-container::-webkit-scrollbar {
  width: 0;
  height: 0;
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

/* 工具栏（微信风格） */
.toolbar {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 8px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
}
.tool-btn:hover { background: #f2f3f5; color: #111827; }
.toolbar-spacer { flex: 1; }
.tool-btn.mic.active { color: #ef4444; }
.record-dot { width: 6px; height: 6px; background: #ef4444; border-radius: 50%; margin-left: 6px; box-shadow: 0 0 0 2px rgba(239,68,68,.2); }

.recording-row { display: flex; align-items: center; gap: 12px; padding: 6px 0; }
.rec-indicator { color: #ef4444; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
.rec-indicator .dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: pulse 1.2s infinite; }
.rec-actions { display: inline-flex; gap: 8px; margin-left: auto; }
.preview-audio { height: 32px; }

@keyframes pulse { 0%{ opacity:.2 } 50%{ opacity:1 } 100%{ opacity:.2 } }

/* 多行编辑器 */
.wechat-editor {
  width: 100%;
  box-sizing: border-box;
  resize: none;
  border: none;
  outline: none;
  padding: 6px 2px 6px 2px;
  font-size: 14px;
  line-height: 1.6;
  min-height: 70px;
  background: transparent;

}

.send-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.send-hint { color: #94a3b8; font-size: 12px; }

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

/* 防止 el-avatar 在 Flex 布局中被挤压变形 */
.member-left :deep(.el-avatar) {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
  border-radius: 50%;
  flex: 0 0 36px; /* 不允许收缩 */
  overflow: hidden;
}
.member-left :deep(.el-avatar) img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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
  border-radius: 0;
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
  border-radius: 0;
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
  border-radius: 0;
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

  .back-home-btn {
    height: 32px;
    padding: 0 8px;
    border-radius: 6px;
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

  .recording-row { flex-wrap: wrap; gap: 8px; }

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

  /* Element Plus Dialog 移动端适配：防止超出视口 */
  :global(.el-overlay-dialog),
  :global(.el-modal-dialog) {
    inset: 0;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  /* Element Plus Drawer 移动端适配：抽屉占满宽度 */
  :global(.el-drawer) {
    width: 100% !important;
    max-width: none !important;
  }

  :global(.el-dialog) {
    width: calc(100vw - 32px) !important; /* 覆盖内联宽度 520/720px */
    max-width: none !important;
    margin: 0 !important; /* 去掉顶部 15vh 等默认外边距 */
    border-radius: 12px;
    max-height: calc(100svh - 32px);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  :global(.el-dialog__body) {
    overflow: auto; /* 内容超出时内部滚动 */
    flex: 1 1 auto;
    min-height: 0; /* 防止与 max-height 冲突导致溢出 */
  }

  :global(.el-dialog__footer) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
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
<style>
/* 聊天室页面内选择器的下拉层级提升，确保在抽屉/对话框(通常 2000-3000)/模态上可见 */
.chatrooms-popper {
  z-index: 4000 !important;
}
</style>
