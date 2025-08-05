<template>
  <div class="profile-page">
    <!-- 顶部个人信息区域 -->
    <div class="profile-hero" :class="{ editing: isEditing }">
      <div class="profile-container">
        <div class="profile-main">
          <div class="avatar-section">
            <div class="avatar">{{ userInitial }}</div>
            <div class="achievement-badges">
              <div
                v-for="achievement in sortedAchievements.slice(0, 4)"
                :key="achievement.id"
                class="mini-badge"
                :style="{ background: achievement.color }"
                :title="`${achievement.name}${achievement.statKey ? ' - ' + statistics[achievement.statKey] : ''}`"
              >
                {{ achievement.icon }}
              </div>
              <div v-if="sortedAchievements.length > 4" class="more-badges" :title="`还有${sortedAchievements.length - 4}个徽章`">
                +{{ sortedAchievements.length - 4 }}
              </div>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="view-mode">
              <h1 class="profile-name">{{ userProfile.name }}</h1>
              <div class="profile-meta">
                <div class="meta-item">
                  <span class="meta-icon">📧</span>
                  <span>{{ userProfile.email }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">🎓</span>
                  <span>{{ userProfile.major }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">🏫</span>
                  <span>{{ userProfile.school }}</span>
                </div>
              </div>
              <div class="skills-section">
                <span class="tag" v-for="skill in userProfile.skills" :key="skill">{{ skill }}</span>
              </div>
              <p class="interests-text" v-if="userProfile.interests">
                <span class="interests-label">💭 兴趣方向：</span>{{ userProfile.interests }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="edit-btn" @click="startEdit">
            <span class="btn-icon">✏️</span>
            编辑资料
          </button>
        </div>
      </div>
    </div>

    <!-- 统计数据区域 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ statistics.projects }}</div>
          <div class="stat-label">参与项目</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistics.courses }}</div>
          <div class="stat-label">完成课程</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistics.recommendations }}</div>
          <div class="stat-label">获得推荐</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistics.points }}</div>
          <div class="stat-label">积分</div>
        </div>
      </div>
    </div>

    <!-- 设置区域 -->
    <div class="settings-wrapper">
      <div class="settings-header" @click="toggleFeature('settings')">
        <div class="settings-title">
          <span class="settings-icon">⚙️</span>
          <span>系统设置</span>
          <span class="status-badge">全功能</span>
        </div>
        <div class="toggle-arrow" :class="{ expanded: expandedCard === 'settings' }">
          <span>▼</span>
        </div>
      </div>
      
      <div class="settings-content" :class="{ expanded: expandedCard === 'settings' }" @click.stop>
        <div class="settings-grid">
          <div class="settings-panel">
            <h4 class="panel-title">🎨 主题设置</h4>
            <div class="settings-items">
              <div class="setting-item">
                <label class="setting-label">主题模式</label>
                <select class="setting-input" v-model="settings.theme">
                  <option value="light">浅色模式</option>
                  <option value="dark">深色模式</option>
                  <option value="auto">自动切换</option>
                </select>
              </div>
              <div class="setting-item">
                <label class="setting-label">主题色彩</label>
                <div class="color-palette">
                  <div
                    v-for="color in themeColors"
                    :key="color.name"
                    class="color-swatch"
                    :class="{ active: settings.themeColor === color.value }"
                    :style="{ background: color.value }"
                    @click="selectColor(color.value)"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="settings-panel">
            <h4 class="panel-title">🤖 模型配置</h4>
            <div class="settings-items">
              <div class="setting-item">
                <label class="setting-label">默认AI模型</label>
                <select class="setting-input" v-model="settings.defaultModel">
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude">Claude-3</option>
                  <option value="gemini">Gemini Pro</option>
                  <option value="local">本地模型</option>
                </select>
              </div>
              <div class="setting-item">
                <label class="setting-label">API密钥</label>
                <input type="password" class="setting-input" placeholder="输入您的API密钥" v-model="settings.apiKey">
              </div>
              <div class="setting-item">
                <label class="setting-label">温度参数: {{ settings.temperature }}</label>
                <input type="range" min="0" max="1" step="0.1" v-model="settings.temperature" class="range-input">
              </div>
            </div>
          </div>

          <div class="settings-panel">
            <h4 class="panel-title">🔍 搜索服务</h4>
            <div class="settings-items">
              <div class="setting-item">
                <label class="setting-label">搜索引擎</label>
                <select class="setting-input" v-model="settings.searchEngine">
                  <option value="google">Google</option>
                  <option value="bing">Bing</option>
                  <option value="baidu">百度</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                </select>
              </div>
              <div class="setting-item checkbox-item">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="settings.realtimeSearch">
                  <span class="checkmark"></span>
                  <span>启用实时搜索</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-actions">
          <button class="action-btn primary" @click="saveSettings">
            <span class="btn-icon">💾</span>
            保存设置
          </button>
          <button class="action-btn secondary" @click="resetSettings">
            <span class="btn-icon">🔄</span>
            重置默认
          </button>
          <button class="action-btn secondary">
            <span class="btn-icon">📤</span>
            导出配置
          </button>
          <button class="action-btn secondary">
            <span class="btn-icon">📥</span>
            导入配置
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 编辑资料弹窗 -->
  <div v-if="isEditing" class="edit-modal" @click.self="cancelEdit">
    <div class="edit-modal-content">
      <div class="edit-modal-header">
        <h3 class="edit-modal-title">
          <span class="edit-icon">✏️</span>
          编辑个人资料
        </h3>
        <button class="close-btn" @click="cancelEdit">
          <span>✕</span>
        </button>
      </div>
      
      <div class="edit-modal-body">
        <div class="edit-form">
          <div class="form-row">
            <div class="input-group">
              <label class="input-label">姓名</label>
              <input type="text" class="form-input" v-model="editProfile.name" placeholder="请输入姓名">
            </div>
            <div class="input-group">
              <label class="input-label">专业</label>
              <input type="text" class="form-input" v-model="editProfile.major" placeholder="请输入专业">
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label class="input-label">学校</label>
              <input type="text" class="form-input" v-model="editProfile.school" placeholder="请输入学校名称">
            </div>
            <div class="input-group">
              <label class="input-label">技能标签</label>
              <input type="text" class="form-input" v-model="editProfile.skillsString" placeholder="用逗号分隔多个技能">
            </div>
          </div>
          <div class="input-group full-width">
            <label class="input-label">兴趣方向</label>
            <textarea class="form-input" rows="4" v-model="editProfile.interests" placeholder="描述您的兴趣方向和特长"></textarea>
          </div>
        </div>
      </div>
      
      <div class="edit-modal-footer">
        <button class="modal-btn cancel-btn" @click="cancelEdit">
          <span class="btn-icon">❌</span>
          取消
        </button>
        <button class="modal-btn save-btn" @click="saveProfile">
          <span class="btn-icon">💾</span>
          保存修改
        </button>
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
/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 - 使用柔和过渡的统一背景 */
.profile-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, 
    #667eea 0%, 
    #6b7fd6 25%,
    #8a93e0 50%,
    #b8bfe8 75%,
    #f5f7fa 100%
  );
  padding: 0;
  margin: 0;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  /* 确保完全覆盖屏幕 */
  left: 0;
  top: 0;
}

