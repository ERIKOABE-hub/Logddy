from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Skill(Base):
    ___tablename___ = 'skills'

    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, default=func.now(), nulllable=False)

    learner_skills = relationship('LearnerSkills', back_populates='skill')

    def __repr__(self):
        return f'<Skill(id={self.id}, skill_name={self.skill_name})>'