<div align="center">

# � 鸿庆书云 - 现代化协作平台

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.0-409EFF?style=for-the-badge&logo=element&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.1.0-FFD21E?style=for-the-badge&logo=pinia&logoColor=white)

**✨ 云聚书，书载鸿，鸿成庆 ✨**

🚀 一个现代化的 Web 协作平台，致力于为用户提供项目管理、课程学习、知识分享和团队协作的一站式解决方案

[🏠 快速开始](#-快速开始) · [� 项目结构](#-项目结构) · [�️ 开发指南](#️-开发环境配置) · [🐛 问题反馈](https://github.com/1fantasy1/vue/issues)

</div>

---

## ✨ 核心特性

<table>
<tr>
<td width="50%">

### 🌐 **应用特性**
- 🎯 **项目管理** - 创建、参与和管理各类创新项目
- 📚 **课程学习** - 丰富的在线课程和培训资源
- 💬 **实时聊天** - 团队成员之间的即时通讯和协作
- 📝 **笔记系统** - 课程笔记和快速记录功能

</td>
<td width="50%">

### 🚀 **技术亮点**
- 🌟 **广场交流** - 发现优秀项目和分享创意想法
- 📖 **知识库** - 结构化的知识管理和分享平台
- ⭐ **收藏夹** - 收藏喜欢的内容和资源
- 👤 **个人中心** - 个性化的用户体验和设置

</td>
</tr>
</table>

## 🏗️ 技术架构

<div align="center">

### 🎨 前端技术栈

| 技术 | 版本 | 描述 |
|------|------|------|
| ![Vue.js](https://img.shields.io/badge/Vue-3.4.0-4FC08D?style=flat-square&logo=vue.js) | `v3.4.0` | 现代化的 JavaScript 框架 (Composition API) |
| ![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=flat-square&logo=vite) | `v5.0.0` | 下一代前端构建工具 |
| ![Vue Router](https://img.shields.io/badge/Vue%20Router-4.x-4FC08D?style=flat-square) | `v4.x` | 官方路由管理器 |
| ![Pinia](https://img.shields.io/badge/Pinia-2.1.0-FFD21E?style=flat-square) | `v2.1.0` | 轻量级状态管理库 |
| ![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.0-409EFF?style=flat-square) | `v2.4.0` | 企业级 UI 组件库 |
| ![Axios](https://img.shields.io/badge/Axios-latest-5A29E4?style=flat-square) | `latest` | HTTP 客户端库 |

### 🛠️ 开发工具

| 工具 | 用途 |
|------|------|
| **ESLint** | 代码质量检查 |
| **VS Code** | 推荐开发环境 |
| **Git** | 版本控制系统 |

</div>

## 🚀 快速开始

### 📋 环境要求

<div align="center">

| 工具 | 版本要求 | 推荐版本 |
|------|----------|----------|
| ![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-339933?style=flat-square&logo=node.js) | `≥ 18.0.0` | `20.x` |
| ![npm](https://img.shields.io/badge/npm-≥9.0.0-CB3837?style=flat-square&logo=npm) | `≥ 9.0.0` | `latest` |
| ![Git](https://img.shields.io/badge/Git-latest-F05032?style=flat-square&logo=git) | `latest` | `latest` |

</div>

### 🔧 安装步骤

```bash
# 📥 克隆项目
git clone https://github.com/1fantasy1/vue.git
cd vue

# 📦 安装依赖
npm install
```

### 🏃‍♂️ 运行项目

<table>
<tr>
<td width="50%">

#### 🔥 开发模式
```bash
# 启动开发服务器
npm run dev

# 🌐 访问地址
# http://localhost:5173
```

</td>
<td width="50%">

#### 📦 生产构建
```bash
# 构建生产版本
npm run build

# 👀 预览构建结果
npm run preview
```

</td>
</tr>
</table>

## 📁 项目结构

<div align="center">

### 🏗️ 目录架构图

</div>

```
鸿庆书云/
├── 📄 index.html                # 入口 HTML 文件
├── ⚙️ jsconfig.json             # JavaScript 配置
├── 📦 package.json              # 项目依赖与脚本
├── 📖 README.md                 # 项目说明文档
├── 🛠️ vite.config.js            # Vite 构建配置
├── 🔙 backend/                  # 后端相关代码
├── 🌍 public/                   # 公共静态资源
│   ├── 🎯 favicon.ico           # 网站图标
│   └── 📜 layout-test.js        # 静态 JS 文件
└── 🎨 src/                      # Vue 应用源码
    ├── 🏠 App.vue               # 根组件
    ├── 🚪 main.js               # 应用入口
    ├── 🎨 assets/               # 静态资源
    │   ├── 🎭 base.css          # 基础样式
    │   ├── 🖼️ logo.svg          # 项目 Logo
    │   └── 💄 main.css          # 主样式文件
    ├── 🧩 components/           # 通用组件库
    │   ├── 🔧 APITestTool.vue   # API 测试工具
    │   ├── 👋 HelloWorld.vue    # 示例组件
    │   ├── 🎉 TheWelcome.vue    # 欢迎组件
    │   ├── 📋 WelcomeItem.vue   # 欢迎项组件
    │   └── 🎭 icons/            # 图标组件集合
    │       ├── 👥 IconCommunity.vue
    │       ├── 📚 IconDocumentation.vue
    │       ├── 🌱 IconEcosystem.vue
    │       ├── 🤝 IconSupport.vue
    │       └── 🔨 IconTooling.vue
    ├── 🎪 composables/          # 组合式函数
    │   ├── 📡 useApiData.js     # API 数据钩子
    │   └── 💾 useLocalData.js   # 本地数据钩子
    ├── ⚙️ config/               # 配置文件
    │   └── 📝 index.js          # 项目配置
    ├── 🛣️ router/               # 路由配置
    │   ├── 🎯 index.js          # 当前路由定义
    │   ├── 💾 index_backup.js   # 路由备份
    │   └── 🆕 index_new.js      # 新路由配置
    ├── 🔗 services/             # API 服务层
    │   ├── 🌐 api.js            # API 接口定义
    │   ├── 💾 cache.js          # 缓存服务
    │   ├── 📡 httpClient.js     # HTTP 客户端
    │   └── 🌍 remoteApi.js      # 远程 API 服务
    ├── 🗃️ stores/               # 状态管理 (Pinia)
    │   └── 🌍 global.js         # 全局状态管理
    ├── 🔧 utils/                # 工具函数库
    └── 📱 views/                # 页面视图组件
        ├── 🧪 APITest.vue       # API 测试页面
        ├── 💬 ChatRooms.vue     # 聊天室
        ├── 📝 CourseNotes.vue   # 课程笔记
        ├── 🛠️ DevTools.vue      # 开发工具
        ├── ⭐ Favorites.vue     # 收藏夹
        ├── 🏠 Home.vue          # 首页
        ├── 📖 KnowledgeBase.vue # 知识库
        ├── 🧠 KnowledgeHub.vue  # 知识中心
        ├── 🔐 Login.vue         # 登录页面
        ├── 📚 MyCourses.vue     # 我的课程
        ├── 🎯 MyProjects.vue    # 我的项目
        ├── 🌟 Plaza.vue         # 广场
        ├── 👤 Profile.vue       # 个人中心
        └── ⚡ QuickNotes.vue    # 快速笔记
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

<div align="center">

### 💻 推荐的 IDE 设置

</div>

| IDE | 插件 | 说明 |
|-----|------|------|
| ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visual-studio-code) | [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) | Vue 3 语言支持 (禁用 Vetur) |
| ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visual-studio-code) | [Webnative](https://marketplace.visualstudio.com/items?itemName=Webnative.webnative) | Web Native 开发支持 |

<div align="center">

### 🛠️ 必要的扩展

</div>

项目已配置推荐扩展，VS Code 会自动提示安装：

```json
{
  "recommendations": [
    "Vue.volar",
    "Webnative.webnative"
  ]
}
```

<div align="center">

### 🌍 环境变量配置

</div>

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

<div align="center">

### � 核心功能导览

</div>

<table>
<tr>
<td width="33%">

#### �🏠 **首页**
- 📊 项目和课程概览
- 🚀 快速导航卡片  
- 📈 实时统计信息

#### 🌟 **广场**
- 🔍 发现优秀项目
- 🔥 浏览热门内容
- 💬 社区互动交流

#### 👤 **个人中心**
- 🛠️ 个人信息管理
- ⚙️ 设置和偏好
- 🔒 账户安全

</td>
<td width="33%">

#### 📊 **项目管理**
- ➕ 创建和参与项目
- 📈 项目进度跟踪
- 👥 团队协作工具

#### 📚 **课程学习**
- 📖 在线课程浏览
- 📊 学习进度管理
- 📝 课程笔记记录

#### 💬 **聊天室**
- ⚡ 实时消息通讯
- 👥 群组聊天功能
- 📎 文件分享

</td>
<td width="33%">

#### 📖 **知识库**
- 🏗️ 结构化知识管理
- 🏷️ 知识分类和标签
- 🔍 搜索和收藏

#### 🔧 **开发工具**
- 🧪 API 测试工具
- 🐛 开发调试功能
- 📊 系统监控面板

#### 📝 **笔记系统**
- ⚡ 快速笔记记录
- 📚 课程笔记管理
- ⭐ 收藏夹功能

</td>
</tr>
</table>

## ⚙️ API 配置

<div align="center">

### 🔗 代理配置

</div>

项目支持 API 代理配置，在 `vite.config.js` 中设置：

```javascript
export default {
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
}
```

<div align="center">

### 🌍 环境变量

</div>

支持多环境配置，可创建以下文件：

| 文件 | 用途 | 示例 |
|------|------|------|
| `.env` | 通用配置 | `VITE_APP_TITLE=鸿庆书云` |
| `.env.development` | 开发环境 | `VITE_API_BASE_URL=http://localhost:8001` |
| `.env.production` | 生产环境 | `VITE_API_BASE_URL=https://api.example.com` |

## 🤝 贡献指南

<div align="center">

### 🌟 我们欢迎所有形式的贡献！

</div>

<table>
<tr>
<td width="50%">

#### 🚀 **快速开始贡献**

1. **🍴 Fork 项目**
2. **🌿 创建功能分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **💾 提交更改**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **📤 推送到分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **🔄 开启 Pull Request**

</td>
<td width="50%">

#### 📋 **代码规范**

- ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint) 代码检查
- ![Vue](https://img.shields.io/badge/Vue%203-4FC08D?style=flat-square&logo=vue.js) 组合式 API 规范
- **🏷️ 命名规范**
  - 组件: `PascalCase`
  - 文件: `kebab-case`
- **📝 提交信息**
  - 使用英文描述
  - 包含变更类型

</td>
</tr>
</table>

<div align="center">

### 🛠️ 开发流程

| 步骤 | 说明 | 命令 |
|------|------|------|
| **1️⃣ 环境准备** | 克隆并安装依赖 | `git clone` → `npm install` |
| **2️⃣ 功能开发** | 创建分支开发功能 | `git checkout -b feature/xxx` |
| **3️⃣ 代码检查** | 运行 ESLint 检查 | `npm run lint` |
| **4️⃣ 提交代码** | 提交并推送代码 | `git commit` → `git push` |
| **5️⃣ 发起 PR** | 创建 Pull Request | GitHub 页面操作 |

</div>

## 📝 版本历史

<div align="center">

### 🚀 发布时间线

</div>

<table>
<tr>
<td width="50%">

#### 🎉 **v1.0.0** `2025-08-09`

**✨ 重大更新**
- � 项目结构优化，移除构建复杂性
- 🌐 专注于 Web 开发，简化开发流程
- 💄 UI 界面设计和实现完善
- 📱 响应式布局适配优化

**🔧 技术改进**
- 🏗️ API 服务层架构搭建
- 📖 完善的文档和开发指南

</td>
<td width="50%">

#### 🌱 **v0.0.0** `2025-08-04`

**🎊 项目诞生**
- 🎉 项目初始化
- ✨ 基础功能模块开发
- 🔨 基础架构搭建
- 📚 初始文档编写

**🎯 里程碑**
- 🚀 第一次提交
- 📦 核心依赖配置
- 🏗️ 基础组件开发

</td>
</tr>
</table>

<div align="center">

### 📈 开发路线图

| 版本 | 计划功能 | 预计时间 |
|------|----------|----------|
| `v1.1.0` | 🔐 用户认证系统 | 2025-08-15 |
| `v1.2.0` | 💬 实时聊天功能 | 2025-08-30 |
| `v1.3.0` | 📊 数据可视化 | 2025-09-15 |
| `v2.0.0` | 🎯 移动端适配 | 2025-10-01 |

</div>

## 📄 许可证

<div align="center">

![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

本项目采用 **MIT 许可证** - 查看 [LICENSE](LICENSE) 文件了解详情

</div>

---

## 👥 团队

<div align="center">

### 🌟 核心贡献者

<table>
<tr>
<td align="center">
<img src="https://github.com/1fantasy1.png" width="100px;" alt=""/><br />
<sub><b>1fantasy1</b></sub><br />
<a href="https://github.com/1fantasy1" title="Code">💻</a>
<a href="#design-1fantasy1" title="Design">🎨</a>
<a href="#docs-1fantasy1" title="Documentation">📖</a>
</td>
</tr>
</table>

**感谢所有贡献者的付出！** ❤️

[查看所有贡献者](https://github.com/1fantasy1/vue/contributors)

</div>

---

## 📞 联系我们

<div align="center">

### 🤝 我们期待与您的交流

<table>
<tr>
<td align="center" width="33%">

#### 💬 **讨论交流**
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-181717?style=for-the-badge&logo=github)](https://github.com/1fantasy1/vue/discussions)

💡 **功能建议 & 技术讨论**

</td>
<td align="center" width="33%">

#### 🐛 **问题反馈**
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/1fantasy1/vue/issues)

🔧 **Bug 报告 & 功能请求**

</td>
<td align="center" width="33%">

#### � **商务合作**
[![Email](https://img.shields.io/badge/Email-Contact-blue?style=for-the-badge&logo=gmail)](mailto:contact@example.com)

🤝 **商务合作 & 技术支持**

</td>
</tr>
</table>

### 🌟 关注我们

[![Stars](https://img.shields.io/github/stars/1fantasy1/vue?style=social)](https://github.com/1fantasy1/vue/stargazers)
[![Forks](https://img.shields.io/github/forks/1fantasy1/vue?style=social)](https://github.com/1fantasy1/vue/network)
[![Watchers](https://img.shields.io/github/watchers/1fantasy1/vue?style=social)](https://github.com/1fantasy1/vue/watchers)

</div>

---

<div align="center">

### ⭐ 如果这个项目对您有帮助，请给我们一个 Star ⭐

**🙏 感谢您的支持！**

<sub>Built with ❤️ using Vue 3 + Vite + Element Plus</sub>

---

*© 2025 鸿庆书云. All rights reserved.*

</div>
