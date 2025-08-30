<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">随手记录</h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M21,12V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H12"/>
            </svg>
          </div>
          <div class="decoration-line"></div>
        </div>
        <p class="page-subtitle">记录灵感瞬间，捕捉思维火花</p>
      </div>
    </div>

    <div class="quick-add">
      <div class="add-card">
        <h3>快速记录</h3>
        <textarea 
          v-model="newNote" 
          placeholder="记录你的想法、灵感或待办事项..."
          class="quick-input"
          @keydown.ctrl.enter="addQuickNote"
          :disabled="loading"
        ></textarea>
        
        <!-- 标签输入 -->
        <div class="tags-input-section">
          <label for="tags-input">标签（可选）：</label>
          <input 
            id="tags-input"
            v-model="newNoteTags" 
            placeholder="用空格或逗号分隔多个标签，如：学习 编程 Vue3"
            class="tags-input"
            :disabled="loading"
          >
        </div>
        
        <div class="add-actions">
          <div class="mood-selector">
            <button 
              v-for="mood in moods" 
              :key="mood.value"
              class="mood-btn"
              :class="{ active: selectedMood === mood.value }"
              @click="selectedMood = mood.value"
              :title="mood.label"
              :disabled="loading"
            >
              {{ mood.emoji }}
            </button>
          </div>
          <button class="add-btn" @click="addQuickNote" :disabled="!newNote.trim() || loading">
            {{ loading ? '添加中...' : '添加记录' }}
          </button>
        </div>
        
        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>

    <div class="controls">
      <div class="search-filter">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          <input 
            type="text" 
            placeholder="搜索记录..." 
            v-model="searchQuery"
            @input="onSearchChange"
          >
        </div>
        
        <select v-model="filterMood" class="mood-filter" @change="onFilterChange">
          <option value="">所有心情</option>
          <option v-for="mood in moods" :key="mood.value" :value="mood.value">
            {{ mood.emoji }} {{ mood.label }}
          </option>
        </select>
      </div>

      <div class="view-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="网格视图"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/>
          </svg>
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
          title="列表视图"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="notes-container" :class="viewMode">
      <!-- 加载状态 -->
      <div v-if="loading && notes.length === 0" class="loading-message">
        正在加载记录...
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!loading && notes.length === 0" class="empty-message">
        <div class="empty-icon">📝</div>
        <p>还没有任何记录</p>
        <p class="empty-hint">快来记录你的想法和灵感吧！</p>
      </div>
      
      <!-- 记录列表 -->
      <div v-else class="note-item" v-for="note in filteredNotes" :key="note.id">
        <div class="note-header">
          <div class="note-info">
            <span class="note-mood">{{ getMoodEmoji(note.mood) }}</span>
            <span class="note-time">{{ formatTime(note.created_at || note.time) }}</span>
          </div>
          <div class="note-actions">
            <CollectButton
              content-type="daily_record"
              :content-id="note.id"
              :initial-collected="note.isInCollection"
              @collected="onNoteCollected"
              @message="showMessage"
            />
            <button class="action-btn" @click="editNote(note)" title="编辑" :disabled="loading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25Z"/>
              </svg>
            </button>
            <button class="action-btn" @click="deleteNote(note.id)" title="删除" :disabled="loading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="note-content" @click="viewNote(note)">
          {{ note.content }}
        </div>
        
        <div class="note-footer" v-if="note.tags">
          <div class="note-tags">
            <template v-if="typeof note.tags === 'string' && note.tags">
              <span class="tag" v-for="tag in note.tags.split(',').map(t => t.trim()).filter(t => t)" :key="tag">#{{ tag }}</span>
            </template>
            <template v-else-if="Array.isArray(note.tags) && note.tags.length > 0">
              <span class="tag" v-for="tag in note.tags" :key="tag">#{{ tag }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框：使用 BaseModal -->
    <BaseModal :show="editingNote" title="编辑记录" @close="closeEdit">
      <div>
        <textarea 
          v-model="editContent" 
          class="form-textarea"
          placeholder="编辑你的记录..."
        ></textarea>
        <div class="edit-mood" style="margin-top: 12px">
          <label>心情：</label>
          <div class="mood-options">
            <button 
              v-for="mood in moods" 
              :key="mood.value"
              class="mood-btn"
              :class="{ active: editMood === mood.value }"
              @click="editMood = mood.value"
            >
              {{ mood.emoji }}
            </button>
          </div>
        </div>
        <div class="edit-tags" style="margin-top: 12px">
          <label>标签：</label>
          <input 
            v-model="editTagsInput" 
            placeholder="用空格分隔多个标签"
            class="form-input"
          >
        </div>
      </div>
      <template #footer>
        <div class="d-flex" style="gap: 8px; justify-content: flex-end; width: 100%">
          <BaseButton variant="secondary" type="button" @click="closeEdit">取消</BaseButton>
          <BaseButton variant="primary" type="button" @click="saveEdit">保存</BaseButton>
        </div>
      </template>
    </BaseModal>

    <div class="stats-info">
      <div class="stats-card">
        <div class="stat-number">{{ notes.length }}</div>
        <div class="stat-label">总记录数</div>
      </div>
      <div class="stats-card">
        <div class="stat-number">{{ todayNotes }}</div>
        <div class="stat-label">今日新增</div>
      </div>
      <div class="stats-card">
        <div class="stat-number">{{ weekNotes }}</div>
        <div class="stat-label">本周记录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import remoteApiService from '@/services/remoteApi.js'
