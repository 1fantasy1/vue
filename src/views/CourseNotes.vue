<template>
  <div class="page">
    <div class="header">
      <div class="title-section">
        <h1 class="page-title">课程笔记</h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <div class="decoration-line"></div>
        </div>
        <p class="page-subtitle">记录学习历程，沉淀知识精华</p>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
        </svg>
        <input type="text" placeholder="搜索笔记..." v-model="searchQuery">
      </div>

      <div class="filter-controls">
        <select v-model="selectedCourse" class="course-filter">
          <option value="">所有课程</option>
          <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
        </select>
        <select v-model="sortBy" class="sort-filter">
          <option value="date">按时间排序</option>
          <option value="course">按课程排序</option>
          <option value="title">按标题排序</option>
        </select>
      </div>

      <button class="add-btn" @click="createNote">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        新建笔记
      </button>
    </div>

    <div class="notes-layout">
      <div class="notes-grid">
        <div class="note-card" v-for="note in filteredNotes" :key="note.id" @click="openNote(note)">
          <div class="note-header">
            <h3 class="note-title">{{ note.title }}</h3>
            <div class="note-actions" @click.stop>
              <button class="action-btn" @click="editNote(note.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25Z"/>
                </svg>
              </button>
              <button class="action-btn" @click="deleteNote(note.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="note-meta">
            <span class="note-course">{{ note.course }}</span>
            <span class="note-date">{{ note.date }}</span>
          </div>

          <div class="note-content">
            {{ note.preview }}
          </div>

          <div class="note-tags">
            <span class="tag" v-for="tag in note.tags" :key="tag">{{ tag }}</span>
          </div>

          <div class="note-footer">
            <div class="note-stats">
              <span class="stat-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                {{ note.wordCount }}字
              </span>
              <span class="stat-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                </svg>
                {{ note.readTime }}分钟阅读
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记详情模态框 -->
    <div class="modal-overlay" v-if="selectedNote" @click="closeNote">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedNote.title }}</h2>
          <button class="close-btn" @click="closeNote">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-meta">
          <span class="course">{{ selectedNote.course }}</span>
          <span class="date">{{ selectedNote.date }}</span>
        </div>
        <div class="modal-body">
          <div class="note-full-content">
            {{ selectedNote.content }}
          </div>
          <div class="note-images" v-if="selectedNote.images">
            <img v-for="image in selectedNote.images" :key="image" :src="image" alt="笔记图片">
          </div>
        </div>
        <div class="modal-footer">
          <div class="tags">
            <span class="tag" v-for="tag in selectedNote.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="actions">
            <button class="btn primary" @click="editNote(selectedNote.id)">编辑笔记</button>
            <button class="btn" @click="shareNote(selectedNote.id)">分享笔记</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

