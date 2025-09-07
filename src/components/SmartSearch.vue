<template>
  <div class="search-section">
    <div class="search-header">
      <div class="search-title">
        <div class="search-icon">🎯</div>
        <div class="search-title-text">
          <h2>智能搜索匹配</h2>
        </div>
      </div>
      <div class="header-actions">
        <slot name="header-actions"></slot>
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
        <button class="search-action-btn" @click="performSearch" :disabled="!searchQuery.trim() || isSearching">
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

    <div class="smart-match-container" v-if="showSmartMatch">
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

    <!-- 推荐内容弹窗 -->
    <BaseModal :show="showRecommendationModal" :title="selectedType === 'project' ? '智能项目推荐' : selectedType === 'course' ? '个性化课程推荐' : '知识库推荐'" @close="closeRecommendationModal">
      <div class="modal-content">
        <!-- 项目推荐内容 -->
        <div v-if="selectedType === 'project'" class="modal-recommendations">
          <div class="modal-recommendation-item" v-for="project in projectRecommendations" :key="project.id">
            <div class="recommendation-header">
              <div class="recommendation-title">{{ project.title }}</div>
              <div class="match-percentage">{{ project.match }}%匹配</div>
            </div>
            <div class="recommendation-meta">
              <span class="meta-item"><span class="meta-icon">🛠️</span>需要技能: {{ project.skills }}</span>
              <span class="meta-item"><span class="meta-icon">👥</span>团队规模: {{ project.teamSize }}</span>
            </div>
            <p class="recommendation-description">{{ project.description }}</p>
            <div class="recommendation-actions">
              <BaseButton variant="primary">立即查看</BaseButton>
              <BaseButton variant="secondary">收藏</BaseButton>
              <BaseButton variant="ghost">分享</BaseButton>
            </div>
          </div>
        </div>
        <!-- 课程推荐内容 -->
        <div v-if="selectedType === 'course'" class="modal-recommendations">
          <div class="modal-recommendation-item" v-for="course in courseRecommendations" :key="course.id">
            <div class="recommendation-header">
              <div class="recommendation-title">{{ course.title }}</div>
              <div class="match-percentage">{{ course.match }}%匹配</div>
            </div>
            <div class="recommendation-meta">
              <span class="meta-item"><span class="meta-icon">👨‍🏫</span>讲师: {{ course.instructor }}</span>
              <span class="meta-item"><span class="meta-icon">⏱️</span>时长: {{ course.duration }}</span>
            </div>
            <p class="recommendation-description">{{ course.description }}</p>
            <div class="recommendation-actions">
              <BaseButton variant="primary">开始学习</BaseButton>
              <BaseButton variant="secondary">加入收藏</BaseButton>
              <BaseButton variant="ghost">分享课程</BaseButton>
            </div>
          </div>
        </div>
        <!-- 知识库推荐内容 -->
        <div v-if="selectedType === 'knowledge'" class="modal-recommendations">
          <div class="modal-recommendation-item" v-for="knowledge in knowledgeRecommendations" :key="knowledge.id">
            <div class="recommendation-header">
              <div class="recommendation-title">{{ knowledge.title }}</div>
              <div class="popularity-badge">{{ knowledge.popularity }}</div>
            </div>
            <div class="recommendation-meta">
              <span class="meta-item"><span class="meta-icon">📂</span>类型: {{ knowledge.type }}</span>
              <span class="meta-item"><span class="meta-icon">📅</span>更新: {{ knowledge.updated }}</span>
            </div>
            <p class="recommendation-description">{{ knowledge.description }}</p>
            <div class="recommendation-actions">
              <BaseButton variant="primary">立即学习</BaseButton>
              <BaseButton variant="secondary">加入书签</BaseButton>
              <BaseButton variant="ghost">推荐给好友</BaseButton>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="d-flex" style="gap: 8px; justify-content: flex-end; width: 100%">
          <BaseButton variant="secondary" @click="refreshRecommendations">
            <span class="refresh-icon">🔄</span>
            刷新推荐
          </BaseButton>
          <BaseButton variant="primary" @click="closeRecommendationModal">关闭</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  name: 'SmartSearch',
  components: { BaseModal, BaseButton },
  setup() {
    const searchQuery = ref('')
    const isSearching = ref(false)
    const showSuggestions = ref(false)
    const showSmartMatch = ref(false)
    const selectedType = ref('')
    const showRecommendationModal = ref(false)
    let searchTimer = null

    const searchSuggestions = ref([
      'Python数据分析项目',
      'Web前端开发团队',
      '机器学习课程推荐',
      'React项目合作',
      'UI设计学习资源'
    ])

    const projectRecommendations = ref([
      { id: 1, title: '智能客服机器人开发', skills: 'Python, NLP, 深度学习', description: '基于大语言模型的智能客服系统，提升用户体验。', match: 95, teamSize: '3-5人' },
      { id: 2, title: '区块链存证平台', skills: '区块链, Solidity, Web3', description: '构建去中心化的数据存证解决方案。', match: 87, teamSize: '2-4人' },
      { id: 3, title: '数据可视化仪表板', skills: 'React, D3.js, 数据分析', description: '为企业提供直观的数据分析和展示平台。', match: 82, teamSize: '4-6人' }
    ])

    const courseRecommendations = ref([
      { id: 1, title: '深度学习进阶课程', instructor: '李教授', duration: '40课时', description: '深入学习CNN、RNN、Transformer等前沿技术。', match: 93 },
      { id: 2, title: '大数据处理实战', instructor: '张博士', duration: '32课时', description: 'Spark、Hadoop生态系统实战应用。', match: 88 },
      { id: 3, title: '产品经理实战营', instructor: '王老师', duration: '24课时', description: '从0到1打造用户喜爱的产品。', match: 85 }
    ])

    const knowledgeRecommendations = ref([
      { id: 1, title: 'GNN在推荐系统中的应用', type: '论文', updated: '2024-08-12', popularity: '🔥 热门', description: '图神经网络如何提升大规模推荐效果。' },
      { id: 2, title: 'Prompt Engineering 最佳实践', type: '文档', updated: '2024-07-28', popularity: '⭐ 精选', description: '高质量提示词的构建方法与案例。' },
      { id: 3, title: 'RAG 知识增强检索指南', type: '教程', updated: '2024-09-01', popularity: '🆕 新上架', description: '从零搭建你的RAG系统。' }
    ])

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
      setTimeout(() => { showSuggestions.value = false }, 150)
    }

    const applySuggestion = (suggestion) => {
      searchQuery.value = suggestion
      performSearch()
    }

    const performSearch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容')
        return
      }
      if (isSearching.value) return
      isSearching.value = true

      if (searchTimer) {
        clearTimeout(searchTimer)
        searchTimer = null
      }
      ElMessage.success('正在智能分析您的需求...')
      searchTimer = setTimeout(() => {
        isSearching.value = false
        showSmartMatch.value = true
        selectedType.value = 'project'
        showRecommendationModal.value = true
      }, 800)
    }

    const selectRecommendationType = (type) => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容')
        return
      }
      selectedType.value = type
      showRecommendationModal.value = true
      ElMessage.success(`正在为您匹配${type === 'project' ? '项目' : type === 'course' ? '课程' : '知识库'}推荐...`)
    }

    const refreshRecommendations = () => {
      ElMessage.success('已为您刷新推荐')
    }

    const closeRecommendationModal = () => {
      showRecommendationModal.value = false
    }

    return {
      // 数据
      searchQuery,
      isSearching,
      showSuggestions,
      showSmartMatch,
      selectedType,
      showRecommendationModal,
      
      searchSuggestions,
      projectRecommendations,
      courseRecommendations,
      knowledgeRecommendations,
      // 方法
      onSearchInput,
      onSearchFocus,
      onSearchBlur,
      applySuggestion,
      performSearch,
      selectRecommendationType,
      refreshRecommendations,
      closeRecommendationModal
    }
  }
}
</script>

