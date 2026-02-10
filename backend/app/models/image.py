import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    log_id = Column(
        String(36),
        ForeignKey("logs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    image_url = Column(Text, nullable=True)
    image_storage_path = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    log = relationship("Log", back_populates="images")

    def __repr__(self):
        return f"<Image(id={self.id[:8]}, log_id={self.log_id[:8]})>"
