<template>
  <div class="knowledge-base" @click="openActionMenuId = null">
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

    <!-- 主体双栏布局：左侧知识库侧栏 + 右侧内容 -->
    <div class="content-layout">
      <!-- 左侧：知识库侧栏 -->
      <aside class="kb-sidebar">
        <div class="kb-sidebar-header">
          <div class="kb-sidebar-title">知识库</div>
          <BaseButton variant="primary" @click="openKbModal">新建</BaseButton>
        </div>
        <div class="kb-list" v-if="knowledgeBases && knowledgeBases.length">
          <div
            v-for="kb in knowledgeBases"
            :key="kb.id"
            class="kb-item"
            :class="{ active: kb.id === selectedKbId }"
            @click="selectKb(kb.id)"
          >
            <div class="kb-item-name">{{ kb.name }}</div>
            <div class="kb-item-meta">{{ kb.access_type === 'private' ? '私有' : '公开' }}</div>
          </div>
        </div>
        <div v-else class="kb-empty">暂无知识库，请新建</div>
        <div class="kb-sidebar-actions">
          <BaseButton variant="secondary" @click="editCurrentKb" :disabled="!selectedKbId">编辑当前</BaseButton>
        </div>
      </aside>

      <!-- 右侧：主内容区 -->
      <section class="kb-main">
        <!-- 顶部页签：文档 / 文章 -->
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'documents' }" @click="switchTab('documents')">文档</button>
          <button class="tab" :class="{ active: activeTab === 'articles' }" @click="switchTab('articles')">文章</button>
        </div>

        

        <!-- 文档列表 -->
        <div v-if="activeTab === 'documents'" class="documents-section">
          <div class="section-header">
            <h3 class="section-title">知识库文档</h3>
            <div class="section-actions">
        <div class="kb-status-filter inline">
                <label for="status-inline">状态：</label>
                <select id="status-inline" v-model="statusFilter" @change="loadDocuments">
          <option value="">全部</option>
          <option value="processing">处理中</option>
          <option value="completed">已完成</option>
          <option value="failed">失败</option>
                </select>
              </div>
            </div>
          </div>

          <div class="documents-container list">
            <div 
              v-for="document in filteredDocuments" 
              :key="document.id"
              class="document-card"
              :class="{ 'menu-open': openActionMenuId === document.id }"
              @click="openDocument(document)"
            >
              <div class="document-info">
                <h4 class="document-title">{{ document.title }}</h4>
              </div>
              <div class="document-actions">
                <!-- 更多菜单（包含全部操作） -->
                <div class="more-actions">
                  <button class="action-btn" title="更多" @click.stop="toggleActionMenu(document.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,8A2,2 0 1,1 12,12A2,2 0 1,1 12,8M4,8A2,2 0 1,1 4,12A2,2 0 1,1 4,8M20,8A2,2 0 1,1 20,12A2,2 0 1,1 20,8"/>
                    </svg>
                  </button>
                  <div v-if="openActionMenuId === document.id" class="action-menu" @click.stop>
                    <div class="menu-item-embed">
                      <CollectButton
                        content-type="knowledge_document"
                        :content-id="document.id"
                        :initial-collected="document.isInCollection"
                        :show-text="true"
                        collected-text="取消收藏"
                        not-collected-text="添加到收藏"
                        :show-icon="false"
                        :show-spinner="false"
                        @collected="onDocumentCollected"
                        @message="showMessage"
                      />
                    </div>
                    <button v-if="document.status === 'completed'" class="menu-item" @click.stop="openActionMenuId = null; viewDocumentContent(document)">查看内容</button>
                    <button class="menu-item" @click.stop="openActionMenuId = null; shareDocument(document)">分享</button>
                    <button class="menu-item danger" @click.stop="openActionMenuId = null; deleteDocument(document)">删除</button>
                  </div>
                </div>
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
              <BaseButton variant="primary" @click="openCreateArticle">新建文章</BaseButton>
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
      </section>
    </div>

    

    <!-- 文章编辑弹窗（简单实现） -->
    <BaseModal :show="articleModalVisible" :title="isEditingArticle ? '编辑文章' : '新建文章'" @close="closeArticleModal">
      <div class="modal-body">
        <div class="form-row">
          <label>标题</label>
          <input v-model="articleForm.title" type="text" class="form-input" placeholder="文章标题" />
        </div>
        <div class="form-row">
          <label>版本</label>
          <input v-model="articleForm.version" type="text" class="form-input" placeholder="可选，如 v1.0" />
        </div>
        <div class="form-row">
          <label>标签</label>
          <input v-model="articleForm.tags" type="text" class="form-input" placeholder="用逗号分隔" />
        </div>
        <div class="form-row">
          <label>内容</label>
          <textarea v-model="articleForm.content" rows="8" class="form-textarea" placeholder="文章内容..." />
        </div>
      </div>
      <template #footer>
        <div class="d-flex" style="gap: 8px; justify-content: flex-end; width: 100%">
          <BaseButton variant="primary" @click="submitArticle" :disabled="!articleForm.title">{{ isEditingArticle ? '保存' : '创建' }}</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- 知识库创建/编辑弹窗 -->
    <BaseModal :show="kbModalVisible" :title="isEditingKb ? '编辑知识库' : '新建知识库'" @close="closeKbModal">
      <div class="modal-body">
        <div class="form-row">
          <label>名称 *</label>
          <input v-model="kbForm.name" type="text" class="form-input" placeholder="知识库名称" />
        </div>
        <div class="form-row">
          <label>描述</label>
          <textarea v-model="kbForm.description" rows="3" class="form-textarea" placeholder="知识库描述（可选）" />
        </div>
        <div class="form-row">
          <label>访问类型</label>
          <select v-model="kbForm.access_type" class="form-select">
            <option value="private">私有 - 只有我可以访问</option>
            <option value="public">公开 - 所有用户可查看</option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="d-flex" style="gap: 8px; justify-content: flex-end; width: 100%">
          <BaseButton variant="primary" @click="submitKb" :disabled="!kbForm.name">{{ isEditingKb ? '保存' : '创建' }}</BaseButton>
          <BaseButton v-if="isEditingKb" variant="danger" @click="deleteCurrentKb">删除知识库</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- 文档内容查看弹窗 -->
    <BaseModal :show="contentModalVisible" :title="`文档内容：${currentDocument?.title}`" @close="closeContentModal">
      <div class="modal-body">
        <div v-if="loadingContent" class="loading">正在加载内容...</div>
        <div v-else-if="documentContent" class="document-content">
          <pre>{{ documentContent }}</pre>
        </div>
        <div v-else class="empty-content">无法获取文档内容</div>
      </div>
      <template #footer>
        <div class="d-flex" style="gap: 8px; justify-content: flex-end; width: 100%">
          <BaseButton variant="secondary" @click="viewDocumentChunks" v-if="currentDocument">查看分块</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- 文档分块查看弹窗 -->
    <BaseModal :show="chunksModalVisible" :title="`文档分块：${currentDocument?.title}`" @close="closeChunksModal">
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
    </BaseModal>
  </div>
