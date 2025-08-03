<template>
  <div class="page">
    <div class="simple-card">
      <div class="card-title" style="margin-bottom: 16px;">
        <div class="card-icon">🔍</div>
        智能搜索匹配
      </div>
      <input
        type="text"
        class="search-input"
        placeholder="例如：我想找一个懂Python和数据分析的队友做AI项目"
        v-model="searchQuery"
      />
      <button class="btn" @click="intelligentMatch">🎯 智能匹配</button>
    </div>

    <div
      class="feature-card"
      :class="{ expanded: expandedCard === 'project-recommendations' }"
      @click="toggleFeature('project-recommendations')"
    >
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">🎯</div>
          项目推荐
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">基于双塔模型的智能项目推荐</div>
      <span class="feature-status-badge status-available">3个推荐</span>

      <div class="feature-content">
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
    </div>

    <div
      class="feature-card"
      :class="{ expanded: expandedCard === 'course-recommendations' }"
      @click="toggleFeature('course-recommendations')"
    >
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">🎓</div>
          课程推荐
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">基于兴趣匹配的个性化课程推荐</div>
      <span class="feature-status-badge status-available">2个推荐</span>

      <div class="feature-content">
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
    </div>

    <div
      class="feature-card"
      :class="{ expanded: expandedCard === 'knowledge-recommendations' }"
      @click="toggleFeature('knowledge-recommendations')"
    >
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">💡</div>
          知识库推荐
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">热门知识点和创新方法论推荐</div>
      <span class="feature-status-badge status-available">热门内容</span>

      <div class="feature-content">
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Plaza',
  setup() {
    const expandedCard = ref(null)
    const searchQuery = ref('')

    const projectRecommendations = ref([
      {
        id: 1,
        title: '智能客服机器人开发',
        skills: 'Python, NLP, 深度学习',
        description: '基于大语言模型的智能客服系统，提升用户体验。',
        match: 95
      },
      {
        id: 2,
        title: '区块链存证平台',
        skills: '区块链, Solidity, Web3',
        description: '构建去中心化的数据存证解决方案。',
        match: 87
      },
      {
        id: 3,
        title: '数据可视化仪表板',
        skills: 'React, D3.js, 数据分析',
        description: '为企业提供直观的数据分析和展示平台。',
        match: 82
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

    const toggleFeature = (cardId) => {
      if (expandedCard.value === cardId) {
        expandedCard.value = null
      } else {
        expandedCard.value = cardId
      }
    }

    const intelligentMatch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索条件')
        return
      }
      ElMessage.success('正在为您智能匹配...')
      // 这里可以添加实际的匹配逻辑
    }

    return {
      expandedCard,
      searchQuery,
      projectRecommendations,
      courseRecommendations,
      knowledgeRecommendations,
      toggleFeature,
      intelligentMatch
    }
  }
}
</script>

<style scoped>
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

.search-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 12px;
}

.recommendation-item {
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f8f9fa;
}

.recommendation-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
}

.recommendation-meta {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 8px;
}

.match-score {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.feature-card.expanded {
  max-height: 1000px;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.feature-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #495057;
}

.feature-icon {
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.feature-arrow {
  font-size: 14px;
  color: #6c757d;
  transition: transform 0.3s ease;
}

.feature-card.expanded .feature-arrow {
  transform: rotate(180deg);
}

.feature-description {
  font-size: 14px;
  color: #6c757d;
  margin: 8px 0;
}

.feature-status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 12px;
}

.status-available {
  background: #d4edda;
  color: #155724;
}

.feature-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
</style>
