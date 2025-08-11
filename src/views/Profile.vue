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
                  <div class="action-buttons">
                    <button class="edit-btn-inline" @click="startEdit" :disabled="userLoading">
                      <span class="btn-icon">✏️</span>
                      编辑资料
                    </button>
                    <button class="refresh-btn-inline" @click="loadUserData(true)" :disabled="userLoading">
                      <span class="btn-icon" :class="{ loading: userLoading }">🔄</span>
                      刷新
                    </button>
                    <button class="logout-btn-inline" @click="handleLogout">
                      <span class="btn-icon">🚪</span>
                      登出
                    </button>
                  </div>
                </div>
                <div class="username">@{{ userProfile.username }}</div>
              </div>
              
              <div class="signature-section">
                <div class="signature-text">{{ userProfile.bio }}</div>
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
                <span>{{ userProfile.email || '邮箱未设置' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📱</span>
                <span>{{ userProfile.phone || '手机号码未设置' }}</span>
              </div>
            </div>
            <!-- 详细信息已隐藏，仅在编辑时可以修改 -->
            <!--
            <div class="interests-section">
              <div class="interests-title">
                <span class="meta-icon">❤️</span>
                <span>兴趣爱好</span>
              </div>
              <div class="interests-content">{{ userProfile.interests || '暂无兴趣爱好' }}</div>
            </div>
            <div class="bio-section">
              <div class="bio-title">
                <span class="meta-icon">📝</span>
                <span>个人简介</span>
              </div>
              <div class="bio-content">{{ userProfile.bio }}</div>
            </div>
            <div class="awards-section">
              <div class="awards-title">
                <span class="meta-icon">🏆</span>
                <span>奖项比赛</span>
              </div>
              <div class="awards-content">{{ userProfile.awards_competitions }}</div>
            </div>
            <div class="academic-section">
              <div class="academic-title">
                <span class="meta-icon">🎓</span>
                <span>学术成就</span>
              </div>
              <div class="academic-content">
                <div v-if="academicAchievementsList.length > 0" class="academic-list">
                  <div v-for="(achievement, index) in academicAchievementsList" :key="index" class="academic-item">
                    {{ achievement }}
                  </div>
                </div>
                <div v-else class="academic-placeholder">
                  {{ userProfile.academic_achievements }}
                </div>
              </div>
            </div>
            <div class="soft-skills-section">
              <div class="soft-skills-title">
                <span class="meta-icon">🧠</span>
                <span>软技能</span>
              </div>
              <div class="soft-skills-content">{{ userProfile.soft_skills }}</div>
            </div>
            <div class="portfolio-section">
              <div class="portfolio-title">
                <span class="meta-icon">🔗</span>
                <span>作品集链接</span>
              </div>
              <div class="portfolio-content">
                <a v-if="userProfile.portfolio_link && userProfile.portfolio_link !== '作品集链接待完善'" 
                   :href="userProfile.portfolio_link" 
                   target="_blank" 
                   class="portfolio-link">
                  {{ userProfile.portfolio_link }}
                </a>
                <span v-else class="portfolio-placeholder">{{ userProfile.portfolio_link }}</span>
              </div>
            </div>
            <div class="role-section">
              <div class="role-title">
                <span class="meta-icon">👤</span>
                <span>偏好角色</span>
              </div>
              <div class="role-content">{{ userProfile.preferred_role }}</div>
            </div>
            <div class="availability-section">
              <div class="availability-title">
                <span class="meta-icon">⏰</span>
                <span>可用时间</span>
              </div>
              <div class="availability-content">{{ userProfile.availability }}</div>
            </div>
            -->
            <div class="skills-section">
              <div 
                v-for="skill in userProfile.skills" 
                :key="typeof skill === 'string' ? skill : skill.name"
                :class="{
                  'skill-card': typeof skill === 'object',
                  'tag': typeof skill === 'string'
                }"
              >
                <div v-if="typeof skill === 'object'" class="skill-content">
                  <span class="skill-name">{{ skill.name }}</span>
                  <div v-if="skill.level" class="skill-level">
                    <span class="level-text">{{ skill.level }}</span>
                    <div class="level-indicator">
                      <div 
                        class="level-bar" 
                        :style="{ width: getLevelWidth(skill.level) }"
                      ></div>
                    </div>
                  </div>
                </div>
                <span v-else>{{ skill }}</span>
              </div>
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
      <div class="settings-header" @click="toggleSettings">
        <div class="settings-title">
          <span class="settings-icon">⚙️</span>
          <span>系统设置</span>
          <span class="status-badge">全功能</span>
        </div>
        <div class="settings-action-hint">
          <span class="desktop-hint">点击{{ isSettingsOpen ? '收起' : '展开' }}</span>
          <span class="arrow-icon" :class="{ 'rotated': isSettingsOpen }">→</span>
        </div>
      </div>
      
      <!-- 桌面端内联设置面板 -->
      <div v-if="isSettingsOpen" class="desktop-settings-panel">
        <!-- 统一使用分组列表布局 -->
        <div v-if="currentView === 'main'" class="settings-list-container">
          <!-- 模型与服务分组 -->
          <div class="settings-group">
            <h3 class="group-title">模型与服务</h3>
            <div class="settings-list">
              <div class="settings-item" @click="openSettingDetail('defaultModel')">
                <div class="item-icon">♥</div>
                <div class="item-content">
                  <div class="item-title">默认模型</div>
                  <div class="item-subtitle">设置各个功能的默认模型</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
              
              <div class="settings-item" @click="openSettingDetail('theme')">
                <div class="item-icon">🎨</div>
                <div class="item-content">
                  <div class="item-title">主题设置</div>
                  <div class="item-subtitle">主题模式和色彩配置</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
              
              <div class="settings-item" @click="openSettingDetail('search')">
                <div class="item-icon">🌐</div>
                <div class="item-content">
                  <div class="item-title">搜索服务</div>
                  <div class="item-subtitle">设置搜索服务</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
              
              <div class="settings-item" @click="openSettingDetail('voice')">
                <div class="item-icon">🔊</div>
                <div class="item-content">
                  <div class="item-title">语音服务</div>
                  <div class="item-subtitle">配置语音合成服务提供商</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
              
              <div class="settings-item" @click="openSettingDetail('mcp')">
                <div class="item-icon">>_</div>
                <div class="item-content">
                  <div class="item-title">MCP</div>
                  <div class="item-subtitle">配置MCP服务器</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
            </div>
          </div>

          <!-- 数据设置分组 -->
          <div class="settings-group">
            <h3 class="group-title">数据设置</h3>
            <div class="settings-list">
              <div class="settings-item" @click="openSettingDetail('backup')">
                <div class="item-icon">🗃️</div>
                <div class="item-content">
                  <div class="item-title">数据备份</div>
                  <div class="item-subtitle">备份和恢复应用数据</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
              
              <div class="settings-item" @click="openSettingDetail('storage')">
                <div class="item-icon">💾</div>
                <div class="item-content">
                  <div class="item-title">聊天记录存储</div>
                  <div class="item-subtitle">0 个文件, 0.00 MB</div>
                </div>
                <div class="item-arrow">›</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置详情页面 -->
        <div v-if="currentView === 'detail'" class="setting-detail-page">
          <!-- 在桌面端，详情页面有独立的头部，不需要显示主页面的头部 -->
          <div class="detail-header">
            <button class="back-btn" @click="backToMain">
              <span>←</span>
            </button>
            <h3 class="detail-title">{{ getDetailTitle() }}</h3>
          </div>
          
          <div class="detail-content">
            <!-- 这里是所有的设置详情内容 - 保持原有的详情内容不变 -->
            <!-- 主题设置详情 -->
            <div v-if="currentSettingDetail === 'theme'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">主题模式</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.theme">
                      <option value="light">浅色模式</option>
                      <option value="dark">深色模式</option>
                      <option value="auto">自动切换</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">主题色彩</label>
                  <div class="setting-input-container">
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
            </div>

            <!-- 默认模型详情 -->
            <div v-if="currentSettingDetail === 'defaultModel'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">默认AI模型</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.defaultModel">
                      <option value="gpt-4">GPT-4</option>
                      <option value="claude">Claude-3</option>
                      <option value="gemini">Gemini Pro</option>
                      <option value="local">本地模型</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">API密钥</label>
                  <div class="setting-input-container">
                    <input type="password" class="setting-input" placeholder="输入您的API密钥" v-model="settings.apiKey">
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">温度参数: {{ settings.temperature }}</label>
                  <div class="setting-input-container">
                    <input type="range" min="0" max="1" step="0.1" v-model="settings.temperature" class="range-input">
                  </div>
                </div>
              </div>
            </div>

            <!-- 搜索服务详情 -->
            <div v-if="currentSettingDetail === 'search'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">搜索引擎</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.searchEngine">
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="baidu">百度</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                    </select>
                  </div>
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

            <!-- 语音服务详情 -->
            <div v-if="currentSettingDetail === 'voice'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">TTS服务提供商</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.ttsProvider">
                      <option value="azure">Azure Cognitive Services</option>
                      <option value="google">Google Text-to-Speech</option>
                      <option value="amazon">Amazon Polly</option>
                      <option value="iflytek">科大讯飞</option>
                      <option value="baidu">百度语音</option>
                      <option value="local">本地合成引擎</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">默认语音</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.defaultVoice">
                      <option value="zh-CN-XiaoxiaoNeural">晓晓 (女声)</option>
                      <option value="zh-CN-YunxiNeural">云希 (男声)</option>
                      <option value="zh-CN-YunyangNeural">云扬 (男声)</option>
                      <option value="en-US-JennyNeural">Jenny (English)</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">语速: {{ settings.speechRate }}</label>
                  <div class="setting-input-container">
                    <input type="range" min="0.5" max="2" step="0.1" v-model="settings.speechRate" class="range-input">
                  </div>
                </div>
                <div class="setting-item checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.autoPlay">
                    <span class="checkmark"></span>
                    <span>自动播放生成的语音</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- MCP服务详情 -->
            <div v-if="currentSettingDetail === 'mcp'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">MCP服务器地址</label>
                  <div class="setting-input-container">
                    <input type="text" class="setting-input" placeholder="ws://localhost:3001" v-model="settings.mcpServerUrl">
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">连接协议</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.mcpProtocol">
                      <option value="websocket">WebSocket</option>
                      <option value="stdio">Standard I/O</option>
                      <option value="sse">Server-Sent Events</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">认证令牌</label>
                  <div class="setting-input-container">
                    <input type="password" class="setting-input" placeholder="输入MCP认证令牌" v-model="settings.mcpAuthToken">
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">连接超时 (秒): {{ settings.mcpTimeout }}</label>
                  <div class="setting-input-container">
                    <input type="range" min="5" max="60" step="5" v-model="settings.mcpTimeout" class="range-input">
                  </div>
                </div>
                <div class="setting-item checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.mcpAutoReconnect">
                    <span class="checkmark"></span>
                    <span>自动重连</span>
                  </label>
                </div>
                <div class="setting-item checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.mcpVerboseLogging">
                    <span class="checkmark"></span>
                    <span>详细日志记录</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 数据备份详情 -->
            <div v-if="currentSettingDetail === 'backup'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">自动备份</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.autoBackup">
                      <option value="disabled">关闭</option>
                      <option value="daily">每日备份</option>
                      <option value="weekly">每周备份</option>
                      <option value="monthly">每月备份</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">备份位置</label>
                  <div class="setting-input-container">
                    <input type="text" class="setting-input" placeholder="选择备份文件夹" v-model="settings.backupPath" readonly>
                  </div>
                </div>
                <div class="setting-item checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.includeSettings">
                    <span class="checkmark"></span>
                    <span>包含设置配置</span>
                  </label>
                </div>
                <div class="setting-item checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.includeHistory">
                    <span class="checkmark"></span>
                    <span>包含聊天历史</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 聊天记录存储详情 -->
            <div v-if="currentSettingDetail === 'storage'" class="settings-panel">
              <div class="settings-items">
                <div class="setting-item">
                  <label class="setting-label">存储位置</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.storageLocation">
                      <option value="local">本地存储</option>
                      <option value="cloud">云端存储</option>
                      <option value="both">本地+云端</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">保留时间</label>
                  <div class="setting-input-container">
                    <select class="setting-input" v-model="settings.retentionPeriod">
                      <option value="forever">永久保留</option>
                      <option value="1year">1年</option>
                      <option value="6months">6个月</option>
                      <option value="3months">3个月</option>
                      <option value="1month">1个月</option>
                    </select>
                  </div>
                </div>
                <div class="setting-item">
                  <label class="setting-label">最大存储大小: {{ settings.maxStorageSize }}GB</label>
                  <div class="setting-input-container">
                    <input type="range" min="1" max="100" step="1" v-model="settings.maxStorageSize" class="range-input">
                  </div>
                </div>
                <div class="setting-item checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="settings.compressOldChats">
                    <span class="checkmark"></span>
                    <span>压缩旧聊天记录</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  

  <!-- 编辑资料弹窗 -->
  <div v-if="isEditing" class="edit-modal">
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
              <label class="input-label">手机号码</label>
              <input type="tel" class="form-input" v-model="editProfile.phone" placeholder="请输入手机号码">
            </div>
          </div>

          <div class="input-group full-width">
            <label class="input-label">技能标签</label>
            <div class="skill-edit-wrapper">
              <div class="skill-edit-list">
                <div class="skill-edit-item" v-for="(s,idx) in editProfile.skillsList" :key="idx">
                  <input class="skill-name-input" v-model="s.name" placeholder="技能名称 如：Python" />
                  <select class="skill-level-select" v-model="s.level">
                    <option disabled value="">选择等级</option>
                    <option v-for="lv in skillLevelOptions" :key="lv" :value="lv">{{ lv }}</option>
                  </select>
                  <div class="skill-level-bar">
                    <div class="skill-level-bar-inner" :style="{ width: getLevelWidth(s.level) }"></div>
                  </div>
                  <button type="button" class="skill-remove-btn" @click="removeSkill(idx)">✕</button>
                </div>
                <div v-if="!editProfile.skillsList.length" class="skill-empty-hint">暂无技能，点击下方按钮添加</div>
              </div>
              <div class="skill-edit-actions">
                <button type="button" class="skill-add-btn" @click="addSkill">+ 添加技能</button>
              </div>
            </div>
          </div>
          <div class="input-group full-width">
            <label class="input-label">兴趣爱好</label>
            <textarea class="form-input" rows="2" v-model="editProfile.interests" placeholder="描述您的兴趣爱好（可选）"></textarea>
          </div>
          <div class="input-group full-width">
            <label class="input-label">个人简介</label>
            <textarea class="form-input" rows="3" v-model="editProfile.bio" placeholder="介绍一下自己吧"></textarea>
          </div>
          <div class="input-group full-width">
            <label class="input-label">奖项比赛</label>
            <textarea class="form-input" rows="3" v-model="editProfile.awards_competitions" placeholder="描述您获得的奖项和参与的比赛"></textarea>
          </div>
          <div class="input-group full-width">
            <label class="input-label">学术成就</label>
            <textarea class="form-input" rows="3" v-model="editProfile.academic_achievements" placeholder="描述您的学术成就和研究成果"></textarea>
          </div>
          <div class="input-group full-width">
            <label class="input-label">软技能</label>
            <textarea class="form-input" rows="2" v-model="editProfile.soft_skills" placeholder="描述您的软技能，如沟通能力、团队协作等"></textarea>
          </div>
          <div class="input-group full-width">
            <label class="input-label">作品集链接</label>
            <input type="url" class="form-input" v-model="editProfile.portfolio_link" placeholder="输入您的作品集或项目展示链接">
          </div>
          <div class="form-row">
            <div class="input-group">
              <label class="input-label">偏好角色</label>
              <input type="text" class="form-input" v-model="editProfile.preferred_role" placeholder="如前端开发、产品经理等">
            </div>
            <div class="input-group">
              <label class="input-label">可用时间</label>
              <input type="text" class="form-input" v-model="editProfile.availability" placeholder="如每周10小时、全职等">
            </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/stores/global'

import { useUserData, useDashboardData, useProjectsData } from '@/composables/useApiData.js'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const globalStore = useGlobalStore()
    
    const expandedCard = ref(null)
    const isEditing = ref(false)
    const isSettingsOpen = ref(false)
    const currentView = ref('main') // 'main' | 'detail'
    const currentSettingDetail = ref('')
  // 移除移动端专用适配

    // API数据管理
    const { user, getCurrentUser, updateProfile, loading: userLoading } = useUserData()
    const { summary, fetchSummary } = useDashboardData()
    const { projects, fetchProjects } = useProjectsData()

    onMounted(() => {
      loadUserData()
    })

    // 监听用户数据变化，实时更新界面
    watch(user, (newUser) => {
      if (newUser) {
        updateUserProfile()
      }
    }, { immediate: true })

    // 监听summary数据变化，实时更新统计
    watch(summary, (newSummary) => {
      if (newSummary) {
        updateStatistics()
      }
    }, { immediate: true })

    // 加载用户数据
    const loadUserData = async (forceRefresh = false) => {
      try {
        if (forceRefresh) {
          console.log('强制刷新用户数据')
        }
        
        await Promise.all([
          getCurrentUser(forceRefresh),
          fetchSummary(),
          fetchProjects()
        ])
      } catch (error) {
        console.warn('加载用户数据失败:', error)
      }
    }

    // 用户配置信息（默认值）
    const userProfile = ref({
      name: '用户',
      username: 'user',
      email: 'user@example.com',
      phone: '',
      major: '专业未设置',
      school: '学校未设置',
      skills: [
        { name: 'Python', level: '初窥门径' },
        { name: 'JavaScript', level: '融会贯通' },
        { name: 'Vue.js', level: '登堂入室' },
        { name: 'React', level: '初窥门径' },
        { name: 'Node.js', level: '炉火纯青' }
      ],
      interests: '',  // 兴趣爱好，可空
      bio: '欢迎使用本平台！',  // 个人简介，默认值
      awards_competitions: '奖项比赛待完善',
      academic_achievements: '学术成就待完善',
      soft_skills: '软技能待完善',
      portfolio_link: '作品集链接待完善',
      preferred_role: '偏好角色待完善',
      availability: '可用时间待完善'
    })

    // 更新用户配置信息
    const updateUserProfile = () => {
      if (user.value) {
        console.log('更新用户配置信息:', user.value)
        // 处理技能数据 - 可能是字符串、数组或对象数组
        let skills = []
        if (typeof user.value.skills === 'string') {
          try {
            // 尝试解析为JSON，支持对象数组格式
            const parsed = JSON.parse(user.value.skills)
            if (Array.isArray(parsed)) {
              skills = parsed
            } else {
              skills = user.value.skills.split(',').map(s => s.trim()).filter(s => s)
            }
          } catch (e) {
            // 如果解析失败，按逗号分割字符串
            skills = user.value.skills.split(',').map(s => s.trim()).filter(s => s)
          }
        } else if (Array.isArray(user.value.skills)) {
          skills = user.value.skills
        }
        
        userProfile.value = {
          name: user.value.name || user.value.username || '用户',
          username: user.value.username || user.value.email?.split('@')[0] || 'user',
          email: user.value.email || 'user@example.com',
          phone: /^\d{11}$/.test(user.value.phone_number || '') ? user.value.phone_number : '',  // 仅接受11位数字
          major: user.value.major || '专业未设置',
          school: user.value.school || '学校未设置', 
          skills: skills.length ? skills : ['技能待完善'],
          interests: user.value.interests || '',  // 兴趣爱好，可空
          bio: user.value.bio || '欢迎使用本平台！',  // 个人简介，默认值
          awards_competitions: user.value.awards_competitions || '奖项比赛待完善',
          academic_achievements: user.value.academic_achievements || '学术成就待完善',
          soft_skills: user.value.soft_skills || '软技能待完善',
          portfolio_link: user.value.portfolio_link || '作品集链接待完善',
          preferred_role: user.value.preferred_role || '偏好角色待完善',
          availability: user.value.availability || '可用时间待完善'
        }
        
        console.log('用户配置信息已更新:', userProfile.value)
        
        // 更新编辑表单
        editProfile.value = {
          name: userProfile.value.name,
          username: userProfile.value.username,
          major: userProfile.value.major,
          school: userProfile.value.school,
          phone: userProfile.value.phone,
          skillsString: Array.isArray(userProfile.value.skills) ? userProfile.value.skills.join(', ') : userProfile.value.skills,
          interests: userProfile.value.interests,
          bio: userProfile.value.bio,
          awards_competitions: userProfile.value.awards_competitions,
          academic_achievements: userProfile.value.academic_achievements,
          soft_skills: userProfile.value.soft_skills,
          portfolio_link: userProfile.value.portfolio_link,
          preferred_role: userProfile.value.preferred_role,
          availability: userProfile.value.availability
        }
      }
    }

    const editProfile = ref({
      name: '用户',
      username: 'user',
      major: '专业未设置',
      school: '学校未设置',
      phone: '',
  // 兼容旧格式的字符串
  skillsString: '技能待完善',
  // 新的结构化技能数组 [{name:'Python', level:'初窥门径'}]
  skillsList: [],
      interests: '',  // 兴趣爱好，可空
      bio: '欢迎使用本平台！',  // 个人简介，默认值
      awards_competitions: '奖项比赛待完善',
      academic_achievements: '学术成就待完善',
      soft_skills: '软技能待完善',
      portfolio_link: '作品集链接待完善',
      preferred_role: '偏好角色待完善',
      availability: '可用时间待完善'
    })

    // 保存原始数据用于取消编辑时恢复
    const originalProfile = ref(null)

    // 统计数据
    const statistics = ref({
      projects: 0,
      courses: 0,
      recommendations: 0,
      points: '0'
    })

    // 更新统计数据
    const updateStatistics = () => {
      if (summary.value) {
        statistics.value = {
          projects: (summary.value.active_projects_count || 0) + (summary.value.completed_projects_count || 0),
          courses: (summary.value.learning_courses_count || 0) + (summary.value.completed_courses_count || 0),
          recommendations: summary.value.recommendations_received_count || 0,
          points: (summary.value.total_points || 0).toLocaleString()
        }
      }
    }

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
      realtimeSearch: true,
      // TTS 语言合成设置
      ttsProvider: 'azure',
      defaultVoice: 'zh-CN-XiaoxiaoNeural',
      speechRate: 1.0,
      autoPlay: false,
      // MCP 服务配置
      mcpServerUrl: 'ws://localhost:3001',
      mcpProtocol: 'websocket',
      mcpAuthToken: '',
      mcpTimeout: 30,
      mcpAutoReconnect: true,
      mcpVerboseLogging: false,
      // 数据备份设置
      autoBackup: 'weekly',
      backupPath: '/Users/用户名/Documents/App备份',
      includeSettings: true,
      includeHistory: true,
      // 存储设置
      storageLocation: 'local',
      retentionPeriod: 'forever',
      maxStorageSize: 10,
      compressOldChats: true
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

    // 获取技能等级对应的进度条宽度
    const getLevelWidth = (level) => {
      const levelMap = {
        '初窥门径': '25%',
        '登堂入室': '50%', 
        '融会贯通': '75%',
        '炉火纯青': '100%'
      }
      return levelMap[level] || '25%'
    }

    // 处理学术成就列表显示
    const academicAchievementsList = computed(() => {
      const achievements = userProfile.value.academic_achievements
      if (!achievements || achievements === '学术成就待完善') {
        return []
      }
      // 将字符串按换行符分割，过滤空行
      return achievements.split('\n').filter(line => line.trim().length > 0)
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

    // 自动保存设置
    let isInitialLoad = true
    const autoSaveSettings = () => {
      // 避免初始加载时的保存提示
      if (isInitialLoad) {
        isInitialLoad = false
        return
      }
      
      // 这里可以添加实际的保存逻辑，比如保存到localStorage或发送到服务器
      localStorage.setItem('userSettings', JSON.stringify(settings.value))
      ElMessage.success('设置已自动保存')
    }

    // 监听设置变化，自动保存
    watch(settings, () => {
      autoSaveSettings()
    }, { deep: true })

    // 从localStorage加载设置
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          Object.assign(settings.value, parsed)
        } catch (error) {
          console.error('加载设置失败:', error)
        }
      }
    }

    // 组件挂载时加载设置
    loadSettings()

    const startEdit = () => {
      // 保存原始数据
      originalProfile.value = {
        name: userProfile.value.name,
        username: userProfile.value.username,
        major: userProfile.value.major,
        school: userProfile.value.school,
        phone: userProfile.value.phone,
        skills: [...userProfile.value.skills],
        interests: userProfile.value.interests,
        bio: userProfile.value.bio,
        awards_competitions: userProfile.value.awards_competitions,
        academic_achievements: userProfile.value.academic_achievements,
        soft_skills: userProfile.value.soft_skills,
        portfolio_link: userProfile.value.portfolio_link,
        preferred_role: userProfile.value.preferred_role,
        availability: userProfile.value.availability
      }
      
      // 同步编辑表单数据
      editProfile.value = {
        name: userProfile.value.name,
        username: userProfile.value.username,
        major: userProfile.value.major,
        school: userProfile.value.school,
        phone: userProfile.value.phone,
        skillsString: (Array.isArray(userProfile.value.skills) ? userProfile.value.skills.map(s => typeof s === 'string' ? s : s.name).join(', ') : ''),
        skillsList: Array.isArray(userProfile.value.skills) ? userProfile.value.skills.filter(s => typeof s === 'object').map(s => ({ ...s })) : [],
        interests: userProfile.value.interests,
        bio: userProfile.value.bio,
        awards_competitions: userProfile.value.awards_competitions,
        academic_achievements: userProfile.value.academic_achievements,
        soft_skills: userProfile.value.soft_skills,
        portfolio_link: userProfile.value.portfolio_link,
        preferred_role: userProfile.value.preferred_role,
        availability: userProfile.value.availability
      }
      
      isEditing.value = true
    }

    // 处理登出
    const handleLogout = () => {
      const confirmed = confirm('确定要登出吗？')
      if (confirmed) {
        globalStore.logout()
        ElMessage.success('已安全登出')
        router.push('/login')
      }
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
          phone: originalProfile.value.phone,
          skillsString: Array.isArray(originalProfile.value.skills) ? originalProfile.value.skills.map(s => typeof s === 'string' ? s : s.name).join(', ') : '',
          skillsList: Array.isArray(originalProfile.value.skills) ? originalProfile.value.skills.filter(s => typeof s === 'object').map(s => ({ ...s })) : [],
          interests: originalProfile.value.interests,
          bio: originalProfile.value.bio,
          awards_competitions: originalProfile.value.awards_competitions,
          academic_achievements: originalProfile.value.academic_achievements,
          soft_skills: originalProfile.value.soft_skills,
          portfolio_link: originalProfile.value.portfolio_link,
          preferred_role: originalProfile.value.preferred_role,
          availability: originalProfile.value.availability,
          status: originalProfile.value.status
        }
      }
      isEditing.value = false
    }

    const saveProfile = async () => {
      try {
        // 构建更新数据 - 根据后端API的字段要求
        // 技能数据：直接发送数组格式，与注册时保持一致
        const allowedLevels = ['初窥门径','登堂入室','融会贯通','炉火纯青']
        const validSkills = editProfile.value.skillsList.filter(s => s.name && s.name.trim() && s.level)
          .map(s => ({
            name: s.name.trim(),
            level: allowedLevels.includes(s.level) ? s.level : '初窥门径'
          }))
        
        console.log('技能数据调试:', {
          skillsList: editProfile.value.skillsList,
          validSkills: validSkills,
          '发送格式': '数组而非JSON字符串',
          '等级验证': allowedLevels
        })
        
        const updateData = {
          name: editProfile.value.name?.trim() || '',
          major: editProfile.value.major?.trim() || '',
          skills: Array.isArray(validSkills) ? validSkills : [],
          bio: editProfile.value.bio?.trim() || '',
          awards_competitions: editProfile.value.awards_competitions?.trim() || '',
          academic_achievements: editProfile.value.academic_achievements?.trim() || '',
          soft_skills: editProfile.value.soft_skills?.trim() || '',
          portfolio_link: editProfile.value.portfolio_link?.trim() || '',
          preferred_role: editProfile.value.preferred_role?.trim() || '',
          availability: editProfile.value.availability?.trim() || ''
        }

        // 仅当手机号为 11 位数字时包含
        if (/^\d{11}$/.test(editProfile.value.phone || '')) {
          updateData.phone_number = editProfile.value.phone
        }

        // 兴趣爱好可空，只有非空时才添加
        if (editProfile.value.interests && editProfile.value.interests.trim()) {
          updateData.interests = editProfile.value.interests.trim()
        }

        // 添加学校字段（如果需要）
        if (editProfile.value.school && editProfile.value.school !== '学校未设置') {
          updateData.school = editProfile.value.school.trim()
        }

        console.log('字段长度检查:', Object.fromEntries(Object.entries(updateData).map(([k,v]) => [k, typeof v === 'string' ? v.length : Array.isArray(v) ? `array(${v.length})` : typeof v])))

        console.log('准备更新的用户数据:', updateData)

        // 调用API更新
        const result = await updateProfile(updateData)
        console.log('更新结果:', result)
        
        // 更新本地数据显示
        userProfile.value.name = editProfile.value.name
        userProfile.value.username = editProfile.value.username
        userProfile.value.major = editProfile.value.major
        userProfile.value.school = editProfile.value.school
        if (/^\d{11}$/.test(editProfile.value.phone || '')) {
          userProfile.value.phone = editProfile.value.phone
        }
        userProfile.value.skills = validSkills  // 直接使用数组格式
        userProfile.value.interests = editProfile.value.interests
        userProfile.value.bio = editProfile.value.bio
        userProfile.value.awards_competitions = editProfile.value.awards_competitions
        userProfile.value.academic_achievements = editProfile.value.academic_achievements
        userProfile.value.soft_skills = editProfile.value.soft_skills
        userProfile.value.portfolio_link = editProfile.value.portfolio_link
        userProfile.value.preferred_role = editProfile.value.preferred_role
        userProfile.value.availability = editProfile.value.availability
        
        isEditing.value = false
        ElMessage.success('个人信息保存成功！')
      } catch (error) {
        console.error('保存个人信息失败:', error)
        ElMessage.error('保存失败: ' + (error.message || '未知错误'))
      }
    }

    // 技能等级选项 - 与注册页面保持一致
    const skillLevelOptions = [
      '初窥门径','登堂入室','融会贯通','炉火纯青'
    ]

    // 添加技能
    const addSkill = () => {
      editProfile.value.skillsList.push({ name: '', level: '初窥门径' })
    }

    // 移除技能
    const removeSkill = (index) => {
      editProfile.value.skillsList.splice(index, 1)
    }

    const toggleSettings = () => {
      // 仅保留桌面端内联面板
      isSettingsOpen.value = !isSettingsOpen.value
      if (!isSettingsOpen.value) {
        currentView.value = 'main'
        currentSettingDetail.value = ''
      }
    }

    const openSettingDetail = (settingType) => {
      currentView.value = 'detail'
      currentSettingDetail.value = settingType
      // 这里可以根据 settingType 导航到具体的设置页面
      console.log('打开设置详情:', settingType)
    }

    const backToMain = () => {
      currentView.value = 'main'
      currentSettingDetail.value = ''
    }

    const getDetailTitle = () => {
      const titles = {
        'theme': '主题设置',
        'defaultModel': '默认模型',
        'search': '搜索服务',
        'voice': '语音服务',
        'mcp': 'MCP配置',
        'backup': '数据备份',
        'storage': '聊天记录存储'
      }
      return titles[currentSettingDetail.value] || '设置'
    }

    return {
      expandedCard,
      isEditing,
      isSettingsOpen,
      currentView,
      currentSettingDetail,
      userProfile,
      editProfile,
      originalProfile,
      statistics,
      sortedAchievements,
      academicAchievementsList,
      settings,
      themeColors,
      userInitial,
      getLevelWidth,
      toggleFeature,
      selectColor,
      startEdit,
      cancelEdit,
      saveProfile,
      handleLogout,
      toggleSettings,
      openSettingDetail,
      backToMain,
      getDetailTitle,
      // API数据相关
      user,
      userLoading,
      loadUserData,
      updateUserProfile,
  updateStatistics,
  // 技能编辑相关
  skillLevelOptions,
  addSkill,
  removeSkill
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

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-btn-inline,
.refresh-btn-inline,
.logout-btn-inline {
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

.logout-btn-inline {
  background: rgba(255, 59, 48, 0.1);
  border-color: rgba(255, 59, 48, 0.2);
}

.edit-btn-inline:hover,
.refresh-btn-inline:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-btn-inline:hover {
  background: rgba(255, 59, 48, 0.2);
  border-color: rgba(255, 59, 48, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.15);
}

.edit-btn-inline:disabled,
.refresh-btn-inline:disabled,
.logout-btn-inline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.signature-section {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
}

.signature-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
  font-style: italic;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.skill-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 20px 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.skill-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 16px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
}

.skill-card:hover::before {
  opacity: 1;
}

.skill-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-name {
  color: white;
  font-size: 18px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.skill-level {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-text::before {
  content: '🎯';
  font-size: 12px;
}

.level-indicator {
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.level-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 3px;
  transition: width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
}

.level-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
  animation: shimmer 3s infinite ease-in-out;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

/* 兴趣爱好区域样式 */
.interests-section {
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.interests-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  margin-bottom: 12px;
}

.interests-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.5;
  padding-left: 36px;
}

/* 兴趣爱好区域样式 */
.bio-section {
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.bio-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  margin-bottom: 12px;
}

.bio-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.5;
  padding-left: 36px;
}

/* 奖项比赛区域样式 */
.awards-section {
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.awards-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  margin-bottom: 12px;
}

.awards-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.5;
  padding-left: 36px;
}