export default {
  name: 'CourseNotes',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedCourse = ref('')
    const sortBy = ref('date')
    const selectedNote = ref(null)
    
    const courses = ref([
      'Vue.js 3.0 完整开发教程',
      'Python数据分析与机器学习',
      'UI/UX设计基础',
      'Node.js后端开发实战',
      'React Native移动开发'
    ])
    
    const notes = ref([
      {
        id: 1,
        title: 'Vue 3 组合式API详解',
        course: 'Vue.js 3.0 完整开发教程',
        date: '2024-01-15',
        preview: 'Composition API是Vue 3最重要的新特性之一，它提供了一种新的方式来组织组件逻辑...',
        content: `# Vue 3 组合式API详解

## 什么是组合式API？

组合式API（Composition API）是Vue 3最重要的新特性之一，它提供了一种新的方式来组织组件逻辑。

## 基本用法

### setup函数
setup函数是组合式API的入口点：

\`\`\`javascript
import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3'
    })
    
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      increment
    }
  }
}
\`\`\`

## 响应式引用

### ref
用于创建响应式引用：
- 基本数据类型使用ref
- 访问值需要使用.value

### reactive
用于创建响应式对象：
- 复杂数据类型使用reactive
- 直接访问属性，无需.value

## 生命周期钩子

在setup中使用生命周期钩子：

\`\`\`javascript
import { onMounted, onUpdated } from 'vue'

setup() {
  onMounted(() => {
    console.log('组件挂载完成')
  })
  
  onUpdated(() => {
    console.log('组件更新完成')
  })
}
\`\`\`

## 总结

组合式API提供了更好的逻辑复用和类型推导支持，是Vue 3推荐的编程方式。`,
        tags: ['Vue3', '组合式API', 'JavaScript'],
        wordCount: 320,
        readTime: 3,
        images: []
      },
      {
        id: 2,
        title: 'Python数据处理常用库',
        course: 'Python数据分析与机器学习',
        date: '2024-01-12',
        preview: 'Pandas、NumPy、Matplotlib是Python数据分析的三大核心库...',
        content: `# Python数据处理常用库

## Pandas
数据处理和分析库，提供DataFrame数据结构

## NumPy  
科学计算库，提供多维数组对象

## Matplotlib
数据可视化库，用于创建图表

## 示例代码
\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建DataFrame
df = pd.DataFrame({
    'A': [1, 2, 3, 4],
    'B': [10, 20, 30, 40]
})

# 数据可视化
plt.plot(df['A'], df['B'])
plt.show()
\`\`\``,
        tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
        wordCount: 180,
        readTime: 2
      },
      {
        id: 3,
        title: '设计原则与用户体验',
        course: 'UI/UX设计基础',
        date: '2024-01-10',
        preview: '好的设计需要遵循一些基本原则：对比、重复、对齐、亲密性...',
        content: `# 设计原则与用户体验

## 四大设计原则

### 1. 对比 (Contrast)
- 突出重要信息
- 创建视觉层次
- 提高可读性

### 2. 重复 (Repetition)  
- 保持一致性
- 增强统一感
- 强化品牌识别

### 3. 对齐 (Alignment)
- 创建清晰的视觉联系
- 提高专业感
- 便于信息组织

### 4. 亲密性 (Proximity)
- 相关元素靠近
- 减少视觉混乱
- 提高理解效率

## 用户体验要素

### 可用性
- 易于学习
- 高效完成任务
- 减少错误

### 可访问性
- 支持各种用户群体
- 符合无障碍标准

### 情感化设计
- 愉悦的交互体验
- 建立情感连接`,
        tags: ['设计原则', 'UX', '用户体验'],
        wordCount: 250,
        readTime: 3
      },
      {
        id: 4,
        title: 'Express.js路由详解',
        course: 'Node.js后端开发实战',
        date: '2024-01-08',
        preview: 'Express.js是Node.js最流行的Web框架，路由是其核心功能...',
        content: `# Express.js路由详解

## 基本路由

路由定义的基本结构：
\`\`\`javascript
app.METHOD(PATH, HANDLER)
\`\`\`

## 路由方法

### GET请求
\`\`\`javascript
app.get('/users', (req, res) => {
  res.json({ message: '获取用户列表' })
})
\`\`\`

### POST请求
\`\`\`javascript
app.post('/users', (req, res) => {
  res.json({ message: '创建用户' })
})
\`\`\`

## 路由参数

### 路径参数
\`\`\`javascript
app.get('/users/:id', (req, res) => {
  const userId = req.params.id
  res.json({ userId })
})
\`\`\`

### 查询参数
\`\`\`javascript
app.get('/search', (req, res) => {
  const query = req.query.q
  res.json({ query })
})
\`\`\`

## 路由中间件

\`\`\`javascript
const authenticate = (req, res, next) => {
  // 认证逻辑
  next()
}

app.get('/admin', authenticate, (req, res) => {
  res.json({ message: '管理员页面' })
})
\`\`\`

## 路由模块化

\`\`\`javascript
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('用户首页')
})

router.get('/:id', (req, res) => {
  res.send('用户详情')
})

module.exports = router
\`\`\``,
        tags: ['Node.js', 'Express', '路由', '后端开发'],
        wordCount: 420,
        readTime: 4
      },
      {
        id: 5,
        title: 'React Native组件库使用',
        course: 'React Native移动开发',
        date: '2024-01-05',
        preview: 'React Native提供了丰富的内置组件，如View、Text、ScrollView等...',
        content: `# React Native组件库使用

## 基础组件

### View
容器组件，类似于HTML的div
\`\`\`jsx
<View style={styles.container}>
  <Text>Hello World</Text>
</View>
\`\`\`

### Text
文本组件
\`\`\`jsx
<Text style={styles.title}>
  标题文本
</Text>
\`\`\`

### Image
图片组件
\`\`\`jsx
<Image 
  source={{uri: 'https://example.com/image.jpg'}}
  style={styles.image}
/>
\`\`\`

## 列表组件

### FlatList
高性能列表组件
\`\`\`jsx
<FlatList
  data={data}
  renderItem={({item}) => <Text>{item.name}</Text>}
  keyExtractor={item => item.id}
/>
\`\`\`

### SectionList
分组列表组件
\`\`\`jsx
<SectionList
  sections={sections}
  renderItem={({item}) => <Text>{item}</Text>}
  renderSectionHeader={({section}) => (
    <Text style={styles.header}>{section.title}</Text>
  )}
/>
\`\`\`

## 交互组件

### TouchableOpacity
可点击的透明度组件
\`\`\`jsx
<TouchableOpacity onPress={handlePress}>
  <Text>点击我</Text>
</TouchableOpacity>
\`\`\`

### TextInput
文本输入组件
\`\`\`jsx
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="请输入文本"
/>
\`\`\``,
        tags: ['React Native', '移动开发', '组件'],
        wordCount: 380,
        readTime: 4
      }
    ])

    const filteredNotes = computed(() => {
      let filtered = notes.value

      if (searchQuery.value) {
        filtered = filtered.filter(note => 
          note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
      }

      if (selectedCourse.value) {
        filtered = filtered.filter(note => note.course === selectedCourse.value)
      }

      // 排序
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy.value) {
          case 'date':
            return new Date(b.date) - new Date(a.date)
          case 'course':
            return a.course.localeCompare(b.course)
          case 'title':
            return a.title.localeCompare(b.title)
          default:
            return 0
        }
      })

      return filtered
    })

    const createNote = () => {
      alert('创建新笔记功能开发中...')
    }

    const openNote = (note) => {
      selectedNote.value = note
    }

    const closeNote = () => {
      selectedNote.value = null
    }

    const editNote = (noteId) => {
      alert(`编辑笔记 ${noteId}`)
    }

    const deleteNote = (noteId) => {
      if (confirm('确定要删除这条笔记吗？')) {
        const index = notes.value.findIndex(note => note.id === noteId)
        if (index > -1) {
          notes.value.splice(index, 1)
        }
      }
    }

    const shareNote = (noteId) => {
      alert(`分享笔记 ${noteId}`)
    }

    return {
      searchQuery,
      selectedCourse,
      sortBy,
      selectedNote,
      courses,
      notes,
      filteredNotes,
      createNote,
      openNote,
      closeNote,
      editNote,
      deleteNote,
      shareNote
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
  text-align: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  margin: -24px -24px 24px -24px;
}

