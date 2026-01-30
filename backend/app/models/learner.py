from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Learner(Base):
    __tablename__ = 'learners'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    firebase_uid = Column(String(128), nullable=False, unique=True, index=True)
    name = Column(String(100), nullable=False)
    introduction = Column(Text, nullable=True)
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime, nullable=True, index=True)

    roles = relationship('Role', back_populates='learners')
    learner_skills = relationship('LearnerSkill', back_populates='learner')
    logs = relationship('Log', back_populates='learner')
    likes = relationship('Like', back_populates='learner')

    def __repr__(self):
        return f'<Learner(id={self.id}, name={self.name})>'

