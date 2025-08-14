<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">我的课程</h1>
        <div class="header-actions">
          <button @click="browseCourses" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,7A5,5 0 0,1 20,12A5,5 0 0,1 15,17A5,5 0 0,1 10,12A5,5 0 0,1 15,7M15,9A3,3 0 0,0 12,12A3,3 0 0,0 15,15A3,3 0 0,0 18,12A3,3 0 0,0 15,9Z"/>
            </svg>
            浏览课程
          </button>
          <button v-if="isAdmin" @click="manageCourses" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            创建课程
          </button>
        </div>
      </div>
      <div class="header-subtitle">持续学习，持续成长</div>
    </div>

    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-number">{{ filteredCourses.length }}</div>
        <div class="stat-label">{{ debouncedSearchQuery ? '搜索结果' : '总课程数' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ learningCount }}</div>
        <div class="stat-label">学习中</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ completedCount }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索课程标题、讲师或描述..."
          class="search-input"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="clear-btn"
          title="清除搜索"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="filter-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部课程
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'learning' }"
        @click="activeTab = 'learning'"
      >
        学习中
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'completed' }"
        @click="activeTab = 'completed'"
      >
        已完成
      </button>
    </div>

    <div class="courses-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载课程数据...</p>
      </div>
      
      <!-- 没有搜索结果时显示 -->
      <div v-else-if="!loading && filteredCourses.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
        </div>
        <h3 class="empty-title">
          {{ debouncedSearchQuery ? '未找到相关课程' : '暂无课程' }}
        </h3>
        <p class="empty-description">
          {{ debouncedSearchQuery ? 
            `没有找到包含"${debouncedSearchQuery}"的课程，试试其他关键词吧` : 
            '当前没有符合条件的课程' 
          }}
        </p>
        <button v-if="debouncedSearchQuery" @click="clearSearch" class="empty-action">
          清除搜索条件
        </button>
      </div>

      <!-- 课程列表 -->
      <div v-else-if="!loading" class="course-card" v-for="course in filteredCourses" :key="course.id">
        <div class="course-image">
          <img v-if="course.coverImage" :src="course.coverImage" :alt="course.title" class="course-cover" />
        </div>
        
        <div class="course-content">
          <div class="course-header">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-tags">
              <div class="course-category">{{ course.category }}</div>
              <div class="course-level" :class="course.level">{{ getLevelText(course.level) }}</div>
            </div>
          </div>
          <p class="course-instructor">讲师：{{ course.instructor }}</p>
          <p class="course-description">{{ course.description }}</p>
          
          <div class="course-progress">
            <div class="progress-header">
              <span>学习进度</span>
              <span>{{ course.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
            </div>
          </div>

          <div class="course-stats">
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
              </svg>
              {{ course.duration }}
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
              </svg>
              {{ course.lessons }}节课
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
              </svg>
              {{ course.students }}人学习
            </div>
          </div>

          <div class="course-footer">
            <div class="course-date">{{ getStatusText(course) }}</div>
            <div class="course-actions">
              <button class="action-btn primary" @click="continueLearning(course.id)">
                {{ course.status === 'completed' ? '复习课程' : '继续学习' }}
              </button>
              <button class="action-btn" @click="viewNotes(course.id)">查看笔记</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-actions">
      <button class="fab" @click="browseCourses" title="浏览更多课程">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, watch, onMounted } from 'vue'
import { useGlobalStore } from '@/stores/global'
import apiService from '@/services/api.js'

export default {
  name: 'MyCourses',
  setup() {
    const router = useRouter()
  const globalStore = useGlobalStore()
    const activeTab = ref('all')
    const searchQuery = ref('')
    const debouncedSearchQuery = ref('')
    const loading = ref(true)
    const courses = ref([])

    // 防抖搜索
    let searchTimeout = null
    watch(searchQuery, (newValue) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        debouncedSearchQuery.value = newValue
      }, 300)
    })
    
    // 移除视图层默认课程，改为完全依赖后端/服务层返回
    const initializeDefaultCourses = () => {
      courses.value = []
    }

    // 从API加载课程数据
    const loadCourses = async () => {
      try {
        loading.value = true
        // 读取“我的课程”（只包含用户报名/有关联的课程）
        const response = await apiService.getMyCourses()
        if (response.data.success) {
          const list = Array.isArray(response.data.data) ? response.data.data : []
          // 统一映射：兼容 DashboardCourseCard 与 UserCourseResponse
          const statusMap = {
            registered: 'learning',
            not_started: 'learning',
            in_progress: 'learning',
            completed: 'completed',
            dropped: 'learning'
          }

          const toPercent = (p) => {
            if (p == null || isNaN(p)) return 0
            return p <= 1 ? Math.round(p * 100) : Math.round(p)
          }

          courses.value = list.map(item => {
            // 形态A：UserCourseResponse
            if (item && (item.course || item.course_id)) {
              const c = item.course || {}
              return {
                id: c.id ?? item.course_id,
                title: c.title || '未命名课程',
                instructor: c.instructor || '未知',
                description: c.description || '',
                category: c.category || '其他',
                level: 'intermediate',
                progress: toPercent(item.progress || 0),
                duration: c.duration ? `${c.duration}小时` : '未知',
                lessons: c.total_lessons || 0,
                students: c.enrolled_count || 0,
                status: statusMap[item.status] || 'learning',
                lastUpdate: item.last_accessed ? new Date(item.last_accessed).toLocaleDateString() : (c.updated_at ? new Date(c.updated_at).toLocaleDateString() : '未知'),
                completedDate: item.status === 'completed' ? (item.last_accessed ? new Date(item.last_accessed).toLocaleDateString() : '') : undefined,
                coverImage: c.cover_image_url
              }
            }

            // 形态B：DashboardCourseCard（直接平铺字段）
            const c = item || {}
            const status = c.status && statusMap[c.status] ? statusMap[c.status] : (['learning','completed'].includes(c.status) ? c.status : 'learning')
            return {
              id: c.id,
              title: c.title || '未命名课程',
              instructor: c.instructor || '未知',
              description: c.description || '',
              category: c.category || '其他',
              level: 'intermediate',
              progress: toPercent(c.progress || 0),
              duration: c.duration ? `${c.duration}小时` : '未知',
              lessons: c.total_lessons || c.lessons || 0,
              students: c.enrolled_count || c.students || 0,
              status,
              lastUpdate: c.updated_at ? new Date(c.updated_at).toLocaleDateString() : '未知',
              completedDate: status === 'completed' ? (c.updated_at ? new Date(c.updated_at).toLocaleDateString() : '') : undefined,
              coverImage: c.cover_image_url || c.coverImage
            }
          })
        } else {
          // API失败则展示空状态
          initializeDefaultCourses()
        }
      } catch (error) {
  console.error('加载课程失败:', error)
  // API失败则展示空状态
  initializeDefaultCourses()
      } finally {
        loading.value = false
      }
    }

    const filteredCourses = computed(() => {
      let filtered = courses.value
      
      // 按标签过滤
      if (activeTab.value !== 'all') {
        filtered = filtered.filter(course => course.status === activeTab.value)
      }
      
      // 按搜索关键词过滤
      if (debouncedSearchQuery.value.trim()) {
        const query = debouncedSearchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
        )
      }
      
      return filtered
    })

    // 统计数据
    const learningCount = computed(() => {
      return filteredCourses.value.filter(course => course.status === 'learning').length
    })

    const completedCount = computed(() => {
      return filteredCourses.value.filter(course => course.status === 'completed').length
    })

    const getLevelText = (level) => {
      const levelMap = {
        beginner: '初级',
        intermediate: '中级',
        advanced: '高级'
      }
      return levelMap[level] || '初级'
    }

    const getStatusText = (course) => {
      if (course.status === 'completed') {
        return `完成于 ${course.completedDate}`
      } else {
        return `最后学习：${course.lastUpdate}`
      }
    }

    const continueLearning = (courseId) => {
      // 跳转到课程详情页面
      router.push(`/courses/${courseId}`)
    }

    const viewNotes = (courseId) => {
      // 跳转到课程笔记页面，传递课程ID参数
      router.push({ name: 'CourseNotes', query: { courseId } })
    }

    const browseCourses = () => {
      // 跳转到课程浏览页面
      router.push('/courses')
    }

    const manageCourses = () => {
      // 跳转到课程管理页面
      router.push('/admin/courses')
    }

    // 检查是否是管理员（兼容 localStorage 与 store，并容忍多种字段）
    const isAdmin = computed(() => {
      const lsRole = (localStorage.getItem('userRole') || '').toLowerCase()
      const u = globalStore?.user || {}
      const storeRole = (u.role || '').toLowerCase()
      const roles = Array.isArray(u.roles) ? u.roles.map(r => String(r).toLowerCase()) : []
      const perms = Array.isArray(u.permissions) ? u.permissions.map(p => String(p).toLowerCase()) : []
      const flags = [lsRole, storeRole, ...roles, ...perms]
      return u.is_admin === true || flags.includes('admin')
    })

    const clearSearch = () => {
      searchQuery.value = ''
      debouncedSearchQuery.value = ''
    }

    // 组件挂载时加载数据
    onMounted(() => {
      loadCourses()
    })

    return {
      activeTab,
      searchQuery,
      debouncedSearchQuery,
      loading,
      courses,
      filteredCourses,
      learningCount,
      completedCount,
      isAdmin,
      getLevelText,
      getStatusText,
      continueLearning,
      viewNotes,
      browseCourses,
      manageCourses,
      clearSearch
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
  margin-bottom: 32px;
  background: white;
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 120px;
  position: relative;
}

