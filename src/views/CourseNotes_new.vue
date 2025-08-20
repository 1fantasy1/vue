<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">课程笔记</h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <div class="decoration-line"></div>
        </div>
        <p class="page-subtitle">记录学习历程，沉淀知识精华</p>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
        </svg>
        <input type="text" placeholder="搜索笔记..." v-model="searchQuery" @input="handleSearch">
      </div>

      <div class="filter-controls">
        <select v-model="selectedCourse" class="course-filter" @change="loadNotes">
          <option value="">所有课程</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</option>
        </select>
        
        <select v-model="selectedFolder" class="folder-filter" @change="loadNotes">
          <option value="">所有文件夹</option>
          <option value="0">未分类</option>
          <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
        </select>
        
        <select v-model="selectedNoteType" class="type-filter" @change="loadNotes">
          <option value="">所有类型</option>
          <option value="general">普通笔记</option>
          <option value="summary">总结笔记</option>
          <option value="reflection">反思笔记</option>
          <option value="question">疑问笔记</option>
          <option value="idea">想法笔记</option>
        </select>
        
        <select v-model="sortBy" class="sort-filter" @change="applySorting">
          <option value="date">按时间排序</option>
          <option value="course">按课程排序</option>
          <option value="title">按标题排序</option>
        </select>
      </div>

      <button class="add-btn" @click="createNote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        新建笔记
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="notes.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
      <h3>暂无笔记</h3>
      <p>开始创建您的第一条笔记吧！</p>
      <button class="btn btn-primary" @click="createNote">创建笔记</button>
    </div>

    <!-- 笔记列表 -->
    <div v-else class="notes-layout">
      <div class="notes-grid">
        <div class="note-card" v-for="note in displayedNotes" :key="note.id" @click="openNote(note)">
          <div class="note-header">
            <h3 class="note-title">{{ note.title || '无标题' }}</h3>
            <div class="note-actions" @click.stop>
              <CollectButton
                content-type="note"
                :content-id="note.id"
                :initial-collected="note.isInCollection"
                @collected="onNoteCollected"
                @message="showMessage"
              />
              <button class="action-btn" @click="editNote(note)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25Z"/>
                </svg>
              </button>
              <button class="action-btn delete-btn" @click="deleteNote(note.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="note-meta">
            <span class="note-course" v-if="note.course_title">{{ note.course_title }}</span>
            <span class="note-folder" v-else-if="note.folder_name">📁 {{ note.folder_name }}</span>
            <span class="note-type">{{ getNoteTypeLabel(note.note_type) }}</span>
            <span class="note-date">{{ formatDate(note.created_at) }}</span>
          </div>

          <div class="note-chapter" v-if="note.chapter">
            <span class="chapter-tag">📖 {{ note.chapter }}</span>
          </div>

          <div class="note-content">
            {{ getPreviewContent(note) }}
          </div>

          <!-- 媒体预览 -->
          <div class="note-media" v-if="note.media_url && note.media_type === 'image'">
            <img :src="note.media_url" :alt="note.original_filename" class="media-preview">
          </div>

          <div class="note-tags" v-if="note.tags">
            <span class="tag" v-for="tag in getTagsArray(note.tags)" :key="tag">{{ tag }}</span>
          </div>

          <div class="note-footer">
            <div class="note-stats">
              <span class="stat-item" v-if="note.content">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                {{ getWordCount(note.content) }}字
              </span>
              <span class="stat-item" v-if="note.media_url">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                {{ note.media_type === 'image' ? '图片' : note.media_type === 'video' ? '视频' : '文件' }}
              </span>
              <span class="stat-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                </svg>
                {{ formatRelativeTime(note.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记详情模态框 -->
    <div class="modal-overlay" v-if="selectedNote" @click="closeNote">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedNote.title || '无标题' }}</h2>
          <button class="close-btn" @click="closeNote">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-meta">
          <span class="course" v-if="selectedNote.course_title">{{ selectedNote.course_title }}</span>
          <span class="folder" v-else-if="selectedNote.folder_name">📁 {{ selectedNote.folder_name }}</span>
          <span class="type">{{ getNoteTypeLabel(selectedNote.note_type) }}</span>
          <span class="date">{{ formatDate(selectedNote.created_at) }}</span>
        </div>
        <div class="modal-body">
          <div class="note-full-content" v-if="selectedNote.content">
            {{ selectedNote.content }}
          </div>
          <div class="note-media" v-if="selectedNote.media_url">
            <img v-if="selectedNote.media_type === 'image'" 
                 :src="selectedNote.media_url" 
                 :alt="selectedNote.original_filename" 
                 class="media-full">
            <video v-else-if="selectedNote.media_type === 'video'" 
                   :src="selectedNote.media_url" 
                   controls 
                   class="media-full">
            </video>
            <div v-else class="file-link">
              <a :href="selectedNote.media_url" target="_blank" class="file-download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                {{ selectedNote.original_filename || '下载文件' }}
              </a>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="tags" v-if="selectedNote.tags">
            <span class="tag" v-for="tag in getTagsArray(selectedNote.tags)" :key="tag">{{ tag }}</span>
          </div>
          <div class="actions">
            <button class="btn primary" @click="editNote(selectedNote)">编辑笔记</button>
            <button class="btn" @click="shareNote(selectedNote.id)">分享笔记</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记编辑模态框 -->
    <NoteModal
      :show="showNoteModal"
      :note="editingNote"
      :courses="courses"
      :folders="folders"
      @close="closeNoteModal"
      @success="onNoteSaved"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, nextTick } from 'vue'
