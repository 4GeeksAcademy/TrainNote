from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)

# ROLES TABLES


class Admins(db.Model):
    __tablename__ = 'admins'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_type: Mapped[str] = mapped_column(
        String(10), default="admin", nullable=False)
    admin_groups: Mapped[list['Groups']] = relationship(back_populates='admin')


class Teachers(db.Model):
    __tablename__ = 'teachers'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_type: Mapped[str] = mapped_column(
        String(10), default="teacher", nullable=False)
    teacher_group: Mapped[list['Groups']] = relationship(
        back_populates='teacher_principal')
    status: Mapped[list['Status']] = relationship(back_populates='teacher')


class Students(db.Model):
    __tablename__ = 'students'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    user_type: Mapped[str] = mapped_column(
        String(10), default="student", nullable=False)
    groups_id: Mapped[int] = mapped_column(Integer, ForeignKey('groups.id'))
    group: Mapped['Groups'] = relationship(back_populates='students')
    students_status: Mapped[list['Status']] = relationship(
        back_populates='student')


# GROUPS TABLE

class Groups(db.Model):
    __tablename__ = 'groups'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    admin_id: Mapped[int] = mapped_column(Integer, ForeignKey('admins.id'))
    admin: Mapped['Admins'] = relationship(back_populates='admin_groups')
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey('teachers.id'))
    teacher_principal: Mapped['Teachers'] = relationship(
        back_populates='teacher_group')
    students: Mapped[list['Students']] = relationship(back_populates='group')
    groups_reading: Mapped[list['Readings']] = relationship(
        back_populates='group_reading')
    todos: Mapped[list['Todos']] = relationship(back_populates='group_todo')


# TEACHERS TABLES

class Todos(db.Model):
    __tablename__ = 'todos'
    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(300), nullable=False)
    mediaLink: Mapped[str] = mapped_column(String(300))
    time: Mapped[str] = mapped_column(Date, nullable=False)
    note: Mapped[int] = mapped_column(Integer, nullable=False)
    group_id: Mapped[int] = mapped_column(Integer, ForeignKey('groups.id'))
    group_todo: Mapped['Groups'] = relationship(back_populates='todos')
    status_todos: Mapped[list['Status']] = relationship(back_populates='todo')


class Readings(db.Model):
    __tablename__ = 'readings'
    id: Mapped[int] = mapped_column(primary_key=True)
    mediaLink: Mapped[str] = mapped_column(String(300))
    group_id: Mapped[int] = mapped_column(Integer, ForeignKey('groups.id'))
    group_reading: Mapped['Groups'] = relationship(
        back_populates='groups_reading')


class Status(db.Model):
    __tablename__ = 'status'
    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[bool] = mapped_column(Boolean)
    teacher_id: Mapped[int] = mapped_column(Integer, ForeignKey('teachers.id'))
    teacher: Mapped['Teachers'] = relationship(back_populates='status')
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey('students.id'))
    student: Mapped['Students'] = relationship(
        back_populates='students_status')
    todo_id: Mapped[int] = mapped_column(Integer, ForeignKey('todos.id'))
    todo: Mapped['Todos'] = relationship(back_populates='status_todos')

    def serialize(self):
        return {
            "id": self.id,
             "email": self.email,
        }
