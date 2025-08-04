from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .database import init_db

# 导入路由
from .auth.router import router as auth_router
from .users.router import router as users_router
from .courses.router import router as courses_router
from .notes.router import router as notes_router
from .knowledge.router import router as knowledge_router
from .projects.router import router as projects_router
from .chat.router import router as chat_router

# 创建 FastAPI 应用
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="鸿庆书云 - 现代化教育协作平台 API",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# 添加中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not settings.debug:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # 生产环境中应该设置具体的主机
    )

# 静态文件服务
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# 注册路由
app.include_router(auth_router, prefix="/api/auth", tags=["认证"])
app.include_router(users_router, prefix="/api/users", tags=["用户"])
app.include_router(courses_router, prefix="/api/courses", tags=["课程"])
app.include_router(notes_router, prefix="/api/notes", tags=["笔记"])
app.include_router(knowledge_router, prefix="/api/knowledge", tags=["知识库"])
app.include_router(projects_router, prefix="/api/projects", tags=["项目"])
app.include_router(chat_router, prefix="/api/chat", tags=["聊天"])


@app.on_event("startup")
async def startup_event():
    """应用启动时执行"""
    # 初始化数据库
    init_db()
    print(f"🚀 {settings.app_name} v{settings.app_version} 启动成功!")
    print(f"📚 API 文档: http://localhost:8000/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时执行"""
    print("👋 应用正在关闭...")


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": f"欢迎使用 {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.app_version
    }
