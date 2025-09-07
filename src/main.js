import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { registerElementIcons } from '@/plugins/elementIcons.js'
import { setupOpenAPI } from '@/api/openapi/setupOpenAPI.js'

// 统一使用 OpenAPI 适配器，旧的 RemoteApiService 已移除

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)

// 注册少量按需图标
registerElementIcons(app)

// 挂载应用
app.mount('#app')

// 初始化 OpenAPI SDK（如果已生成）
setupOpenAPI()

// 确保在 Electron 环境中路由正确初始化
if (window.navigator.userAgent.indexOf('Electron') !== -1) {
  app.config.globalProperties.$nextTick(() => {
    // 如果当前不在首页，强制导航到首页
    if (router.currentRoute.value.path !== '/' || !router.currentRoute.value.name) {
      router.replace('/')
    }
  })
}
