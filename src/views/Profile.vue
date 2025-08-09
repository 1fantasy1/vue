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
                    <button class="refresh-btn-inline" @click="loadUserData" :disabled="userLoading">
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
                <div class="signature-text">{{ userProfile.status }}</div>
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
              <div class="meta-item">
                <span class="meta-icon">📱</span>
                <span>{{ userProfile.phone || '手机号码未设置' }}</span>
              </div>
            </div>
            <div class="interests-section">
              <div class="interests-title">
                <span class="meta-icon">🎯</span>
                <span>兴趣方向</span>
              </div>
              <div class="interests-content">{{ userProfile.interests }}</div>
            </div>
            <div class="bio-section">
              <div class="bio-title">
                <span class="meta-icon">❤️</span>
                <span>兴趣爱好</span>
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
      <div class="settings-header" @click="toggleSettings">
        <div class="settings-title">
          <span class="settings-icon">⚙️</span>
          <span>系统设置</span>
          <span class="status-badge">全功能</span>
        </div>
        <div class="settings-action-hint">
          <span class="desktop-hint">点击{{ isSettingsOpen ? '收起' : '展开' }}</span>
          <span class="mobile-hint">点击打开</span>
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

  <!-- 移动端系统设置弹窗 -->
  <div v-if="isSettingsOpen && isMobile" class="settings-modal" @click.self="closeSettingsModal">
    <div class="settings-modal-content">
      <!-- 只在主页面时显示头部 -->
      <div v-if="currentView === 'main'" class="settings-modal-header">
        <button class="back-btn" @click="closeSettingsModal">
          <span>←</span>
        </button>
        <h3 class="settings-modal-title">
          <span>设置</span>
        </h3>
        <div class="header-spacer"></div>
      </div>
      
      <div class="settings-modal-body" :class="{ 'detail-mode': currentView === 'detail' }">
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
            <div class="input-group">
              <label class="input-label">技能标签</label>
              <input type="text" class="form-input" v-model="editProfile.skillsString" placeholder="用逗号分隔多个技能">
            </div>
          </div>
          <div class="input-group full-width">
            <label class="input-label">个性签名</label>
            <input type="text" class="form-input" v-model="editProfile.status" placeholder="展示您的个性与态度">
          </div>
          <div class="input-group full-width">
            <label class="input-label">兴趣方向</label>
            <textarea class="form-input" rows="2" v-model="editProfile.interests" placeholder="描述您的专业兴趣方向"></textarea>
          </div>
          <div class="input-group full-width">
            <label class="input-label">兴趣爱好</label>
            <textarea class="form-input" rows="3" v-model="editProfile.bio" placeholder="分享您的兴趣爱好和生活偏好"></textarea>
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
    const isMobile = ref(false)

    // API数据管理
    const { user, getCurrentUser, updateProfile, loading: userLoading } = useUserData()
    const { summary, fetchSummary } = useDashboardData()
    const { projects, fetchProjects } = useProjectsData()

    // 检测设备类型
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
      loadUserData()
    })

    // 加载用户数据
    const loadUserData = async () => {
      try {
        await Promise.all([
          getCurrentUser(),
          fetchSummary(),
          fetchProjects()
        ])
        
        // 更新用户配置信息
        if (user.value) {
          updateUserProfile()
        }
        
        // 更新统计数据
        if (summary.value) {
          updateStatistics()
        }
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
      skills: ['技能待完善'],
      interests: '兴趣方向待完善',
      bio: '兴趣爱好待完善',
      awards_competitions: '奖项比赛待完善',
      academic_achievements: '学术成就待完善',
      soft_skills: '软技能待完善',
      portfolio_link: '作品集链接待完善',
      preferred_role: '偏好角色待完善',
      availability: '可用时间待完善',
      status: '个性签名待设置 ✨'
    })

    // 更新用户配置信息
    const updateUserProfile = () => {
      if (user.value) {
        // 处理技能数据 - 可能是字符串或数组
        let skills = []
        if (typeof user.value.skills === 'string') {
          skills = user.value.skills.split(',').map(s => s.trim()).filter(s => s)
        } else if (Array.isArray(user.value.skills)) {
          skills = user.value.skills
        }
        
        userProfile.value = {
          name: user.value.name || user.value.username || '用户',
          username: user.value.username || user.value.email?.split('@')[0] || 'user',
          email: user.value.email || 'user@example.com',
          phone: user.value.phone || '',
          major: user.value.major || '专业未设置',
          school: user.value.school || '学校未设置', 
          skills: skills.length ? skills : ['技能待完善'],
          interests: user.value.interests || '兴趣方向待完善',
          bio: user.value.bio || '兴趣爱好待完善',
          awards_competitions: user.value.awards_competitions || '奖项比赛待完善',
          academic_achievements: user.value.academic_achievements || '学术成就待完善',
          soft_skills: user.value.soft_skills || '软技能待完善',
          portfolio_link: user.value.portfolio_link || '作品集链接待完善',
          preferred_role: user.value.preferred_role || '偏好角色待完善',
          availability: user.value.availability || '可用时间待完善',
          status: user.value.status || '个性签名待设置 ✨'
        }
        
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
          availability: userProfile.value.availability,
          status: userProfile.value.status
        }
      }
    }

    const editProfile = ref({
      name: '用户',
      username: 'user',
      major: '专业未设置',
      school: '学校未设置',
      phone: '',
      skillsString: '技能待完善',
      interests: '兴趣方向待完善',
      bio: '兴趣爱好待完善',
      awards_competitions: '奖项比赛待完善',
      academic_achievements: '学术成就待完善',
      soft_skills: '软技能待完善',
      portfolio_link: '作品集链接待完善',
      preferred_role: '偏好角色待完善',
      availability: '可用时间待完善',
      status: '个性签名待设置 ✨'
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
        availability: userProfile.value.availability,
        status: userProfile.value.status
      }
      
      // 同步编辑表单数据
      editProfile.value = {
        name: userProfile.value.name,
        username: userProfile.value.username,
        major: userProfile.value.major,
        school: userProfile.value.school,
        phone: userProfile.value.phone,
        skillsString: userProfile.value.skills.join(', '),
        interests: userProfile.value.interests,
        bio: userProfile.value.bio,
        awards_competitions: userProfile.value.awards_competitions,
        academic_achievements: userProfile.value.academic_achievements,
        soft_skills: userProfile.value.soft_skills,
        portfolio_link: userProfile.value.portfolio_link,
        preferred_role: userProfile.value.preferred_role,
        availability: userProfile.value.availability,
        status: userProfile.value.status
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
          skillsString: originalProfile.value.skills.join(', '),
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
        const updateData = {
          name: editProfile.value.name,
          major: editProfile.value.major,
          phone: editProfile.value.phone,
          skills: editProfile.value.skillsString,  // 后端期望字符串格式
          interests: editProfile.value.interests,  // 兴趣方向
          bio: editProfile.value.bio,              // 兴趣爱好
          awards_competitions: editProfile.value.awards_competitions,  // 奖项比赛
          academic_achievements: editProfile.value.academic_achievements,  // 学术成就
          soft_skills: editProfile.value.soft_skills,  // 软技能
          portfolio_link: editProfile.value.portfolio_link,  // 作品集链接
          preferred_role: editProfile.value.preferred_role,  // 偏好角色
          availability: editProfile.value.availability,  // 可用时间
          status: editProfile.value.status         // 个性签名
        }

        // 添加学校字段（如果需要）
        if (editProfile.value.school && editProfile.value.school !== '学校未设置') {
          updateData.school = editProfile.value.school
        }

        console.log('准备更新的用户数据:', updateData)

        // 调用API更新
        const result = await updateProfile(updateData)
        console.log('更新结果:', result)
        
        // 更新本地数据显示
        userProfile.value.name = editProfile.value.name
        userProfile.value.username = editProfile.value.username
        userProfile.value.major = editProfile.value.major
        userProfile.value.school = editProfile.value.school
        userProfile.value.phone = editProfile.value.phone
        userProfile.value.skills = editProfile.value.skillsString.split(',').map(s => s.trim()).filter(s => s)
        userProfile.value.interests = editProfile.value.interests
        userProfile.value.bio = editProfile.value.bio
        userProfile.value.awards_competitions = editProfile.value.awards_competitions
        userProfile.value.academic_achievements = editProfile.value.academic_achievements
        userProfile.value.soft_skills = editProfile.value.soft_skills
        userProfile.value.portfolio_link = editProfile.value.portfolio_link
        userProfile.value.preferred_role = editProfile.value.preferred_role
        userProfile.value.availability = editProfile.value.availability
        userProfile.value.status = editProfile.value.status
        
        isEditing.value = false
        ElMessage.success('个人信息保存成功！')
      } catch (error) {
        console.error('保存个人信息失败:', error)
        ElMessage.error('保存失败: ' + (error.message || '未知错误'))
      }
    }

    const toggleSettings = () => {
      if (isMobile.value) {
        // 移动端使用模态框
        openSettingsModal()
      } else {
        // 桌面端切换内联面板
        isSettingsOpen.value = !isSettingsOpen.value
        if (!isSettingsOpen.value) {
          currentView.value = 'main'
          currentSettingDetail.value = ''
        }
      }
    }

    const openSettingsModal = () => {
      isSettingsOpen.value = true
    }

    const closeSettingsModal = () => {
      isSettingsOpen.value = false
      currentView.value = 'main'
      currentSettingDetail.value = ''
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
      isMobile,
      userProfile,
      editProfile,
      originalProfile,
      statistics,
      sortedAchievements,
      academicAchievementsList,
      settings,
      themeColors,
      userInitial,
      toggleFeature,
      selectColor,
      startEdit,
      cancelEdit,
      saveProfile,
      handleLogout,
      toggleSettings,
      openSettingsModal,
      closeSettingsModal,
      openSettingDetail,
      backToMain,
      getDetailTitle,
      // API数据相关
      user,
      userLoading,
      loadUserData,
      updateUserProfile,
      updateStatistics
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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

/* 响应式控制：桌面端和移动端显示不同的提示文字 */
.desktop-hint {
  display: none;
}

.mobile-hint {
  display: inline;
}

@media (min-width: 769px) {
  .desktop-hint {
    display: inline;
  }
  
  .mobile-hint {
    display: none;
  }
  
  /* 在桌面端隐藏模态框 */
  .settings-modal {
    display: none;
  }
}

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

/* 移动端设置详情页面样式调整 */
@media (max-width: 768px) {
  .setting-detail-page {
    border-radius: 0;
    background: white;
  }
  
  .detail-header {
    padding: env(safe-area-inset-top, 20px) 1rem 1rem;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
    display: flex;
    align-items: center;
  }
  
  .detail-title {
    font-size: 18px;
    flex: 1;
    text-align: center;
    margin: 0;
    font-weight: 600;
    color: #2d3748;
  }
  
  .detail-content {
    padding: 20px 16px;
  }
  
  .back-btn {
    position: static;
    display: block;
    transform: none;
    background: none;
    border: none;
    font-size: 24px;
    color: #007AFF;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  
  .back-btn:hover {
    background-color: #f0f0f0;
  }
  
  /* 移动端设置面板样式 */
  .settings-panel {
    background: rgba(248, 250, 252, 0.95);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
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
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
  }
  
  .setting-input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .setting-input, .range-input {
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    font-size: 16px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    color: #1f2937;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .setting-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
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
    border: none;
    padding: 0;
  }
  
  .color-palette {
    gap: 10px;
    justify-content: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    border: 2px solid rgba(226, 232, 240, 0.8);
  }
  
  .color-swatch {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 2px solid #d1d5db;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
}

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

/* 移动端样式保持完美不变 */
@media (max-width: 768px) {
  .settings-list-container {
    padding: 0;
  }
  
  .group-title {
    font-size: 16px;
    margin: 0 0 16px 0;
    padding: 0 16px;
    font-weight: 600;
    color: #333;
  }
  
  .settings-list {
    border-radius: 12px;
    margin: 0 16px;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  
  .settings-item {
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background: transparent;
    transform: none;
  }
  
  .settings-item:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.04), rgba(118, 75, 162, 0.04));
    transform: translateX(2px);
    padding-left: 16px;
  }
  
  .item-icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    transition: all 0.2s ease;
  }
  
  .settings-item:hover .item-icon {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
    transform: scale(1.05);
  }
  
  .item-title {
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
  }
  
  .item-subtitle {
    font-size: 13px;
    color: #718096;
  }
  
  .item-arrow {
    font-size: 18px;
    color: #cbd5e0;
  }
  
  .settings-item:hover .item-arrow {
    color: #667eea;
    transform: translateX(2px);
  }
}

