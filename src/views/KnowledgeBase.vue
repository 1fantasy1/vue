<template>
  <div class="knowledge-base">
    <!-- 头部搜索区域 -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">📚 知识库</h1>
        <p class="page-subtitle">浏览和搜索项目知识资源</p>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索文档、教程、资源..."
              class="search-input"
              @input="handleSearch"
            />
          </div>
          <div class="filter-tags">
            <button 
              v-for="tag in filterTags" 
              :key="tag.id"
              class="filter-tag"
              :class="{ active: tag.active }"
              @click="toggleFilter(tag)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="categories-section">
      <h3 class="section-title">知识分类</h3>
      <div class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card"
          @click="selectCategory(category)"
          :class="{ active: selectedCategory?.id === category.id }"
        >
          <div class="category-icon" :style="{ background: category.color }">
            {{ category.icon }}
          </div>
          <h4 class="category-name">{{ category.name }}</h4>
          <p class="category-count">{{ category.count }} 个文档</p>
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="documents-section">
      <div class="section-header">
        <h3 class="section-title">
          {{ selectedCategory ? selectedCategory.name : '全部文档' }}
        </h3>
        <div class="view-controls">
          <button 
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
            </svg>
          </button>
          <button 
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="documents-container" :class="viewMode">
        <div 
          v-for="document in filteredDocuments" 
          :key="document.id"
          class="document-card"
          @click="openDocument(document)"
        >
          <div class="document-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <div class="document-info">
            <h4 class="document-title">{{ document.title }}</h4>
            <p class="document-description">{{ document.description }}</p>
            <div class="document-meta">
              <span class="document-type">{{ document.type }}</span>
              <span class="document-date">{{ document.updatedAt }}</span>
              <span class="document-size">{{ document.size }}</span>
            </div>
            <div class="document-tags">
              <span 
                v-for="tag in document.tags" 
                :key="tag"
                class="document-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="document-actions">
            <button class="action-btn" @click.stop="openCollectionModal(document)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
              </svg>
            </button>
            <button class="action-btn" @click.stop="shareDocument(document)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredDocuments.length === 0" class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>暂无相关文档</h3>
        <p>尝试调整搜索条件或浏览其他分类</p>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div class="fab-container">
      <button class="fab" @click="uploadDocument">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
      </button>
    </div>

    <!-- 收藏弹窗 -->
    <CollectionModal
      :model-value="collectionModalVisible"
      @update:modelValue="v => (collectionModalVisible = v)"
      :is-editing="isEditingCollection"
      :initial="collectionForm"
      :show-folder="false"
      :types="['knowledge_article']"
      title-text="收藏知识文档"
      @submit="onCollectionSubmit"
    />
  </div>
</template>

<script>
import CollectionModal from '@/components/CollectionModal.vue'

