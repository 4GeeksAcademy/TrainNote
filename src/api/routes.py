"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from models import db, Workshop, User, Employee
from api.utils import APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

import json
from datetime import datetime, date
from flask import Blueprint, request, jsonify, url_for
from api.models import (
    db, User,
    Cliente, Vehiculo, Propiedad, HistorialKilometraje,
    Mecanico, Reparacion, ReparacionMecanico,
    TipoMantenimiento, Mantenimiento, AuditoriaLog,
    TipoCombustible, EstadoReparacion, EstadoMantenimiento,
)
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


def parse_date(value):
    
    if not value:
        return None
    return datetime.strptime(value, "%Y-%m-%d").date()


def parse_datetime(value):
    
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def registrar_auditoria(tabla, registro_id, accion, anteriores=None, nuevos=None, usuario=None):
    
    log = AuditoriaLog(
        tabla=tabla,
        registro_id=registro_id,
        accion=accion,
        valores_anteriores=json.dumps(anteriores, default=str) if anteriores else None,
        valores_nuevos=json.dumps(nuevos, default=str) if nuevos else None,
        usuario=usuario,
    )
    db.session.add(log)

@api.route('/')
def sitemap():
    return generate_sitemap(api)


@api.route('/clientes', methods=['GET'])
def listar_clientes():
    activos = request.args.get('activos', 'true').lower() == 'true'
    q = Cliente.query
    if activos:
        q = q.filter_by(activo=True)
    return jsonify([c.serialize() for c in q.all()]), 200


@api.route('/clientes/<int:cliente_id>', methods=['GET'])
def obtener_cliente(cliente_id):
    cliente = Cliente.query.get_or_404(cliente_id)
    return jsonify(cliente.serialize()), 200


@api.route('/clientes', methods=['POST'])
def crear_cliente():
    data = request.get_json() or {}
    obligatorios = ['nombre', 'apellidos', 'dni']
    if not all(k in data for k in obligatorios):
        raise APIException(f"Faltan campos: {obligatorios}", status_code=400)

    cliente = Cliente(
        nombre=data['nombre'],
        apellidos=data['apellidos'],
        dni=data['dni'],
        telefono=data.get('telefono'),
        email=data.get('email'),
        direccion=data.get('direccion'),
    )
    db.session.add(cliente)
    db.session.flush()
    registrar_auditoria("clientes", cliente.id, "CREATE", nuevos=cliente.serialize())
    db.session.commit()
    return jsonify(cliente.serialize()), 201


@api.route('/clientes/<int:cliente_id>', methods=['PUT'])
def actualizar_cliente(cliente_id):
    cliente = Cliente.query.get_or_404(cliente_id)
    anteriores = cliente.serialize()
    data = request.get_json() or {}
    for campo in ['nombre', 'apellidos', 'dni', 'telefono', 'email', 'direccion', 'activo']:
        if campo in data:
            setattr(cliente, campo, data[campo])
    registrar_auditoria("clientes", cliente.id, "UPDATE",
                        anteriores=anteriores, nuevos=cliente.serialize())
    db.session.commit()
    return jsonify(cliente.serialize()), 200


@api.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def desactivar_cliente(cliente_id):

    cliente = Cliente.query.get_or_404(cliente_id)
    anteriores = cliente.serialize()
    cliente.activo = False
    registrar_auditoria("clientes", cliente.id, "DELETE",
                        anteriores=anteriores, nuevos=cliente.serialize())
    db.session.commit()
    return jsonify({"msg": "Cliente desactivado"}), 200


@api.route('/vehiculos', methods=['GET'])
def listar_vehiculos():
    activos = request.args.get('activos', 'true').lower() == 'true'
    marca = request.args.get('marca')
    matricula = request.args.get('matricula')

    q = Vehiculo.query
    if activos:
        q = q.filter_by(activo=True)
    if marca:
        q = q.filter(Vehiculo.marca.ilike(f"%{marca}%"))
    if matricula:
        q = q.filter(Vehiculo.matricula.ilike(f"%{matricula}%"))

    return jsonify([v.serialize() for v in q.all()]), 200


@api.route('/vehiculos/<int:vehiculo_id>', methods=['GET'])
def obtener_vehiculo(vehiculo_id):

    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    return jsonify(vehiculo.serialize(incluir_historial=True)), 200


