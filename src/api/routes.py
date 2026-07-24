from datetime import date, datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
import os
import random
import re
import smtplib
import time

from api.models import (
    CodigoRecuperacion,
    DetalleEntrenamiento,
    Ejercicio,
    Entrenamiento,
    EstatusEnum,
    Nutricion,
    Peso,
    PlanIA,
    TipoPlanEnum,
    Usuario,
    db,
)
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from google import genai
from google.genai import types
from werkzeug.security import check_password_hash, generate_password_hash

api_bp = Blueprint("api_bp", __name__)

jwt_blacklist = set()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

# ==========================================
# UTILIDADES CONEXION CON GEMINIS
# ==========================================
MODELOS_FALLBACK = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash'] 
MAX_REINTENTOS = 1


def extraer_retry_delay(mensaje, default=20):
  match = re.search(r"retryDelay['\"]?:\s*['\"]?(\d+)", mensaje)
  if match:
    return int(match.group(1))
  return default


def generar_con_reintentos(prompt_texto):
  ultimo_error = None

  for modelo in MODELOS_FALLBACK:
    for intento in range(MAX_REINTENTOS):
      try:
        response = client.models.generate_content(
            model=modelo,
            contents=prompt_texto,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3,
                max_output_tokens=4096,
            ),
        )
        return response, modelo
      except Exception as e:
        mensaje = str(e)
        ultimo_error = e
        es_429 = "429" in mensaje or "RESOURCE_EXHAUSTED" in mensaje
        es_404 = "404" in mensaje or "NOT_FOUND" in mensaje

        if es_404:
          break

        if not es_429:
          raise

        es_limite_diario = "PerDay" in mensaje or "RPD" in mensaje

        if es_limite_diario or intento == MAX_REINTENTOS - 1:
          break

        espera = min(extraer_retry_delay(mensaje), 10) + random.uniform(0, 1)
        time.sleep(espera)

  raise ultimo_error

# ==========================================
# UTILIDADES CONFIRMACION DE PERFIL COMPLETADO
# ==========================================
def perfil_esta_completado(user):
  if not user:
    return False
  if not user.altura or user.altura <= 0:
    return False
  if not user.objetivo or user.objetivo == "General":
    return False
  if not user.peso_deseado or user.peso_deseado <= 0:
    return False
  return True

# ==========================================
# UTILIDADES VALIDACION DE FECHAS
# ==========================================
def parsear_rango_fechas(request_args):
  """Valida y extrae las fechas 'desde' y 'hasta' enviadas por query string."""
  desde_str = request_args.get("desde")
  hasta_str = request_args.get("hasta")

  fecha_desde = None
  fecha_hasta = None

  try:
    if desde_str:
      fecha_desde = datetime.strptime(desde_str, "%Y-%m-%d").date()
    if hasta_str:
      fecha_hasta = datetime.strptime(hasta_str, "%Y-%m-%d").date()
  except ValueError:
    return None, None, "El formato de fecha debe ser YYYY-MM-DD."

  return fecha_desde, fecha_hasta, None

# ==========================================
# UTILIDADES ENVIO DE CORREO CON GMAIL
# ==========================================
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
import os
import smtplib


