<template>
  <div class="page">
  

  <!-- 社区动态流 -->
  <!-- 发布动态（页面内隐藏，改为弹窗） -->
  <div class="simple-card" v-if="false">
        
        <textarea
          class="composer-input"
          placeholder="有什么新鲜事想分享给大家?"
          v-model="newPost"
          maxlength="500"
          rows="3"
        ></textarea>

        <!-- 工具栏：图标 + 文本样式 -->
        <div class="composer-toolbar">
          <div class="toolbar-left">
            <button class="action-item" title="表情（暂未开放）">
              <span class="action-icon">😊</span>
              <span class="action-label">表情</span>
            </button>
            <button class="action-item" title="添加文件" @click="newPostMediaType = 'file'; showMediaInputs = true">
              <span class="action-icon">📄</span>
              <span class="action-label">添加文件</span>
            </button>
            <div class="action-item topic-item" @click="showTopicPicker = !showTopicPicker">
              <span class="action-icon">#</span>
              <span class="action-label">话题</span>
              <div class="topic-popover" v-if="showTopicPicker" @click.stop>
                <div class="topic-option" :class="{active: !selectedPostTopic}" @click="selectedPostTopic = ''; showTopicPicker = false">🏷️ 无标签</div>
                <div class="topic-option" v-for="topic in hotTopics" :key="topic.id" :class="{active: selectedPostTopic === topic.name}" @click="selectedPostTopic = topic.name; showTopicPicker = false"># {{ topic.name }}</div>
              </div>
            </div>
          </div>
          <div class="toolbar-right">
            <button class="schedule-btn" title="定时发送（暂未开放）">🕒</button>
            <select class="visibility-select" v-model="visibility">
              <option value="public">公开</option>
              <option value="friends">好友</option>
              <option value="private">私密</option>
            </select>
            <button class="publish-btn" @click="publishPost" :disabled="!canPublishPost">发送</button>
          </div>
        </div>
        <div class="composer-media-row" v-if="showMediaInputs || newPostMediaType">
          <div class="media-header">
            <span class="media-title">📎 添加媒体内容</span>
            <button class="media-toggle-btn" @click="toggleMediaInputs" title="收起">
              ✕
            </button>
          </div>
          
          <div class="media-fields-grid">
            <div class="media-field">
              <label class="media-label">
                <span class="label-icon">🎯</span>
                媒体类型
              </label>
              <select v-model="newPostMediaType" class="media-type-select">
                <option value="">选择类型</option>
                <option value="image">📸 图片</option>
                <option value="video">🎬 视频</option>
                <option value="audio">🎵 音频</option>
                <option value="file">📄 文件</option>
              </select>
            </div>
            
            <div class="media-field" v-if="newPostMediaType">
              <label class="media-label">
                <span class="label-icon">🔗</span>
                外部链接
              </label>
              <input 
                class="media-url-input" 
                v-model="newPostMediaUrl" 
                placeholder="粘贴链接地址..."
                :disabled="!!newPostFile"
              />
            </div>
            
            <div class="media-field" v-if="newPostMediaType">
              <label class="media-label">
                <span class="label-icon">📁</span>
                本地文件
              </label>
              <div class="file-upload-area">
                <input 
                  type="file" 
                  @change="onNewPostFileChange" 
                  class="file-input"
                  :disabled="!!newPostMediaUrl.trim()"
                  :accept="getFileAccept(newPostMediaType)"
                />
                <div class="file-upload-hint" v-if="!newPostFile">
                  <span class="upload-icon">⬆️</span>
                  <span>点击选择{{getMediaTypeName(newPostMediaType)}}</span>
                </div>
                <div class="file-selected" v-if="newPostFile">
                  <span class="file-icon">{{getFileIcon(newPostFile.name)}}</span>
                  <span class="file-name">{{newPostFile.name}}</span>
                  <button @click="clearSelectedFile" class="clear-file-btn">✕</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="media-status" v-if="newPostMediaType">
            <div class="status-item" :class="{ active: newPostMediaUrl.trim() }">
              <span class="status-icon">🔗</span>
              <span>外部链接</span>
            </div>
            <div class="status-divider">或</div>
            <div class="status-item" :class="{ active: newPostFile }">
              <span class="status-icon">📁</span>
              <span>本地上传</span>
            </div>
          </div>
        </div>

        <!-- 媒体预览 -->
        <div
          class="composer-media-preview"
          v-if="newPostMediaType && (newPostMediaUrl || newPostFile)"
        >
          <template v-if="newPostMediaType === 'image'">
            <img
              class="preview-image"
              :src="newPostFile ? getObjectUrl(newPostFile) : newPostMediaUrl"
              alt="图片预览"
            />
          </template>
          <template v-else-if="newPostMediaType === 'video'">
            <video
              class="preview-video"
              :src="newPostFile ? getObjectUrl(newPostFile) : newPostMediaUrl"
              controls
              preload="metadata"
            ></video>
          </template>
          <template v-else-if="newPostMediaType === 'audio'">
            <audio
              class="preview-audio"
              :src="newPostFile ? getObjectUrl(newPostFile) : newPostMediaUrl"
              controls
              preload="metadata"
            ></audio>
          </template>
          <template v-else>
            <div class="preview-file">
              <span class="file-icon">{{ newPostFile ? getFileIcon(newPostFile.name) : '📄' }}</span>
              <span class="file-name">{{ newPostFile ? newPostFile.name : newPostMediaUrl }}</span>
            </div>
          </template>
        </div>
        
  <!-- 底部区域已合并进工具栏（右侧发送/可见范围） -->
  </div>

  <!-- 悬浮发布按钮 -->
  <button class="fab-compose" @click="openComposer" title="发布动态">✍️</button>

  <!-- 发布弹窗界面 -->
  <el-dialog
    v-model="showComposer"
    title="发布动态"
    width="700px"
    append-to-body
    :close-on-click-modal="true"
    :destroy-on-close="false"
    @closed="onComposerClosed"
  >
    <div class="compose-dialog-body">
      <!-- 复用原发布表单结构：只需插入核心表单区域 -->
      <textarea
        class="composer-input"
        placeholder="有什么新鲜事想分享给大家?"
        v-model="newPost"
        maxlength="500"
        rows="4"
      ></textarea>

      <div class="composer-toolbar">
        <div class="toolbar-left">
          <button class="action-item" title="表情（暂未开放）">
            <span class="action-icon">😊</span>
            <span class="action-label">表情</span>
          </button>
          <button class="action-item" title="添加文件" @click="newPostMediaType = 'file'; showMediaInputs = true">
            <span class="action-icon">📎</span>
            <span class="action-label">添加文件</span>
          </button>
          <div class="action-item topic-item" @click.stop="showTopicPicker = !showTopicPicker">
            <span class="action-icon">#</span>
            <span class="action-label">话题</span>
            <div class="topic-popover" v-if="showTopicPicker" @click.stop>
              <div class="topic-option" :class="{active: !selectedPostTopic}" @click="selectedPostTopic = ''; showTopicPicker = false">🏷️ 无标签</div>
              <div class="topic-option" v-for="topic in hotTopics" :key="topic.id" :class="{active: selectedPostTopic === topic.name}" @click="selectedPostTopic = topic.name; showTopicPicker = false"># {{ topic.name }}</div>
            </div>
          </div>
        </div>
        <div class="toolbar-right">
          <button class="schedule-btn" title="定时发送（暂未开放）">🕒</button>
          <select class="visibility-select" v-model="visibility">
            <option value="public">公开</option>
            <option value="friends">好友</option>
            <option value="private">私密</option>
          </select>
          <button class="publish-btn" @click="publishPost" :disabled="!canPublishPost">发送</button>
        </div>
      </div>

      <div class="composer-media-row" v-if="showMediaInputs || newPostMediaType">
        <div class="media-header">
          <span class="media-title">📎 添加媒体内容</span>
          <button class="media-toggle-btn" @click="toggleMediaInputs" title="收起">✕</button>
        </div>
        <div class="media-fields-grid">
          <div class="media-field">
            <label class="media-label"><span class="label-icon">🎯</span>媒体类型</label>
            <select v-model="newPostMediaType" class="media-type-select">
              <option value="">选择类型</option>
              <option value="image">📸 图片</option>
              <option value="video">🎬 视频</option>
              <option value="audio">🎵 音频</option>
              <option value="file">📄 文件</option>
            </select>
          </div>
          <div class="media-field" v-if="newPostMediaType">
            <label class="media-label"><span class="label-icon">🔗</span>外部链接</label>
            <input class="media-url-input" v-model="newPostMediaUrl" placeholder="粘贴链接地址..." :disabled="!!newPostFile" />
          </div>
          <div class="media-field" v-if="newPostMediaType">
            <label class="media-label"><span class="label-icon">📁</span>本地文件</label>
            <div class="file-upload-area">
              <input type="file" @change="onNewPostFileChange" class="file-input" :disabled="!!newPostMediaUrl.trim()" :accept="getFileAccept(newPostMediaType)" />
              <div class="file-upload-hint" v-if="!newPostFile">
                <span class="upload-icon">⬆️</span>
                <span>点击选择{{getMediaTypeName(newPostMediaType)}}</span>
              </div>
              <div class="file-selected" v-if="newPostFile">
                <span class="file-icon">{{getFileIcon(newPostFile.name)}}</span>
                <span class="file-name">{{newPostFile.name}}</span>
                <button @click="clearSelectedFile" class="clear-file-btn">✕</button>
              </div>
            </div>
          </div>
        </div>
        <div class="media-status" v-if="newPostMediaType">
          <div class="status-item" :class="{ active: newPostMediaUrl.trim() }"><span class="status-icon">🔗</span><span>外部链接</span></div>
          <div class="status-divider">或</div>
          <div class="status-item" :class="{ active: newPostFile }"><span class="status-icon">📁</span><span>本地上传</span></div>
        </div>
      </div>

      <div class="composer-media-preview" v-if="newPostMediaType && (newPostMediaUrl || newPostFile)">
        <template v-if="newPostMediaType === 'image'">
          <img class="preview-image" :src="newPostFile ? getObjectUrl(newPostFile) : newPostMediaUrl" alt="图片预览" />
        </template>
        <template v-else-if="newPostMediaType === 'video'">
          <video class="preview-video" :src="newPostFile ? getObjectUrl(newPostFile) : newPostMediaUrl" controls preload="metadata"></video>
        </template>
        <template v-else-if="newPostMediaType === 'audio'">
          <audio class="preview-audio" :src="newPostFile ? getObjectUrl(newPostFile) : newPostMediaUrl" controls preload="metadata"></audio>
        </template>
        <template v-else>
          <div class="preview-file"><span class="file-icon">{{ newPostFile ? getFileIcon(newPostFile.name) : '📄' }}</span><span class="file-name">{{ newPostFile ? newPostFile.name : newPostMediaUrl }}</span></div>
        </template>
      </div>
    </div>
  </el-dialog>
    <!-- 话题过滤（下拉菜单） -->
    <div class="simple-card topic-filter-card">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-weight:600; color:#495057;">筛选话题</span>
        <el-select
          v-model="selectedTopic"
          value-key="id"
          placeholder="全部"
          clearable
          style="min-width: 200px;"
          @change="selectTopic"
        >
          <el-option :value="null" label="全部" />
          <el-option
            v-for="t in hotTopics"
            :key="t.id"
            :label="'# ' + t.name"
            :value="t"
          />
        </el-select>
      </div>
    </div>

    <!-- 动态流内容 -->
    <div class="feed-container">
      <!-- 加载状态 -->
      <div v-if="isLoading && posts.length === 0" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载动态...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!isLoading && filteredPosts.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无动态</h3>
        <p v-if="selectedTopic">该话题下暂无动态，试试其他话题或发布第一条动态吧！</p>
        <p v-else>还没有动态，快来发布第一条动态吧！</p>
      </div>
      
      <!-- 动态列表 -->
      <div 
        class="feed-item" 
        v-for="post in filteredPosts" 
        :key="post.id"
      >
        <div class="post-header">
          <div class="post-user">
            <div class="user-avatar">{{ post.avatar }}</div>
            <div class="user-info">
              <div class="username">{{ post.username }}</div>
              <div class="post-time">{{ formatTime(post.timestamp) }}</div>
            </div>
          </div>
          <div class="post-actions-right" v-if="currentUser?.id !== post.ownerId">
            <button 
              class="follow-btn" 
              :class="{ followed: post.isFollowed }" 
              @click="toggleFollow(post)"
              :title="post.isFollowed ? '点击取消关注' : '点击关注该用户'"
            >
              <span class="follow-icon">{{ post.isFollowed ? '✓' : '+' }}</span>
              <span class="follow-text">{{ post.isFollowed ? '已关注' : '关注' }}</span>
              <div class="follow-ripple" v-if="post.followRipple"></div>
            </button>
          </div>
          <div class="post-actions-right" v-else>
            <button class="action-btn" @click="startEdit(post)">{{ post.isEditing ? '取消' : '编辑' }}</button>
            <button class="action-btn delete-btn" @click="deletePost(post)">删除</button>
          </div>
          <div class="post-topic" v-if="post.topic">
            <span class="topic-badge"># {{ post.topic }}</span>
          </div>
        </div>
        
        <div class="post-content">
          <template v-if="!post.isEditing">
            {{ post.content }}
          </template>
          <template v-else>
            <div class="edit-form">
              <div class="edit-form-header">
                <div class="edit-icon">✏️</div>
                <span class="edit-title">编辑动态</span>
              </div>
              
              <div class="edit-content">
                <div class="edit-label-row">
                  <label class="edit-label">内容</label>
                  <span class="char-counter">{{ post.editContent?.length || 0 }}/500</span>
                </div>
                <textarea 
                  class="edit-textarea" 
                  v-model="post.editContent" 
                  rows="3"
                  maxlength="500"
                  placeholder="编辑动态内容..."
                ></textarea>
              </div>
              
              <div class="edit-topic">
                <label class="edit-label">话题标签</label>
                <div class="topic-select-wrapper">
                  <select v-model="post.editTopic" class="edit-topic-select">
                    <option value="">🏷️ 无标签</option>
                    <option v-for="topic in hotTopics" :key="topic.id" :value="topic.name">
                      # {{ topic.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="edit-actions">
                <button 
                  class="edit-cancel-btn" 
                  @click="cancelEdit(post)"
                >
                  取消
                </button>
                <button 
                  class="edit-save-btn" 
                  @click="savePost(post)" 
                  :disabled="!post.editContent?.trim()"
                >
                  保存修改
                </button>
              </div>
            </div>
          </template>
        </div>
        
        <div class="post-images" v-if="post.images && post.images.length">
          <img 
            v-for="(image, index) in post.images" 
            :key="index" 
            :src="image" 
            :alt="`图片${index + 1}`"
            class="post-image"
          />
        </div>
        
        <div class="post-video" v-if="post.videoUrl">
          <video :src="post.videoUrl" controls preload="metadata"></video>
        </div>
        
        <div class="post-audio" v-if="post.audioUrl">
          <audio :src="post.audioUrl" controls preload="metadata"></audio>
        </div>
        
        <div class="post-actions">
          <button 
            class="action-btn like-btn" 
            @click="toggleLike(post)"
            :class="{ 'liked': post.isLiked }"
          >
            <span class="action-icon">{{ post.isLiked ? '❤️' : '🤍' }}</span>
            <span class="action-text">{{ post.likes }}</span>
          </button>
          
          <button 
            class="action-btn comment-btn"
            @click="toggleComments(post)"
          >
            <span class="action-icon">💬</span>
            <span class="action-text">{{ post.commentsCount !== undefined ? post.commentsCount : post.comments.length }}</span>
          </button>
          
          <button class="action-btn share-btn">
            <span class="action-icon">🔄</span>
            <span class="action-text">分享</span>
          </button>
        </div>
        
        <!-- 评论区域 -->
        <div class="comments-section" v-if="post.showComments">
          <div class="comment-input-container">
            <input
              type="text"
              class="comment-input"
              placeholder="写个评论..."
              v-model="post.newComment"
              @keyup.enter="addComment(post)"
            />
            <button 
              class="comment-submit-btn" 
              @click="addComment(post)"
              :disabled="!canSubmitTopComment(post)"
            >
              发送
            </button>
          </div>
          
          <div class="comments-list">
            <div 
              class="comment-item" 
              v-for="comment in post.comments" 
              :key="comment.id"
            >
              <div class="comment-avatar">{{ comment.avatar }}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username">{{ comment.username }}</span>
                  <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
                </div>
                <div class="comment-text" v-if="!comment.isEditing">{{ comment.content }}</div>
                <div class="comment-edit" v-else>
                  <input class="comment-input" v-model="comment.editContent" />
                  <div class="comment-edit-actions">
                    <button class="comment-save-btn" @click="saveEditComment(comment)" :disabled="!comment.editContent?.trim()">
                      <span class="btn-icon">💾</span>
                      保存
                    </button>
                    <button class="comment-cancel-btn" @click="cancelEditComment(comment)">
                      <span class="btn-icon">✖️</span>
                      取消
                    </button>
                  </div>
                </div>
                <!-- 评论媒体展示 -->
                <div class="post-images" v-if="comment.images && comment.images.length">
                  <img 
                    v-for="(img, idx) in comment.images"
                    :key="idx"
                    :src="img"
                    class="post-image"
                    :alt="`评论图片${idx+1}`"
                  />
                </div>
                <div class="post-video" v-if="comment.videoUrl">
                  <video :src="comment.videoUrl" controls preload="metadata"></video>
                </div>
                <div class="post-audio" v-if="comment.audioUrl">
                  <audio :src="comment.audioUrl" controls preload="metadata"></audio>
                </div>
                <div class="comment-footer">
                  <button class="comment-action-btn comment-like-btn" @click="toggleLikeComment(post, comment)" :class="{ liked: comment.isLiked }">
                    <span class="comment-action-icon">{{ comment.isLiked ? '❤️' : '🤍' }}</span>
                    <span class="comment-action-text">{{ comment.likesCount }}</span>
                  </button>
                  <button class="comment-action-btn" @click="toggleReply(comment)">
                    <span class="comment-action-icon">↩️</span>
                    <span class="comment-action-text">回复</span>
                  </button>
                  <template v-if="currentUser?.id === comment.ownerId">
                    <button class="comment-action-btn comment-edit-btn" @click="editComment(comment)">
                      <span class="comment-action-icon">✏️</span>
                      <span class="comment-action-text">编辑</span>
                    </button>
                    <button class="comment-action-btn comment-delete-btn" @click="deleteComment(post, comment)">
                      <span class="comment-action-icon">🗑️</span>
                      <span class="comment-action-text">删除</span>
                    </button>
                  </template>
                </div>
                <div v-if="comment.replying" class="reply-box">
                  <input class="reply-input" v-model="comment.replyText" placeholder="回复内容..." @keyup.enter="submitReply(post, comment)" />
                  <div class="reply-media-row">
                    <select v-model="comment.replyMediaType" class="media-type-select">
                      <option value="">无</option>
                      <option value="image">图片</option>
                      <option value="video">视频</option>
                      <option value="audio">音频</option>
                      <option value="file">文件</option>
                    </select>
                    <input class="media-url-input" v-model="comment.replyMediaUrl" placeholder="外部URL（可选）" />
                    <input type="file" :accept="getFileAccept(comment.replyMediaType)" @change="(e)=>onReplyFileChange(comment,e)" />
                    <button class="reply-submit-btn" @click="submitReply(post, comment)" :disabled="!canSubmitReply(comment)">发送</button>
                  </div>
                </div>
                <div v-if="comment.replies && comment.replies.length" class="replies-list">
                  <div class="reply-item" v-for="rc in comment.replies" :key="rc.id">
                    <div class="comment-avatar">{{ rc.avatar }}</div>
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-username">{{ rc.username }}</span>
                        <span class="comment-time">{{ formatTime(rc.timestamp) }}</span>
                      </div>
                      <div class="comment-text">{{ rc.content }}</div>
                      <!-- 回复媒体展示 -->
                      <div class="post-images" v-if="rc.images && rc.images.length">
                        <img v-for="(img, i2) in rc.images" :key="i2" :src="img" class="post-image" :alt="`回复图片${i2+1}`" />
                      </div>
                      <div class="post-video" v-if="rc.videoUrl">
                        <video :src="rc.videoUrl" controls preload="metadata"></video>
                      </div>
                      <div class="post-audio" v-if="rc.audioUrl">
                        <audio :src="rc.audioUrl" controls preload="metadata"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
  <!-- 无限滚动哨兵 -->
  <div ref="infiniteSentinel" style="height: 1px; width: 100%;"></div>
    </div>

  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import remoteApiService from '@/services/remoteApi.js'

