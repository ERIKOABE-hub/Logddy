from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Log(Base):
    __tablename__ = 'logs'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    learner_id = Column(String(36), ForeignKey('learners.id'), nullable=False, index=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable= False)
    likes_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime, nullable=True, index=True)

    learner = relationship('Learner', back_populates='logs')
    likes = relationship('Like', back_populates='log', cascade='all, delete-orphan')
    images = relationship('Image', back_populates='log', cascade='all, delete-orphan') 
    # cascade='all, delete-orphan': このログが削除されたら関連するいいねも削除
    # delete-orphan: 関連が切れた（親を失った）これコードを削除

    def __repr__(self):
        return f'<Log(id={self.id}, title={self.title})>'