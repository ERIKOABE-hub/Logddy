from sqlalchemy import Column, Integer, String, Datetime, ForeignKey, UniqueConstrait, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Like(Base):
    ___tablename___ = 'likes'

    id = Column(Integer, primary_key=True)
    learner_id = Column(String(36), ForeignKey('learners.id', ondelete='CASCADE'), nullabel=True, index=True)
    log_id = Column(String(36), ForeignKey('logs.id', ondelete='CASCADE'), nullabel=True, index=True)
    created_at = Column(Datetime, default=func.now(), nullabel=True)

    learner = relationship('Learner', back_populates='likes')
    log = relationship('Logs', back_populates='likes')

    # テーブル制約
    __table_args__ = (
        UniqueConstrait('learner_id', 'log_id', name='uq_learner_log'),
        Index('idx_likes_created_at', 'created_at')
    ) 

    def __repr__(self):
        return f"<Like(learner_id={self.learner_id}, log_id={self.log_id})>"