import CollectButton from '@/components/CollectButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'QuickNotes',
  components: { CollectButton, BaseModal, BaseButton },
  setup() {
    const router = useRouter()
    const newNote = ref('')
    const newNoteTags = ref('')
    const selectedMood = ref('neutral')
    const searchQuery = ref('')
    const filterMood = ref('')
    const viewMode = ref('grid')
    const editingNote = ref(null)
    const editContent = ref('')
    const editMood = ref('neutral')
    const editTagsInput = ref('')
    const loading = ref(false)
    const error = ref('')

  // 远程 API 直接返回数据或抛错，这里统一封装一个轻量解析器
  const ok = (v) => ({ success: true, data: v, message: '' })
  const fail = (e) => ({ success: false, data: null, message: e?.message || '请求失败' })
    
    const moods = ref([
      { value: 'happy', emoji: '😊', label: '开心' },
      { value: 'excited', emoji: '🎉', label: '兴奋' },
      { value: 'neutral', emoji: '😐', label: '平静' },
      { value: 'thinking', emoji: '🤔', label: '思考' },
      { value: 'tired', emoji: '😴', label: '疲惫' },
      { value: 'sad', emoji: '😔', label: '难过' }
    ])
    
    const notes = ref([])

    // 加载所有记录
  const loadNotes = async () => {
      loading.value = true
      error.value = ''
      try {
        // 仅将心情作为后端筛选参数；文本搜索在前端完成
  const resp = await remoteApiService.dailyRecords.getAllRecords(filterMood.value || null, null)
  const { success, data, message } = ok(resp)
        if (success) {
          notes.value = Array.isArray(data) ? data : (data ? [data] : [])
        } else {
          error.value = message || '加载记录失败'
        }
      } catch (err) {
        error.value = '网络错误，请稍后重试'
        console.error('加载记录失败:', err)
      } finally {
        loading.value = false
      }
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadNotes()
    })

    const filteredNotes = computed(() => {
      let filtered = notes.value

      if (searchQuery.value) {
        filtered = filtered.filter(note => {
          const searchTerm = searchQuery.value.toLowerCase()
          const content = note.content ? note.content.toLowerCase() : ''
          const combined = note.combined_text ? String(note.combined_text).toLowerCase() : ''
          const tagsString = note.tags ? (Array.isArray(note.tags) ? note.tags.join(',') : String(note.tags)).toLowerCase() : ''
          return content.includes(searchTerm) || tagsString.includes(searchTerm) || combined.includes(searchTerm)
        })
      }

      if (filterMood.value) {
        filtered = filtered.filter(note => note.mood === filterMood.value)
      }

      return filtered.sort((a, b) => new Date(b.created_at || b.time) - new Date(a.created_at || a.time))
    })

    const todayNotes = computed(() => {
      const today = new Date().toDateString()
      return notes.value.filter(note => {
        const noteDate = new Date(note.created_at || note.time).toDateString()
        return noteDate === today
      }).length
    })

    const weekNotes = computed(() => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return notes.value.filter(note => {
        const noteDate = new Date(note.created_at || note.time)
        return noteDate >= weekAgo
      }).length
    })

    const getMoodEmoji = (mood) => {
      const moodObj = moods.value.find(m => m.value === mood)
      return moodObj ? moodObj.emoji : '😐'
    }

    const formatTime = (timeString) => {
      if (!timeString) return ''
      
      const date = new Date(timeString)
      const now = new Date()
      const diffMs = now - date
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // 今天 - 显示时间
        return date.toLocaleString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } else if (diffDays === 1) {
        // 昨天
        return '昨天'
      } else if (diffDays < 7) {
        // 一周内
        return `${diffDays}天前`
      } else {
        // 一周以上 - 显示日期
        return date.toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit'
        })
      }
    }

    const addQuickNote = async () => {
      if (!newNote.value.trim()) return
      
      loading.value = true
      error.value = ''
      
      try {
        const recordData = {
          content: newNote.value,
          mood: selectedMood.value || null,
          tags: newNoteTags.value.trim() ? 
                newNoteTags.value.replace(/[,，\s]+/g, ',').replace(/^,|,$/g, '') : 
                null
        }
        
  const apiResp = await remoteApiService.dailyRecords.createRecord(recordData)
  const { success, data: created, message } = ok(apiResp)
        if (success) {
          // 优先使用后端返回的记录插入到顶部；否则回退为刷新列表
          if (created && created.id) {
            // 防止筛选影响可见性：清空搜索并保留当前心情筛选
            searchQuery.value = ''
            // 插入到顶部，避免等待重新请求
            notes.value = [created, ...notes.value]
          } else {
            await loadNotes()
          }
          newNote.value = ''
          newNoteTags.value = ''
          selectedMood.value = 'neutral'
        } else {
          error.value = message || '创建记录失败'
        }
      } catch (err) {
        error.value = '网络错误，请稍后重试'
        console.error('创建记录失败:', err)
      } finally {
        loading.value = false
      }
    }

    const editNote = (note) => {
      editingNote.value = note
      editContent.value = note.content
      editMood.value = note.mood || 'neutral'
      // 处理标签，如果是逗号分隔的字符串就转换为空格分隔
      if (note.tags) {
        if (typeof note.tags === 'string') {
          editTagsInput.value = note.tags.split(',').map(tag => tag.trim()).join(' ')
        } else if (Array.isArray(note.tags)) {
          editTagsInput.value = note.tags.join(' ')
        } else {
          editTagsInput.value = ''
        }
      } else {
        editTagsInput.value = ''
      }
    }

    const closeEdit = () => {
      editingNote.value = null
      editContent.value = ''
      editMood.value = 'neutral'
      editTagsInput.value = ''
    }

    const saveEdit = async () => {
      if (!editingNote.value) return
      
      loading.value = true
      error.value = ''
      
      try {
        const updateData = {
          content: editContent.value,
          mood: editMood.value || null,
          tags: editTagsInput.value.trim() ? editTagsInput.value.replace(/\s+/g, ',') : null
        }
        
        try {
          await remoteApiService.dailyRecords.updateRecord(editingNote.value.id, updateData)
          const { success, message } = ok(true)
          if (success) {
            await loadNotes()
            closeEdit()
          } else {
            error.value = message || '更新记录失败'
          }
          return
        } catch (e) {
          const { message } = fail(e)
          error.value = message || '更新记录失败'
        }
      } catch (err) {
        error.value = '网络错误，请稍后重试'
        console.error('更新记录失败:', err)
      } finally {
        loading.value = false
      }
    }

    const deleteNote = async (noteId) => {
      if (!confirm('确定要删除这条记录吗？')) return
      
      loading.value = true
      error.value = ''
      
      try {
        try {
          await remoteApiService.dailyRecords.deleteRecord(noteId)
          await loadNotes()
        } catch (e) {
          error.value = e?.message || '删除记录失败'
        }
      } catch (err) {
        error.value = '网络错误，请稍后重试'
        console.error('删除记录失败:', err)
      } finally {
        loading.value = false
      }
    }

    const onNoteCollected = (data) => {
      console.log('笔记已收藏:', data)
      // 可以在这里更新笔记的收藏状态
      const note = notes.value.find(n => n.id == data.contentId)
      if (note) {
        note.isInCollection = true
      }
    }

    const showMessage = (messageData) => {
      // 这里可以使用全局的消息提示组件
      console.log('消息:', messageData)
      // 简单的提示实现
      if (messageData.type === 'success') {
        alert(messageData.text)
      } else if (messageData.type === 'error') {
        alert('错误: ' + messageData.text)
      }
    }

    const viewNote = (note) => {
      // 在网格视图中可以展开查看完整内容
      console.log('查看记录:', note)
    }

    // 筛选变化时重新加载数据（仅在心情筛选变化时）
    const onFilterChange = () => {
      // 心情筛选变化时，重新请求数据；清空时也重载
      loadNotes()
    }

    // 监听搜索输入变化，防抖处理
    let searchTimeout = null
    const onSearchChange = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        // 如果有搜索关键词，可以考虑发送到后端进行更精确搜索
        // 这里我们先使用前端筛选
      }, 300)
    }

    return {
      newNote,
      newNoteTags,
      selectedMood,
      searchQuery,
      filterMood,
      viewMode,
      editingNote,
      editContent,
      editMood,
      editTagsInput,
      loading,
      error,
      moods,
      notes,
      filteredNotes,
      todayNotes,
      weekNotes,
      getMoodEmoji,
      formatTime,
      addQuickNote,
      editNote,
      closeEdit,
      saveEdit,
      deleteNote,
      onNoteCollected,
      showMessage,
      viewNote,
      loadNotes,
      onFilterChange,
      onSearchChange
    }
  }
}
</script>

