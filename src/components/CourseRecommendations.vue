<template>
  <div class="course-recommendations">
    <div class="recommendations-header">
      <h3>推荐课程</h3>
      <p class="recommendations-subtitle">基于您的兴趣和学习历史</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在获取推荐课程...</p>
    </div>

    <div v-else-if="recommendations.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
      </svg>
      <h4>暂无推荐课程</h4>
      <p>系统正在为您分析合适的课程推荐</p>
    </div>

    <div v-else class="recommendations-grid">
      <div 
        v-for="course in recommendations" 
        :key="course.course_id" 
        class="recommendation-card"
        @click="goToCourse(course.course_id)"
      >
        <div class="course-cover">
          <img 
            v-if="course.cover_image_url" 
            :src="course.cover_image_url" 
            :alt="course.title"
            @error="handleImageError"
          />
          <div v-else class="default-cover">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
          </div>
          
          <!-- 匹配度标签 -->
          <div class="match-score">
            {{ Math.round(course.relevance_score * 100) }}% 匹配
          </div>
        </div>

        <div class="course-content">
          <div class="course-header">
            <h4 class="course-title">{{ course.title }}</h4>
            <div v-if="course.category" class="course-category">
              {{ course.category }}
            </div>
          </div>

          <p v-if="course.instructor" class="course-instructor">
            讲师：{{ course.instructor }}
          </p>

          <p class="course-description">
            {{ truncateDescription(course.description, 100) }}
          </p>

          <!-- AI推荐理由 -->
          <div v-if="course.match_rationale" class="recommendation-rationale">
            <div class="rationale-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H16.5C17.88,14 19,15.12 19,16.5V17.5C19,18.88 17.88,20 16.5,20H7.5C6.12,20 5,18.88 5,17.5V16.5C5,15.12 6.12,14 7.5,14H9.29L9.56,13.73C8.59,12.59 8,11.11 8,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5A4.5,4.5 0 0,0 5,9.5A4.5,4.5 0 0,0 9.5,14A4.5,4.5 0 0,0 14,9.5A4.5,4.5 0 0,0 9.5,5Z"/>
              </svg>
              <span>推荐理由</span>
            </div>
            <p class="rationale-text">{{ course.match_rationale }}</p>
          </div>

          <div class="course-footer">
            <div class="similarity-info">
              <span class="similarity-label">相似度：</span>
              <div class="similarity-bar">
                <div 
                  class="similarity-fill" 
                  :style="{ width: (course.similarity_stage1 * 100) + '%' }"
                ></div>
              </div>
              <span class="similarity-value">
                {{ Math.round(course.similarity_stage1 * 100) }}%
              </span>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button 
            @click.stop="viewCourse(course)"
            class="btn-primary"
          >
            查看详情
          </button>
          <button 
            @click.stop="enrollCourse(course)"
            class="btn-secondary"
          >
            立即学习
          </button>
        </div>
      </div>
    </div>

    <!-- 刷新推荐按钮 -->
    <div v-if="!loading && recommendations.length > 0" class="recommendations-footer">
      <button @click="refreshRecommendations" class="btn-outline" :disabled="loading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
        </svg>
        刷新推荐
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api.js'

