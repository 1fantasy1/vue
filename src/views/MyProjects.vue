<template>
  <div class="my-projects-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="page-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-2l-2-2H8L6 6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-2v-1c0-1.33-2.67-2-4-2s-4 .67-4 2v1H7V9h10v8z"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">我的项目</h1>
            <p class="page-description">管理和跟踪您参与的所有项目</p>
          </div>
        </div>
        <div class="header-right">
          <button class="create-btn" @click="createProject">
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
          <div class="stat-trend" v-if="stat.trend">
            <span class="trend-value" :class="stat.trend.type">{{ stat.trend.value }}</span>
            <span class="trend-label">{{ stat.trend.label }}</span>
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
            placeholder="搜索项目名称、描述或团队成员..."
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
          <option value="lastUpdate">最近更新</option>
          <option value="progress">项目进度</option>
          <option value="title">项目名称</option>
          <option value="priority">优先级</option>
        </select>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="projects-section">
      <div v-if="filteredProjects.length === 0" class="empty-state">
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
          <button @click="createProject" class="primary-btn">
            创建第一个项目
          </button>
        </div>
      </div>

      <div v-else class="projects-grid">
        <transition-group name="project" tag="div" class="projects-list">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
            :class="{ 'high-priority': project.priority === 'high' }"
            @click="viewProject(project)"
          >
            <!-- 项目头部 -->
            <div class="project-header">
              <div class="project-meta">
                <span class="project-status" :class="project.status">
                  {{ getStatusText(project.status) }}
                </span>
                <span class="project-priority" :class="project.priority">
                  {{ getPriorityText(project.priority) }}
                </span>
              </div>
              <div class="project-actions">
                <button 
                  class="action-btn" 
                  @click.stop="toggleFavorite(project.id)"
                  :class="{ active: project.isFavorite }"
                  :title="project.isFavorite ? '取消收藏' : '收藏项目'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                  </svg>
                </button>
                <button class="action-btn" @click.stop="openProjectMenu(project.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 项目内容 -->
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-details">
                <div class="detail-item">
                  <span class="detail-label">我的角色</span>
                  <span class="detail-value role-badge" :class="getRoleClass(project.role)">
                    {{ project.role }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">团队规模</span>
                  <span class="detail-value">{{ project.team.length }} 人</span>
                </div>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="project-progress">
              <div class="progress-header">
                <span class="progress-label">完成进度</span>
                <span class="progress-value">{{ project.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: project.progress + '%' }"
                  :class="getProgressClass(project.progress)"
                ></div>
              </div>
            </div>

            <!-- 团队成员 -->
            <div class="project-team">
              <div class="team-label">团队成员</div>
              <div class="team-avatars">
                <div 
                  v-for="(member, index) in project.team.slice(0, 5)" 
                  :key="member.id"
                  class="member-avatar"
                  :title="member.name"
                  :style="{ zIndex: 10 - index }"
                >
                  <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
                  <span v-else>{{ member.name.charAt(0) }}</span>
                </div>
                <div v-if="project.team.length > 5" class="member-avatar more" :title="`还有 ${project.team.length - 5} 位成员`">
                  +{{ project.team.length - 5 }}
                </div>
              </div>
            </div>

            <!-- 项目底部 -->
            <div class="project-footer">
              <div class="footer-info">
                <div class="deadline" v-if="project.deadline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"/>
                  </svg>
                  {{ formatDeadline(project.deadline) }}
                </div>
                <div class="last-update">
                  更新于 {{ project.lastUpdate }}
                </div>
              </div>
              <div class="footer-actions">
                <button class="quick-action" @click.stop="openChat(project.id)" title="团队聊天">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"/>
                  </svg>
                  <span class="action-text">聊天</span>
                </button>
                <button class="quick-action" @click.stop="viewTasks(project.id)" title="查看任务">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8L10,17Z"/>
                  </svg>
                  <span class="action-text">任务</span>
                </button>
                <button class="quick-action" @click.stop="viewFiles(project.id)" title="项目文件">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"/>
                  </svg>
                  <span class="action-text">文件</span>
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MyProjects',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const sortBy = ref('lastUpdate')
    
    // 项目数据
    const projects = ref([
      {
        id: 1,
        title: '智能教育平台',
        description: '基于AI的个性化学习推荐系统，为学生提供定制化的学习路径和智能辅导。',
        status: 'active',
        progress: 85,
        role: '前端开发工程师',
        priority: 'high',
        deadline: '2024-12-15',
        lastUpdate: '2小时前',
        isFavorite: true,
        team: [
          { id: 1, name: '张小明', avatar: null },
          { id: 2, name: '李华', avatar: null },
          { id: 3, name: '王芳', avatar: null },
          { id: 4, name: '刘强', avatar: null },
          { id: 5, name: '陈雪', avatar: null }
        ]
      },
      {
        id: 2,
        title: '电商移动应用',
        description: '跨平台购物应用开发，支持多端同步、智能推荐和一键支付功能。',
        status: 'active',
        progress: 60,
        role: '项目经理',
        priority: 'high',
        deadline: '2024-11-30',
        lastUpdate: '1天前',
        isFavorite: false,
        team: [
          { id: 6, name: '赵敏', avatar: null },
          { id: 7, name: '孙涛', avatar: null },
          { id: 8, name: '周杰', avatar: null }
        ]
      },
      {
        id: 3,
        title: '数据可视化仪表板',
        description: '企业级商业智能平台，提供实时数据分析、图表展示和决策支持。',
        status: 'completed',
        progress: 100,
        role: '数据分析师',
        priority: 'medium',
        deadline: '2024-10-20',
        lastUpdate: '1周前',
        isFavorite: true,
        team: [
          { id: 9, name: '吴梅', avatar: null },
          { id: 10, name: '郑飞', avatar: null }
        ]
      },
      {
        id: 4,
        title: '协作办公系统',
        description: '团队协作和项目管理一体化解决方案，提升工作效率和沟通质量。',
        status: 'active',
        progress: 40,
        role: 'UI/UX设计师',
        priority: 'medium',
        deadline: '2025-01-15',
        lastUpdate: '3天前',
        isFavorite: false,
        team: [
          { id: 11, name: '黄磊', avatar: null },
          { id: 12, name: '徐静', avatar: null },
          { id: 13, name: '马超', avatar: null },
          { id: 14, name: '林娜', avatar: null },
          { id: 15, name: '何伟', avatar: null },
          { id: 16, name: '宋丽', avatar: null }
        ]
      },
      {
        id: 5,
        title: '智能家居控制中心',
        description: '物联网家居设备统一管理平台，支持语音控制和自动化场景设置。',
        status: 'completed',
        progress: 100,
        role: '后端开发工程师',
        priority: 'low',
        deadline: '2024-09-30',
        lastUpdate: '2周前',
        isFavorite: false,
        team: [
          { id: 17, name: '江涛', avatar: null },
          { id: 18, name: '钱丽丽', avatar: null },
          { id: 19, name: '罗峰', avatar: null }
        ]
      },
      {
        id: 6,
        title: '区块链金融应用',
        description: '基于区块链技术的去中心化金融平台，提供安全可靠的数字资产管理。',
        status: 'planning',
        progress: 15,
        role: '技术负责人',
        priority: 'high',
        deadline: '2025-03-20',
        lastUpdate: '5天前',
        isFavorite: true,
        team: [
          { id: 20, name: '谢军', avatar: null },
          { id: 21, name: '邓磊', avatar: null }
        ]
      }
    ])

    // 筛选配置
    const filters = ref([
      { 
        key: 'all', 
        label: '全部项目', 
        icon: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z' 
      },
      { 
        key: 'active', 
        label: '进行中', 
        icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L10.5,8.5L12,10L17.5,4.5L21,8L12,17Z' 
      },
      { 
        key: 'completed', 
        label: '已完成', 
        icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z' 
      },
      { 
        key: 'favorites', 
        label: '我的收藏', 
        icon: 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z' 
      },
      { 
        key: 'planning', 
        label: '计划中', 
        icon: 'M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z' 
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
          project.role.toLowerCase().includes(query) ||
          project.team.some(member => member.name.toLowerCase().includes(query))
        )
      }

      // 状态筛选
      if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'favorites') {
          filtered = filtered.filter(project => project.isFavorite)
        } else {
          filtered = filtered.filter(project => project.status === activeFilter.value)
        }
      }

      // 排序
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'progress':
            return b.progress - a.progress
          case 'title':
            return a.title.localeCompare(b.title)
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          default: // lastUpdate
            return new Date(b.lastUpdate) - new Date(a.lastUpdate)
        }
      })

      return filtered
    })

    const statsData = computed(() => {
      const activeProjects = projects.value.filter(p => p.status === 'active')
      const completedProjects = projects.value.filter(p => p.status === 'completed')
      const planningProjects = projects.value.filter(p => p.status === 'planning')
      const favoriteProjects = projects.value.filter(p => p.isFavorite)

      return [
        {
          label: '总项目数',
          value: projects.value.length,
          type: 'total',
          icon: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
          trend: { value: '+2', label: '本月新增', type: 'positive' }
        },
        {
          label: '进行中',
          value: activeProjects.length,
          type: 'active',
          icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L10.5,8.5L12,10L17.5,4.5L21,8L12,17Z',
          trend: { value: '+1', label: '较上周', type: 'positive' }
        },
        {
          label: '已完成',
          value: completedProjects.length,
          type: 'completed',
          icon: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z',
          trend: { value: '+1', label: '本月完成', type: 'positive' }
        },
        {
          label: '我的收藏',
          value: favoriteProjects.length,
          type: 'favorites',
          icon: 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z'
        }
      ]
    })

    const hasActiveFilters = computed(() => {
      return searchQuery.value || activeFilter.value !== 'all'
    })

    // 方法
    const getFilterCount = (filterKey) => {
      if (filterKey === 'all') return projects.value.length
      if (filterKey === 'favorites') return projects.value.filter(p => p.isFavorite).length
      return projects.value.filter(p => p.status === filterKey).length
    }

    const setActiveFilter = (filter) => {
      activeFilter.value = filter
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const clearAllFilters = () => {
      searchQuery.value = ''
      activeFilter.value = 'all'
    }

    const getStatusText = (status) => {
      const statusMap = {
        active: '进行中',
        completed: '已完成',
        planning: '计划中',
        paused: '已暂停'
      }
      return statusMap[status] || status
    }

    const getPriorityText = (priority) => {
      const priorityMap = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
      }
      return priorityMap[priority] || priority
    }

    const getRoleClass = (role) => {
      if (role.includes('经理') || role.includes('负责人')) return 'manager'
      if (role.includes('开发')) return 'developer'
      if (role.includes('设计')) return 'designer'
      if (role.includes('分析')) return 'analyst'
      return 'default'
    }

    const getProgressClass = (progress) => {
      if (progress >= 80) return 'high'
      if (progress >= 50) return 'medium'
      return 'low'
    }

    const formatDeadline = (deadline) => {
      const date = new Date(deadline)
      const now = new Date()
      const diffTime = date - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return '已逾期'
      if (diffDays === 0) return '今天截止'
      if (diffDays === 1) return '明天截止'
      if (diffDays <= 7) return `${diffDays}天后截止`
      return date.toLocaleDateString('zh-CN')
    }

    const getEmptyStateTitle = () => {
      if (searchQuery.value) return '未找到匹配的项目'
      if (activeFilter.value === 'favorites') return '暂无收藏项目'
      if (activeFilter.value === 'completed') return '暂无已完成项目'
      if (activeFilter.value === 'active') return '暂无进行中项目'
      return '暂无项目'
    }

    const getEmptyStateDescription = () => {
      if (searchQuery.value) return `没有找到包含"${searchQuery.value}"的项目，请尝试其他关键词`
      if (activeFilter.value === 'favorites') return '您还没有收藏任何项目，点击项目卡片上的心形图标收藏项目'
      return '您还没有参与任何项目，创建您的第一个项目开始工作吧！'
    }

    const toggleFavorite = (projectId) => {
      const project = projects.value.find(p => p.id === projectId)
      if (project) {
        project.isFavorite = !project.isFavorite
      }
    }

    const openProjectMenu = (projectId) => {
      console.log(`打开项目 ${projectId} 菜单`)
      // 这里可以实现项目菜单功能
    }

    const viewProject = (project) => {
      console.log(`查看项目详情:`, project)
      // router.push(`/projects/${project.id}`)
    }

    const openChat = (projectId) => {
      console.log(`打开项目 ${projectId} 聊天`)
      // router.push(`/chat/project/${projectId}`)
    }

    const viewTasks = (projectId) => {
      console.log(`查看项目 ${projectId} 任务`)
      // router.push(`/projects/${projectId}/tasks`)
    }

    const viewFiles = (projectId) => {
      console.log(`查看项目 ${projectId} 文件`)
      // router.push(`/projects/${projectId}/files`)
    }

    const createProject = () => {
      console.log('创建新项目')
      // router.push('/projects/create')
    }

    return {
      // 响应式数据
      searchQuery,
      activeFilter,
      sortBy,
      projects,
      filters,
      
      // 计算属性
      filteredProjects,
      statsData,
      hasActiveFilters,
      
      // 方法
      getFilterCount,
      setActiveFilter,
      clearSearch,
      clearAllFilters,
      getStatusText,
      getPriorityText,
      getRoleClass,
      getProgressClass,
      formatDeadline,
      getEmptyStateTitle,
      getEmptyStateDescription,
      toggleFavorite,
      openProjectMenu,
      viewProject,
      openChat,
      viewTasks,
      viewFiles,
      createProject
    }
  }
}
</script>

