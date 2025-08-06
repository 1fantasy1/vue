<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">参与的项目</h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
            </svg>
          </div>
          <div class="decoration-line"></div>
        </div>
        <p class="page-subtitle">管理和跟踪您参与的所有项目进展</p>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="controls-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20l1-1-4.5-4.5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索项目名称或描述..." 
            class="search-input"
            @input="handleSearch"
          />
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-search"
            aria-label="清除搜索"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="filter-container">
        <div class="filter-group">
          <label for="status-filter" class="filter-label">状态筛选:</label>
          <select 
            id="status-filter" 
            v-model="statusFilter" 
            class="filter-select"
            @change="handleFilter"
          >
            <option value="all">全部状态</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="role-filter" class="filter-label">角色筛选:</label>
          <select 
            id="role-filter" 
            v-model="roleFilter" 
            class="filter-select"
            @change="handleFilter"
          >
            <option value="all">全部角色</option>
            <option value="项目组长">项目组长</option>
            <option value="前端开发">前端开发</option>
            <option value="后端开发">后端开发</option>
            <option value="UI设计师">UI设计师</option>
            <option value="数据分析师">数据分析师</option>
          </select>
        </div>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-card" v-for="(stat, index) in statsData" :key="index">
        <div class="stat-number">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <div class="projects-container">
      <!-- 空状态显示 -->
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
          </svg>
        </div>
        <h3 class="empty-title">{{ getEmptyStateTitle() }}</h3>
        <p class="empty-description">{{ getEmptyStateDescription() }}</p>
        <button @click="clearAllFilters" class="empty-action" v-if="hasActiveFilters">
          清除所有筛选条件
        </button>
      </div>

      <!-- 项目列表 -->
      <transition-group name="project-list" tag="div" class="projects-grid" v-else>
        <div 
          class="project-card" 
          v-for="project in filteredProjects" 
          :key="project.id"
          @click="viewProject(project.id)"
          @keydown.enter="viewProject(project.id)"
          @keydown.space.prevent="viewProject(project.id)"
          tabindex="0"
          :aria-label="`项目: ${project.title}, 状态: ${getStatusText(project.status)}, 进度: ${project.progress}%`"
        >
          <div class="project-header">
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <span class="project-status" :class="project.status">{{ getStatusText(project.status) }}</span>
            </div>
            <div class="project-role">{{ project.role }}</div>
          </div>
          
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-progress">
            <div class="progress-header">
              <span>项目进度</span>
              <span>{{ project.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: project.progress + '%' }"
                :aria-label="`进度 ${project.progress}%`"
              ></div>
            </div>
          </div>

          <div class="project-team">
            <div class="team-avatars">
              <div 
                class="avatar" 
                v-for="(member, index) in project.team.slice(0, 4)" 
                :key="member.id" 
                :title="member.name"
                :style="{ zIndex: project.team.length - index }"
              >
                {{ member.name.charAt(0) }}
              </div>
              <div 
                v-if="project.team.length > 4" 
                class="avatar more-members"
                :title="`还有 ${project.team.length - 4} 位成员`"
              >
                +{{ project.team.length - 4 }}
              </div>
            </div>
            <span class="team-count">{{ project.team.length }}人团队</span>
          </div>

          <div class="project-footer">
            <div class="project-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"/>
              </svg>
              更新于 {{ project.lastUpdate }}
            </div>
            <div class="project-actions">
              <button 
                class="action-btn primary" 
                @click.stop="viewProject(project.id)"
                :aria-label="`查看项目 ${project.title} 详情`"
              >
                查看详情
              </button>
              <button 
                class="action-btn" 
                @click.stop="openChat(project.id)"
                :aria-label="`打开项目 ${project.title} 团队聊天`"
              >
                团队聊天
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="floating-actions">
      <button class="fab" @click="createProject" title="创建新项目">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, nextTick } from 'vue'

