<template>
  <div class="course-management">
    <div class="management-header">
      <div class="header-content">
        <h1>课程管理</h1>
        <p class="header-subtitle">管理平台上的所有课程内容</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        创建课程
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.totalCourses }}</div>
          <div class="stat-label">总课程数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon published">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.activeCourses }}</div>
          <div class="stat-label">已发布</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon materials">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.totalMaterials }}</div>
          <div class="stat-label">课程材料</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon students">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
          </svg>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.totalStudents }}</div>
          <div class="stat-label">学习人数</div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H16.5C17.88,14 19,15.12 19,16.5V17.5C19,18.88 17.88,20 16.5,20H7.5C6.12,20 5,18.88 5,17.5V16.5C5,15.12 6.12,14 7.5,14H9.29L9.56,13.73C8.59,12.59 8,11.11 8,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5A4.5,4.5 0 0,0 5,9.5A4.5,4.5 0 0,0 9.5,14A4.5,4.5 0 0,0 14,9.5A4.5,4.5 0 0,0 9.5,5Z"/>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索课程名称、讲师或分类..."
        >
      </div>
      
      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.key"
          class="filter-tab"
          :class="{ active: activeFilter === tab.key }"
          @click="activeFilter = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="courses-table">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载课程数据...</p>
      </div>

      <div v-else-if="filteredCourses.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
        <h3>{{ searchQuery ? '未找到相关课程' : '暂无课程' }}</h3>
        <p>{{ searchQuery ? '尝试调整搜索条件' : '点击"创建课程"开始添加课程内容' }}</p>
      </div>

      <div v-else class="table-container">
        <table class="courses-table-content">
          <thead>
            <tr>
              <th>课程信息</th>
              <th>讲师</th>
              <th>分类</th>
              <th>状态</th>
              <th>评分</th>
              <th>材料数</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in paginatedCourses" :key="course.id" class="course-row">
              <td class="course-info-cell">
                <div class="course-info">
                  <div class="course-cover-small">
                    <img v-if="course.cover_image_url" :src="course.cover_image_url" :alt="course.title">
                    <div v-else class="default-cover-small">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="course-details">
                    <h4 class="course-title-small">{{ course.title }}</h4>
                    <p class="course-description-small">
                      {{ truncateText(course.description, 60) }}
                    </p>
                    <div class="course-meta-small">
                      <span v-if="course.total_lessons">{{ course.total_lessons }}节课</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="instructor-name">{{ course.instructor || '未设置' }}</span>
              </td>
              <td>
                <span v-if="course.category" class="category-tag">{{ course.category }}</span>
                <span v-else class="text-muted">未分类</span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(course)">
                  {{ getStatusText(course) }}
                </span>
              </td>
              <td>
                <div class="rating-display">
                  <span v-if="course.avg_rating" class="rating-value">
                    {{ course.avg_rating.toFixed(1) }}
                  </span>
                  <div v-if="course.avg_rating" class="rating-stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(course.avg_rating) }">★</span>
                  </div>
                  <span v-else class="text-muted">暂无评分</span>
                </div>
              </td>
              <td>
                <span class="material-count">{{ course.materialsCount || 0 }}</span>
              </td>
              <td>
                <span class="update-time">
                  {{ formatDate(course.updated_at) }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click="viewCourse(course)" class="action-btn view" title="查看详情">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                    </svg>
                  </button>
                  <button @click="editCourse(course)" class="action-btn edit" title="编辑课程">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                    </svg>
                  </button>
                  <button @click="manageMaterials(course)" class="action-btn materials" title="管理材料">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </button>
                  <button @click="deleteCourse(course)" class="action-btn delete" title="删除课程">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          上一页
        </button>
        <span class="pagination-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页 ({{ filteredCourses.length }} 条记录)
        </span>
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 创建/编辑课程模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" 
         @mousedown="handleOverlayMouseDown" 
         @mouseup="handleOverlayMouseUp">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? '创建新课程' : '编辑课程' }}</h3>
          <button @click="closeModal" class="modal-close">×</button>
        </div>

        <form @submit.prevent="submitCourse" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>课程标题*</label>
              <input 
                v-model="courseForm.title" 
                type="text" 
                required 
                placeholder="请输入课程标题"
              >
            </div>

            <div class="form-group">
              <label>讲师姓名</label>
              <input 
                v-model="courseForm.instructor" 
                type="text" 
                placeholder="请输入讲师姓名"
              >
            </div>

            <div class="form-group">
              <label>课程分类</label>
              <select v-model="courseForm.category">
                <option value="">选择分类</option>
                <option value="前端开发">前端开发</option>
                <option value="后端开发">后端开发</option>
                <option value="移动开发">移动开发</option>
                <option value="数据科学">数据科学</option>
                <option value="人工智能">人工智能</option>
                <option value="设计">设计</option>
                <option value="产品管理">产品管理</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div class="form-group">
              <label>总课时数</label>
              <input 
                v-model.number="courseForm.total_lessons" 
                type="number" 
                min="1"
                placeholder="请输入课时数"
              >
            </div>

            <div class="form-group">
              <label>课程封面URL</label>
              <input 
                v-model="courseForm.cover_image_url" 
                type="url" 
                placeholder="请输入封面图片URL"
              >
            </div>

            <div class="form-group">
              <label>平均评分</label>
              <input 
                v-model.number="courseForm.avg_rating" 
                type="number" 
                min="0" 
                max="5" 
                step="0.1"
                placeholder="0.0 - 5.0"
              >
            </div>
          </div>

          <div class="form-group full-width">
            <label>课程描述</label>
            <textarea 
              v-model="courseForm.description" 
              rows="4"
              placeholder="请输入课程描述"
            ></textarea>
          </div>

          <!-- 技能要求 -->
          <div class="form-group full-width">
            <label>技能要求</label>
            <div class="skills-input">
              <div v-for="(skill, index) in courseForm.required_skills" :key="index" class="skill-input-row">
                <input 
                  v-model="skill.name" 
                  type="text" 
                  placeholder="技能名称"
                  class="skill-name-input"
                >
                <select v-model="skill.level" class="skill-level-select">
                  <option value="初窥门径">初窥门径</option>
                  <option value="登堂入室">登堂入室</option>
                  <option value="融会贯通">融会贯通</option>
                  <option value="炉火纯青">炉火纯青</option>
                </select>
                <button type="button" @click="removeSkill(index)" class="remove-skill-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                </button>
              </div>
              <button type="button" @click="addSkill" class="add-skill-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
                添加技能
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              取消
            </button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api.js'