<style scoped>
/* 智能搜索匹配区域样式（节选自 Plaza） */
.search-section {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  position: relative; /* 便于移动端将右上角操作按钮绝对定位 */
}

.search-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.search-title { display: flex; align-items: center; gap: 12px; }
.header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search-icon { font-size: 28px; }
.search-title-text h2 { margin: 0; font-size: 20px; color: #2c3e50; }
.search-stats { display: flex; gap: 16px; }
.stat-item { background: #f8f9fa; border: 1px solid #eef1f5; border-radius: 10px; padding: 8px 12px; text-align: center; }
.stat-number { display: block; font-weight: 700; color: #2c3e50; }
.stat-label { display: block; font-size: 12px; color: #6c757d; }

.search-input-section { margin-top: 4px; }
.search-input-wrapper { display: flex; align-items: center; gap: 8px; background: #f8f9fa; border: 1px solid #e6edff; border-radius: 12px; padding: 10px 12px; }
.search-input-icon { font-size: 18px; }
.enhanced-search-input { flex: 1; border: none; outline: none; background: transparent; font-size: 14px; color: #2c3e50; }
.enhanced-search-input::placeholder { color: #9aa4b2; }
.search-action-btn { background: #667eea; color: #fff; border: none; border-radius: 10px; padding: 8px 14px; cursor: pointer; transition: all .2s; }
.search-action-btn:disabled { background: #bfc7ff; cursor: not-allowed; }
.search-action-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }

.search-suggestions { margin-top: 10px; background: #fff; border: 1px solid #e6edff; border-radius: 12px; padding: 10px; }
.suggestions-title { font-size: 12px; color: #6c757d; margin-bottom: 6px; }
.suggestions-list { display: flex; gap: 8px; flex-wrap: wrap; }
.suggestion-tag { background: #f1f4ff; color: #4f46e5; border: 1px dashed #c7d2fe; border-radius: 999px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
.suggestion-tag:hover { background: #e5eaff; }

.smart-match-container { margin-top: 14px; }
.match-types-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.match-types-title { font-weight: 600; color: #2c3e50; }
.match-types-desc { color: #6c757d; font-size: 12px; }
.smart-match-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.match-type-card { display: flex; gap: 12px; background: #fff; border: 1px solid #e6edff; border-radius: 12px; padding: 12px; cursor: pointer; transition: all .2s; }
.match-type-card:hover { border-color: #667eea; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(102, 126, 234, 0.12); }
.match-type-card.active { border-color: #667eea; background: #f7f8ff; }
.match-type-icon { font-size: 22px; }
.match-type-title { font-weight: 600; color: #2c3e50; margin-bottom: 4px; }
.match-type-desc { font-size: 12px; color: #6c757d; margin-bottom: 8px; }
.match-type-stats { display: flex; gap: 8px; }
.stats-badge { font-size: 12px; padding: 4px 8px; border-radius: 999px; background: #eef2ff; color: #4f46e5; }
.stats-badge.success { background: #e8fff3; color: #10b981; }
.stats-badge.warning { background: #fff7ed; color: #f59e0b; }
.stats-badge.info { background: #e0f2fe; color: #0284c7; }
.stats-badge.primary { background: #eef2ff; color: #4f46e5; }

/* 弹窗内容局部样式 */
.modal-recommendations { display: grid; gap: 12px; }
.modal-recommendation-item { border: 1px solid #eef1f5; border-radius: 12px; padding: 12px; }
.recommendation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.recommendation-title { font-weight: 600; color: #2c3e50; }
.match-percentage { font-size: 12px; color: #4f46e5; background: #eef2ff; padding: 2px 6px; border-radius: 999px; }
.popularity-badge { font-size: 12px; color: #f59e0b; background: #fff7ed; padding: 2px 6px; border-radius: 999px; }
.recommendation-meta { display: flex; flex-wrap: wrap; gap: 10px; color: #6c757d; font-size: 12px; margin-bottom: 6px; }
.meta-item { display: inline-flex; align-items: center; gap: 4px; }
.recommendation-description { color: #475569; font-size: 13px; margin: 0 0 8px; }
.recommendation-actions { display: flex; gap: 8px; }

@media (max-width: 768px) {
  .search-header { position: relative; flex-direction: column; align-items: flex-start; gap: 10px; }
  .header-actions { 
    margin-top: 0; 
    position: absolute; 
    top: 0; 
    right: 0; 
    z-index: 2;
  }
}
</style>