export default {
  name: 'MyProjects',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const searchQuery = ref('')
    const statusFilter = ref('all')
    const roleFilter = ref('all')
    const isLoading = ref(false)
    
    const projects = ref([
      {
        id: 1,
        title: '智能学习系统开发',
        description: '基于AI的个性化学习推荐系统，帮助学生提高学习效率。',
        status: 'active',
        progress: 75,
        role: '前端开发',
        team: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' },
          { id: 3, name: '王五' },
          { id: 4, name: '赵六' }
        ],
        lastUpdate: '2天前',
        priority: 'high'
      },
      {
        id: 2,
        title: '移动端购物应用',
        description: '跨平台电商应用，支持多种支付方式和物流跟踪。',
        status: 'active',
        progress: 45,
        role: '项目组长',
        team: [
          { id: 5, name: '刘七' },
          { id: 6, name: '陈八' },
          { id: 7, name: '杨九' }
        ],
        lastUpdate: '1天前',
        priority: 'medium'
      },
      {
        id: 3,
        title: '数据可视化平台',
        description: '企业级数据分析和可视化解决方案。',
        status: 'completed',
        progress: 100,
        role: '数据分析师',
        team: [
          { id: 8, name: '周十' },
          { id: 9, name: '吴一' }
        ],
        lastUpdate: '1周前',
        priority: 'low'
      },
      {
        id: 4,
        title: '在线协作工具',
        description: '团队协作和项目管理工具，提高工作效率。',
        status: 'active',
        progress: 30,
        role: 'UI设计师',
        team: [
          { id: 10, name: '郑二' },
          { id: 11, name: '孙三' },
          { id: 12, name: '李四' },
          { id: 13, name: '钱五' },
          { id: 14, name: '赵六' }
        ],
        lastUpdate: '3天前',
        priority: 'high'
      },
      {
        id: 5,
        title: '智能家居控制系统',
        description: '物联网智能家居控制平台，支持语音控制。',
        status: 'completed',
        progress: 100,
        role: '后端开发',
        team: [
          { id: 15, name: '孙七' },
          { id: 16, name: '周八' }
        ],
        lastUpdate: '2周前',
        priority: 'medium'
      }
    ])

    // 计算属性
    const filteredProjects = computed(() => {
      let filtered = projects.value

      // 搜索筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.role.toLowerCase().includes(query)
        )
      }

      // 状态筛选
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(project => project.status === statusFilter.value)
      }

      // 角色筛选
      if (roleFilter.value !== 'all') {
        filtered = filtered.filter(project => project.role === roleFilter.value)
      }

      return filtered
    })

    const statsData = computed(() => {
      const activeProjects = projects.value.filter(p => p.status === 'active')
      const completedProjects = projects.value.filter(p => p.status === 'completed')
      const leaderProjects = projects.value.filter(p => p.role === '项目组长')

      return [
        { label: '总项目数', value: projects.value.length },
        { label: '进行中', value: activeProjects.length },
        { label: '已完成', value: completedProjects.length },
        { label: '担任组长', value: leaderProjects.length }
      ]
    })

    const hasActiveFilters = computed(() => {
      return searchQuery.value || statusFilter.value !== 'all' || roleFilter.value !== 'all'
    })

    // 方法
    const getStatusText = (status) => {
      return status === 'active' ? '进行中' : '已完成'
    }

    const getEmptyStateTitle = () => {
      if (searchQuery.value) return '未找到匹配的项目'
      if (hasActiveFilters.value) return '没有符合条件的项目'
      return '暂无项目'
    }

    const getEmptyStateDescription = () => {
      if (searchQuery.value) return `没有找到包含"${searchQuery.value}"的项目`
      if (hasActiveFilters.value) return '尝试调整筛选条件查看更多项目'
      return '您还没有参与任何项目，点击右下角按钮创建新项目'
    }

    const handleSearch = () => {
      // 可以在这里添加防抖逻辑
      // 目前由于计算属性的响应式特性，会自动更新
    }

    const handleFilter = () => {
      // 筛选变化时的处理逻辑
      nextTick(() => {
        // 可以添加一些动画或其他效果
      })
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const clearAllFilters = () => {
      searchQuery.value = ''
      statusFilter.value = 'all'
      roleFilter.value = 'all'
    }

    const viewProject = (projectId) => {
      // 可以跳转到项目详情页面
      alert(`查看项目 ${projectId} 详情`)
      // router.push(`/projects/${projectId}`)
    }

    const openChat = (projectId) => {
      // 可以打开聊天窗口或跳转到聊天页面
      alert(`打开项目 ${projectId} 团队聊天`)
      // router.push(`/chat/project/${projectId}`)
    }

    const createProject = () => {
      // 可以打开创建项目的模态框或跳转到创建页面
      alert('创建新项目功能开发中...')
      // router.push('/projects/create')
    }

    return {
      // 响应式数据
      searchQuery,
      statusFilter,
      roleFilter,
      isLoading,
      projects,
      
      // 计算属性
      filteredProjects,
      statsData,
      hasActiveFilters,
      
      // 方法
      getStatusText,
      getEmptyStateTitle,
      getEmptyStateDescription,
      handleSearch,
      handleFilter,
      clearSearch,
      clearAllFilters,
      viewProject,
      openChat,
      createProject
    }
  }
}
</script>

