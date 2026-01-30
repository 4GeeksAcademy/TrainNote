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

from datetime import datetime

class BikeModel(db.Model):
    """Catálogo de modelos de bicicletas disponibles"""
    __tablename__ = "bike_models"
    
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(120), nullable=False)
    model_name = db.Column(db.String(150), nullable=False)
    model_year = db.Column(db.Integer, nullable=True)
    bike_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model_name": self.model_name,
            "model_year": self.model_year,
            "bike_type": self.bike_type,
            "description": self.description,
            "full_name": f"{self.brand} {self.model_name} ({self.model_year})" if self.model_year else f"{self.brand} {self.model_name}"
        }

class Bike(db.Model):
    __tablename__ = "bikes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    
    # NUEVA: Referencia al modelo del catálogo
    bike_model_id = db.Column(db.Integer, db.ForeignKey("bike_models.id"), nullable=True)
    
    name = db.Column(db.String(120), nullable=False)
    model = db.Column(db.String(120), nullable=True)  # Mantener por compatibilidad
    specs = db.Column(db.Text, nullable=True)
    
    image_url = db.Column(db.String(500), nullable=True)
    video_url = db.Column(db.String(500), nullable=True)
    
    km_total = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=False)
    
    # Relaciones
    parts = db.relationship("BikePart", backref="bike", cascade="all, delete-orphan")
    bike_model = db.relationship("BikeModel", backref="bikes")  # NUEVA
    
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
            "bike_model_id": self.bike_model_id,  # NUEVO
            "bike_model": self.bike_model.serialize() if self.bike_model else None,  # NUEVO
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