export default {
  name: 'CourseManagement',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(true)
    const courses = ref([])
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const currentPage = ref(1)
    const pageSize = 10
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const submitting = ref(false)
    const editingCourse = ref(null)

    // 统计数据
    const stats = reactive({
      totalCourses: 0,
      activeCourses: 0,
      totalMaterials: 0,
      totalStudents: 0
    })

    // 筛选选项卡
    const filterTabs = [
      { key: 'all', label: '全部课程' },
      { key: 'active', label: '已发布' },
      { key: 'draft', label: '草稿' }
    ]

    // 课程表单
    const courseForm = reactive({
      title: '',
      description: '',
      instructor: '',
      category: '',
      total_lessons: null,
      avg_rating: null,
      cover_image_url: '',
      required_skills: []
    })

    // 计算属性
    const filteredCourses = computed(() => {
      let filtered = courses.value

      // 按搜索词过滤
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(course => 
          course.title?.toLowerCase().includes(query) ||
          course.instructor?.toLowerCase().includes(query) ||
          course.category?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
        )
      }

      // 按状态过滤
      if (activeFilter.value !== 'all') {
        // 这里需要根据实际的状态字段调整
        // 暂时使用模拟逻辑
        if (activeFilter.value === 'active') {
          filtered = filtered.filter(course => course.id) // 所有有ID的都算已发布
        }
      }

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredCourses.value.length / pageSize)
    })

    const paginatedCourses = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return filteredCourses.value.slice(start, end)
    })

    // 方法
    const loadCourses = async () => {
      try {
        loading.value = true
        const response = await apiService.getCourses()
        if (response.data.success) {
          courses.value = response.data.data
          updateStats()
        }
      } catch (error) {
        console.error('加载课程失败:', error)
      } finally {
        loading.value = false
      }
    }

    const updateStats = () => {
      stats.totalCourses = courses.value.length
      stats.activeCourses = courses.value.filter(c => c.id).length // 简化逻辑
      stats.totalMaterials = 0 // 需要从API获取
      stats.totalStudents = 0 // 需要从API获取
    }

    const viewCourse = (course) => {
      router.push(`/courses/${course.id}`)
    }

    const editCourse = (course) => {
      editingCourse.value = course
      Object.keys(courseForm).forEach(key => {
        if (key === 'required_skills') {
          courseForm[key] = course[key] ? [...course[key]] : []
        } else {
          courseForm[key] = course[key] || (key === 'required_skills' ? [] : '')
        }
      })
      showEditModal.value = true
    }

    const manageMaterials = (course) => {
      // 跳转到材料管理页面
      router.push(`/admin/courses/${course.id}/materials`)
    }

    const deleteCourse = async (course) => {
      if (!confirm(`确定要删除课程"${course.title}"吗？此操作不可撤销。`)) {
        return
      }

      try {
        // 这里需要实现删除API
        alert('删除功能需要后端API支持')
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请稍后重试')
      }
    }

    const submitCourse = async () => {
      try {
        submitting.value = true
        let response

        const courseData = {
          title: courseForm.title,
          description: courseForm.description,
          instructor: courseForm.instructor,
          category: courseForm.category,
          total_lessons: courseForm.total_lessons,
          avg_rating: courseForm.avg_rating,
          cover_image_url: courseForm.cover_image_url,
          required_skills: courseForm.required_skills.filter(skill => skill.name),
          // 默认将课程设置为可见/启用（若后端接受这些字段）
          is_published: true,
          status: 'active'
        }

        if (showEditModal.value) {
          response = await apiService.updateCourse(editingCourse.value.id, courseData)
        } else {
          response = await apiService.createCourse(courseData)
        }

        if (response.data.success) {
          alert(showEditModal.value ? '课程更新成功!' : '课程创建成功!')
          closeModal()
          loadCourses()
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

    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      editingCourse.value = null
      
      // 重置表单
      Object.keys(courseForm).forEach(key => {
        courseForm[key] = key === 'required_skills' ? [] : ''
      })
    }

    // 处理模态框覆盖层的鼠标事件，防止文字选择时意外关闭
    let overlayMouseDownTarget = null
    
    const handleOverlayMouseDown = (event) => {
      // 记录鼠标按下时的目标元素
      overlayMouseDownTarget = event.target
    }
    
    const handleOverlayMouseUp = (event) => {
      // 只有当鼠标按下和抬起都在覆盖层上时，才关闭模态框
      // 这避免了文字选择时意外关闭模态框
      if (overlayMouseDownTarget === event.target && event.target.classList.contains('modal-overlay')) {
        closeModal()
      }
      overlayMouseDownTarget = null
    }

    const addSkill = () => {
      courseForm.required_skills.push({ name: '', level: '初窥门径' })
    }

    const removeSkill = (index) => {
      courseForm.required_skills.splice(index, 1)
    }

    // 工具函数
    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    const getStatusClass = (course) => {
      return 'active' // 简化逻辑，实际应根据课程状态
    }

    const getStatusText = (course) => {
      return '已发布' // 简化逻辑
    }

    const formatDate = (dateString) => {
      if (!dateString) return '未知'
      try {
        return new Date(dateString).toLocaleDateString('zh-CN')
      } catch {
        return '无效日期'
      }
    }

    // 监听搜索和筛选变化，重置页码
    watch([searchQuery, activeFilter], () => {
      currentPage.value = 1
    })

    // 生命周期
    onMounted(() => {
      loadCourses()
    })

    return {
      loading,
      courses,
      searchQuery,
      activeFilter,
      currentPage,
      showCreateModal,
      showEditModal,
      submitting,
      stats,
      filterTabs,
      courseForm,
      filteredCourses,
      totalPages,
      paginatedCourses,
      viewCourse,
      editCourse,
      manageMaterials,
      deleteCourse,
      submitCourse,
      closeModal,
      handleOverlayMouseDown,
      handleOverlayMouseUp,
      addSkill,
      removeSkill,
      truncateText,
      getStatusClass,
      getStatusText,
      formatDate
    }
  }
}
</script>

