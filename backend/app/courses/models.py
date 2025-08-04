from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum

from ..database import Base

# 课程状态枚举
class CourseStatus(PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


# 学生-课程关联表
course_students = Table(
    "course_students",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("student_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("enrolled_at", DateTime(timezone=True), server_default=func.now())
)


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    content = Column(Text)
    
    # 讲师信息
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 课程状态
    status = Column(Enum(CourseStatus), default=CourseStatus.DRAFT)
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    instructor = relationship("User", foreign_keys=[instructor_id])
    students = relationship("User", secondary=course_students, back_populates="enrolled_courses")
    
    def __repr__(self):
        return f"<Course(id={self.id}, title='{self.title}')>"
