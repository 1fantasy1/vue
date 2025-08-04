#!/bin/bash

echo "🚀 启动 Python + FastAPI + PostgreSQL 后端服务"

# 检查是否在后端目录
if [ ! -f "requirements.txt" ]; then
    echo "❌ 请在后端目录中运行此脚本"
    exit 1
fi

# 创建虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo "📦 创建 Python 虚拟环境..."
    python -m venv venv
fi

# 激活虚拟环境
echo "🔄 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "📥 安装依赖包..."
pip install -r requirements.txt

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "📋 复制环境变量模板..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件并配置您的数据库连接信息"
fi

# 启动数据库（如果使用 Docker）
echo "🐳 启动数据库服务..."
docker-compose up -d postgres redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 5

# 运行数据库迁移
echo "🗄️  运行数据库迁移..."
alembic upgrade head

# 启动开发服务器
echo "🌟 启动 FastAPI 开发服务器..."
echo "📚 API 文档将在 http://localhost:8000/docs 可用"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