/* 返回按钮样式 */
.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #007AFF;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  display: none;
}

.back-btn:hover {
  background-color: #f0f0f0;
}

/* 系统设置弹窗样式 - 桌面端现代化重新设计 */
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

/* 桌面端设置模态框优化 */
@media (min-width: 769px) {
  .settings-modal {
    padding: 3rem;
  }
  
  .settings-modal-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(40px);
    border-radius: 32px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 
      0 40px 80px rgba(0, 0, 0, 0.25),
      0 20px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    max-width: 1100px;
    max-height: 85vh;
    position: relative;
    overflow: hidden;
  }
  
  .settings-modal-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%),
      linear-gradient(135deg, rgba(248, 250, 252, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(241, 245, 249, 0.4) 100%);
    pointer-events: none;
    z-index: 0;
  }
  
  .settings-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 3rem 2rem;
    border-bottom: 1px solid rgba(226, 232, 240, 0.4);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.06), rgba(118, 75, 162, 0.06));
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 10;
    position: relative;
  }
  
  .settings-modal-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .settings-modal-title {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 16px;
    letter-spacing: -0.02em;
    flex: 1;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  
  .back-btn {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(226, 232, 240, 0.6);
    font-size: 24px;
    color: #4a5568;
    cursor: pointer;
    padding: 12px;
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    position: relative;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-btn:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(102, 126, 234, 0.3);
    color: #667eea;
    transform: translateX(-4px);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  }
  
  .header-spacer {
    width: 56px;
  }
  
  .settings-modal-body {
    padding: 3rem;
    max-height: 60vh;
    overflow-y: auto;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
    z-index: 1;
  }
  
  .settings-modal-body.detail-mode {
    padding: 0;
    max-height: none;
    height: 100%;
  }
  
  .settings-modal-body::-webkit-scrollbar {
    width: 8px;
  }
  
  .settings-modal-body::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .settings-modal-body::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.2);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  
  .settings-modal-body::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.4);
    background-clip: content-box;
  }
  
  /* 桌面端分组列表样式优化 */
  .settings-list-container {
    padding: 0;
    max-width: 100%;
  }
  
  .settings-group {
    margin-bottom: 48px;
  }
  
  .group-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 32px 0;
    padding: 0 8px;
    letter-spacing: -0.02em;
    position: relative;
  }
  
  .group-title::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 8px;
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
  
  .settings-list {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(226, 232, 240, 0.6);
    position: relative;
  }
  
  .settings-list::before {
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
  
  .settings-item {
    display: flex;
    align-items: center;
    padding: 28px 32px;
    border-bottom: 1px solid rgba(226, 232, 240, 0.4);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
    background: transparent;
  }
  
  .settings-item:last-child {
    border-bottom: none;
  }
  
  .settings-item:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.06), rgba(118, 75, 162, 0.06));
    transform: translateX(8px);
    padding-left: 40px;
  }
  
  .settings-item:active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    transform: translateX(4px);
  }
  
  .item-icon {
    font-size: 28px;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    backdrop-filter: blur(10px);
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(226, 232, 240, 0.4);
    box-shadow: 
      0 8px 16px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }
  
  .settings-item:hover .item-icon {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
    transform: scale(1.1) rotate(5deg);
    box-shadow: 
      0 16px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  .item-content {
    flex: 1;
    min-width: 0;
  }
  
  .item-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 8px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }
  
  .item-subtitle {
    font-size: 16px;
    color: #4a5568;
    line-height: 1.4;
    font-weight: 500;
  }
  
  .item-arrow {
    font-size: 24px;
    color: #cbd5e0;
    margin-left: 16px;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .settings-item:hover .item-arrow {
    color: #667eea;
    transform: translateX(8px) scale(1.2);
  }
}

