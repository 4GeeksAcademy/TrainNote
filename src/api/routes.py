import os
import random
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash
from api.models import (
    CodigoRecuperacion,
    DetalleEntrenamiento,
    Ejercicio,
    Entrenamiento,
    EstatusEnum,
    Nutricion,
    Peso,
    Usuario,
    db,
)
api_bp = Blueprint("api_bp", __name__)

jwt_blacklist = set()

# ==========================================
# UTILIDAD: VALIDA QUE EL PERFIL ESTE COMPLETO
# ==========================================
def perfil_esta_completado(user):
  
  if not user.altura or user.altura <= 0:
    return False
  if not user.objetivo or user.objetivo == "General":
    return False
  if not user.peso_deseado or user.peso_deseado <= 0:
    return False
  return True
# ==========================================
# UTILIDAD: ENVIAR CORREO (SMTP GMAIL)
# ==========================================
def enviar_correo_smtp(destinatario, codigo):
  remitente = os.getenv("MAIL_USERNAME", "Luistimaure1204@gmail.com")
  password_app = os.getenv("MAIL_PASSWORD", "lrjh zcif ylza ypza")

  mensaje = MIMEMultipart()
  mensaje["From"] = remitente
  mensaje["To"] = destinatario
  mensaje["Subject"] = "Código de Recuperación - TrainNote"

  cuerpo = f"""
    Hola:
    Has solicitado restablecer tu contraseña en TrainNote.
    Tu código de seguridad de 6 dígitos es: {codigo}
    Este código expirará en 15 minutos. Si realizaste esta solicitud ignora este mensaje.
    """
  mensaje.attach(MIMEText(cuerpo, "plain"))

  try:
    servidor = smtplib.SMTP("smtp.gmail.com", 587)
    servidor.starttls()
    servidor.login(remitente, password_app)
    servidor.sendmail(remitente, destinatario, mensaje.as_string())
    servidor.quit()
    return True
  except Exception as e:
    print(f"Error detallado al enviar correo: {e}")
    return False


# ==========================================
# ENDPOINT DE REGISTRO
# ==========================================
@api_bp.route("/api/register", methods=["POST"])
def register():
  data = request.get_json() or {}

  nombre = data.get("nombre")
  correo = data.get("email") 
  password = data.get("password")

  if not nombre or not correo or not password:
    return (
        jsonify({
            "error": "Todos los campos (nombre, email, contraseña) son obligatorios."
        }),
        400,
    )

  if Usuario.query.filter_by(correo=correo).first():
    return jsonify({"error": "El correo electrónico ya está registrado."}), 400

  nuevo_usuario = Usuario(
      nombre=nombre,
      correo=correo,
      password=generate_password_hash(password),
      url_foto=data.get("url_foto", "default.png"),
      altura=data.get("altura", 0.0),
      objetivo=data.get("objetivo", "General"),
      peso_deseado=data.get("peso_deseado", 0.0),
  )

  try:
    db.session.add(nuevo_usuario)
    db.session.commit()
    return (
        jsonify({
            "message": "Usuario creado exitosamente",
            "user": nuevo_usuario.serialize(),
        }),
        201,
    )
  except Exception as e:
    db.session.rollback()
    return jsonify({"error": str(e)}), 500


# ==========================================
# ENDPOINTS DE LOGIN Y LOGOUT
# ==========================================
@api_bp.route("/api/login", methods=["POST"])
def login():
  data = request.get_json() or {}
  correo = data.get("email") 
  password = data.get("password")

  if not correo or not password:
    return jsonify({"error": "Se requiere correo y contraseña."}), 400

  user = Usuario.query.filter_by(correo=correo).first()
  if not user or not check_password_hash(user.password, password):
    return (
        jsonify({"error": "Las credenciales no coinciden con las registradas."}),
        401,
    )

  access_token = create_access_token(identity=str(user.usuario_id))

  return (
      jsonify(
          {
              "message": "Inicio de sesión exitoso",
              "access_token": access_token,
              "user": user.serialize(),
          }
      ),
      200,
  )