<style scoped>
/* 基础页面样式 - 平衡版本 */
.page {
  margin: 0;
  padding: 24px;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
}

/* 头部样式 - 恢复合理间距 */
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

/* 控制区域样式 */
.controls-section {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-container {
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: white;
}

.filter-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 14px;
  min-width: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.filter-select option {
  background: #667eea;
  color: white;
}

/* 统计栏样式 */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

/* 项目容器样式 */
.projects-container {
  position: relative;
}

.projects-grid {
  display: grid;
  gap: 20px;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: white;
}

.empty-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.5;
}

.empty-action {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.empty-action:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 项目卡片样式 */
.project-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover {
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-4px);
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:focus {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 2px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.project-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.project-status.active {
  background: rgba(40, 167, 69, 0.8);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.project-status.completed {
  background: rgba(0, 123, 255, 0.8);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.project-role {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.project-description {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

/* 进度条样式 */
.project-progress {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: translateX(-100%);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 团队样式 */
.project-team {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.team-avatars {
  display: flex;
  gap: -8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-left: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.avatar.more-members {
  background: rgba(255, 255, 255, 0.6);
  font-size: 10px;
}

.team-count {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

/* 项目底部样式 */
.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.project-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.primary {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.action-btn:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: translateY(-1px);
}

.action-btn.primary:hover {
  background: rgba(255, 255, 255, 1);
  color: #5a6abf;
}

/* 浮动按钮样式 - 移动端优化 */
.floating-actions {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* 移动端触摸优化 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.fab:hover {
  background: rgba(255, 255, 255, 1);
  color: #5a6abf;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.fab:active {
  transform: translateY(-2px) scale(0.98);
}

/* 动画样式 */
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.project-list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.project-list-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式设计 - 修复版本 */
@media (max-width: 768px) {
  .page {
    padding: 16px;
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .header {
    margin: -16px -16px 16px -16px;
    padding: 20px 16px;
    border-radius: 0;
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

  .controls-section {
    margin-bottom: 16px;
    gap: 12px;
  }

  .filter-container {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .filter-select {
    width: 100%;
    min-width: auto;
  }

  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .projects-container {
    position: relative;
  }

  .project-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .project-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .project-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .project-actions {
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
    width: 48px;
    height: 48px;
  }

  .floating-actions {
    margin-right: 4px;
  }

  .team-avatars {
    flex-wrap: wrap;
  }

  .avatar {
    margin-left: 0;
    margin-right: 4px;
    margin-bottom: 4px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 12px;
  }

  .header {
    margin: -12px -12px 16px -12px;
  }

  .stats-bar {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }

  .controls-section {
    margin-bottom: 16px;
  }

  .projects-container {
    position: relative;
  }

  .project-card {
    padding: 20px;
  }

  .project-title {
    font-size: 1.1rem;
  }

  .project-actions {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .search-input,
  .filter-select {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .project-card {
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  .action-btn {
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  .search-input,
  .filter-select {
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 打印样式 */
@media print {
  .page {
    background: white !important;
    color: black !important;
    padding: 20px !important;
  }
  
  .controls-section,
  .floating-actions {
    display: none !important;
  }
  
  .project-card {
    background: white !important;
    border: 1px solid #ccc !important;
    color: black !important;
    break-inside: avoid;
    margin-bottom: 20px;
  }
  
  .header {
    background: white !important;
    color: black !important;
    border: 1px solid #ccc !important;
  }
  
  .stats-bar {
    display: none !important;
  }
}
</style>