<style scoped>
/* 页面基础样式 */
.my-projects-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 页面头部 */
.page-header {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  color: #333;
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
  background: #e9ecef;
  border-radius: 16px;
  padding: 16px;
  color: #667eea;
}

.header-text h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
}

.header-text p {
  margin: 0;
  font-size: 1.1rem;
  color: #666;
  font-weight: 300;
}

.create-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
}

.create-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

/* 统计卡片区域 */
.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  color: #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card .stat-icon {
  background: #f0f2ff;
  border-radius: 12px;
  padding: 12px;
  display: inline-flex;
  margin-bottom: 16px;
  color: #667eea;
}

.stat-card .stat-content {
  position: relative;
  z-index: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #333;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 14px;
}

.trend-value.positive {
  color: #4ade80;
}

.trend-value.negative {
  color: #f87171;
}

.trend-label {
  color: #999;
}

/* 筛选和搜索区域 */
.filters-section {
  max-width: 1200px;
  margin: 0 auto 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-wrapper {
  display: flex;
  justify-content: center;
}

.search-box {
  position: relative;
  max-width: 500px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  color: #667eea;
  background: #f0f2ff;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 12px 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.filter-tab:hover {
  background: #f0f2ff;
  border-color: #667eea;
  color: #667eea;
}

.filter-tab.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
  font-weight: 600;
}

