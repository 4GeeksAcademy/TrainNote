from api.database.db import db
from sqlalchemy import String, Boolean, Text,  ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime




class Post (db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    content: Mapped[str] = mapped_column(String(255),nullable=False)
    img: Mapped[str] = mapped_column(Text,nullable=True)
    user_id = mapped_column(ForeignKey("user.id"), nullable=False)
    user = relationship('User', back_populates="post")
    foro_id: Mapped[int] = mapped_column(ForeignKey("foro.id"), nullable=True)
    foro = relationship("Foro", back_populates="post")
    comment = relationship('Comment')
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


    def serialize_post(self):
        return {
        "id": self.id,
        "title": self.title,
        "content": self.content,
        "img": self.img,
        "user_id": self.user_id,
        "foro_id": self.foro_id,
        "created_at": self.created_at.isoformat() if self.created_at else None,
        "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        "user": {"name":self.user.username, "img_user": self.user.img}
    }