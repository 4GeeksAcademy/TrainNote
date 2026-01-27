"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import User, Students_Group, Group
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from functools import wraps
# from models import Person


def role_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorated(*args, **kwargs):
            identity = get_jwt_identity()
            if identity["role"] not in roles:
                return jsonify({"msg": "Acceso no autorizado"}), 403
            return fn(*args, **kwargs)
        return decorated
    return wrapper


ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

#                  ENDPOINT REGISTER


@app.route("/register", methods=["POST"])
def register():
    try:
        body = request.get_json(silent=True)

        if not body:
            return jsonify({"msg": "Debes enviar información en el body"}), 400

        required_fields = ["email", "password", "name"]
        for field in required_fields:
            if field not in body:
                return jsonify({"msg": f"El campo {field} es obligatorio"}), 400

        if User.query.filter_by(email=body["email"]).first():
            return jsonify({"msg": "Este email ya está en uso"}), 409

        new_user = User(
            email=body["email"],
            password=body["password"],
            name=body["name"],
            role="STUDENT",
            is_active=True
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Estudiante registrado correctamente"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Error de integridad en la base de datos"}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Error interno del servidor",
            "error": str(e)
        }), 500

#             ENDPOINT LOGIN


@app.route("/login", methods=["POST"])
def login():
    try:
        body = request.get_json(silent=True)

        if body is None:
            return jsonify({'msg': 'Debes enviar información en el body'}), 400

        if 'email' not in body or 'password' not in body:
            return jsonify({'msg': 'Email y password son obligatorios'}), 400

        user = None
        role = None

        users_models = [
            (Student, "STUDENT"),
            (Teacher, "TEACHER"),
            (Admin, "ADMIN")
        ]

        for model, r in users_models:
            user = model.query.filter_by(email=body['email']).first()
            if user:
                role = r
                break

        if not user or user.password != body['password']:
            return jsonify({'msg': 'Credenciales incorrectas'}), 401

        access_token = create_access_token(
            identity={
                "user_id": user.id,
                "role": role
            }
        )

        return jsonify({
            "access_token": access_token,
            "role": role
        }), 200

    except Exception as e:
        return jsonify({
            'msg': 'Error interno del servidor',
            'error': str(e)
        }), 500

#             ENDPOINTS GROUP


@app.route("/groups", methods=["POST"])
@role_required("ADMIN")
def create_group():
    body = request.get_json()

    if not body or "name" not in body or "teacher_id" not in body:
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    admin_id = get_jwt_identity()["user_id"]

    group = Group(
        name=body["name"],
        description=body.get("description"),
        admin_id=admin_id,
        teacher_id=body["teacher_id"]
    )

    db.session.add(group)
    db.session.commit()

    return jsonify({"msg": "Grupo creado", "group_id": group.id}), 201


@app.route("/groups", methods=["GET"])
@role_required("ADMIN", "TEACHER")
def get_groups():
    identity = get_jwt_identity()

    if identity["role"] == "ADMIN":
        groups = Group.query.filter_by(admin_id=identity["user_id"]).all()
    else:
        groups = Group.query.filter_by(teacher_id=identity["user_id"]).all()

    return jsonify([
        {
            "id": g.id,
            "name": g.name,
            "description": g.description
        } for g in groups
    ]), 200


@app.route("/groups/<int:group_id>", methods=["GET"])
@role_required("ADMIN", "TEACHER")
def get_group(group_id):
    group = Group.query.get(group_id)

    if not group:
        return jsonify({"msg": "Grupo no encontrado"}), 404

    return jsonify({
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "teacher_id": group.teacher_id
    }), 200


@app.route("/groups/<int:group_id>/students", methods=["POST"])
@role_required("ADMIN")
def add_student_to_group(group_id):
    body = request.get_json()

    if not body or "student_id" not in body:
        return jsonify({"msg": "student_id requerido"}), 400

    relation = Students_Group(
        user_id=body["student_id"],
        group_id=group_id
    )

    db.session.add(relation)
    db.session.commit()

    return jsonify({"msg": "Estudiante agregado al grupo"}), 201


@app.route("/groups/<int:group_id>/teacher", methods=["POST"])
@role_required("ADMIN")
def assign_teacher(group_id):
    body = request.get_json()

    if not body or "teacher_id" not in body:
        return jsonify({"msg": "teacher_id requerido"}), 400

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Grupo no encontrado"}), 404

    group.teacher_id = body["teacher_id"]
    db.session.commit()

    return jsonify({"msg": "Profesor asignado"}), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
