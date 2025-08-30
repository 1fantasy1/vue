<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon active">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-number">{{ stats.totalCourses }}</div>
        <div class="stat-label">总课程数</div>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon published">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-number">{{ stats.activeCourses }}</div>
        <div class="stat-label">已发布</div>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon materials">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-number">{{ stats.totalMaterials }}</div>
        <div class="stat-label">课程材料</div>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon students">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
        </svg>
      </div>
      <div class="stat-info">
        <div class="stat-number">{{ stats.totalStudents }}</div>
        <div class="stat-label">学习人数</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseStatistics',
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.published {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.stat-icon.materials {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
}

.stat-icon.students {
  background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
