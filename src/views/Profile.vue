<template>
  <div class="profile-page">
    <!-- 顶部个人信息区域 -->
    <div class="profile-hero" :class="{ editing: isEditing }">
      <div class="profile-container">
        <div class="profile-main">
          <div class="user-header">
            <div class="avatar-container">
              <div class="avatar">{{ userInitial }}</div>
            </div>
            
            <div class="user-info">
              <div class="name-section">
                <div class="name-container">
                  <h1 class="profile-name">{{ userProfile.name }}</h1>
                  <button class="edit-btn-inline" @click="startEdit">
                    <span class="btn-icon">✏️</span>
                    编辑资料
                  </button>
                </div>
                <div class="username">@{{ userProfile.username }}</div>
              </div>
              
              <div class="status-section">
                <div class="status-text">{{ userProfile.status }}</div>
              </div>
            </div>
          </div>
          
          <div class="achievement-badges-section">
            <div class="achievement-badges">
              <div
                v-for="achievement in sortedAchievements.slice(0, 6)"
                :key="achievement.id"
                class="mini-badge"
                :style="{ background: achievement.color }"
                :title="`${achievement.name}${achievement.statKey ? ' - ' + statistics[achievement.statKey] : ''}`"
              >
                {{ achievement.icon }}
              </div>
              <div v-if="sortedAchievements.length > 6" class="more-badges" :title="`还有${sortedAchievements.length - 6}个徽章`">
                +{{ sortedAchievements.length - 6 }}
              </div>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="profile-meta">
              <div class="meta-item">
                <span class="meta-icon">🏫</span>
                <span>{{ userProfile.school }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🎓</span>
                <span>{{ userProfile.major }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📧</span>
                <span>{{ userProfile.email }}</span>
              </div>
            </div>
            <div class="skills-section">
              <span class="tag" v-for="skill in userProfile.skills" :key="skill">{{ skill }}</span>
            </div>
          </div>
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
      <div class="settings-header" @click="openSettingsModal">
        <div class="settings-title">
          <span class="settings-icon">⚙️</span>
          <span>系统设置</span>
          <span class="status-badge">全功能</span>
        </div>
        <div class="settings-action-hint">
          <span>点击打开</span>
          <span class="arrow-icon">→</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 系统设置弹窗 -->
  <div v-if="isSettingsOpen" class="settings-modal" @click.self="closeSettingsModal">
    <div class="settings-modal-content">
      <div class="settings-modal-header">
        <h3 class="settings-modal-title">
          <span class="settings-icon">⚙️</span>
          系统设置
        </h3>
        <button class="close-btn" @click="closeSettingsModal">
          <span>✕</span>
        </button>
      </div>
      
      <div class="settings-modal-body">
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
      </div>
      
      <div class="settings-modal-footer">
        <button class="modal-btn cancel-btn" @click="closeSettingsModal">
          <span class="btn-icon">❌</span>
          取消
        </button>
        <button class="modal-btn secondary-btn" @click="resetSettings">
          <span class="btn-icon">🔄</span>
          重置默认
        </button>
        <button class="modal-btn save-btn" @click="saveSettings">
          <span class="btn-icon">💾</span>
          保存设置
        </button>
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
              <label class="input-label">用户名</label>
              <input type="text" class="form-input" v-model="editProfile.username" placeholder="请输入用户名">
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label class="input-label">专业</label>
              <input type="text" class="form-input" v-model="editProfile.major" placeholder="请输入专业">
            </div>
            <div class="input-group">
              <label class="input-label">学校</label>
              <input type="text" class="form-input" v-model="editProfile.school" placeholder="请输入学校名称">
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label class="input-label">技能标签</label>
              <input type="text" class="form-input" v-model="editProfile.skillsString" placeholder="用逗号分隔多个技能">
            </div>
          </div>
          <div class="input-group full-width">
            <label class="input-label">个人状态</label>
            <input type="text" class="form-input" v-model="editProfile.status" placeholder="描述您的当前状态">
          </div>
          <div class="input-group full-width">
            <label class="input-label">兴趣方向</label>
            <textarea class="form-input" rows="3" v-model="editProfile.interests" placeholder="描述您的兴趣方向和特长"></textarea>
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
    const isSettingsOpen = ref(false)

    const userProfile = ref({
      name: '张小明',
      username: '1fantasy1',
      email: 'zhang.xiaoming@example.com',
      major: '计算机科学与技术专业',
      school: '清华大学',
      skills: ['Python', '机器学习', '数据分析', '深度学习'],
      interests: '人工智能、大数据分析、区块链技术、创新创业',
      status: '专注于AI技术研究，热爱开源项目 🚀'
    })

    const editProfile = ref({
      name: userProfile.value.name,
      username: userProfile.value.username,
      major: userProfile.value.major,
      school: userProfile.value.school,
      skillsString: userProfile.value.skills.join(', '),
      interests: userProfile.value.interests,
      status: userProfile.value.status
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
        username: userProfile.value.username,
        major: userProfile.value.major,
        school: userProfile.value.school,
        skills: [...userProfile.value.skills],
        interests: userProfile.value.interests,
        status: userProfile.value.status
      }
      
      // 同步编辑表单数据
      editProfile.value = {
        name: userProfile.value.name,
        username: userProfile.value.username,
        major: userProfile.value.major,
        school: userProfile.value.school,
        skillsString: userProfile.value.skills.join(', '),
        interests: userProfile.value.interests,
        status: userProfile.value.status
      }
      
      isEditing.value = true
    }

    const cancelEdit = () => {
      // 恢复原始数据
      if (originalProfile.value) {
        userProfile.value = { ...originalProfile.value }
        editProfile.value = {
          name: originalProfile.value.name,
          username: originalProfile.value.username,
          major: originalProfile.value.major,
          school: originalProfile.value.school,
          skillsString: originalProfile.value.skills.join(', '),
          interests: originalProfile.value.interests,
          status: originalProfile.value.status
        }
      }
      isEditing.value = false
    }

    const saveProfile = () => {
      userProfile.value.name = editProfile.value.name
      userProfile.value.username = editProfile.value.username
      userProfile.value.major = editProfile.value.major
      userProfile.value.school = editProfile.value.school
      userProfile.value.skills = editProfile.value.skillsString.split(',').map(s => s.trim()).filter(s => s)
      userProfile.value.interests = editProfile.value.interests
      userProfile.value.status = editProfile.value.status
      isEditing.value = false
      ElMessage.success('个人信息保存成功！')
    }

    const saveSettings = () => {
      isSettingsOpen.value = false
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

    const openSettingsModal = () => {
      isSettingsOpen.value = true
    }

    const closeSettingsModal = () => {
      isSettingsOpen.value = false
    }

    return {
      expandedCard,
      isEditing,
      isSettingsOpen,
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
      resetSettings,
      openSettingsModal,
      closeSettingsModal
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
  padding: 0 0 120px 0; /* 只在底部添加padding为底部导航栏留空间 */
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
  flex-direction: column;
  gap: 24px;
}

/* 新的用户头部布局 */
.user-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.2rem;
  font-weight: bold;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0; /* 防止flex子元素溢出 */
}

.name-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.edit-btn-inline {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  min-width: fit-content;
}

.edit-btn-inline:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.username {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
}

.status-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
}

/* 成就徽章区域 */
.achievement-badges-section {
  margin-top: -8px;
}

.achievement-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.mini-badge:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.more-badges {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.more-badges:hover {
  transform: scale(1.1) translateY(-2px);
  background: rgba(255, 255, 255, 0.3);
}

/* 详细信息区域 */
.profile-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
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
  gap: 10px;
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
  padding: 0 20px 40px; /* 恢复原来的padding，因为主容器已经有底部padding */
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
  border-radius: 20px;
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

.settings-action-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.arrow-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.settings-header:hover .arrow-icon {
  transform: translateX(4px);
}

/* 系统设置弹窗样式 */
.settings-modal {
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
  z-index: 9999;
  padding: 2rem;
}

.settings-modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
}

.settings-modal-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;
}

