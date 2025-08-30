<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ editing ? '编辑课程' : '创建课程' }}</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="course-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="title">课程标题 *</label>
            <input 
              id="title"
              v-model="form.title" 
              type="text" 
              class="form-input"
              required
              placeholder="请输入课程标题"
            >
          </div>

          <div class="form-group">
            <label for="instructor">讲师姓名 *</label>
            <input 
              id="instructor"
              v-model="form.instructor" 
              type="text" 
              class="form-input"
              required
              placeholder="请输入讲师姓名"
            >
          </div>

          <div class="form-group">
            <label for="category">课程分类 *</label>
            <select 
              id="category"
              v-model="form.category" 
              class="form-select"
              required
            >
              <option value="">请选择分类</option>
              <option value="编程开发">编程开发</option>
              <option value="产品设计">产品设计</option>
              <option value="数据科学">数据科学</option>
              <option value="人工智能">人工智能</option>
              <option value="运营营销">运营营销</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div class="form-group">
            <label for="total_lessons">课程数量</label>
            <input 
              id="total_lessons"
              v-model.number="form.total_lessons" 
              type="number" 
              class="form-input"
              min="1"
              placeholder="课程总数"
            >
          </div>

          <div class="form-group full-width">
            <label for="cover_image_url">封面图片URL</label>
            <input 
              id="cover_image_url"
              v-model="form.cover_image_url" 
              type="url" 
              class="form-input"
              placeholder="请输入图片URL"
            >
          </div>

          <div class="form-group full-width">
            <label for="description">课程描述</label>
            <textarea 
              id="description"
              v-model="form.description" 
              class="form-textarea"
              rows="4"
              placeholder="请输入课程描述"
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label>所需技能</label>
            <div class="skills-input">
              <div 
                v-for="(skill, index) in form.required_skills" 
                :key="index"
                class="skill-input-row"
              >
                <input 
                  v-model="skill.name"
                  type="text"
                  class="form-input skill-name-input"
                  placeholder="技能名称"
                >
                <select 
                  v-model="skill.level"
                  class="form-select skill-level-select"
                >
                  <option value="初窥门径">初窥门径</option>
                  <option value="登堂入室">登堂入室</option>
                  <option value="炉火纯青">炉火纯青</option>
                  <option value="返璞归真">返璞归真</option>
                </select>
                <button 
                  type="button" 
                  class="remove-skill-btn"
                  @click="removeSkill(index)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
                </button>
              </div>
              <button 
                type="button" 
                class="add-skill-btn"
                @click="addSkill"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
                添加技能
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            取消
          </button>
          <button type="submit" class="btn-primary" :disabled="submitting">
            {{ submitting ? '提交中...' : (editing ? '更新课程' : '创建课程') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'CourseFormModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    courseData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const submitting = ref(false)
    
    const form = reactive({
      title: '',
      instructor: '',
      category: '',
      description: '',
      total_lessons: null,
      cover_image_url: '',
      required_skills: []
    })

    // 初始化表单数据
    const initForm = () => {
      if (props.editing && props.courseData) {
        Object.keys(form).forEach(key => {
          if (key === 'required_skills') {
            form[key] = props.courseData[key] ? [...props.courseData[key]] : []
          } else {
            form[key] = props.courseData[key] || ''
          }
        })
      } else {
        // 重置表单
        Object.keys(form).forEach(key => {
          form[key] = key === 'required_skills' ? [] : ''
        })
      }
    }

    // 监听 courseData 变化
    watch(() => props.courseData, initForm, { immediate: true })

    const addSkill = () => {
      form.required_skills.push({ name: '', level: '初窥门径' })
    }

    const removeSkill = (index) => {
      form.required_skills.splice(index, 1)
    }

    const handleSubmit = async () => {
      submitting.value = true
      
      try {
        const formData = {
          ...form,
          required_skills: form.required_skills.filter(skill => skill.name.trim())
        }
        
        emit('submit', formData)
      } catch (error) {
        console.error('表单提交错误:', error)
      } finally {
        submitting.value = false
      }
    }

    return {
      form,
      submitting,
      addSkill,
      removeSkill,
      handleSubmit
    }
  }
}
</script>

<style scoped>
@import '@/styles/components/forms.css';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.course-form {
  padding: 24px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