<style scoped>
.page {
  /* 给底部预留空间，避免被底部导航遮挡 */
  padding: 24px 24px calc(24px + var(--bottom-nav-height, 96px)) 24px;
  background: #f8f9fa;
  min-height: calc(100vh - 48px);
}

.header {
  text-align: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  margin: -24px -24px 24px -24px;
}

.title-section {
  max-width: 500px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.decoration-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
}

.decoration-icon {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  padding: 6px;
  backdrop-filter: blur(10px);
}

.page-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 300;
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

.quick-add {
  margin-bottom: 24px;
}

.add-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
}

.add-card h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.quick-input {
  width: 100%;
  min-height: 100px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 16px;
}

.quick-input:focus {
  outline: none;
  border-color: #a8edea;
}

.tags-input-section {
  margin-bottom: 16px;
}

.tags-input-section label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}

.tags-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.tags-input:focus {
  outline: none;
  border-color: #a8edea;
}

.tags-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.add-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 0.9rem;
  border-left: 4px solid #c62828;
}

.loading-message, .empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-message {
  background: #f8f9fa;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-top: 8px;
}

.mood-selector {
  display: flex;
  gap: 8px;
}

.mood-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
}

.mood-btn.active {
  border-color: #a8edea;
  background: #f0fff4;
}

