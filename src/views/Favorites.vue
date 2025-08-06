<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">收藏</h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
            </svg>
          </div>
          <div class="decoration-line"></div>
        </div>
        <p class="page-subtitle">珍藏精华内容，构建个人知识宝库</p>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-number">22</div>
        <div class="stat-label">总收藏数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">15</div>
        <div class="stat-label">课程资源</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">7</div>
        <div class="stat-label">项目案例</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">本周</div>
        <div class="stat-label">最近收藏</div>
      </div>
    </div>

    <div class="filter-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部收藏
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'courses' }"
        @click="activeTab = 'courses'"
      >
        课程资源
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'projects' }"
        @click="activeTab = 'projects'"
      >
        项目案例
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'articles' }"
        @click="activeTab = 'articles'"
      >
        文章资料
      </button>
    </div>

    <div class="search-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
      </svg>
      <input type="text" placeholder="搜索收藏内容..." v-model="searchQuery">
    </div>

    <div class="favorites-container">
      <div class="favorite-card" v-for="item in filteredFavorites" :key="item.id">
        <div class="favorite-image">
          <div class="favorite-type" :class="item.type">{{ getTypeText(item.type) }}</div>
          <div class="favorite-date">{{ item.addedDate }}</div>
          <div class="favorite-actions">
            <button class="action-btn" @click="removeFavorite(item.id)" title="取消收藏">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
              </svg>
            </button>
            <button class="action-btn" @click="shareItem(item.id)" title="分享">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="favorite-content">
          <h3 class="favorite-title">{{ item.title }}</h3>
          <p class="favorite-description">{{ item.description }}</p>
          
          <div class="favorite-meta">
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
              </svg>
              {{ item.author }}
            </div>
            <div class="meta-item" v-if="item.rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
              </svg>
              {{ item.rating }}/5
            </div>
            <div class="meta-item" v-if="item.duration">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
              </svg>
              {{ item.duration }}
            </div>
          </div>

          <div class="favorite-tags">
            <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>

          <div class="favorite-footer">
            <button class="view-btn" @click="viewItem(item)">
              {{ getViewButtonText(item.type) }}
            </button>
            <div class="favorite-source">来源：{{ item.source }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="filteredFavorites.length === 0">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
      </svg>
      <h3>暂无收藏内容</h3>
      <p>收藏感兴趣的课程、项目和文章，在这里统一管理</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

export default {
  name: 'Favorites',
  setup() {
    const router = useRouter()
    const activeTab = ref('all')
    const searchQuery = ref('')
    
    const favorites = ref([
      {
        id: 1,
        title: 'Vue 3 响应式原理深度解析',
        description: '详细解释Vue 3中响应式系统的实现原理，包括Proxy、effect、reactive等核心概念。',
        type: 'courses',
        author: '尤雨溪',
        rating: 4.9,
        duration: '2.5小时',
        tags: ['Vue3', '响应式', '源码分析'],
        source: '慕课网',
        addedDate: '3天前'
      },
      {
        id: 2,
        title: '电商平台微服务架构实战',
        description: '基于Spring Cloud构建的完整电商平台，包含用户服务、商品服务、订单服务等。',
        type: 'projects',
        author: '架构师张三',
        rating: 4.8,
        tags: ['微服务', 'Spring Cloud', '电商'],
        source: 'GitHub',
        addedDate: '1周前'
      },
      {
        id: 3,
        title: 'JavaScript设计模式最佳实践',
        description: '23种设计模式在JavaScript中的应用，提高代码质量和可维护性。',
        type: 'articles',
        author: '前端大牛',
        tags: ['设计模式', 'JavaScript', '最佳实践'],
        source: '掘金',
        addedDate: '2周前'
      },
      {
        id: 4,
        title: 'React Hooks 深入浅出',
        description: '从useState到自定义Hook，全面掌握React Hooks的使用技巧。',
        type: 'courses',
        author: 'Dan Abramov',
        rating: 4.9,
        duration: '3小时',
        tags: ['React', 'Hooks', '函数式组件'],
        source: 'React官网',
        addedDate: '2天前'
      },
      {
        id: 5,
        title: '智能推荐系统实现',
        description: '基于协同过滤和深度学习的推荐系统，支持实时推荐和离线计算。',
        type: 'projects',
        author: '算法工程师李四',
        tags: ['推荐系统', '机器学习', 'Python'],
        source: 'Kaggle',
        addedDate: '5天前'
      },
      {
        id: 6,
        title: 'CSS Grid 布局完全指南',
        description: 'CSS Grid的所有属性和使用场景，从基础到高级应用一网打尽。',
        type: 'articles',
        author: 'CSS大师',
        tags: ['CSS', 'Grid', '布局'],
        source: 'MDN',
        addedDate: '1周前'
      },
      {
        id: 7,
        title: 'TypeScript 进阶教程',
        description: '高级类型、泛型、装饰器等TypeScript进阶特性详解。',
        type: 'courses',
        author: 'TypeScript团队',
        rating: 4.7,
        duration: '4小时',
        tags: ['TypeScript', '类型系统', '进阶'],
        source: 'TypeScript官网',
        addedDate: '4天前'
      },
      {
        id: 8,
        title: '区块链投票系统',
        description: '基于以太坊的去中心化投票系统，支持透明、不可篡改的投票机制。',
        type: 'projects',
        author: '区块链开发者',
        tags: ['区块链', '以太坊', '智能合约'],
        source: 'GitHub',
        addedDate: '1天前'
      }
    ])

    const filteredFavorites = computed(() => {
      let filtered = favorites.value

      if (activeTab.value !== 'all') {
        filtered = filtered.filter(item => item.type === activeTab.value)
      }

      if (searchQuery.value) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
      }

      return filtered
    })

    const getTypeText = (type) => {
      const typeMap = {
        courses: '课程',
        projects: '项目',
        articles: '文章'
      }
      return typeMap[type] || '其他'
    }

    const getViewButtonText = (type) => {
      const buttonMap = {
        courses: '开始学习',
        projects: '查看项目',
        articles: '阅读文章'
      }
      return buttonMap[type] || '查看详情'
    }

    const viewItem = (item) => {
      alert(`打开${item.title}`)
    }

    const removeFavorite = (itemId) => {
      if (confirm('确定要取消收藏吗？')) {
        const index = favorites.value.findIndex(item => item.id === itemId)
        if (index > -1) {
          favorites.value.splice(index, 1)
        }
      }
    }

    const shareItem = (itemId) => {
      alert(`分享收藏项目 ${itemId}`)
    }

    return {
      activeTab,
      searchQuery,
      favorites,
      filteredFavorites,
      getTypeText,
      getViewButtonText,
      viewItem,
      removeFavorite,
      shareItem
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
  color: #fa709a;
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
  font-size: 14px;
}

.tab-btn.active {
  background: #fa709a;
  color: white;
}

.search-box {
  position: relative;
  margin-bottom: 24px;
  max-width: 400px;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 36px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.search-box input:focus {
  outline: none;
  border-color: #fa709a;
}

.favorites-container {
  display: grid;
  gap: 20px;
}

.favorite-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
}

.favorite-card:hover {
  border-color: #fa709a;
  box-shadow: 0 4px 12px rgba(250, 112, 154, 0.1);
}

.favorite-image {
  width: 200px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.favorite-type {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.favorite-type.courses {
  background: rgba(102, 126, 234, 0.8);
}

.favorite-type.projects {
  background: rgba(67, 233, 123, 0.8);
}

.favorite-type.articles {
  background: rgba(74, 172, 254, 0.8);
}

.favorite-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  align-self: flex-end;
}

.favorite-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.favorite-card:hover .favorite-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.favorite-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.favorite-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.favorite-description {
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.5;
  flex: 1;
}

.favorite-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6c757d;
  font-size: 14px;
}

.favorite-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tag {
  background: #f8f9ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.favorite-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-btn {
  background: #fa709a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #e85d8b;
}

.favorite-source {
  color: #6c757d;
  font-size: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
  color: #6c757d;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
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

  .filter-tabs {
    flex-wrap: wrap;
  }

  .favorite-card {
    flex-direction: column;
  }

  .favorite-image {
    width: 100%;
    height: 120px;
    flex-direction: row;
    align-items: center;
  }

  .favorite-date {
    align-self: center;
  }

  .favorite-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
