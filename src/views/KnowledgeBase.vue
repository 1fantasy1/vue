<template>
  <div class="knowledge-base">
    <!-- 头部搜索区域 -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">📚 知识库</h1>
        <p class="page-subtitle">浏览和搜索项目知识资源</p>

        <!-- 知识库选择与状态过滤 -->
        <div class="kb-toolbar">
          <div class="kb-select">
            <label for="kb">知识库：</label>
            <select id="kb" v-model="selectedKbId" @change="onKbChange">
              <option v-for="kb in knowledgeBases" :key="kb.id" :value="kb.id">
                {{ kb.name }} ({{ kb.access_type === 'private' ? '私有' : '公开' }})
              </option>
            </select>
            <button type="button" class="kb-btn" @click="openKbModal">新建知识库</button>
            <button type="button" class="kb-btn secondary" @click="editCurrentKb" v-if="selectedKbId">编辑</button>
          </div>
          <div class="kb-status-filter">
            <label for="status">状态：</label>
            <select id="status" v-model="statusFilter" @change="loadDocuments">
              <option value="">全部</option>
              <option value="processing">processing</option>
              <option value="completed">completed</option>
              <option value="failed">failed</option>
            </select>
          </div>
        </div>
        
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

    <!-- 顶部页签：文档 / 文章 -->
    <div class="tabs">
      <button class="tab" :class="{ active: activeTab === 'documents' }" @click="switchTab('documents')">文档</button>
      <button class="tab" :class="{ active: activeTab === 'articles' }" @click="switchTab('articles')">文章</button>
    </div>

    <!-- 分类导航 -->
    <div v-if="activeTab === 'documents'" class="categories-section">
      <h3 class="section-title">知识分类</h3>
      <div class="categories-grid">
        <div 
          v-for="category in categoriesWithCount" 
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
  <div v-if="activeTab === 'documents'" class="documents-section">
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
              <span class="document-status" :class="`status-${document.status}`">{{ document.status }}</span>
              <span v-if="document.totalChunks" class="document-chunks">{{ document.totalChunks }} 块</span>
            </div>
            <div class="document-tags">
              <span 
                v-for="tag in (document.tags || [])" 
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
            <button class="action-btn danger" title="删除" @click.stop="deleteDocument(document)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6Z"/>
              </svg>
            </button>
            <button v-if="document.status === 'completed'" class="action-btn info" title="查看内容" @click.stop="viewDocumentContent(document)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
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

    <!-- 文章列表 -->
    <div v-if="activeTab === 'articles'" class="articles-section">
      <div class="section-header">
        <h3 class="section-title">知识文章</h3>
        <div class="actions">
          <button class="kb-btn" @click="openCreateArticle">新建文章</button>
        </div>
      </div>

      <div class="articles-list">
        <div v-for="a in articles" :key="a.id" class="article-item">
          <div class="article-main" @click="previewArticle(a)">
            <div class="article-title">{{ a.title }}</div>
            <div class="article-meta">
              <span>{{ a.version || 'v1' }}</span>
              <span>{{ formatDate(a.updated_at || a.created_at) }}</span>
              <span v-if="a.tags" class="article-tags">{{ a.tags }}</span>
            </div>
          </div>
          <div class="article-actions">
            <button class="action-btn" title="编辑" @click.stop="openEditArticle(a)">✏️</button>
            <button class="action-btn danger" title="删除" @click.stop="deleteArticle(a)">🗑️</button>
          </div>
        </div>
      </div>

      <div v-if="articles.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无文章</h3>
        <p>点击“新建文章”开始创作</p>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div v-if="activeTab === 'documents'" class="fab-container">
      <button class="fab" @click="triggerUpload">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
      </button>
      <input ref="fileInput" type="file" class="hidden-file-input" @change="onFileSelected" />
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

    <!-- 文章编辑弹窗（简单实现） -->
    <div v-if="articleModalVisible" class="modal-mask">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditingArticle ? '编辑文章' : '新建文章' }}</h3>
          <button class="close" @click="closeArticleModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label>标题</label>
            <input v-model="articleForm.title" type="text" placeholder="文章标题" />
          </div>
          <div class="form-row">
            <label>版本</label>
            <input v-model="articleForm.version" type="text" placeholder="可选，如 v1.0" />
          </div>
          <div class="form-row">
            <label>标签</label>
            <input v-model="articleForm.tags" type="text" placeholder="用逗号分隔" />
          </div>
          <div class="form-row">
            <label>内容</label>
            <textarea v-model="articleForm.content" rows="8" placeholder="文章内容..." />
          </div>
        </div>
        <div class="modal-footer">
          <button class="kb-btn" @click="submitArticle" :disabled="!articleForm.title">{{ isEditingArticle ? '保存' : '创建' }}</button>
        </div>
      </div>
    </div>

    <!-- 知识库创建/编辑弹窗 -->
    <div v-if="kbModalVisible" class="modal-mask">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ isEditingKb ? '编辑知识库' : '新建知识库' }}</h3>
          <button class="close" @click="closeKbModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label>名称 *</label>
            <input v-model="kbForm.name" type="text" placeholder="知识库名称" />
          </div>
          <div class="form-row">
            <label>描述</label>
            <textarea v-model="kbForm.description" rows="3" placeholder="知识库描述（可选）" />
          </div>
          <div class="form-row">
            <label>访问类型</label>
            <select v-model="kbForm.access_type">
              <option value="private">私有 - 只有我可以访问</option>
              <option value="public">公开 - 所有用户可查看</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="kb-btn" @click="submitKb" :disabled="!kbForm.name">{{ isEditingKb ? '保存' : '创建' }}</button>
          <button v-if="isEditingKb" class="kb-btn danger" @click="deleteCurrentKb">删除知识库</button>
        </div>
      </div>
    </div>

    <!-- 文档内容查看弹窗 -->
    <div v-if="contentModalVisible" class="modal-mask">
      <div class="modal-card large">
        <div class="modal-header">
          <h3>文档内容：{{ currentDocument?.title }}</h3>
          <div class="modal-header-actions">
            <button class="kb-btn secondary" @click="viewDocumentChunks" v-if="currentDocument">查看分块</button>
            <button class="close" @click="closeContentModal">×</button>
          </div>
        </div>
        <div class="modal-body">
          <div v-if="loadingContent" class="loading">正在加载内容...</div>
          <div v-else-if="documentContent" class="document-content">
            <pre>{{ documentContent }}</pre>
          </div>
          <div v-else class="empty-content">无法获取文档内容</div>
        </div>
      </div>
    </div>

    <!-- 文档分块查看弹窗 -->
    <div v-if="chunksModalVisible" class="modal-mask">
      <div class="modal-card large">
        <div class="modal-header">
          <h3>文档分块：{{ currentDocument?.title }}</h3>
          <button class="close" @click="closeChunksModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="loadingChunks" class="loading">正在加载分块...</div>
          <div v-else-if="documentChunks.length > 0" class="chunks-list">
            <div v-for="chunk in documentChunks" :key="chunk.id" class="chunk-item">
              <div class="chunk-header">
                <span class="chunk-index">第 {{ chunk.chunk_index + 1 }} 块</span>
                <span class="chunk-id">ID: {{ chunk.id }}</span>
              </div>
              <div class="chunk-content">{{ chunk.content }}</div>
            </div>
          </div>
          <div v-else class="empty-content">无分块数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CollectionModal from '@/components/CollectionModal.vue'
