<template>
  <div class="page">
    <div class="card profile-card" :class="{ editing: isEditing }">
      <div class="profile-header">
        <div class="profile-section">
          <div class="avatar">{{ userInitial }}</div>
          <div class="profile-info">
            <div v-if="!isEditing">
              <div class="name-with-badges">
                <h2>{{ userProfile.name }}</h2>
                <div class="achievement-badges">
                  <div
                    v-for="achievement in sortedAchievements.slice(0, 3)"
                    :key="achievement.id"
                    class="mini-badge"
                    :style="{ background: achievement.color }"
                    :title="`${achievement.name}${achievement.statKey ? ' - ' + statistics[achievement.statKey] : ''}`"
                  >
                    {{ achievement.icon }}
                  </div>
                  <div v-if="sortedAchievements.length > 3" class="more-badges" :title="`还有${sortedAchievements.length - 3}个徽章`">
                    +{{ sortedAchievements.length - 3 }}
                  </div>
                </div>
              </div>
              <p>📧 {{ userProfile.email }}</p>
              <p>🎓 {{ userProfile.major }}</p>
              <p>🏫 {{ userProfile.school }}</p>
              <div class="tags">
                <span class="tag" v-for="skill in userProfile.skills" :key="skill">{{ skill }}</span>
              </div>
              <p class="interests" v-if="userProfile.interests">
                <span class="interests-label">💭 兴趣方向：</span>{{ userProfile.interests }}
              </p>
            </div>
            <div v-else class="edit-form">
              <div class="input-group">
                <label class="input-label">姓名</label>
                <input type="text" class="form-input" v-model="editProfile.name">
              </div>
              <div class="input-group">
                <label class="input-label">专业</label>
                <input type="text" class="form-input" v-model="editProfile.major">
              </div>
              <div class="input-group">
                <label class="input-label">学校</label>
                <input type="text" class="form-input" v-model="editProfile.school">
              </div>
              <div class="input-group">
                <label class="input-label">技能标签</label>
                <input type="text" class="form-input" v-model="editProfile.skillsString" placeholder="用逗号分隔多个技能">
              </div>
              <div class="input-group">
                <label class="input-label">兴趣方向</label>
                <textarea class="form-input" rows="2" v-model="editProfile.interests" placeholder="描述您的兴趣方向"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-actions" :class="{ 'editing-mode': isEditing }">
          <div v-if="!isEditing" class="edit-icon-container">
            <button class="btn-icon-edit" @click="startEdit" title="编辑资料">
              <span>✏️</span>
            </button>
          </div>
          <div v-else class="edit-actions">
            <button class="btn btn-save" @click="saveProfile">
              <span class="btn-icon">💾</span>
              保存
            </button>
            <button class="btn btn-cancel" @click="cancelEdit">
              <span class="btn-icon">❌</span>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="feature-card" :class="{ expanded: expandedCard === 'settings' }" @click="toggleFeature('settings')">
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">⚙️</div>
          系统设置
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">配置平台的各项功能和服务</div>
      <span class="feature-status-badge status-available">全功能</span>

      <div class="feature-content" @click.stop>
        <div class="settings-section">
          <h4 style="margin-bottom: 16px; color: #495057; font-size: 16px;">🎨 主题设置</h4>
          <div class="input-group">
            <label class="input-label">主题模式</label>
            <select class="form-input" v-model="settings.theme">
              <option value="light">浅色模式</option>
              <option value="dark">深色模式</option>
              <option value="auto">自动切换</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">主题色彩</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <div
                v-for="color in themeColors"
                :key="color.name"
                class="color-option"
                :class="{ active: settings.themeColor === color.value }"
                :style="{ background: color.value }"
                @click="selectColor(color.value)"
              ></div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h4 style="margin-bottom: 16px; color: #495057; font-size: 16px;">🤖 模型配置</h4>
          <div class="input-group">
            <label class="input-label">默认AI模型</label>
            <select class="form-input" v-model="settings.defaultModel">
              <option value="gpt-4">GPT-4</option>
              <option value="claude">Claude-3</option>
              <option value="gemini">Gemini Pro</option>
              <option value="local">本地模型</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">API密钥</label>
            <input type="password" class="form-input" placeholder="输入您的API密钥" v-model="settings.apiKey">
          </div>
          <div class="input-group">
            <label class="input-label">温度参数: {{ settings.temperature }}</label>
            <input type="range" min="0" max="1" step="0.1" v-model="settings.temperature" class="form-input">
          </div>
        </div>

        <div class="settings-section">
          <h4 style="margin-bottom: 16px; color: #495057; font-size: 16px;">🔍 搜索服务</h4>
          <div class="input-group">
            <label class="input-label">搜索引擎</label>
            <select class="form-input" v-model="settings.searchEngine">
              <option value="google">Google</option>
              <option value="bing">Bing</option>
              <option value="baidu">百度</option>
              <option value="duckduckgo">DuckDuckGo</option>
            </select>
          </div>
          <div class="input-group">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" v-model="settings.realtimeSearch">
              <span>启用实时搜索</span>
            </label>
          </div>
        </div>

        <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 20px;">
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn" @click="saveSettings">保存设置</button>
            <button class="btn btn-secondary" @click="resetSettings">重置为默认</button>
            <button class="btn btn-secondary">导出配置</button>
            <button class="btn btn-secondary">导入配置</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Profile',
  setup() {
    const expandedCard = ref(null)
    const isEditing = ref(false)

    const userProfile = ref({
      name: '张小明',
      email: 'zhang.xiaoming@example.com',
      major: '计算机科学与技术专业',
      school: '清华大学',
      skills: ['Python', '机器学习', '数据分析', '深度学习'],
      interests: '人工智能、大数据分析、区块链技术、创新创业'
    })

    const editProfile = ref({
      name: userProfile.value.name,
      major: userProfile.value.major,
      school: userProfile.value.school,
      skillsString: userProfile.value.skills.join(', '),
      interests: userProfile.value.interests
    })

    // 保存原始数据用于取消编辑时恢复
    const originalProfile = ref(null)

    const statistics = ref({
      projects: 3,
      courses: 5,
      recommendations: 12,
      points: '2,580'
    })

    const achievements = ref([
      { 
        id: 1, 
        name: '项目达人', 
        icon: '🏆', 
        color: '#ffd700',
        statKey: 'projects',
        description: '参与多个项目并取得优异成果'
      },
      { 
        id: 2, 
        name: '学习之星', 
        icon: '⭐', 
        color: '#ff6b6b',
        statKey: 'courses',
        description: '积极学习，完成多门课程'
      },
      { 
        id: 3, 
        name: '协作专家', 
        icon: '🤝', 
        color: '#4ecdc4',
        statKey: 'recommendations',
        description: '团队协作能力强，获得众多推荐'
      },
      { 
        id: 4, 
        name: '创新先锋', 
        icon: '💡', 
        color: '#45b7d1',
        statKey: 'points',
        description: '在平台上表现活跃，积分丰厚'
      },
      { 
        id: 5, 
        name: '代码大师', 
        icon: '💻', 
        color: '#96ceb4',
        statKey: null,
        description: '编程技能精湛，代码质量优秀'
      },
      { 
        id: 6, 
        name: '分享达人', 
        icon: '📢', 
        color: '#feca57',
        statKey: null,
        description: '乐于分享知识，帮助他人成长'
      }
    ])

    const settings = ref({
      theme: 'light',
      themeColor: '#667eea',
      defaultModel: 'gpt-4',
      apiKey: 'sk-****',
      temperature: 0.7,
      searchEngine: 'google',
      realtimeSearch: true
    })

    const themeColors = ref([
      { name: 'blue', value: '#667eea' },
      { name: 'purple', value: '#764ba2' },
      { name: 'pink', value: '#f093fb' },
      { name: 'cyan', value: '#4facfe' },
      { name: 'green', value: '#43e97b' }
    ])

    const userInitial = computed(() => {
      return userProfile.value.name ? userProfile.value.name.charAt(0) : 'U'
    })

    // 排序成就，将有统计数据的成就放在前面
    const sortedAchievements = computed(() => {
      return [...achievements.value].sort((a, b) => {
        if (a.statKey && !b.statKey) return -1
        if (!a.statKey && b.statKey) return 1
        return 0
      })
    })

    const toggleFeature = (cardId) => {
      if (expandedCard.value === cardId) {
        expandedCard.value = null
      } else {
        expandedCard.value = cardId
      }
    }

    const selectColor = (color) => {
      settings.value.themeColor = color
    }

    const startEdit = () => {
      // 保存原始数据
      originalProfile.value = {
        name: userProfile.value.name,
        major: userProfile.value.major,
        school: userProfile.value.school,
        skills: [...userProfile.value.skills],
        interests: userProfile.value.interests
      }
      
      // 同步编辑表单数据
      editProfile.value = {
        name: userProfile.value.name,
        major: userProfile.value.major,
        school: userProfile.value.school,
        skillsString: userProfile.value.skills.join(', '),
        interests: userProfile.value.interests
      }
      
      isEditing.value = true
    }

    const cancelEdit = () => {
      // 恢复原始数据
      if (originalProfile.value) {
        userProfile.value = { ...originalProfile.value }
        editProfile.value = {
          name: originalProfile.value.name,
          major: originalProfile.value.major,
          school: originalProfile.value.school,
          skillsString: originalProfile.value.skills.join(', '),
          interests: originalProfile.value.interests
        }
      }
      isEditing.value = false
    }

    const saveProfile = () => {
      userProfile.value.name = editProfile.value.name
      userProfile.value.major = editProfile.value.major
      userProfile.value.school = editProfile.value.school
      userProfile.value.skills = editProfile.value.skillsString.split(',').map(s => s.trim()).filter(s => s)
      userProfile.value.interests = editProfile.value.interests
      isEditing.value = false
      ElMessage.success('个人信息保存成功！')
    }

    const saveSettings = () => {
      ElMessage.success('设置保存成功！')
    }

    const resetSettings = () => {
      settings.value = {
        theme: 'light',
        themeColor: '#667eea',
        defaultModel: 'gpt-4',
        apiKey: '',
        temperature: 0.7,
        searchEngine: 'google',
        realtimeSearch: true
      }
      ElMessage.success('已重置为默认设置！')
    }

    return {
      expandedCard,
      isEditing,
      userProfile,
      editProfile,
      originalProfile,
      statistics,
      sortedAchievements,
      settings,
      themeColors,
      userInitial,
      toggleFeature,
      selectColor,
      startEdit,
      cancelEdit,
      saveProfile,
      saveSettings,
      resetSettings
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

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-section {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

@media (max-width: 768px) {
  .profile-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
}

.profile-card {
  transition: all 0.3s ease;
  position: relative;
}

.profile-card.editing {
  background: #f8f9ff;
  border: 1px solid #667eea;
}

@media (max-width: 768px) {
  .profile-card {
    margin: 0;
    padding: 24px;
  }
  
  .profile-card.editing {
    padding: 24px;
  }
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .profile-section {
    width: 100%;
  }
}

.profile-actions {
  flex-shrink: 0;
  margin-top: 8px;
  position: absolute;
  top: 16px;
  right: 16px;
}

.edit-icon-container {
  display: flex;
  justify-content: flex-end;
}

.btn-icon-edit {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
  font-size: 14px;
}

.btn-icon-edit:hover {
  background: #e9ecef;
  color: #495057;
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .btn-icon-edit {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    color: #6c757d;
  }
  
  .btn-icon-edit:hover {
    background: #e9ecef;
    color: #495057;
  }
}

@media (max-width: 768px) {
  .profile-actions {
    position: absolute;
    top: 16px;
    right: 16px;
    width: auto;
    margin: 0;
  }
  
  .profile-actions.editing-mode {
    position: static;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
  
  .edit-icon-container {
    justify-content: flex-end;
  }
}

.edit-form {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 768px) {
  .edit-form {
    max-width: 100%;
  }
}

.edit-form .input-group {
  margin-bottom: 12px;
}

.edit-form .input-label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.edit-form .form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.edit-form .form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.edit-actions {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

@media (max-width: 768px) {
  .edit-actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    position: static;
    width: 100%;
    margin-top: 16px;
  }
}

.btn-edit {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.btn-save {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background: #218838;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-icon {
  font-size: 12px;
}

.interests {
  margin-top: 12px;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

.interests-label {
  font-weight: 500;
  margin-right: 8px;
}

.name-with-badges {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .name-with-badges {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .name-with-badges h2 {
    margin-bottom: 4px;
  }
}

.name-with-badges h2 {
  margin: 0;
  color: #495057;
}

.achievement-badges {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mini-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.mini-badge:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.more-badges {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #6c757d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.more-badges:hover {
  transform: scale(1.2);
  background: #5a6268;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}

.profile-info h2 {
  margin-bottom: 8px;
  color: #495057;
}

.profile-info p {
  color: #6c757d;
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .profile-info p {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .profile-info h2 {
    font-size: 1.5rem;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .tags {
    justify-content: center;
    gap: 6px;
    margin-top: 8px;
  }
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.settings-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #333;
  transform: scale(1.15);
}

input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}
</style>