@api_bp.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
  jti = get_jwt()["jti"]
  jwt_blacklist.add(jti)
  return jsonify({"message": "Sesión cerrada exitosamente."}), 200


# ==========================================
# ENDPOINTS DE RECUPERACIÓN DE CONTRASEÑA
# ==========================================
@api_bp.route("/api/request-code", methods=["POST"])
def request_code():
  data = request.get_json() or {}
  correo = data.get("email") 

  if not correo:
    return jsonify({"error": "El correo es obligatorio."}), 400

  user = Usuario.query.filter_by(correo=correo).first()
  if not user:
    return (
        jsonify({"error": "El correo no pertenece a un usuario registrado."}),
        404,
    )

  codigo_aleatorio = "".join([str(random.randint(0, 9)) for _ in range(6)])
  now = datetime.utcnow()
  expiration = now + timedelta(minutes=15)

  codigos_previos = CodigoRecuperacion.query.filter_by(
      usuario_id=user.usuario_id, estatus=EstatusEnum.ACTIVO
  ).all()
  for c in codigos_previos:
    c.estatus = EstatusEnum.EXPIRADO

  nuevo_codigo = CodigoRecuperacion(
      usuario_id=user.usuario_id,
      codigo=codigo_aleatorio,
      fecha_solicitud=now,
      fecha_expiracion=expiration,
      estatus=EstatusEnum.ACTIVO,
  )

  db.session.add(nuevo_codigo)
  db.session.commit()

  if not enviar_correo_smtp(correo, codigo_aleatorio):
    return jsonify({"error": "No se pudo enviar el correo de recuperación."}), 500

  return (
      jsonify({
          "message": "Código de recuperación enviado a tu correo"
      }),
      200,
  )


@api_bp.route("/api/verify-code", methods=["POST"])
def verify_code():
  data = request.get_json() or {}
  correo = data.get("email") 
  codigo_ingresado = data.get("codigo")

  if not correo or not codigo_ingresado:
    return jsonify({"error": "Correo y código son obligatorios."}), 400

  user = Usuario.query.filter_by(correo=correo).first()
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404

  registro_codigo = CodigoRecuperacion.query.filter_by(
      usuario_id=user.usuario_id,
      codigo=codigo_ingresado,
      estatus=EstatusEnum.ACTIVO,
  ).first()

  if not registro_codigo:
    return jsonify({"error": "Código inválido o ya utilizado."}), 400

  if datetime.utcnow() > registro_codigo.fecha_expiracion:
    registro_codigo.estatus = EstatusEnum.EXPIRADO
    db.session.commit()
    return jsonify({"error": "El código ha expirado."}), 400

  return jsonify({"message": "Código verificado correctamente."}), 200


@api_bp.route("/api/reset", methods=["POST"])
def reset_password():
  data = request.get_json() or {}
  correo = data.get("email") 
  codigo_ingresado = data.get("codigo")
  nuevo_password = data.get("password") or data.get("nuevo_password")

  if not correo or not codigo_ingresado or not nuevo_password:
    return jsonify({"error": "Todos los campos son obligatorios."}), 400

  if len(nuevo_password) < 8:
    return (
        jsonify({
            "error": "La nueva contraseña debe tener al menos 8 caracteres."
        }),
        400,
    )

  user = Usuario.query.filter_by(correo=correo).first()
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404

  registro_codigo = CodigoRecuperacion.query.filter_by(
      usuario_id=user.usuario_id,
      codigo=codigo_ingresado,
      estatus=EstatusEnum.ACTIVO,
  ).first()

  if not registro_codigo or datetime.utcnow() > registro_codigo.fecha_expiracion:
    return jsonify({"error": "Código inválido, usado o expirado."}), 400

  user.password = generate_password_hash(nuevo_password)
  registro_codigo.estatus = EstatusEnum.USADO

  try:
    db.session.commit()
    return jsonify({"message": "Contraseña actualizada exitosamente."}), 200
  except Exception as e:
    db.session.rollback()
    return jsonify({"error": str(e)}), 500
  
