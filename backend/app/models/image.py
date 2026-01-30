from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Image(Base):
    __tablename__ = 'images'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    log_id = Column(String(36), ForeignKey('logs.id', ondelete='CASCADE'), nullable=False, index=True)
    image_url = Column(Text, nullable=True)
    image_storage_path = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    log = relationship('Log', back_populates='images')

    def __repr__(self):
        return f"<Image(id={self.id[:8]}, log_id={self.log_id[:8]})>"