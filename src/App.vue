<template>
  <div id="app" :class="{ 'knowledge-page': $route.path === '/knowledge', 'profile-page': $route.path === '/profile' }">
    <!-- 头部 - 仅在首页显示 -->
    <div class="header" v-if="$route.path === '/' && isAuthenticated">
      <div class="container">
        <h1>🚀 鸿庆书云</h1>
        <p>云聚书，书载鸿，鸿成庆</p>
      </div>
    </div>

    <div class="container" :class="{ 
      'knowledge-container': $route.path === '/knowledge', 
      'profile-container': $route.path === '/profile',
      'login-container': $route.path === '/login',
      'full-screen-container': $route.matched.some(r=>r.meta && r.meta.fullScreen)
    }">
      <router-view />
    </div>

    <!-- 底部导航 - 可按路由隐藏 -->
    <div class="bottom-nav" v-if="$route.path !== '/knowledge' && $route.path !== '/login' && isAuthenticated && !$route.matched.some(r=>r.meta && r.meta.hideBottomNav)">
      <router-link to="/" class="nav-item" active-class="active">
        <div class="nav-icon">🏠</div>
        <div class="nav-text">首页</div>
      </router-link>
      <router-link to="/plaza" class="nav-item" active-class="active">
        <div class="nav-icon">🌟</div>
        <div class="nav-text">广场</div>
      </router-link>
      <router-link to="/profile" class="nav-item" active-class="active">
        <div class="nav-icon">👤</div>
        <div class="nav-text">我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useGlobalStore } from './stores/global'

export default {
  name: 'App',
  setup() {
    const globalStore = useGlobalStore()
    
    // 初始化认证状态
    globalStore.initAuth()
    
    // 计算认证状态
    const isAuthenticated = computed(() => globalStore.isAuthenticated)
    
    return {
      isAuthenticated
    }
  },
  watch: {
    '$route'(to) {
      // 动态添加/移除body类
      if (to.path === '/knowledge') {
        document.body.classList.add('knowledge-page')
      } else {
        document.body.classList.remove('knowledge-page')
      }

      // 全屏页面（如聊天室）加类，便于局部样式微调
      if (to.matched.some(r => r.meta && r.meta.fullScreen)) {
        document.body.classList.add('full-screen-page')
      } else {
        document.body.classList.remove('full-screen-page')
      }
    }
  },
  mounted() {
    // 初始化时检查路由
    if (this.$route.path === '/knowledge') {
      document.body.classList.add('knowledge-page')
    }
    if (this.$route.matched.some(r => r.meta && r.meta.fullScreen)) {
      document.body.classList.add('full-screen-page')
    }
  }
}
</script>

<style>
/* App.vue 仅保留少量页面特定样式，通用样式已迁移到 src/styles */

.feature-card {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-base);
  position: relative;
}

.feature-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.feature-card.expanded {
  border-color: var(--primary-color);
  background: #f8f9ff;
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.feature-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.feature-arrow {
  font-size: 18px;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.feature-card.expanded .feature-arrow {
  transform: rotate(180deg);
}

.feature-description {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 12px;
}

.feature-content {
  display: none;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  animation: slideDown 0.3s ease;
}

.feature-card.expanded .feature-content {
  display: block;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.feature-status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-available { background: #d4edda; color: #155724; }
.status-developing { background: #fff3cd; color: #856404; }

.feature-list { list-style: none; }

.feature-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-item:last-child { border-bottom: none; }

.feature-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-active { background: #d4edda; color: #155724; }
.status-pending { background: #fff3cd; color: #856404; }

/* 全屏容器：去掉左右内边距、高度100vh，适合聊天室沉浸式布局 */
.full-screen-container {
  padding: 0 !important;          /* 去掉上下左右内边距 */
  max-width: none !important;
  height: 100vh;                  /* 容器本身占满视口 */
  min-height: 100vh;
}

body.full-screen-page {
  overflow: hidden;              /* 防止出现双滚动条 */
  padding-bottom: 0 !important;  /* 覆盖全局为了底部导航预留的空间 */
}

/* 全屏页面的全局覆盖（确保不受 scoped 限制） */
body.full-screen-page .container.full-screen-container .page {
  padding: 0 !important;
  min-height: 100vh !important;
}
body.full-screen-page .container.full-screen-container .chat-layout {
  height: 100vh !important;
  gap: 0 !important;
}
</style>
