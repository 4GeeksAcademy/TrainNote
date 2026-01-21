from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Enum as SQLEnum, date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

#ROLES TABLES

class Usser_Type(Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class Admnins(db.Model):
    __tablename__ = 'admins'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable =False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_type: Mapped[Usser_Type] = mapped_column(SQLEnum(Usser_Type), name="usser_type_enum",
        nullable=False,
        default=Usser_Type.ADMIN)
    

class Teachers(db.Model):
    __tablename__ = 'teachers'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable =False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_type: Mapped[Usser_Type] = mapped_column(SQLEnum(Usser_Type), name="usser_type_enum",
        nullable=False,
        default=Usser_Type.TEACHER)
    

class Students(db.Model):
    __tablename__ = 'students'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable =False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_type: Mapped[Usser_Type] = mapped_column(SQLEnum(Usser_Type), name="usser_type_enum",
        nullable=False,
        default=Usser_Type.STUDENT)
    
#GROUPS TABLE
class Groups(db.Model):
    __tablename__ = 'groups'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable =False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    


# TEACHERS TABLES 

class Todos(db.Model):
    __tablename__ = 'todos'
    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(300), nullable=False)
    mediaLink: Mapped[str] = mapped_column(String(300))
    time: Mapped[str] = mapped_column(date, nullable=False)
    note: Mapped[int] = mapped_column(Integer, nullable=False)

class Readings(db.Model):
    __tablename__ = 'readings'
    id: Mapped[int] = mapped_column(primary_key=True)
    mediaLink: Mapped[str] = mapped_column(String(300))

class Status(db.Model):
    __tablename__ = 'status'
    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[]


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }