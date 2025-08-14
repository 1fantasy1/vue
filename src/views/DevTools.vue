<template>
  <div class="page">
    <div class="header">
      <h1 class="page-title">工具箱</h1>
      <p class="page-description">实用工具和开发辅助功能，提升工作效率</p>
    </div>

    <!-- 工具分类 -->
    <div class="tools-container">
      <!-- 开发工具 -->
      <div class="tool-category">
        <h2 class="category-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6Z"/>
          </svg>
          开发工具
        </h2>
        <div class="tools-grid">
          <div class="tool-card" @click="openTool('json-formatter')">
            <div class="tool-icon dev-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.93 3.07,20.07 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5C3.07,3.93 3.93,3.07 5,3M19,3C20.07,3.07 20.93,3.93 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19C20.93,20.07 20.07,20.93 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19Z"/>
              </svg>
            </div>
            <h3 class="tool-title">JSON 格式化</h3>
            <p class="tool-description">格式化和验证 JSON 数据</p>
          </div>

          <div class="tool-card" @click="openTool('base64')">
            <div class="tool-icon dev-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1M12,7C9.24,7 7,9.24 7,12S9.24,17 12,17S17,14.76 17,12S14.76,7 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
              </svg>
            </div>
            <h3 class="tool-title">Base64 编解码</h3>
            <p class="tool-description">Base64 字符串编码和解码</p>
          </div>

          <div class="tool-card" @click="openTool('color-picker')">
            <div class="tool-icon dev-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/>
              </svg>
            </div>
            <h3 class="tool-title">颜色选择器</h3>
            <p class="tool-description">RGB、HEX、HSL 颜色转换</p>
          </div>

          <div class="tool-card" @click="openTool('regex-tester')">
            <div class="tool-icon dev-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"/>
              </svg>
            </div>
            <h3 class="tool-title">正则表达式</h3>
            <p class="tool-description">正则表达式测试和验证</p>
          </div>
        </div>
      </div>

      <!-- 文本工具 -->
      <div class="tool-category">
        <h2 class="category-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9,7H15V5H9M11,17H13V11H11M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
          文本工具
        </h2>
        <div class="tools-grid">
          <div class="tool-card" @click="openTool('text-diff')">
            <div class="tool-icon text-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M6.5,7.5H9.5V9H6.5V7.5M6.5,10.5H9.5V12H6.5V10.5M6.5,13.5H9.5V15H6.5V13.5M11,7.5H17.5V9H11V7.5M11,10.5H17.5V12H11V10.5M11,13.5H17.5V15H11V13.5Z"/>
              </svg>
            </div>
            <h3 class="tool-title">文本对比</h3>
            <p class="tool-description">比较两段文本的差异</p>
          </div>

          <div class="tool-card" @click="openTool('word-count')">
            <div class="tool-icon text-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3 class="tool-title">字数统计</h3>
            <p class="tool-description">统计文本字符数和行数</p>
          </div>

          <div class="tool-card" @click="openTool('text-converter')">
            <div class="tool-icon text-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z"/>
              </svg>
            </div>
            <h3 class="tool-title">大小写转换</h3>
            <p class="tool-description">文本大小写格式转换</p>
          </div>

          <div class="tool-card" @click="openTool('url-encoder')">
            <div class="tool-icon text-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39L7.17,14L8.59,15.41C9.37,16.2 10.63,16.2 11.41,15.41C12.2,14.63 12.2,13.37 11.41,12.59L9.17,10.35L7.76,11.76L10.59,13.41M14.83,10.59C14.42,10.2 14.42,9.6 14.83,9.19C15.22,8.8 15.82,8.8 16.23,9.19L17.65,10.61L18.25,10L16.83,8.59C16.05,7.8 14.79,7.8 14,8.59C13.22,9.37 13.22,10.63 14,11.41L16.24,13.65L17.65,12.24L14.83,10.59M21,3H3C1.9,3 1,3.9 1,5V19C1,20.1 1.9,21 3,21H21C22.1,21 23,20.1 23,19V5C23,3.9 22.1,3 21,3M21,19H3V5H21V19Z"/>
              </svg>
            </div>
            <h3 class="tool-title">URL 编解码</h3>
            <p class="tool-description">URL 字符串编码和解码</p>
          </div>
        </div>
      </div>

      <!-- 生成工具 -->
      <div class="tool-category">
        <h2 class="category-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1M11,7H13A2,2 0 0,1 15,9V10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 15,13.5V15A2,2 0 0,1 13,17H11V15H13V13H11V11H13V9H11V7Z"/>
          </svg>
          生成工具
        </h2>
        <div class="tools-grid">
          <div class="tool-card" @click="openTool('uuid-generator')">
            <div class="tool-icon generate-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15A1,1 0 0,1 22,16H21A7,7 0 0,1 14,23H13V22A1,1 0 0,1 12,21A1,1 0 0,1 11,22V23H10A7,7 0 0,1 3,16H2A1,1 0 0,1 1,15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z"/>
              </svg>
            </div>
            <h3 class="tool-title">UUID 生成器</h3>
            <p class="tool-description">生成唯一标识符</p>
          </div>

          <div class="tool-card" @click="openTool('password-generator')">
            <div class="tool-icon generate-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
            </div>
            <h3 class="tool-title">密码生成器</h3>
            <p class="tool-description">生成安全密码</p>
          </div>

          <div class="tool-card" @click="openTool('qr-generator')">
            <div class="tool-icon generate-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H9V11M15,11H17V13H15V11M19,11H21V13H19V11M12,15H14V17H12V15M3,5H9V9H3V5M5,7V7H7V7H5M3,15H9V19H3V15M5,17V17H7V17H5M15,5H21V9H15V5M17,7V7H19V7H17M15,15H17V17H15V15M17,15H19V17H17V15M19,17H21V19H19V17Z"/>
              </svg>
            </div>
            <h3 class="tool-title">二维码生成</h3>
            <p class="tool-description">文本转二维码</p>
          </div>

          <div class="tool-card" @click="openTool('lorem-ipsum')">
            <div class="tool-icon generate-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H18V12L12,18L6,12V20Z"/>
              </svg>
            </div>
            <h3 class="tool-title">Lorem Ipsum</h3>
            <p class="tool-description">生成占位文本</p>
          </div>
        </div>
      </div>

      <!-- 管理员工具 -->
      <div class="tool-category">
        <h2 class="category-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M21.1,12.5L22.5,11.09L21.1,9.91L19.29,10.39C18.97,10.04 18.59,9.75 18.15,9.56L17.85,7.5H15.95L15.65,9.56C15.21,9.75 14.83,10.04 14.5,10.39L12.7,9.91L11.3,11.09L12.7,12.5L11.3,13.91L12.7,15.09L14.5,14.61C14.82,14.96 15.2,15.25 15.64,15.44L15.94,17.5H17.84L18.14,15.44C18.58,15.25 18.96,14.96 19.29,14.61L21.1,15.09L22.5,13.91L21.1,12.5M17.9,13.75C17.9,14.47 17.32,15.06 16.6,15.06C15.88,15.06 15.29,14.47 15.29,13.75C15.29,13.03 15.88,12.44 16.6,12.44C17.32,12.44 17.9,13.03 17.9,13.75M8.81,14.5C8.81,14.78 8.64,15 8.44,15H3.56C3.36,15 3.19,14.78 3.19,14.5V13.5C3.19,13.22 3.36,13 3.56,13H8.44C8.64,13 8.81,13.22 8.81,13.5V14.5M8.81,10.5C8.81,10.78 8.64,11 8.44,11H3.56C3.36,11 3.19,10.78 3.19,10.5V9.5C3.19,9.22 3.36,9 3.56,9H8.44C8.64,9 8.81,9.22 8.81,9.5V10.5Z"/>
          </svg>
          管理员工具
        </h2>
        <div class="tools-grid">
          <div class="tool-card admin-tool" @click="navigateToAdmin('courses')">
            <div class="tool-icon admin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            </div>
            <h3 class="tool-title">课程管理</h3>
            <p class="tool-description">创建、编辑和管理平台课程</p>
            <div class="admin-badge">管理员</div>
          </div>

          <div class="tool-card admin-tool" @click="navigateToAdmin('users')">
            <div class="tool-icon admin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C18.11,4 19.99,5.89 19.99,8C19.99,10.11 18.11,12 16,12C13.89,12 12,10.11 12,8C12,5.89 13.89,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z"/>
              </svg>
            </div>
            <h3 class="tool-title">用户管理</h3>
            <p class="tool-description">管理平台用户和权限</p>
            <div class="admin-badge">管理员</div>
          </div>

          <div class="tool-card admin-tool" @click="navigateToAdmin('settings')">
            <div class="tool-icon admin-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/>
              </svg>
            </div>
            <h3 class="tool-title">系统设置</h3>
            <p class="tool-description">平台配置和系统管理</p>
            <div class="admin-badge">管理员</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'DevTools',
  setup() {
    const router = useRouter()

    const openTool = (toolType) => {
      // 这里可以实现具体的工具功能
      // 可以打开模态框或跳转到具体的工具页面
      console.log(`打开工具: ${toolType}`)
      
      // 简单的提示信息
      alert(`即将打开 ${getToolName(toolType)} 工具`)
    }

    const navigateToAdmin = (adminType) => {
      // 检查管理员权限 (这里应该从用户状态或store中获取)
      const userRole = localStorage.getItem('userRole') || 'user'
      
      if (userRole !== 'admin') {
        alert('您没有管理员权限')
        return
      }

      switch (adminType) {
        case 'courses':
          router.push('/admin/courses')
          break
        case 'users':
          alert('用户管理功能正在开发中')
          break
        case 'settings':
          alert('系统设置功能正在开发中')
          break
        default:
          console.log(`未知管理工具: ${adminType}`)
      }
    }

    const getToolName = (toolType) => {
      const toolNames = {
        'json-formatter': 'JSON 格式化',
        'base64': 'Base64 编解码',
        'color-picker': '颜色选择器',
        'regex-tester': '正则表达式',
        'text-diff': '文本对比',
        'word-count': '字数统计',
        'text-converter': '大小写转换',
        'url-encoder': 'URL 编解码',
        'uuid-generator': 'UUID 生成器',
        'password-generator': '密码生成器',
        'qr-generator': '二维码生成',
        'lorem-ipsum': 'Lorem Ipsum'
      }
      return toolNames[toolType] || '未知工具'
    }

    return {
      openTool,
      navigateToAdmin
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
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.page-description {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.tools-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tool-category {
  margin-bottom: 48px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.tool-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tool-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.tool-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 16px;
}

.dev-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.text-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.generate-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.admin-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.admin-tool {
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.15);
}

.admin-tool:hover {
  border-color: rgba(240, 147, 251, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.25);
}

.admin-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.tool-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.tool-description {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tool-card {
    min-height: 160px;
    padding: 20px;
  }
  
  .tool-icon {
    width: 48px;
    height: 48px;
  }
  
  .category-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .tool-card {
    min-height: 140px;
    padding: 16px;
  }
  
  .tool-title {
    font-size: 1.1rem;
  }
  
  .tool-description {
    font-size: 13px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
}
</style>
