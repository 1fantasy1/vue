@echo off
echo 🚀 开始跨平台构建测试...

echo 📦 Step 1: 安装依赖
call npm install
if %errorlevel% neq 0 goto :error

echo 🌐 Step 2: 构建Web应用
call npm run build
if %errorlevel% neq 0 goto :error

echo 🖥️ Step 3: 构建Windows安装包
call npm run electron:build-win
if %errorlevel% neq 0 goto :error

echo 📱 Step 4: 同步Android项目
call npx cap sync android
if %errorlevel% neq 0 goto :error

echo ✅ 构建测试完成！
echo.
echo 📂 生成的文件:
echo   Windows: dist-electron\鸿庆书云 Setup 1.0.0.exe
echo   Android: android\app\build\outputs\apk\debug\ (需要Android Studio或Gradle)
echo.
echo 🎯 下一步操作:
echo 1. 提交所有更改到Git
echo 2. 创建版本标签: git tag v1.0.0
echo 3. 推送到GitHub: git push origin main ^&^& git push origin v1.0.0
echo 4. GitHub Actions 将自动构建所有平台安装包
goto :end

:error
echo ❌ 构建过程中出现错误！
exit /b 1

:end
pause