.mood-btn:hover {
  border-color: #a8edea;
}

.add-btn {
  background: #a8edea;
  color: #2c3e50;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  background: #98e6e0;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.search-filter {
  display: flex;
  gap: 12px;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
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
  border-color: #a8edea;
}

.mood-filter {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.mood-filter:focus {
  outline: none;
  border-color: #a8edea;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 8px;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: #a8edea;
  color: #2c3e50;
}

.notes-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.notes-container.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.note-item:hover {
  border-color: #a8edea;
  box-shadow: 0 2px 8px rgba(168, 237, 234, 0.2);
}

.notes-container.list .note-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 16px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.notes-container.list .note-header {
  margin-bottom: 0;
  flex-shrink: 0;
}

.note-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.note-mood {
  font-size: 16px;
}

.note-time {
  color: #6c757d;
  font-size: 12px;
}

.note-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.note-item:hover .note-actions {
  opacity: 1;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.note-content {
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 12px;
  flex: 1;
}

.notes-container.grid .note-content {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notes-container.list .note-content {
  margin-bottom: 0;
}

.note-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 8px;
}

.notes-container.list .note-footer {
  border-top: none;
  padding-top: 0;
  flex-shrink: 0;
}

.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #f0fff4;
  color: #a8edea;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

/* Edit form styling for modal content - kept for form layout */
.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.edit-input {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 16px;
}

.edit-input:focus {
  outline: none;
  border-color: #a8edea;
}

.edit-mood,
.edit-tags {
  margin-bottom: 16px;
}

.edit-mood label,
.edit-tags label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

.mood-options {
  display: flex;
  gap: 8px;
}

.tags-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
}

.tags-input:focus {
  outline: none;
  border-color: #a8edea;
}

.stats-info {
  position: fixed;
  /* 永远位于底部导航之上：默认导航 96px 高度，可用 CSS 变量覆盖 */
  bottom: calc(24px + var(--bottom-nav-height, 96px));
  right: 24px;
  display: flex;
  gap: 12px;
  z-index: 9999;
}

.stats-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
  min-width: 80px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #a8edea;
  margin-bottom: 2px;
}

.stat-label {
  color: #6c757d;
  font-size: 11px;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .header {
    margin: -16px -16px 16px -16px;
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .decoration-line {
    width: 40px;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-filter {
    flex-direction: column;
  }

  .notes-container.grid {
    grid-template-columns: 1fr;
  }

  .notes-container.list .note-item {
    flex-direction: column;
    gap: 8px;
  }

  .stats-info {
    position: static;
    margin-top: 24px;
    justify-content: center;
  }
}
</style>
