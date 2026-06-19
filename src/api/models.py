from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    client_profile: Mapped["ClientProfile"] = relationship(
        "ClientProfile",
        back_populates="user",
        uselist=False
    )

    business_profile: Mapped["BusinessProfile"] = relationship(
        "BusinessProfile",
        back_populates="user",
        uselist=False
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active
        }


class ClientProfile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)

    user: Mapped["User"] = relationship(
        "User", back_populates="client_profile")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "phone": self.phone
        }


class BusinessProfile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), unique=True, nullable=False)

    business_name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)

    country: Mapped[str] = mapped_column(String(80), nullable=False)
    province: Mapped[str] = mapped_column(String(80), nullable=False)
    city: Mapped[str] = mapped_column(String(80), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    address: Mapped[str] = mapped_column(String(180), nullable=False)

    user: Mapped["User"] = relationship(
        "User", back_populates="business_profile")

    services: Mapped[list["Service"]] = relationship(
        "Service",
        back_populates="business"
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "business_name": self.business_name,
            "phone": self.phone,
            "category": self.category,
            "country": self.country,
            "province": self.province,
            "city": self.city,
            "postal_code": self.postal_code,
            "address": self.address
        }


class Service(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    business_id: Mapped[int] = mapped_column(
        ForeignKey("business_profile.id"),
        nullable=False
    )

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(nullable=False)
    status: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    business: Mapped["BusinessProfile"] = relationship(
        "BusinessProfile",
        back_populates="services"
    )

    def serialize(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "duration_minutes": self.duration_minutes,
            "status": self.status,
        }


class Reservas(db.Model):
    __tablename__ = 'reservas'
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("client_profile.id"), nullable=False)
    service_id: Mapped[int] = mapped_column(ForeignKey("service.id"), nullable=False)

    # Campos propios de una reserva
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="pendiente")
    notes: Mapped[str] = mapped_column(String(255), nullable=True)


    client: Mapped["ClientProfile"] = relationship("ClientProfile")
    service: Mapped["Service"] = relationship("Service")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "service_id": self.service_id,
            # Convierte la fecha a string legible para el frontend
            "booking_date": self.booking_date.isoformat(),
            "status": self.status,
            "notes": self.notes,
            "service_detail": {
            "name": self.service.name,
            "price": str(self.service.price),
            "business_id": self.service.business_id
            } if self.service else None,
            "client_name": self.client.name if self.client else None
        }
