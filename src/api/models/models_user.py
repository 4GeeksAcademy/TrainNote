from api.database.db import db
from sqlalchemy import String, Boolean, ForeignKey, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    img: Mapped[str] = mapped_column(Text, nullable=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str] = mapped_column(String(255), nullable=True)
    date_birth: Mapped[str] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    foro = relationship('Foro')
    following = relationship("Follow", cascade="all, delete-orphan")
    post = relationship('Post', back_populates="user")
    tag = relationship('Tag_select')
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": str(self.created_at),
        }

    def serialize_all(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "img": self.img,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "date_birth": self.date_birth,
            "description": self.description,
            "updated_at": str(self.updated_at)
        }
 