.title-section {
  max-width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-primary, .btn-secondary {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #e1e5e9;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #d1d9e0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #2c3e50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.01em;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.page-title::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  opacity: 0.8;
}

.page-title:hover {
  transform: translateY(-1px);
  text-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
}

.header-subtitle {
  position: absolute;
  bottom: 20px;
  right: 32px;
  font-size: 0.9rem;
  color: #6c757d;
  opacity: 0.6;
  font-weight: 300;
  letter-spacing: 0.02em;
  font-style: italic;
  backdrop-filter: blur(2px);
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

.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2px;
}

.stat-label {
  color: #6c757d;
  font-size: 13px;
}

/* 搜索框样式 */
.search-container {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.search-icon {
  color: #6c757d;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.search-box:focus-within .search-icon {
  color: #667eea;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #2c3e50;
  background: transparent;
  font-weight: 400;
}

.search-input::placeholder {
  color: #adb5bd;
  font-weight: 300;
}

.clear-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: white;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #6c757d;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
}

.tab-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #667eea;
}

.courses-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 加载状态样式 */
.loading-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e9ecef;
  text-align: center;
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

/* 空状态样式 */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e9ecef;
  text-align: center;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: #667eea;
  background: #fafbfc;
}

.empty-icon {
  color: #adb5bd;
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
}

