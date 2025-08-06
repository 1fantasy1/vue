import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 移动端调试工具（仅在开发环境）
if (import.meta.env.DEV) {
  import('./utils/mobileDebug.js')
}

// 创建应用实例
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')

// 确保在 Electron 环境中路由正确初始化
if (window.navigator.userAgent.indexOf('Electron') !== -1) {
  app.config.globalProperties.$nextTick(() => {
    // 如果当前不在首页，强制导航到首页
    if (router.currentRoute.value.path !== '/' || !router.currentRoute.value.name) {
      router.replace('/')
    }
  })
}