.title-section {
  max-width: 500px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.decoration-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
}

.decoration-icon {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  padding: 6px;
  backdrop-filter: blur(10px);
}

.page-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 300;
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

.controls-bar {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 36px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: #43e97b;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.course-filter,
.sort-filter {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.course-filter:focus,
.sort-filter:focus {
  outline: none;
  border-color: #43e97b;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #43e97b;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #3ad66f;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.note-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 250px;
}

.note-card:hover {
  border-color: #43e97b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.1);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.note-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.note-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.note-card:hover .note-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e9ecef;
  color: #2c3e50;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 12px;
}

.note-course {
  color: #43e97b;
  font-weight: 500;
  background: #f0fff4;
  padding: 4px 8px;
  border-radius: 12px;
}

.note-date {
  color: #6c757d;
}

.note-content {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tag {
  background: #f8f9ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.note-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 12px;
}

.note-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6c757d;
  font-size: 12px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.close-btn:hover {
  background: #e9ecef;
}

.modal-meta {
  padding: 0 24px 16px;
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.modal-meta .course {
  color: #43e97b;
  font-weight: 500;
}

.modal-meta .date {
  color: #6c757d;
}

.modal-body {
  flex: 1;
  padding: 0 24px;
  overflow-y: auto;
}

.note-full-content {
  white-space: pre-line;
  line-height: 1.6;
  color: #2c3e50;
}

.note-images {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.note-images img {
  width: 100%;
  border-radius: 8px;
}

.modal-footer {
  padding: 24px;
  border-top: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer .tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.modal-footer .actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn.primary {
  background: #43e97b;
  border-color: #43e97b;
  color: white;
}

.btn:hover {
  border-color: #43e97b;
  color: #43e97b;
}

.btn.primary:hover {
  background: #3ad66f;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .header {
    margin: -16px -16px 16px -16px;
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .decoration-line {
    width: 40px;
  }

  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-controls {
    flex-direction: column;
    gap: 8px;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>
