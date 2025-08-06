/**
 * 移动端调试工具
 * 用于检测和修复移动端布局问题
 */

export class MobileDebugger {
  constructor() {
    this.init()
  }

  init() {
    // 在开发环境下启用调试
    if (import.meta.env.DEV) {
      this.addDebugInfo()
      this.checkViewport()
      this.addDebugStyles()
    }
  }

  // 添加调试信息到页面
  addDebugInfo() {
    const debugInfo = document.createElement('div')
    debugInfo.id = 'mobile-debug-info'
    debugInfo.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 10000;
      max-width: 200px;
      display: none;
    `
    
    const updateInfo = () => {
      const bodyRect = document.body.getBoundingClientRect()
      const appRect = document.getElementById('app')?.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const documentWidth = document.documentElement.clientWidth
      
      debugInfo.innerHTML = `
        <strong>移动端调试信息</strong><br>
        视口宽度: ${viewportWidth}px<br>
        文档宽度: ${documentWidth}px<br>
        Body宽度: ${bodyRect.width}px<br>
        App宽度: ${appRect?.width || 'N/A'}px<br>
        Body左边距: ${bodyRect.left}px<br>
        App左边距: ${appRect?.left || 'N/A'}px<br>
        设备像素比: ${window.devicePixelRatio}<br>
        用户代理: ${this.isMobile() ? '移动设备' : '桌面设备'}
      `
    }

    document.body.appendChild(debugInfo)
    updateInfo()
    
    // 窗口大小变化时更新信息
    window.addEventListener('resize', updateInfo)
    
    // 双击显示/隐藏调试信息
    document.addEventListener('dblclick', () => {
      debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none'
    })
  }

  // 检查视口设置
  checkViewport() {
    const viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) {
      console.warn('缺少视口元标签！')
      return
    }

    const content = viewport.getAttribute('content')
    const requiredSettings = [
      'width=device-width',
      'initial-scale=1.0'
    ]

    requiredSettings.forEach(setting => {
      if (!content.includes(setting)) {
        console.warn(`视口设置缺少: ${setting}`)
      }
    })

    console.log('视口设置:', content)
  }

  // 添加调试样式
  addDebugStyles() {
    const style = document.createElement('style')
    style.innerHTML = `
      /* 调试边框 - 仅在开发环境显示 */
      body.debug-mode {
        box-shadow: inset 0 0 0 2px red !important;
      }
      
      body.debug-mode #app {
        box-shadow: inset 0 0 0 2px blue !important;
      }
      
      body.debug-mode .page {
        box-shadow: inset 0 0 0 2px green !important;
      }
    `
    document.head.appendChild(style)

    // 按Ctrl+D切换调试模式
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        document.body.classList.toggle('debug-mode')
        console.log('调试模式', document.body.classList.contains('debug-mode') ? '开启' : '关闭')
      }
    })
  }

  // 检测是否为移动设备
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // 强制修复边距问题
  fixMarginIssues() {
    const elements = [document.documentElement, document.body, document.getElementById('app')]
    
    elements.forEach(el => {
      if (el) {
        el.style.margin = '0'
        el.style.padding = '0'
        el.style.width = '100%'
        el.style.boxSizing = 'border-box'
      }
    })

    console.log('已强制修复边距问题')
  }

  // 获取布局信息
  getLayoutInfo() {
    const info = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      document: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      },
      body: document.body.getBoundingClientRect(),
      app: document.getElementById('app')?.getBoundingClientRect()
    }

    console.table(info)
    return info
  }
}

// 自动初始化
export const mobileDebugger = new MobileDebugger()

// 暴露到全局作用域以便在控制台中使用
if (import.meta.env.DEV) {
  window.mobileDebugger = mobileDebugger
}
