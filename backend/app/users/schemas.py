from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# 用户基础模式
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    role: str = "student"


# 用户创建模式
class UserCreate(UserBase):
    password: str


# 用户更新模式
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None


# 用户响应模式
class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# 用户登录模式
class UserLogin(BaseModel):
    username: str  # 可以是用户名或邮箱
    password: str


# Token 模式
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Token 数据模式
class TokenData(BaseModel):
    user_id: Optional[str] = None
