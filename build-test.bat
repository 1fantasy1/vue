@echo off
chcp 65001 >nul 2>&1
echo.
echo 🚀 鸿庆书云 - 一键构建测试
echo ============================
echo.

echo � 正在运行智能构建系统...
node scripts/build-test.js

if %errorlevel% equ 0 (
    echo.
    echo 🎉 构建测试完成！按任意键退出...
) else (
    echo.
    echo 💥 构建测试失败！请查看上方错误信息。
    echo 按任意键退出...
)

pause >nul