# ==========================================
#  ENDPOINTS DE PERFIL 
# ==========================================
@api_bp.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
  current_user_id = get_jwt_identity()
  user = Usuario.query.get(current_user_id)
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404
  return jsonify(user.serialize()), 200


@api_bp.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
  current_user_id = get_jwt_identity()
  user = Usuario.query.get(current_user_id)
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404

  data = request.get_json() or {}

  if "email" in data:
    new_email = data.get("email") or data.get("correo")
    if new_email and new_email != user.correo:
      return jsonify({"error": "El correo no se puede actualizar."}), 400
  if "nombre" in data:
    user.nombre = data["nombre"]
  if "objetivo" in data:
    user.objetivo = data["objetivo"]
  if "peso_objetivo_kg" in data or "peso_deseado" in data:
    user.peso_deseado = data.get("peso_objetivo_kg") or data.get("peso_deseado")
  if "altura_cm" in data or "altura" in data:
    user.altura = data.get("altura_cm") or data.get("altura")
  if "url_foto_perfil" in data or "url_foto" in data:
    user.url_foto = data.get("url_foto_perfil") or data.get("url_foto")

  try:
    db.session.commit()
    return (
        jsonify({
            "message": "Datos personales actualizados exitosamente",
            "user": user.serialize(),
        }),
        200,
    )
  except Exception as e:
    db.session.rollback()
    return jsonify({"error": str(e)}), 500

@api_bp.route("/api/password", methods=["PUT"])
@jwt_required()
def update_password():
  current_user_id = get_jwt_identity()
  user = Usuario.query.get(current_user_id)
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404

  data = request.get_json() or {}
  current_password = data.get("current_password") or data.get("contrasena_actual")
  new_password = data.get("password") or data.get("nueva_contrasena")

  if not current_password or not new_password:
    return (
        jsonify({
            "error": (
                "La contraseña actual y la nueva contraseña son obligatorias."
            )
        }),
        400,
    )

  if not check_password_hash(user.password, current_password):
    return jsonify({"error": "La contraseña actual es incorrecta."}), 400


  if len(new_password) < 8:
    return (
        jsonify({
            "error": "La nueva contraseña debe tener al menos 8 caracteres."
        }),
        400,
    )

  user.password = generate_password_hash(new_password)

  try:
    db.session.commit()
    return jsonify({"message": "Contraseña actualizada exitosamente."}), 200
  except Exception as e:
    db.session.rollback()
    return jsonify({"error": str(e)}), 500
  
# ==========================================
# ENDPOINTS DE ENTRENAMIENTOS 
# ==========================================

@api_bp.route("/api/workouts", methods=["GET"])
@jwt_required()
def get_workouts():
  current_user_id = get_jwt_identity()
  workouts = Entrenamiento.query.filter_by(usuario_id=current_user_id).all()
  resultado = []
  for w in workouts:
      detalles = DetalleEntrenamiento.query.filter_by(entrenamiento_id=w.entrenamiento_id).all()
      w_dict = w.serialize()
      w_dict["ejercicios"] = []
      for d in detalles:
          ej = Ejercicio.query.get(d.ejercicio_id)
          w_dict["ejercicios"].append({
              "nombre_ejercicio": ej.nombre if ej else "",
              "series": d.serie,
              "repeticiones": d.repeticion,
              "peso_kg": d.peso_ejercicio
          })
      resultado.append(w_dict)
  return jsonify(resultado), 200


