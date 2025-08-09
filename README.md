# 🌟 鸿庆书云 - 现代化协作平台

<div align=## ✨ 核心特性

- 🌐 **Web 应用** - 现代化的单页面应用，响应式设计适配各种设备
- 🎯 **项目管理** - 创建、参与和管理各类创新项目
- 📚 **课程学习** - 丰富的在线课程和培训资源
- 💬 **实时聊天** - 团队成员之间的即时通讯和协作
- 📝 **笔记系统** - 课程笔记和快速记录功能
- 🌟 **广场交流** - 发现优秀项目和分享创意想法
- 📖 **知识库** - 结构化的知识管理和分享平台
- ⭐ **收藏夹** - 收藏喜欢的内容和资源
- 👤 **个人中心** - 个性化的用户体验和设置
![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.0-409EFF?style=for-the-badge&logo=element&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.1.0-FFD21E?style=for-the-badge&logo=pinia&logoColor=white)

**云聚书，书载鸿，鸿成庆**

一个现代化的 Web 协作平台，致力于为用户提供项目管理、课程学习、知识分享和团队协作的一站式解决方案。

[🚀 快速开始](#快速开始) · [🐛 问题反馈](https://github.com/1fantasy1/vue/issues)

</div>

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.0-409EFF?style=for-the-badge&logo=element&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.1.0-FFD21E?style=for-the-badge&logo=pinia&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-7.4.2-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)

**云聚书，书载鸿，鸿成庆**

一个现代化的跨平台协作平台，支持 Web、桌面和移动端，致力于为用户提供项目管理、课程学习、知识分享和团队协作的一站式解决方案。

[🚀 快速开始](#快速开始) · [📖 构建指南](./BUILD_GUIDE.md) · [🐛 问题反馈](https://github.com/1fantasy1/vue/issues)

</div>

## ✨ 核心特性

- � **跨平台支持** - Web、Windows、Linux、macOS、Android 全平台覆盖
- �🎯 **项目管理** - 创建、参与和管理各类创新项目
- 📚 **课程学习** - 丰富的在线课程和培训资源
- 💬 **实时聊天** - 团队成员之间的即时通讯和协作
- 📝 **笔记系统** - 课程笔记和快速记录功能
- 🌟 **广场交流** - 发现优秀项目和分享创意想法
- 📖 **知识库** - 结构化的知识管理和分享平台
- ⭐ **收藏夹** - 收藏喜欢的内容和资源
- 👤 **个人中心** - 个性化的用户体验和设置

## 🏗️ 技术架构

### 前端技术栈
- **Vue 3** - 现代化的 JavaScript 框架 (Composition API)
- **Vite** - 下一代前端构建工具
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 轻量级状态管理库
- **Element Plus** - 企业级 UI 组件库
- **Axios** - HTTP 客户端库

### 开发工具
- **ESLint** - 代码质量检查
- **VS Code** - 推荐开发环境
- **Git** - 版本控制系统

## 🚀 快速开始

### 环境要求
- Node.js 18+ 或 20+
- npm 9+ 或 yarn
- Git

### 安装依赖
```bash
# 克隆项目
git clone https://github.com/1fantasy1/vue.git
cd vue

# 安装依赖
npm install
```

### 开发模式
```bash
# 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

### 构建应用
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
鸿庆书云/
├── 🌐 src/                     # Vue 应用源码
│   ├── components/            # 通用组件库
│   │   ├── APITestTool.vue   # API 测试工具
│   │   ├── HelloWorld.vue    # 示例组件
│   │   ├── TheWelcome.vue    # 欢迎组件
│   │   └── icons/            # 图标组件
│   ├── views/                 # 页面视图组件
│   │   ├── Home.vue          # 🏠 首页
│   │   ├── Plaza.vue         # 🌟 广场
│   │   ├── Profile.vue       # 👤 个人中心
│   │   ├── MyProjects.vue    # 🎯 我的项目
│   │   ├── MyCourses.vue     # 📚 我的课程
│   │   ├── ChatRooms.vue     # 💬 聊天室
│   │   ├── CourseNotes.vue   # 📝 课程笔记
│   │   ├── QuickNotes.vue    # ⚡ 快速笔记
│   │   ├── Favorites.vue     # ⭐ 收藏夹
│   │   ├── KnowledgeHub.vue  # 🧠 知识中心
│   │   ├── KnowledgeBase.vue # 📖 知识库
│   │   ├── APITest.vue       # 🔧 API 测试
│   │   ├── DevTools.vue      # 🛠️ 开发工具
│   │   └── Login.vue         # 🔐 登录页面
│   ├── stores/                # 🗃️ 状态管理 (Pinia)
│   │   └── global.js         # 全局状态
│   ├── router/                # 🛣️ 路由配置
│   │   └── index.js          # 路由定义
│   ├── services/              # 🔌 API 服务层
│   │   ├── api.js            # API 接口
│   │   ├── cache.js          # 缓存服务
│   │   ├── httpClient.js     # HTTP 客户端
│   │   └── remoteApi.js      # 远程 API
│   ├── composables/           # 🔄 组合式函数
│   │   ├── useApiData.js     # API 数据钩子
│   │   └── useLocalData.js   # 本地数据钩子
│   ├── config/                # ⚙️ 配置文件
│   │   └── index.js          # 项目配置
│   ├── assets/                # 🎨 静态资源
│   │   ├── main.css          # 主样式文件
│   │   ├── base.css          # 基础样式
│   │   └── logo.svg          # 项目Logo
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── � public/                 # 公共静态资源
│   └── favicon.ico           # 网站图标
├── 📦 dist/                   # 构建输出目录
├── 🚀 .github/workflows/      # GitHub Actions
├── ⚙️ vite.config.js          # Vite 配置
├── 📋 package.json           # 项目依赖配置
└── 📖 README.md              # 项目说明文档
```
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

## 🔧 开发环境配置

### 推荐的 IDE 设置

- [VS Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (禁用 Vetur)

### 必要的 VS Code 扩展

项目已配置推荐扩展，VS Code 会自动提示安装：
- Vue.volar - Vue 3 语言支持
- Webnative.webnative - Web Native 开发支持

### 环境变量配置

项目支持多环境配置，可创建以下文件：

```bash
.env                # 所有环境通用配置
.env.development   # 开发环境配置  
.env.production    # 生产环境配置
```

示例配置：
```env
VITE_APP_TITLE=鸿庆书云
VITE_API_BASE_URL=http://127.0.0.1:8001
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

### 🔧 开发工具
- API 测试工具
- 开发调试功能
- 系统监控面板

## ⚙️ API 配置

项目支持 API 代理配置，在 `vite.config.js` 中设置：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8001',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
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

### v1.0.0 (2025-08-09)
- 🎉 项目结构优化，移除构建复杂性
- ✨ 专注于 Web 开发，简化开发流程
- 🎨 UI 界面设计和实现完善
- 📱 响应式布局适配优化
- 🔧 API 服务层架构搭建
- 📖 完善的文档和开发指南

### v0.0.0 (2025-08-04)
- 🎉 项目初始化
- ✨ 基础功能模块开发

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 团队

- **开发团队** - [1fantasy1](https://github.com/1fantasy1)

## 📞 联系我们

如果您有任何问题或建议，请随时联系我们：

-  Issues: [GitHub Issues](https://github.com/1fantasy1/vue/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/1fantasy1/vue/discussions)

---

<div align="center">
  <sub>Built with ❤️ using Vue 3 + Vite + Element Plus</sub>
</div>
