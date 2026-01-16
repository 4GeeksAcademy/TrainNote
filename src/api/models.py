from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    bikes = db.relationship("Bike", backref="user", cascade="all, delete-orphan")

class Bike(db.Model):
    __tablename__ = "bikes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    name = db.Column(db.String(120), nullable=False)   # Nombre que ves en la card
    model = db.Column(db.String(120), nullable=True)   # Modelo comercial
    specs = db.Column(db.Text, nullable=True)          # Texto libre

    image_url = db.Column(db.String(500), nullable=True)
    video_url = db.Column(db.String(500), nullable=True)

    km_total = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=False)

    parts = db.relationship("BikePart", backref="bike", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "model": self.model,
            "specs": self.specs,
            "image_url": self.image_url,
            "video_url": self.video_url,
            "km_total": self.km_total,
            "is_active": self.is_active,
            "parts": [p.serialize() for p in self.parts],
        }


class BikePart(db.Model):
    __tablename__ = "bike_parts"
    id = db.Column(db.Integer, primary_key=True)
    bike_id = db.Column(db.Integer, db.ForeignKey("bikes.id"), nullable=False)

    part_name = db.Column(db.String(80), nullable=False)  # "Llantas", "Frenos", etc.
    brand = db.Column(db.String(120), nullable=True)
    model = db.Column(db.String(120), nullable=True)

    km_life = db.Column(db.Integer, default=0)     # vida útil
    km_current = db.Column(db.Integer, default=0)  # km actuales
    wear_percentage = db.Column(db.Integer, default=0)

    image_url = db.Column(db.String(500), nullable=True)
    notes = db.Column(db.Text, nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "part_name": self.part_name,
            "brand": self.brand,
            "model": self.model,
            "km_life": self.km_life,
            "km_current": self.km_current,
            "wear_percentage": self.wear_percentage,
            "image_url": self.image_url,
            "notes": self.notes,
        }