import { ApiService } from '@/services/api.js'

export default {
  name: 'KnowledgeBase',
  components: { CollectionModal },
  data() {
    return {
      searchQuery: '',
      viewMode: 'grid',
      selectedCategory: null,
      knowledgeBases: [],
      selectedKbId: null,
      statusFilter: '',
      loadingDocs: false,
      activeTab: 'documents',
      articles: [],
      articlesLoaded: false,
      // 知识库弹窗
      kbModalVisible: false,
      isEditingKb: false,
      kbForm: { id: null, name: '', description: '', access_type: 'private' },
      // 文档内容查看
      contentModalVisible: false,
      chunksModalVisible: false,
      loadingContent: false,
      loadingChunks: false,
      documentContent: '',
      documentChunks: [],
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
  documents: [],
  currentDocument: null,
      // 收藏弹窗
      collectionModalVisible: false,
      isEditingCollection: false,
  collectionForm: { id: null, title: '', type: 'knowledge_article', url: '', content: '', tags: '', folder_id: null },
  // 文章弹窗
  articleModalVisible: false,
  isEditingArticle: false,
  articleForm: { id: null, title: '', content: '', version: '', tags: '' }
    }
  },
  async created() {
    await this.init()
  },
  computed: {
    // 动态计算每个分类的文档数量
    categoriesWithCount() {
      return this.categories.map(category => ({
        ...category,
        count: this.documents.filter(doc => doc.categoryId === category.id).length
      }))
    },
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
          (doc.description || '').toLowerCase().includes(query) ||
          (Array.isArray(doc.tags) ? doc.tags : []).some(tag => String(tag).toLowerCase().includes(query))
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
    switchTab(tab) {
      this.activeTab = tab
      if (tab === 'articles' && !this.articlesLoaded) {
        this.loadArticles()
      }
    },
    async init() {
      try {
        const res = await ApiService.getKnowledgeBases()
        const list = res?.data?.data || []
        this.knowledgeBases = Array.isArray(list) ? list : []
        if (this.knowledgeBases.length > 0) {
          this.selectedKbId = this.knowledgeBases[0].id
          await this.loadDocuments()
        }
      } catch (e) {
        console.error(e)
        alert(e.message || '加载知识库失败')
      }
    },
    async onKbChange() {
      await this.loadDocuments()
      if (this.activeTab === 'articles') this.loadArticles()
    },
    async loadDocuments() {
      if (!this.selectedKbId) return
      this.loadingDocs = true
      try {
        const res = await ApiService.getKnowledgeBaseDocuments(this.selectedKbId, this.statusFilter || null)
        console.log('Documents API response:', res) // 调试日志
        
        // 更灵活地处理响应数据结构
        let raw = []
        
        // 基于 createResponse 函数的结构 { data: { success, data, message } }
        if (res?.data?.data) {
          const apiData = res.data.data
          if (Array.isArray(apiData)) {
            raw = apiData
          } else if (apiData.documents && Array.isArray(apiData.documents)) {
            raw = apiData.documents
          } else if (apiData.items && Array.isArray(apiData.items)) {
            raw = apiData.items
          } else if (apiData.list && Array.isArray(apiData.list)) {
            raw = apiData.list
          }
        } else if (res?.data) {
          // 后备解析方案
          if (Array.isArray(res.data)) {
            raw = res.data
          } else if (res.data.success !== false && Array.isArray(res.data.documents)) {
            raw = res.data.documents
          } else if (res.data.success !== false && Array.isArray(res.data.items)) {
            raw = res.data.items
          }
        }
        
        console.log('Parsed documents:', raw) // 调试日志
        
        this.documents = (Array.isArray(raw) ? raw : []).map(d => ({
          id: d.id,
          title: d.file_name || d.filename || d.name || `文档 #${d.id}`,
          description: d.processing_message || d.description || '',
          type: d.file_type || d.fileType || d.type || '-',
          size: d.file_size || d.fileSize || d.size || '-',
          updatedAt: this.formatDate(d.updated_at || d.created_at || d.upload_time),
          tags: d.tags || [],
          // 临时方案：根据文档类型分配分类ID，让分类功能可以工作
          categoryId: this.getCategoryIdByFileType(d.file_type || d.fileType || d.type),
          favorite: d.favorite || false,
          status: d.status || 'processing',
          totalChunks: d.total_chunks || d.chunks || 0
        }))
        
        console.log('Final documents list:', this.documents) // 调试日志
      } catch (e) {
        console.error('Load documents error:', e)
        alert(e.message || '加载文档失败')
      } finally {
        this.loadingDocs = false
      }
    },
    getCategoryIdByFileType(fileType) {
      // 根据文件类型映射到分类ID，让分类功能可以工作
      if (!fileType || fileType === '-') {
        return Math.floor(Math.random() * 6) + 1 // 随机分配
      }
      
      const type = fileType.toLowerCase()
      if (type.includes('doc') || type.includes('pdf') || type.includes('txt')) {
        return 1 // 技术文档
      } else if (type.includes('ppt') || type.includes('slide')) {
        return 2 // 项目指南
      } else if (type.includes('img') || type.includes('png') || type.includes('jpg')) {
        return 3 // 设计规范
      } else if (type.includes('json') || type.includes('xml')) {
        return 4 // API文档
      } else if (type.includes('mp4') || type.includes('avi')) {
        return 5 // 教程视频
      } else {
        return 6 // 工具资源
      }
    },
    async loadArticles() {
      if (!this.selectedKbId) return
      try {
        const res = await ApiService.getKnowledgeBaseArticles(this.selectedKbId)
        const list = res?.data?.data || []
        this.articles = Array.isArray(list) ? list : []
        this.articlesLoaded = true
      } catch (e) {
        console.error(e)
        alert(e.message || '加载文章失败')
      }
    },
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
      if (!this.selectedKbId) return
      this.$router.push({ name: 'DocumentDetail', params: { kbId: this.selectedKbId, docId: document.id } })
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
    triggerUpload() {
      this.$refs.fileInput && this.$refs.fileInput.click()
    },
    async onFileSelected(e) {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      if (!this.selectedKbId) {
        alert('请先选择知识库')
        return
      }
      try {
        console.log('Uploading file:', file.name, 'to KB:', this.selectedKbId) // 调试日志
        const res = await ApiService.uploadDocument(this.selectedKbId, file)
        console.log('Upload response:', res) // 调试日志
        
        if (res?.data?.success === false) throw new Error(res.data.message || '上传失败')
        alert('上传成功，后台正在处理...')
        
        // 延迟1秒后重新加载，确保后端已保存
        setTimeout(async () => {
          await this.loadDocuments()
        }, 1000)
        
      } catch (err) {
        console.error('Upload error:', err)
        alert(err.message || '上传失败')
      } finally {
        e.target.value = ''
      }
    },
    async deleteDocument(document) {
      if (!this.selectedKbId) return
      if (!confirm(`确认删除文档：${document.title}？该操作不可恢复`)) return
      try {
        const res = await ApiService.deleteKnowledgeDocument(this.selectedKbId, document.id)
        if (res?.data?.success === false) throw new Error(res.data.message || '删除失败')
        this.documents = this.documents.filter(d => d.id !== document.id)
      } catch (e) {
        console.error(e)
        alert(e.message || '删除失败')
      }
    },
    openCreateArticle() {
      this.isEditingArticle = false
      this.articleForm = { id: null, title: '', content: '', version: '', tags: '' }
      this.articleModalVisible = true
    },
    openEditArticle(article) {
      this.isEditingArticle = true
      this.articleForm = {
        id: article.id,
        title: article.title || '',
        content: article.content || '',
        version: article.version || '',
        tags: article.tags || ''
      }
      this.articleModalVisible = true
    },
    closeArticleModal() {
      this.articleModalVisible = false
    },
    async submitArticle() {
      if (!this.selectedKbId) return
      try {
        const payload = {
          title: this.articleForm.title,
          content: this.articleForm.content || undefined,
          version: this.articleForm.version || undefined,
          tags: this.articleForm.tags || undefined
        }
        let res
        if (this.isEditingArticle && this.articleForm.id) {
          res = await ApiService.updateArticle(this.articleForm.id, payload)
        } else {
          res = await ApiService.createKnowledgeBaseArticle(this.selectedKbId, payload)
        }
        if (res?.data?.success === false) throw new Error(res.data.message || '保存失败')
        this.articleModalVisible = false
        await this.loadArticles()
      } catch (e) {
        console.error(e)
        alert(e.message || '保存失败')
      }
    },
    previewArticle(article) {
      alert(`预览文章：${article.title}`)
    },
    async deleteArticle(article) {
      if (!confirm(`确认删除文章：${article.title}？`)) return
      try {
        const res = await ApiService.deleteArticle(article.id)
        if (res?.data?.success === false) throw new Error(res.data.message || '删除失败')
        this.articles = this.articles.filter(a => a.id !== article.id)
      } catch (e) {
        console.error(e)
        alert(e.message || '删除失败')
      }
    },
    openKbModal() {
      this.isEditingKb = false
      this.kbForm = { id: null, name: '', description: '', access_type: 'private' }
      this.kbModalVisible = true
    },
    async editCurrentKb() {
      if (!this.selectedKbId) return
      try {
        const res = await ApiService.getKnowledgeBase(this.selectedKbId)
        const kb = res?.data?.data
        if (!kb) throw new Error('知识库不存在')
        this.isEditingKb = true
        this.kbForm = {
          id: kb.id,
          name: kb.name || '',
          description: kb.description || '',
          access_type: kb.access_type || 'private'
        }
        this.kbModalVisible = true
      } catch (e) {
        console.error(e)
        alert(e.message || '获取知识库信息失败')
      }
    },
    closeKbModal() {
      this.kbModalVisible = false
    },
    async submitKb() {
      try {
        const payload = {
          name: this.kbForm.name,
          description: this.kbForm.description || undefined,
          access_type: this.kbForm.access_type
        }
        let res
        if (this.isEditingKb && this.kbForm.id) {
          res = await ApiService.updateKnowledgeBase(this.kbForm.id, payload)
        } else {
          res = await ApiService.createKnowledgeBase(payload)
        }
        if (res?.data?.success === false) throw new Error(res.data.message || '保存失败')
        this.kbModalVisible = false
        await this.init()
      } catch (e) {
        console.error(e)
        alert(e.message || '保存失败')
      }
    },
    async deleteCurrentKb() {
      if (!this.kbForm.id) return
      if (!confirm(`确认删除知识库："${this.kbForm.name}"？此操作将删除其中的所有文章和文档，不可恢复`)) return
      try {
        const res = await ApiService.deleteKnowledgeBase(this.kbForm.id)
        if (res?.data?.success === false) throw new Error(res.data.message || '删除失败')
        this.kbModalVisible = false
        await this.init()
      } catch (e) {
        console.error(e)
        alert(e.message || '删除失败')
      }
    },
    async viewDocumentContent(document) {
      if (!this.selectedKbId || document.status !== 'completed') return
      this.currentDocument = document
      this.contentModalVisible = true
      this.loadingContent = true
      this.documentContent = ''
      
      try {
        const res = await ApiService.getKnowledgeDocumentContent(this.selectedKbId, document.id)
        this.documentContent = res?.data?.data?.content || '无内容'
      } catch (e) {
        console.error(e)
        this.documentContent = `加载失败: ${e.message}`
      } finally {
        this.loadingContent = false
      }
    },
    closeContentModal() {
      this.contentModalVisible = false
      this.currentDocument = null
    },
    async viewDocumentChunks() {
      if (!this.selectedKbId || !this.currentDocument) return
      this.chunksModalVisible = true
      this.loadingChunks = true
      this.documentChunks = []
      
      try {
        const res = await ApiService.getKnowledgeDocumentChunks(this.selectedKbId, this.currentDocument.id)
        this.documentChunks = res?.data?.data || []
      } catch (e) {
        console.error(e)
        alert(`加载分块失败: ${e.message}`)
      } finally {
        this.loadingChunks = false
      }
    },
    closeChunksModal() {
      this.chunksModalVisible = false
    },
    async createKbPrompt() {
      const name = prompt('请输入知识库名称')
      if (!name) return
      try {
        const res = await ApiService.createKnowledgeBase({ name })
        if (res?.data?.success === false) throw new Error(res.data.message || '创建失败')
        await this.init()
      } catch (e) {
        console.error(e)
        alert(e.message || '创建失败')
      }
    },
    formatDate(dt) {
      if (!dt) return ''
      try {
        const d = new Date(dt)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const da = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${da}`
      } catch { return '' }
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

/* KB 工具栏 */
.kb-toolbar { display: flex; gap: 16px; align-items: center; justify-content: center; margin: 8px 0 0; }
.kb-select select, .kb-status-filter select { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
.kb-btn { margin-left: 8px; padding: 6px 10px; background: #4f46e5; color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
.hidden-file-input { display: none; }

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

.tabs { display: flex; gap: 8px; justify-content: center; margin: 12px 0 24px; }
.tab { padding: 8px 14px; border: 2px solid #e9ecef; border-radius: 20px; background: #fff; cursor: pointer; color: #6b7280; }
.tab.active, .tab:hover { border-color: #667eea; background: #667eea; color: #fff; }

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

.document-status { padding: 2px 6px; border-radius: 6px; background: #eef2ff; color: #4338ca; font-size: 12px; }
.document-status.status-processing { background: #fff7ed; color: #c2410c; }
.document-status.status-completed { background: #ecfdf5; color: #047857; }
.document-status.status-failed { background: #fef2f2; color: #b91c1c; }

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

.action-btn.danger { color: #ef4444; border-color: #fecaca; }
.action-btn.danger:hover { background: #ef4444; color: #fff; border-color: #ef4444; }
.action-btn.info { color: #3b82f6; border-color: #dbeafe; }
.action-btn.info:hover { background: #3b82f6; color: #fff; border-color: #3b82f6; }

.kb-btn.secondary { background: #6b7280; }
.kb-btn.secondary:hover { background: #4b5563; }

/* 弹窗样式增强 */
.modal-card.large { width: min(90vw, 1000px); max-height: 80vh; }
.modal-header-actions { display: flex; gap: 8px; align-items: center; }
.document-content { max-height: 60vh; overflow-y: auto; background: #f9fafb; padding: 12px; border-radius: 8px; }
.document-content pre { white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5; }

.chunks-list { max-height: 60vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.chunk-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; }
.chunk-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #6b7280; }
.chunk-content { font-size: 13px; line-height: 1.5; white-space: pre-wrap; }

.loading, .empty-content { text-align: center; padding: 40px; color: #6b7280; }

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

/* 文章区域 */
.articles-section .articles-list { display: flex; flex-direction: column; gap: 8px; }
.article-item { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 2px solid #e9ecef; border-radius: 12px; padding: 14px 16px; }
.article-main { flex: 1; cursor: pointer; }
.article-title { font-weight: 600; color: #1f2937; margin-bottom: 6px; }
.article-meta { display: flex; gap: 12px; font-size: 12px; color: #6b7280; }
.article-actions { display: flex; gap: 8px; }

/* 简易弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal-card { width: min(720px, 92vw); background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.15); overflow: hidden; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.modal-header .close { background: transparent; border: 0; font-size: 20px; cursor: pointer; color: #6b7280; }
.modal-body { padding: 12px 16px; display: grid; gap: 12px; }
.form-row { display: grid; gap: 6px; }
.form-row input, .form-row textarea { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
.modal-footer { display: flex; justify-content: flex-end; padding: 10px 16px; border-top: 1px solid #e5e7eb; }

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