export default {
  name: 'KnowledgeBase',
  components: { CollectionModal },
  data() {
    return {
      searchQuery: '',
      viewMode: 'grid',
      selectedCategory: null,
      filterTags: [
        { id: 1, name: '全部', active: true },
        { id: 2, name: '最新', active: false },
        { id: 3, name: '热门', active: false },
        { id: 4, name: '我的收藏', active: false }
      ],
      categories: [
        {
          id: 1,
          name: '技术文档',
          icon: '💻',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          count: 45
        },
        {
          id: 2,
          name: '项目指南',
          icon: '📋',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          count: 32
        },
        {
          id: 3,
          name: '设计规范',
          icon: '🎨',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          count: 28
        },
        {
          id: 4,
          name: 'API文档',
          icon: '🔗',
          color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          count: 23
        },
        {
          id: 5,
          name: '教程视频',
          icon: '🎥',
          color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          count: 18
        },
        {
          id: 6,
          name: '工具资源',
          icon: '🛠️',
          color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          count: 15
        }
      ],
      documents: [
        {
          id: 1,
          title: 'Vue.js 3.0 完整开发指南',
          description: '从基础到高级的Vue.js 3.0开发教程，包含组合式API、状态管理等内容',
          type: 'PDF',
          size: '2.3MB',
          updatedAt: '2024-08-01',
          tags: ['Vue', '前端', '教程'],
          categoryId: 1,
          favorite: false
        },
        {
          id: 2,
          title: '项目架构设计文档',
          description: '系统架构设计原则、模式和最佳实践',
          type: 'DOC',
          size: '1.8MB',
          updatedAt: '2024-07-28',
          tags: ['架构', '设计', '文档'],
          categoryId: 2,
          favorite: true
        },
        {
          id: 3,
          title: 'UI/UX 设计规范',
          description: '用户界面和用户体验设计的标准规范和指导原则',
          type: 'PDF',
          size: '4.1MB',
          updatedAt: '2024-07-25',
          tags: ['UI', 'UX', '设计'],
          categoryId: 3,
          favorite: false
        },
        {
          id: 4,
          title: 'RESTful API 开发规范',
          description: 'REST API设计原则、最佳实践和示例代码',
          type: 'MD',
          size: '856KB',
          updatedAt: '2024-07-22',
          tags: ['API', 'REST', '后端'],
          categoryId: 4,
          favorite: true
        },
        {
          id: 5,
          title: 'Git 版本控制入门视频',
          description: 'Git基础操作、分支管理和协作开发的视频教程',
          type: 'MP4',
          size: '125MB',
          updatedAt: '2024-07-20',
          tags: ['Git', '版本控制', '视频'],
          categoryId: 5,
          favorite: false
        },
        {
          id: 6,
          title: '开发工具配置指南',
          description: 'VS Code、Node.js等开发环境的安装和配置说明',
          type: 'PDF',
          size: '1.2MB',
          updatedAt: '2024-07-18',
          tags: ['工具', '配置', '环境'],
          categoryId: 6,
          favorite: false
        }
      ],
  currentDocument: null,
      // 收藏弹窗
      collectionModalVisible: false,
      isEditingCollection: false,
  collectionForm: { id: null, title: '', type: 'knowledge_article', url: '', content: '', tags: '', folder_id: null }
    }
  },
  computed: {
    filteredDocuments() {
      let result = this.documents

      // 按分类筛选
      if (this.selectedCategory) {
        result = result.filter(doc => doc.categoryId === this.selectedCategory.id)
      }

      // 按搜索词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(doc => 
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // 按标签筛选
      const activeFilter = this.filterTags.find(tag => tag.active && tag.name !== '全部')
      if (activeFilter) {
        switch (activeFilter.name) {
          case '最新':
            result = result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            break
          case '热门':
            result = result.sort((a, b) => b.id - a.id) // 简单模拟热门度
            break
          case '我的收藏':
            result = result.filter(doc => doc.favorite)
            break
        }
      }

      return result
    }
  },
  methods: {
    handleSearch() {
      // 搜索逻辑已在computed中处理
    },
    toggleFilter(tag) {
      this.filterTags.forEach(t => t.active = false)
      tag.active = true
    },
    selectCategory(category) {
      this.selectedCategory = this.selectedCategory?.id === category.id ? null : category
    },
    openDocument(document) {
      alert(`打开文档: ${document.title}`)
    },
    openCollectionModal(document) {
      this.isEditingCollection = false
      this.currentDocument = document
      this.collectionForm = {
        id: null,
        title: document.title,
        type: 'knowledge_article',
        url: '',
        content: document.description,
        tags: Array.isArray(document.tags) ? document.tags.join(',') : ''
      }
      this.collectionModalVisible = true
    },
    async onCollectionSubmit(payload) {
      try {
        const { ApiService } = await import('@/services/api.js')
        const toTagsString = (val) => Array.isArray(val) ? val.join(',') : (typeof val === 'string' ? val : undefined)
        const res = await ApiService.createCollection({
          ...payload,
          type: 'knowledge_article',
          tags: toTagsString(payload.tags)
        })
        if (res?.data?.success === false) throw new Error(res.data.message || '收藏失败')
        this.collectionModalVisible = false
        if (this.currentDocument) this.currentDocument.favorite = true
      } catch (e) {
        alert(e.message || '收藏失败')
      }
    },
    shareDocument(document) {
      alert(`分享文档: ${document.title}`)
    },
    uploadDocument() {
      alert('上传文档功能开发中...')
    }
  }
}
</script>

<style scoped>
.knowledge-base {
  padding: 24px;
  background: #f8f9fa;
  min-height: calc(100vh - 48px);
}

/* 头部区域 */
.header-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 32px;
}

.search-container {
  margin-bottom: 16px;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto 24px;
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
  padding: 16px 16px 16px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.filter-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 8px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.filter-tag.active,
.filter-tag:hover {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* 分类区域 */
.categories-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.category-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover,
.category-card.active {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px;
}

.category-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.category-count {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

/* 文档区域 */
.documents-section {
  margin-bottom: 80px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn.active,
.view-btn:hover {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.documents-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.documents-container.list .document-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
}

.documents-container.list .document-icon {
  margin-right: 16px;
  margin-bottom: 0;
}

.documents-container.list .document-info {
  flex: 1;
  text-align: left;
}

.document-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.document-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.document-icon {
  width: 48px;
  height: 48px;
  background: #f8f9ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  margin: 0 auto 16px;
}

.document-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.4;
}

.document-description {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
}

.document-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.document-type,
.document-date,
.document-size {
  background: #f8f9ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.document-tags {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.document-tag {
  background: #e9ecef;
  color: #6c757d;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.document-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: #2c3e50;
}

/* 浮动按钮 */
.fab-container {
  position: fixed;
  bottom: 80px;
  right: 24px;
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
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .knowledge-base {
    padding: 16px;
  }
  
  .header-section {
    padding: 24px 20px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .documents-container.grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .fab-container {
    bottom: 100px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .filter-tags {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .document-meta {
    justify-content: flex-start;
  }
  
  .document-tags {
    justify-content: flex-start;
  }
  
  .document-actions {
    justify-content: flex-start;
  }
}
</style>

