from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    file_type = Column(String(50))
    
    # 文档内容和向量
    content = Column(Text)
    summary = Column(Text)
    keywords = Column(Text)  # JSON 格式存储关键词
    
    # 上传者信息
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 状态
    is_processed = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    uploader = relationship("User")
    
    def __repr__(self):
        return f"<Document(id={self.id}, title='{self.title}')>"


class QAHistory(Base):
    __tablename__ = "qa_history"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False, index=True)
    answer = Column(Text, nullable=False)
    context = Column(Text)  # 相关文档片段
    
    # 用户信息
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 评分和反馈
    rating = Column(Integer)  # 1-5 星评级
    feedback = Column(Text)
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    user = relationship("User")
    
    def __repr__(self):
        return f"<QAHistory(id={self.id}, question='{self.question[:50]}...')>"
