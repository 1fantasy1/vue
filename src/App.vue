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
      'login-container': $route.path === '/login'
    }">
      <router-view />
    </div>

    <!-- 底部导航 - 仅在已登录且非智库页面时显示 -->
    <div class="bottom-nav" v-if="$route.path !== '/knowledge' && $route.path !== '/login' && isAuthenticated">
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
    }
  },
  mounted() {
    // 初始化时检查路由
    if (this.$route.path === '/knowledge') {
      document.body.classList.add('knowledge-page')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

/* 为非智库和个人页面添加底部间距 */
body:not(.knowledge-page):not(.profile-page) {
  padding-bottom: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 为非智库和个人页面添加padding */
.container:not(.knowledge-container):not(.profile-container):not(.login-container) {
  padding: 20px;
}

/* 登录页面的容器样式 */
.container.login-container {
  max-width: none;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 智库页面的容器样式 */
.container.knowledge-container {
  max-width: none;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

/* 个人页面的容器样式 */
.container.profile-container {
  max-width: none;
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 5px;
}

.header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.page {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.feature-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.feature-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.feature-card.expanded {
  border-color: #667eea;
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
  color: #495057;
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: #667eea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.feature-arrow {
  font-size: 18px;
  color: #6c757d;
  transition: transform 0.3s ease;
}

.feature-card.expanded .feature-arrow {
  transform: rotate(180deg);
}

.feature-description {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 12px;
}

.feature-content {
  display: none;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  animation: slideDown 0.3s ease;
}

.feature-card.expanded .feature-content {
  display: block;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-available {
  background: #d4edda;
  color: #155724;
}

.status-developing {
  background: #fff3cd;
  color: #856404;
}

.feature-list {
  list-style: none;
}

.feature-item {
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 9998; /* 确保底部导航栏始终在最上层 */
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  min-width: 60px;
  text-decoration: none;
  color: #6c757d;
}

.nav-item:hover {
  background: #f8f9fa;
}

.nav-item.active {
  color: #667eea;
  background: #f0f4ff;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}
</style>
