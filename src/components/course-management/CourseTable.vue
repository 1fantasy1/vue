<template>
  <div class="courses-table">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载课程数据...</p>
    </div>

    <div v-else-if="courses.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
      </svg>
      <p>暂无课程数据</p>
    </div>

    <div v-else class="table-container">
      <table class="courses-table-content">
        <thead>
          <tr>
            <th>课程信息</th>
            <th>讲师</th>
            <th>分类</th>
            <th>评分</th>
            <th>材料数</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id" class="course-row">
            <td>
              <div class="course-info">
                <img 
                  :src="course.cover_image_url || '/default-course.jpg'" 
                  :alt="course.title"
                  class="course-thumbnail"
                >
                <div class="course-details">
                  <h3 class="course-title">{{ course.title }}</h3>
                  <p class="course-description">
                    {{ truncateText(course.description, 60) }}
                  </p>
                </div>
              </div>
            </td>
            <td>{{ course.instructor }}</td>
            <td>
              <span class="category-badge">{{ course.category }}</span>
            </td>
            <td>
              <div class="rating">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(course.avg_rating) }">★</span>
                <span class="rating-value">{{ course.avg_rating?.toFixed(1) || '0.0' }}</span>
              </div>
            </td>
            <td>
              <span class="material-count">{{ course.total_lessons || 0 }}</span>
            </td>
            <td class="update-time">
              {{ formatDate(course.updated_at) }}
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" @click="$emit('view-course', course)" title="查看">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                  </svg>
                </button>
                <button class="action-btn edit" @click="$emit('edit-course', course)" title="编辑">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                  </svg>
                </button>
                <button class="action-btn materials" @click="$emit('manage-materials', course)" title="管理材料">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </button>
                <button class="action-btn delete" @click="$emit('delete-course', course)" title="删除">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseTable',
  props: {
    courses: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-course', 'edit-course', 'manage-materials', 'delete-course'],
  methods: {
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    formatDate(dateString) {
      if (!dateString) return '未知'
      try {
        return new Date(dateString).toLocaleDateString('zh-CN')
      } catch {
        return '无效日期'
      }
    }
  }
}
</script>

<style scoped>
.courses-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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

.table-container {
  overflow-x: auto;
}

.courses-table-content {
  width: 100%;
  border-collapse: collapse;
}

.courses-table-content th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
}

.course-row {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.course-row:hover {
  background: #f8f9fa;
}

.courses-table-content td {
  padding: 16px 12px;
  vertical-align: middle;
}

.course-info {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
}

.course-thumbnail {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.course-details {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-description {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.4;
}

.category-badge {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  color: #e9ecef;
  font-size: 0.8rem;
}

.star.filled {
  color: #ffc107;
}

.rating-value {
  font-size: 0.85rem;
  color: #6c757d;
  margin-left: 4px;
}

.material-count {
  background: #f8f9fa;
  color: #6c757d;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.update-time {
  color: #6c757d;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn.view {
  background: #e3f2fd;
  color: #1976d2;
}

.action-btn.view:hover {
  background: #1976d2;
  color: white;
}

.action-btn.edit {
  background: #fff3e0;
  color: #f57c00;
}

.action-btn.edit:hover {
  background: #f57c00;
  color: white;
}

.action-btn.materials {
  background: #f3e5f5;
  color: #7b1fa2;
}

.action-btn.materials:hover {
  background: #7b1fa2;
  color: white;
}

.action-btn.delete {
  background: #ffebee;
  color: #d32f2f;
}

.action-btn.delete:hover {
  background: #d32f2f;
  color: white;
}

@media (max-width: 768px) {
  .courses-table-content {
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .course-info {
    max-width: 200px;
  }
}
</style>
