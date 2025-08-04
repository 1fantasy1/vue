from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # 应用基本设置
    app_name: str = "鸿庆书云 API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # 数据库设置
    database_url: str
    database_test_url: str = ""
    
    # JWT 设置
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS 设置
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Redis 设置
    redis_url: str = "redis://localhost:6379/0"
    
    # 文件上传设置
    max_file_size: int = 10485760  # 10MB
    upload_dir: str = "./uploads"
    
    # AI 服务设置
    openai_api_key: str = ""
    azure_openai_endpoint: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 创建全局设置实例
settings = Settings()

# 确保上传目录存在
os.makedirs(settings.upload_dir, exist_ok=True)