/* 微妙的背景装饰图案 */
.profile-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    /* 非常微妙的几何线条 */
    linear-gradient(45deg, transparent 95%, rgba(255, 255, 255, 0.02) 95.5%, rgba(255, 255, 255, 0.02) 96%, transparent 96.5%),
    linear-gradient(-45deg, transparent 95%, rgba(255, 255, 255, 0.02) 95.5%, rgba(255, 255, 255, 0.02) 96%, transparent 96.5%),
    /* 微妙的圆点装饰 */
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 
    300px 300px,
    300px 300px,
    100px 100px,
    120px 120px;
  background-position:
    0 0,
    0 0,
    0 0,
    50px 50px;
  z-index: 0;
  pointer-events: none;
}

/* 添加动态效果 */
.profile-page::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  animation: backgroundFloat 20s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes backgroundFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-20px, -10px) rotate(1deg);
  }
  66% {
    transform: translate(20px, 10px) rotate(-1deg);
  }
}

/* 个人信息英雄区域 - 卡片化设计 */
.profile-hero {
  position: relative;
  padding: 40px 20px 60px;
  color: white;
  transition: all 0.3s ease;
  z-index: 1;
}

.profile-hero.editing {
  background: rgba(0, 0, 0, 0.1);
}

.profile-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.profile-main {
  flex: 1;
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 4px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.achievement-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.mini-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.mini-badge:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.more-badges {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.more-badges:hover {
  transform: scale(1.1) translateY(-2px);
  background: rgba(255, 255, 255, 0.3);
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
}

.meta-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.skills-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.tag {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  color: white;
  padding: 10px 18px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.interests-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.interests-label {
  font-weight: 600;
  margin-right: 8px;
}

/* 编辑模式 */
.edit-form {
  width: 100%;
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-input {
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
}

/* 操作按钮 */
.profile-actions {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 10;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.edit-actions {
  display: flex;
  gap: 12px;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.save-btn:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 统计数据区域 - 卡片化设计 */
.stats-section {
  background: transparent;
  padding: 0 20px 40px;
  margin: 0;
  position: relative;
  z-index: 1;
}

.stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  position: relative;
  z-index: 1;
  margin-top: -30px; /* 向上延伸，打破硬分割线 */
}

.stat-item {
  text-align: center;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.stat-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.stat-number {
  font-size: 2.8rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1rem;
  color: #718096;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 设置区域 - 卡片化设计 */
.settings-wrapper {
  background: transparent;
  margin: 0;
  padding: 0 20px 40px;
  position: relative;
  z-index: 1;
}

.settings-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 40px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px 20px 20px 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-header:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: -0.01em;
}

.settings-icon {
  font-size: 1.8rem;
}

.status-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.toggle-arrow {
  transition: transform 0.3s ease;
  font-size: 1.2rem;
  color: #6c757d;
}

.toggle-arrow.expanded {
  transform: rotate(180deg);
}

.settings-content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 0 0 20px 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-top: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.settings-content.expanded {
  max-height: 2000px;
  padding: 40px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
}

.settings-panel {
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 28px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-panel:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.01em;
}

.settings-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item.checkbox-item {
  flex-direction: row;
  align-items: center;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  letter-spacing: 0.3px;
}

.setting-input {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.setting-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 1);
}

.range-input {
  height: 8px;
  border-radius: 4px;
  background: #e9ecef;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-palette {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: #333;
  transform: scale(1.15);
}

.color-swatch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.settings-actions {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 30px;
  border-top: 2px solid #e9ecef;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  font-weight: 600;
}

.action-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
}

.action-btn.secondary {
  background: rgba(248, 250, 252, 0.9);
  color: #4a5568;
  border: 2px solid rgba(226, 232, 240, 0.8);
  font-weight: 600;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-page::before {
    background-size: 
      200px 200px,
      200px 200px,
      80px 80px,
      90px 90px;
  }
  
  .profile-hero {
    padding: 30px 16px 50px;
  }
  
  .profile-container {
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .profile-main {
    flex-direction: column;
    gap: 24px;
    text-align: center;
    align-items: center;
  }
  
  .avatar-section {
    order: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .profile-details {
    order: 2;
    width: 100%;
    text-align: center;
  }
  
  .profile-actions {
    position: relative;
    top: auto;
    right: auto;
    order: 3;
    width: 100%;
    margin-top: 0;
    display: flex;
    justify-content: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
    margin: 0 auto;
  }
  
  .achievement-badges {
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    max-width: 280px;
    margin: 0 auto;
  }
  
  .mini-badge {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  .more-badges {
    width: 36px;
    height: 36px;
    font-size: 10px;
  }
  
  .profile-name {
    font-size: 2rem;
    margin-bottom: 16px;
    text-align: center;
  }
  
  .profile-meta {
    align-items: center;
    gap: 14px;
  }
  
  .meta-item {
    font-size: 0.95rem;
    justify-content: center;
  }
  
  .skills-section {
    justify-content: center;
    gap: 10px;
  }
  
  .stats-section {
    padding: 0 16px 32px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: -20px;
  }
  
  .stat-item {
    padding: 24px 16px;
    border-radius: 16px;
  }
  
  .stat-number {
    font-size: 2.2rem;
  }
  
  .settings-wrapper {
    padding: 0 16px 32px;
  }
  
  .settings-header {
    padding: 24px 24px;
    border-radius: 16px;
  }
  
  .settings-title {
    font-size: 1.3rem;
  }
  
  .settings-content.expanded {
    padding: 32px 24px;
    border-radius: 0 0 16px 16px;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .settings-actions {
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .profile-page::before {
    background-size: 
      150px 150px,
      150px 150px,
      60px 60px,
      70px 70px;
  }
  
  .profile-hero {
    padding: 24px 12px 40px;
  }
  
  .profile-container {
    padding: 24px 16px;
    border-radius: 16px;
    gap: 20px;
  }
  
  .profile-main {
    gap: 20px;
  }
  
  .avatar-section {
    gap: 16px;
  }
  
  .avatar {
    width: 90px;
    height: 90px;
    font-size: 2.2rem;
  }
  
  .achievement-badges {
    gap: 8px;
    max-width: 240px;
  }
  
  .mini-badge {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .more-badges {
    width: 32px;
    height: 32px;
    font-size: 9px;
  }
  
  .profile-name {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
  
  .profile-meta {
    gap: 12px;
  }
  
  .meta-item {
    font-size: 0.9rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: -15px;
  }
  
  .stat-item {
    padding: 20px 16px;
    border-radius: 14px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .settings-header {
    padding: 20px 16px;
    border-radius: 14px;
  }
  
  .settings-content.expanded {
    padding: 24px 16px;
    border-radius: 0 0 14px 14px;
  }
  
  .settings-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-btn {
    width: 100%;
    min-width: auto;
  }
  
  .tag {
    font-size: 12px;
    padding: 8px 14px;
  }
  
  .settings-title {
    font-size: 1.2rem;
    gap: 12px;
  }
  
  .settings-icon {
    font-size: 1.5rem;
  }
  
  .edit-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
}

/* 编辑弹窗样式 */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.edit-modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.edit-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.edit-modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;
}

.edit-icon {
  font-size: 1.3rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #2d3748;
  transform: scale(1.1);
}

.edit-modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group.full-width {
  width: 100%;
}

.input-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.form-input {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #2d3748;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
  background: rgba(255, 255, 255, 1);
}

.form-input::placeholder {
  color: #a0aec0;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.edit-modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
  letter-spacing: 0.3px;
}

.btn-icon {
  font-size: 16px;
}

.cancel-btn {
  background: rgba(248, 250, 252, 0.9);
  color: #718096;
  border: 2px solid rgba(226, 232, 240, 0.8);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #4a5568;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.save-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
}

/* 移动端弹窗适配 */
@media (max-width: 768px) {
  .edit-modal {
    padding: 1rem;
  }
  
  .edit-modal-content {
    max-width: 100%;
    border-radius: 20px;
  }
  
  .edit-modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .edit-modal-title {
    font-size: 1.3rem;
  }
  
  .edit-modal-body {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .edit-modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .edit-modal {
    padding: 0.5rem;
  }
  
  .edit-modal-content {
    border-radius: 16px;
  }
  
  .edit-modal-header {
    padding: 1rem 1rem 0.5rem;
  }
  
  .edit-modal-body {
    padding: 1rem;
  }
  
  .edit-modal-footer {
    padding: 0.5rem 1rem 1rem;
  }
  
  .form-input {
    font-size: 16px; /* 防止iOS缩放 */
  }
}
</style>