.settings-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  position: sticky;
  top: 0;
  z-index: 10;
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
  flex: 1;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #007AFF;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  z-index: 10;
  position: relative;
}

.back-btn:hover {
  background-color: #f0f0f0;
}

.header-spacer {
  width: 40px; /* 与返回按钮同宽，用于平衡布局 */
}

.settings-modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  position: relative;
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
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.settings-panel:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background: #f8fafc;
  transform: translateY(-2px);
  border-color: rgba(102, 126, 234, 0.3);
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
  
  /* 移动端系统设置弹窗完美适配 */
  .settings-modal {
    padding: 0;
    align-items: stretch;
  }
  
  .settings-modal-content {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    animation: modalSlideLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(30px);
  }
  
  @keyframes modalSlideLeft {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .settings-modal-header {
    padding: env(safe-area-inset-top, 20px) 1.5rem 1rem;
    position: relative;
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .back-btn {
    display: block;
    position: static;
    order: 1;
    background: none;
    border: none;
    font-size: 24px;
    color: #007AFF;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  
  .back-btn:hover {
    background-color: #f0f0f0;
  }
  
  .settings-modal-title {
    text-align: center;
    flex: 1;
    margin: 0;
    font-size: 1.4rem;
    order: 2;
    position: static;
    transform: none;
    left: auto;
    font-weight: 700;
    color: #2d3748;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    letter-spacing: -0.01em;
  }
  
  .header-spacer {
    width: 40px;
    order: 3;
  }
  
  .close-btn {
    display: none;
  }

  .settings-modal-header::before {
    display: none;
  }
  
  .settings-modal-body {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
    max-height: none;
    background: #ffffff;
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .panel-title {
    font-size: 1.1rem;
    margin-bottom: 16px;
    padding-bottom: 8px;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
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
    align-items: stretch;
  }
  
  .settings-modal-content {
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
    width: 100%;
  }
  
  .settings-modal-header {
    padding: env(safe-area-inset-top, 16px) 1rem 0.75rem;
    text-align: center;
  }
  
  .settings-modal-header::before {
    display: none;
  }
  
  .settings-modal-title {
    font-size: 1.2rem;
    margin: 0;
  }
  
  .close-btn {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
  
  .settings-modal-body {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
    max-height: none;
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
