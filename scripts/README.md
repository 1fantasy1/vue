# 🛠️ 构建脚本使用指南

## 📋 可用脚本

### 🚀 快速开始
```bash
npm run setup           # 环境检查和项目初始化
npm run build:test      # 一键构建测试
```

### 🌐 Web 开发
```bash
npm run dev             # 启动开发服务器 (http://localhost:5173)
npm run build           # 构建 Web 应用 (输出到 dist/)
npm run preview         # 预览构建结果
```

### 🖥️ 桌面应用开发
```bash
npm run electron:dev    # Electron 开发模式
npm run build:win       # 构建 Windows 安装包
npm run build:linux     # 构建 Linux 安装包
npm run build:mac       # 构建 macOS 安装包
npm run build:all       # 构建所有桌面平台
```

### 📱 移动应用开发
```bash
npm run cap:sync        # 同步 Web 应用到 Capacitor
npm run cap:android     # 同步到 Android 项目
npm run cap:open        # 打开平台 IDE (Android Studio)
```

## 🔧 智能构建工具

### 基本用法
```bash
node scripts/build.cjs [platform] [type]
```

### 平台选项
- `web` - 构建 Web 应用
- `desktop` - 构建当前平台桌面应用
- `win` - 构建 Windows 桌面应用
- `linux` - 构建 Linux 桌面应用
- `mac` - 构建 macOS 桌面应用
- `all` - 构建所有桌面平台
- `android` - 同步 Android 项目
- `current` - 根据当前系统自动选择 (默认)

### 示例命令
```bash
# 构建特定平台
node scripts/build.cjs web
node scripts/build.cjs win
node scripts/build.cjs android

# 构建所有平台
node scripts/build.cjs all

# 显示帮助信息
node scripts/build.cjs --help
```

## 📦 输出目录结构

```
项目根目录/
├── dist/                  # Web 应用构建输出
│   ├── index.html
│   ├── assets/
│   └── ...
├── dist-electron/         # 桌面应用构建输出
│   ├── *.exe             # Windows 安装包
│   ├── *.AppImage        # Linux 便携版
│   ├── *.deb             # Linux Debian 包
│   ├── *.dmg             # macOS 安装包
│   └── ...
└── android/               # Android 项目 (自动生成)
    └── app/build/outputs/apk/
```

## 🎯 使用场景

### 开发阶段
1. **初始设置**: `npm run setup`
2. **Web 开发**: `npm run dev`
3. **桌面开发**: `npm run electron:dev`
4. **构建测试**: `npm run build:test`

### 发布阶段
1. **本地构建**: `node scripts/build.cjs all`
2. **测试安装包**: 验证 `dist-electron/` 中的文件
3. **创建版本**: `git tag v1.0.0`
4. **推送发布**: `git push origin v1.0.0`
5. **自动构建**: GitHub Actions 自动构建所有平台

### 移动端开发
1. **同步项目**: `npm run cap:android`
2. **打开 IDE**: `npm run cap:open android`
3. **Android Studio**: 进行原生开发和调试

## ❓ 常见问题

### Q: 构建失败怎么办？
A: 运行 `npm run build:test` 查看详细错误信息，确保所有依赖都已正确安装。

### Q: 如何只构建 Web 应用？
A: 使用 `npm run build` 或 `node scripts/build.cjs web`

### Q: 桌面应用图标怎么设置？
A: 将图标文件放在 `build/` 目录中：
- `icon.ico` (Windows)
- `icon.png` (Linux)
- `icon.icns` (macOS)

### Q: Android 开发需要什么环境？
A: 需要安装 Android Studio 和 Java 17+ 环境。

### Q: 如何自定义构建配置？
A: 编辑以下文件：
- `package.json` - npm scripts 和 electron-builder 配置
- `vite.config.js` - Vite 构建配置
- `capacitor.config.ts` - Capacitor 配置

## 🚀 自动化发布

### GitHub Actions 自动构建
推送标签即可触发自动构建：
```bash
git tag v1.0.0
git push origin v1.0.0
```

将自动构建：
- Windows 安装包 (.exe)
- Linux 安装包 (.AppImage, .deb)
- Android APK
- 自动创建 GitHub Release

---

更多详细信息请参考 [BUILD_GUIDE.md](../BUILD_GUIDE.md)
