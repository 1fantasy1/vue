from datetime import timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..core.deps import get_current_user, get_current_superuser
from ..core.security import create_access_token
from . import crud, schemas
from .models import User

router = APIRouter()


@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user


@router.put("/me", response_model=schemas.UserResponse)
async def update_users_me(
    user_update: schemas.UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新当前用户信息"""
    updated_user = crud.update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return updated_user


@router.get("/{user_id}", response_model=schemas.UserResponse)
async def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取指定用户信息"""
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return user


@router.get("/", response_model=List[schemas.UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """获取用户列表（仅管理员）"""
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=schemas.UserResponse)
async def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """创建新用户（仅管理员）"""
    # 检查用户名是否已存在
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 检查邮箱是否已存在
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已存在"
        )
    
    return crud.create_user(db, user)


@router.put("/{user_id}", response_model=schemas.UserResponse)
async def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """更新用户信息（仅管理员）"""
    updated_user = crud.update_user(db, user_id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return updated_user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser)
):
    """删除用户（仅管理员）"""
    if not crud.delete_user(db, user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return {"message": "用户删除成功"}
