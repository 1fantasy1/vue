# 跨平台构建指南

## 概述

这个项目现在支持构建为以下平台的安装包：
- **Windows**: .exe 安装程序
- **Linux**: AppImage 和 .deb 包
- **Android**: APK 文件

## 🎯 快速开始

### Windows用户
```bash
# 运行自动化测试脚本
.\build-test.bat
```

### Linux/macOS用户
```bash
# 运行自动化测试脚本
chmod +x build-test.sh
./build-test.sh
```

## 本地开发

### 安装依赖

```bash
npm install
```

### Web 开发模式

```bash
npm run dev
```

### Electron 开发模式

```bash
npm run electron:dev
```

## 本地构建

### 构建 Web 应用

```bash
npm run build
```

### 构建 Windows 安装包

```bash
npm run electron:build-win
```
生成文件: `dist-electron/创新协作平台 Setup 1.0.0.exe`

### 构建 Linux 安装包

```bash
npm run electron:build-linux
```

### 构建所有平台

```bash
npm run dist
```

## Android 构建

### 同步Web资源到Android项目

```bash
npm run build
npx cap sync android
```

### 使用Android Studio构建

```bash
# 在Android Studio中打开项目
npx cap open android
```

### 使用命令行构建APK

```bash
cd android
./gradlew assembleDebug  # Linux/macOS
gradlew.bat assembleDebug  # Windows
```

生成文件: `android/app/build/outputs/apk/debug/app-debug.apk`

## 自动构建 (GitHub Actions)

### 🏷️ 触发构建

1. **标签构建**: 推送形如 `v1.0.0` 的标签将触发完整构建并创建 GitHub Release
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **手动构建**: 在 GitHub Actions 页面手动触发工作流

### 📦 构建产物

构建完成后，你可以在以下位置找到安装包：
- GitHub Actions 的 Artifacts 部分（保留7天）
- GitHub Releases（如果是标签构建）

## 📁 项目结构

```
project/
├── electron/           # Electron主进程文件
│   ├── main.js         # 主进程入口
│   └── preload.js      # 预加载脚本
├── android/            # Android项目文件（自动生成）
├── build/              # 应用图标
│   ├── icon.png        # 通用图标
│   ├── icon_backup.ico # Windows图标（备份）
│   └── icon.icns       # macOS图标
├── dist/               # Web构建输出
├── dist-electron/      # Electron构建输出
└── .github/workflows/  # GitHub Actions配置
```

## 🎨 图标设置

将应用图标放置在 `build/` 目录中：
- `icon.ico` - Windows 图标（需要256x256或更高分辨率）
- `icon.png` - Linux 图标
- `icon.icns` - macOS 图标

推荐图标尺寸：512x512 像素

**注意**: 当前由于图标分辨率问题，暂时禁用了自定义图标。使用默认图标。

## 🚀 发布新版本

1. 更新 `package.json` 中的版本号
2. 提交更改
3. 创建并推送标签：
   ```bash
   git add .
   git commit -m "发布 v1.0.0"
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```
4. GitHub Actions 将自动构建并创建发布

## 📊 构建状态检查

- ✅ Web应用构建: `npm run build`
- ✅ Windows安装包: `npm run electron:build-win`  
- ✅ Android项目同步: `npx cap sync android`
- ⏳ Linux构建: 需要Linux环境
- ⏳ Android APK: 需要Android SDK

## 🔧 故障排除

### Electron 构建问题
- 确保已安装所有 devDependencies
- 检查 Node.js 版本兼容性（推荐18.x或20.x）
- 图标文件分辨率必须>=256x256

### Android 构建问题
- 确保 Java 版本为 17
- 检查 Android SDK 配置
- 查看 Capacitor 文档获取更多帮助

### 网络问题
- 如果下载缓慢，可以使用国内镜像
- electron-builder 首次运行会下载较大文件

## 📞 技术支持

- [Electron官方文档](https://www.electronjs.org/docs)
- [Capacitor官方文档](https://capacitorjs.com/docs)
- [GitHub Actions文档](https://docs.github.com/actions)