/* 学术成就区域样式 */
.academic-section {
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.academic-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  margin-bottom: 12px;
}

.academic-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.5;
  padding-left: 36px;
}

.academic-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.academic-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.academic-item:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.academic-placeholder {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
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

/* 新增字段的CSS样式 */
.soft-skills-section,
.portfolio-section,
.preferred-role-section,
.availability-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.soft-skills-section:hover,
.portfolio-section:hover,
.preferred-role-section:hover,
.availability-section:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.soft-skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.soft-skill-tag {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.95);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.soft-skill-tag:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.portfolio-link {
  color: #4fc3f7;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.portfolio-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #29b6f6;
  transform: translateY(-1px);
  text-decoration: underline;
}

.portfolio-link::after {
  content: "🔗";
  font-size: 14px;
}

.role-tag,
.availability-tag {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: inline-block;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.role-tag:hover,
.availability-tag:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.availability-tag.available {
  background: rgba(76, 175, 80, 0.3);
  border-color: rgba(76, 175, 80, 0.5);
  color: #81c784;
}

.availability-tag.busy {
  background: rgba(255, 193, 7, 0.3);
  border-color: rgba(255, 193, 7, 0.5);
  color: #ffb74d;
}

.availability-tag.unavailable {
  background: rgba(244, 67, 54, 0.3);
  border-color: rgba(244, 67, 54, 0.5);
  color: #e57373;
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

.arrow-icon.rotated {
  transform: rotate(90deg);
}

.settings-header:hover .arrow-icon.rotated {
  transform: rotate(90deg) translateY(-4px);
}

/* 桌面端内联设置面板 */
.desktop-settings-panel {
  max-width: 1200px;
  margin: 24px auto 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  animation: settingsPanelSlideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes settingsPanelSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
    padding: 0 40px;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
    padding: 40px;
  }
}

.desktop-settings-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 桌面端设置详情页面在内联面板中的样式 */
.desktop-settings-panel .setting-detail-page {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  overflow: visible;
  position: static;
  z-index: auto;
  animation: settingsDetailSlideIn 0.3s ease-out;
}

@keyframes settingsDetailSlideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.desktop-settings-panel .detail-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.4);
  padding: 24px 0 20px;
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  margin: -40px -40px 32px -40px;
}

