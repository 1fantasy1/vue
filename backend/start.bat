@echo off
echo 🚀 启动 Python + FastAPI + PostgreSQL 后端服务

REM 检查是否在后端目录
if not exist "requirements.txt" (
    echo ❌ 请在后端目录中运行此脚本
    pause
    exit /b 1
)

REM 创建虚拟环境（如果不存在）
if not exist "venv" (
    echo 📦 创建 Python 虚拟环境...
    python -m venv venv
)

REM 激活虚拟环境
echo 🔄 激活虚拟环境...
call venv\Scripts\activate.bat

REM 安装依赖
echo 📥 安装依赖包...
pip install -r requirements.txt

REM 检查环境变量文件
if not exist ".env" (
    echo 📋 复制环境变量模板...
    copy .env.example .env
    echo ⚠️  请编辑 .env 文件并配置您的数据库连接信息
)

REM 启动数据库（如果使用 Docker）
echo 🐳 启动数据库服务...
docker-compose up -d postgres redis

REM 等待数据库启动
echo ⏳ 等待数据库启动...
timeout /t 5 /nobreak

REM 运行数据库迁移
echo 🗄️  运行数据库迁移...
alembic upgrade head

REM 启动开发服务器
echo 🌟 启动 FastAPI 开发服务器...
echo 📚 API 文档将在 http://localhost:8000/docs 可用
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
