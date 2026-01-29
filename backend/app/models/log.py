from sqlalchemy import Column, Integer, String, Text, Datetime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Log(Base):
    __tablename__ = 'logs'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    learner_id = Column(String(36), ForeignKey('learners.id'), nullabel=False, index=True)
    title = Column(String(100), nullabel=False)
    content = Column(Text, nullabel= False)
    likes_count = Column(Integer, default=0, nullabel=False)
    created_at = Column(Datetime, default=func.now(), nullabel=False, index=True)
    updated_at = Column(Datetime, onupdate=func.now(), nullabel=False)
    deleted_at = Column(Datetime, nullabel=True, index=True)

    learner = relationship('Learners', back_populates='logs')
    likes = relationship('Likes', back_populates='log', cascade='all, delete-orphan')
    images = relationship('Images', back_populates='log', cascade='all, delete-orphan') 
    # cascade='all, delete-orphan': このログが削除されたら関連するいいねも削除
    # delete-orphan: 関連が切れた（親を失った）これコードを削除

    def __repr__(self):
        return f'<Log(id={self.id}, title={self.title})>'