.desktop-settings-panel .detail-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.desktop-settings-panel .detail-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  text-align: center;
  position: relative;
  z-index: 1;
  letter-spacing: -0.02em;
}

.desktop-settings-panel .back-btn {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 2;
}

.desktop-settings-panel .back-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
  transform: translateY(-50%) translateX(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.desktop-settings-panel .detail-content {
  padding: 0;
  overflow: visible;
  background: transparent;
  position: relative;
}

/* 提示文字：仅保留桌面端提示 */
.desktop-hint { display: inline; }

/* 系统设置弹窗样式 */

/* 桌面端设置详情页面样式 - 现代化重新设计 */
.setting-detail-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 30;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 桌面端设置详情页面优化 */
@media (min-width: 769px) {
  .setting-detail-page {
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
    border-radius: 20px;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(226, 232, 240, 0.6);
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  
  .detail-header {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.4);
    padding: 32px 40px 24px;
    position: relative;
    overflow: hidden;
  }
  
  .detail-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .detail-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
    text-align: center;
    position: relative;
    z-index: 1;
    letter-spacing: -0.02em;
  }
  
  .back-btn {
    position: absolute;
    left: 40px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(226, 232, 240, 0.6);
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 2;
  }
  
  .back-btn:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(102, 126, 234, 0.3);
    color: #667eea;
    transform: translateY(-50%) translateX(-4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  }
  
  .detail-content {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
    background: transparent;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: rgba(102, 126, 234, 0.2) transparent;
  }
  
  .detail-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .detail-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .detail-content::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.2);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  
  .detail-content::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.4);
    background-clip: content-box;
  }
  
  /* 桌面端设置面板重新设计 */
  .settings-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 40px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .settings-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 10%, rgba(102, 126, 234, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(118, 75, 162, 0.02) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  .settings-panel:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 32px 64px rgba(0, 0, 0, 0.12),
      0 16px 32px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: rgba(102, 126, 234, 0.2);
  }
  
  .settings-items {
    display: grid;
    gap: 32px;
    position: relative;
    z-index: 1;
  }
  
  .setting-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
    align-items: start;
    padding: 20px 0;
    border-bottom: 1px solid rgba(226, 232, 240, 0.4);
  }
  
  .setting-item:last-child {
    border-bottom: none;
  }
  
  .setting-item.checkbox-item {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .setting-label {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    letter-spacing: -0.01em;
    line-height: 1.5;
    margin: 0;
    align-self: center;
  }
  
  .setting-input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .setting-input {
    padding: 16px 20px;
    border: 2px solid rgba(226, 232, 240, 0.6);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    color: #2d3748;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.04),
      inset 0 1px 2px rgba(0, 0, 0, 0.02);
  }
  
  .setting-input:hover {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.08),
      inset 0 1px 2px rgba(0, 0, 0, 0.02);
    background: rgba(255, 255, 255, 1);
  }
  
  .setting-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 
      0 0 0 4px rgba(102, 126, 234, 0.15),
      0 8px 24px rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
  }
  
  .range-input {
    height: 12px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%);
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: none;
    padding: 0;
  }
  
  .range-input:hover {
    background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%);
  }
  
  .range-input::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    box-shadow: 
      0 4px 12px rgba(102, 126, 234, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.1);
    border: 4px solid white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .range-input::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 
      0 8px 24px rgba(102, 126, 234, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .range-input::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    border: 4px solid white;
    box-shadow: 
      0 4px 12px rgba(102, 126, 234, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .range-input::-moz-range-thumb:hover {
    transform: scale(1.15);
    box-shadow: 
      0 8px 24px rgba(102, 126, 234, 0.5),
      0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .color-palette {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 24px;
    background: rgba(248, 250, 252, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  
  .color-swatch {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    cursor: pointer;
    border: 4px solid rgba(255, 255, 255, 0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 4px 8px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
  }
  
  .color-swatch:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 
      0 16px 40px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 255, 255, 1);
  }
  
  .color-swatch.active {
    border-color: #2d3748;
    transform: translateY(-4px) scale(1.15);
    box-shadow: 
      0 20px 48px rgba(0, 0, 0, 0.25),
      0 12px 24px rgba(0, 0, 0, 0.15);
  }
  
  .color-swatch.active::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 20px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    font-size: 16px;
    color: #2d3748;
    font-weight: 500;
    padding: 16px 20px;
    border-radius: 16px;
    transition: all 0.3s ease;
    background: rgba(248, 250, 252, 0.5);
    border: 1px solid rgba(226, 232, 240, 0.4);
  }
  
  .checkbox-label:hover {
    background: rgba(102, 126, 234, 0.04);
    border-color: rgba(102, 126, 234, 0.2);
    transform: translateX(4px);
  }
  
  /* 隐藏原生复选框，使用自定义 .checkmark 展示 */
  .checkbox-label input[type="checkbox"] {
    display: none;
  }
  
  .checkmark {
    width: 24px;
    height: 24px;
    border: 3px solid #cbd5e0;
    border-radius: 8px;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 2px rgba(0, 0, 0, 0.04);
  }
  
  .checkbox-label input[type="checkbox"]:checked + .checkmark {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    box-shadow: 
      0 4px 16px rgba(102, 126, 234, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.12);
    transform: scale(1.1);
  }
  
  .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

/* 移除移动端设置详情调整（不再需要） */

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 设置列表容器样式 */
.settings-list-container {
  padding: 0;
  max-width: 100%;
}

/* 桌面端分组列表样式优化 */
.settings-group {
  margin-bottom: 32px;
}

.group-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  padding: 0 4px;
}

.settings-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.04), rgba(118, 75, 162, 0.04));
  transform: translateX(2px);
}