def enviar_correo_smtp(destinatario, codigo):
  remitente = os.getenv("MAIL_USERNAME")
  password_app = os.getenv("MAIL_PASSWORD")

  if not remitente or not password_app:
    return False

  # Obtener fecha y hora actual formateada
  ahora = datetime.now()
  fecha_hora_asunto = ahora.strftime("%d/%m/%Y a las %H:%M")


  mensaje = MIMEMultipart("alternative")
  mensaje["From"] = f"TrainNote <{remitente}>"
  mensaje["To"] = destinatario
  mensaje["Reply-To"] = remitente
  mensaje["Subject"] = f"Código de Recuperación - TrainNote [{fecha_hora_asunto}]"
  mensaje["Date"] = formatdate(localtime=True)
  mensaje["Message-ID"] = make_msgid(domain="trainnote.com")

  texto_plano = f"""
Hola:

Has solicitado restablecer tu contraseña en TrainNote el {fecha_hora_asunto}.

Tu código de seguridad es: {codigo}

Este código expirará en 15 minutos. Si no realizaste esta solicitud, puedes ignorar este mensaje de forma segura.

Atentamente,
El equipo de TrainNote.
"""
  texto_html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Código de Recuperación - TrainNote</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333333;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #2c3e50; text-align: center; margin-top: 0;">TrainNote</h2>
    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
    <p>Hola,</p>
    <p>Has solicitado restablecer tu contraseña para tu cuenta de <strong>TrainNote</strong> el <em>{fecha_hora_asunto}</em>.</p>
    <p>Utiliza el siguiente código de verificación de 6 dígitos:</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; background-color: #eff6ff; padding: 10px 20px; border-radius: 6px; border: 1px dashed #2563eb; display: inline-block;">
        {codigo}
      </span>
    </div>

    <p style="font-size: 14px; color: #666666;">Este código es válido durante <strong>15 minutos</strong>.</p>
    <p style="font-size: 13px; color: #888888; margin-top: 25px;">Si no has sido tú quien solicitó este cambio, puedes ignorar este mensaje con seguridad.</p>
    
    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
    <p style="font-size: 12px; color: #aaaaaa; text-align: center; margin-bottom: 0;">&copy; {ahora.year} TrainNote. Todos los derechos reservados.</p>
  </div>
