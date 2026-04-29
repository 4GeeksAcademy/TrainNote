from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

asignacion_rutina = db.Table('asignacion_rutina',
    db.Column('hijo_id', db.Integer, db.ForeignKey('hijo.id'), primary_key=True),
    db.Column('rutina_id', db.Integer, db.ForeignKey('rutina.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    nombre = db.Column(db.String(80), nullable=False)
    apellidos = db.Column(db.String(80), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    direccion_hogar = db.Column(db.String(200))
    direccion_trabajo = db.Column(db.String(200))
    telefono = db.Column(db.String(20))
    foto_perfil = db.Column(db.String(255))
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    
    hijos = db.relationship('Hijo', backref='parent', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "foto_perfil": self.foto_perfil
        }

class Hijo(db.Model):
    __tablename__ = 'hijo'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    apellido = db.Column(db.String(80), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    foto_url = db.Column(db.String(255))
    info_adicional = db.Column(db.Text)
    intolerancia = db.Column(db.String(100), default="Ninguna")
    alergia = db.Column(db.String(100), default="Ninguna")
    asma = db.Column(db.String(50), default="No")
    tipo_sangre = db.Column(db.String(10), nullable=False)
    gatea = db.Column(db.String(10), default="No")
    autonomia_bano = db.Column(db.String(10), default="No")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    autorizados = db.relationship('Autorizado', backref='hijo', lazy=True)
    rutinas = db.relationship('Rutina', secondary=asignacion_rutina, backref=db.backref('hijos_asignados', lazy='dynamic'))

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "edad": self.edad,
            "fotoUrl": self.foto_url,
            "datosMedicos": {
                "intolerancia": self.intolerancia,
                "alergia": self.alergia,
                "asma": self.asma,
                "tipoSangre": self.tipo_sangre
            },
            "desarrollo": {
                "gatea": self.gatea,
                "autonomiaBano": self.autonomia_bano
            },
            "info": self.info_adicional
        }

class Autorizado(db.Model):
    __tablename__ = 'autorizado'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    apellidos = db.Column(db.String(80), nullable=False)
    dni = db.Column(db.String(20), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    parentesco = db.Column(db.String(50))
    foto_url = db.Column(db.String(255))
    es_permanente = db.Column(db.Boolean, default=True)
    valido_desde = db.Column(db.String(20))
    valido_hasta = db.Column(db.String(20))
    hijo_id = db.Column(db.Integer, db.ForeignKey('hijo.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "dni": self.dni,
            "telefono": self.telefono,
            "parentesco": self.parentesco,
            "fotoUrl": self.foto_url,
            "esPermanente": self.es_permanente,
            "validoDesde": self.valido_desde,
            "validoHasta": self.valido_hasta,
            "hijoId": self.hijo_id
        }

class Rutina(db.Model):
    __tablename__ = 'rutina'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    detalles = db.Column(db.String(250), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    actividades = db.relationship('Actividad', backref='rutina', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "detalles": self.detalles,
            "user_id": self.user_id
        }

class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(250), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    rutina_id = db.Column(db.Integer, db.ForeignKey('rutina.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "time": self.time,
            "category": self.category,
            "rutina_id": self.rutina_id
        }

class RutinaCompartida(db.Model):
    __tablename__ = 'rutina_compartida'
    id = db.Column(db.Integer, primary_key=True)
    cuidador_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rutina_id = db.Column(db.Integer, db.ForeignKey('rutina.id'), nullable=False)
    hijo_id = db.Column(db.Integer, db.ForeignKey('hijo.id'), nullable=False)

    
    cuidador = db.relationship('User', foreign_keys=[cuidador_id])
    rutina_rel = db.relationship('Rutina')
    hijo_rel = db.relationship('Hijo')

    def serialize(self):
        return {
            "id": self.id,
            "rutina": self.rutina_rel.serialize(),
            "hijo": self.hijo_rel.serialize(),
            "cuidador": self.cuidador.serialize()
        }