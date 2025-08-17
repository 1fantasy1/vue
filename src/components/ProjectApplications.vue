<template>
  <div class="project-applications">
    <!-- 申请项目按钮（学生视角） -->
    <div v-if="!isProjectCreator && canApply" class="apply-section">
      <button class="apply-btn" @click="showApplyModal = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        申请加入项目
      </button>
    </div>

    <!-- 申请表单弹窗 -->
    <teleport to="body">
      <div v-if="showApplyModal" class="modal-overlay" @click="closeApplyModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <h3>申请加入项目</h3>
            <button class="close-btn" @click="closeApplyModal">×</button>
          </div>
          <form class="apply-form" @submit.prevent="submitApplication">
            <div class="form-field">
              <label>申请留言</label>
              <textarea 
                v-model="applicationData.message" 
                rows="4" 
                placeholder="请简要说明您为什么想加入这个项目，您能为项目带来什么价值..."
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn secondary" @click="closeApplyModal">取消</button>
              <button type="submit" class="btn primary" :disabled="submitting">
                {{ submitting ? '提交中...' : '提交申请' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- 申请管理（项目创建者视角） -->
    <div v-if="isProjectCreator" class="applications-management">
      <div class="section-header">
        <h3>项目申请管理</h3>
        <div class="filter-tabs">
          <button 
            v-for="status in statusFilters" 
            :key="status.value"
            class="filter-btn"
            :class="{ active: currentStatusFilter === status.value }"
            @click="currentStatusFilter = status.value"
          >
            {{ status.label }}
            <span class="count">{{ getApplicationsCount(status.value) }}</span>
          </button>
        </div>
      </div>

      <div class="applications-list">
        <div v-if="filteredApplications.length === 0" class="empty-state">
          <p>{{ getEmptyMessage() }}</p>
        </div>
        
        <div v-else class="application-cards">
          <div 
            v-for="application in filteredApplications" 
            :key="application.id"
            class="application-card"
            :class="application.status"
          >
            <div class="applicant-info">
              <div class="applicant-avatar">
                {{ application.applicant_name?.charAt(0) || 'U' }}
              </div>
              <div class="applicant-details">
                <h4>{{ application.applicant_name || '未知用户' }}</h4>
                <p class="email">{{ application.applicant_email || '' }}</p>
                <p class="apply-time">申请时间：{{ formatDate(application.applied_at) }}</p>
              </div>
            </div>

            <div class="application-content">
              <div class="message">
                <h5>申请留言：</h5>
                <p>{{ application.message || '该用户未填写申请留言' }}</p>
              </div>
            </div>

            <div class="application-status">
              <span class="status-badge" :class="application.status">
                {{ getStatusText(application.status) }}
              </span>
              <div v-if="application.processed_at" class="process-info">
                <p>处理时间：{{ formatDate(application.processed_at) }}</p>
                <p v-if="application.processor_name">处理人：{{ application.processor_name }}</p>
              </div>
            </div>

            <div v-if="application.status === 'pending'" class="application-actions">
              <button 
                class="btn approve" 
                @click="processApplication(application.id, 'approved')"
                :disabled="processing"
              >
                通过
              </button>
              <button 
                class="btn reject" 
                @click="processApplication(application.id, 'rejected')"
                :disabled="processing"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目成员列表 -->
    <div v-if="showMembers" class="members-section">
      <div class="section-header">
        <h3>项目成员</h3>
        <span class="member-count">{{ members.length }} 名成员</span>
      </div>
      
      <div class="members-list">
        <div v-if="members.length === 0" class="empty-state">
          <p>暂无项目成员</p>
        </div>
        
        <div v-else class="member-cards">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-card"
          >
            <div class="member-avatar">
              {{ member.member_name?.charAt(0) || 'U' }}
            </div>
            <div class="member-info">
              <h4>{{ member.member_name || '未知用户' }}</h4>
              <p class="email">{{ member.member_email || '' }}</p>
              <span class="role-badge" :class="member.role">
                {{ member.role === 'admin' ? '管理员' : '成员' }}
              </span>
            </div>
            <div class="join-time">
              加入时间：{{ formatDate(member.joined_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { ApiService } from '@/services/api.js'

export default {
  name: 'ProjectApplications',
  props: {
    projectId: {
      type: [String, Number],
      required: true
    },
    isProjectCreator: {
      type: Boolean,
      default: false
    },
    canApply: {
      type: Boolean,
      default: true
    },
    showMembers: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const showApplyModal = ref(false)
    const submitting = ref(false)
    const processing = ref(false)
    
    const applications = ref([])
    const members = ref([])
    const currentStatusFilter = ref(null)
    
    const applicationData = ref({
      message: ''
    })

    const statusFilters = [
      { value: null, label: '全部' },
      { value: 'pending', label: '待处理' },
      { value: 'approved', label: '已通过' },
      { value: 'rejected', label: '已拒绝' }
    ]

    const filteredApplications = computed(() => {
      if (!currentStatusFilter.value) return applications.value
      return applications.value.filter(app => app.status === currentStatusFilter.value)
    })

    const getApplicationsCount = (status) => {
      if (!status) return applications.value.length
      return applications.value.filter(app => app.status === status).length
    }

    const getEmptyMessage = () => {
      switch (currentStatusFilter.value) {
        case 'pending': return '暂无待处理的申请'
        case 'approved': return '暂无已通过的申请'
        case 'rejected': return '暂无已拒绝的申请'
        default: return '暂无申请记录'
      }
    }

    const getStatusText = (status) => {
      switch (status) {
        case 'pending': return '待处理'
        case 'approved': return '已通过'
        case 'rejected': return '已拒绝'
        default: return '未知状态'
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      try {
        return new Date(dateStr).toLocaleString('zh-CN')
      } catch {
        return dateStr
      }
    }

    const closeApplyModal = () => {
      showApplyModal.value = false
      applicationData.value.message = ''
    }

    const submitApplication = async () => {
      submitting.value = true
      try {
        const response = await ApiService.applyToProject(props.projectId, applicationData.value)
        if (response.data.success) {
          emit('applicationSubmitted', response.data.data)
          closeApplyModal()
          // 可以显示成功提示
        } else {
          alert(response.data.message || '申请提交失败')
        }
      } catch (error) {
        alert(error.message || '申请提交失败')
      } finally {
        submitting.value = false
      }
    }

    const loadApplications = async () => {
      if (!props.isProjectCreator) return
      
      try {
        const response = await ApiService.getProjectApplications(props.projectId)
        if (response.data.success) {
          applications.value = response.data.data || []
        }
      } catch (error) {
        console.error('加载申请列表失败:', error)
      }
    }

    const loadMembers = async () => {
      if (!props.showMembers) return
      
      try {
        const response = await ApiService.getProjectMembers(props.projectId)
        if (response.data.success) {
          members.value = response.data.data || []
        }
      } catch (error) {
        console.error('加载成员列表失败:', error)
      }
    }

    const processApplication = async (applicationId, status) => {
      processing.value = true
      try {
        const response = await ApiService.processProjectApplication(applicationId, { status })
        if (response.data.success) {
          // 更新本地申请状态
          const app = applications.value.find(a => a.id === applicationId)
          if (app) {
            Object.assign(app, response.data.data)
          }
          emit('applicationProcessed', response.data.data)
          
          // 如果通过申请，重新加载成员列表
          if (status === 'approved') {
            await loadMembers()
          }
        } else {
          alert(response.data.message || '处理申请失败')
        }
      } catch (error) {
        alert(error.message || '处理申请失败')
      } finally {
        processing.value = false
      }
    }

    // 监听项目ID变化，重新加载数据
    watch(() => props.projectId, () => {
      loadApplications()
      loadMembers()
    }, { immediate: true })

    onMounted(() => {
      loadApplications()
      loadMembers()
    })

    return {
      showApplyModal,
      submitting,
      processing,
      applications,
      members,
      currentStatusFilter,
      applicationData,
      statusFilters,
      filteredApplications,
      getApplicationsCount,
      getEmptyMessage,
      getStatusText,
      formatDate,
      closeApplyModal,
      submitApplication,
      processApplication
    }
  }
}
</script>

<style scoped>
.project-applications {
  margin: 24px 0;
}

.apply-section {
  margin-bottom: 24px;
}

.apply-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: min(500px, 90vw);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-weight: 600;
  color: #333;
}

.form-field textarea {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.form-field textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-btn {
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.filter-btn .count {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
}

.filter-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.applications-list, .members-section {
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.application-cards, .member-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-card, .member-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: white;
}

.applicant-info, .member-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.applicant-avatar, .member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.applicant-details h4, .member-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.email {
  color: #666;
  font-size: 14px;
  margin: 4px 0;
}

.apply-time, .join-time {
  color: #888;
  font-size: 12px;
}

.application-content {
  margin-bottom: 16px;
}

.message h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.message p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.application-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #dc2626;
}

.role-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge.admin {
  background: #fef3c7;
  color: #d97706;
}

.role-badge.member {
  background: #e0e7ff;
  color: #3730a3;
}

.process-info {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.process-info p {
  margin: 2px 0;
}

.application-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn.approve {
  background: #10b981;
  color: white;
}

.btn.reject {
  background: #ef4444;
  color: white;
}

.member-count {
  color: #666;
  font-size: 14px;
}

.member-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.member-info {
  flex: 1;
  margin-bottom: 0;
}
</style>
