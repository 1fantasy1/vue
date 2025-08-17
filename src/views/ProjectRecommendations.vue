<template>
  <div class="recommendations-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="page-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2M2 17L12 22L22 17M2 12L12 17L22 12"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">项目推荐</h1>
            <p class="page-description">基于您的技能和兴趣，为您推荐合适的项目</p>
          </div>
        </div>
        <div class="header-right">
          <button class="refresh-btn" @click="refreshRecommendations" :disabled="loading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" :class="{ spinning: loading }">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
            </svg>
            刷新推荐
          </button>
        </div>
      </div>
    </div>

    <!-- 推荐设置 -->
    <div class="settings-section">
      <div class="settings-card">
        <h3>推荐设置</h3>
        <div class="settings-form">
          <div class="form-row">
            <div class="form-field">
              <label>初筛项目数量</label>
              <input 
                type="number" 
                v-model.number="settings.initialK" 
                min="10" 
                max="200" 
                @change="onSettingsChange"
              />
              <small>AI将从所有项目中初步筛选出的数量</small>
            </div>
            <div class="form-field">
              <label>最终推荐数量</label>
              <input 
                type="number" 
                v-model.number="settings.finalK" 
                min="1" 
                max="20" 
                @change="onSettingsChange"
              />
              <small>经过精确匹配后最终推荐的数量</small>
            </div>
          </div>
          <button class="apply-settings-btn" @click="applyRecommendations" :disabled="loading">
            应用设置并获取推荐
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-section">
      <div class="loading-card">
        <div class="loading-spinner"></div>
        <h3>正在为您推荐项目...</h3>
        <p>AI正在分析您的技能和兴趣，请稍候</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-section">
      <div class="error-card">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
        </div>
        <h3>推荐失败</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" @click="refreshRecommendations">重试</button>
      </div>
    </div>

    <!-- 推荐结果 -->
    <div v-else-if="recommendations.length > 0" class="recommendations-section">
      <div class="section-header">
        <h2>为您推荐的项目</h2>
        <p class="section-desc">共找到 {{ recommendations.length }} 个匹配的项目</p>
      </div>

      <div class="recommendations-grid">
        <div 
          v-for="project in recommendations" 
          :key="project.project_id"
          class="recommendation-card"
          @click="viewProject(project.project_id)"
        >
          <!-- 项目头部 -->
          <div class="card-header">
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <span v-if="project.project_type" class="project-type">{{ project.project_type }}</span>
            </div>
            <div class="scores">
              <div class="score-item">
                <label>相似度</label>
                <span class="score-value similarity">{{ formatScore(project.similarity_stage1) }}</span>
              </div>
              <div class="score-item">
                <label>相关性</label>
                <span class="score-value relevance">{{ formatScore(project.relevance_score) }}</span>
              </div>
            </div>
          </div>

          <!-- 项目描述 -->
          <div class="project-description" v-if="project.description">
            <p>{{ project.description }}</p>
          </div>

          <!-- 技能匹配 -->
          <div class="skills-section" v-if="project.required_skills && project.required_skills.length > 0">
            <h4>所需技能</h4>
            <div class="skills-list">
              <div 
                v-for="skill in project.required_skills" 
                :key="skill.name"
                class="skill-tag"
                :class="getSkillLevelClass(skill.level)"
              >
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}</span>
              </div>
            </div>
          </div>

          <!-- AI推荐理由 -->
          <div class="rationale-section" v-if="project.match_rationale">
            <h4>推荐理由</h4>
            <div class="rationale-content">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="ai-icon">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17A1.5,1.5 0 0,0 13.5,15.5A1.5,1.5 0 0,0 12,14A1.5,1.5 0 0,0 10.5,15.5A1.5,1.5 0 0,0 12,17M12,10.5C12.83,10.5 13.5,9.83 13.5,9C13.5,8.17 12.83,7.5 12,7.5C11.17,7.5 10.5,8.17 10.5,9C10.5,9.83 11.17,10.5 12,10.5Z"/>
              </svg>
              <p>{{ project.match_rationale }}</p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <button class="btn secondary" @click.stop="viewProject(project.project_id)">
              查看详情
            </button>
            <button class="btn primary" @click.stop="applyToProject(project)">
              申请加入
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-section">
      <div class="empty-card">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z"/>
          </svg>
        </div>
        <h3>暂无推荐项目</h3>
        <p>目前没有找到匹配您技能和兴趣的项目</p>
        <p>尝试调整推荐设置或稍后再来看看</p>
        <button class="refresh-btn-large" @click="refreshRecommendations">
          获取推荐
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ApiService } from '@/services/api.js'

