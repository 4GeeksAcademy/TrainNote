import enum
from datetime import date, datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Numeric, Date, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class TipoComidaEnum(enum.Enum):
    DESAYUNO = 'Desayuno'
    ALMUERZO = 'Almuerzo'
    CENA = 'Cena'
    MERIENDA = 'Merienda'

class TipoPlanEnum(enum.Enum):
    ENTRENAMIENTO = 'Entrenamiento'
    NUTRICION = 'Nutricion'

class EstatusEnum(enum.Enum):
    ACTIVO = 'Activo'
    EXPIRADO = 'Expirado'
    USADO = 'Usado'


class Usuario(db.Model):
    __tablename__ = 'Usuario'

    usuario_id: Mapped[int] = mapped_column("UsuarioID", primary_key=True)
    nombre: Mapped[str] = mapped_column("Nombre", String(50), nullable=False)
    correo: Mapped[str] = mapped_column("Correo", String(80), unique=True, nullable=False)
    password: Mapped[str] = mapped_column("password", String(200), nullable=False)
    url_foto: Mapped[str] = mapped_column("urlFoto", String(100), nullable=False)
    altura: Mapped[float] = mapped_column("Altura", Numeric(5, 2), nullable=False)
    objetivo: Mapped[str] = mapped_column("Objetivo", String(100), nullable=False)
    peso_deseado: Mapped[float] = mapped_column("PesoDeseado", Numeric(5, 2), nullable=False)

    def serialize(self):
        return {
            "UsuarioID": self.usuario_id,
            "Nombre": self.nombre,
            "Correo": self.correo,
            "urlFoto": self.url_foto,
            "Altura": float(self.altura) if self.altura else None,
            "Objetivo": self.objetivo,
            "PesoDeseado": float(self.peso_deseado) if self.peso_deseado else None
        }

class Ejercicio(db.Model):
    __tablename__ = 'Ejercicio'

    ejercicio_id: Mapped[int] = mapped_column("EjercicioID", primary_key=True)
    nombre: Mapped[str] = mapped_column("Nombre", String(100), nullable=False)

    def serialize(self):
        return {
            "EjercicioID": self.ejercicio_id,
            "Nombre": self.nombre
        }

class Entrenamiento(db.Model):
    __tablename__ = 'Entrenamiento'

    entrenamiento_id: Mapped[int] = mapped_column("EntrenamientoID", primary_key=True)
    usuario_id: Mapped[int] = mapped_column("UsuarioID", ForeignKey('Usuario.UsuarioID'), nullable=False)
    fecha: Mapped[date] = mapped_column("Fecha", Date, nullable=False)
    duracion: Mapped[int] = mapped_column("Duracion", Integer, nullable=False)
    nota: Mapped[str] = mapped_column("Nota", Text, nullable=False)

    def serialize(self):
        return {
            "EntrenamientoID": self.entrenamiento_id,
            "UsuarioID": self.usuario_id,
            "Fecha": self.fecha.isoformat() if self.fecha else None,
            "Duracion": self.duracion,
            "Nota": self.nota
        }

class DetalleEntrenamiento(db.Model):
    __tablename__ = 'DetalleEntrenamiento'

    det_entrenamiento_id: Mapped[int] = mapped_column("DetEntrenamientoID", primary_key=True)
    entrenamiento_id: Mapped[int] = mapped_column("EntrenamientoID", ForeignKey('Entrenamiento.EntrenamientoID'), nullable=False)
    ejercicio_id: Mapped[int] = mapped_column("EjercicioID", ForeignKey('Ejercicio.EjercicioID'), nullable=False)
    serie: Mapped[int] = mapped_column("Serie", Integer, nullable=False)
    repeticion: Mapped[int] = mapped_column("Repeticion", Integer, nullable=False)
    peso_ejercicio: Mapped[int] = mapped_column("PesoEjercicio", Integer, nullable=False)

    def serialize(self):
        return {
            "DetEntrenamientoID": self.det_entrenamiento_id,
            "EntrenamientoID": self.entrenamiento_id,
            "EjercicioID": self.ejercicio_id,
            "Serie": self.serie,
            "Repeticion": self.repeticion,
            "PesoEjercicio": self.peso_ejercicio
        }