@api.route('/vehiculos', methods=['POST'])
def crear_vehiculo():
    data = request.get_json() or {}
    obligatorios = ['matricula', 'vin', 'marca', 'modelo', 'anio', 'combustible']
    if not all(k in data for k in obligatorios):
        raise APIException(f"Faltan campos: {obligatorios}", status_code=400)

    try:
        combustible = TipoCombustible(data['combustible'])
    except ValueError:
        valores = [c.value for c in TipoCombustible]
        raise APIException(f"Combustible inválido. Opciones: {valores}", status_code=400)

    vehiculo = Vehiculo(
        matricula=data['matricula'].upper().strip(),
        vin=data['vin'].upper().strip(),
        marca=data['marca'],
        modelo=data['modelo'],
        version=data.get('version'),
        año=data['año'],
        combustible=combustible,
        potencia_cv=data.get('potencia_cv'),
        cilindrada_cc=data.get('cilindrada_cc'),
        color=data.get('color'),
        kilometraje_actual=data.get('kilometraje_actual', 0),
        fecha_primera_matriculacion=parse_date(data.get('fecha_primera_matriculacion')),
    )
    db.session.add(vehiculo)
    db.session.flush()


    cliente_id = data.get('propietario_inicial_id')
    if cliente_id:
        Cliente.query.get_or_404(cliente_id)
        propiedad = Propiedad(
            vehiculo_id=vehiculo.id,
            cliente_id=cliente_id,
            fecha_inicio=parse_date(data.get('fecha_inicio_propiedad')) or date.today(),
            es_actual=True,
        )
        db.session.add(propiedad)


    if vehiculo.kilometraje_actual > 0:
        db.session.add(HistorialKilometraje(
            vehiculo_id=vehiculo.id,
            kilometraje=vehiculo.kilometraje_actual,
            motivo="Registro inicial",
        ))

    registrar_auditoria("vehiculos", vehiculo.id, "CREATE", nuevos=vehiculo.serialize())
    db.session.commit()
    return jsonify(vehiculo.serialize(incluir_historial=True)), 201


@api.route('/vehiculos/<int:vehiculo_id>', methods=['PUT'])
def actualizar_vehiculo(vehiculo_id):
    
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    anteriores = vehiculo.serialize()
    data = request.get_json() or {}

    campos_simples = ['marca', 'modelo', 'version', 'año', 'potencia_cv',
                      'cilindrada_cc', 'color', 'activo']
    for campo in campos_simples:
        if campo in data:
            setattr(vehiculo, campo, data[campo])

    if 'combustible' in data:
        vehiculo.combustible = TipoCombustible(data['combustible'])
    if 'fecha_primera_matriculacion' in data:
        vehiculo.fecha_primera_matriculacion = parse_date(data['fecha_primera_matriculacion'])

    registrar_auditoria("vehiculos", vehiculo.id, "UPDATE",
                        anteriores=anteriores, nuevos=vehiculo.serialize())
    db.session.commit()
    return jsonify(vehiculo.serialize()), 200


@api.route('/vehiculos/<int:vehiculo_id>', methods=['DELETE'])
def desactivar_vehiculo(vehiculo_id):
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    anteriores = vehiculo.serialize()
    vehiculo.activo = False
    registrar_auditoria("vehiculos", vehiculo.id, "DELETE",
                        anteriores=anteriores, nuevos=vehiculo.serialize())
    db.session.commit()
    return jsonify({"msg": "Vehículo desactivado"}), 200



@api.route('/vehiculos/<int:vehiculo_id>/transferir', methods=['POST'])
def transferir_vehiculo(vehiculo_id):
    
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    data = request.get_json() or {}
    nuevo_cliente_id = data.get('nuevo_cliente_id')
    if not nuevo_cliente_id:
        raise APIException("Falta nuevo_cliente_id", status_code=400)

    Cliente.query.get_or_404(nuevo_cliente_id)
    fecha_cambio = parse_date(data.get('fecha')) or date.today()


    actual = Propiedad.query.filter_by(vehiculo_id=vehiculo_id, es_actual=True).first()
    if actual:
        if actual.cliente_id == nuevo_cliente_id:
            raise APIException("Ese cliente ya es el propietario actual", status_code=400)
        anteriores = actual.serialize()
        actual.es_actual = False
        actual.fecha_fin = fecha_cambio
        registrar_auditoria("propiedades", actual.id, "UPDATE",
            anteriores=anteriores, nuevos=actual.serialize())

    nueva = Propiedad(
        vehiculo_id=vehiculo_id,
        cliente_id=nuevo_cliente_id,
        fecha_inicio=fecha_cambio,
        es_actual=True,
        observaciones=data.get('observaciones'),
    )
    db.session.add(nueva)
    db.session.flush()
    registrar_auditoria("propiedades", nueva.id, "CREATE", nuevos=nueva.serialize())
    db.session.commit()

    return jsonify({
        "msg": "Titularidad transferida",
        "propiedad": nueva.serialize(),
    }), 201

