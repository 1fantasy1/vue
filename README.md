# 🚀 鸿庆书云

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.0-409EFF?style=for-the-badge&logo=element&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.1.0-FFD21E?style=for-the-badge&logo=pinia&logoColor=white)

**云聚书，书载鸿，鸿成庆**

一个现代化的在线协作平台，致力于为用户提供项目管理、课程学习、知识分享和团队协作的一站式解决方案。

</div>

## ✨ 特性

- 🎯 **项目管理** - 创建、参与和管理各类创新项目
- 📚 **课程学习** - 丰富的在线课程和培训资源
- 💬 **实时聊天** - 团队成员之间的即时通讯和协作
- 📝 **笔记系统** - 课程笔记和快速记录功能
- 🌟 **广场交流** - 发现优秀项目和分享创意想法
- 📖 **知识库** - 结构化的知识管理和分享平台
- ⭐ **收藏夹** - 收藏喜欢的内容和资源
- 👤 **个人中心** - 个性化的用户体验和设置

## 🏗️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 现代化的状态管理库

### UI 组件库
- **Element Plus** - 基于 Vue 3 的组件库
- **Element Plus Icons** - 丰富的图标集合

### 构建工具
- **Vite** - 下一代前端构建工具
- **@vitejs/plugin-vue** - Vue 3 支持插件

### HTTP 客户端
- **Axios** - 基于 Promise 的 HTTP 库

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── HelloWorld.vue
│   ├── TheWelcome.vue
│   ├── WelcomeItem.vue
│   └── icons/          # 图标组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── Plaza.vue       # 广场
│   ├── Profile.vue     # 个人中心
│   ├── MyProjects.vue  # 我的项目
│   ├── MyCourses.vue   # 我的课程
│   ├── ChatRooms.vue   # 聊天室
│   ├── CourseNotes.vue # 课程笔记
│   ├── QuickNotes.vue  # 快速笔记
│   ├── Favorites.vue   # 收藏夹
│   ├── KnowledgeHub.vue # 知识中心
│   └── KnowledgeBase.vue # 知识库
├── router/             # 路由配置
│   └── index.js
├── stores/             # 状态管理
│   └── global.js
├── services/           # API 服务
│   └── api.js
├── config/             # 配置文件
│   └── index.js
├── assets/             # 静态资源
│   ├── base.css
│   ├── main.css
│   └── logo.svg
├── App.vue             # 根组件
└── main.js            # 入口文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

启动后访问 [http://localhost:5173](http://localhost:5173)

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🔧 开发环境配置

### 推荐的 IDE 设置

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用 Vetur)

### 必要的 VS Code 扩展

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 📱 功能模块

### 🏠 首页
- 项目和课程概览
- 快速导航卡片
- 实时统计信息

### 🌟 广场
- 发现优秀项目
- 浏览热门内容
- 社区互动交流

### 👤 个人中心
- 个人信息管理
- 设置和偏好
- 账户安全

### 📊 项目管理
- 创建和参与项目
- 项目进度跟踪
- 团队协作工具

### 📚 课程学习
- 在线课程浏览
- 学习进度管理
- 课程笔记记录

### 💬 聊天室
- 实时消息通讯
- 群组聊天功能
- 文件分享

### 📖 知识库
- 结构化知识管理
- 知识分类和标签
- 搜索和收藏

## 🎨 自定义配置

查看 [Vite 配置参考](https://vite.dev/config/) 了解更多配置选项。

### 环境变量

创建 `.env` 文件来配置环境变量：

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=创新协作平台
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue 3 组合式 API 规范
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 📝 版本历史

### v0.0.0 (2025-08-04)
- 🎉 项目初始化
- ✨ 基础功能模块开发
- 🎨 UI 界面设计和实现
- 📱 响应式布局适配

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 团队

- **开发团队** - [1fantasy1](https://github.com/1fantasy1)

## 📞 联系我们

如果您有任何问题或建议，请随时联系我们：

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/1fantasy1/vue/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/1fantasy1/vue/discussions)

---

<div align="center">
  <sub>Built with ❤️ using Vue 3 + Vite</sub>
</div>
