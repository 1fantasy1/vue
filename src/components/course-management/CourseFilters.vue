<template>
  <div class="filters-section">
    <div class="search-box">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H16.5C17.88,14 19,15.12 19,16.5V17.5C19,18.88 17.88,20 16.5,20H7.5C6.12,20 5,18.88 5,17.5V16.5C5,15.12 6.12,14 7.5,14H9.29L9.56,13.73C8.59,12.59 8,11.11 8,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5A4.5,4.5 0 0,0 5,9.5A4.5,4.5 0 0,0 9.5,14A4.5,4.5 0 0,0 14,9.5A4.5,4.5 0 0,0 9.5,5Z"/>
      </svg>
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text" 
        placeholder="搜索课程名称、讲师或分类..."
      >
    </div>
    
    <div class="filter-tabs">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.key"
        class="filter-tab"
        :class="{ active: activeFilter === tab.key }"
        @click="$emit('update:activeFilter', tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseFilters',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeFilter: {
      type: String,
      default: 'all'
    },
    filterTabs: {
      type: Array,
      required: true
    }
  },
  emits: ['update:searchQuery', 'update:activeFilter']
}
</script>

<style scoped>
.filters-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-tab.active {
  background: #667eea;
  color: white;
}

.filter-tab:hover:not(.active) {
  background: #e9ecef;
}
</style>
