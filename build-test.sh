#!/bin/bash

echo ""
echo "🚀 鸿庆书云 - 一键构建测试"
echo "============================"
echo ""

echo "� 正在运行智能构建系统..."
node scripts/build-test.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 构建测试完成！"
else
    echo ""
    echo "💥 构建测试失败！请查看上方错误信息。"
    exit 1
fi