@api_bp.route("/api/workouts", methods=["POST"])
@jwt_required()
def create_workout():
  current_user_id = get_jwt_identity()
  user = Usuario.query.get(current_user_id)
  if not perfil_esta_completado(user):
    return (
        jsonify({
            "error": (
                "Debes completar tu perfil antes de registrar entrenamientos."
            )
        }),
        400,
    )
  data = request.get_json() or {}

  fecha_str = data.get("fecha")
  duracion = data.get("duracion_minutos") or data.get("duracion")
  notas = data.get("notas") or data.get("nota", "")
  ejercicios = data.get("ejercicios", [])

  if not fecha_str or not duracion or not ejercicios:
    return jsonify({"error": "Fecha, duración y al menos un ejercicio son obligatorios."}), 400

  try:
    duracion_int = int(duracion)
    if duracion_int <= 0:
      raise ValueError()
  except ValueError:
    return jsonify({"error": "La duración debe ser un número positivo."}), 400

  try:
    fecha_dt = datetime.strptime(fecha_str, "%Y-%m-%d").date()
  except Exception:
    return jsonify({"error": "Formato de fecha inválido (Use YYYY-MM-DD)."}), 400

  nuevo_entrenamiento = Entrenamiento(
      usuario_id=current_user_id,
      fecha=fecha_dt,
      duracion=duracion_int,
      nota=notas
  )
  db.session.add(nuevo_entrenamiento)
  db.session.flush() 

  for item in ejercicios:
    nombre_ej = item.get("nombre_ejercicio") or item.get("nombre")
    sets = item.get("series") or item.get("sets")
    reps = item.get("repeticiones") or item.get("reps")
    peso = item.get("peso_kg") or item.get("peso", 0)

    if not nombre_ej or not sets or not reps:
      db.session.rollback()
      return jsonify({"error": "Cada ejercicio requiere nombre, series y repeticiones."}), 400

    try:
      sets_int = int(sets)
      reps_int = int(reps)
      peso_int = int(peso)
      if sets_int <= 0 or reps_int <= 0:
        raise ValueError()
    except ValueError:
      db.session.rollback()
      return jsonify({"error": "Series y repeticiones deben ser números positivos."}), 400

    ejercicio_obj = Ejercicio.query.filter_by(nombre=nombre_ej).first()
    if not ejercicio_obj:
      ejercicio_obj = Ejercicio(nombre=nombre_ej)
      db.session.add(ejercicio_obj)
      db.session.flush()

    detalle = DetalleEntrenamiento(
        entrenamiento_id=nuevo_entrenamiento.entrenamiento_id,
        ejercicio_id=ejercicio_obj.ejercicio_id,
        serie=sets_int,
        repeticion=reps_int,
        peso_ejercicio=peso_int
    )
    db.session.add(detalle)

  db.session.commit()
  return jsonify({"message": "Entrenamiento registrado exitosamente", "id": nuevo_entrenamiento.entrenamiento_id}), 201