@api.route('/vehiculos/<int:vehiculo_id>/kilometraje', methods=['GET'])
def historial_kilometraje(vehiculo_id):
    Vehiculo.query.get_or_404(vehiculo_id)
    historial = HistorialKilometraje.query.filter_by(vehiculo_id=vehiculo_id)\
        .order_by(HistorialKilometraje.fecha_registro.desc()).all()
    return jsonify([h.serialize() for h in historial]), 200


@api.route('/vehiculos/<int:vehiculo_id>/kilometraje', methods=['POST'])
def registrar_kilometraje(vehiculo_id):
    
    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    data = request.get_json() or {}
    km = data.get('kilometraje')
    if km is None:
        raise APIException("Falta kilometraje", status_code=400)
    if km < vehiculo.kilometraje_actual:
        raise APIException(
            f"El kilometraje no puede ser menor al actual ({vehiculo.kilometraje_actual})",
            status_code=400
        )

    registro = HistorialKilometraje(
        vehiculo_id=vehiculo_id,
        kilometraje=km,
        motivo=data.get('motivo'),
        registrado_por=data.get('registrado_por'),
    )
    anterior_km = vehiculo.kilometraje_actual
    vehiculo.kilometraje_actual = km
    db.session.add(registro)
    db.session.flush()

    registrar_auditoria("vehiculos", vehiculo.id, "UPDATE",
                        anteriores={"kilometraje_actual": anterior_km},
                        nuevos={"kilometraje_actual": km})
    db.session.commit()
    return jsonify(registro.serialize()), 201

@api.route('/mecanicos', methods=['GET'])
def listar_mecanicos():
    activos = request.args.get('activos', 'true').lower() == 'true'
    q = Mecanico.query
    if activos:
        q = q.filter_by(activo=True)
    return jsonify([m.serialize() for m in q.all()]), 200


@api.route('/mecanicos/<int:mecanico_id>', methods=['GET'])
def obtener_mecanico(mecanico_id):
    mecanico = Mecanico.query.get_or_404(mecanico_id)
    return jsonify(mecanico.serialize()), 200


@api.route('/mecanicos', methods=['POST'])
def crear_mecanico():
    data = request.get_json() or {}
    if not all(k in data for k in ['nombre', 'apellidos']):
        raise APIException("Faltan nombre y/o apellidos", status_code=400)

    mecanico = Mecanico(
        nombre=data['nombre'],
        apellidos=data['apellidos'],
        dni=data.get('dni'),
        especialidad=data.get('especialidad'),
        telefono=data.get('telefono'),
        email=data.get('email'),
        coste_hora=data.get('coste_hora'),
    )
    db.session.add(mecanico)
    db.session.commit()
    return jsonify(mecanico.serialize()), 201


@api.route('/mecanicos/<int:mecanico_id>', methods=['PUT'])
def actualizar_mecanico(mecanico_id):
    mecanico = Mecanico.query.get_or_404(mecanico_id)
    data = request.get_json() or {}
    for campo in ['nombre', 'apellidos', 'dni', 'especialidad', 'telefono',
                  'email', 'coste_hora', 'activo']:
        if campo in data:
            setattr(mecanico, campo, data[campo])
    db.session.commit()
    return jsonify(mecanico.serialize()), 200


@api.route('/mecanicos/<int:mecanico_id>', methods=['DELETE'])
def desactivar_mecanico(mecanico_id):
    mecanico = Mecanico.query.get_or_404(mecanico_id)
    mecanico.activo = False
    db.session.commit()
    return jsonify({"msg": "Mecánico desactivado"}), 200


