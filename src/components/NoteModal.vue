<template>
  <BaseModal :show="show" :title="editMode ? '编辑笔记' : '新建笔记'" @close="handleCancel">
      <form id="note-form" @submit.prevent="handleSubmit" class="modal-body">
          <!-- 标题 -->
          <div class="form-group">
            <label for="title">笔记标题</label>
            <BaseInput id="title" v-model="formData.title" placeholder="请输入笔记标题" />
          </div>

          <!-- 内容 -->
          <div class="form-group">
            <label for="content">笔记内容</label>
            <textarea
              id="content"
              v-model="formData.content"
              placeholder="请输入笔记内容..."
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>

          <!-- 课程选择 -->
          <div class="form-row">
            <div class="form-group">
              <label for="course">关联课程</label>
              <select id="course" v-model="formData.course_id" class="form-select">
                <option value="">请选择课程</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.title }}
                </option>
              </select>
            </div>

            <div class="form-group" v-if="formData.course_id">
              <label for="chapter">课程章节</label>
              <input
                id="chapter"
                v-model="formData.chapter"
                type="text"
                placeholder="例如：第一章 - AI概述"
                class="form-input"
              />
            </div>
          </div>

          <!-- 文件夹选择 -->
          <div class="form-group" v-if="!formData.course_id">
            <label for="folder">文件夹</label>
            <select id="folder" v-model="formData.folder_id" class="form-select">
              <option value="">选择文件夹</option>
              <option value="0">不放入文件夹</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                {{ folder.name }}
              </option>
            </select>
          </div>

          <!-- 笔记类型 -->
          <div class="form-group">
            <label for="noteType">笔记类型</label>
            <select id="noteType" v-model="formData.note_type" class="form-select">
              <option value="general">普通笔记</option>
              <option value="summary">总结笔记</option>
              <option value="reflection">反思笔记</option>
              <option value="question">疑问笔记</option>
              <option value="idea">想法笔记</option>
            </select>
          </div>

          <!-- 标签 -->
          <div class="form-group">
            <label for="tags">标签</label>
            <BaseInput id="tags" v-model="formData.tags" placeholder="多个标签用逗号分隔，如：Vue3,JavaScript,前端" />
          </div>

          <!-- 文件上传 -->
          <div class="form-group">
            <label for="file">附件</label>
            <div class="file-upload-area">
              <input
                id="file"
                ref="fileInput"
                type="file"
                @change="handleFileChange"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                style="display: none;"
              />
              <div class="file-upload-content" @click="triggerFileInput">
                <div v-if="!selectedFile && !formData.media_url" class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <p>点击上传文件或图片</p>
                  <span class="upload-hint">支持图片、视频、PDF、Word等格式</span>
                </div>
                <div v-else-if="selectedFile" class="file-preview">
                  <div class="file-info">
                    <span class="file-name">{{ selectedFile.name }}</span>
                    <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                  </div>
                  <button type="button" @click.stop="removeFile" class="remove-file-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                  </button>
                </div>
                <div v-else-if="formData.media_url" class="existing-media">
                  <div class="media-info">
                    <span class="media-type">{{ formData.media_type }}</span>
                    <span class="media-name">{{ formData.original_filename || '已有附件' }}</span>
                  </div>
                  <button type="button" @click.stop="removeExistingMedia" class="remove-file-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 媒体URL（如果没有上传文件） -->
          <div class="form-group" v-if="!selectedFile">
            <label for="mediaUrl">媒体链接（可选）</label>
            <BaseInput id="mediaUrl" v-model="formData.media_url" type="url" placeholder="外部文件或图片链接" />
            <div v-if="formData.media_url" class="form-group">
              <label for="mediaType">媒体类型</label>
              <select id="mediaType" v-model="formData.media_type" class="form-select">
                <option value="">请选择类型</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
                <option value="file">文件</option>
              </select>
            </div>
          </div>
      </form>
      <template #footer>
        <BaseButton variant="secondary" type="button" @click="handleCancel" :disabled="loading">取消</BaseButton>
        <BaseButton variant="primary" type="submit" form="note-form" :loading="loading" :disabled="!isValid">{{ editMode ? '更新笔记' : '创建笔记' }}</BaseButton>
      </template>
  </BaseModal>
</template>

<script>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { notesAdapter } from '@/api/openapi/adapters/notesAdapter.js'