.filter-count {
  background: #e9ecef;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.sort-dropdown {
  display: flex;
  justify-content: center;
}

.sort-select {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  min-width: 150px;
}

.sort-select:focus {
  outline: none;
  border-color: #667eea;
}

.sort-select option {
  background: white;
  color: #333;
}

/* 项目列表区域 */
.projects-section {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

/* 项目卡片 */
.project-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 28px;
  color: #333;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card.high-priority {
  border-left: 4px solid #f59e0b;
}

/* 项目头部 */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.project-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.project-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-status.active {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.project-status.completed {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.project-status.planning {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.project-priority {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-priority.high {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.project-priority.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.project-priority.low {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e9ecef;
  color: #333;
  border-color: #dee2e6;
}

.action-btn.active {
  color: #f87171;
}

/* 项目内容 */
.project-content {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.project-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.3;
  color: #333;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 15px;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.role-badge {
  background: #f0f2ff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #667eea;
}

.role-badge.manager {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.role-badge.developer {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.role-badge.designer {
  background: rgba(168, 85, 247, 0.2);
  color: #a78bfa;
}

.role-badge.analyst {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

/* 进度条 */
.project-progress {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.progress-value {
  font-size: 14px;
  color: #333;
  font-weight: 700;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill.high {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.progress-fill.medium {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.progress-fill.low {
  background: linear-gradient(90deg, #f87171, #ef4444);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 团队成员 */
.project-team {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.team-label {
  font-size: 14px;
  color: #666;
  font-weight: 600;
  margin-bottom: 12px;
}

.team-avatars {
  display: flex;
  align-items: center;
  gap: -8px;
}

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-left: -8px;
  border: 3px solid white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.member-avatar:first-child {
  margin-left: 0;
}

.member-avatar:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  z-index: 10;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.member-avatar.more {
  background: #e9ecef;
  color: #666;
  font-size: 11px;
}

/* 项目底部 */
.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.deadline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #fbbf24;
  font-weight: 600;
}

.last-update {
  font-size: 13px;
  color: #999;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.quick-action {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action .action-text {
  display: none;
}

.quick-action:hover {
  background: #e9ecef;
  color: #333;
  border-color: #dee2e6;
  transform: translateY(-2px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #333;
}

.empty-illustration {
  margin-bottom: 24px;
  opacity: 0.4;
  color: #999;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.empty-description {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn {
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
}

.primary-btn {
  background: #667eea;
  color: white;
}

.primary-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.secondary-btn {
  background: white;
  color: #667eea;
  border: 1px solid #e9ecef;
}

.secondary-btn:hover {
  background: #f0f2ff;
  border-color: #667eea;
}

/* 动画效果 */
.project-enter-active,
.project-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.project-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.project-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .my-projects-page {
    padding: 16px;
  }

  .page-header {
    padding: 24px 20px;
    margin-bottom: 24px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header-left {
    justify-content: center;
  }

  .header-text h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .filter-tabs {
    gap: 8px;
  }

  .filter-tab {
    padding: 10px 16px;
    font-size: 13px;
  }

  .projects-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .project-card {
    padding: 24px;
  }

  .project-header {
    align-items: flex-start;
  }

  .project-meta {
    flex: 1;
    justify-content: flex-start;
  }

  .project-actions {
    margin-left: auto;
  }

  .project-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .footer-actions {
    width: 100%;
    justify-content: center;
    gap: 12px;
  }

  .quick-action {
    flex: 1;
    max-width: 80px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 14px;
    flex-direction: column;
    gap: 2px;
    padding: 6px 4px;
  }

  .quick-action .action-text {
    display: block;
    margin-left: 0;
    font-size: 10px;
    font-weight: 500;
    color: inherit;
  }

  .quick-action svg {
    width: 14px;
    height: 14px;
  }

  .team-avatars {
    flex-wrap: wrap;
    gap: 4px;
  }

  .member-avatar {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .my-projects-page {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .search-input {
    padding: 14px 16px 14px 48px;
    font-size: 14px;
  }

  .search-icon {
    left: 16px;
  }

  .clear-btn {
    right: 10px;
  }

  .project-card {
    padding: 20px;
  }

  .project-title {
    font-size: 1.2rem;
  }

  .empty-actions {
    flex-direction: column;
    align-items: center;
  }

  .primary-btn, .secondary-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .project-card {
    border: 2px solid rgba(255, 255, 255, 0.6);
  }
  
  .filter-tab {
    border: 2px solid rgba(255, 255, 255, 0.6);
  }
  
  .action-btn {
    border: 2px solid rgba(255, 255, 255, 0.6);
  }
}

/* 打印样式 */
@media print {
  .my-projects-page {
    background: white !important;
    color: black !important;
  }
  
  .page-header,
  .stat-card,
  .project-card {
    background: white !important;
    border: 1px solid #ccc !important;
    color: black !important;
  }
  
  .filters-section {
    display: none !important;
  }
  
  .project-actions,
  .footer-actions {
    display: none !important;
  }
}
</style>
