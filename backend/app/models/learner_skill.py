from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid 

class LearnerSkill(Base):
    __tablename__ = 'learner_skills'

    learner_id = Column(String(36), ForeignKey('learners.id', ondelete='CASCADE'), primary_key=True)
    skill_id = Column(Integer, ForeignKey('skills.id'), primary_key=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    learner = relationship('Learner', back_populates='learner_skills')
    skill = relationship('Skill', back_populates='learner_skills') 

    def __repr__(self):
        return f"<LearnerSkill(learner_id={self.learner_id}, skill_id={self.skill_id})>"