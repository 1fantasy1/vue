# � 鸿庆书云 - 现代化协作平台

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
- **LocalStorage** - 本地数据存储

### 跨平台技术
- **Electron** - 桌面应用开发框架 (Windows/Linux/macOS)
- **Capacitor** - 移动端跨平台框架 (Android/iOS)

### 开发工具
- **ESLint** - 代码质量检查
- **GitHub Actions** - 自动化 CI/CD
- **electron-builder** - Electron 应用打包工具

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
# Web 开发服务器
npm run dev
# 访问 http://localhost:5173

# 桌面应用开发
npm run electron:dev
```

### 构建应用
```bash
# 一键构建测试
npm run build:test

# 智能构建系统
node scripts/build.cjs web      # Web 应用
node scripts/build.cjs desktop  # 当前平台桌面应用
node scripts/build.cjs android  # Android 项目
node scripts/build.cjs all      # 所有平台
```

详细构建说明请查看 [📖 BUILD_GUIDE.md](./BUILD_GUIDE.md)

## 📁 项目结构

```
鸿庆书云/
├── 🌐 src/                     # Vue 应用源码
│   ├── components/            # 通用组件库
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
│   │   └── KnowledgeBase.vue # 📖 知识库
│   ├── stores/                # 🗃️ 状态管理 (Pinia)
│   ├── router/                # 🛣️ 路由配置
│   ├── services/              # 🔌 本地数据服务
│   ├── config/                # ⚙️ 配置文件
│   └── assets/                # 🎨 静态资源
├── 🖥️ electron/                # 桌面应用
│   ├── main.cjs              # 主进程入口
│   └── preload.cjs           # 预加载脚本
├── 📱 android/                 # Android 项目 (自动生成)
├── 🛠️ scripts/                 # 构建工具
│   ├── build.js              # 智能构建脚本
│   └── build-test.js         # 构建测试脚本
├── 📦 dist/                    # Web 构建输出
├── 💿 dist-electron/           # 桌面应用构建输出
├── 🎨 build/                   # 应用图标和资源
└── 🚀 .github/workflows/       # CI/CD 自动化配置
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
VITE_APP_TITLE=鸿庆书云
VITE_LOCAL_STORAGE_PREFIX=hongqing_
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
