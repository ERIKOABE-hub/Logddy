from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(100), nullabel=False, unique=True)
    created_at = Column(DateTime, default=func.now(), nullabel=False)

    learners = relationship('Learner', back_populates='role')

    def __repr__(self):
        return f'<Role(id={self.id}, name={self.role_name})>'