<template>
  <div class="all-projects-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="page-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2M2 17L12 22L22 17M2 12L12 17L22 12"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">全部项目</h1>
            <p class="page-description">浏览平台上的所有项目，发现感兴趣的协作机会</p>
          </div>
        </div>
        <div class="header-right">
          <button class="create-btn" @click="openCreateForm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            创建项目
          </button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, index) in statsData" :key="index" :class="stat.type">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path :d="stat.icon"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filters-section">
      <div class="search-wrapper">
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20l1-1-4.5-4.5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索项目名称、描述、关键词..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="filter-tabs">
        <button 
          v-for="filter in filters" 
          :key="filter.key"
          class="filter-tab"
          :class="{ active: activeFilter === filter.key }"
          @click="setActiveFilter(filter.key)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path :d="filter.icon"/>
          </svg>
          {{ filter.label }}
          <span class="filter-count">{{ getFilterCount(filter.key) }}</span>
        </button>
      </div>
      
      <div class="sort-dropdown">
        <select v-model="sortBy" class="sort-select">
          <option value="created_at">最新创建</option>
          <option value="updated_at">最近更新</option>
          <option value="views_count">浏览量</option>
          <option value="applications_count">申请数</option>
          <option value="title">项目名称</option>
        </select>
      </div>
    </div>

    <!-- 创建/编辑弹窗 -->
    <ProjectForm
      v-if="showForm"
      :project="editingProject"
      @cancel="closeForm"
      @success="onFormSuccess"
    />

    <!-- 项目列表 -->
    <div class="projects-section">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载项目...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17"/>
            <path d="M2 12L12 17L22 12"/>
          </svg>
        </div>
        <h3 class="empty-title">{{ getEmptyStateTitle() }}</h3>
        <p class="empty-description">{{ getEmptyStateDescription() }}</p>
        <div class="empty-actions">
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="secondary-btn">
            清除筛选条件
          </button>
          <button @click="openCreateForm" class="primary-btn">
            创建新项目
          </button>
        </div>
      </div>

      <div v-else class="projects-grid">
        <transition-group name="project" tag="div" class="projects-list">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
            :class="getProjectStatusClass(project.project_status)"
            @click="viewProject(project)"
          >
            <!-- 项目头部 -->
            <div class="project-header">
              <div class="project-meta">
                <span class="project-status" :class="project.project_status">
                  {{ getStatusText(project.project_status) }}
                </span>
                <span v-if="project.project_type" class="project-type">
                  {{ project.project_type }}
                </span>
              </div>
              <div class="project-actions">
                <button 
                  v-if="isMyProject(project)"
                  class="action-btn edit" 
                  @click.stop="openEditForm(project)"
                  title="编辑项目"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                  </svg>
                </button>
                <button 
                  v-if="canApplyToProject(project)"
                  class="action-btn apply" 
                  @click.stop="quickApply(project)"
                  title="快速申请"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 项目内容 -->
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description" v-if="project.description">
                {{ project.description }}
              </p>
              
              <!-- 项目详情信息 -->
              <div class="project-details">
                <div class="detail-row" v-if="project.creator_name">
                  <span class="detail-label">创建者</span>
                  <span class="detail-value creator">{{ project.creator_name }}</span>
                </div>
                <div class="detail-row" v-if="project.team_size_preference">
                  <span class="detail-label">团队规模</span>
                  <span class="detail-value">{{ project.team_size_preference }}</span>
                </div>
                <div class="detail-row" v-if="project.location">
                  <span class="detail-label">地点</span>
                  <span class="detail-value">{{ project.location }}</span>
                </div>
                <div class="detail-row" v-if="project.estimated_weekly_hours">
                  <span class="detail-label">每周工时</span>
                  <span class="detail-value">{{ project.estimated_weekly_hours }}小时</span>
                </div>
              </div>

              <!-- 所需技能 -->
              <div class="skills-section" v-if="project.required_skills && project.required_skills.length > 0">
                <h4>所需技能</h4>
                <div class="skills-list">
                  <span 
                    v-for="skill in project.required_skills.slice(0, 4)" 
                    :key="skill.name"
                    class="skill-tag"
                    :class="getSkillLevelClass(skill.level)"
                  >
                    {{ skill.name }} · {{ skill.level }}
                  </span>
                  <span v-if="project.required_skills.length > 4" class="skill-more">
                    +{{ project.required_skills.length - 4 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 项目底部统计 -->
            <div class="project-footer">
              <div class="footer-stats">
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {{ project.views_count || 0 }}
                </div>
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  {{ project.applications_count || 0 }}
                </div>
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2 .89 2 2 2v2c-1.11 0-2 .89-2 2s.89 2 2 2v2c-1.11 0-2 .89-2 2s-.89 2-2 2-2-.89-2-2-.89-2-2-2V4zm-4 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-6 6c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
                  </svg>
                  {{ project.members_count || 0 }}
                </div>
              </div>
              <div class="footer-time">
                {{ formatTime(project.created_at) }}
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ApiService } from '@/services/api.js'
import ProjectForm from '@/components/ProjectForm.vue'

export default {
  name: 'AllProjects',
  components: { ProjectForm },
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const sortBy = ref('created_at')
    const loading = ref(false)
    
    // 列表与表单状态
    const projects = ref([])
    const showForm = ref(false)
    const editingProject = ref(null)

    // 当前用户ID（应该从认证状态获取）
    const currentUserId = ref(localStorage.getItem('userId') || '1')

    // 筛选配置
    const filters = ref([
      { 
        key: 'all', 
        label: '全部项目', 
        icon: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z' 
      },
      { 
        key: '招募中', 
        label: '招募中', 
        icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L10.5,8.5L12,10L17.5,4.5L21,8L12,17Z' 
      },
      { 
        key: '进行中', 
        label: '进行中', 
        icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z' 
      },
      { 
        key: '已完成', 
        label: '已完成', 
        icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z' 
      }
    ])

    // 计算统计数据
    const statsData = computed(() => [
      {
        type: 'total',
        icon: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
        value: projects.value.length,
        label: '总项目数'
      },
      {
        type: 'recruiting',
        icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L10.5,8.5L12,10L17.5,4.5L21,8L12,17Z',
        value: projects.value.filter(p => p.project_status === '招募中').length,
        label: '招募中'
      },
      {
        type: 'active',
        icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z',
        value: projects.value.filter(p => p.project_status === '进行中').length,
        label: '进行中'
      },
      {
        type: 'completed',
        icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z',
        value: projects.value.filter(p => p.project_status === '已完成').length,
        label: '已完成'
      }
    ])

    // 计算属性
    const filteredProjects = computed(() => {
      let filtered = projects.value

      // 搜索筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(project => 
          project.title?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.keywords?.toLowerCase().includes(query) ||
          project.creator_name?.toLowerCase().includes(query) ||
          project.project_type?.toLowerCase().includes(query)
        )
      }

      // 状态筛选
      if (activeFilter.value !== 'all') {
        filtered = filtered.filter(project => project.project_status === activeFilter.value)
      }

      // 排序
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'created_at':
            return new Date(b.created_at || 0) - new Date(a.created_at || 0)
          case 'updated_at':
            return new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
          case 'views_count':
            return (b.views_count || 0) - (a.views_count || 0)
          case 'applications_count':
            return (b.applications_count || 0) - (a.applications_count || 0)
          case 'title':
            return (a.title || '').localeCompare(b.title || '')
          default:
            return 0
        }
      })

      return filtered
    })

    const hasActiveFilters = computed(() => 
      searchQuery.value || activeFilter.value !== 'all'
    )

    // 方法
    const getFilterCount = (filterKey) => {
      if (filterKey === 'all') return projects.value.length
      return projects.value.filter(p => p.project_status === filterKey).length
    }

    const setActiveFilter = (filterKey) => {
      activeFilter.value = filterKey
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const clearAllFilters = () => {
      searchQuery.value = ''
      activeFilter.value = 'all'
      sortBy.value = 'created_at'
    }

    const getStatusText = (status) => {
      return status || '未知状态'
    }

    const getProjectStatusClass = (status) => {
      switch (status) {
        case '招募中': return 'status-recruiting'
        case '进行中': return 'status-active'
        case '已完成': return 'status-completed'
        case '暂停': return 'status-paused'
        default: return ''
      }
    }

    const getSkillLevelClass = (level) => {
      switch (level) {
        case '初窥门径': return 'level-beginner'
        case '登堂入室': return 'level-intermediate'
        case '融会贯通': return 'level-advanced'
        case '炉火纯青': return 'level-expert'
        default: return 'level-beginner'
      }
    }

    const formatTime = (dateStr) => {
      if (!dateStr) return ''
      try {
        const date = new Date(dateStr)
        const now = new Date()
        const diffTime = now - date
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return '今天'
        if (diffDays === 1) return '昨天'
        if (diffDays < 7) return `${diffDays}天前`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
        return date.toLocaleDateString('zh-CN')
      } catch {
        return dateStr
      }
    }

    const getEmptyStateTitle = () => {
      if (searchQuery.value) return '未找到匹配的项目'
      if (activeFilter.value !== 'all') return `暂无${activeFilter.value}项目`
      return '暂无项目'
    }

    const getEmptyStateDescription = () => {
      if (searchQuery.value) return `没有找到包含"${searchQuery.value}"的项目，请尝试其他关键词`
      return '平台上暂时没有项目，成为第一个创建项目的人吧！'
    }

    // 权限判断
    const isMyProject = (project) => {
      return project.creator_id && project.creator_id.toString() === currentUserId.value.toString()
    }

    const canApplyToProject = (project) => {
      return !isMyProject(project) && project.project_status === '招募中'
    }

    // 操作方法
    const viewProject = (project) => {
      router.push(`/projects/${project.id}`)
    }

    const openCreateForm = () => {
      showForm.value = true
      editingProject.value = null
    }

    const closeForm = () => {
      showForm.value = false
      editingProject.value = null
    }

    const openEditForm = async (project) => {
      try {
        const response = await ApiService.getProject(project.id)
        if (response.data.success) {
          editingProject.value = response.data.data
        } else {
          editingProject.value = project
        }
      } catch {
        editingProject.value = project
      }
      showForm.value = true
    }

    const quickApply = (project) => {
      // 快速申请，跳转到项目详情页
      router.push(`/projects/${project.id}`)
    }

    const onFormSuccess = (createdOrUpdated) => {
      if (editingProject.value) {
        // 更新项目
        const idx = projects.value.findIndex(p => p.id === editingProject.value.id)
        if (idx !== -1) {
          projects.value[idx] = createdOrUpdated
        }
      } else if (createdOrUpdated) {
        // 新建项目
        projects.value.unshift(createdOrUpdated)
      }
      closeForm()
    }

    // 加载所有项目
    const loadProjects = async () => {
      loading.value = true
      try {
        const response = await ApiService.getProjects()
        if (response.data.success) {
          projects.value = response.data.data || []
        } else {
          console.warn('获取项目失败:', response.data.message)
        }
      } catch (error) {
        console.error('获取项目失败:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(loadProjects)

    return {
      // 响应式数据
      searchQuery,
      activeFilter,
      sortBy,
      loading,
      projects,
      showForm,
      editingProject,
      filters,
      
      // 计算属性
      statsData,
      filteredProjects,
      hasActiveFilters,
      
      // 方法
      getFilterCount,
      setActiveFilter,
      clearSearch,
      clearAllFilters,
      getStatusText,
      getProjectStatusClass,
      getSkillLevelClass,
      formatTime,
      getEmptyStateTitle,
      getEmptyStateDescription,
      isMyProject,
      canApplyToProject,
      viewProject,
      openCreateForm,
      closeForm,
      openEditForm,
      quickApply,
      onFormSuccess
    }
  }
}
</script>

<style scoped>
/* 页面基础样式 */
.all-projects-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.header-text h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.create-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.create-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 统计卡片 */
.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.total .stat-icon {
  background: #e0e7ff;
  color: #3730a3;
}

.stat-card.recruiting .stat-icon {
  background: #fef3c7;
  color: #d97706;
}

.stat-card.active .stat-icon {
  background: #dcfce7;
  color: #16a34a;
}

.stat-card.completed .stat-icon {
  background: #dbeafe;
  color: #2563eb;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
}

/* 筛选和搜索 */
.filters-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 300px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  padding: 4px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
}

.clear-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-tab.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.filter-count {
  background: rgba(0, 0, 0, 0.1);
  color: currentColor;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
}

.sort-dropdown {
  display: flex;
  align-items: center;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: #667eea;
}

/* 加载和空状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
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
  padding: 60px 0;
}

.empty-illustration {
  color: #d1d5db;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
}

.empty-description {
  color: #6b7280;
  font-size: 16px;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.secondary-btn, .primary-btn {
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-btn:hover {
  background: #e5e7eb;
}

.primary-btn {
  background: #667eea;
  color: white;
  border: 1px solid #667eea;
}

.primary-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* 项目列表 */
.projects-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.project-card.status-recruiting {
  border-left: 4px solid #f59e0b;
}

.project-card.status-active {
  border-left: 4px solid #10b981;
}

.project-card.status-completed {
  border-left: 4px solid #3b82f6;
}

.project-card.status-paused {
  border-left: 4px solid #6b7280;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.project-status.招募中 {
  background: #fef3c7;
  color: #d97706;
}

.project-status.进行中 {
  background: #d1fae5;
  color: #065f46;
}

.project-status.已完成 {
  background: #dbeafe;
  color: #1e40af;
}

.project-status.暂停 {
  background: #f3f4f6;
  color: #6b7280;
}

.project-type {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.project-actions {
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

.action-btn.edit {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.edit:hover {
  background: #fed7aa;
}

.action-btn.apply {
  background: #dcfce7;
  color: #16a34a;
}

.action-btn.apply:hover {
  background: #bbf7d0;
}

.project-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.project-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.detail-label {
  color: #6b7280;
  font-weight: 500;
  min-width: 60px;
}

.detail-value {
  color: #374151;
  font-weight: 600;
}

.detail-value.creator {
  color: #667eea;
}

.skills-section {
  margin-bottom: 16px;
}

.skills-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.skill-tag.level-beginner {
  background: #fef3c7;
  color: #92400e;
}

.skill-tag.level-intermediate {
  background: #dbeafe;
  color: #1e40af;
}

.skill-tag.level-advanced {
  background: #d1fae5;
  color: #065f46;
}

.skill-tag.level-expert {
  background: #ede9fe;
  color: #5b21b6;
}

.skill-more {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.footer-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

.footer-time {
  color: #6b7280;
  font-size: 12px;
}

/* 项目动画 */
.project-enter-active,
.project-leave-active {
  transition: all 0.3s ease;
}

.project-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.project-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .all-projects-page {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-text h1 {
    font-size: 2rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-wrapper {
    min-width: unset;
  }
  
  .filter-tabs {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .projects-list {
    grid-template-columns: 1fr;
  }
  
  .project-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .project-details {
    grid-template-columns: 1fr;
  }
}
</style>