class Nutricion(db.Model):
    __tablename__ = 'Nutricion'

    nutricion_id: Mapped[int] = mapped_column("NutricionID", primary_key=True)
    usuario_id: Mapped[int] = mapped_column("UsuarioID", ForeignKey('Usuario.UsuarioID'), nullable=False)
    tipo_comida: Mapped[TipoComidaEnum] = mapped_column("TipoComida", Enum(TipoComidaEnum), nullable=False)
    fecha: Mapped[date] = mapped_column("Fecha", Date, nullable=False)
    nombre: Mapped[str] = mapped_column("Nombre", String(100), nullable=False)
    proteina: Mapped[float] = mapped_column("Proteina", Numeric(6, 2), nullable=False)
    caloria: Mapped[float] = mapped_column("Caloria", Numeric(6, 2), nullable=False)
    grasa: Mapped[float] = mapped_column("Grasa", Numeric(6, 2), nullable=False)
    carbohidrato: Mapped[float] = mapped_column("Carbohidrato", Numeric(6, 2), nullable=False)

    def serialize(self):
        return {
            "NutricionID": self.nutricion_id,
            "UsuarioID": self.usuario_id,
            "TipoComida": self.tipo_comida.value if self.tipo_comida else None,
            "Fecha": self.fecha.isoformat() if self.fecha else None,
            "Nombre": self.nombre,
            "Proteina": float(self.proteina) if self.proteina else None,
            "Caloria": float(self.caloria) if self.caloria else None,
            "Grasa": float(self.grasa) if self.grasa else None,
            "Carbohidrato": float(self.carbohidrato) if self.carbohidrato else None
        }

class Peso(db.Model):
    __tablename__ = 'Peso'

    peso_id: Mapped[int] = mapped_column("PesoID", primary_key=True)
    usuario_id: Mapped[int] = mapped_column("UsuarioID", ForeignKey('Usuario.UsuarioID'), nullable=False)
    fecha: Mapped[date] = mapped_column("Fecha", Date, nullable=False)
    peso_kg: Mapped[float] = mapped_column("PesoKg", Numeric(5, 2), nullable=False)

    def serialize(self):
        return {
            "PesoID": self.peso_id,
            "UsuarioID": self.usuario_id,
            "Fecha": self.fecha.isoformat() if self.fecha else None,
            "PesoKg": float(self.peso_kg) if self.peso_kg else None
        }

class PlanIA(db.Model):
    __tablename__ = 'PlanIA'

    plan_id: Mapped[int] = mapped_column("PlanID", primary_key=True)
    usuario_id: Mapped[int] = mapped_column("UsuarioID", ForeignKey('Usuario.UsuarioID'), nullable=False)
    fecha: Mapped[date] = mapped_column("Fecha", Date, nullable=False)
    tipo_plan: Mapped[TipoPlanEnum] = mapped_column("TipoPlan", Enum(TipoPlanEnum), nullable=False)
    prompt: Mapped[str] = mapped_column("Prompt", Text, nullable=False)
    resultado: Mapped[str] = mapped_column("Resultado", Text, nullable=False)

    def serialize(self):
        return {
            "PlanID": self.plan_id,
            "UsuarioID": self.usuario_id,
            "Fecha": self.fecha.isoformat() if self.fecha else None,
            "TipoPlan": self.tipo_plan.value if self.tipo_plan else None,
            "Prompt": self.prompt,
            "Resultado": self.resultado
        }

class CodigoRecuperacion(db.Model):
    __tablename__ = 'CodigoRecuperacion'

    recuperacion_id: Mapped[int] = mapped_column("RecuperacionID", primary_key=True)
    usuario_id: Mapped[int] = mapped_column("UsuarioID", ForeignKey('Usuario.UsuarioID'), nullable=False)
    codigo: Mapped[str] = mapped_column("Codigo", String(10), nullable=False)
    fecha_solicitud: Mapped[datetime] = mapped_column("FechaSolicitud", DateTime, nullable=False)
    fecha_expiracion: Mapped[datetime] = mapped_column("FechaExpiracion", DateTime, nullable=False)
    estatus: Mapped[EstatusEnum] = mapped_column("Estatus", Enum(EstatusEnum), nullable=False)

    def serialize(self):
        return {
            "RecuperacionID": self.recuperacion_id,
            "UsuarioID": self.usuario_id,
            "Codigo": self.codigo,
            "FechaSolicitud": self.fecha_solicitud.isoformat() if self.fecha_solicitud else None,
            "FechaExpiracion": self.fecha_expiracion.isoformat() if self.fecha_expiracion else None,
            "Estatus": self.estatus.value if self.estatus else None
        }