# 🚀 鸿庆书云 - 构建指南

## 🎯 快速开始

### 一键构建测试
```bash
# Windows
npm run build:test

# 或者使用传统脚本
.\build-test.bat
```

### 智能构建系统
```bash
# 构建当前平台
node scripts/build.cjs

# 构建特定平台
node scripts/build.cjs web      # Web 应用
node scripts/build.cjs desktop  # 当前系统桌面应用
node scripts/build.cjs android  # Android 项目
node scripts/build.cjs all      # 所有平台
```

## 📋 构建命令速查表

| 用途 | 命令 | 输出位置 |
|------|------|----------|
| Web 开发 | `npm run dev` | http://localhost:5173 |
| Web 构建 | `npm run build` | `dist/` |
| Windows 桌面 | `npm run build:win` | `dist-electron/*.exe` |
| Linux 桌面 | `npm run build:linux` | `dist-electron/*.AppImage` |
| macOS 桌面 | `npm run build:mac` | `dist-electron/*.dmg` |
| 所有桌面平台 | `npm run build:all` | `dist-electron/` |
| Android 同步 | `npm run cap:android` | `android/` |
| Electron 开发 | `npm run electron:dev` | 开发模式 |

## 🛠️ 开发环境

### 前置要求
- Node.js 18+ 或 20+
- npm 或 yarn
- (可选) Android Studio (用于 Android 开发)

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# Web 开发
npm run dev

# Electron 开发 (桌面应用)
npm run electron:dev
```

## 📦 构建流程

### 1. Web 应用构建
```bash
npm run build
```
- 输出: `dist/` 目录
- 用于: 部署到服务器或作为 Electron/Capacitor 的资源

### 2. 桌面应用构建
```bash
# 当前平台
npm run build:win     # Windows
npm run build:linux   # Linux  
npm run build:mac     # macOS

# 所有平台
npm run build:all
```
- 输出: `dist-electron/` 目录
- 包含安装包和便携版

### 3. 移动应用开发
```bash
# 同步到 Android 项目
npm run cap:android

# 打开 Android Studio
npm run cap:open android
```

## 🚀 发布流程

### 本地发布
1. 更新版本号 (package.json)
2. 构建所有平台: `npm run build:all`
3. 测试安装包
4. 提交代码

### 自动发布 (GitHub Actions)
1. 创建版本标签:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. GitHub Actions 自动构建所有平台
3. 自动创建 GitHub Release

## � 项目结构

```
鸿庆书云/
├── src/                    # Vue 源代码
├── electron/               # Electron 主进程
├── scripts/                # 构建脚本
│   ├── build.js           # 智能构建工具
│   └── build-test.js      # 构建测试脚本
├── dist/                   # Web 构建输出
├── dist-electron/          # 桌面应用构建输出
├── android/                # Android 项目 (自动生成)
├── build/                  # 应用图标和资源
└── .github/workflows/      # CI/CD 配置
```

## ❓ 常见问题

### Q: 构建失败怎么办？
A: 运行 `npm run build:test` 进行诊断，查看具体错误信息。

### Q: 如何只构建 Web 应用？
A: 使用 `npm run build` 或 `node scripts/build.js web`

### Q: 如何添加新的构建平台？
A: 修改 `scripts/build.cjs` 中的 `buildConfigs` 配置。

### Q: Android 构建需要什么？
A: 需要安装 Android Studio 和配置 Java 17 环境。

## 🎨 自定义配置

### 修改应用图标
将图标文件放在 `build/` 目录:
- `icon.ico` - Windows
- `icon.png` - Linux  
- `icon.icns` - macOS

### 修改构建配置
编辑 `package.json` 中的 `build` 字段或 `electron-builder` 配置。

---

📞 **需要帮助?** 查看项目 Issues 或联系开发团队
