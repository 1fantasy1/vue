<template>
  <div class="course-detail-page">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载课程详情...</p>
    </div>

    <div v-else-if="course" class="course-detail">
      <!-- 课程头部信息 -->
      <div class="course-header">
        <div class="course-hero">
          <div class="course-cover">
            <img v-if="course.cover_image_url" :src="course.cover_image_url" :alt="course.title" />
            <div v-else class="default-cover">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            </div>
          </div>
          
          <div class="course-info">
            <h1 class="course-title">{{ course.title }}</h1>
            <p v-if="course.instructor" class="course-instructor">讲师：{{ course.instructor }}</p>
            <p v-if="course.description" class="course-description">{{ course.description }}</p>
            
            <div class="course-meta">
              <div v-if="course.category" class="meta-item">
                <span class="meta-label">分类：</span>
                <span class="meta-value category">{{ course.category }}</span>
              </div>
              <div v-if="course.total_lessons" class="meta-item">
                <span class="meta-label">课时：</span>
                <span class="meta-value">{{ course.total_lessons }}节</span>
              </div>
              <div v-if="course.avg_rating" class="meta-item">
                <span class="meta-label">评分：</span>
                <span class="meta-value rating">{{ course.avg_rating.toFixed(1) }}分</span>
              </div>
              <div v-if="completionCount !== null && appConfig.features?.courseCompletionStats" class="meta-item">
                <span class="meta-label">完成：</span>
                <span class="meta-value">{{ completionCount }}人</span>
              </div>
            </div>

            <!-- 技能要求 -->
            <div v-if="course.required_skills && course.required_skills.length > 0" class="required-skills">
              <h3>所需技能</h3>
              <div class="skills-list">
                <div v-for="skill in course.required_skills" :key="skill.name" class="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level" :class="getSkillLevelClass(skill.level)">
                    {{ skill.level }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="course-actions">
          <button 
            v-if="!userProgress" 
            @click="enrollCourse" 
            class="action-btn primary"
            :disabled="enrolling"
          >
            {{ enrolling ? '报名中...' : '开始学习' }}
          </button>
          <button 
            v-else 
            @click="continueLearning" 
            class="action-btn primary"
          >
            {{ userProgress.status === 'completed' ? '复习课程' : '继续学习' }}
          </button>
          <button @click="toggleFavorite" class="action-btn secondary">
            {{ isFavorited ? '取消收藏' : '收藏课程' }}
          </button>
        </div>

        <!-- 学习进度 -->
        <div v-if="userProgress" class="progress-section">
          <div class="progress-header">
            <span>学习进度</span>
            <span>{{ Math.round(userProgress.progress * 100) }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (userProgress.progress * 100) + '%' }"></div>
          </div>
          <div class="progress-status">
            <span class="status-badge" :class="userProgress.status">
              {{ getStatusText(userProgress.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 课程材料 -->
      <div class="course-content">
        <div class="content-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            class="tab-btn" 
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 课程材料列表 -->
        <div v-if="activeTab === 'materials'" class="materials-section">
          <div v-if="loadingMaterials" class="loading-container">
            <p>正在加载课程材料...</p>
          </div>
          <div v-else-if="materials.length === 0" class="empty-state">
            <p>暂无课程材料</p>
          </div>
          <div v-else class="materials-list">
            <div v-for="material in materials" :key="material.id" class="material-item">
              <div class="material-icon" :class="material.type">
                <svg v-if="material.type === 'file'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <svg v-else-if="material.type === 'link'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39C7,12.61 7,11.35 7.77,10.58L10.58,7.77C11.35,7 12.61,7 13.39,7.77L14.8,9.19C15.2,9.6 15.2,10.2 14.8,10.59C14.39,11 13.79,11 13.38,10.59L11.96,9.17C11.75,8.95 11.41,8.95 11.19,9.17L8.39,11.97C8.17,12.19 8.17,12.53 8.39,12.75L10.59,13.41M13.41,9.17C13.8,8.78 14.4,8.78 14.81,9.17L16.23,10.58C17,11.35 17,12.61 16.23,13.39L13.42,16.2C12.65,16.97 11.39,16.97 10.61,16.2L9.2,14.81C8.8,14.4 8.8,13.8 9.2,13.41C9.59,13 10.19,13 10.6,13.41L12,14.81C12.22,15.03 12.56,15.03 12.78,14.81L15.58,12C15.8,11.78 15.8,11.44 15.58,11.22L14.17,9.81C13.96,9.6 13.62,9.6 13.41,9.81"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <div class="material-info">
                <h4 class="material-title">{{ material.title }}</h4>
                <p v-if="material.content" class="material-description">{{ material.content }}</p>
                <div class="material-meta">
                  <span class="material-type">{{ getMaterialTypeText(material.type) }}</span>
                  <span v-if="material.size_bytes" class="material-size">
                    {{ formatFileSize(material.size_bytes) }}
                  </span>
                </div>
              </div>
              <div class="material-actions">
                <template v-if="isAdmin">
                  <button 
                    @click="startEditMaterial(material)" 
                    class="material-btn secondary"
                    title="编辑材料"
                  >
                    编辑
                  </button>
                  <button 
                    @click="confirmDeleteMaterial(material)" 
                    class="material-btn danger"
                    title="删除材料"
                  >
                    删除
                  </button>
                </template>
                <button 
                  @click="openMaterial(material)" 
                  class="material-btn primary"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- 推荐课程 -->
        <div v-if="activeTab === 'recommendations'" class="recommendations-section">
          <div v-if="loadingRecommendations" class="loading-container">
            <p>正在获取推荐课程...</p>
          </div>
          <div v-else-if="recommendedCourses.length === 0" class="empty-state">
            <p>暂无推荐课程</p>
          </div>
          <div v-else class="recommendations-list">
            <div v-for="rec in recommendedCourses" :key="rec.course_id" class="recommendation-item">
              <div class="rec-cover">
                <img v-if="rec.cover_image_url" :src="rec.cover_image_url" :alt="rec.title" />
                <div v-else class="default-cover"></div>
              </div>
              <div class="rec-info">
                <h4 class="rec-title">{{ rec.title }}</h4>
                <p v-if="rec.instructor" class="rec-instructor">讲师：{{ rec.instructor }}</p>
                <p class="rec-description">{{ rec.description }}</p>
                <div v-if="rec.match_rationale" class="rec-rationale">
                  <p class="rationale-text">{{ rec.match_rationale }}</p>
                </div>
                <div class="rec-meta">
                  <span v-if="rec.category" class="rec-category">{{ rec.category }}</span>
                  <span class="rec-score">匹配度: {{ Math.round(rec.relevance_score * 100) }}%</span>
                </div>
              </div>
              <div class="rec-actions">
                <button @click="goToCourse(rec.course_id)" class="rec-btn primary">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <h2>课程不存在</h2>
      <p>抱歉，您访问的课程不存在或已被删除。</p>
      <button @click="goBack" class="action-btn secondary">返回</button>
    </div>

    <!-- 材料详情模态框 - 移到条件块外面 -->
    <MaterialDetailModal
      v-if="showMaterialDetail"
      :courseId="courseId"
      :materialId="selectedMaterialId"
  :initialMaterial="selectedMaterial"
      :visible="showMaterialDetail"
      @close="closeMaterialDetail"
    />

    <!-- 编辑材料模态框（仅管理员可见） -->
    <div v-if="showEditModal && isAdmin" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑课程材料</h3>
          <button @click="closeEditModal" class="modal-close">×</button>
        </div>

        <form @submit.prevent="submitEditMaterial" class="modal-body">
          <div class="form-group">
            <label>材料标题*</label>
            <input v-model="materialForm.title" type="text" required placeholder="请输入材料标题" />
          </div>

          <div class="form-group">
            <label>材料类型*</label>
            <div class="type-selector">
              <label class="type-option">
                <input v-model="materialForm.type" type="radio" value="file" @change="clearTypeSpecificFields" />
                <span>文件</span>
              </label>
              <label class="type-option">
                <input v-model="materialForm.type" type="radio" value="link" @change="clearTypeSpecificFields" />
                <span>链接</span>
              </label>
              <label class="type-option">
                <input v-model="materialForm.type" type="radio" value="text" @change="clearTypeSpecificFields" />
                <span>文档</span>
              </label>
            </div>
          </div>

          <div v-if="materialForm.type === 'file'" class="form-group">
            <label>替换文件（可选）</label>
            <input ref="fileInput" type="file" @change="handleFileChange" />
          </div>

          <div v-if="materialForm.type === 'link'" class="form-group">
            <label>链接地址*</label>
            <input v-model="materialForm.url" type="url" required placeholder="https://example.com" />
          </div>

          <div v-if="materialForm.type === 'text'" class="form-group">
            <label>文档内容*</label>
            <textarea v-model="materialForm.content" rows="8" required placeholder="请输入文档内容"></textarea>
          </div>

          <div v-if="materialForm.type !== 'text'" class="form-group">
            <label>描述</label>
            <textarea v-model="materialForm.content" rows="3" placeholder="可选的描述信息"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeEditModal" class="material-btn secondary">取消</button>
            <button type="submit" class="material-btn primary" :disabled="submittingEdit">
              {{ submittingEdit ? '提交中...' : '确定' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import MaterialDetailModal from '@/components/MaterialDetailModal.vue'
import apiService from '@/services/api.js'
import appConfig from '@/config/index.js'

export default {
  name: 'CourseDetail',
  components: { MaterialDetailModal },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const globalStore = useGlobalStore()
  const courseId = computed(() => route.params.id)
    
    // 响应式数据
    const loading = ref(true)
    const course = ref(null)
    const userProgress = ref(null)
    const materials = ref([])
    const recommendedCourses = ref([])
  const completionCount = ref(null)
    const enrolling = ref(false)
    const isFavorited = ref(false)
    const loadingMaterials = ref(false)
    const loadingRecommendations = ref(false)
    
    // 材料详情模态框
    const showMaterialDetail = ref(false)
  const selectedMaterialId = ref(null)
  const selectedMaterial = ref(null)
    
    // 活动选项卡
    const activeTab = ref('materials')
    const isAdmin = computed(() => {
      const lsRole = (localStorage.getItem('userRole') || '').toLowerCase()
      const u = globalStore?.user || {}
      const storeRole = (u.role || '').toLowerCase()
      const roles = Array.isArray(u.roles) ? u.roles.map(r => String(r).toLowerCase()) : []
      const perms = Array.isArray(u.permissions) ? u.permissions.map(p => String(p).toLowerCase()) : []
      const flags = [lsRole, storeRole, ...roles, ...perms]
      return u.is_admin === true || flags.includes('admin')
    })
    const tabs = computed(() => {
      // 仅保留“课程材料/推荐课程”，不再显示“材料管理”
      return [
        { key: 'materials', label: '课程材料' },
        { key: 'recommendations', label: '推荐课程' }
      ]
    })

    // 获取课程详情
    const loadCourseDetail = async () => {
      try {
        loading.value = true
        const courseId = route.params.id
        
        // 获取课程基本信息
        const courseResponse = await apiService.getCourse(courseId)
        
        if (courseResponse.data.success && courseResponse.data.data) {
          course.value = courseResponse.data.data
          
          // 并行加载其他数据
          // 并行加载其他数据（统计受特性开关控制）
          const tasks = [
            loadCourseMaterials(courseId),
            loadRecommendations()
          ]
          if (appConfig.features?.courseCompletionStats) {
            tasks.push(loadCourseStatistics(courseId))
          }
          await Promise.all(tasks)
        } else {
          // API调用成功但课程不存在
          console.warn('课程不存在或加载失败:', courseId, courseResponse.data?.message)
          course.value = null
        }
      } catch (error) {
        console.error('加载课程详情失败:', error)
        course.value = null
      } finally {
        loading.value = false
      }
    }

    // 加载课程材料
    const loadCourseMaterials = async (courseId) => {
      try {
        loadingMaterials.value = true
        const response = await apiService.getCourseMaterials(courseId)
        if (response.data.success) {
          materials.value = response.data.data
        }
      } catch (error) {
        console.error('加载课程材料失败:', error)
      } finally {
        loadingMaterials.value = false
      }
    }

    // 加载课程统计
    const loadCourseStatistics = async (courseId) => {
      try {
        const response = await apiService.getCourseCompletionCount(courseId)
        if (response.data.success) {
          completionCount.value = response.data.data.count
        }
      } catch (error) {
        // 如果后端未实现该接口，静默忽略并不显示统计
        console.warn('课程完成统计接口不可用，已跳过。', error?.message || error)
      }
    }

    // 加载推荐课程
    const loadRecommendations = async () => {
      try {
        loadingRecommendations.value = true
        // 假设当前用户ID为1（实际应从用户状态获取）
        const userId = 1
        const response = await apiService.getRecommendedCourses(userId, { final_k: 5 })
        if (response.data.success) {
          recommendedCourses.value = response.data.data
        }
      } catch (error) {
        console.error('加载推荐课程失败:', error)
      } finally {
        loadingRecommendations.value = false
      }
    }

    // 报名课程
    const enrollCourse = async () => {
      try {
        enrolling.value = true
        const courseId = route.params.id
        const response = await apiService.enrollCourse(courseId, 1) // 假设用户ID为1
        if (response.data.success) {
          // 重新加载课程信息获取用户进度
          await loadCourseDetail()
        }
      } catch (error) {
        console.error('报名失败:', error)
        alert('报名失败，请稍后重试')
      } finally {
        enrolling.value = false
      }
    }

    // 继续学习
    const continueLearning = () => {
      // 这里应该跳转到学习页面
      alert('继续学习功能开发中...')
    }

    // 切换收藏状态
    const toggleFavorite = () => {
      isFavorited.value = !isFavorited.value
      // 这里应该调用收藏API
      alert(isFavorited.value ? '已收藏' : '已取消收藏')
    }

    // 打开材料
    const openMaterial = (material) => {
      // 始终打开材料详情弹窗，链接可在弹窗内点击访问
      selectedMaterialId.value = material.id
      selectedMaterial.value = material
      showMaterialDetail.value = true
    }

    // 关闭材料详情模态框
    const closeMaterialDetail = () => {
      showMaterialDetail.value = false
      selectedMaterialId.value = null
  selectedMaterial.value = null
    }

    // —— 内联编辑/删除（仅管理员可见） ——
    const showEditModal = ref(false)
    const submittingEdit = ref(false)
    const editingMaterial = ref(null)
    const selectedFile = ref(null)
    const fileInput = ref(null)

    const materialForm = reactive({
      title: '',
      type: 'file',
      url: '',
      content: ''
    })

    const startEditMaterial = (material) => {
      editingMaterial.value = material
      materialForm.title = material.title || ''
      materialForm.type = material.type || 'file'
      materialForm.url = material.url || ''
      materialForm.content = material.content || ''
      selectedFile.value = null
      if (fileInput.value) fileInput.value.value = ''
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
      editingMaterial.value = null
      selectedFile.value = null
      if (fileInput.value) fileInput.value.value = ''
      materialForm.title = ''
      materialForm.type = 'file'
      materialForm.url = ''
      materialForm.content = ''
    }

    const handleFileChange = (e) => {
      const f = e.target.files?.[0]
      selectedFile.value = f || null
    }

    const clearTypeSpecificFields = () => {
      materialForm.url = ''
      materialForm.content = ''
      selectedFile.value = null
      if (fileInput.value) fileInput.value.value = ''
    }

    const submitEditMaterial = async () => {
      try {
        if (!editingMaterial.value) return
        submittingEdit.value = true

        // 简单校验
        if (materialForm.type === 'link' && !materialForm.url) {
          alert('链接类型必须填写URL')
          submittingEdit.value = false
          return
        }
        if (materialForm.type === 'text' && !materialForm.content) {
          alert('文档类型必须填写内容')
          submittingEdit.value = false
          return
        }

        const resp = await apiService.updateCourseMaterial(
          courseId.value,
          editingMaterial.value.id,
          {
            title: materialForm.title,
            type: materialForm.type,
            url: materialForm.url,
            content: materialForm.content
          },
          selectedFile.value
        )

        if (resp.data?.success) {
          alert('材料更新成功!')
          closeEditModal()
          await loadCourseMaterials(courseId.value)
        } else {
          alert(resp.data?.message || '更新失败')
        }
      } catch (err) {
        console.error('更新材料失败:', err)
        alert('更新失败，请稍后重试')
      } finally {
        submittingEdit.value = false
      }
    }

    const confirmDeleteMaterial = async (material) => {
      if (!isAdmin.value) return
      if (!confirm(`确定要删除材料"${material.title}"吗？此操作不可撤销。`)) return
      try {
        const resp = await apiService.deleteCourseMaterial(courseId.value, material.id)
        if (resp.data?.success) {
          alert('删除成功!')
          await loadCourseMaterials(courseId.value)
        } else {
          alert(resp.data?.message || '删除失败')
        }
      } catch (err) {
        console.error('删除材料失败:', err)
        alert('删除失败，请稍后重试')
      }
    }

    // 跳转到课程
    const goToCourse = (courseId) => {
      router.push(`/courses/${courseId}`)
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    // 工具函数
    const getSkillLevelClass = (level) => {
      const levelMap = {
        '初窥门径': 'beginner',
        '登堂入室': 'intermediate', 
        '融会贯通': 'advanced',
        '炉火纯青': 'expert'
      }
      return levelMap[level] || 'beginner'
    }

    const getStatusText = (status) => {
      const statusMap = {
  'registered': '已报名',
        'not_started': '未开始',
        'in_progress': '学习中',
        'completed': '已完成',
        'dropped': '已放弃'
      }
      return statusMap[status] || '未知'
    }

    const getMaterialTypeText = (type) => {
      const typeMap = {
        'file': '文件',
        'link': '链接',
        'text': '文档'
      }
      return typeMap[type] || '未知'
    }

    const formatFileSize = (bytes) => {
      const sizes = ['B', 'KB', 'MB', 'GB']
      if (bytes === 0) return '0 B'
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }

    // 生命周期
    onMounted(() => {
      loadCourseDetail()
    })

    return {
  appConfig,
      loading,
      course,
      userProgress,
      materials,
      recommendedCourses,
      completionCount,
      enrolling,
      isFavorited,
      loadingMaterials,
      loadingRecommendations,
      activeTab,
      tabs,
  isAdmin,
  courseId,
      showMaterialDetail,
      selectedMaterialId,
  showEditModal,
  submittingEdit,
  materialForm,
  fileInput,
  handleFileChange,
  clearTypeSpecificFields,
  submitEditMaterial,
  startEditMaterial,
  confirmDeleteMaterial,
      enrollCourse,
      continueLearning,
      toggleFavorite,
      openMaterial,
      closeMaterialDetail,
  selectedMaterial,
  closeEditModal,
      goToCourse,
      goBack,
      getSkillLevelClass,
      getStatusText,
      getMaterialTypeText,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.course-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24px;
}

.loading-container {
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

.course-detail {
  max-width: 1200px;
  margin: 0 auto;
}

/* 课程头部 */
.course-header {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.course-hero {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}

.course-cover {
  width: 300px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.course-instructor {
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.course-description {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.course-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  color: #6c757d;
  font-weight: 500;
}

.meta-value {
  font-weight: 600;
  color: #2c3e50;
}

.meta-value.category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.meta-value.rating {
  color: #ffc107;
}

/* 技能要求 */
.required-skills {
  margin-top: 24px;
}

.required-skills h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e9ecef;
}

.skill-name {
  font-weight: 500;
  color: #2c3e50;
}

.skill-level {
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
}

.skill-level.beginner {
  background: #e8f5e8;
  color: #28a745;
}

.skill-level.intermediate {
  background: #fff3cd;
  color: #856404;
}

.skill-level.advanced {
  background: #f8d7da;
  color: #721c24;
}

.skill-level.expert {
  background: #d1ecf1;
  color: #0c5460;
}

/* 操作按钮 */
.course-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.action-btn {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.action-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn.secondary:hover {
  background: #667eea;
  color: white;
}

/* 进度条 */
.progress-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.6s ease;
}

.progress-status {
  text-align: right;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.not_started {
  background: #e9ecef;
  color: #6c757d;
}

.status-badge.in_progress {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.dropped {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.registered {
  background: #e7f1ff;
  color: #0d6efd;
}

/* 内容区域 */
.course-content {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.content-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  border-bottom: 2px solid #667eea;
}

.tab-btn:hover:not(.active) {
  background: #e9ecef;
  color: #495057;
}

/* 材料列表 */
.materials-section,
.recommendations-section {
  padding: 32px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.material-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
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

.material-info {
  flex: 1;
}

.material-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.material-description {
  color: #6c757d;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.material-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #6c757d;
}

.material-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.material-btn.primary {
  background: #667eea;
  color: white;
}

.material-btn.primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.material-btn.secondary {
  background: #e9ecef;
  color: #495057;
  margin-right: 8px;
}

.material-btn.secondary:hover {
  background: #dee2e6;
}

.material-btn.danger {
  background: #e55353;
  color: #fff;
  margin-right: 8px;
}

.material-btn.danger:hover {
  background: #cc4949;
}

/* 简易模态框样式（与页面风格统一） */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  width: 640px;
  max-width: 92vw;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="file"],
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.type-selector {
  display: flex;
  gap: 16px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* 推荐课程 */
.recommendations-list {
  display: grid;
  gap: 24px;
}

.recommendation-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
}

.rec-cover {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rec-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rec-info {
  flex: 1;
}

.rec-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.rec-instructor {
  color: #667eea;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
}

.rec-description {
  color: #6c757d;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.rec-rationale {
  background: #fff3cd;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.rationale-text {
  font-size: 0.9rem;
  color: #856404;
  margin: 0;
  line-height: 1.4;
}

.rec-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.rec-category {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.rec-score {
  color: #28a745;
  font-weight: 600;
  font-size: 0.9rem;
}

.rec-actions {
  display: flex;
  align-items: center;
}

.rec-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rec-btn.primary {
  background: #667eea;
  color: white;
}

.rec-btn.primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.error-state h2 {
  color: #2c3e50;
  margin-bottom: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .course-detail-page {
    padding: 16px;
  }

  .course-header {
    padding: 24px;
  }

  .course-hero {
    flex-direction: column;
    gap: 24px;
  }

  .course-cover {
    width: 100%;
    height: 200px;
  }

  .course-title {
    font-size: 2rem;
  }

  .course-meta {
    grid-template-columns: 1fr;
  }

  .course-actions {
    flex-direction: column;
  }

  .materials-section,
  .recommendations-section {
    padding: 20px;
  }

  .material-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .recommendation-item {
    flex-direction: column;
  }

  .rec-cover {
    width: 100%;
    height: 120px;
  }
}
</style>