</template>

<script>
import CollectButton from '@/components/CollectButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { knowledgeBasesAdapter } from '@/api/openapi/adapters/knowledgeBasesAdapter.js'
import { articlesAdapter } from '@/api/openapi/adapters/articlesAdapter.js'

export default {
  name: 'KnowledgeBase',
  components: { CollectButton, BaseModal, BaseButton },
  data() {
    return {
      searchQuery: '',
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
  openActionMenuId: null,
      filterTags: [
        { id: 1, name: '全部', active: true },
        { id: 2, name: '最新', active: false },
        { id: 3, name: '热门', active: false },
        { id: 4, name: '我的收藏', active: false }
      ],
  
  documents: [],
  currentDocument: null,
      
  // 文章弹窗
  articleModalVisible: false,
  isEditingArticle: false,
  articleForm: { id: null, title: '', content: '', version: '', tags: '' }
    }
  },
  async created() {
    await this.init()
  },
  mounted() {
    // 快速操作：?action=search 聚焦搜索框
    try {
      const action = this.$route?.query?.action
      if ((action || '').toString() === 'search') {
        this.$nextTick(() => {
          const input = this.$el.querySelector('.search-input')
          if (input) input.focus()
        })
      }
    } catch {}
  },
  watch: {
    '$route.query.action'(val) {
      if ((val || '').toString() === 'search') {
        this.$nextTick(() => {
          const input = this.$el.querySelector('.search-input')
          if (input) input.focus()
        })
      }
    }
  },
  computed: {
    filteredDocuments() {
      let result = this.documents

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
    toggleActionMenu(id) {
      this.openActionMenuId = this.openActionMenuId === id ? null : id
    },
    statusLabel(status) {
      const map = { processing: '处理中', completed: '已完成', failed: '失败' }
      return map[status] || status || '-'
    },
    // 从侧栏切换知识库
    async selectKb(kbId) {
      if (kbId === this.selectedKbId) return
      this.selectedKbId = kbId
      await this.onKbChange()
    },
    switchTab(tab) {
      this.activeTab = tab
      if (tab === 'articles' && !this.articlesLoaded) {
        this.loadArticles()
      }
    },
    async init() {
      try {
  const resp = await knowledgeBasesAdapter.getAllKnowledgeBases()
  const list = Array.isArray(resp) ? resp : (resp?.data || [])
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
  const resp = await knowledgeBasesAdapter.getDocuments(this.selectedKbId, this.statusFilter || null)
        console.log('Documents API response:', resp) // 调试日志
        
        // 更灵活地处理响应数据结构
        let raw = []
        
        const base = resp?.data ?? resp
        if (Array.isArray(base)) {
          raw = base
        } else if (base) {
          if (Array.isArray(base.documents)) raw = base.documents
          else if (Array.isArray(base.items)) raw = base.items
          else if (Array.isArray(base.list)) raw = base.list
          else if (Array.isArray(base.data)) raw = base.data
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
    
    async loadArticles() {
      if (!this.selectedKbId) return
      try {
  const resp = await knowledgeBasesAdapter.getArticles(this.selectedKbId)
  const list = Array.isArray(resp) ? resp : (resp?.data || [])
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
    openDocument(document) {
      if (!this.selectedKbId) return
      this.$router.push({ name: 'DocumentDetail', params: { kbId: this.selectedKbId, docId: document.id } })
    },
    
    shareDocument(document) {
      alert(`分享文档: ${document.title}`)
    },
    onDocumentCollected(data) {
      console.log('文档已收藏:', data)
      // 可以在这里更新文档的收藏状态
      const document = this.documents.find(d => d.id == data.contentId)
      if (document) {
        document.isInCollection = true
      }
    },
    showMessage(messageData) {
      // 这里可以使用全局的消息提示组件
      console.log('消息:', messageData)
      // 简单的提示实现
      if (messageData.type === 'success') {
        alert(messageData.text)
      } else if (messageData.type === 'error') {
        alert('错误: ' + messageData.text)
      }
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
  const resp = await knowledgeBasesAdapter.uploadDocument(this.selectedKbId, file)
  console.log('Upload response:', resp) // 调试日志
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
  await knowledgeBasesAdapter.deleteDocument(this.selectedKbId, document.id)
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
        if (this.isEditingArticle && this.articleForm.id) {
          await articlesAdapter.updateArticle(this.articleForm.id, payload)
        } else {
          await knowledgeBasesAdapter.createArticle(this.selectedKbId, payload)
        }
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
  await articlesAdapter.deleteArticle(article.id)
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
  const resp = await knowledgeBasesAdapter.getKnowledgeBaseById(this.selectedKbId)
        const kb = resp?.data ?? resp
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
        if (this.isEditingKb && this.kbForm.id) {
          await knowledgeBasesAdapter.updateKnowledgeBase(this.kbForm.id, payload)
        } else {
          await knowledgeBasesAdapter.createKnowledgeBase(payload)
        }
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
  await knowledgeBasesAdapter.deleteKnowledgeBase(this.kbForm.id)
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
  const resp = await knowledgeBasesAdapter.getDocumentContent(this.selectedKbId, document.id)
        const body = resp?.data ?? resp
        this.documentContent = body?.content || '无内容'
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
  const resp = await knowledgeBasesAdapter.getDocumentChunks(this.selectedKbId, this.currentDocument.id)
  this.documentChunks = resp?.data?.data || resp?.data || resp || []
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
  const resp = await knowledgeBasesAdapter.createKnowledgeBase({ name })
  if (resp?.data?.success === false) throw new Error(resp.data.message || '创建失败')
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

/* 双栏布局 */
.content-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; align-items: start; }
.kb-sidebar { position: sticky; top: 16px; align-self: start; background: #fff; border: 2px solid #e9ecef; border-radius: 12px; padding: 12px; max-height: calc(100vh - 80px); overflow: hidden; display: flex; flex-direction: column; }
.kb-sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 8px 12px; border-bottom: 1px solid #f1f3f5; }
.kb-sidebar-title { font-weight: 700; color: #334155; }
.kb-list { overflow: auto; padding: 8px 4px; display: flex; flex-direction: column; gap: 6px; }
.kb-item { border: 1px solid #eef1f4; border-radius: 10px; padding: 10px 12px; cursor: pointer; background: #fff; transition: all .2s ease; }
.kb-item:hover { border-color: #667eea; box-shadow: 0 2px 10px rgba(102,126,234,.12); transform: translateY(-1px); }
.kb-item.active { border-color: #667eea; background: #eef2ff; }
.kb-item-name { font-weight: 600; color: #1f2937; }
.kb-item-meta { font-size: 12px; color: #6b7280; margin-top: 2px; }
.kb-empty { color: #94a3b8; text-align: center; padding: 16px 8px; }
.kb-sidebar-actions { margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f3f5; display: flex; gap: 8px; }
.kb-main { min-width: 0; }

/* KB 工具栏 */
.kb-toolbar { display: flex; gap: 16px; align-items: center; justify-content: center; margin: 8px 0 0; }
.kb-select select, .kb-status-filter select { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
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
  flex-wrap: nowrap;
}

.section-actions { display: flex; align-items: center; gap: 12px; }
.section-actions { white-space: nowrap; }
.section-header .section-title { margin: 0; }
.kb-status-filter.inline label { margin-right: 6px; color: #6b7280; font-size: 14px; }
.kb-status-filter.inline select { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }

.documents-container.list .document-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
}
.documents-container.list .document-info {
  flex: 1;
  text-align: left;
}

.document-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  z-index: 1;
}

.document-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  z-index: 5;
}

.document-card.menu-open { z-index: 1500; }

/* 已移除文档图标样式 */

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

/* 元信息已隐藏（日期、状态等），移除相关样式 */

/* 已精简卡片信息，移除标签与描述等块的样式 */

.document-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
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

/* 更多菜单 */
.more-actions { position: relative; }
.action-menu { position: absolute; right: 0; top: 40px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,.08); padding: 6px; display: flex; flex-direction: column; min-width: 120px; z-index: 2000; }
.menu-item { padding: 8px 10px; text-align: left; background: #fff; border: none; cursor: pointer; border-radius: 6px; color: #374151; }
.menu-item:hover { background: #f3f4f6; }
.menu-item.danger { color: #b91c1c; }
.menu-item.danger:hover { background: #fee2e2; }
.menu-item-embed { padding: 0; display: block; }
.menu-item-embed :deep(button),
.menu-item-embed :deep(a),
.menu-item-embed :deep(.base-button),
.menu-item-embed :deep(.collect-button),
.menu-item-embed :deep(.collect-btn) {
  width: 100%;
  padding: 8px 10px;
  text-align: left;
  background: transparent;
  border: none;
  color: #374151;
  border-radius: 6px;
  display: block;
  cursor: pointer;
}
.menu-item-embed :deep(button:hover),
.menu-item-embed :deep(a:hover),
.menu-item-embed :deep(.base-button:hover),
.menu-item-embed :deep(.collect-button:hover),
.menu-item-embed :deep(.collect-btn:hover) {
  background: #f3f4f6;
}



/* 表单样式 */
.form-row { display: grid; gap: 6px; }
.form-input, .form-textarea, .form-select { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }

/* 文档内容显示 */
.document-content { max-height: 60vh; overflow-y: auto; background: #f9fafb; padding: 12px; border-radius: 8px; }
.document-content pre { white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5; }

.chunks-list { max-height: 60vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.chunk-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; }
.chunk-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #6b7280; }
.chunk-content { font-size: 13px; line-height: 1.5; white-space: pre-wrap; }

.loading, .empty-content { text-align: center; color: #6b7280; padding: 20px; }

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



/* 响应式设计 */
@media (max-width: 768px) {
  .knowledge-base {
    padding: 16px;
  }
  .content-layout { grid-template-columns: 1fr; }
  .kb-sidebar { position: relative; top: 0; max-height: none; }
  
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
  
  .section-header { flex-direction: row; align-items: center; gap: 12px; }
  
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