export default {
  name: 'ProjectRecommendations',
  setup() {
    const router = useRouter()
    
    // 响应式数据
    const loading = ref(false)
    const error = ref('')
    const recommendations = ref([])
    
    const settings = ref({
      initialK: 50,
      finalK: 5
    })

    // 当前用户ID（应该从认证状态获取）
    const currentUserId = ref(localStorage.getItem('userId') || '1')

    // 格式化分数
    const formatScore = (score) => {
      if (typeof score !== 'number' || isNaN(score)) return '-'
      return (score * 100).toFixed(1) + '%'
    }

    // 获取技能等级样式类
    const getSkillLevelClass = (level) => {
      switch (level) {
        case '初窥门径': return 'level-beginner'
        case '登堂入室': return 'level-intermediate' 
        case '融会贯通': return 'level-advanced'
        case '炉火纯青': return 'level-expert'
        default: return 'level-beginner'
      }
    }

    // 获取推荐项目
    const fetchRecommendations = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const response = await ApiService.recommendProjects(currentUserId.value, {
          initialK: settings.value.initialK,
          finalK: settings.value.finalK
        })
        
        if (response.data.success) {
          recommendations.value = response.data.data || []
        } else {
          error.value = response.data.message || '获取推荐失败'
        }
      } catch (err) {
        error.value = err.message || '获取推荐失败'
      } finally {
        loading.value = false
      }
    }

    // 刷新推荐
    const refreshRecommendations = () => {
      fetchRecommendations()
    }

    // 设置变化时的处理
    const onSettingsChange = () => {
      // 设置变化时不自动刷新，等用户点击应用按钮
    }

    // 应用设置并获取推荐
    const applyRecommendations = () => {
      fetchRecommendations()
    }

    // 查看项目详情
    const viewProject = (projectId) => {
      router.push(`/projects/${projectId}`)
    }

    // 申请加入项目
    const applyToProject = async (project) => {
      try {
        // 这里可以打开申请表单或直接提交申请
        router.push(`/projects/${project.project_id}`)
      } catch (err) {
        alert(err.message || '申请失败')
      }
    }

    // 初始化
    onMounted(() => {
      fetchRecommendations()
    })

    return {
      loading,
      error,
      recommendations,
      settings,
      formatScore,
      getSkillLevelClass,
      fetchRecommendations,
      refreshRecommendations,
      onSettingsChange,
      applyRecommendations,
      viewProject,
      applyToProject
    }
  }
}
</script>

<style scoped>
.recommendations-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.header-text h1 {
  margin: 0 0 8px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 设置部分 */
.settings-section {
  margin-bottom: 30px;
}

.settings-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.settings-card h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-field input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

.form-field input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-field small {
  color: #6b7280;
  font-size: 12px;
}

.apply-settings-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-settings-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.apply-settings-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载状态 */
.loading-section {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.loading-card {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-card h3 {
  margin: 0 0 8px 0;
  color: #111827;
}

.loading-card p {
  margin: 0;
  color: #6b7280;
}

/* 错误状态 */
.error-section {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.error-card {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.error-icon {
  color: #ef4444;
  margin-bottom: 20px;
}

.error-card h3 {
  margin: 0 0 8px 0;
  color: #111827;
}

.error-card p {
  margin: 0 0 20px 0;
  color: #6b7280;
}

.retry-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #dc2626;
}

/* 推荐结果 */
.recommendations-section {
  margin-bottom: 30px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.section-desc {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.recommendation-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-info {
  flex: 1;
}

.project-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.project-type {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.scores {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 16px;
}

.score-item {
  text-align: center;
}

.score-item label {
  display: block;
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 2px;
}

.score-value {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.score-value.similarity {
  background: #dbeafe;
  color: #1e40af;
}

.score-value.relevance {
  background: #dcfce7;
  color: #166534;
}

.project-description {
  margin-bottom: 16px;
}

.project-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.skills-section {
  margin-bottom: 16px;
}

.skills-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
}

.skill-tag.level-beginner {
  background: #fef3c7;
  color: #92400e;
}

.skill-tag.level-intermediate {
  background: #dbeafe;
  color: #1e40af;
}

.skill-tag.level-advanced {
  background: #d1fae5;
  color: #065f46;
}

.skill-tag.level-expert {
  background: #ede9fe;
  color: #5b21b6;
}

.skill-name {
  font-weight: 600;
}

.skill-level {
  font-weight: 500;
}

.rationale-section {
  margin-bottom: 20px;
}

.rationale-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.rationale-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.ai-icon {
  color: #667eea;
  margin-top: 2px;
  flex-shrink: 0;
}

.rationale-content p {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn.secondary:hover {
  background: #e5e7eb;
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn.primary:hover {
  background: #5a67d8;
}

/* 空状态 */
.empty-section {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.empty-card {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 400px;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-card h3 {
  margin: 0 0 12px 0;
  color: #111827;
}

.empty-card p {
  margin: 0 0 8px 0;
  color: #6b7280;
  line-height: 1.5;
}

.refresh-btn-large {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
}

.refresh-btn-large:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recommendations-page {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-text h1 {
    font-size: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .scores {
    flex-direction: row;
    margin-left: 0;
  }
}
</style>