export default {
  name: 'CourseRecommendations',
  props: {
    studentId: {
      type: [String, Number],
      default: 1 // 默认用户ID，实际应从用户状态获取
    },
    maxRecommendations: {
      type: Number,
      default: 6
    },
    excludeCourseId: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['course-selected', 'course-enrolled'],
  setup(props, { emit }) {
    const router = useRouter()
    const loading = ref(true)
    const recommendations = ref([])

    // 获取推荐课程
    const loadRecommendations = async () => {
      try {
        loading.value = true
        const response = await apiService.getRecommendedCourses(props.studentId, {
          final_k: props.maxRecommendations
        })
        
        if (response.data.success) {
          let recs = response.data.data
          
          // 排除当前课程
          if (props.excludeCourseId) {
            recs = recs.filter(rec => rec.course_id != props.excludeCourseId)
          }
          
          recommendations.value = recs
        }
      } catch (error) {
        console.error('加载推荐课程失败:', error)
        // 如果API失败，使用模拟数据
        loadMockRecommendations()
      } finally {
        loading.value = false
      }
    }

    // 模拟推荐数据
    const loadMockRecommendations = () => {
      recommendations.value = [
        {
          course_id: 101,
          title: '深入理解JavaScript',
          description: '全面学习JavaScript高级特性，包括闭包、原型链、异步编程等核心概念',
          instructor: '李教授',
          category: '前端开发',
          cover_image_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
          similarity_stage1: 0.85,
          relevance_score: 0.92,
          match_rationale: '基于您对Vue.js的学习兴趣，JavaScript进阶知识将帮助您更好地理解框架底层原理，提升开发技能。建议先掌握异步编程和模块化概念。'
        },
        {
          course_id: 102,
          title: 'React开发实战',
          description: '从基础到高级的React开发课程，包含Hooks、Context、性能优化等内容',
          instructor: '王工程师',
          category: '前端开发',
          cover_image_url: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=250&fit=crop',
          similarity_stage1: 0.78,
          relevance_score: 0.88,
          match_rationale: '作为另一个主流前端框架，React与Vue有相似的组件化思想，学习React将拓展您的技术栈，提升就业竞争力。'
        },
        {
          course_id: 103,
          title: 'TypeScript完全指南',
          description: '学习TypeScript类型系统，提升代码质量和开发效率',
          instructor: '张博士',
          category: '编程语言',
          similarity_stage1: 0.82,
          relevance_score: 0.85,
          match_rationale: 'TypeScript为JavaScript添加了静态类型检查，能够显著提升大型项目的开发体验和代码维护性。'
        }
      ]
    }

    // 刷新推荐
    const refreshRecommendations = () => {
      loadRecommendations()
    }

    // 跳转到课程
    const goToCourse = (courseId) => {
      router.push(`/courses/${courseId}`)
    }

    // 查看课程详情
    const viewCourse = (course) => {
      emit('course-selected', course)
      goToCourse(course.course_id)
    }

    // 报名课程
    const enrollCourse = async (course) => {
      try {
        const response = await apiService.enrollCourse(course.course_id, props.studentId)
        if (response.data.success) {
          emit('course-enrolled', course)
          alert('报名成功！')
          // 跳转到课程详情页
          goToCourse(course.course_id)
        } else {
          alert(response.data.message || '报名失败')
        }
      } catch (error) {
        console.error('报名失败:', error)
        alert('报名失败，请稍后重试')
      }
    }

    // 工具函数
    const truncateDescription = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
      event.target.parentElement.classList.add('image-error')
    }

    // 生命周期
    onMounted(() => {
      loadRecommendations()
    })

    return {
      loading,
      recommendations,
      loadRecommendations,
      refreshRecommendations,
      goToCourse,
      viewCourse,
      enrollCourse,
      truncateDescription,
      handleImageError
    }
  }
}
</script>

<style scoped>
.course-recommendations {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.recommendations-header {
  text-align: center;
  margin-bottom: 32px;
}

.recommendations-header h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.recommendations-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h4 {
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.recommendation-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
}

.recommendation-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
}

.course-cover {
  position: relative;
  height: 180px;
  background: #e9ecef;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .course-cover img {
  transform: scale(1.05);
}

.default-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #adb5bd;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.default-cover svg {
  color: white;
  opacity: 0.8;
}

.match-score {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.course-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: white;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.course-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.course-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.course-instructor {
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.course-description {
  color: #6c757d;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex: 1;
}

.recommendation-rationale {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  border-left: 4px solid #667eea;
}

.rationale-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.rationale-header svg {
  color: #667eea;
}

.rationale-text {
  color: #495057;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
}

.course-footer {
  margin-top: auto;
}

.similarity-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6c757d;
}

.similarity-label {
  font-weight: 500;
}

.similarity-bar {
  flex: 1;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.similarity-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.6s ease;
}

.similarity-value {
  font-weight: 600;
  color: #2c3e50;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e9ecef;
}

.btn-primary, .btn-secondary, .btn-outline {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 0.9rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn-outline {
  background: white;
  color: #6c757d;
  border: 1px solid #e9ecef;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: auto;
  flex: none;
}

.btn-outline:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recommendations-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
}

/* 响应式 */
@media (max-width: 768px) {
  .course-recommendations {
    padding: 24px;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .course-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .course-category {
    align-self: flex-end;
  }

  .card-actions {
    flex-direction: column;
  }

  .similarity-info {
    flex-wrap: wrap;
    gap: 6px;
  }

  .similarity-bar {
    min-width: 80px;
  }
}

/* 图片加载错误样式 */
.course-cover.image-error {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-cover.image-error::after {
  content: '📚';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  opacity: 0.6;
}
</style>
