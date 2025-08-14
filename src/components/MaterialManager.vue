<template>
  <div class="material-manager">
    <div class="manager-header">
      <h2>课程材料管理</h2>
      <button @click="showCreateModal = true" class="btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        添加材料
      </button>
    </div>

    <!-- 材料列表 -->
    <div class="materials-grid">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="materials.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        <h3>暂无材料</h3>
        <p>还没有添加任何课程材料</p>
      </div>

      <div v-else v-for="material in materials" :key="material.id" class="material-card">
        <div class="material-header">
          <div class="material-icon" :class="material.type">
            <svg v-if="material.type === 'file'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <svg v-else-if="material.type === 'link'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39C7,12.61 7,11.35 7.77,10.58L10.58,7.77C11.35,7 12.61,7 13.39,7.77L14.8,9.19C15.2,9.6 15.2,10.2 14.8,10.59C14.39,11 13.79,11 13.38,10.59L11.96,9.17C11.75,8.95 11.41,8.95 11.19,9.17L8.39,11.97C8.17,12.19 8.17,12.53 8.39,12.75L10.59,13.41M13.41,9.17C13.8,8.78 14.4,8.78 14.81,9.17L16.23,10.58C17,11.35 17,12.61 16.23,13.39L13.42,16.2C12.65,16.97 11.39,16.97 10.61,16.2L9.2,14.81C8.8,14.4 8.8,13.8 9.2,13.41C9.59,13 10.19,13 10.6,13.41L12,14.81C12.22,15.03 12.56,15.03 12.78,14.81L15.58,12C15.8,11.78 15.8,11.44 15.58,11.22L14.17,9.81C13.96,9.6 13.62,9.6 13.41,9.81"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <div class="material-type">{{ getMaterialTypeText(material.type) }}</div>
        </div>
        
        <div class="material-body">
          <h3 class="material-title">{{ material.title }}</h3>
          <p v-if="material.content" class="material-description">
            {{ material.content.length > 100 ? material.content.substring(0, 100) + '...' : material.content }}
          </p>
          <div class="material-meta">
            <span v-if="material.original_filename" class="meta-item">{{ material.original_filename }}</span>
            <span v-if="material.size_bytes" class="meta-item">{{ formatFileSize(material.size_bytes) }}</span>
            <span class="meta-item">{{ new Date(material.created_at).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="material-actions">
          <button @click="editMaterial(material)" class="btn-secondary btn-small">
            编辑
          </button>
          <button @click="deleteMaterial(material)" class="btn-danger btn-small">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑材料模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? '添加课程材料' : '编辑课程材料' }}</h3>
          <button @click="closeModal" class="modal-close">×</button>
        </div>

        <form @submit.prevent="submitMaterial" class="modal-body">
          <div class="form-group">
            <label>材料标题*</label>
            <input 
              v-model="materialForm.title" 
              type="text" 
              required 
              placeholder="请输入材料标题"
            >
          </div>

          <div class="form-group">
            <label>材料类型*</label>
            <div class="type-selector">
              <label class="type-option">
                <input 
                  v-model="materialForm.type" 
                  type="radio" 
                  value="file"
                  @change="clearTypeSpecificFields"
                >
                <span>文件</span>
              </label>
              <label class="type-option">
                <input 
                  v-model="materialForm.type" 
                  type="radio" 
                  value="link"
                  @change="clearTypeSpecificFields"
                >
                <span>链接</span>
              </label>
              <label class="type-option">
                <input 
                  v-model="materialForm.type" 
                  type="radio" 
                  value="text"
                  @change="clearTypeSpecificFields"
                >
                <span>文档</span>
              </label>
            </div>
          </div>

          <!-- 文件上传 -->
          <div v-if="materialForm.type === 'file'" class="form-group">
            <label>选择文件*</label>
            <input 
              ref="fileInput"
              type="file" 
              @change="handleFileChange"
              required
            >
            <div v-if="selectedFile" class="file-info">
              <span>{{ selectedFile.name }}</span>
              <span>({{ formatFileSize(selectedFile.size) }})</span>
            </div>
          </div>

          <!-- 链接输入 -->
          <div v-if="materialForm.type === 'link'" class="form-group">
            <label>链接地址*</label>
            <input 
              v-model="materialForm.url" 
              type="url" 
              required 
              placeholder="https://example.com"
            >
          </div>

          <!-- 文本内容 -->
          <div v-if="materialForm.type === 'text'" class="form-group">
            <label>文档内容*</label>
            <textarea 
              v-model="materialForm.content" 
              required 
              rows="8"
              placeholder="请输入文档内容"
            ></textarea>
          </div>

          <!-- 描述/备注 -->
          <div v-if="materialForm.type !== 'text'" class="form-group">
            <label>描述</label>
            <textarea 
              v-model="materialForm.content" 
              rows="3"
              placeholder="可选的描述信息"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              取消
            </button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? '提交中...' : '确定' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import apiService from '@/services/api.js'