export default {
  name: 'Plaza',
  components: { },
  setup() {
    // 智能搜索模块已移除
    
  // 智能搜索相关数据已移除
    
    // 社区动态相关数据
    const onlineUsers = ref(128)
    const selectedTopic = ref(null)
    const selectedPostTopic = ref('')
  const showTopicPicker = ref(false)
  const visibility = ref('public')
    const newPost = ref('')
    const newPostFile = ref(null)
    const newPostMediaUrl = ref('')
    const newPostMediaType = ref('')
    const showMediaInputs = ref(false)
    const hasMore = ref(true)
  const showComposer = ref(false)

    const hotTopics = ref([
      { id: 1, name: '技术交流' },
      { id: 2, name: '项目分享' },
      { id: 3, name: '学习心得' },
      { id: 4, name: '职场话题' },
      { id: 5, name: '随便聊聊' }
    ])

    const posts = ref([])
    const isLoading = ref(false)
    const pageSize = ref(10)
    const offset = ref(0)
    const infiniteSentinel = ref(null)
    let observer = null
    const currentUser = ref(null)

    try {
      const cu = localStorage.getItem('currentUser')
      currentUser.value = cu ? JSON.parse(cu) : null
    } catch {}

    // 将论坛话题映射为现有UI的post对象
    const genAvatar = (name) => {
      const pool = ['👤','🧑','👩','👨‍💻','🤖','🦄','🐱','🐶','🦊','🐼']
      if (!name) return pool[0]
      const code = name.split('').reduce((s,c)=>s+c.charCodeAt(0),0)
      return pool[code % pool.length]
    }

  const mapTopicToPost = (t) => {
      const tagFirst = t?.tags ? String(t.tags).split(/[,#\s]+/).filter(Boolean)[0] : ''
      const mediaType = t?.media_type || null
      const mediaUrl = t?.media_url || null
      // 推断媒体类型（当后端未返回 media_type 时，基于 URL 简单判断）
      const isImg = mediaUrl && /(\.png|\.jpe?g|\.gif|\.webp|^data:image\/)/i.test(mediaUrl)
  const isVid = mediaUrl && /(\.mp4|\.webm|\.ogg|^data:video\/)/i.test(mediaUrl)
      const isAud = mediaUrl && /(\.mp3|\.wav|\.m4a|\.aac|\.ogg|^data:audio\/)/i.test(mediaUrl)
      const images = (mediaUrl && (mediaType === 'image' || isImg)) ? [mediaUrl] : []
      const videoUrl = (mediaUrl && (mediaType === 'video' || isVid)) ? mediaUrl : null
      const audioUrl = (mediaUrl && (mediaType === 'audio' || isAud)) ? mediaUrl : null
      return {
        id: t.id,
    ownerId: t.owner_id,
    ownerName: t.owner_name,
        username: t.owner_name || '用户',
        avatar: genAvatar(t.owner_name),
        content: t.content || t.title || '',
        topic: tagFirst || null,
        timestamp: t.created_at ? new Date(t.created_at) : new Date(),
        likes: t.likes_count ?? 0,
        isLiked: !!t.is_liked_by_current_user,
        images,
        videoUrl,
        audioUrl,
        comments: [],
        commentsCount: t.comments_count ?? 0,
        isFollowed: !!followStateByUserId.value[t.owner_id],
        showComments: false,
        newComment: '',
        isEditing: false,
        editContent: t.content || t.title || '',
        editTopic: tagFirst || '',
        followRipple: false
      }
    }

  const mapComment = (c) => ({
      id: c.id,
    ownerId: c.owner_id,
      username: c.owner_name || '用户',
      avatar: genAvatar(c.owner_name),
      content: c.content || '',
    timestamp: c.created_at ? new Date(c.created_at) : new Date(),
    likesCount: c.likes_count ?? 0,
    isLiked: !!c.is_liked_by_current_user,
    isEditing: false,
  editContent: c.content || '',
  replying: false,
  replyText: '',
  replyMediaType: '',
  replyMediaUrl: '',
  replyFile: null,
  // 媒体解析（评论可能包含图片/视频/音频）
  ...(() => {
    const mediaType = c?.media_type || null
    const mediaUrl = c?.media_url || null
    const isImg = mediaUrl && /(\.png|\.jpe?g|\.gif|\.webp|^data:image\/)/i.test(mediaUrl)
    const isVid = mediaUrl && /(\.mp4|\.webm|\.ogg|^data:video\/)/i.test(mediaUrl)
    const isAud = mediaUrl && /(\.mp3|\.wav|\.m4a|\.aac|\.ogg|^data:audio\/)/i.test(mediaUrl)
    return {
      images: (mediaUrl && (mediaType === 'image' || isImg)) ? [mediaUrl] : [],
      videoUrl: (mediaUrl && (mediaType === 'video' || isVid)) ? mediaUrl : null,
      audioUrl: (mediaUrl && (mediaType === 'audio' || isAud)) ? mediaUrl : null,
    }
  })(),
  replies: []
    })

  const pickData = (resp) => resp?.data ?? resp ?? []

    const loadTopics = async (reset = false) => {
      try {
        if (isLoading.value) return
        isLoading.value = true
        if (reset) {
          offset.value = 0
          posts.value = []
        }
        const options = { limit: pageSize.value, offset: offset.value }
        if (selectedTopic.value?.name) options.tag = selectedTopic.value.name
  const resp = await remoteApiService.forum.getTopics(options)
        const list = Array.isArray(pickData(resp)) ? pickData(resp) : []
        const mapped = list.map(mapTopicToPost)
        posts.value = reset ? mapped : posts.value.concat(mapped)
        offset.value += mapped.length
        hasMore.value = mapped.length === pageSize.value
      } catch (e) {
        hasMore.value = false
        ElMessage.error(e.message || '加载话题失败')
      } finally {
        isLoading.value = false
      }
    }

  const setupInfiniteObserver = () => {
      if (observer) observer.disconnect()
      if (!infiniteSentinel.value) return
      observer = new IntersectionObserver(async (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore.value && !isLoading.value) {
          await loadTopics(false)
        }
      }, { root: null, rootMargin: '0px', threshold: 0.1 })
      observer.observe(infiniteSentinel.value)
    }

    // 计算过滤后的动态
    const filteredPosts = computed(() => {
      // 如果正在加载中，返回当前的posts以避免闪烁
      if (isLoading.value && posts.value.length === 0) {
        return []
      }
      // 由于已经通过服务端过滤，直接返回posts
      return posts.value
    })

  // 推荐数据与类型选择已移除

  // 智能匹配相关方法已移除

    // 社区动态方法
    const selectTopic = async (topic) => {
      try {
        // 如果传入null，表示选择"全部"
        if (topic === null) {
          selectedTopic.value = null
        } else {
          // 正常的话题切换逻辑
          const newTopic = selectedTopic.value?.id === topic.id ? null : topic
          selectedTopic.value = newTopic
        }
        
        // 立即清空当前动态列表，显示加载状态
        posts.value = []
        await loadTopics(true)
      } catch (error) {
        console.error('选择话题失败:', error)
        ElMessage.error('加载话题动态失败，请重试')
      }
    }

    const onNewPostFileChange = (e) => {
      const f = e?.target?.files?.[0]
      newPostFile.value = f || null
    }

    const toggleMediaInputs = () => {
      showMediaInputs.value = !showMediaInputs.value
      if (!showMediaInputs.value) {
        // 清空媒体输入
        newPostFile.value = null
        newPostMediaUrl.value = ''
        newPostMediaType.value = ''
      }
    }

    const clearSelectedFile = () => {
      newPostFile.value = null
    }

    const openComposer = () => {
      showComposer.value = true
    }
    const onComposerClosed = () => {
      showTopicPicker.value = false
    }

    const getFileAccept = (mediaType) => {
      switch (mediaType) {
        case 'image': return 'image/*'
        case 'video': return 'video/*'
  case 'audio': return 'audio/*'
        case 'file': return '*/*'
        default: return '*/*'
      }
    }

    const getMediaTypeName = (mediaType) => {
      switch (mediaType) {
        case 'image': return '图片文件'
        case 'video': return '视频文件'
  case 'audio': return '音频文件'
        case 'file': return '任意文件'
        default: return '文件'
      }
    }

    const getFileIcon = (fileName) => {
      const ext = fileName.split('.').pop()?.toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️'
      if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return '🎬'
  if (['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(ext)) return '🎵'
      if (['pdf'].includes(ext)) return '📄'
      if (['doc', 'docx'].includes(ext)) return '📝'
      if (['zip', 'rar', '7z'].includes(ext)) return '📦'
      return '📄'
    }

    // 生成临时预览 URL（用于本地文件预览）
    const getObjectUrl = (file) => {
      if (!file) return ''
      try {
        return URL.createObjectURL(file)
      } catch {
        return ''
      }
    }

    const canPublishPost = computed(() => {
      const hasText = !!newPost.value.trim()
      const hasMedia = !!newPostFile.value || !!newPostMediaUrl.value.trim()
      if (!hasText && !hasMedia) return false
      if (hasMedia && !newPostMediaType.value) return false
      if (newPostFile.value && newPostMediaUrl.value.trim()) return false
      return true
    })

    const publishPost = async () => {
      if (!canPublishPost.value) return
      try {
        const payload = {
          content: newPost.value.trim() || undefined,
          tags: selectedPostTopic.value || undefined
        }
        if (newPostMediaUrl.value.trim()) {
          payload.media_url = newPostMediaUrl.value.trim()
          payload.media_type = newPostMediaType.value
        } else if (newPostFile.value) {
          payload.file = newPostFile.value
          payload.media_type = newPostMediaType.value
        }
  const resp = await remoteApiService.forum.createTopic(payload)
        const data = pickData(resp)
        const post = mapTopicToPost(data)
        posts.value.unshift(post)
        newPost.value = ''
        selectedPostTopic.value = ''
        newPostFile.value = null
        newPostMediaUrl.value = ''
        newPostMediaType.value = ''
        showMediaInputs.value = false
        ElMessage.success('动态发布成功！')
      } catch (e) {
        ElMessage.error(e.message || '发布失败')
      }
    }

    const toggleLike = async (post) => {
      const prev = post.isLiked
      try {
        post.isLiked = !post.isLiked
        post.likes += post.isLiked ? 1 : -1
        if (post.isLiked) {
          await remoteApiService.forum.likeTopic(post.id)
        } else {
          await remoteApiService.forum.unlikeTopic(post.id)
        }
      } catch (e) {
        // revert
        post.isLiked = prev
        post.likes += prev ? 1 : -1
        ElMessage.error(e.message || '操作失败')
      }
    }

  const toggleComments = async (post) => {
      post.showComments = !post.showComments
      if (post.showComments && post.comments.length === 0) {
        try {
          const resp = await remoteApiService.forum.getComments(post.id, null, 50, 0)
          const list = Array.isArray(pickData(resp)) ? pickData(resp) : []
          post.comments = list.map(mapComment)
        } catch (e) {
          ElMessage.error(e.message || '加载评论失败')
        }
      }
    }

    const addComment = async (post) => {
      const hasText = !!post.newComment?.trim()
      const hasMedia = !!post.newCommentFile || !!post.newCommentMediaUrl?.trim()
      if (!hasText && !hasMedia) return
      if (hasMedia && !post.newCommentMediaType) {
        ElMessage.warning('请选择评论的媒体类型')
        return
      }
      if (post.newCommentFile && post.newCommentMediaUrl?.trim()) {
        ElMessage.warning('请二选一：外部URL 或 上传文件')
        return
      }
      try {
        const payload = { content: post.newComment?.trim() || undefined }
        if (post.newCommentMediaUrl?.trim()) {
          payload.media_url = post.newCommentMediaUrl.trim()
          payload.media_type = post.newCommentMediaType
        } else if (post.newCommentFile) {
          payload.file = post.newCommentFile
          payload.media_type = post.newCommentMediaType
        }
  const resp = await remoteApiService.forum.addComment(post.id, payload)
        const data = pickData(resp)
        post.comments.push(mapComment(data))
        post.commentsCount = (post.commentsCount || 0) + 1
        post.newComment = ''
        post.newCommentFile = null
        post.newCommentMediaUrl = ''
        post.newCommentMediaType = ''
        ElMessage.success('评论发布成功！')
      } catch (e) {
        ElMessage.error(e.message || '评论失败')
      }
    }

    const toggleReply = (comment) => {
      comment.replying = !comment.replying
      if (comment.replying) {
        comment.replyText = ''
        comment.replyMediaType = ''
        comment.replyMediaUrl = ''
        comment.replyFile = null
      }
    }

    const onReplyFileChange = (comment, e) => {
      const f = e?.target?.files?.[0]
      comment.replyFile = f || null
    }

    const canSubmitReply = (comment) => {
      const hasText = !!comment.replyText?.trim()
      const hasMedia = !!comment.replyFile || !!comment.replyMediaUrl?.trim()
      if (!hasText && !hasMedia) return false
      if (hasMedia && !comment.replyMediaType) return false
      if (comment.replyFile && comment.replyMediaUrl?.trim()) return false
      return true
    }

    // 顶层评论是否可发送：支持文本或仅媒体（需选择媒体类型，且 URL 与 文件二选一）
    const canSubmitTopComment = (post) => {
      const hasText = !!post.newComment?.trim()
      const hasMedia = !!post.newCommentFile || !!post.newCommentMediaUrl?.trim()
      if (!hasText && !hasMedia) return false
      if (hasMedia && !post.newCommentMediaType) return false
      if (post.newCommentFile && post.newCommentMediaUrl?.trim()) return false
      return true
    }

    const submitReply = async (post, parentComment) => {
      if (!canSubmitReply(parentComment)) return
      try {
        const payload = {
          content: parentComment.replyText?.trim() || undefined,
          parent_comment_id: parentComment.id
        }
        if (parentComment.replyMediaUrl?.trim()) {
          payload.media_url = parentComment.replyMediaUrl.trim()
          payload.media_type = parentComment.replyMediaType
        } else if (parentComment.replyFile) {
          payload.file = parentComment.replyFile
          payload.media_type = parentComment.replyMediaType
        }
  const resp = await remoteApiService.forum.addComment(post.id, payload)
        const data = mapComment(pickData(resp))
        parentComment.replies = parentComment.replies || []
        parentComment.replies.push(data)
        parentComment.replying = false
        post.commentsCount = (post.commentsCount || 0) + 1
        ElMessage.success('回复已发布！')
      } catch (e) {
        ElMessage.error(e.message || '回复失败')
      }
    }

    const toggleLikeComment = async (post, comment) => {
      const prev = comment.isLiked
      try {
        comment.isLiked = !comment.isLiked
        comment.likesCount += comment.isLiked ? 1 : -1
        if (comment.isLiked) {
          await remoteApiService.forum.likeComment(comment.id)
        } else {
          await remoteApiService.forum.unlikeComment(comment.id)
        }
      } catch (e) {
        comment.isLiked = prev
        comment.likesCount += prev ? 1 : -1
        ElMessage.error(e.message || '操作失败')
      }
    }

    const editComment = (comment) => {
      comment.isEditing = true
      comment.editContent = comment.content
    }

    const cancelEditComment = (comment) => {
      comment.isEditing = false
      comment.editContent = comment.content
    }

    const saveEditComment = async (comment) => {
      const text = (comment.editContent || '').trim()
      if (!text) return
      try {
  await remoteApiService.forum.updateComment(comment.id, { content: text })
        comment.content = text
        comment.isEditing = false
        ElMessage.success('已更新评论')
      } catch (e) {
        ElMessage.error(e.message || '更新失败')
      }
    }

    const deleteComment = async (post, comment) => {
      try {
  await remoteApiService.forum.deleteComment(comment.id)
        post.comments = post.comments.filter(c => c.id !== comment.id)
        post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1)
        ElMessage.success('已删除评论')
      } catch (e) {
        ElMessage.error(e.message || '删除失败')
      }
    }

    const savePost = async (post) => {
      const text = (post.editContent || '').trim()
      if (!text) return
      try {
        const payload = { 
          content: text,
          tags: post.editTopic || undefined
        }
  await remoteApiService.forum.updateTopic(post.id, payload)
        post.content = text
        
        // 更新话题标签
        const oldTopic = post.topic
        const newTopic = post.editTopic || null
        post.topic = newTopic
        
        // 如果当前选择了特定话题，并且修改后的动态不再属于该话题，则从列表中移除
        if (selectedTopic.value && newTopic !== selectedTopic.value.name) {
          posts.value = posts.value.filter(p => p.id !== post.id)
        }
        
        post.isEditing = false
        ElMessage.success('已更新动态')
        
        // 如果话题发生变化，可能需要刷新话题列表
        if (oldTopic !== newTopic) {
          console.log('话题已更新:', oldTopic, '->', newTopic)
        }
      } catch (e) {
        ElMessage.error(e.message || '更新失败')
      }
    }

    const startEdit = (post) => {
      post.editContent = post.content
      post.editTopic = post.topic || ''
      post.isEditing = true
    }

    const cancelEdit = (post) => {
      post.editContent = post.content
      post.editTopic = post.topic || ''
      post.isEditing = false
    }

    const deletePost = async (post) => {
      try {
  await remoteApiService.forum.deleteTopic(post.id)
        posts.value = posts.value.filter(p => p.id !== post.id)
        ElMessage.success('已删除动态')
      } catch (e) {
        ElMessage.error(e.message || '删除失败')
      }
    }

    const followStateByUserId = ref({})
    // 初始化：从本地存储同步关注状态（轻量缓存，非权威）
    try {
      const raw = localStorage.getItem('follow_state')
      if (raw) followStateByUserId.value = JSON.parse(raw)
    } catch {}
    const updateFollowStateForUser = (userId, followed) => {
      followStateByUserId.value = { ...followStateByUserId.value, [userId]: followed }
      posts.value = posts.value.map(p => p.ownerId === userId ? { ...p, isFollowed: followed } : p)
      try { localStorage.setItem('follow_state', JSON.stringify(followStateByUserId.value)) } catch {}
    }

    const toggleFollow = async (post) => {
      const userId = post.ownerId
      if (!userId) return
      
      // 触发波纹效果
      post.followRipple = true
      setTimeout(() => {
        post.followRipple = false
      }, 600)
      
      const prev = !!followStateByUserId.value[userId]
      try {
        updateFollowStateForUser(userId, !prev)
        if (!prev) {
          await remoteApiService.forum.followUser(userId)
          ElMessage.success('已关注')
        } else {
          await remoteApiService.forum.unfollowUser(userId)
          ElMessage.success('已取消关注')
        }
      } catch (e) {
        updateFollowStateForUser(userId, prev)
        ElMessage.error(e.message || '操作失败')
      }
    }

    const loadMorePosts = async () => {
      if (!hasMore.value) return
      await loadTopics(false)
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
      return timestamp.toLocaleDateString()
    }

  // 智能搜索输入与推荐弹窗方法已移除

    const onDocClick = (e) => {
      // 任何文档点击都关闭话题选择浮层
      if (showTopicPicker.value) showTopicPicker.value = false
    }

    onMounted(async () => {
      await loadTopics(true)
      nextTick(() => setupInfiniteObserver())
      document.addEventListener('click', onDocClick)
    })

    onUnmounted(() => {
      if (observer) observer.disconnect()
      document.removeEventListener('click', onDocClick)
    })

    return {
      // 社区动态
      onlineUsers,
      selectedTopic,
      selectedPostTopic,
  showTopicPicker,
  visibility,
      newPost,
      newPostFile,
      newPostMediaUrl,
      newPostMediaType,
      showMediaInputs,
      hasMore,
      isLoading,
      hotTopics,
      posts,
      filteredPosts,
  showComposer,
  openComposer,
  onComposerClosed,
      selectTopic,
      publishPost,
      onNewPostFileChange,
      toggleMediaInputs,
      clearSelectedFile,
      getFileAccept,
      getMediaTypeName,
      getFileIcon,
  getObjectUrl,
      canPublishPost,
      toggleLike,
      toggleComments,
      addComment,
  canSubmitTopComment,
  toggleReply,
  onReplyFileChange,
  canSubmitReply,
  submitReply,
      toggleLikeComment,
      editComment,
      cancelEditComment,
      saveEditComment,
      deleteComment,
      savePost,
      startEdit,
      cancelEdit,
      deletePost,
      toggleFollow,
  currentUser,
      loadMorePosts,
      formatTime
    }
  }
}
</script>

<style scoped>
/* 智能搜索/推荐模块样式已移除 */

/* 顶部分隔线已移除 */

/* 社区动态区域样式 */
.simple-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.online-count {
  margin-left: auto;
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 社区动态样式 */
.post-composer {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.composer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.composer-username {
  font-weight: 600;
  color: #495057;
}

.composer-input {
  width: 100%;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
  margin-bottom: 12px;
}

/* 工具栏 */
.composer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 6px;
}
.toolbar-left { display: flex; gap: 8px; align-items: center; }
.toolbar-right { display: flex; gap: 8px; align-items: center; }

.action-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: #475569;
}
.action-item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
.action-icon { font-size: 16px; }
.action-label { font-size: 12px; color: #64748b; }

.schedule-btn { border: none; background: transparent; cursor: pointer; font-size: 16px; }
.visibility-select {
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 12px;
}

.topic-item { position: relative; }
.topic-popover {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 160px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  padding: 6px;
  z-index: 10;
}
.topic-option {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
}
.topic-option:hover { background: #f8fafc; }
.topic-option.active { background: var(--primary-light); color: var(--primary-color); }

/* 媒体上传区域美化样式 */
.composer-media-row {
  margin: 16px 0;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border: 2px dashed #e0e7ff;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.composer-media-row:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.media-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.media-title {
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
  display: flex;
  align-items: center;
  gap: 8px;
}

.media-toggle-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.media-toggle-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.media-fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.media-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.media-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  font-size: 14px;
}

.media-type-select, .media-url-input {
  height: 40px;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.media-type-select:focus, .media-url-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.media-url-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.file-upload-area {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.file-upload-area:hover {
  border-color: #667eea;
  background: #fafaff;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-input:disabled {
  cursor: not-allowed;
}

.file-upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 13px;
}

.upload-icon {
  font-size: 20px;
  opacity: 0.7;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  padding: 8px 12px;
  color: #065f46;
}

.file-icon {
  font-size: 16px;
}

.file-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-file-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: #fca5a5;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #7f1d1d;
  transition: all 0.2s ease;
}

.clear-file-btn:hover {
  background: #f87171;
}

.media-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* 发布区媒体预览 */
.composer-media-preview {
  margin: 12px 0 4px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}

.preview-image {
  max-width: 100%;
  max-height: 280px;
  display: block;
  border-radius: 8px;
  object-fit: contain;
}

.preview-video {
  width: 100%;
  max-height: 320px;
  border-radius: 8px;
  background: #000;
}

.preview-audio { width: 100%; }

.preview-file {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #475569;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.status-item.active {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.status-divider {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.media-quick-actions {
  margin: 12px 0;
  text-align: center;
}

.quick-media-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.quick-media-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 14px;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .composer-media-row {
    margin: 12px 0;
    padding: 16px;
  }
  
  .media-fields-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .media-status {
    flex-direction: column;
    gap: 8px;
  }
  
  .quick-media-btn {
    padding: 8px 12px;
    font-size: 12px;
  }
}

.composer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topic-select {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 12px;
  background: white;
}

.composer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  font-size: 12px;
  color: #6c757d;
}

.publish-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.publish-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.publish-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.topic-filter-card { margin-bottom: 20px; }

/* 旧的标签筛选样式已移除 */

/* 移动端：横向滚动展示话题标签 */
@media (max-width: 768px) {
  .topic-filter {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    gap: 10px;
    padding-bottom: 2px;
  }
  .filter-tag {
    flex: 0 0 auto;
    white-space: nowrap;
  }
  .topic-filter::-webkit-scrollbar {
    height: 6px;
  }
  .topic-filter::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
  }
  .topic-filter::-webkit-scrollbar-track {
    background: transparent;
  }
}

