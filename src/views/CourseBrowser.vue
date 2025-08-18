<template>
  <div class="course-browser">
    <div class="browser-header">
      <div class="header-content">
        <h1>浏览课程</h1>
        <p class="header-subtitle">发现更多优质课程，开启学习之旅</p>
      </div>
      <div class="header-actions">
        <button v-if="isAdmin" @click="navigateToManagement" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A3,3 0 0,1 15,5V7H20.5C21.58,7 22.5,7.92 22.5,9V10C22.5,10.8 22,11.5 21.31,11.82L21.41,12C21.78,12.47 22,13.05 22,13.71C22,14.9 21.16,15.90 20,16.16V17A2,2 0 0,1 18,19H14V17H12V19H8A2,2 0 0,1 6,17V16.16C4.84,15.90 4,14.9 4,13.71C4,13.05 4.22,12.47 4.59,12L4.69,11.82C4,11.5 3.5,10.8 3.5,10V9C3.5,7.92 4.42,7 5.5,7H11V5A3,3 0 0,1 12,2M12,4A1,1 0 0,0 11,5V7H13V5A1,1 0 0,0 12,4Z"/>
          </svg>
          管理课程
        </button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索课程名称、讲师或技能..."
          class="search-input"
        >
      </div>
      
      <div class="filter-section">
        <div class="filter-group">
          <label>难度等级：</label>
          <select v-model="selectedLevel" class="filter-select">
            <option value="">全部</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>课程分类：</label>
          <select v-model="selectedCategory" class="filter-select">
            <option value="">全部分类</option>
            <option value="programming">编程开发</option>
            <option value="design">设计创意</option>
            <option value="business">商业管理</option>
            <option value="language">语言学习</option>
            <option value="science">科学技术</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载课程...</p>
    </div>

    <!-- 课程列表 -->
    <div v-else class="courses-grid">
      <div v-if="filteredCourses.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>暂无匹配的课程</h3>
        <p>尝试调整搜索条件或筛选器</p>
      </div>
      
      <div 
        v-for="course in filteredCourses" 
        :key="course.id" 
        class="course-card"
        @click="viewCourse(course.id)"
      >
        <div class="course-image">
          <img :src="course.thumbnail || '/api/placeholder/300/200'" :alt="course.title">
          <div class="course-level">{{ getLevelText(course.level) }}</div>
        </div>
        
        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-instructor">{{ course.instructor }}</p>
          <p class="course-description">{{ course.description }}</p>
          
          <div class="course-meta">
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
              </svg>
              <span>{{ formatDuration(course) }}</span>
            </div>
            
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
              </svg>
              <span>{{ course.enrolled_count || 0 }}人报名</span>
            </div>
            
            <div class="meta-item" v-if="course.avg_rating && course.avg_rating > 0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
              </svg>
              <span>{{ course.avg_rating.toFixed(1) }}分</span>
            </div>
          </div>
          
          <div class="course-skills">
            <span 
              v-for="skill in course.required_skills?.slice(0, 3) || []" 
              :key="skill.name || skill" 
              class="skill-tag"
            >
              {{ typeof skill === 'object' ? skill.name : skill }}
            </span>
          </div>
        </div>
        
        <div class="course-actions">
          <button 
            @click.stop="enrollCourse(course.id)"
            :disabled="course.enrolled || loading"
            class="enroll-btn"
            :class="{ enrolled: course.enrolled }"
          >
            {{ course.enrolled ? '已报名' : '立即报名' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api.js'

export default {
  name: 'CourseBrowser',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const courses = ref([])
    const searchQuery = ref('')
    const selectedLevel = ref('')
    const selectedCategory = ref('')

    // 检查管理员权限（兼容 localStorage 与 store，并容忍多种字段）
    const isAdmin = computed(() => {
      const lsRole = (localStorage.getItem('userRole') || '').toLowerCase()
      // 运行时按需引入 store，避免循环依赖
      let storeRole = ''
      let roles = []
      let perms = []
      let isAdminFlag = false
      try {
        const { useGlobalStore } = require('@/stores/global')
        const store = useGlobalStore()
        const u = store?.user || {}
        storeRole = (u.role || '').toLowerCase()
        roles = Array.isArray(u.roles) ? u.roles.map(r => String(r).toLowerCase()) : []
        perms = Array.isArray(u.permissions) ? u.permissions.map(p => String(p).toLowerCase()) : []
        isAdminFlag = u.is_admin === true
      } catch (e) {
        // 忽略运行时导入失败
      }
      const flags = [lsRole, storeRole, ...roles, ...perms]
      return isAdminFlag || flags.includes('admin')
    })

    // 筛选课程
    const filteredCourses = computed(() => {
      let filtered = courses.value

      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          (course.required_skills && course.required_skills.some(skill => {
            const skillName = typeof skill === 'object' ? skill.name : skill
            return skillName && skillName.toLowerCase().includes(query)
          }))
        )
      }

      // 难度过滤
      if (selectedLevel.value) {
        filtered = filtered.filter(course => course.level === selectedLevel.value)
      }

      // 分类过滤
      if (selectedCategory.value) {
        filtered = filtered.filter(course => course.category === selectedCategory.value)
      }

      return filtered
    })

    const getLevelText = (level) => {
      const levelMap = {
        'beginner': '初级',
        'intermediate': '中级',
        'advanced': '高级'
      }
      return levelMap[level] || '未知'
    }

    const loadCourses = async () => {
      try {
        loading.value = true
        const response = await apiService.getPublicCourses()
        
        if (response.data.success) {
          const list = Array.isArray(response.data.data) ? response.data.data : []
          // 规范化字段，兼容不同后端返回
          courses.value = list.map(c => ({
            id: c.id ?? c.course_id ?? c.pk ?? c.uuid ?? c._id,
            title: c.title || c.name || '未命名课程',
            instructor: c.instructor || c.teacher || '未知',
            description: c.description || c.desc || '',
            level: c.level || c.difficulty || 'intermediate',
            category: c.category || c.type || '其他',
            duration: c.duration || c.total_hours || c.estimated_hours || 0,
            total_lessons: c.total_lessons || c.lessons_count || 0,
            avg_rating: c.avg_rating || c.rating || 0,
            thumbnail: c.thumbnail || c.cover_image_url || c.cover || c.image,
            required_skills: c.required_skills || c.skills || [],
            enrolled_count: c.enrolled_count || c.students_count || c.enrollments || 0,
            status: c.status || 'active',
            enrolled: Boolean(c.enrolled)
          })).filter(x => x.id)
        } else {
          console.error('加载课程失败:', response.data.message)
        }
      } catch (error) {
        console.error('加载课程出错:', error)
      } finally {
        loading.value = false
      }
    }

    const viewCourse = (courseId) => {
      router.push(`/courses/${courseId}`)
    }

    const enrollCourse = async (courseId) => {
      try {
        // 检查用户是否已登录
        const token = localStorage.getItem('access_token')
        if (!token) {
          alert('请先登录后再报名课程')
          router.push('/login')
          return
        }

        const response = await apiService.enrollCourse(courseId)
        console.log('报名响应:', response)
        
        if (response.data.success) {
          // 更新本地状态
          const course = courses.value.find(c => c.id === courseId)
          if (course) {
            course.enrolled = true
            course.enrolled_count = (course.enrolled_count || 0) + 1
          }
          
          alert('报名成功！')
        } else {
          const errorMsg = response.data.message || '报名失败，请稍后重试'
          console.error('报名失败:', response.data)
          alert('报名失败: ' + errorMsg)
        }
      } catch (error) {
        console.error('报名出错:', error)
        
        // 检查具体的错误类型
        if (error.response) {
          const status = error.response.status
          const data = error.response.data
          
          if (status === 401) {
            alert('登录已过期，请重新登录')
            router.push('/login')
          } else if (status === 404) {
            alert('课程不存在')
          } else if (status === 409) {
            alert('您已经报名了该课程')
            // 更新本地状态
            const course = courses.value.find(c => c.id === courseId)
            if (course) {
              course.enrolled = true
            }
          } else {
            const errorMsg = data?.detail || data?.message || '报名失败，请稍后重试'
            alert('报名失败: ' + errorMsg)
          }
        } else {
          alert('网络错误，请检查网络连接后重试')
        }
      }
    }

    const navigateToManagement = () => {
      router.push('/admin/courses')
    }

    const formatDuration = (course) => {
      // 优先显示课时数，如果没有则显示小时数
      if (course.total_lessons && course.total_lessons > 0) {
        return `${course.total_lessons}课时`
      } else if (course.duration && course.duration > 0) {
        return `${course.duration}小时`
      }
      return '时长待定'
    }

    // 组件挂载时加载课程
    onMounted(() => {
      loadCourses()
    })

    return {
      loading,
      courses,
      searchQuery,
      selectedLevel,
      selectedCategory,
      filteredCourses,
      isAdmin,
      getLevelText,
      formatDuration,
      viewCourse,
      enrollCourse,
      navigateToManagement
    }
  }
}
</script>

<style scoped>
.course-browser {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.browser-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e1e5e9;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-section {
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-section {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d9e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.course-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-level {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.course-instructor {
  color: #667eea;
  font-weight: 500;
  margin: 0 0 12px 0;
  font-size: 14px;
}

.course-description {
  color: #6c757d;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6c757d;
  font-size: 14px;
}

.course-skills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.skill-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #e9ecef;
}

.course-actions {
  padding: 0 20px 20px;
}

.enroll-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.enroll-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3);
}

.enroll-btn.enrolled {
  background: #6c757d;
  cursor: not-allowed;
}

.enroll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-browser {
    padding: 16px;
  }
  
  .browser-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
