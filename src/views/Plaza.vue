<template>
  <div class="page">
    <!-- 智能搜索匹配 - 核心功能区 -->
    <div class="search-section">
      <div class="search-header">
        <div class="search-title">
          <div class="search-icon">🎯</div>
          <div class="search-title-text">
            <h2>智能搜索匹配</h2>
            <p class="search-subtitle">AI驱动的精准推荐，让每次搜索都有所收获</p>
          </div>
        </div>
        <div class="search-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalMatches }}</span>
            <span class="stat-label">今日匹配</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ successRate }}%</span>
            <span class="stat-label">成功率</span>
          </div>
        </div>
      </div>
      
      <div class="search-input-section">
        <div class="search-input-wrapper">
          <div class="search-input-icon">🔍</div>
          <input
            type="text"
            class="enhanced-search-input"
            placeholder="描述你的需求，AI将为你智能匹配最佳结果..."
            v-model="searchQuery"
            @input="onSearchInput"
            @focus="onSearchFocus"
            @blur="onSearchBlur"
          />
          <button class="search-action-btn" @click="performSearch" :disabled="!searchQuery.trim()">
            搜索
          </button>
        </div>
        
        <!-- 搜索建议 -->
        <div class="search-suggestions" v-if="showSuggestions && searchSuggestions.length">
          <div class="suggestions-title">推荐搜索</div>
          <div class="suggestions-list">
            <span 
              v-for="suggestion in searchSuggestions" 
              :key="suggestion"
              class="suggestion-tag"
              @click="applySuggestion(suggestion)"
            >
              {{ suggestion }}
            </span>
          </div>
        </div>
      </div>

      <div class="smart-match-container">
        <div class="match-types-header">
          <span class="match-types-title">智能推荐类型</span>
          <span class="match-types-desc">选择推荐模式，获得个性化内容</span>
        </div>
        
        <div class="smart-match-grid">
          <div 
            class="match-type-card" 
            @click="selectRecommendationType('project')"
            :class="{ 'active': selectedType === 'project' }"
          >
            <div class="match-type-icon">🎯</div>
            <div class="match-type-content">
              <div class="match-type-title">项目推荐</div>
              <div class="match-type-desc">基于双塔模型的智能项目推荐</div>
              <div class="match-type-stats">
                <span class="stats-badge success">{{ projectRecommendations.length }}个推荐</span>
                <span class="stats-badge info">92%匹配度</span>
              </div>
            </div>
          </div>
          
          <div 
            class="match-type-card" 
            @click="selectRecommendationType('course')"
            :class="{ 'active': selectedType === 'course' }"
          >
            <div class="match-type-icon">🎓</div>
            <div class="match-type-content">
              <div class="match-type-title">课程推荐</div>
              <div class="match-type-desc">基于兴趣匹配的个性化课程推荐</div>
              <div class="match-type-stats">
                <span class="stats-badge success">{{ courseRecommendations.length }}个推荐</span>
                <span class="stats-badge warning">热门</span>
              </div>
            </div>
          </div>
          
          <div 
            class="match-type-card" 
            @click="selectRecommendationType('knowledge')"
            :class="{ 'active': selectedType === 'knowledge' }"
          >
            <div class="match-type-icon">💡</div>
            <div class="match-type-content">
              <div class="match-type-title">知识库推荐</div>
              <div class="match-type-desc">热门知识点和创新方法论推荐</div>
              <div class="match-type-stats">
                <span class="stats-badge success">{{ knowledgeRecommendations.length }}个推荐</span>
                <span class="stats-badge primary">实时更新</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐内容弹窗 -->
    <div class="recommendation-modal-overlay" v-if="showRecommendationModal" @click="closeRecommendationModal">
      <div class="recommendation-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon">
              {{ selectedType === 'project' ? '🎯' : selectedType === 'course' ? '🎓' : '💡' }}
            </div>
            {{ selectedType === 'project' ? '智能项目推荐' : selectedType === 'course' ? '个性化课程推荐' : '知识库推荐' }}
            <div class="modal-badge">
              基于AI分析
            </div>
          </div>
          <button class="modal-close-btn" @click="closeRecommendationModal">
            <span class="close-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-content">
          <!-- 项目推荐内容 -->
          <div v-if="selectedType === 'project'" class="modal-recommendations">
            <div
              class="modal-recommendation-item"
              v-for="project in projectRecommendations"
              :key="project.id"
            >
              <div class="recommendation-header">
                <div class="recommendation-title">{{ project.title }}</div>
                <div class="match-percentage">{{ project.match }}%匹配</div>
              </div>
              <div class="recommendation-meta">
                <span class="meta-item">
                  <span class="meta-icon">🛠️</span>
                  需要技能: {{ project.skills }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">👥</span>
                  团队规模: {{ project.teamSize }}
                </span>
              </div>
              <p class="recommendation-description">{{ project.description }}</p>
              <div class="recommendation-actions">
                <button class="action-btn primary">立即查看</button>
                <button class="action-btn secondary">收藏</button>
                <button class="action-btn ghost">分享</button>
              </div>
            </div>
          </div>
          
          <!-- 课程推荐内容 -->
          <div v-if="selectedType === 'course'" class="modal-recommendations">
            <div
              class="modal-recommendation-item"
              v-for="course in courseRecommendations"
              :key="course.id"
            >
              <div class="recommendation-header">
                <div class="recommendation-title">{{ course.title }}</div>
                <div class="match-percentage">{{ course.match }}%匹配</div>
              </div>
              <div class="recommendation-meta">
                <span class="meta-item">
                  <span class="meta-icon">👨‍🏫</span>
                  讲师: {{ course.instructor }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  时长: {{ course.duration }}
                </span>
              </div>
              <p class="recommendation-description">{{ course.description }}</p>
              <div class="recommendation-actions">
                <button class="action-btn primary">开始学习</button>
                <button class="action-btn secondary">加入收藏</button>
                <button class="action-btn ghost">分享课程</button>
              </div>
            </div>
          </div>
          
          <!-- 知识库推荐内容 -->
          <div v-if="selectedType === 'knowledge'" class="modal-recommendations">
            <div
              class="modal-recommendation-item"
              v-for="knowledge in knowledgeRecommendations"
              :key="knowledge.id"
            >
              <div class="recommendation-header">
                <div class="recommendation-title">{{ knowledge.title }}</div>
                <div class="popularity-badge">{{ knowledge.popularity }}</div>
              </div>
              <div class="recommendation-meta">
                <span class="meta-item">
                  <span class="meta-icon">📂</span>
                  类型: {{ knowledge.type }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">📅</span>
                  更新: {{ knowledge.updated }}
                </span>
              </div>
              <p class="recommendation-description">{{ knowledge.description }}</p>
              <div class="recommendation-actions">
                <button class="action-btn primary">立即学习</button>
                <button class="action-btn secondary">加入书签</button>
                <button class="action-btn ghost">推荐给好友</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="refresh-modal-btn" @click="refreshRecommendations">
            <span class="refresh-icon">🔄</span>
            刷新推荐
          </button>
          <button class="close-modal-btn" @click="closeRecommendationModal">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="section-divider">
      <div class="divider-line"></div>
      <div class="divider-text">社区动态</div>
      <div class="divider-line"></div>
    </div>

    <!-- 社区动态流 -->
    <div class="simple-card">
      <div class="card-title" style="margin-bottom: 16px;">
        <div class="card-icon">�</div>
        社区动态
        <span class="online-count">{{ onlineUsers }}人在线</span>
      </div>
      
      <!-- 发布动态 -->
      <div class="post-composer">
        <div class="composer-header">
          <div class="user-avatar">👤</div>
          <span class="composer-username">我</span>
        </div>
        <textarea
          class="composer-input"
          placeholder="分享你的想法、项目进展或学习心得..."
          v-model="newPost"
          maxlength="500"
          rows="3"
        ></textarea>
        <div class="composer-footer">
          <div class="topic-selector">
            <select v-model="selectedPostTopic" class="topic-select">
              <option value="">选择话题</option>
              <option v-for="topic in hotTopics" :key="topic.id" :value="topic.name">
                # {{ topic.name }}
              </option>
            </select>
          </div>
          <div class="composer-actions">
            <span class="char-count">{{ newPost.length }}/500</span>
            <button class="publish-btn" @click="publishPost" :disabled="!newPost.trim()">
              发布
            </button>
          </div>
        </div>
      </div>
      
      <!-- 话题过滤 -->
      <div class="topic-filter">
        <span 
          class="filter-tag" 
          @click="selectedTopic = null"
          :class="{ 'active': !selectedTopic }"
        >
          全部
        </span>
        <span 
          class="filter-tag" 
          v-for="topic in hotTopics" 
          :key="topic.id"
          @click="selectTopic(topic)"
          :class="{ 'active': selectedTopic?.id === topic.id }"
        >
          # {{ topic.name }}
        </span>
      </div>
    </div>

    <!-- 动态流内容 -->
    <div class="feed-container">
      <div 
        class="feed-item" 
        v-for="post in filteredPosts" 
        :key="post.id"
      >
        <div class="post-header">
          <div class="post-user">
            <div class="user-avatar">{{ post.avatar }}</div>
            <div class="user-info">
              <div class="username">{{ post.username }}</div>
              <div class="post-time">{{ formatTime(post.timestamp) }}</div>
            </div>
          </div>
          <div class="post-topic" v-if="post.topic">
            <span class="topic-badge"># {{ post.topic }}</span>
          </div>
        </div>
        
        <div class="post-content">
          {{ post.content }}
        </div>
        
        <div class="post-images" v-if="post.images && post.images.length">
          <img 
            v-for="(image, index) in post.images" 
            :key="index" 
            :src="image" 
            :alt="`图片${index + 1}`"
            class="post-image"
          />
        </div>
        
        <div class="post-actions">
          <button 
            class="action-btn like-btn" 
            @click="toggleLike(post)"
            :class="{ 'liked': post.isLiked }"
          >
            <span class="action-icon">{{ post.isLiked ? '❤️' : '🤍' }}</span>
            <span class="action-text">{{ post.likes }}</span>
          </button>
          
          <button 
            class="action-btn comment-btn"
            @click="toggleComments(post)"
          >
            <span class="action-icon">💬</span>
            <span class="action-text">{{ post.comments.length }}</span>
          </button>
          
          <button class="action-btn share-btn">
            <span class="action-icon">🔄</span>
            <span class="action-text">分享</span>
          </button>
        </div>
        
        <!-- 评论区域 -->
        <div class="comments-section" v-if="post.showComments">
          <div class="comment-input-container">
            <input
              type="text"
              class="comment-input"
              placeholder="写个评论..."
              v-model="post.newComment"
              @keyup.enter="addComment(post)"
            />
            <button 
              class="comment-submit-btn" 
              @click="addComment(post)"
              :disabled="!post.newComment?.trim()"
            >
              发送
            </button>
          </div>
          
          <div class="comments-list">
            <div 
              class="comment-item" 
              v-for="comment in post.comments" 
              :key="comment.id"
            >
              <div class="comment-avatar">{{ comment.avatar }}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username">{{ comment.username }}</span>
                  <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
                </div>
                <div class="comment-text">{{ comment.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <button class="load-more-btn" @click="loadMorePosts">
          加载更多动态
        </button>
      </div>
    </div>

    <!-- 推荐内容展示区域 -->
    <div class="recommendations-container" v-if="selectedType">
      <div class="recommendations-header">
        <div class="recommendations-title">
          <div class="recommendations-icon">
            {{ selectedType === 'project' ? '🎯' : selectedType === 'course' ? '🎓' : '💡' }}
          </div>
          {{ selectedType === 'project' ? '项目推荐' : selectedType === 'course' ? '课程推荐' : '知识库推荐' }}
        </div>
      </div>
      
      <!-- 项目推荐内容 -->
      <div v-if="selectedType === 'project'" class="recommendations-content">
        <div
          class="recommendation-item"
          v-for="project in projectRecommendations"
          :key="project.id"
        >
          <div class="recommendation-title">{{ project.title }}</div>
          <div class="recommendation-meta">需要技能: {{ project.skills }}</div>
          <p style="font-size: 14px; margin: 8px 0;">{{ project.description }}</p>
          <span class="match-score">匹配度: {{ project.match }}%</span>
        </div>
      </div>
      
      <!-- 课程推荐内容 -->
      <div v-if="selectedType === 'course'" class="recommendations-content">
        <div
          class="recommendation-item"
          v-for="course in courseRecommendations"
          :key="course.id"
        >
          <div class="recommendation-title">{{ course.title }}</div>
          <div class="recommendation-meta">讲师: {{ course.instructor }} | 时长: {{ course.duration }}</div>
          <p style="font-size: 14px; margin: 8px 0;">{{ course.description }}</p>
          <span class="match-score">匹配度: {{ course.match }}%</span>
        </div>
      </div>
      
      <!-- 知识库推荐内容 -->
      <div v-if="selectedType === 'knowledge'" class="recommendations-content">
        <div
          class="recommendation-item"
          v-for="knowledge in knowledgeRecommendations"
          :key="knowledge.id"
        >
          <div class="recommendation-title">{{ knowledge.title }}</div>
          <div class="recommendation-meta">类型: {{ knowledge.type }} | 更新: {{ knowledge.updated }}</div>
          <p style="font-size: 14px; margin: 8px 0;">{{ knowledge.description }}</p>
          <span class="match-score">热度: {{ knowledge.popularity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Plaza',
  setup() {
    const searchQuery = ref('')
    const showSmartMatch = ref(false)
    const selectedType = ref('')
    const showSuggestions = ref(false)
    const showRecommendationModal = ref(false)
    
    // 智能搜索相关数据
    const totalMatches = ref(247)
    const successRate = ref(94)
    const searchSuggestions = ref([
      'Python数据分析项目',
      'Web前端开发团队',
      '机器学习课程推荐',
      'React项目合作',
      'UI设计学习资源'
    ])
    
    // 社区动态相关数据
    const onlineUsers = ref(128)
    const selectedTopic = ref(null)
    const selectedPostTopic = ref('')
    const newPost = ref('')
    const hasMore = ref(true)

    const hotTopics = ref([
      { id: 1, name: '技术交流' },
      { id: 2, name: '项目分享' },
      { id: 3, name: '学习心得' },
      { id: 4, name: '职场话题' },
      { id: 5, name: '随便聊聊' }
    ])

    const posts = ref([
      {
        id: 1,
        username: '前端大神',
        avatar: '👨‍💻',
        content: '刚完成了一个基于Vue3的管理系统项目，用了最新的Composition API和TypeScript，开发体验真的太棒了！分享一下技术栈：Vue3 + Vite + TypeScript + Element Plus + Pinia，有兴趣的小伙伴可以一起交流~',
        topic: '技术交流',
        timestamp: new Date(Date.now() - 300000),
        likes: 24,
        isLiked: false,
        images: [],
        comments: [
          {
            id: 1,
            username: '学习小白',
            avatar: '👶',
            content: '太厉害了！能分享一下具体的项目架构吗？',
            timestamp: new Date(Date.now() - 180000)
          },
          {
            id: 2,
            username: 'Vue爱好者',
            avatar: '🦄',
            content: 'Composition API确实比Options API灵活很多',
            timestamp: new Date(Date.now() - 120000)
          }
        ],
        showComments: false,
        newComment: ''
      },
      {
        id: 2,
        username: 'AI研究员',
        avatar: '🤖',
        content: '最近在研究大语言模型的微调技术，发现了一些有趣的现象。通过LoRA微调，可以用很少的参数就达到很好的效果。正在整理相关的实验数据和代码，准备开源出来供大家学习交流。',
        topic: '项目分享',
        timestamp: new Date(Date.now() - 900000),
        likes: 18,
        isLiked: true,
        images: [],
        comments: [
          {
            id: 3,
            username: '机器学习小白',
            avatar: '🎓',
            content: '期待开源！正好在学习这方面的知识',
            timestamp: new Date(Date.now() - 600000)
          }
        ],
        showComments: false,
        newComment: ''
      },
      {
        id: 3,
        username: '算法新手',
        avatar: '📚',
        content: '今天终于刷完了LeetCode前100题！从一开始的完全不会到现在能独立解决中等难度的题目，真的是一个很大的进步。分享一下我的学习方法：1. 每天至少刷2题 2. 重点理解题目的解题思路 3. 多做总结和复盘。坚持就是胜利！',
        topic: '学习心得',
        timestamp: new Date(Date.now() - 1800000),
        likes: 32,
        isLiked: false,
        images: [],
        comments: [],
        showComments: false,
        newComment: ''
      },
      {
        id: 4,
        username: '职场老司机',
        avatar: '💼',
        content: '作为一个工作5年的程序员，想跟大家分享一下职业规划的心得。技术能力固然重要，但软技能同样不可忽视：沟通能力、团队协作、项目管理等。建议大家在技术精进的同时，也要注重这些方面的提升。',
        topic: '职场话题',
        timestamp: new Date(Date.now() - 3600000),
        likes: 15,
        isLiked: false,
        images: [],
        comments: [
          {
            id: 4,
            username: '应届毕业生',
            avatar: '🎓',
            content: '受教了！请问有什么具体的建议吗？',
            timestamp: new Date(Date.now() - 3000000)
          }
        ],
        showComments: false,
        newComment: ''
      },
      {
        id: 5,
        username: '咖啡爱好者',
        avatar: '☕',
        content: '今天发现了一家新开的咖啡店，环境超棒，很适合写代码！而且老板还是个程序员，店里有很多技术书籍可以免费阅读。地址在xxx街道，推荐给经常需要外出办公的小伙伴们~',
        topic: '随便聊聊',
        timestamp: new Date(Date.now() - 7200000),
        likes: 8,
        isLiked: false,
        images: [],
        comments: [],
        showComments: false,
        newComment: ''
      }
    ])

    // 计算过滤后的动态
    const filteredPosts = computed(() => {
      if (!selectedTopic.value) {
        return posts.value
      }
      return posts.value.filter(post => post.topic === selectedTopic.value.name)
    })

    const projectRecommendations = ref([
      {
        id: 1,
        title: '智能客服机器人开发',
        skills: 'Python, NLP, 深度学习',
        description: '基于大语言模型的智能客服系统，提升用户体验。',
        match: 95,
        teamSize: '3-5人'
      },
      {
        id: 2,
        title: '区块链存证平台',
        skills: '区块链, Solidity, Web3',
        description: '构建去中心化的数据存证解决方案。',
        match: 87,
        teamSize: '2-4人'
      },
      {
        id: 3,
        title: '数据可视化仪表板',
        skills: 'React, D3.js, 数据分析',
        description: '为企业提供直观的数据分析和展示平台。',
        match: 82,
        teamSize: '4-6人'
      }
    ])

    const courseRecommendations = ref([
      {
        id: 1,
        title: '深度学习进阶课程',
        instructor: '李教授',
        duration: '40课时',
        description: '深入学习CNN、RNN、Transformer等前沿技术。',
        match: 93
      },
      {
        id: 2,
        title: '大数据处理实战',
        instructor: '张博士',
        duration: '32课时',
        description: 'Spark、Hadoop生态系统实战应用。',
        match: 88
      }
    ])

    const knowledgeRecommendations = ref([
      {
        id: 1,
        title: 'AI创新方法论',
        type: '方法论文档',
        updated: '2024-08-01',
        description: '系统性的AI项目创新思维框架。',
        popularity: '🔥🔥🔥'
      },
      {
        id: 2,
        title: '创业项目案例集',
        type: '案例文档',
        updated: '2024-07-28',
        description: '100+成功创业项目的详细分析。',
        popularity: '🔥🔥'
      }
    ])

    const toggleSmartMatch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索条件')
        return
      }
      showSmartMatch.value = !showSmartMatch.value
      if (!showSmartMatch.value) {
        selectedType.value = ''
      }
    }

    const selectRecommendationType = (type) => {
      selectedType.value = type
      showRecommendationModal.value = true
      ElMessage.success(`正在为您匹配${type === 'project' ? '项目' : type === 'course' ? '课程' : '知识库'}推荐...`)
    }

    // 社区动态方法
    const selectTopic = (topic) => {
      selectedTopic.value = selectedTopic.value?.id === topic.id ? null : topic
    }

    const publishPost = () => {
      if (!newPost.value.trim()) return

      const post = {
        id: Date.now(),
        username: '我',
        avatar: '👤',
        content: newPost.value.trim(),
        topic: selectedPostTopic.value || null,
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        images: [],
        comments: [],
        showComments: false,
        newComment: ''
      }

      posts.value.unshift(post)
      newPost.value = ''
      selectedPostTopic.value = ''
      ElMessage.success('动态发布成功！')
    }

    const toggleLike = (post) => {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }

    const toggleComments = (post) => {
      post.showComments = !post.showComments
    }

    const addComment = (post) => {
      if (!post.newComment?.trim()) return

      const comment = {
        id: Date.now(),
        username: '我',
        avatar: '👤',
        content: post.newComment.trim(),
        timestamp: new Date()
      }

      post.comments.push(comment)
      post.newComment = ''
      ElMessage.success('评论发布成功！')
    }

    const loadMorePosts = () => {
      // 模拟加载更多数据
      ElMessage.info('正在加载更多动态...')
      setTimeout(() => {
        hasMore.value = false
        ElMessage.success('没有更多动态了')
      }, 1000)
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
      return timestamp.toLocaleDateString()
    }

    // 智能搜索相关方法
    const onSearchInput = () => {
      if (searchQuery.value.length > 2) {
        showSuggestions.value = true
      } else {
        showSuggestions.value = false
      }
    }

    const onSearchFocus = () => {
      if (searchQuery.value.length > 2) {
        showSuggestions.value = true
      }
    }

    const onSearchBlur = () => {
      // 延迟隐藏，允许点击建议
      setTimeout(() => {
        showSuggestions.value = false
      }, 200)
    }

    const applySuggestion = (suggestion) => {
      searchQuery.value = suggestion
      showSuggestions.value = false
      performSearch()
    }

    const performSearch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容')
        return
      }
      ElMessage.success('正在智能分析您的需求...')
      // 这里可以添加实际的搜索逻辑
    }

    const refreshRecommendations = () => {
      ElMessage.info('正在刷新推荐内容...')
      // 这里可以添加刷新推荐的逻辑
      setTimeout(() => {
        ElMessage.success('推荐内容已更新')
      }, 1000)
    }

    const closeRecommendationModal = () => {
      showRecommendationModal.value = false
      selectedType.value = ''
    }

    return {
      // 智能搜索数据
      searchQuery,
      showSmartMatch,
      selectedType,
      showSuggestions,
      showRecommendationModal,
      totalMatches,
      successRate,
      searchSuggestions,
      projectRecommendations,
      courseRecommendations,
      knowledgeRecommendations,
      // 智能搜索方法
      toggleSmartMatch,
      selectRecommendationType,
      onSearchInput,
      onSearchFocus,
      onSearchBlur,
      applySuggestion,
      performSearch,
      refreshRecommendations,
      closeRecommendationModal,
      // 社区动态
      onlineUsers,
      selectedTopic,
      selectedPostTopic,
      newPost,
      hasMore,
      hotTopics,
      posts,
      filteredPosts,
      selectTopic,
      publishPost,
      toggleLike,
      toggleComments,
      addComment,
      loadMorePosts,
      formatTime
    }
  }
}
</script>

<style scoped>
/* 智能搜索匹配区域样式 */
.search-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

/* 移动端搜索区域优化 */
@media (max-width: 768px) {
  .search-section {
    padding: 20px 16px;
    margin-bottom: 20px;
    border-radius: 12px;
  }
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.search-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
}

.search-title-text h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-subtitle {
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.search-stats {
  display: flex;
  gap: 24px;
}

/* 移动端搜索头部优化 */
@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .search-title {
    gap: 12px;
  }
  
  .search-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .search-title-text h2 {
    font-size: 1.5rem;
  }
  
  .search-subtitle {
    font-size: 0.9rem;
  }
  
  .search-stats {
    gap: 12px;
    justify-content: space-around;
  }
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* 移动端统计项优化 */
@media (max-width: 768px) {
  .stat-item {
    padding: 12px 16px;
    flex: 1;
  }
  
  .stat-number {
    font-size: 1.2rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}

.search-input-section {
  margin-bottom: 32px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.search-input-icon {
  padding: 0 16px;
  font-size: 20px;
  color: #667eea;
}

.enhanced-search-input {
  flex: 1;
  padding: 16px 8px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #333;
}

.enhanced-search-input::placeholder {
  color: #999;
}

.search-action-btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* 移动端搜索输入优化 */
@media (max-width: 768px) {
  .search-input-section {
    margin-bottom: 20px;
  }
  
  .search-input-wrapper {
    border-radius: 12px;
    padding: 6px;
  }
  
  .search-input-icon {
    padding: 0 12px;
    font-size: 18px;
  }
  
  .enhanced-search-input {
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .search-action-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
}

.search-action-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.search-action-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.search-suggestions {
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.suggestions-title {
  font-size: 14px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.suggestion-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.match-types-header {
  margin-bottom: 20px;
}

.match-types-title {
  font-size: 1.2rem;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.match-types-desc {
  opacity: 0.8;
  font-size: 0.9rem;
}

/* 移动端推荐类型标题优化 */
@media (max-width: 768px) {
  .match-types-header {
    margin-bottom: 16px;
  }
  
  .match-types-title {
    font-size: 1.1rem;
  }
  
  .match-types-desc {
    font-size: 0.85rem;
  }
}

.smart-match-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

/* 移动端响应式优化 */
@media (max-width: 768px) {
  .smart-match-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.match-type-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.match-type-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.match-type-card.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* 移动端卡片优化 */
@media (max-width: 768px) {
  .match-type-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .match-type-card:hover {
    transform: translateY(-2px);
  }
}

.match-type-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.match-type-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.match-type-desc {
  opacity: 0.9;
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
}

/* 移动端图标和文字优化 */
@media (max-width: 768px) {
  .match-type-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .match-type-title {
    font-size: 1rem;
    margin-bottom: 6px;
  }
  
  .match-type-desc {
    font-size: 0.85rem;
    margin-bottom: 12px;
    line-height: 1.4;
  }
}

.match-type-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stats-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 移动端统计徽章优化 */
@media (max-width: 768px) {
  .match-type-stats {
    gap: 6px;
  }
  
  .stats-badge {
    padding: 3px 6px;
    font-size: 11px;
    border-radius: 8px;
  }
}

.stats-badge.success {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.stats-badge.info {
  background: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.stats-badge.warning {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.stats-badge.primary {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
  border: 1px solid rgba(0, 123, 255, 0.3);
}

/* 推荐内容弹窗样式 */
.recommendation-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 60px 20px 120px 20px;
  overflow-y: auto;
}

.recommendation-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: calc(100vh - 180px);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid #f1f3f4;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  backdrop-filter: blur(10px);
}

.modal-badge {
  margin-left: 12px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-icon {
  font-size: 16px;
  font-weight: bold;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.modal-recommendations {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-recommendation-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.modal-recommendation-item:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #667eea;
}

/* 弹窗内推荐项样式 */
.modal-recommendation-item .recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.modal-recommendation-item .recommendation-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #495057;
  flex: 1;
}

.modal-recommendation-item .match-percentage {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.modal-recommendation-item .popularity-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.modal-recommendation-item .recommendation-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.modal-recommendation-item .meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6c757d;
}

.modal-recommendation-item .meta-icon {
  font-size: 16px;
}

.modal-recommendation-item .recommendation-description {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 14px;
}

.modal-recommendation-item .recommendation-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.modal-recommendation-item .action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.modal-recommendation-item .action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.modal-recommendation-item .action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.modal-recommendation-item .action-btn.secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
}

.modal-recommendation-item .action-btn.secondary:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.modal-recommendation-item .action-btn.ghost {
  background: transparent;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.modal-recommendation-item .action-btn.ghost:hover {
  background: #f8f9fa;
  color: #495057;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.refresh-modal-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.refresh-modal-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.close-modal-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* 弹窗移动端优化 */
@media (max-width: 768px) {
  .recommendation-modal-overlay {
    padding: 40px 10px 100px 10px;
  }
  
  .recommendation-modal {
    width: 95%;
    max-height: calc(100vh - 140px);
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
  
  .modal-content {
    padding: 16px 20px;
  }
  
  .modal-recommendation-item {
    padding: 16px;
  }
  
  .modal-footer {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
  }
  
  .refresh-modal-btn,
  .close-modal-btn {
    width: 100%;
    justify-content: center;
  }
}

/* 推荐内容展示区域 */
.recommendations-container {
  display: none; /* 不再使用，改为弹窗显示 */
}

/* 分隔线样式 */
.section-divider {
  display: flex;
  align-items: center;
  margin: 40px 0;
  gap: 16px;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e9ecef, transparent);
}

.divider-text {
  padding: 8px 24px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  font-weight: 600;
  color: #495057;
  font-size: 1.1rem;
  white-space: nowrap;
}

/* 社区动态区域样式 */
.simple-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.online-count {
  margin-left: auto;
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 社区动态样式 */
.post-composer {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.composer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.composer-username {
  font-weight: 600;
  color: #495057;
}

.composer-input {
  width: 100%;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
  margin-bottom: 12px;
}

.composer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topic-select {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 12px;
  background: white;
}

.composer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  font-size: 12px;
  color: #6c757d;
}

.publish-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.publish-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.publish-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.topic-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-tag {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  background: #e9ecef;
}

.filter-tag.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.feed-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feed-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.post-time {
  font-size: 12px;
  color: #6c757d;
}

.topic-badge {
  background: #e3f2fd;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.post-content {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 14px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.post-image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #f1f3f4;
}

.post-actions .action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6c757d;
  transition: color 0.2s ease;
}

.post-actions .action-btn:hover {
  color: #495057;
}

.post-actions .action-btn.liked {
  color: #e74c3c;
}

.action-icon {
  font-size: 16px;
}

.comments-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f3f4;
}

.comment-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.comment-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 12px;
}

.comment-submit-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
}

.comment-submit-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  gap: 8px;
}

.comment-avatar {
  width: 24px;
  height: 24px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-username {
  font-weight: 600;
  font-size: 12px;
  color: #667eea;
}

.comment-time {
  font-size: 10px;
  color: #6c757d;
}

.comment-text {
  font-size: 12px;
  color: #495057;
  line-height: 1.4;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.load-more-btn {
  padding: 12px 24px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #e9ecef;
}
</style>