.feed-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  color: #888;
  line-height: 1.5;
}

/* 悬浮发布按钮 */
.fab-compose {
  position: fixed;
  right: 24px;
  bottom: 120px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: #fff;
  box-shadow: var(--shadow-medium);
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.fab-compose:hover { filter: brightness(1.05); box-shadow: var(--shadow-heavy); }
.compose-dialog-body { padding-top: 4px; }

/* 移动端：避开底部导航栏与安全区 */
@media (max-width: 768px) {
  .fab-compose {
    right: 16px;
    bottom: calc(16px + var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px));
    width: 52px;
    height: 52px;
    font-size: 20px;
  }
}

.feed-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.post-time {
  font-size: 12px;
  color: #6c757d;
}

.topic-badge {
  background: #e3f2fd;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.post-content {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 14px;
}

/* 编辑表单样式 */
.edit-form {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  position: relative;
  animation: editFormSlideIn 0.3s ease-out;
}

@keyframes editFormSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.edit-form-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.edit-icon {
  font-size: 16px;
}

.edit-title {
  font-weight: 600;
  color: #495057;
  font-size: 16px;
}

.edit-content,
.edit-topic {
  margin-bottom: 16px;
}

.edit-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.char-counter {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.edit-label {
  display: block;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.edit-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #495057;
  background: white;
  resize: vertical;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.edit-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.edit-textarea::placeholder {
  color: #6c757d;
}

.topic-select-wrapper {
  position: relative;
}

.edit-topic-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  background: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.edit-topic-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.edit-cancel-btn {
  padding: 8px 20px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.edit-cancel-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.edit-save-btn {
  padding: 8px 20px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.edit-save-btn:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.25);
}

.edit-save-btn:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.post-image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f4;
}

.post-actions .action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6c757d;
  transition: color 0.2s ease;
}