.settings-item:active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  transform: translateX(1px);
}

.item-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 12px;
  transition: all 0.2s ease;
}

.settings-item:hover .item-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  transform: scale(1.05);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
  line-height: 1.4;
}

.item-subtitle {
  font-size: 14px;
  color: #718096;
  line-height: 1.4;
}

.item-arrow {
  font-size: 20px;
  color: #cbd5e0;
  margin-left: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.settings-item:hover .item-arrow {
  color: #667eea;
  transform: translateX(2px);
}

/* 移除移动端列表样式（不再需要） */



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
  
  /* 移除了移动端系统设置弹窗相关样式 */
  
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
  
  .skills-section {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  
  .skill-card {
    padding: 18px 20px;
    border-radius: 16px;
  }
  
  .skill-name {
    font-size: 16px;
  }
  
  .level-text {
    font-size: 13px;
  }

  .level-indicator {
    height: 5px;
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
  
  /* 移除了小屏幕系统设置弹窗相关样式 */
  
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

/* 结构化技能编辑器样式 */
.skill-edit-wrapper { 
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255,255,255,0.4);
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.6);
}
.skill-edit-list { display: flex; flex-direction: column; gap: 10px; }
.skill-edit-item { display: grid; grid-template-columns: 140px 150px 1fr 40px; gap: 10px; align-items: center; }
.skill-name-input, .skill-level-select { width:100%; padding:8px 10px; border:1px solid #cbd5e0; border-radius:8px; font-size:13px; background:rgba(255,255,255,0.9); }
.skill-name-input:focus, .skill-level-select:focus { outline:none; border-color:#667eea; box-shadow:0 0 0 3px rgba(102,126,234,0.25); }
.skill-level-bar { height:6px; background:rgba(0,0,0,0.1); border-radius:3px; overflow:hidden; position:relative; }
.skill-level-bar-inner { height:100%; background:linear-gradient(90deg,#667eea,#764ba2,#f093fb); transition:width .6s ease; box-shadow:0 0 6px rgba(102,126,234,.6) inset; }
.skill-remove-btn { background:#fff; border:1px solid #e2e8f0; height:34px; width:34px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; color:#718096; transition:.25s; }
.skill-remove-btn:hover { background:#fee2e2; color:#e53e3e; border-color:#fecaca; }
.skill-edit-actions { display:flex; gap:10px; }
.skill-add-btn { background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; border:none; padding:8px 14px; font-size:12px; font-weight:600; border-radius:10px; cursor:pointer; letter-spacing:.5px; box-shadow:0 4px 12px rgba(102,126,234,.4); transition:.3s; }
.skill-add-btn:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.25); }
.skill-empty-hint { font-size:12px; color:#4a5568; background:rgba(255,255,255,.6); padding:8px 10px; border-radius:8px; text-align:center; }
@media (max-width: 768px){
  .skill-edit-item { 
    grid-template-columns: 1fr 90px 42px; 
    grid-template-rows: auto auto auto; 
    gap: 8px 8px; 
    padding:10px 12px; 
    background:rgba(255,255,255,0.7); 
    border:1px solid #e2e8f0; 
    border-radius:12px;
  }
  .skill-name-input { grid-column:1/4; }
  .skill-level-select { grid-column:1/2; }
  .skill-remove-btn { grid-column:3/4; justify-self:end; height:32px; width:32px; }
  .skill-level-bar { grid-column:1/4; margin-top:2px; }
  .skill-level-bar-inner { height:6px; }
  .skill-edit-item input, .skill-edit-item select { font-size:13px; }
  .skill-edit-wrapper { gap:14px; }
  .skill-edit-actions { flex-wrap:wrap; }
  .skill-add-btn { width:100%; text-align:center; }
}

</style>