@api.route('/vehiculos/<int:vehiculo_id>/reparaciones', methods=['GET'])
def listar_reparaciones_vehiculo(vehiculo_id):
    Vehiculo.query.get_or_404(vehiculo_id)
    reps = Reparacion.query.filter_by(vehiculo_id=vehiculo_id)\
        .order_by(Reparacion.fecha_entrada.desc()).all()
    return jsonify([r.serialize() for r in reps]), 200


@api.route('/reparaciones/<int:reparacion_id>', methods=['GET'])
def obtener_reparacion(reparacion_id):
    rep = Reparacion.query.get_or_404(reparacion_id)
    return jsonify(rep.serialize()), 200


@api.route('/vehiculos/<int:vehiculo_id>/reparaciones', methods=['POST'])
def crear_reparacion(vehiculo_id):
    
    Vehiculo.query.get_or_404(vehiculo_id)
    data = request.get_json() or {}
    if 'descripcion' not in data:
        raise APIException("Falta descripcion", status_code=400)

    rep = Reparacion(
        vehiculo_id=vehiculo_id,
        descripcion=data['descripcion'],
        kilometraje_entrada=data.get('kilometraje_entrada'),
        coste_repuestos=data.get('coste_repuestos', 0.0),
        coste_mano_obra=data.get('coste_mano_obra', 0.0),
        tiempo_mano_obra_horas=data.get('tiempo_mano_obra_horas', 0.0),
        estado=EstadoReparacion(data.get('estado', 'pendiente')),
        observaciones=data.get('observaciones'),
    )
    rep.recalcular_coste_total()
    db.session.add(rep)
    db.session.flush()

    # Mecánicos asignados
    for m in data.get('mecanicos', []):
        Mecanico.query.get_or_404(m['mecanico_id'])
        db.session.add(ReparacionMecanico(
            reparacion_id=rep.id,
            mecanico_id=m['mecanico_id'],
            horas_invertidas=m.get('horas_invertidas', 0.0),
            rol=m.get('rol'),
        ))

    registrar_auditoria("reparaciones", rep.id, "CREATE", nuevos=rep.serialize())
    db.session.commit()
    return jsonify(rep.serialize()), 201


@api.route('/reparaciones/<int:reparacion_id>', methods=['PUT'])
def actualizar_reparacion(reparacion_id):
    rep = Reparacion.query.get_or_404(reparacion_id)
    anteriores = rep.serialize()
    data = request.get_json() or {}

    for campo in ['descripcion', 'kilometraje_entrada', 'coste_repuestos',
                  'coste_mano_obra', 'tiempo_mano_obra_horas', 'observaciones']:
        if campo in data:
            setattr(rep, campo, data[campo])
    if 'estado' in data:
        rep.estado = EstadoReparacion(data['estado'])
        if rep.estado == EstadoReparacion.FINALIZADA and not rep.fecha_salida:
            rep.fecha_salida = datetime.utcnow()
    if 'fecha_salida' in data:
        rep.fecha_salida = parse_datetime(data['fecha_salida'])

    rep.recalcular_coste_total()
    registrar_auditoria("reparaciones", rep.id, "UPDATE",
                        anteriores=anteriores, nuevos=rep.serialize())
    db.session.commit()
    return jsonify(rep.serialize()), 200


@api.route('/reparaciones/<int:reparacion_id>/mecanicos', methods=['POST'])
def asignar_mecanico_reparacion(reparacion_id):
   
    rep = Reparacion.query.get_or_404(reparacion_id)
    data = request.get_json() or {}
    mecanico_id = data.get('mecanico_id')
    if not mecanico_id:
        raise APIException("Falta mecanico_id", status_code=400)
    Mecanico.query.get_or_404(mecanico_id)

    existente = ReparacionMecanico.query.filter_by(
        reparacion_id=reparacion_id, mecanico_id=mecanico_id
    ).first()
    if existente:
        existente.horas_invertidas = data.get('horas_invertidas', existente.horas_invertidas)
        existente.rol = data.get('rol', existente.rol)
    else:
        db.session.add(ReparacionMecanico(
            reparacion_id=reparacion_id,
            mecanico_id=mecanico_id,
            horas_invertidas=data.get('horas_invertidas', 0.0),
            rol=data.get('rol'),
        ))
    db.session.commit()
    return jsonify(rep.serialize()), 200

@api.route('/tipos-mantenimiento', methods=['GET'])
def listar_tipos_mantenimiento():
    tipos = TipoMantenimiento.query.filter_by(activo=True).all()
    return jsonify([t.serialize() for t in tipos]), 200


