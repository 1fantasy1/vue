# Python + FastAPI + PostgreSQL 完整使用指南

## 🚀 快速开始

### 1. 环境准备

**必需软件：**
- Python 3.11+
- PostgreSQL 14+
- Node.js 18+ (前端)
- Docker (可选，用于简化部署)

**Windows 用户：**
```bash
# 在后端目录运行
.\start.bat
```

**Linux/Mac 用户：**
```bash
# 在后端目录运行
chmod +x start.sh
./start.sh
```

### 2. 手动安装步骤

#### 后端设置
```bash
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 启动 PostgreSQL（如果使用 Docker）
docker-compose up -d postgres redis

# 运行数据库迁移
alembic upgrade head

# 启动开发服务器
uvicorn app.main:app --reload
```

#### 前端设置
```bash
cd ..  # 回到项目根目录

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🎯 核心功能

### 1. 用户认证系统
- JWT 令牌认证
- 用户注册和登录
- 角色权限管理（学生、老师、管理员）

### 2. 课程管理
- 课程创建和编辑
- 学生选课
- 课程状态管理

### 3. 笔记系统
- 个人笔记管理
- 笔记搜索和分类
- 富文本编辑支持

### 4. 智能知识库（AI 功能）
- 文档上传和处理
- AI 智能问答
- 语义搜索
- 文档摘要生成

### 5. 实时聊天
- WebSocket 实时通信
- 聊天室管理
- 消息历史

## 🛠️ API 使用示例

### 认证 API
```javascript
// 用户注册
const response = await userService.register({
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  role: 'student'
})

// 用户登录
const loginResponse = await userService.login({
  username: 'testuser',
  password: 'password123'
})
```

### 知识库 AI API
```javascript
// 上传文档
const document = await knowledgeService.uploadDocument(file, {
  title: '课程资料',
  description: '第一章内容'
})

// AI 问答
const answer = await knowledgeService.askQuestion(
  '什么是机器学习？',
  { course_id: 1 }
)
```

### 课程管理 API
```javascript
// 创建课程
const course = await courseService.createCourse({
  title: '机器学习基础',
  description: '介绍机器学习的基本概念',
  content: '课程详细内容...'
})
```

## 🔧 配置选项

### 环境变量说明
```env
# 数据库配置
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# JWT 配置
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI 服务配置
OPENAI_API_KEY=your-openai-key  # 可选
```

### AI 功能配置
AI 功能支持两种模式：

1. **完整 AI 模式**（需要 OpenAI API Key）
   - 智能问答
   - 文档摘要
   - 关键词提取

2. **基础模式**（无需 API Key）
   - 简单文本搜索
   - 基础摘要
   - 关键词提取

## 📊 数据库架构

### 主要数据表
- `users` - 用户信息
- `courses` - 课程信息
- `notes` - 笔记数据
- `documents` - 知识库文档
- `qa_history` - 问答历史
- `chat_rooms` - 聊天室
- `chat_messages` - 聊天消息

### 关系说明
```
User 1:N Course (instructor)
User N:M Course (students)
User 1:N Note
User 1:N Document
User 1:N QAHistory
```

## 🚀 部署指南

### Docker 部署（推荐）
```bash
# 一键启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend
```

### 生产环境部署
```bash
# 安装生产服务器
pip install gunicorn

# 启动生产服务器
gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

## 🔍 监控和调试

### API 文档
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 日志配置
```python
import logging
logging.basicConfig(level=logging.INFO)
```

### 性能监控
- 数据库查询优化
- Redis 缓存配置
- API 响应时间监控

## 🛡️ 安全最佳实践

1. **认证安全**
   - JWT 令牌过期时间设置
   - 密码强度验证
   - 防止暴力破解

2. **数据安全**
   - SQL 注入防护
   - XSS 攻击防护
   - CORS 配置

3. **文件安全**
   - 文件类型验证
   - 文件大小限制
   - 恶意文件检测

## 🤝 开发团队协作

### 代码规范
```bash
# 代码格式化
black app/
isort app/

# 代码检查
flake8 app/
```

### 测试
```bash
# 运行测试
pytest

# 测试覆盖率
pytest --cov=app
```

## ❓ 常见问题

### Q: 数据库连接失败？
A: 检查 PostgreSQL 是否已启动，环境变量是否正确配置。

### Q: AI 功能不可用？
A: 检查是否安装了 AI 相关依赖包，或配置了 OpenAI API Key。

### Q: 前端无法连接后端？
A: 检查 CORS 配置和前端环境变量中的 API URL。

## 🔄 更新升级

### 数据库迁移
```bash
# 创建新迁移
alembic revision --autogenerate -m "描述"

# 应用迁移
alembic upgrade head
```

### 依赖更新
```bash
# 更新所有依赖
pip install --upgrade -r requirements.txt
```
