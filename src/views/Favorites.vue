 <template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">收藏</h1>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-number">{{ filteredFavorites.length }}</div>
        <div class="stat-label">{{ searchQuery ? '搜索结果' : '总收藏数' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ coursesCount }}</div>
        <div class="stat-label">课程资源</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ projectsCount }}</div>
        <div class="stat-label">项目案例</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ articlesCount }}</div>
        <div class="stat-label">文章资料</div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索收藏标题、作者或标签..."
          class="search-input"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="clear-btn"
          title="清除搜索"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 文件夹筛选与新建 -->
    <div class="folder-bar">
      <div class="folder-left">
        <label class="folder-label">文件夹</label>
        <select class="folder-select" v-model.number="currentFolderId">
          <option :value="-1">全部</option>
          <option :value="0">根目录</option>
          <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
      </div>
      <div class="folder-right">
        <button class="new-folder-btn" @click="openCreateFolder()" title="新建文件夹">新建文件夹</button>
        <button 
          class="new-folder-btn light" 
          :disabled="currentFolderId <= 0" 
          @click="openEditFolder()"
          :title="currentFolderId > 0 ? '编辑当前文件夹' : '请选择要编辑的文件夹'"
        >编辑文件夹</button>
        <button 
          class="new-folder-btn danger" 
          :disabled="currentFolderId <= 0" 
          @click="deleteCurrentFolder()"
          :title="currentFolderId > 0 ? '删除当前文件夹' : '请选择要删除的文件夹'"
        >删除文件夹</button>
        <button class="new-folder-btn primary" @click="openCreateCollection()" title="新建收藏">新建收藏</button>
      </div>
    </div>

    <!-- 加载与错误提示 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="!loading && errorMsg" class="error">{{ errorMsg }}</div>

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

    <div class="favorites-container">
      <!-- 没有搜索结果时显示 -->
      <div v-if="filteredFavorites.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
          </svg>
        </div>
        <h3 class="empty-title">
          {{ searchQuery ? '未找到相关收藏' : '暂无收藏内容' }}
        </h3>
        <p class="empty-description">
          {{ searchQuery ? 
            `没有找到包含"${searchQuery}"的收藏内容，试试其他关键词吧` : 
            '收藏感兴趣的课程、项目和文章，在这里统一管理' 
          }}
        </p>
        <button v-if="searchQuery" @click="clearSearch" class="empty-action">
          清除搜索条件
        </button>
      </div>

      <!-- 收藏列表 -->
      <div v-else class="favorite-card" v-for="item in filteredFavorites" :key="item.id">
        <div class="favorite-image">
          <div class="favorite-type" :class="item.type">{{ getTypeText(item.type) }}</div>
          <div class="favorite-date">{{ item.addedDate }}</div>
          <div class="favorite-actions">
            <button class="action-btn" @click="removeFavorite(item.id)" title="取消收藏">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.28 2,8.5 2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,20.04L12,21.35Z"/>
              </svg>
            </button>
            <button class="action-btn" @click="openEditCollection(item)" title="编辑收藏">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.62L18.38,3.29C18.18,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"/>
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
            <button class="view-btn outline" @click="goDetail(item)">详情</button>
            <div class="favorite-source">来源：{{ item.source }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建文件夹弹窗 -->
    <div v-if="creatingFolder" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">新建文件夹</h3>
        <div class="modal-body">
          <div class="form-row">
            <label>名称<span class="required">*</span></label>
            <input v-model="newFolder.name" class="input" placeholder="请输入文件夹名称" />
          </div>
          <div class="form-row">
            <label>描述</label>
            <input v-model="newFolder.description" class="input" placeholder="可选" />
          </div>
          <div class="form-row two-cols">
            <div>
              <label>颜色</label>
              <input v-model="newFolder.color" class="input" placeholder="#FF8800 或描述色" />
            </div>
            <div>
              <label>图标</label>
              <input v-model="newFolder.icon" class="input" placeholder="如 folder, star" />
            </div>
          </div>
          <div class="form-row">
            <label>父文件夹</label>
            <select v-model="newFolder.parent_id" class="input">
              <option :value="null">无（顶级）</option>
              <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="creatingFolder = false">取消</button>
          <button class="btn primary" @click="submitCreateFolder">创建</button>
        </div>
      </div>
    </div>

    <!-- 编辑文件夹弹窗 -->
    <div v-if="editingFolder" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">编辑文件夹</h3>
        <div class="modal-body">
          <div class="form-row">
            <label>名称<span class="required">*</span></label>
            <input v-model="folderForm.name" class="input" />
          </div>
          <div class="form-row">
            <label>描述</label>
            <input v-model="folderForm.description" class="input" />
          </div>
          <div class="form-row two-cols">
            <div>
              <label>颜色</label>
              <input v-model="folderForm.color" class="input" />
            </div>
            <div>
              <label>图标</label>
              <input v-model="folderForm.icon" class="input" />
            </div>
          </div>
          <div class="form-row">
            <label>父文件夹</label>
            <select v-model="folderForm.parent_id" class="input">
              <option :value="null">无（顶级）</option>
              <option v-for="f in folders" :key="f.id" :value="f.id" :disabled="f.id === folderForm.id">{{ f.name }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="editingFolder = false">取消</button>
          <button class="btn primary" @click="submitEditFolder">保存</button>
        </div>
      </div>
    </div>

    <!-- 新建/编辑收藏弹窗 -->
    <div v-if="collectionModalVisible" class="modal-backdrop">
      <div class="modal">
        <h3 class="modal-title">{{ isEditingCollection ? '编辑收藏' : '新建收藏' }}</h3>
        <div class="modal-body">
          <div class="form-row">
            <label>标题<span class="required">*</span></label>
            <input v-model="collectionForm.title" class="input" placeholder="请输入标题" />
          </div>
          <div class="form-row two-cols">
            <div>
              <label>类型</label>
              <select v-model="collectionForm.type" class="input">
                <option value="knowledge_article">文章</option>
                <option value="project">项目</option>
                <option value="course">课程</option>
              </select>
            </div>
            <div>
              <label>文件夹</label>
              <select v-model="collectionForm.folder_id" class="input">
                <option :value="null">无（根目录）</option>
                <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <label>URL</label>
            <input v-model="collectionForm.url" class="input" placeholder="https://..." />
          </div>
          <div class="form-row">
            <label>标签（用逗号分隔）</label>
            <input v-model="collectionForm.tags" class="input" placeholder="tag1, tag2" />
          </div>
          <div class="form-row">
            <label>内容</label>
            <textarea v-model="collectionForm.content" class="input" rows="4" style="resize: vertical;"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="collectionModalVisible = false">取消</button>
          <button class="btn primary" @click="submitCollection">{{ isEditingCollection ? '保存' : '创建' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed, watch, onMounted } from 'vue'
import { ApiService } from '@/services/api.js'

export default {
  name: 'Favorites',
  setup() {
  const router = useRouter()
  const activeTab = ref('all') // all | courses | projects | articles (UI 值), 将在请求时映射为后端类型
    const searchQuery = ref('')
    const debouncedSearchQuery = ref('')

    // UI state
    const loading = ref(false)
    const errorMsg = ref('')

    // Folders
  const folders = ref([])
  const currentFolderId = ref(-1) // -1=全部, 0=根目录, 具体id=某文件夹
    const creatingFolder = ref(false)
    const newFolder = ref({ name: '', description: '', color: '', icon: '', parent_id: null })
  const editingFolder = ref(false)
  const folderForm = ref({ id: null, name: '', description: '', color: '', icon: '', parent_id: null })

    // Collections
    const favorites = ref([])
  const collectionModalVisible = ref(false)
  const isEditingCollection = ref(false)
  const collectionForm = ref({ id: null, title: '', type: 'knowledge_article', url: '', content: '', tags: '', folder_id: null })

    // 防抖搜索
    let searchTimeout = null
    watch(searchQuery, (newValue) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        debouncedSearchQuery.value = newValue
      }, 300)
    })

    // 远程加载
    const loadFolders = async () => {
      try {
        const { data } = await ApiService.getFolders(null)
        if (data?.success !== false) {
          folders.value = data.data || data
        } else {
          throw new Error(data.message || '获取文件夹失败')
        }
      } catch (e) {
        console.error(e)
      }
    }

  const loadCollections = async () => {
      loading.value = true
      errorMsg.value = ''
      try {
        const mapTabToBackendType = (tab) => tab === 'projects' ? 'project' : tab === 'courses' ? 'course' : tab === 'articles' ? 'knowledge_article' : undefined
        const { data } = await ApiService.getCollections({
          folderId: currentFolderId.value === -1 ? undefined : currentFolderId.value,
          typeFilter: activeTab.value === 'all' ? undefined : mapTabToBackendType(activeTab.value),
          tagFilter: debouncedSearchQuery.value || undefined
        })
        if (data?.success !== false) {
          const items = data.data || data
          favorites.value = (items || []).map(mapCollectionToView)
        } else {
          throw new Error(data.message || '获取收藏失败')
        }
      } catch (e) {
        errorMsg.value = e.message || '加载失败'
      } finally {
        loading.value = false
      }
    }

    const mapCollectionToView = (c) => {
      // 后端 schemas.CollectedContentResponse -> 视图字段映射
      return {
        id: c.id,
        title: c.title,
        description: c.content || c.description || '',
  type: c.type || 'knowledge_article',
        author: c.author || '未知',
        rating: c.rating,
        duration: c.duration,
        tags: Array.isArray(c.tags) ? c.tags : (typeof c.tags === 'string' ? c.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
  source: (() => { try { return c.source || (c.url ? new URL(c.url).hostname : '本地') } catch { return c.source || '本地' } })(),
        url: c.url,
        addedDate: c.created_at ? formatRelativeTime(c.created_at) : ''
      }
    }

    const formatRelativeTime = (iso) => {
      try {
        const d = new Date(iso)
        const diff = Date.now() - d.getTime()
        const m = Math.floor(diff / 60000)
        if (m < 1) return '刚刚'
        if (m < 60) return `${m}分钟前`
        const h = Math.floor(m / 60)
        if (h < 24) return `${h}小时前`
        const days = Math.floor(h / 24)
        if (days < 7) return `${days}天前`
        return d.toLocaleDateString()
      } catch {
        return ''
      }
    }

    // 过滤与统计
    const filteredFavorites = computed(() => {
      let filtered = favorites.value

      // 本地二次过滤：搜索标题/作者/标签/描述
      if (debouncedSearchQuery.value.trim()) {
        const q = debouncedSearchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(item =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.author?.toLowerCase().includes(q) ||
          (item.tags || []).some(tag => tag.toLowerCase().includes(q))
        )
      }

      return filtered
    })

  const coursesCount = computed(() => favorites.value.filter(i => i.type === 'course').length)
  const projectsCount = computed(() => favorites.value.filter(i => i.type === 'project').length)
  const articlesCount = computed(() => favorites.value.filter(i => i.type === 'knowledge_article').length)

  const getTypeText = (type) => ({ course: '课程', project: '项目', knowledge_article: '文章', document: '文档', video: '视频', note: '笔记', link: '链接', file: '文件', forum_topic: '话题', daily_record: '随手记录' }[type] || '其他')
  const getViewButtonText = (type) => ({ course: '开始学习', project: '查看项目', knowledge_article: '阅读文章' }[type] || '查看详情')

    const viewItem = async (item) => {
      try {
        // 调用详情接口以增加访问计数
        await ApiService.getCollection(item.id)
      } catch (e) {
        // 忽略计数失败
      }
      // 打开详情：优先 URL，否则根据 type 决定路由
      if (item.url) {
        window.open(item.url, '_blank')
      }
    }

    const goDetail = (item) => {
      if (!item?.id) return
      router.push({ name: 'CollectionDetail', params: { id: item.id } })
    }

    const removeFavorite = async (itemId) => {
      if (!confirm('确定要取消收藏吗？')) return
      try {
        const { data } = await ApiService.deleteCollection(itemId)
        if (data?.success === false) throw new Error(data.message || '删除失败')
        favorites.value = favorites.value.filter(i => i.id !== itemId)
      } catch (e) {
        alert(e.message || '删除失败')
      }
    }

    const shareItem = (itemId) => {
      // 简单分享：复制链接占位
      navigator.clipboard?.writeText(location.href + `?share=${itemId}`)
      alert('分享链接已复制')
    }

    const clearSearch = () => { searchQuery.value = '' }

    // 监听筛选变化
    watch([activeTab, debouncedSearchQuery, currentFolderId], () => {
      loadCollections()
    })

    onMounted(async () => {
      await loadFolders()
      await loadCollections()
    })

    // 创建文件夹
    const openCreateFolder = (parentId = null) => {
      creatingFolder.value = true
      newFolder.value = { name: '', description: '', color: '', icon: '', parent_id: parentId }
    }

    const submitCreateFolder = async () => {
      if (!newFolder.value.name?.trim()) {
        alert('请输入文件夹名称')
        return
      }
      try {
        const { data } = await ApiService.createFolder({
          name: newFolder.value.name.trim(),
          description: newFolder.value.description || undefined,
          color: newFolder.value.color || undefined,
          icon: newFolder.value.icon || undefined,
          parent_id: newFolder.value.parent_id ?? undefined
        })
        if (data?.success === false) throw new Error(data.message || '创建失败')
        creatingFolder.value = false
        await loadFolders()
      } catch (e) {
        alert(e.message || '创建失败')
      }
    }

    const openEditFolder = async () => {
      if (!(currentFolderId.value > 0)) return
      try {
        const { data } = await ApiService.getFolder(currentFolderId.value)
        const f = data?.data || data
        folderForm.value = {
          id: f.id,
          name: f.name || '',
          description: f.description || '',
          color: f.color || '',
          icon: f.icon || '',
          parent_id: f.parent_id ?? null
        }
        editingFolder.value = true
      } catch (e) {
        alert(e.message || '加载文件夹失败')
      }
    }

    const submitEditFolder = async () => {
      if (!folderForm.value.name?.trim()) {
        alert('请输入文件夹名称')
        return
      }
      if (folderForm.value.parent_id === folderForm.value.id) {
        alert('父文件夹不能选择自身')
        return
      }
      try {
        const payload = {
          name: folderForm.value.name.trim(),
          description: folderForm.value.description || undefined,
          color: folderForm.value.color || undefined,
          icon: folderForm.value.icon || undefined,
          parent_id: folderForm.value.parent_id ?? undefined
        }
        const { data } = await ApiService.updateFolder(folderForm.value.id, payload)
        if (data?.success === false) throw new Error(data.message || '保存失败')
        editingFolder.value = false
        await loadFolders()
      } catch (e) {
        alert(e.message || '保存失败')
      }
    }

    const deleteCurrentFolder = async () => {
      if (!(currentFolderId.value > 0)) return
      if (!confirm('确定要删除该文件夹吗？\n提示：若文件夹非空，可选择“级联删除”一并删除其下内容。')) return
      try {
        // 先尝试普通删除
        const { data } = await ApiService.deleteFolder(currentFolderId.value)
        if (data?.success === false) throw new Error(data.message || '删除失败')
        currentFolderId.value = -1
        await loadFolders()
        await loadCollections()
        alert('删除成功')
      } catch (e1) {
        const ok = confirm('删除失败，可能因为文件夹内仍有内容。\n是否级联删除该文件夹及其所有子内容？此操作不可撤销。')
        if (!ok) { alert(e1.message || '删除失败'); return }
        try {
          const { data } = await ApiService.deleteFolder(currentFolderId.value, { cascade: true, recursive: true })
          if (data?.success === false) throw new Error(data.message || '删除失败')
          currentFolderId.value = -1
          await loadFolders()
          await loadCollections()
          alert('已级联删除该文件夹及其内容')
        } catch (e2) {
          alert(e2.message || '删除失败')
        }
      }
    }

    // 收藏：创建/编辑
    const openCreateCollection = () => {
      isEditingCollection.value = false
      const mapTabToBackendType = (tab) => tab === 'projects' ? 'project' : tab === 'courses' ? 'course' : tab === 'articles' ? 'knowledge_article' : 'knowledge_article'
      collectionForm.value = {
        id: null,
        title: '',
        type: activeTab.value === 'all' ? 'knowledge_article' : mapTabToBackendType(activeTab.value),
        url: '',
        content: '',
        tags: '',
        folder_id: currentFolderId.value > 0 ? currentFolderId.value : null
      }
      collectionModalVisible.value = true
    }

    const openEditCollection = async (item) => {
      try {
        const { data } = await ApiService.getCollection(item.id)
        const c = data?.data || data
        isEditingCollection.value = true
        collectionForm.value = {
          id: c.id,
          title: c.title || '',
    type: c.type || 'knowledge_article',
          url: c.url || '',
          content: c.content || '',
          tags: Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || ''),
          folder_id: c.folder_id ?? null
        }
        collectionModalVisible.value = true
      } catch (e) {
        alert(e.message || '加载收藏失败')
      }
    }

    const submitCollection = async () => {
      if (!collectionForm.value.title?.trim()) {
        alert('请输入标题')
        return
      }
        const toTagsString = (val) => Array.isArray(val) ? val.join(',') : (typeof val === 'string' ? val : undefined)
        const payload = {
        title: collectionForm.value.title.trim(),
        type: collectionForm.value.type,
        url: collectionForm.value.url || undefined,
        content: collectionForm.value.content || undefined,
          tags: toTagsString(collectionForm.value.tags),
        folder_id: collectionForm.value.folder_id ?? undefined
      }
      try {
        if (isEditingCollection.value) {
          const { data } = await ApiService.updateCollection(collectionForm.value.id, payload)
          if (data?.success === false) throw new Error(data.message || '保存失败')
        } else {
          const { data } = await ApiService.createCollection(payload)
          if (data?.success === false) throw new Error(data.message || '创建失败')
        }
        collectionModalVisible.value = false
        await loadCollections()
      } catch (e) {
        alert(e.message || (isEditingCollection.value ? '保存失败' : '创建失败'))
      }
    }

    return {
      // state
      activeTab,
      searchQuery,
      debouncedSearchQuery,
      loading,
      errorMsg,

      // folders
      folders,
      currentFolderId,
      creatingFolder,
      newFolder,
      openCreateFolder,
      submitCreateFolder,
  editingFolder,
  folderForm,
  openEditFolder,
  submitEditFolder,
  deleteCurrentFolder,

      // collections
      favorites,
  collectionModalVisible,
  isEditingCollection,
  collectionForm,
      filteredFavorites,
      coursesCount,
      projectsCount,
      articlesCount,
      getTypeText,
      getViewButtonText,
      viewItem,
  goDetail,
  openCreateCollection,
  openEditCollection,
  submitCollection,
      removeFavorite,
      shareItem,
      clearSearch
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
  margin-bottom: 32px;
  background: white;
  border-radius: 20px;
  padding: 24px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 120px;
  position: relative;
}

.title-section {
  max-width: 100%;
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 50%, #e64a19 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.01em;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  text-shadow: 0 2px 4px rgba(255, 123, 66, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.page-title::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ff7b42, #ff5722);
  border-radius: 2px;
  opacity: 0.8;
}

.page-title:hover {
  transform: translateY(-1px);
  text-shadow: 0 4px 8px rgba(255, 123, 66, 0.15);
}

.header-subtitle {
  position: absolute;
  bottom: 20px;
  right: 32px;
  font-size: 0.9rem;
  color: #6c757d;
  opacity: 0.6;
  font-weight: 300;
  letter-spacing: 0.02em;
  font-style: italic;
  backdrop-filter: blur(2px);
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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #ff7b42;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2px;
}

.stat-label {
  color: #6c757d;
  font-size: 13px;
}

/* 搜索框样式 */
.search-container {
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-box:focus-within {
  border-color: #ff7b42;
  box-shadow: 0 4px 12px rgba(255, 123, 66, 0.15);
  transform: translateY(-1px);
}

.search-icon {
  color: #6c757d;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.search-box:focus-within .search-icon {
  color: #ff7b42;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #2c3e50;
  background: transparent;
  font-weight: 400;
}

.search-input::placeholder {
  color: #adb5bd;
  font-weight: 300;
}

.clear-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: white;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.folder-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 10px 12px;
}

.folder-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-label {
  color: #6c757d;
  font-size: 13px;
}

.folder-select {
  padding: 8px 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  color: #2c3e50;
}

.new-folder-btn {
  border: none;
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}
.new-folder-btn:disabled { opacity: 0.6; cursor: not-allowed; filter: saturate(0.7); }
.new-folder-btn.light { background: #f1f3f5; color: #2c3e50; margin-left: 8px; }
.new-folder-btn.danger { background: #dc3545; margin-left: 8px; }
.new-folder-btn.primary { margin-left: 8px; }
.form-row textarea.input { font-family: inherit; }

.loading {
  margin: 12px 0;
  color: #6c757d;
}

.error {
  margin: 12px 0;
  color: #d9534f;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 520px;
  max-width: calc(100% - 32px);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  overflow: hidden;
}

.modal-title {
  margin: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-body {
  padding: 16px 20px;
}

.form-row { margin-bottom: 12px; }
.form-row.two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row label { display: block; font-size: 13px; color: #6c757d; margin-bottom: 6px; }
.form-row .input { width: 100%; padding: 8px 10px; border: 1px solid #e9ecef; border-radius: 8px; }
.required { color: #d9534f; margin-left: 4px; }

.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid #f0f0f0; }
.btn { padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; }
.btn.secondary { background: #f1f3f5; color: #2c3e50; }
.btn.primary { background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%); color: #fff; }

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #6c757d;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tab-btn.active {
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 123, 66, 0.3);
  transform: translateY(-1px);
}

.tab-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #ff7b42;
}

.favorites-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 空状态样式 */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e9ecef;
  text-align: center;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: #ff7b42;
  background: #fafbfc;
}

.empty-icon {
  color: #adb5bd;
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
}

.empty-description {
  color: #6c757d;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 24px 0;
  max-width: 400px;
}

.empty-action {
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 123, 66, 0.3);
}

.empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 123, 66, 0.4);
}

.favorite-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.favorite-card:hover {
  border-color: #ff9f7a;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(255, 159, 122, 0.15);
}

.favorite-image {
  width: 220px;
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  transition: all 0.3s ease;
}

.favorite-type {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  align-self: flex-start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.favorite-type.courses {
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
}

.favorite-type.projects {
  background: #fff3e0;
  color: #f57c00;
}

.favorite-type.articles {
  background: #fce4ec;
  color: #e91e63;
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
  padding: 28px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
}

.favorite-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.favorite-description {
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.6;
  flex: 1;
  font-size: 15px;
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
  background: #fff3e0;
  color: #ff7b42;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.favorite-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.view-btn {
  background: linear-gradient(135deg, #ff7b42 0%, #ff5722 100%);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(255, 123, 66, 0.3);
}

.view-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 123, 66, 0.4);
}

.favorite-source {
  color: #6c757d;
  font-size: 12px;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .header {
    padding: 20px 24px;
    margin-bottom: 24px;
    min-height: 100px;
  }

  .stats-bar {
    gap: 12px;
  }

  .stat-card {
    padding: 10px 12px;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .stat-label {
    font-size: 12px;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 600;
  }

  .page-title::before {
    width: 50px;
    height: 2px;
  }

  .header-subtitle {
    font-size: 0.8rem;
    bottom: 16px;
    right: 24px;
  }

  .filter-tabs {
    padding: 8px;
    gap: 8px;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .favorites-container {
    grid-template-columns: 1fr;
    gap: 20px;
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

  .favorite-content {
    padding: 20px;
  }

  .favorite-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 16px 20px;
    min-height: 90px;
  }

  .stats-bar {
    gap: 8px;
  }

  .stat-card {
    padding: 8px 10px;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 11px;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 600;
  }

  .page-title::before {
    width: 40px;
    height: 2px;
  }

  .header-subtitle {
    font-size: 0.75rem;
    bottom: 12px;
    right: 20px;
  }

  .filter-tabs {
    flex-wrap: wrap;
    gap: 6px;
  }

  .tab-btn {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    font-size: 13px;
  }

  .favorites-container {
    grid-template-columns: 1fr;
  }
  
  .favorite-image {
    height: 100px;
  }
  
  .favorite-content {
    padding: 16px;
  }
  
  .favorite-title {
    font-size: 1.1rem;
  }
  
  .favorite-meta {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .meta-item {
    font-size: 13px;
  }
}
</style>