@api.route('/tipos-mantenimiento', methods=['POST'])
def crear_tipo_mantenimiento():
    data = request.get_json() or {}
    if 'nombre' not in data:
        raise APIException("Falta nombre", status_code=400)
    tipo = TipoMantenimiento(
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        intervalo_km=data.get('intervalo_km'),
        intervalo_meses=data.get('intervalo_meses'),
    )
    db.session.add(tipo)
    db.session.commit()
    return jsonify(tipo.serialize()), 201

@api.route('/vehiculos/<int:vehiculo_id>/mantenimientos', methods=['GET'])
def listar_mantenimientos_vehiculo(vehiculo_id):
    Vehiculo.query.get_or_404(vehiculo_id)
    estado = request.args.get('estado')
    q = Mantenimiento.query.filter_by(vehiculo_id=vehiculo_id)
    if estado:
        q = q.filter_by(estado=EstadoMantenimiento(estado))
    mants = q.order_by(Mantenimiento.fecha_programada.asc().nullslast()).all()
    return jsonify([m.serialize() for m in mants]), 200


@api.route('/vehiculos/<int:vehiculo_id>/mantenimientos', methods=['POST'])
def programar_mantenimiento(vehiculo_id):
   
    Vehiculo.query.get_or_404(vehiculo_id)
    data = request.get_json() or {}
    if 'tipo_mantenimiento_id' not in data:
        raise APIException("Falta tipo_mantenimiento_id", status_code=400)

    TipoMantenimiento.query.get_or_404(data['tipo_mantenimiento_id'])
    if data.get('mecanico_id'):
        Mecanico.query.get_or_404(data['mecanico_id'])

    mant = Mantenimiento(
        vehiculo_id=vehiculo_id,
        tipo_mantenimiento_id=data['tipo_mantenimiento_id'],
        mecanico_id=data.get('mecanico_id'),
        fecha_programada=parse_date(data.get('fecha_programada')),
        kilometraje_programado=data.get('kilometraje_programado'),
        observaciones=data.get('observaciones'),
        estado=EstadoMantenimiento(data.get('estado', 'programado')),
    )
    db.session.add(mant)
    db.session.flush()
    registrar_auditoria("mantenimientos", mant.id, "CREATE", nuevos=mant.serialize())
    db.session.commit()
    return jsonify(mant.serialize()), 201


@api.route('/mantenimientos/<int:mant_id>/realizar', methods=['POST'])
def realizar_mantenimiento(mant_id):
 
    mant = Mantenimiento.query.get_or_404(mant_id)
    anteriores = mant.serialize()
    data = request.get_json() or {}

    mant.fecha_realizado = parse_date(data.get('fecha_realizado')) or date.today()
    mant.kilometraje_realizado = data.get('kilometraje_realizado')
    mant.coste = data.get('coste', mant.coste)
    mant.tiempo_mano_obra_horas = data.get('tiempo_mano_obra_horas', mant.tiempo_mano_obra_horas)
    if data.get('mecanico_id'):
        Mecanico.query.get_or_404(data['mecanico_id'])
        mant.mecanico_id = data['mecanico_id']
    mant.estado = EstadoMantenimiento.REALIZADO

   
    if mant.kilometraje_realizado:
        vehiculo = mant.vehiculo
        if mant.kilometraje_realizado >= vehiculo.kilometraje_actual:
            db.session.add(HistorialKilometraje(
                vehiculo_id=vehiculo.id,
                kilometraje=mant.kilometraje_realizado,
                motivo=f"Mantenimiento: {mant.tipo.nombre}",
            ))
            vehiculo.kilometraje_actual = mant.kilometraje_realizado

    registrar_auditoria("mantenimientos", mant.id, "UPDATE",
                        anteriores=anteriores, nuevos=mant.serialize())
    db.session.commit()
    return jsonify(mant.serialize()), 200

