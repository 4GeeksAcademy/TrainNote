from api.database.db import db
from sqlalchemy import String, Boolean, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime



class Foro(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    img: Mapped[str] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    user_id = mapped_column(ForeignKey("user.id"), nullable=False)
    tag = relationship('Tag_select')
    post = relationship('Post')
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


    def serialize_foro(self):
        return {
        "id": self.id,
        "title": self.title,
        "img": self.img,
        "description": self.description,
        "user_id": self.user_id,
        "created_at": str(self.created_at),
        "updated_at": str(self. updated_at)
        
    }