export default {
  name: 'MaterialManager',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
  const loading = ref(true)
    const materials = ref([])
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const submitting = ref(false)
  const selectedFile = ref(null)
  const fileInput = ref(null)
    const editingMaterial = ref(null)

    const materialForm = reactive({
      title: '',
      type: 'file',
      url: '',
      content: ''
    })

    // 加载材料列表
    const loadMaterials = async () => {
      try {
        loading.value = true
        const response = await apiService.getCourseMaterials(props.courseId)
        if (response.data.success) {
          materials.value = response.data.data
        }
      } catch (error) {
        console.error('加载材料失败:', error)
        alert('加载材料失败')
      } finally {
        loading.value = false
      }
    }

    // 处理文件选择
    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
      }
    }

    // 清除特定类型的字段
    const clearTypeSpecificFields = () => {
      materialForm.url = ''
      materialForm.content = ''
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    // 提交材料
    const submitMaterial = async () => {
      try {
        submitting.value = true
        let response

        // 前置校验：确保字段满足各类型要求
        if (materialForm.type === 'link' && !materialForm.url) {
          alert('链接类型必须填写URL')
          submitting.value = false
          return
        }
        if (materialForm.type === 'text' && !materialForm.content) {
          alert('文档类型必须填写内容')
          submitting.value = false
          return
        }
        if (!showEditModal.value && materialForm.type === 'file' && !selectedFile.value) {
          alert('请选择要上传的文件')
          submitting.value = false
          return
        }

        if (showEditModal.value) {
          // 更新材料
          response = await apiService.updateCourseMaterial(
            props.courseId,
            editingMaterial.value.id,
            {
              title: materialForm.title,
              type: materialForm.type,
              url: materialForm.url,
              content: materialForm.content
            },
            selectedFile.value
          )
        } else {
          // 创建新材料
          response = await apiService.createCourseMaterial(
            props.courseId,
            {
              title: materialForm.title,
              type: materialForm.type,
              url: materialForm.url,
              content: materialForm.content
            },
            selectedFile.value
          )
        }

        if (response.data.success) {
          alert(showEditModal.value ? '材料更新成功!' : '材料添加成功!')
          closeModal()
          loadMaterials()
        } else {
          alert(response.data.message || '操作失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        alert('提交失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }

    // 编辑材料
    const editMaterial = (material) => {
      editingMaterial.value = material
      materialForm.title = material.title
      materialForm.type = material.type
      materialForm.url = material.url || ''
      materialForm.content = material.content || ''
      showEditModal.value = true
    }

    // 删除材料
    const deleteMaterial = async (material) => {
      if (!confirm(`确定要删除材料"${material.title}"吗？此操作不可撤销。`)) {
        return
      }

      try {
        const response = await apiService.deleteCourseMaterial(props.courseId, material.id)
        if (response.data.success) {
          alert('删除成功!')
          loadMaterials()
        } else {
          alert('删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请稍后重试')
      }
    }

    // 关闭模态框
    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      editingMaterial.value = null
      selectedFile.value = null
      
      // 重置表单
      materialForm.title = ''
      materialForm.type = 'file'
      materialForm.url = ''
      materialForm.content = ''
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

    // 生命周期
    onMounted(() => {
      loadMaterials()
    })

    return {
      loading,
      materials,
      showCreateModal,
      showEditModal,
      submitting,
      selectedFile,
  fileInput,
      materialForm,
      handleFileChange,
      clearTypeSpecificFields,
      submitMaterial,
      editMaterial,
      deleteMaterial,
      closeModal,
      getMaterialTypeText,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.material-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.manager-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.loading-container {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
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

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6c757d;
  text-align: center;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.material-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.material-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.material-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.material-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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

.material-type {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.material-body {
  margin-bottom: 20px;
}

.material-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.material-description {
  color: #6c757d;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.material-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.85rem;
  color: #6c757d;
}

.meta-item {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 8px;
}

.material-actions {
  display: flex;
  gap: 8px;
}

/* 按钮样式 */
.btn-primary, .btn-secondary, .btn-danger {
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modal-close {
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
}

.modal-close:hover {
  color: #495057;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.type-selector {
  display: flex;
  gap: 16px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 400;
}

.type-option input[type="radio"] {
  width: auto;
}

.file-info {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #6c757d;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

/* 响应式 */
@media (max-width: 768px) {
  .material-manager {
    padding: 16px;
  }

  .manager-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .materials-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .type-selector {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