@api.route('/vehiculos/<int:vehiculo_id>/resumen', methods=['GET'])
def resumen_vehiculo(vehiculo_id):

    vehiculo = Vehiculo.query.get_or_404(vehiculo_id)
    proximos = Mantenimiento.query.filter_by(
        vehiculo_id=vehiculo_id,
        estado=EstadoMantenimiento.PROGRAMADO
    ).order_by(Mantenimiento.fecha_programada.asc().nullslast()).limit(5).all()

    return jsonify({
        "vehiculo": vehiculo.serialize(),
        "kpis": {
            "total_reparaciones": len(vehiculo.reparaciones),
            "total_mantenimientos_realizados": sum(
                1 for m in vehiculo.mantenimientos
                if m.estado == EstadoMantenimiento.REALIZADO
            ),
            "coste_total_acumulado": vehiculo.coste_total_acumulado,
            "horas_mano_obra_totales": vehiculo.horas_mano_obra_totales,
        },
        "proximos_mantenimientos": [m.serialize() for m in proximos],
    }), 200

@api.route('/auditoria', methods=['GET'])
def listar_auditoria():
    tabla = request.args.get('tabla')
    registro_id = request.args.get('registro_id', type=int)
    q = AuditoriaLog.query
    if tabla:
        q = q.filter_by(tabla=tabla)
    if registro_id:
        q = q.filter_by(registro_id=registro_id)
    logs = q.order_by(AuditoriaLog.timestamp.desc()).limit(200).all()
    return jsonify([l.serialize() for l in logs]), 200

api = Blueprint('api', __name__)
CORS(api)

bcrypt = Bcrypt()


def get_current_user():
    current_user_id = get_jwt_identity()
    return db.session.get(User, int(current_user_id))


def user_belongs_to_workshop(user, workshop_id):
    return user is not None and user.workshop_id == workshop_id


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


##-----------------------------WORKSHOP ENDPOINTS-------------


@api.route("/workshops", methods=["GET"])
@jwt_required()
def get_workshops():
    workshops = Workshop.query.all()

    return jsonify({
        "workshops": [workshop.serialize() for workshop in workshops]
    }), 200


@api.route("/workshops/<int:workshop_id>", methods=["GET"])
@jwt_required()
def get_workshop_details(workshop_id):
    current_user = get_current_user()

    if not user_belongs_to_workshop(current_user, workshop_id):
        return jsonify({
            "message": "You do not have permission to access this workshop"
        }), 403

    workshop = db.session.get(Workshop, workshop_id)

    if not workshop:
        return jsonify({
            "message": "Workshop not found"
        }), 404

    return jsonify({
        "workshop": workshop.serialize()
    }), 200


@api.route("/workshops", methods=["POST"])
def create_workshop():
    data = request.get_json() or {}

    company_name = data.get("company_name")
    cif = data.get("cif")
    phone = data.get("phone")
    email = data.get("email")
    address = data.get("address")
    city = data.get("city")
    postal_code = data.get("postal_code")

    manager_first_name = data.get("manager_first_name")
    manager_last_name = data.get("manager_last_name")
    manager_dni = data.get("manager_dni")
    manager_phone = data.get("manager_phone")
    manager_email = data.get("manager_email")
    manager_password = data.get("manager_password")

    if not company_name or not cif or not phone or not email:
        return jsonify({
            "message": "company_name, cif, phone and email are required"
        }), 400

    if not manager_first_name or not manager_last_name or not manager_phone or not manager_email or not manager_password:
        return jsonify({
            "message": "manager_first_name, manager_last_name, manager_phone, manager_email and manager_password are required"
        }), 400

    existing_workshop = Workshop.query.filter(
        (Workshop.email == email) | (Workshop.cif == cif)
    ).first()

    if existing_workshop:
        return jsonify({
            "message": "A workshop with this email or CIF already exists"
        }), 409

    existing_user = User.query.filter_by(email=manager_email).first()

    if existing_user:
        return jsonify({
            "message": "A user with this email already exists"
        }), 409

    if manager_dni:
        existing_employee_dni = Employee.query.filter_by(dni=manager_dni).first()

        if existing_employee_dni:
            return jsonify({
                "message": "An employee with this DNI already exists"
            }), 409

    new_workshop = Workshop(
        company_name=company_name,
        cif=cif,
        phone=phone,
        email=email,
        address=address,
        city=city,
        postal_code=postal_code
    )

    db.session.add(new_workshop)
    db.session.flush()

    password_hash = bcrypt.generate_password_hash(manager_password).decode("utf-8")

    manager_user = User(
        email=manager_email,
        password_hash=password_hash,
        role="gerente",
        workshop_id=new_workshop.id
    )

    db.session.add(manager_user)
    db.session.flush()

    manager_employee = Employee(
        first_name=manager_first_name,
        last_name=manager_last_name,
        dni=manager_dni,
        phone=manager_phone,
        workshop_id=new_workshop.id,
        user_id=manager_user.id
    )

    db.session.add(manager_employee)
    db.session.commit()

    return jsonify({
        "message": "Workshop, manager user and manager employee created successfully",
        "workshop": new_workshop.serialize(),
        "user": manager_user.serialize(),
        "employee": manager_employee.serialize()
    }), 201