export default {
  name: 'NoteModal',
  components: { BaseModal, BaseInput, BaseButton },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    note: {
      type: Object,
      default: null
    },
    courses: {
      type: Array,
      default: () => []
    },
    folders: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'success', 'created', 'updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const selectedFile = ref(null)
    const fileInput = ref(null)

    const editMode = computed(() => !!props.note)

    const formData = reactive({
      title: '',
      content: '',
      note_type: 'general',
      course_id: '',
      chapter: '',
      folder_id: '',
      tags: '',
      media_url: '',
      media_type: '',
      original_filename: '',
      media_size_bytes: null
    })

    // 验证表单
    const isValid = computed(() => {
      // 根据后端API文档：title、content、file 至少需要提供一个
      // 且 content 不能为空白字符
      const hasTitle = formData.title && formData.title.trim()
      const hasContent = formData.content && formData.content.trim()
      const hasFile = selectedFile.value
      
      return hasTitle || hasContent || hasFile
    })

    // 监听props.note变化，初始化表单
    watch(() => props.note, (newNote) => {
      if (newNote) {
        Object.keys(formData).forEach(key => {
          formData[key] = newNote[key] || ''
        })
        // 处理tags，如果是数组则转换为字符串
        if (Array.isArray(newNote.tags)) {
          formData.tags = newNote.tags.join(',')
        }
      } else {
        // 重置表单
        Object.keys(formData).forEach(key => {
          if (key === 'note_type') {
            formData[key] = 'general'
          } else if (key === 'folder_id') {
            formData[key] = 0 // 默认为独立笔记
          } else {
            formData[key] = ''
          }
        })
        selectedFile.value = null
      }
    }, { immediate: true })

    // 监听course_id变化，清空folder_id
    watch(() => formData.course_id, (newVal) => {
      if (newVal) {
        formData.folder_id = 0 // 设置为0表示独立笔记
      }
    })

    // 监听folder_id变化，清空course相关
    watch(() => formData.folder_id, (newVal) => {
      if (newVal && newVal !== 0) {
        formData.course_id = ''
        formData.chapter = ''
      }
    })

    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
        
        // 🚨 重要修正：不要预设 media_type，让后端自动确定
        // 清空 media_type，让后端根据文件类型自动设置
        formData.media_type = ''
        
        formData.original_filename = file.name
        formData.media_size_bytes = file.size
        formData.media_url = '' // 清空URL
      }
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const removeFile = () => {
      selectedFile.value = null
      formData.media_type = ''
      formData.original_filename = ''
      formData.media_size_bytes = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const removeExistingMedia = () => {
      formData.media_url = ''
      formData.media_type = ''
      formData.original_filename = ''
      formData.media_size_bytes = null
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleSubmit = async () => {
      if (!isValid.value || loading.value) return

      loading.value = true
      try {
        // 准备提交数据
        let submitData
        
        if (selectedFile.value) {
          // 使用FormData上传文件
          submitData = new FormData()
          submitData.append('file', selectedFile.value)
          
          // 添加其他字段，但排除 media_type 和 media_url
          Object.keys(formData).forEach(key => {
            if (formData[key] !== '' && formData[key] !== null && 
                key !== 'media_url' && key !== 'media_type') {
              if (key === 'folder_id') {
                // folder_id 的特殊处理：空字符串或null转换为0
                const folderValue = formData[key] === '' || formData[key] === null ? 0 : formData[key]
                submitData.append(key, folderValue.toString())
              } else if (key === 'course_id' && formData[key]) {
                // course_id 转换为字符串
                submitData.append(key, formData[key].toString())
              } else if (formData[key] !== '' && formData[key] !== null) {
                submitData.append(key, formData[key])
              }
            }
          })
          
          // 🚨 重要：文件上传时不设置 media_type，让后端自动确定
        } else {
          // 普通JSON数据（纯文本或外部媒体链接）
          submitData = { ...formData }
          
          // 处理 folder_id：空字符串转换为0，表示独立笔记
          if (submitData.folder_id === '' || submitData.folder_id === null) {
            submitData.folder_id = 0
          }
          
          // 处理 course_id：确保是数字类型
          if (submitData.course_id) {
            submitData.course_id = parseInt(submitData.course_id)
          }
          
          // 清理空字段，但保留 folder_id: 0
          Object.keys(submitData).forEach(key => {
            if (key === 'folder_id') {
              // folder_id 保留0值
              return
            }
            if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
              delete submitData[key]
            }
          })
          
          // 验证互斥规则：course_id 和 folder_id 不能同时非空（除非 folder_id=0）
          if (submitData.course_id && submitData.folder_id && submitData.folder_id !== 0) {
            alert('不能同时选择课程和文件夹')
            return
          }
          
          // 验证章节依赖：使用 chapter 时必须提供 course_id
          if (submitData.chapter && submitData.chapter.trim() && !submitData.course_id) {
            alert('使用章节信息时必须选择课程')
            return
          }
          
          // 验证媒体一致性：提供 media_url 时必须指定 media_type
          if (submitData.media_url && !submitData.media_type) {
            alert('提供媒体URL时必须指定媒体类型')
            return
          }
        }

        let payload
        if (editMode.value) {
          const updated = await notesAdapter.updateNote(props.note.id, submitData)
          payload = updated
        } else {
          const created = await notesAdapter.createNote(submitData)
          payload = created
        }

  // 适配器直接返回数据对象
        emit('success', payload)
        if (editMode.value) {
          emit('updated', payload)
        } else {
          emit('created', payload)
        }
        handleCancel()
      } catch (error) {
        console.error('保存笔记失败:', error)
        alert('保存失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    const handleCancel = () => {
      emit('close')
    }

    return {
      loading,
      selectedFile,
      fileInput,
      editMode,
      formData,
      isValid,
      handleFileChange,
      triggerFileInput,
      removeFile,
      removeExistingMedia,
      formatFileSize,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>

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
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #43e97b;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.file-upload-area {
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #43e97b;
}

.file-upload-content {
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.upload-placeholder svg {
  color: #6c757d;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-weight: 500;
}

.upload-hint {
  color: #6c757d;
  font-size: 12px;
}

.file-preview,
.existing-media {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.file-info,
.media-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-name,
.media-name {
  font-weight: 500;
  color: #2c3e50;
}

.file-size,
.media-type {
  font-size: 12px;
  color: #6c757d;
}

.remove-file-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.remove-file-btn:hover {
  background: #c82333;
}

.modal-footer {
  padding: 24px;
  border-top: 2px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #43e97b;
  color: #43e97b;
}

.btn-primary {
  background: #43e97b;
  border-color: #43e97b;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3ad66f;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
