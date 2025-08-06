<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">参与的课程</h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
          </div>
          <div class="decoration-line"></div>
        </div>
        <p class="page-subtitle">掌握知识，提升技能，成就更好的自己</p>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-number">10</div>
        <div class="stat-label">总课程数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">2</div>
        <div class="stat-label">学习中</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">8</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">85%</div>
        <div class="stat-label">平均完成度</div>
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
      <div class="course-card" v-for="course in filteredCourses" :key="course.id">
        <div class="course-image">
          <div class="course-category">{{ course.category }}</div>
          <div class="course-level" :class="course.level">{{ getLevelText(course.level) }}</div>
        </div>
        
        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>
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
import { ref, computed } from 'vue'

export default {
  name: 'MyCourses',
  setup() {
    const router = useRouter()
    const activeTab = ref('all')
    
    const courses = ref([
      {
        id: 1,
        title: 'Vue.js 3.0 完整开发教程',
        instructor: '张教授',
        description: '从基础到高级，全面掌握Vue.js 3.0框架开发',
        category: '前端开发',
        level: 'intermediate',
        progress: 75,
        duration: '24小时',
        lessons: 48,
        students: 1250,
        status: 'learning',
        lastUpdate: '昨天',
        startDate: '2024-01-15'
      },
      {
        id: 2,
        title: 'Python数据分析与机器学习',
        instructor: '李博士',
        description: '使用Python进行数据分析和机器学习实战',
        category: '数据科学',
        level: 'advanced',
        progress: 45,
        duration: '36小时',
        lessons: 72,
        students: 890,
        status: 'learning',
        lastUpdate: '3天前',
        startDate: '2024-02-01'
      },
      {
        id: 3,
        title: 'UI/UX设计基础',
        instructor: '王设计师',
        description: '学习现代UI/UX设计原则和实践',
        category: '设计',
        level: 'beginner',
        progress: 100,
        duration: '18小时',
        lessons: 36,
        students: 2100,
        status: 'completed',
        lastUpdate: '1周前',
        completedDate: '2024-01-20'
      },
      {
        id: 4,
        title: 'Node.js后端开发实战',
        instructor: '陈工程师',
        description: '构建高性能的Node.js后端应用',
        category: '后端开发',
        level: 'intermediate',
        progress: 100,
        duration: '30小时',
        lessons: 60,
        students: 750,
        status: 'completed',
        lastUpdate: '2周前',
        completedDate: '2024-01-10'
      },
      {
        id: 5,
        title: 'React Native移动开发',
        instructor: '刘老师',
        description: '使用React Native开发跨平台移动应用',
        category: '移动开发',
        level: 'intermediate',
        progress: 100,
        duration: '28小时',
        lessons: 56,
        students: 630,
        status: 'completed',
        lastUpdate: '3周前',
        completedDate: '2023-12-25'
      }
    ])

    const filteredCourses = computed(() => {
      if (activeTab.value === 'all') return courses.value
      return courses.value.filter(course => course.status === activeTab.value)
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
      alert(`继续学习课程 ${courseId}`)
    }

    const viewNotes = (courseId) => {
      alert(`查看课程 ${courseId} 笔记`)
    }

    const browseCourses = () => {
      alert('浏览更多课程功能开发中...')
    }

    return {
      activeTab,
      courses,
      filteredCourses,
      getLevelText,
      getStatusText,
      continueLearning,
      viewNotes,
      browseCourses
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
  color: #f093fb;
  margin-bottom: 4px;
}

.stat-label {
  color: #6c757d;
  font-size: 14px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6c757d;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #f093fb;
  color: white;
}

.courses-container {
  display: grid;
  gap: 20px;
}

.course-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
}

.course-card:hover {
  border-color: #f093fb;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.1);
}

.course-image {
  width: 200px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.course-category {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.course-level {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  align-self: flex-end;
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
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.course-instructor {
  color: #f093fb;
  font-size: 14px;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.course-description {
  color: #6c757d;
  margin-bottom: 20px;
  line-height: 1.5;
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
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f093fb, #f5576c);
  transition: width 0.3s ease;
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
  background: #f093fb;
  color: white;
  border-color: #f093fb;
}

.action-btn:hover {
  border-color: #f093fb;
  color: #f093fb;
}

.action-btn.primary:hover {
  background: #e084ea;
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
  background: #f093fb;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
  transition: all 0.3s ease;
}

.fab:hover {
  background: #e084ea;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(240, 147, 251, 0.4);
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

  .course-card {
    flex-direction: column;
  }

  .course-image {
    width: 100%;
    height: 120px;
    flex-direction: row;
    align-items: center;
  }

  .course-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .fab {
    bottom: 20px;
    right: 20px;
  }
}
</style>
