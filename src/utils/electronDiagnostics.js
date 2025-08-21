// Electron 环境诊断工具
export const ElectronDiagnostics = {
  // 检查是否在 Electron 环境中
  isElectron() {
    return window.navigator.userAgent.indexOf('Electron') !== -1
  },

  // 获取环境信息
  getEnvironmentInfo() {
    return {
      userAgent: window.navigator.userAgent,
      isElectron: this.isElectron(),
      location: {
        href: window.location.href,
        protocol: window.location.protocol,
        host: window.location.host,
        pathname: window.location.pathname,
        hash: window.location.hash
      },
      historyLength: window.history.length,
      vueRouterPath: window.$router?.currentRoute?.value?.path || 'N/A'
    }
  },

  // 安全导航函数
  async safeNavigate(router, path) {
    console.log('开始安全导航:', { path, env: this.getEnvironmentInfo() })
    
    try {
      if (this.isElectron()) {
        // Electron 环境优先使用 Vue Router
        console.log('Electron环境 - 使用 Vue Router')
        await router.push(path)
        console.log('Vue Router 导航成功')
        return true
      } else {
        // 浏览器环境
        console.log('浏览器环境 - 使用 Vue Router')
        await router.push(path)
        console.log('Vue Router 导航成功')
        return true
      }
    } catch (error) {
      console.error('Vue Router 导航失败:', error)
      
      // 备选方案
      try {
        if (this.isElectron()) {
          // Electron 环境：确保使用正确的hash路径
          console.log('使用备选方案 - 设置hash路径')
          // 确保路径以 # 开头
          const hashPath = path.startsWith('#') ? path : '#' + path
          window.location.hash = hashPath
          console.log('设置hash为:', hashPath)
          return true
        } else {
          // 浏览器环境使用 history.back 或相对路径
          if (window.history.length > 1 && path === '/') {
            console.log('使用备选方案 - history.back')
            window.history.back()
          } else {
            console.log('使用备选方案 - 相对路径导航')
            // 在浏览器中使用相对路径而不是绝对路径
            window.location.href = window.location.origin + path
          }
          return true
        }
      } catch (fallbackError) {
        console.error('备选方案也失败:', fallbackError)
        return false
      }
    }
  },

  // 调试输出函数
  debug(message, data = {}) {
    console.log(`[ElectronDiagnostics] ${message}`, {
      ...data,
      env: this.getEnvironmentInfo()
    })
  },

  // 错误报告函数
  reportError(error, context = '') {
    console.error(`[ElectronDiagnostics] 错误 ${context}:`, {
      error: error.message || error,
      stack: error.stack,
      env: this.getEnvironmentInfo()
    })
  }
}

export default ElectronDiagnostics
