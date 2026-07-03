from api.database.db import db
from sqlalchemy import String, Boolean, Text,  ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Follow(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id = mapped_column(ForeignKey ("user.id"), nullable=False)
    foro_id = mapped_column(ForeignKey ("foro.id"), nullable=False)
    user = relationship("User")
    foro = relationship("Foro")


    def serialize_follow(self):
        return{
            "id": self.id,
            "user_id": self.user_id,
            "foro_id": self.foro_id
        }