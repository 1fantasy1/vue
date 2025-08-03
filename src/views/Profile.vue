<template>
  <div class="page">
    <div class="card">
      <div class="profile-section">
        <div class="avatar">{{ userInitial }}</div>
        <div class="profile-info">
          <h2>{{ userProfile.name }}</h2>
          <p>📧 {{ userProfile.email }}</p>
          <p>🎓 {{ userProfile.major }}</p>
          <p>🏫 {{ userProfile.school }}</p>
          <div class="tags">
            <span class="tag" v-for="skill in userProfile.skills" :key="skill">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="feature-card" :class="{ expanded: expandedCard === 'profile-edit' }" @click="toggleFeature('profile-edit')">
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">⚙️</div>
          个人信息编辑
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">编辑和完善您的个人资料信息</div>
      <span class="feature-status-badge status-available">可编辑</span>

      <div class="feature-content" @click.stop>
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
          <input type="text" class="form-input" v-model="editProfile.skillsString">
        </div>
        <div class="input-group">
          <label class="input-label">兴趣方向</label>
          <textarea class="form-input" rows="3" v-model="editProfile.interests"></textarea>
        </div>
        <button class="btn" @click="saveProfile">保存修改</button>
      </div>
    </div>

    <div class="feature-card" :class="{ expanded: expandedCard === 'statistics' }" @click="toggleFeature('statistics')">
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">📊</div>
          个人统计
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">查看您在平台上的活动数据和成就</div>
      <span class="feature-status-badge status-available">实时更新</span>

      <div class="feature-content">
        <ul class="feature-list">
          <li class="feature-item">
            <span>参与项目数</span>
            <span class="feature-status status-active">{{ statistics.projects }}</span>
          </li>
          <li class="feature-item">
            <span>完成课程数</span>
            <span class="feature-status status-active">{{ statistics.courses }}</span>
          </li>
          <li class="feature-item">
            <span>获得推荐数</span>
            <span class="feature-status status-active">{{ statistics.recommendations }}</span>
          </li>
          <li class="feature-item">
            <span>平台积分</span>
            <span class="feature-status status-active">{{ statistics.points }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="feature-card" :class="{ expanded: expandedCard === 'achievements' }" @click="toggleFeature('achievements')">
      <div class="feature-header">
        <div class="feature-title">
          <div class="feature-icon">🏆</div>
          成就徽章
        </div>
        <div class="feature-arrow">▼</div>
      </div>
      <div class="feature-description">展示您获得的各种成就和徽章</div>
      <span class="feature-status-badge status-available">{{ achievements.length }}个徽章</span>

      <div class="feature-content">
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px;">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            :style="{ background: achievement.color }"
            style="padding: 12px; border-radius: 8px; text-align: center; min-width: 80px;"
          >
            <div style="font-size: 24px;">{{ achievement.icon }}</div>
            <div style="font-size: 12px; margin-top: 4px;">{{ achievement.name }}</div>
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

    const statistics = ref({
      projects: 3,
      courses: 5,
      recommendations: 12,
      points: '2,580'
    })

    const achievements = ref([
      { id: 1, name: '项目达人', icon: '🏆', color: '#ffd700' },
      { id: 2, name: '学习之星', icon: '📚', color: '#c0c0c0' },
      { id: 3, name: '协作专家', icon: '🤝', color: '#cd7f32' }
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

    const saveProfile = () => {
      userProfile.value.name = editProfile.value.name
      userProfile.value.major = editProfile.value.major
      userProfile.value.school = editProfile.value.school
      userProfile.value.skills = editProfile.value.skillsString.split(',').map(s => s.trim())
      userProfile.value.interests = editProfile.value.interests
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
      userProfile,
      editProfile,
      statistics,
      achievements,
      settings,
      themeColors,
      userInitial,
      toggleFeature,
      selectColor,
      saveProfile,
      saveSettings,
      resetSettings
    }
  }
}
</script>

<style scoped>
.profile-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
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
}

.profile-info h2 {
  margin-bottom: 8px;
  color: #495057;
}

.profile-info p {
  color: #6c757d;
  margin-bottom: 4px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
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
