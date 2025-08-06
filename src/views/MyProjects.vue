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

    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-number">8</div>
        <div class="stat-label">总项目数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">3</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">5</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">2</div>
        <div class="stat-label">担任组长</div>
      </div>
    </div>

    <div class="projects-container">
      <div class="project-card" v-for="project in projects" :key="project.id">
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
            <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
          </div>
        </div>

        <div class="project-team">
          <div class="team-avatars">
            <div class="avatar" v-for="member in project.team" :key="member.id" :title="member.name">
              {{ member.name.charAt(0) }}
            </div>
          </div>
          <span class="team-count">{{ project.team.length }}人团队</span>
        </div>

        <div class="project-footer">
          <div class="project-date">更新于 {{ project.lastUpdate }}</div>
          <div class="project-actions">
            <button class="action-btn primary" @click="viewProject(project.id)">查看详情</button>
            <button class="action-btn" @click="openChat(project.id)">团队聊天</button>
          </div>
        </div>
      </div>
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
import { ref } from 'vue'

export default {
  name: 'MyProjects',
  setup() {
    const router = useRouter()
    
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
        lastUpdate: '2天前'
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
        lastUpdate: '1天前'
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
        lastUpdate: '1周前'
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
        lastUpdate: '3天前'
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
        lastUpdate: '2周前'
      }
    ])

    const getStatusText = (status) => {
      return status === 'active' ? '进行中' : '已完成'
    }

    const viewProject = (projectId) => {
      alert(`查看项目 ${projectId} 详情`)
    }

    const openChat = (projectId) => {
      alert(`打开项目 ${projectId} 团队聊天`)
    }

    const createProject = () => {
      alert('创建新项目功能开发中...')
    }

    return {
      projects,
      getStatusText,
      viewProject,
      openChat,
      createProject
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
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  color: #6c757d;
  font-size: 14px;
}

.projects-container {
  display: grid;
  gap: 20px;
}

.project-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.project-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.project-status.active {
  background: #e8f5e8;
  color: #28a745;
}

.project-status.completed {
  background: #e6f3ff;
  color: #007bff;
}

.project-role {
  background: #f8f9ff;
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.project-description {
  color: #6c757d;
  margin-bottom: 20px;
  line-height: 1.5;
}

.project-progress {
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
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.project-team {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.team-avatars {
  display: flex;
  gap: 4px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.team-count {
  color: #6c757d;
  font-size: 14px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-date {
  color: #6c757d;
  font-size: 14px;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  background: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.action-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.action-btn.primary:hover {
  background: #5a6abf;
}

.floating-actions {
  position: fixed;
  bottom: 32px;
  right: 32px;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.fab:hover {
  background: #5a6abf;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .header {
    margin: -16px -16px 16px -16px;
    padding: 20px 16px;
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

  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .project-header {
    flex-direction: column;
    gap: 12px;
  }

  .project-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .fab {
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .stats-bar {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