.settings-modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
}

.settings-modal-body::-webkit-scrollbar {
  width: 6px;
}

.settings-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.settings-modal-body::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.settings-modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.settings-panel {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.settings-panel:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  transform: translateY(-2px);
  border-color: rgba(102, 126, 234, 0.2);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.settings-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-item.checkbox-item {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.setting-input {
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.setting-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.setting-input:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.range-input {
  height: 10px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.range-input:hover {
  background: linear-gradient(90deg, #d1d5db 0%, #e5e7eb 100%);
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  border: 3px solid white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.range-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.color-palette {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
}

.color-swatch {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.color-swatch.active {
  border-color: #374151;
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.color-swatch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  background: rgba(102, 126, 234, 0.05);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.settings-modal-footer {
  padding: 1.5rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.secondary-btn {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.8));
  color: #6b7280;
  border: 2px solid rgba(209, 213, 219, 0.8);
}

.secondary-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.95));
  color: #374151;
  border-color: rgba(156, 163, 175, 0.8);
}

.cancel-btn {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.8));
  color: #6b7280;
  border: 2px solid rgba(209, 213, 219, 0.8);
}

.cancel-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.95));
  color: #374151;
  border-color: rgba(156, 163, 175, 0.8);
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
    gap: 20px;
    text-align: left;
    align-items: stretch;
  }
  
  .user-header {
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
  }
  
  .avatar {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
  
  .profile-name {
    font-size: 1.4rem;
    margin-bottom: 4px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .name-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  
  .edit-btn-inline {
    font-size: 0.75rem;
    padding: 4px 8px;
    min-width: fit-content;
    flex-shrink: 0;
  }
  
  .username {
    font-size: 0.9rem;
  }
  
  .status-text {
    font-size: 0.9rem;
  }
  
  .achievement-badges {
    gap: 6px;
    flex-wrap: wrap;
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
  
  .profile-meta {
    align-items: flex-start;
    gap: 14px;
  }
  
  .meta-item {
    font-size: 0.95rem;
    justify-content: flex-start;
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
  
  /* 移动端系统设置弹窗适配 */
  .settings-modal {
    padding: 0.5rem;
    align-items: flex-end;
  }
  
  .settings-modal-content {
    max-width: 100%;
    width: 100%;
    max-height: 85vh;
    border-radius: 24px 24px 0 0;
    animation: modalSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 0;
  }
  
  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .settings-modal-header {
    padding: 1.5rem 1.5rem 1rem;
    position: relative;
  }
  
  .settings-modal-header::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
  }
  
  .settings-modal-title {
    font-size: 1.4rem;
    margin-top: 8px;
  }
  
  .settings-modal-body {
    padding: 0 1.5rem 1.5rem;
    max-height: 50vh;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .settings-panel {
    padding: 20px;
    border-radius: 16px;
    background: rgba(248, 250, 252, 0.95);
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
  
  .panel-title {
    font-size: 1.1rem;
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  
  .setting-item {
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .setting-label {
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
  }
  
  .setting-input, .range-input {
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    font-size: 16px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .color-palette {
    gap: 10px;
    justify-content: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
  }
  
  .color-swatch {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 5px;
  }
  
  .settings-modal-footer {
    padding: 1rem 1.5rem;
    background: rgba(248, 250, 252, 0.95);
    border-top: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 0 0 24px 24px;
    flex-direction: row;
    gap: 12px;
  }
  
  .modal-btn {
    flex: 1;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  
  .user-header {
    gap: 12px;
  }
  
  .avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .profile-name {
    font-size: 1.4rem;
    margin-bottom: 2px;
  }
  
  .username {
    font-size: 0.85rem;
  }
  
  .status-text {
    font-size: 0.85rem;
  }
  
  .achievement-badges {
    gap: 4px;
  }
  
  .mini-badge {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }
  
  .more-badges {
    width: 28px;
    height: 28px;
    font-size: 8px;
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
  
  /* 小屏幕系统设置弹窗适配 */
  .settings-modal {
    padding: 0;
    align-items: flex-end;
  }
  
  .settings-modal-content {
    border-radius: 20px 20px 0 0;
    max-height: 80vh;
    width: 100%;
  }
  
  .settings-modal-header {
    padding: 1rem 1rem 0.5rem;
    text-align: center;
  }
  
  .settings-modal-header::before {
    width: 32px;
    height: 3px;
    top: 8px;
  }
  
  .settings-modal-title {
    font-size: 1.2rem;
    margin-top: 6px;
  }
  
  .settings-modal-body {
    padding: 0 1rem 1rem;
    max-height: 45vh;
  }
  
  .settings-grid {
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .settings-panel {
    padding: 16px;
    border-radius: 12px;
    background: rgba(248, 250, 252, 0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .panel-title {
    font-size: 1rem;
    margin-bottom: 12px;
    padding-bottom: 6px;
  }
  
  .setting-item {
    gap: 10px;
    margin-bottom: 12px;
  }
  
  .setting-label {
    font-size: 14px;
  }
  
  .setting-input, .range-input {
    padding: 10px 14px;
    font-size: 16px;
    border-radius: 10px;
  }
  
  .color-palette {
    gap: 8px;
    padding: 8px;
    border-radius: 10px;
  }
  
  .color-swatch {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
  
  .checkmark {
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }
  
  .settings-modal-footer {
    padding: 0.75rem 1rem;
    border-radius: 0 0 20px 20px;
    gap: 8px;
  }
  
  .modal-btn {
    padding: 14px 16px;
    font-size: 15px;
    border-radius: 10px;
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
  z-index: 9999;
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
