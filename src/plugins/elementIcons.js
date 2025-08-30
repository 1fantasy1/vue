// 仅注册项目中用到的 Element Plus 图标，避免全量注册带来的体积增长
import { Search, DocumentCopy, Paperclip, Position } from '@element-plus/icons-vue'

export function registerElementIcons(app) {
  const icons = { Search, DocumentCopy, Paperclip, Position }
  Object.entries(icons).forEach(([name, component]) => {
    app.component(name, component)
  })
}

export default registerElementIcons
