<template>
  <div class="material-detail-modal">
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ material?.title || '材料详情' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>

        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载材料详情中...</p>
        </div>

        <div v-else-if="material" class="modal-body">
          <!-- 材料基本信息 -->
          <div class="material-info">
            <div class="material-header">
              <div class="material-icon" :class="material.type">
                <svg v-if="material.type === 'file'" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <svg v-else-if="material.type === 'link'" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39C7,12.61 7,11.35 7.77,10.58L10.58,7.77C11.35,7 12.61,7 13.39,7.77L14.8,9.19C15.2,9.6 15.2,10.2 14.8,10.59C14.39,11 13.79,11 13.38,10.59L11.96,9.17C11.75,8.95 11.41,8.95 11.19,9.17L8.39,11.97C8.17,12.19 8.17,12.53 8.39,12.75L10.59,13.41M13.41,9.17C13.8,8.78 14.4,8.78 14.81,9.17L16.23,10.58C17,11.35 17,12.61 16.23,13.39L13.42,16.2C12.65,16.97 11.39,16.97 10.61,16.2L9.2,14.81C8.8,14.4 8.8,13.8 9.2,13.41C9.59,13 10.19,13 10.6,13.41L12,14.81C12.22,15.03 12.56,15.03 12.78,14.81L15.58,12C15.8,11.78 15.8,11.44 15.58,11.22L14.17,9.81C13.96,9.6 13.62,9.6 13.41,9.81"/>
                </svg>
                <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <div class="material-meta">
                <h3>{{ material.title }}</h3>
                <div class="meta-tags">
                  <span class="type-tag" :class="material.type">{{ getMaterialTypeText(material.type) }}</span>
                  <span v-if="material.size_bytes" class="size-tag">{{ formatFileSize(material.size_bytes) }}</span>
                  <span class="date-tag">{{ formatDate(material.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- 材料内容 -->
            <div class="material-content">
              <!-- 链接类型 -->
              <div v-if="material.type === 'link' && material.url" class="link-content">
                <div class="content-label">链接地址</div>
                <div class="link-url">
                  <a :href="material.url" target="_blank" rel="noopener noreferrer">
                    {{ material.url }}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                    </svg>
                  </a>
                </div>
                <div v-if="material.content" class="content-description">
                  <div class="content-label">描述</div>
                  <div class="description-text">{{ material.content }}</div>
                </div>
              </div>

              <!-- 文件类型 -->
              <div v-else-if="material.type === 'file'" class="file-content">
                <div v-if="material.original_filename" class="file-info">
                  <div class="content-label">文件名</div>
                  <div class="file-name">{{ material.original_filename }}</div>
                </div>
                <div v-if="material.content" class="content-description">
                  <div class="content-label">描述</div>
                  <div class="description-text">{{ material.content }}</div>
                </div>
                <div class="file-actions">
                  <button @click="downloadFile" class="btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    下载文件
                  </button>
                </div>
              </div>

              <!-- 文档类型 -->
              <div v-else-if="material.type === 'text' && material.content" class="text-content">
                <div class="content-label">文档内容</div>
                <div class="text-display">
                  <pre>{{ material.content }}</pre>
                </div>
              </div>

              <!-- 空内容 -->
              <div v-else class="empty-content">
                <p>暂无内容</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="error-state">
          <p>加载材料详情失败</p>
          <button @click="loadMaterialDetail" class="btn-secondary">重试</button>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/api.js'

export default {
  name: 'MaterialDetailModal',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    materialId: {
      type: [String, Number],
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const loading = ref(false)
    const material = ref(null)

    // 加载材料详情
    const loadMaterialDetail = async () => {
      if (!props.courseId || !props.materialId) return

      try {
        loading.value = true
        const response = await apiService.getCourseMaterial(props.courseId, props.materialId)
        if (response.data.success) {
          material.value = response.data.data
        }
      } catch (error) {
        console.error('加载材料详情失败:', error)
        material.value = null
      } finally {
        loading.value = false
      }
    }

    // 下载文件
    const downloadFile = () => {
      if (material.value?.file_path) {
        // 这里应该调用文件下载接口
        alert('文件下载功能开发中...')
      }
    }

    // 关闭模态框
    const closeModal = () => {
      emit('close')
    }

    // 工具函数
    const getMaterialTypeText = (type) => {
      const typeMap = {
        'file': '文件',
        'link': '链接',
        'text': '文档'
      }
      return typeMap[type] || '未知'
    }

    const formatFileSize = (bytes) => {
      if (!bytes) return '0 B'
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 监听可见性变化
    watch(() => props.visible, (visible) => {
      if (visible) {
        loadMaterialDetail()
      } else {
        material.value = null
      }
    })

    return {
      loading,
      material,
      loadMaterialDetail,
      downloadFile,
      closeModal,
      getMaterialTypeText,
      formatFileSize,
      formatDate
    }
  }
}
</script>

<style scoped>
.material-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.modal-body {
  padding: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.material-info {
  padding: 24px;
}

.material-header {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
}

.material-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.material-icon.file {
  background: #28a745;
}

.material-icon.link {
  background: #007bff;
}

.material-icon.text {
  background: #6f42c1;
}

.material-meta h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-tag, .size-tag, .date-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.type-tag.file {
  background: #d4edda;
  color: #155724;
}

.type-tag.link {
  background: #cce5ff;
  color: #0056b3;
}

.type-tag.text {
  background: #e2d9f3;
  color: #4a2c5c;
}

.size-tag, .date-tag {
  background: #f8f9fa;
  color: #6c757d;
}

.material-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.content-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.link-url {
  margin-bottom: 20px;
}

.link-url a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  text-decoration: none;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  font-weight: 500;
  transition: all 0.3s ease;
}

.link-url a:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.content-description {
  margin-top: 20px;
}

.description-text {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  line-height: 1.6;
  color: #495057;
}

.file-info {
  margin-bottom: 20px;
}

.file-name {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  font-family: monospace;
  color: #495057;
}

.file-actions {
  margin-top: 20px;
}

.text-display {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  max-height: 400px;
  overflow-y: auto;
}

.text-display pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #495057;
}

.empty-content {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  text-align: right;
}

.btn-primary, .btn-secondary {
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 1rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #495057;
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .material-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .material-icon {
    width: 48px;
    height: 48px;
  }
  
  .meta-tags {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