.empty-description {
  color: #6c757d;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 24px 0;
  max-width: 400px;
}

.empty-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.course-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.course-card:hover {
  border-color: #f093fb;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(240, 147, 251, 0.15);
}

.course-image {
  width: 220px;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.course-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-cover {
  transform: scale(1.05);
}

.course-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.course-level {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-level.beginner {
  background: #e8f5e8;
  color: #28a745;
}

.course-level.intermediate {
  background: #fff3cd;
  color: #856404;
}

.course-level.advanced {
  background: #f8d7da;
  color: #721c24;
}

.course-content {
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 20px;
}

.course-tags {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.course-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.course-instructor {
  color: #667eea;
  font-size: 14px;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.course-description {
  color: #6c757d;
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 15px;
}

.course-progress {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6c757d;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f1f3f4;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.course-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6c757d;
  font-size: 14px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.course-date {
  color: #6c757d;
  font-size: 14px;
}

.course-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  background: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  color: #667eea;
}

.action-btn.primary:hover {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  color: white;
}

.floating-actions {
  position: fixed;
  bottom: 32px;
  right: 32px;
}

.fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.fab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.fab:hover::before {
  left: 100%;
}

.fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .header {
    padding: 20px 24px;
    margin-bottom: 24px;
    min-height: 100px;
  }

  .stats-bar {
    gap: 12px;
  }

  .stat-card {
    padding: 10px 12px;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .stat-label {
    font-size: 12px;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 600;
  }

  .page-title::before {
    width: 50px;
    height: 2px;
  }

  .header-subtitle {
    font-size: 0.8rem;
    bottom: 16px;
    right: 24px;
  }

  .filter-tabs {
    padding: 8px;
    gap: 8px;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .courses-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .course-card {
    flex-direction: column;
  }

  .course-image {
    width: 100%;
    height: 180px;
  }

  .course-content {
    padding: 20px;
  }

  .course-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .course-tags {
    align-self: flex-end;
  }

  .course-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .course-actions {
    width: 100%;
    justify-content: space-between;
  }

  .action-btn {
    flex: 1;
    text-align: center;
  }

  .fab {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 16px 20px;
    min-height: 90px;
  }

  .stats-bar {
    gap: 8px;
  }

  .stat-card {
    padding: 8px 10px;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 11px;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 600;
  }

  .page-title::before {
    width: 40px;
    height: 2px;
  }

  .header-subtitle {
    font-size: 0.75rem;
    bottom: 12px;
    right: 20px;
  }

  .filter-tabs {
    flex-wrap: wrap;
    gap: 6px;
  }

  .tab-btn {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    font-size: 13px;
  }

  .courses-container {
    grid-template-columns: 1fr;
  }
  
  .course-image {
    height: 160px;
  }
  
  .course-content {
    padding: 16px;
  }
  
  .course-title {
    font-size: 1.1rem;
  }
  
  .course-stats {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .stat-item {
    font-size: 13px;
  }
}
</style>