</body>
</html>
"""

  mensaje.attach(MIMEText(texto_plano, "plain", "utf-8"))
  mensaje.attach(MIMEText(texto_html, "html", "utf-8"))

  try:
    servidor = smtplib.SMTP("smtp.gmail.com", 587)
    servidor.starttls()
    servidor.login(remitente, password_app)
    servidor.sendmail(remitente, destinatario, mensaje.as_string())
    servidor.quit()
    return True
  except Exception as e:

    return False
  
# ==========================================
# ENDPOINTS DE AUTENTICACIÓN
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
            "error": (
                "Todos los campos (nombre, email, contraseña) son obligatorios."
            )
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
            "message": "Usuario creado exitosamente.",
            "user": nuevo_usuario.serialize(),
        }),
        201,
    )
  except Exception:
    db.session.rollback()
    return (
        jsonify({
            "error": (
                "Ocurrió un inconveniente al procesar el registro. Intente de"
                " nuevo."
            )
        }),
        500,
    )


@api_bp.route("/api/login", methods=["POST"])
def login():
  data = request.get_json() or {}
  correo = data.get("email").lower().strip()
  password = data.get("password")

  if not correo or not password:
    return jsonify({"error": "Se requiere correo y contraseña."}), 400

  user = Usuario.query.filter_by(correo=correo).first()
  if not user or not check_password_hash(user.password, password):
    return (
        jsonify(
            {"error": "Las credenciales no coinciden con las registradas."}
        ),
        401,
    )

  access_token = create_access_token(identity=str(user.usuario_id))

  return (
      jsonify({
          "message": "Inicio de sesión exitoso.",
          "access_token": access_token,
          "user": user.serialize(),
      }),
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
  correo = data.get("email").lower().strip()

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
    return (
        jsonify({"error": "No se pudo enviar el correo de recuperación."}),
        500,
    )

  return (
      jsonify({"message": "Código de recuperación enviado a tu correo."}),
      200,
  )


@api_bp.route("/api/verify-code", methods=["POST"])
def verify_code():
  data = request.get_json() or {}
  correo = data.get("email").lower().strip()
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
  correo = data.get("email").lower().strip()
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
  except Exception:
    db.session.rollback()
    return (
        jsonify(
            {"error": "No se pudo reestablecer la contraseña. Intente luego."}
        ),
        500,
    )


# ==========================================
# ENDPOINTS DE PERFIL
# ==========================================
@api_bp.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
  current_user_id = int(get_jwt_identity())
  user = Usuario.query.get(current_user_id)
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404
  return jsonify(user.serialize()), 200


@api_bp.route("/api/profile", methods=["PUT"])
@jwt_required()
def update_profile():
  current_user_id = int(get_jwt_identity())
  user = Usuario.query.get(current_user_id)
  if not user:
    return jsonify({"error": "Usuario no encontrado."}), 404

  data = request.get_json() or {}

  if "email" in data or "correo" in data:
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
  if "url_ foto_perfil" in data or "url_foto" in data:
    user.url_foto = data.get("url_foto_perfil") or data.get("url_foto")
  try:
    db.session.commit()
    return (
        jsonify({
            "message": "Datos personales actualizados exitosamente.",
            "user": user.serialize(),
        }),
        200,
    )
  except Exception as e:
    db.session.rollback()
    return (
        jsonify({"error": "No se pudo actualizar el perfil correctamente."}),
        500,
    )

@api_bp.route("/api/password", methods=["PUT"])
@jwt_required()
def update_password():
  current_user_id = int(get_jwt_identity())
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
  except Exception:
    db.session.rollback()
    return (
        jsonify({"error": "No se pudo cambiar la contraseña. Intente luego."}),
        500,
    )
# ==========================================
# ENDPOINTS DE EJERCICIO
# ==========================================
@api_bp.route("/api/exercises", methods=["GET"])
@jwt_required()
def get_exercises():
    ejercicios = Ejercicio.query.all()
    return jsonify([e.serialize() for e in ejercicios]), 200
# ==========================================
# ENDPOINTS DE ENTRENAMIENTOS
# ==========================================
@api_bp.route("/api/workouts", methods=["GET"])
@jwt_required()
def get_workouts():
  current_user_id = int(get_jwt_identity())

  fecha_desde, fecha_hasta, error_fecha = parsear_rango_fechas(request.args)
  if error_fecha:
    return jsonify({"error": error_fecha}), 400

  query = Entrenamiento.query.filter_by(usuario_id=current_user_id)

  if fecha_desde:
    query = query.filter(Entrenamiento.fecha >= fecha_desde)
  if fecha_hasta:
    query = query.filter(Entrenamiento.fecha <= fecha_hasta)

  workouts = query.order_by(Entrenamiento.fecha.desc()).all()

  resultado = []
  for w in workouts:
    detalles = DetalleEntrenamiento.query.filter_by(
        entrenamiento_id=w.entrenamiento_id
    ).all()
    w_dict = w.serialize()
    w_dict["ejercicios"] = []
    for d in detalles:
      ej = Ejercicio.query.get(d.ejercicio_id)
      w_dict["ejercicios"].append({
          "nombre_ejercicio": ej.nombre if ej else "",
          "series": d.serie,
          "repeticiones": d.repeticion,
          "peso_kg": d.peso_ejercicio,
      })
    resultado.append(w_dict)

  return jsonify(resultado), 200


@api_bp.route("/api/workouts", methods=["POST"])
@jwt_required()
def create_workout():
  current_user_id = int(get_jwt_identity())
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
    return (
        jsonify({
            "error": (
                "Fecha, duración y al menos un ejercicio son obligatorios."
            )
        }),
        400,
    )

  try:
    duracion_int = int(duracion)
    if duracion_int <= 0:
      raise ValueError()
  except ValueError:
    return jsonify({"error": "La duración debe ser un número positivo."}), 400

  try:
    fecha_dt = datetime.strptime(fecha_str, "%Y-%m-%d").date()
  except Exception:
    return (
        jsonify({"error": "Formato de fecha inválido (Utiliza YYYY-MM-DD)."}),
        400,
    )

  nuevo_entrenamiento = Entrenamiento(
      usuario_id=current_user_id,
      fecha=fecha_dt,
      duracion=duracion_int,
      nota=notas,
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
      return (
          jsonify({
              "error": (
                  "Cada ejercicio requiere nombre, series y repeticiones."
              )
          }),
          400,
      )

    try:
      sets_int = int(sets)
      reps_int = int(reps)
      peso_int = int(peso)
      if sets_int <= 0 or reps_int <= 0:
        raise ValueError()
    except ValueError:
      db.session.rollback()
      return (
          jsonify({
              "error": (
                  "Series y repeticiones deben ser números enteros positivos."
              )
          }),
          400,
      )

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
        peso_ejercicio=peso_int,
    )
    db.session.add(detalle)

  try:
    db.session.commit()
    return (
        jsonify({
            "message": "Entrenamiento registrado exitosamente.",
            "id": nuevo_entrenamiento.entrenamiento_id,
        }),
        201,
    )
  except Exception:
    db.session.rollback()
    return (
        jsonify({"error": "No se pudo registrar el entrenamiento."}),
        500,
    )


@api_bp.route("/api/workouts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_workout(id):
  current_user_id = int(get_jwt_identity())
  workout = Entrenamiento.query.get(id)

  if not workout or workout.usuario_id != current_user_id:
    return (
        jsonify({"error": "Entrenamiento no encontrado o no autorizado."}),
        404,
    )

  try:
    DetalleEntrenamiento.query.filter_by(entrenamiento_id=id).delete()
    db.session.delete(workout)
    db.session.commit()
    return jsonify({"message": "Entrenamiento eliminado exitosamente."}), 200
  except Exception:
    db.session.rollback()
    return (
        jsonify({"error": "Ocurrió un error al eliminar el entrenamiento."}),
        500,
    )


# ==========================================
# ENDPOINTS DE NUTRICIÓN
# ==========================================
@api_bp.route("/api/nutrition", methods=["GET"])
@jwt_required()
def get_nutrition():
  current_user_id = int(get_jwt_identity())

  fecha_desde, fecha_hasta, error_fecha = parsear_rango_fechas(request.args)
  if error_fecha:
    return jsonify({"error": error_fecha}), 400

  query = Nutricion.query.filter_by(usuario_id=current_user_id)

  if fecha_desde:
    query = query.filter(Nutricion.fecha >= fecha_desde)
  if fecha_hasta:
    query = query.filter(Nutricion.fecha <= fecha_hasta)

  items = query.order_by(Nutricion.fecha.desc()).all()
  return jsonify([n.serialize() for n in items]), 200


@api_bp.route("/api/nutrition", methods=["POST"])
@jwt_required()
def create_nutrition():
  current_user_id = int(get_jwt_identity())
  user = Usuario.query.get(current_user_id)

  if not perfil_esta_completado(user):
    return (
        jsonify(
            {"error": "Debes completar tu perfil antes de registrar comidas."}
        ),
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
    return (
        jsonify({"error": "Fecha, nombre y tipo de comida son obligatorios."}),
        400,
    )

  try:
    fecha_dt = datetime.strptime(fecha_str, "%Y-%m-%d").date()
  except Exception:
    return (
        jsonify({"error": "Formato de fecha inválido (Utiliza YYYY-MM-DD)."}),
        400,
    )

  tipo_limpio = str(tipo).strip().upper()
  
  if tipo_limpio in ["DESAYUNO", "ALMUERZO", "CENA"]:
    existente = Nutricion.query.filter_by(
        usuario_id=current_user_id,
        fecha=fecha_dt,
        tipo_comida=tipo
    ).first()

    if existente:
      return (
          jsonify({
              "error": f"Ya tienes registrado un {tipo.lower()} para esta fecha. Solo se permite uno por día."
          }),
          400,
      )

  nueva_comida = Nutricion(
      usuario_id=current_user_id,
      tipo_comida=tipo,
      fecha=fecha_dt,
      nombre=nombre,
      proteina=proteinas,
      caloria=calorias,
      grasa=grasas,
      carbohidrato=carbos,
  )

  try:
    db.session.add(nueva_comida)
    db.session.commit()
    return (
        jsonify({
            "message": "Registro de nutrición creado exitosamente.",
            "id": nueva_comida.nutricion_id,
        }),
        201,
    )
  except Exception:
    db.session.rollback()
    return (
        jsonify({"error": "No se pudo guardar la información nutricional."}),
        500,
    )

@api_bp.route("/api/nutrition/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_nutrition(id):
  current_user_id = int(get_jwt_identity())
  item = Nutricion.query.get(id)

  if not item or item.usuario_id != current_user_id:
    return jsonify({"error": "Registro no encontrado o no autorizado."}), 404

  try:
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Registro de nutrición eliminado."}), 200
  except Exception:
    db.session.rollback()
    return jsonify({"error": "No se pudo eliminar el registro."}), 500


# ==========================================
# ENDPOINTS DE PESO CORPORAL
# ==========================================
@api_bp.route("/api/weights", methods=["GET"])
@jwt_required()
def get_weights():
  current_user_id = int(get_jwt_identity())

  fecha_desde, fecha_hasta, error_fecha = parsear_rango_fechas(request.args)
  if error_fecha:
    return jsonify({"error": error_fecha}), 400

  query = Peso.query.filter_by(usuario_id=current_user_id)

  if fecha_desde:
    query = query.filter(Peso.fecha >= fecha_desde)
  if fecha_hasta:
    query = query.filter(Peso.fecha <= fecha_hasta)

  pesos = query.order_by(Peso.fecha.desc()).all()
  return jsonify([p.serialize() for p in pesos]), 200


@api_bp.route("/api/weights", methods=["POST"])
@jwt_required()
def create_weight():
  current_user_id = int(get_jwt_identity())
  user = Usuario.query.get(current_user_id)

  if not perfil_esta_completado(user):
    return (
        jsonify(
            {"error": "Debes completar tu perfil antes de registrar tu peso."}
        ),
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
    return (
        jsonify({"error": "Formato de fecha inválido (Utiliza YYYY-MM-DD)."}),
        400,
    )

  existente = Peso.query.filter_by(
      usuario_id=current_user_id, fecha=fecha_dt
  ).first()
  if existente:
    return (
        jsonify({"error": "Ya existe un registro de peso para esta fecha."}),
        400,
    )

  nuevo_peso = Peso(
      usuario_id=current_user_id, fecha=fecha_dt, peso_kg=peso_val
  )

  try:
    db.session.add(nuevo_peso)
    db.session.commit()
    return (
        jsonify({
            "message": "Peso registrado exitosamente.",
            "id": nuevo_peso.peso_id,
        }),
        201,
    )
  except Exception:
    db.session.rollback()
    return jsonify({"error": "No se pudo guardar el peso."}), 500


@api_bp.route("/api/weights/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_weight(id):
  current_user_id = int(get_jwt_identity())
  peso_reg = Peso.query.get(id)

  if not peso_reg or peso_reg.usuario_id != current_user_id:
    return (
        jsonify({"error": "Registro de peso no encontrado o no autorizado."}),
        404,
    )

  try:
    db.session.delete(peso_reg)
    db.session.commit()
    return jsonify({"message": "Registro de peso eliminado."}), 200
  except Exception:
    db.session.rollback()
    return jsonify({"error": "No se pudo eliminar el registro."}), 500


# ==========================================
# ENDPOINTS DE PROGRESO
# ==========================================
@api_bp.route("/api/progress_summary", methods=["GET"])
@jwt_required()
def get_progress_summary():
    current_user_id = int(get_jwt_identity())
    user = Usuario.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado."}), 404

    primer_peso_row = (
        Peso.query.filter_by(usuario_id=current_user_id)
        .order_by(Peso.fecha.asc())
        .first()
    )
    
    ultimo_peso_row = (
        Peso.query.filter_by(usuario_id=current_user_id)
        .order_by(Peso.fecha.desc())
        .first()
    )

    peso_inicial = float(primer_peso_row.peso_kg) if primer_peso_row else None
    peso_actual = float(ultimo_peso_row.peso_kg) if ultimo_peso_row else None
    peso_deseado = float(user.peso_deseado) if user.peso_deseado else None

    cambio_total = None
    if peso_inicial is not None and peso_actual is not None:
        cambio_total = round(peso_actual - peso_inicial, 2)
  
    hoy = date.today()
    inicio_mes = hoy.replace(day=1)
    inicio_semana = hoy - timedelta(days=hoy.weekday())

    workouts_mes = Entrenamiento.query.filter(
        Entrenamiento.usuario_id == current_user_id,
        Entrenamiento.fecha >= inicio_mes,
    ).count()

    workouts_semana = Entrenamiento.query.filter(
        Entrenamiento.usuario_id == current_user_id,
        Entrenamiento.fecha >= inicio_semana,
    ).count()

    max_duracion_row = (
        db.session.query(db.func.max(Entrenamiento.duracion))
        .filter(Entrenamiento.usuario_id == current_user_id)
        .scalar()
    )
    mejor_duracion_min = max_duracion_row if max_duracion_row else 0

    nutricion_stats = (
        db.session.query(
            db.func.avg(Nutricion.caloria), db.func.avg(Nutricion.proteina)
        )
        .filter(Nutricion.usuario_id == current_user_id)
        .first()
    )

    promedio_calorias = (
        round(float(nutricion_stats[0]), 2)
        if nutricion_stats and nutricion_stats[0]
        else 0
    )
    promedio_proteinas = (
        round(float(nutricion_stats[1]), 2)
        if nutricion_stats and nutricion_stats[1]
        else 0
    )

    return (
        jsonify({
            "peso_inicial": peso_inicial,
            "peso_actual": peso_actual,
            "peso_deseado": peso_deseado,
            "cambio_total_kg": cambio_total,
            "workouts_mes": workouts_mes,
            "workouts_semana": workouts_semana,
            "mejor_duracion_minutos": mejor_duracion_min,
            "promedio_calorias": promedio_calorias,
            "promedio_proteinas_g": promedio_proteinas,
        }),
        200,
    )

@api_bp.route("/api/progress_weight", methods=["GET"])
@jwt_required()
def get_progress_weight():
  current_user_id = int(get_jwt_identity())

  fecha_desde, fecha_hasta, error_fecha = parsear_rango_fechas(request.args)
  if error_fecha:
    return jsonify({"error": error_fecha}), 400

  query = Peso.query.filter_by(usuario_id=current_user_id)

  if fecha_desde:
    query = query.filter(Peso.fecha >= fecha_desde)
  if fecha_hasta:
    query = query.filter(Peso.fecha <= fecha_hasta)

  pesos = query.order_by(Peso.fecha.asc()).all()

  grafico = []
  for idx, p in enumerate(pesos, start=1):
    grafico.append({
        "semana": f"Semana {idx}",
        "fecha": p.fecha.isoformat(),
        "peso_kg": float(p.peso_kg),
    })

  return jsonify(grafico), 200


# ==========================================
# ENDPOINTS DE PLAN IA
# ==========================================
@api_bp.route("/api/plans", methods=["POST"])
@jwt_required()
def create_plan():
  current_user_id = int(get_jwt_identity())
  user = Usuario.query.get(current_user_id)

  if not user or not perfil_esta_completado(user):
    return (
        jsonify({
            "error": (
                "Debes completar tu perfil antes de generar planes"
                " personalizados."
            )
        }),
        400,
    )

  data = request.get_json() or {}
  tipo_plan_input = (data.get("tipo_plan") or "").lower()

  if tipo_plan_input not in [
      "entrenamiento",
      "nutricion",
      "training",
      "nutrition",
  ]:
    return (
        jsonify({
            "error": "El tipo de plan debe ser 'entrenamiento' o 'nutricion'."
        }),
        400,
    )

  if tipo_plan_input in ["entrenamiento", "training"]:
    req_fields = [
        "nivel",
        "dias_por_semana",
        "minutos_sesion",
        "equipamiento",
        "enfoque_principal",
    ]
    for field in req_fields:
      if not data.get(field):
        return (
            jsonify(
                {"error": f"El campo {field} es obligatorio para Entrenamiento."}
            ),
            400,
        )

    prompt_texto = f"""
        Genera un plan de entrenamiento personalizado con los siguientes datos:
        Objetivo principal: {user.objetivo}
        Nivel de entrenamiento: {data.get('nivel')}
        Días disponibles por semana: {data.get('dias_por_semana')}
        Tiempo disponible por sesión: {data.get('minutos_sesion')} minutos
        Equipo disponible: {data.get('equipamiento')}
        Enfoque principal: {data.get('enfoque_principal')}
        Lesiones o limitaciones: {data.get('lesiones_o_limitaciones', 'Ninguna')}

        Sigue todas las reglas del formato estructurado y devuelve únicamente un JSON válido con la clave "tipo_plan": "training".
        """
    enum_tipo = TipoPlanEnum.ENTRENAMIENTO

  else:
    req_fields = [
        "edad",
        "peso_actual_kg",
        "altura_cm",
        "nivel_actividad",
        "comidas_al_dia",
        "preferencias_dieteticas",
    ]
    for field in req_fields:
      if not data.get(field):
        return (
            jsonify(
                {"error": f"El campo {field} es obligatorio para Nutrición."}
            ),
            400,
        )

    prompt_texto = f"""
        Genera un plan de nutrición general personalizado con los siguientes datos:
        Objetivo principal: {user.objetivo}
        Edad: {data.get('edad')}
        Sexo biológico: {data.get('sexo_biologico', 'No especificado')}
        Peso actual: {data.get('peso_actual_kg')} kg
        Altura: {data.get('altura_cm')} cm
        Nivel de actividad física: {data.get('nivel_actividad')}
        Número de comidas por día: {data.get('comidas_al_dia')}
        Preferencia alimentaria: {data.get('preferencias_dieteticas')}
        Alergias o restricciones: {data.get('alergias_restricciones', 'Ninguna')}
        Alimentos excluidos: {data.get('alimentos_excluidos', 'Ninguno')}
        Peso deseado: {user.peso_deseado} kg
        Calorías objetivo: {data.get('calorias_objetivo', 'Calcular estimación aproximada')}

        Sigue todas las reglas del formato estructurado y devuelve únicamente un JSON válido con la clave "tipo_plan": "nutrition".
        """
    enum_tipo = TipoPlanEnum.NUTRICION

  try:
    response, modelo_usado = generar_con_reintentos(prompt_texto)

    texto_respuesta = response.text.strip()
    if texto_respuesta.startswith("```"):
      texto_respuesta = re.sub(r"^```(json)?", "", texto_respuesta)
      texto_respuesta = re.sub(r"```$", "", texto_respuesta).strip()

    resultado_json = json.loads(texto_respuesta)

  except Exception as e:
    return (
        jsonify({
            "error": (
                "No se pudo procesar la solicitud en este momento. Intente de"
                " nuevo."
            )
        }),
        500,
    )

  nuevo_plan = PlanIA(
      usuario_id=current_user_id,
      fecha=date.today(),
      tipo_plan=enum_tipo,
      prompt=prompt_texto,
      resultado=json.dumps(resultado_json),
  )

  try:
    db.session.add(nuevo_plan)
    db.session.commit()
    return (
        jsonify({
            "message": "Plan generado y guardado exitosamente.",
            "plan_id": nuevo_plan.plan_id,
            "resultado": resultado_json,
        }),
        201,
    )
  except Exception:
    db.session.rollback()
    return jsonify({"error": "No se pudo guardar el plan generado."}), 500


@api_bp.route("/api/plans", methods=["GET"])
@jwt_required()
def get_plans():
  current_user_id = int(get_jwt_identity())

  fecha_desde, fecha_hasta, error_fecha = parsear_rango_fechas(request.args)
  if error_fecha:
    return jsonify({"error": error_fecha}), 400

  query = PlanIA.query.filter_by(usuario_id=current_user_id)

  if fecha_desde:
    query = query.filter(PlanIA.fecha >= fecha_desde)
  if fecha_hasta:
    query = query.filter(PlanIA.fecha <= fecha_hasta)

  planes = query.order_by(PlanIA.fecha.desc()).all()
  return jsonify([p.serialize() for p in planes]), 200


@api_bp.route("/api/plans/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_plan(id):
  current_user_id = int(get_jwt_identity())
  plan = PlanIA.query.get(id)

  if not plan or plan.usuario_id != current_user_id:
    return jsonify({"error": "Plan no encontrado o no autorizado."}), 404

  try:
    db.session.delete(plan)
    db.session.commit()
    return jsonify({"message": "Plan eliminado exitosamente."}), 200
  except Exception:
    db.session.rollback()
    return jsonify({"error": "No se pudo eliminar el plan."}), 500