.post-actions .action-btn:hover {
  color: #495057;
}

.post-actions .action-btn.liked {
  color: #e74c3c;
}

.post-actions-right .action-btn {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  margin-left: 8px;
}

.post-actions-right .action-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.post-actions-right .action-btn.delete-btn {
  color: #dc3545;
  border-color: #dc3545;
}

.post-actions-right .action-btn.delete-btn:hover {
  background: #dc3545;
  color: white;
}

/* 关注按钮样式 */
.follow-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid transparent;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  text-decoration: none;
  user-select: none;
}

.follow-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.follow-btn:hover::before {
  left: 100%;
}

.follow-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.4s, height 0.4s, margin-left 0.4s, margin-top 0.4s;
  transform: translate(-50%, -50%);
}

.follow-btn:active::after {
  width: 200px;
  height: 200px;
}

.follow-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4c96 100%);
}

.follow-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.follow-btn.followed {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  animation: followSuccess 0.6s ease;
}

@keyframes followSuccess {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  }
}

.follow-btn.followed:hover {
  background: linear-gradient(135deg, #218838 0%, #1abc9c 100%);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
  transform: translateY(-3px) scale(1.05);
}

.follow-icon {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.follow-btn:hover .follow-icon {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.2) rotate(180deg);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.follow-btn.followed .follow-icon {
  background: rgba(255, 255, 255, 0.3);
  animation: checkmarkAnimation 0.8s ease;
}

@keyframes checkmarkAnimation {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.4) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.follow-btn.followed:hover .follow-icon {
  transform: scale(1.2);
  box-shadow: 0 2px 12px rgba(255, 255, 255, 0.4);
}

.follow-text {
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.follow-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rippleEffect 0.6s ease-out;
  pointer-events: none;
}
.post-video video {
  width: 100%;
  max-height: 480px;
  border-radius: 10px;
  background: #000;
}

.post-audio audio {
  width: 100%;
  outline: none;
}

@keyframes rippleEffect {
  0% {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 0;
  }
}

.action-icon {
  font-size: 16px;
}

.comments-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

.comment-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.comment-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  color: #495057;
  background: white;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.comment-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.comment-input::placeholder {
  color: #6c757d;
}

.comment-submit-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
}

.comment-submit-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 评论编辑按钮样式 */
.comment-edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.comment-save-btn,
.comment-cancel-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-icon {
  font-size: 10px;
}

.comment-save-btn {
  background: #28a745;
  color: white;
  border: 1px solid #28a745;
}

.comment-save-btn:hover:not(:disabled) {
  background: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.comment-save-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  border-color: #e9ecef;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.comment-cancel-btn {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.comment-cancel-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: #fafbfc;
  border: 1px solid #f1f3f4;
  transition: all 0.2s ease;
  animation: commentSlideIn 0.3s ease-out;
}

.comment-item:hover {
  background: #f8f9fa;
  border-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes commentSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comment-avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-username {
  font-weight: 600;
  font-size: 12px;
  color: #667eea;
}

.comment-time {
  font-size: 10px;
  color: #6c757d;
}

.comment-text {
  font-size: 12px;
  color: #495057;
  line-height: 1.4;
  margin-bottom: 8px;
}

/* 评论操作按钮样式 */
.comment-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  padding-top: 6px;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 11px;
  color: #6c757d;
  position: relative;
}

.comment-action-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.comment-action-icon {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.comment-action-text {
  font-weight: 500;
  font-size: 11px;
}

/* 点赞按钮特殊样式 */
.comment-like-btn.liked {
  color: #e74c3c;
}

.comment-like-btn.liked:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* 编辑按钮样式 */
.comment-edit-btn:hover {
  background: #e1f5fe;
  color: #0277bd;
}

/* 删除按钮样式 */
.comment-delete-btn:hover {
  background: #ffebee;
  color: #d32f2f;
}

.comment-delete-btn .comment-action-text {
  color: #dc3545;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more-btn {
  padding: 12px 24px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #e9ecef;
}
</style>