import CollectButton from '@/components/CollectButton.vue'
import NoteModal from '@/components/NoteModal.vue'
import apiService from '@/services/api.js'

export default {
  name: 'CourseNotes',
  components: { 
    CollectButton,
    NoteModal
  },
  setup() {
    const router = useRouter()
    
    // 状态管理
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedCourse = ref('')
    const selectedFolder = ref('')
    const selectedNoteType = ref('')
    const sortBy = ref('date')
    const selectedNote = ref(null)
    const showNoteModal = ref(false)
    const editingNote = ref(null)
    
    // 数据
    const notes = ref([])
    const courses = ref([])
    const folders = ref([])
    const displayedNotes = ref([])
    
    // 笔记类型标签映射
    const noteTypeLabels = {
      general: '普通笔记',
      summary: '总结笔记',
      reflection: '反思笔记',
      question: '疑问笔记',
      idea: '想法笔记'
    }

    // 获取笔记列表
    const loadNotes = async () => {
      loading.value = true
      try {
        const params = {}
        
        // 添加过滤条件
        if (selectedNoteType.value) params.note_type = selectedNoteType.value
        if (selectedCourse.value) params.course_id = selectedCourse.value
        if (selectedFolder.value !== '') params.folder_id = selectedFolder.value
        
        const response = await apiService.getNotes(params)
        if (response.data.success) {
          notes.value = response.data.data || []
          applySorting()
        } else {
          console.error('获取笔记失败:', response.data.message)
          notes.value = []
        }
      } catch (error) {
        console.error('获取笔记失败:', error)
        notes.value = []
      } finally {
        loading.value = false
      }
    }

    // 获取课程列表
    const loadCourses = async () => {
      try {
        const response = await apiService.getCourses()
        if (response.data.success) {
          courses.value = response.data.data || []
        }
      } catch (error) {
        console.error('获取课程失败:', error)
        courses.value = []
      }
    }

    // 获取文件夹列表
    const loadFolders = async () => {
      try {
        const response = await apiService.getFolders()
        if (response.data.success) {
          folders.value = response.data.data || []
        }
      } catch (error) {
        console.error('获取文件夹失败:', error)
        folders.value = []
      }
    }

    // 应用排序
    const applySorting = () => {
      let sorted = [...notes.value]
      
      switch (sortBy.value) {
        case 'date':
          sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case 'course':
          sorted.sort((a, b) => (a.course_title || '').localeCompare(b.course_title || ''))
          break
        case 'title':
          sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
          break
      }
      
      displayedNotes.value = sorted
    }

    // 搜索处理
    const handleSearch = () => {
      if (!searchQuery.value.trim()) {
        displayedNotes.value = [...notes.value]
        applySorting()
        return
      }
      
      const query = searchQuery.value.toLowerCase()
      const filtered = notes.value.filter(note => {
        return (note.title && note.title.toLowerCase().includes(query)) ||
               (note.content && note.content.toLowerCase().includes(query)) ||
               (note.tags && note.tags.toLowerCase().includes(query)) ||
               (note.course_title && note.course_title.toLowerCase().includes(query)) ||
               (note.folder_name && note.folder_name.toLowerCase().includes(query))
      })
      
      displayedNotes.value = filtered
      applySorting()
    }

    // 工具函数
    const getNoteTypeLabel = (type) => {
      return noteTypeLabels[type] || '普通笔记'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }

    const formatRelativeTime = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '今天'
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      if (days < 30) return `${Math.floor(days / 7)}周前`
      if (days < 365) return `${Math.floor(days / 30)}月前`
      return `${Math.floor(days / 365)}年前`
    }

    const getPreviewContent = (note) => {
      if (note.content) {
        return note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content
      }
      if (note.media_url) {
        return `[${note.media_type === 'image' ? '图片' : note.media_type === 'video' ? '视频' : '文件'}]`
      }
      return '暂无内容'
    }

    const getTagsArray = (tags) => {
      if (!tags) return []
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    const getWordCount = (content) => {
      if (!content) return 0
      return content.length
    }

    // 笔记操作
    const createNote = () => {
      editingNote.value = null
      showNoteModal.value = true
    }

    const editNote = (note) => {
      editingNote.value = note
      showNoteModal.value = true
    }

    const deleteNote = async (noteId) => {
      if (!confirm('确定要删除这条笔记吗？')) return
      
      try {
        const response = await apiService.deleteNote(noteId)
        if (response.data.success) {
          await loadNotes() // 重新加载列表
          showMessage({ type: 'success', text: '笔记删除成功' })
        } else {
          showMessage({ type: 'error', text: response.data.message || '删除失败' })
        }
      } catch (error) {
        console.error('删除笔记失败:', error)
        showMessage({ type: 'error', text: '删除失败: ' + error.message })
      }
    }

    const openNote = (note) => {
      selectedNote.value = note
    }

    const closeNote = () => {
      selectedNote.value = null
    }

    const closeNoteModal = () => {
      showNoteModal.value = false
      editingNote.value = null
    }

    const onNoteSaved = (note) => {
      showMessage({ type: 'success', text: editingNote.value ? '笔记更新成功' : '笔记创建成功' })
      loadNotes() // 重新加载列表
    }

    const onNoteCollected = (data) => {
      console.log('课程笔记已收藏:', data)
      const note = notes.value.find(n => n.id == data.contentId)
      if (note) {
        note.isInCollection = true
      }
    }

    const showMessage = (messageData) => {
      console.log('消息:', messageData)
      if (messageData.type === 'success') {
        alert(messageData.text)
      } else if (messageData.type === 'error') {
        alert('错误: ' + messageData.text)
      }
    }

    const shareNote = (noteId) => {
      alert(`分享笔记 ${noteId}`)
    }

    // 初始化
    onMounted(async () => {
      await Promise.all([
        loadNotes(),
        loadCourses(),
        loadFolders()
      ])
    })

    return {
      loading,
      searchQuery,
      selectedCourse,
      selectedFolder,
      selectedNoteType,
      sortBy,
      selectedNote,
      showNoteModal,
      editingNote,
      notes,
      courses,
      folders,
      displayedNotes,
      loadNotes,
      applySorting,
      handleSearch,
      getNoteTypeLabel,
      formatDate,
      formatRelativeTime,
      getPreviewContent,
      getTagsArray,
      getWordCount,
      createNote,
      editNote,
      deleteNote,
      openNote,
      closeNote,
      closeNoteModal,
      onNoteSaved,
      onNoteCollected,
      showMessage,
      shareNote
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

.controls-bar {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
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
  border-color: #43e97b;
}

.filter-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.course-filter,
.folder-filter,
.type-filter,
.sort-filter {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

.course-filter:focus,
.folder-filter:focus,
.type-filter:focus,
.sort-filter:focus {
  outline: none;
  border-color: #43e97b;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #43e97b;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-btn:hover {
  background: #3ad66f;
}

/* 加载和空状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #43e97b;
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
  color: #6c757d;
  text-align: center;
}

.empty-state svg {
  color: #dee2e6;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.empty-state p {
  margin: 0 0 20px 0;
}

.btn {
  padding: 10px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  color: #6c757d;
}

.btn-primary {
  background: #43e97b;
  border-color: #43e97b;
  color: white;
}

.btn:hover {
  border-color: #43e97b;
  color: #43e97b;
}

.btn-primary:hover {
  background: #3ad66f;
}

/* 笔记网格 */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.note-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 250px;
}

.note-card:hover {
  border-color: #43e97b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.1);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.note-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.note-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.note-card:hover .note-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
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

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.note-course {
  color: #43e97b;
  font-weight: 500;
  background: #f0fff4;
  padding: 4px 8px;
  border-radius: 12px;
}

.note-folder {
  color: #667eea;
  font-weight: 500;
  background: #f8f9ff;
  padding: 4px 8px;
  border-radius: 12px;
}

.note-type {
  color: #764ba2;
  background: #f5f3ff;
  padding: 4px 8px;
  border-radius: 12px;
}

.note-date {
  color: #6c757d;
}

.note-chapter {
  margin-bottom: 12px;
}

.chapter-tag {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.note-content {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-media {
  margin-bottom: 16px;
}

.media-preview {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tag {
  background: #f8f9ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.note-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 12px;
}

.note-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6c757d;
  font-size: 12px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.close-btn:hover {
  background: #e9ecef;
}

.modal-meta {
  padding: 0 24px 16px;
  display: flex;
  gap: 16px;
  font-size: 14px;
  flex-wrap: wrap;
}

.modal-meta .course {
  color: #43e97b;
  font-weight: 500;
}

.modal-meta .folder {
  color: #667eea;
  font-weight: 500;
}

.modal-meta .type {
  color: #764ba2;
  font-weight: 500;
}

.modal-meta .date {
  color: #6c757d;
}

.modal-body {
  flex: 1;
  padding: 0 24px;
  overflow-y: auto;
}

.note-full-content {
  white-space: pre-line;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 20px;
}

.media-full {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 20px;
}

.file-link {
  margin-bottom: 20px;
}

.file-download {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #43e97b;
  text-decoration: none;
  font-weight: 500;
}

.file-download:hover {
  color: #3ad66f;
}

.modal-footer {
  padding: 24px;
  border-top: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.modal-footer .tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.modal-footer .actions {
  display: flex;
  gap: 12px;
}

.btn.primary {
  background: #43e97b;
  border-color: #43e97b;
  color: white;
}

.btn.primary:hover {
  background: #3ad66f;
}

/* 响应式设计 */
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

  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-controls {
    flex-direction: column;
    gap: 8px;
  }

  .search-box {
    min-width: auto;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .note-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
