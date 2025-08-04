# Python + FastAPI + PostgreSQL 后端服务

## 项目结构
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 应用入口
│   ├── config.py              # 配置文件
│   ├── database.py            # 数据库连接
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── router.py          # 认证路由
│   │   ├── models.py          # 认证模型
│   │   ├── schemas.py         # Pydantic 模式
│   │   └── utils.py           # 认证工具
│   ├── users/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── crud.py
│   ├── courses/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── crud.py
│   ├── notes/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── crud.py
│   ├── knowledge/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   └── ai_service.py      # AI 问答服务
│   ├── projects/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── crud.py
│   ├── chat/
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   └── websocket.py       # WebSocket 处理
│   └── core/
│       ├── __init__.py
│       ├── security.py        # 安全相关
│       ├── deps.py           # 依赖注入
│       └── middleware.py     # 中间件
├── requirements.txt
├── .env
├── .env.example
├── alembic/                  # 数据库迁移
├── alembic.ini
└── README.md
```

## 安装和配置

### 1. 创建虚拟环境
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. 安装依赖
```bash
pip install -r requirements.txt
```

### 3. 配置环境变量
复制 `.env.example` 到 `.env` 并配置：
```env
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/vue_app
DATABASE_TEST_URL=postgresql://username:password@localhost:5432/vue_app_test

# JWT 配置
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 应用配置
APP_NAME=鸿庆书云 API
APP_VERSION=1.0.0
DEBUG=True
ALLOWED_HOSTS=["localhost", "127.0.0.1"]

# CORS 配置
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# AI 服务配置（可选）
OPENAI_API_KEY=your-openai-api-key
AZURE_OPENAI_ENDPOINT=your-azure-endpoint
```

### 4. 数据库设置
```bash
# 安装 PostgreSQL（如果还没有）
# 创建数据库
createdb vue_app

# 运行数据库迁移
alembic upgrade head
```

### 5. 启动开发服务器
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API 文档
启动服务器后，访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 部署
### Docker 部署
```bash
docker-compose up -d
```

### 生产环境
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