<style scoped>
.course-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.header-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.published {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.stat-icon.materials {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
}

.stat-icon.students {
  background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

/* 搜索和筛选 */
.filters-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-tab.active {
  background: #667eea;
  color: white;
}

.filter-tab:hover:not(.active) {
  background: #e9ecef;
}

/* 表格样式 */
.courses-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.table-container {
  overflow-x: auto;
}

.courses-table-content {
  width: 100%;
  border-collapse: collapse;
}

.courses-table-content th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
}

.course-row {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.course-row:hover {
  background: #f8f9fa;
}

.courses-table-content td {
  padding: 16px 12px;
  vertical-align: middle;
}

.course-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.course-cover-small {
  width: 60px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e9ecef;
}

.course-cover-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-cover-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.course-details {
  flex: 1;
  min-width: 0;
}

.course-title-small {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.course-description-small {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.course-meta-small {
  font-size: 0.8rem;
  color: #6c757d;
}

.instructor-name {
  color: #667eea;
  font-weight: 500;
}

.category-tag {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.text-muted {
  color: #6c757d;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.rating-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-value {
  font-weight: 600;
  color: #ffc107;
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.star {
  color: #e9ecef;
  font-size: 0.8rem;
}

.star.filled {
  color: #ffc107;
}

.material-count {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.update-time {
  color: #6c757d;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn.view {
  background: #e3f2fd;
  color: #1976d2;
}

.action-btn.view:hover {
  background: #1976d2;
  color: white;
}

.action-btn.edit {
  background: #fff3e0;
  color: #f57c00;
}

.action-btn.edit:hover {
  background: #f57c00;
  color: white;
}

.action-btn.materials {
  background: #f3e5f5;
  color: #7b1fa2;
}

.action-btn.materials:hover {
  background: #7b1fa2;
  color: white;
}

.action-btn.delete {
  background: #ffebee;
  color: #d32f2f;
}

.action-btn.delete:hover {
  background: #d32f2f;
  color: white;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #6c757d;
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

.modal-content.large {
  max-width: 800px;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 技能输入 */
.skills-input {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
}

.skill-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}

.skill-name-input {
  flex: 2;
  margin: 0;
}

.skill-level-select {
  flex: 1;
  margin: 0;
}

.remove-skill-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.remove-skill-btn:hover {
  background: #c82333;
}

.add-skill-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.add-skill-btn:hover {
  background: #218838;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #f8f9fa;
  color: #495057;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .course-management {
    padding: 16px;
  }

  .management-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .courses-table-content {
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .skill-input-row {
    flex-direction: column;
    align-items: stretch;
  }

  .skill-name-input,
  .skill-level-select {
    flex: none;
  }
}
</style>