@api_bp.route("/api/workouts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_workout(id):
  current_user_id = get_jwt_identity()
  workout = Entrenamiento.query.get(id)
  if not workout or workout.usuario_id != int(current_user_id):
    return jsonify({"error": "Entrenamiento no encontrado o no autorizado."}), 404

  DetalleEntrenamiento.query.filter_by(entrenamiento_id=id).delete()
  db.session.delete(workout)
  db.session.commit()
  return jsonify({"message": "Entrenamiento eliminado exitosamente."}), 200


# ==========================================
# ENDPOINTS DE NUTRICIÓN
# ==========================================

@api_bp.route("/api/nutrition", methods=["GET"])
@jwt_required()
def get_nutrition():
  current_user_id = get_jwt_identity()
  items = Nutricion.query.filter_by(usuario_id=current_user_id).all()
  return jsonify([n.serialize() for n in items]), 200


@api_bp.route("/api/nutrition", methods=["POST"])
@jwt_required()
def create_nutrition():
  current_user_id = get_jwt_identity()
  user = Usuario.query.get(current_user_id)
  if not perfil_esta_completado(user):
    return (
        jsonify({
            "error": (
                "Debes completar tu perfil antes de registrar comidas."
            )
        }),
        400,
    )
  data = request.get_json() or {}

  fecha_str = data.get("fecha")
  nombre = data.get("nombre_de_la_comida") or data.get("nombre")
  tipo = data.get("tipo_de_comida") or data.get("tipo_comida")
  calorias = data.get("calorías") or data.get("caloria", 0)
  proteinas = data.get("proteínas_g") or data.get("proteina", 0)
  carbos = data.get("carbohidratos_g") or data.get("carbohidrato", 0)
  grasas = data.get("grasas_g") or data.get("grasa", 0)

  if not fecha_str or not nombre or not tipo:
    return jsonify({"error": "Fecha, nombre y tipo de comida son obligatorios."}), 400

  try:
    fecha_dt = datetime.strptime(fecha_str, "%Y-%m-%d").date()
  except Exception:
    return jsonify({"error": "Formato de fecha inválido (Use YYYY-MM-DD)."}), 400

  nueva_comida = Nutricion(
      usuario_id=current_user_id,
      tipo_comida=tipo,
      fecha=fecha_dt,
      nombre=nombre,
      proteina=proteinas,
      caloria=calorias,
      grasa=grasas,
      carbohidrato=carbos
  )

  db.session.add(nueva_comida)
  db.session.commit()
  return jsonify({"message": "Registro de nutrición creado", "id": nueva_comida.nutricion_id}), 201


@api_bp.route("/api/nutrition/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_nutrition(id):
  current_user_id = get_jwt_identity()
  item = Nutricion.query.get(id)
  if not item or item.usuario_id != int(current_user_id):
    return jsonify({"error": "Registro no encontrado o no autorizado."}), 404

  db.session.delete(item)
  db.session.commit()
  return jsonify({"message": "Registro de nutrición eliminado."}), 200


# ==========================================
# ENDPOINTS DE PESO CORPORAL 
# ==========================================

@api_bp.route("/api/weights", methods=["GET"])
@jwt_required()
def get_weights():
  current_user_id = get_jwt_identity()
  pesos = Peso.query.filter_by(usuario_id=current_user_id).all()
  return jsonify([p.serialize() for p in pesos]), 200


@api_bp.route("/api/weights", methods=["POST"])
@jwt_required()
def create_weight():
  current_user_id = get_jwt_identity()
  user = Usuario.query.get(current_user_id)

  # Validación de perfil completado
  if not perfil_esta_completado(user):
    return (
        jsonify({
            "error": (
                "Debes completar tu perfil antes de registrar tu peso."
            )
        }),
        400,
    )
  data = request.get_json() or {}

  fecha_str = data.get("fecha")
  peso_kg = data.get("peso_kg")

  if not fecha_str or peso_kg is None:
    return jsonify({"error": "La fecha y el peso son obligatorios."}), 400

  try:
    peso_val = float(peso_kg)
    if peso_val <= 0:
      raise ValueError()
  except ValueError:
    return jsonify({"error": "El peso debe ser mayor que cero."}), 400

  try:
    fecha_dt = datetime.strptime(fecha_str, "%Y-%m-%d").date()
  except Exception:
    return jsonify({"error": "Formato de fecha inválido (Use YYYY-MM-DD)."}), 400


  existente = Peso.query.filter_by(usuario_id=current_user_id, fecha=fecha_dt).first()
  if existente:
    return jsonify({"error": "Ya existe un registro de peso para esta fecha."}), 400

  nuevo_peso = Peso(
      usuario_id=current_user_id,
      fecha=fecha_dt,
      peso_kg=peso_val
  )
  db.session.add(nuevo_peso)
  db.session.commit()

  return jsonify({"message": "Peso registrado exitosamente", "id": nuevo_peso.peso_id}), 201


@api_bp.route("/api/weights/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_weight(id):
  current_user_id = get_jwt_identity()
  peso_reg = Peso.query.get(id)
  if not peso_reg or peso_reg.usuario_id != int(current_user_id):
    return jsonify({"error": "Registro de peso no encontrado o no autorizado."}), 404

  db.session.delete(peso_reg)
  db.session.commit()
  return jsonify({"message": "Registro de peso eliminado."}), 200