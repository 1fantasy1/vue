<template>
  <div class="page">

    <!-- 主要功能卡片区域 -->
    <div class="cards-container">
      <!-- 参与的项目卡片 -->
      <div class="nav-card" @click="navigateTo('/my-projects')">
        <div class="card-icon projects-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
        </div>
        <h3 class="card-title">参与的项目</h3>
        <p class="card-description">查看和管理您参与的所有项目</p>
        <div class="card-stats">
          <span class="stat-item">进行中: 3</span>
          <span class="stat-item">已完成: 5</span>
        </div>
      </div>

      <!-- 参与的课程卡片 -->
      <div class="nav-card" @click="navigateTo('/my-courses')">
        <div class="card-icon courses-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
        </div>
        <h3 class="card-title">参与的课程</h3>
        <p class="card-description">您正在学习的课程和培训</p>
        <div class="card-stats">
          <span class="stat-item">学习中: 2</span>
          <span class="stat-item">已完成: 8</span>
        </div>
      </div>

      <!-- 聊天室卡片 -->
      <div class="nav-card" @click="navigateTo('/chat-rooms')">
        <div class="card-icon chat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <h3 class="card-title">聊天室</h3>
        <p class="card-description">与团队成员实时交流协作</p>
        <div class="card-stats">
          <span class="stat-item">活跃群组: 4</span>
          <span class="stat-item">未读消息: 12</span>
        </div>
      </div>

      <!-- 课程笔记卡片 -->
      <div class="nav-card" @click="navigateTo('/course-notes')">
        <div class="card-icon notes-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </div>
        <h3 class="card-title">课程笔记</h3>
        <p class="card-description">整理和查看学习笔记</p>
        <div class="card-stats">
          <span class="stat-item">笔记数: 24</span>
          <span class="stat-item">最近更新: 今天</span>
        </div>
      </div>

      <!-- 收藏卡片 -->
      <div class="nav-card" @click="navigateTo('/favorites')">
        <div class="card-icon favorites-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
          </svg>
        </div>
        <h3 class="card-title">收藏</h3>
        <p class="card-description">收藏的课程资源和项目</p>
        <div class="card-stats">
          <span class="stat-item">资源: 15</span>
          <span class="stat-item">项目: 7</span>
        </div>
      </div>

      <!-- 随手记录卡片 -->
      <div class="nav-card" @click="navigateTo('/quick-notes')">
        <div class="card-icon quick-notes-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M21,12V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H12"/>
          </svg>
        </div>
        <h3 class="card-title">随手记录</h3>
        <p class="card-description">快速记录想法和灵感</p>
        <div class="card-stats">
          <span class="stat-item">记录数: 32</span>
          <span class="stat-item">今日新增: 3</span>
        </div>
      </div>

      <!-- 知识库卡片 -->
      <div class="nav-card" @click="navigateTo('/knowledge-hub')">
        <div class="card-icon knowledge-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h3 class="card-title">知识库</h3>
        <p class="card-description">浏览和搜索项目知识资源</p>
        <div class="card-stats">
          <span class="stat-item">文档: 156</span>
          <span class="stat-item">分类: 12</span>
        </div>
      </div>

      <!-- 智库卡片 -->
      <div class="nav-card" @click="navigateTo('/knowledge')">
        <div class="card-icon wisdom-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
          </svg>
        </div>
        <h3 class="card-title">智库</h3>
        <p class="card-description">AI智能助手和知识问答</p>
        <div class="card-stats">
          <span class="stat-item">对话: 24</span>
          <span class="stat-item">在线助手: 1</span>
        </div>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions-section">
      <h3 class="section-title">快速操作</h3>
      <div class="quick-actions-grid">
        <button class="quick-action-btn" @click="createProject">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          创建项目
        </button>
        <button class="quick-action-btn" @click="addNote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          新建笔记
        </button>
        <button class="quick-action-btn" @click="joinGroup">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
          </svg>
          加入群组
        </button>
        <button class="quick-action-btn" @click="searchResources">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          搜索资源
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()

    const navigateTo = (path) => {
      router.push(path)
    }

    const createProject = () => {
      alert('创建项目功能开发中...')
    }

    const addNote = () => {
      alert('新建笔记功能开发中...')
    }

    const joinGroup = () => {
      alert('加入群组功能开发中...')
    }

    const searchResources = () => {
      alert('搜索资源功能开发中...')
    }

    return {
      navigateTo,
      createProject,
      addNote,
      joinGroup,
      searchResources
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

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.welcome-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.nav-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nav-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 16px;
}

.projects-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.courses-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.chat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.notes-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.favorites-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.quick-notes-icon {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.knowledge-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.wisdom-icon {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.card-description {
  color: #6c757d;
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.card-stats {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-item {
  background: #f8f9ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid #e6edff;
}

.quick-actions-section {
  margin-top: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.quick-action-btn {
  background: white;
  color: #667eea;
  padding: 16px 20px;
  border: 2px solid #e6edff;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quick-action-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .nav-card {
    min-height: 160px;
    padding: 20px;
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .page {
    padding: 16px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .quick-action-btn {
    padding: 12px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .nav-card {
    min-height: 140px;
    padding: 16px;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .card-description {
    font-size: 13px;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>
