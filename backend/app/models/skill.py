from sqlalchemy import Column, Integer, String, Datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Skill(Base):
    ___tablename___ = 'skills'

    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_name = Column(String(100), nullabel=False, unique=True)
    created_at = Column(Datetime, default=func.now(), nulllabel=False)

    learner_skills = relationship('LearnerSkill', back_popukates='skill')

    def __repr__(self):
        return f'<Skill(id={self.id}, skill_name={self.skill_name})'