# ---------------------- USER LOGIN ENDPOINT ----------------------


@api.route("/login", methods=["POST"])
@api.route("/users/login", methods=["POST"])
def login_user():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if not user.is_active:
        return jsonify({
            "message": "This user account is inactive"
        }), 403

    is_valid_password = bcrypt.check_password_hash(user.password_hash, password)

    if not is_valid_password:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "workshop_id": user.workshop_id
        }
    )

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user.serialize(),
        "employee": user.employee.serialize() if user.employee else None
    }), 200


# ---------------------- EMPLOYEE ENDPOINTS ----------------------


@api.route("/workshops/<int:workshop_id>/employees", methods=["GET"])
@jwt_required()
def get_workshop_employees(workshop_id):
    current_user = get_current_user()

    if not user_belongs_to_workshop(current_user, workshop_id):
        return jsonify({
            "message": "You do not have permission to access these employees"
        }), 403

    workshop = db.session.get(Workshop, workshop_id)

    if not workshop:
        return jsonify({
            "message": "Workshop not found"
        }), 404

    employees = Employee.query.filter_by(workshop_id=workshop_id).all()

    return jsonify({
        "workshop": workshop.serialize(),
        "employees": [employee.serialize() for employee in employees]
    }), 200


@api.route("/workshops/<int:workshop_id>/employees", methods=["POST"])
@jwt_required()
def create_employee(workshop_id):
    current_user = get_current_user()

    if not user_belongs_to_workshop(current_user, workshop_id):
        return jsonify({
            "message": "You do not have permission to create employees in this workshop"
        }), 403

    if current_user.role not in ["gerente", "administrador"]:
        return jsonify({
            "message": "Only gerente or administrador can create employees"
        }), 403

    data = request.get_json() or {}

    workshop = db.session.get(Workshop, workshop_id)

    if not workshop:
        return jsonify({
            "message": "Workshop not found"
        }), 404

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    dni = data.get("dni")
    phone = data.get("phone")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    allowed_roles = ["coordinador", "mecanico"]

    if role not in allowed_roles:
        return jsonify({
            "message": "Role must be coordinador or mecanico"
        }), 400

    if not first_name or not last_name or not phone or not email or not password:
        return jsonify({
            "message": "first_name, last_name, phone, email and password are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "A user with this email already exists"
        }), 409

    if dni:
        existing_employee_dni = Employee.query.filter_by(dni=dni).first()

        if existing_employee_dni:
            return jsonify({
                "message": "An employee with this DNI already exists"
            }), 409

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        email=email,
        password_hash=password_hash,
        role=role,
        workshop_id=workshop_id
    )

    db.session.add(new_user)
    db.session.flush()

    new_employee = Employee(
        first_name=first_name,
        last_name=last_name,
        dni=dni,
        phone=phone,
        workshop_id=workshop_id,
        user_id=new_user.id
    )

    db.session.add(new_employee)
    db.session.commit()

    return jsonify({
        "message": "Employee user and employee profile created successfully",
        "user": new_user.serialize(),
        "employee": new_employee.serialize()
    }), 201


@api.route("/workshops/<int:workshop_id>/employees/<int:employee_id>", methods=["GET"])
@jwt_required()
def get_employee_detail(workshop_id, employee_id):
    current_user = get_current_user()

    if not user_belongs_to_workshop(current_user, workshop_id):
        return jsonify({
            "message": "You do not have permission to access this employee"
        }), 403

    workshop = db.session.get(Workshop, workshop_id)

    if not workshop:
        return jsonify({
            "message": "Workshop not found"
        }), 404

    employee = Employee.query.filter_by(
        id=employee_id,
        workshop_id=workshop_id
    ).first()

    if not employee:
        return jsonify({
            "message": "Employee not found in this workshop"
        }), 404

    return jsonify({
        "employee": employee.serialize()
    }), 200

