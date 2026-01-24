"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import Student, Teacher, Admin
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import JWTManager, create_access_token
# from models import Person

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


@app.route("/register", methods=["POST"])
def register():
    try:
        body = request.get_json(silent=True)

        if body is None:
            return jsonify({'msg': 'Debes enviar información en el body'}), 400

        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in body:
                return jsonify({'msg': f'El campo {field} es obligatorio'}), 400

        if (
            Student.query.filter_by(email=body['email']).first()
            or Teacher.query.filter_by(email=body['email']).first()
            or Admin.query.filter_by(email=body['email']).first()
        ):
            return jsonify({'msg': 'Este email ya está en uso'}), 409

        new_student = Student(
            email=body['email'],
            password=body['password'],
            first_name=body['first_name'],
            last_name=body['last_name']
        )

        db.session.add(new_student)
        db.session.commit()

        return jsonify({'msg': 'Student creado exitosamente'}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'msg': 'Error de integridad en la base de datos'}), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'msg': 'Error interno del servidor',
            'error': str(e)
        }), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        body = request.get_json(silent=True)

        if body is None:
            return jsonify({'msg': 'Debes enviar información en el body'}), 400

        if 'email' not in body or 'password' not in body:
            return jsonify({'msg': 'Email y password son obligatorios'}), 400

        user = Student.query.filter_by(email=body['email']).first()
        role = "Student"

        if not user:
            user = Teacher.query.filter_by(email=body['email']).first()
            role = "Teacher"

        if not user:
            user = Admin.query.filter_by(email=body['email']).first()
            role = "Admin"

        if not user or user.password != body['password']:
            return jsonify({'msg': 'Credenciales incorrectas'}), 401

        access_token = create_access_token(
            identity={
                "id": user.id,
                "role": role
            }
        )

        return jsonify({
            'access_token': access_token,
            'role': role
        }), 200

    except Exception as e:
        return jsonify({
            'msg': 'Error interno del servidor',
            'error': str(e)
        }), 500


@app.route("/groups/<int:group_id>/students", methods=["POST"])
@jwt_required()
@role_required("ADMIN")
def add_student_to_group(group_id):
    body = request.get_json()

    if not body or "user_id" not in body:
        return jsonify({"msg": "user_id es requerido"}), 400

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Grupo no encontrado"}), 404

    user = User.query.get(body["user_id"])
    if not user or user.role != "STUDENT":
        return jsonify({"msg": "Usuario no válido"}), 400

    exists = Students_Group.query.filter_by(
        user_id=user.id,
        group_id=group_id
    ).first()

    if exists:
        return jsonify({"msg": "El estudiante ya está en el grupo"}), 409

    student_group = Students_Group(
        user_id=user.id,
        group_id=group_id
    )

    db.session.add(student_group)
    db.session.commit()

    return jsonify({"msg": "Estudiante agregado al grupo"}), 201


@app.route("/groups/<int:group_id>/students", methods=["GET"])
@jwt_required()
@role_required("TEACHER", "ADMIN")
def get_group_students(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Grupo no encontrado"}), 404

    students = []
    for sg in group.students:
        students.append({
            "user_id": sg.user.id,
            "name": sg.user.name,
            "email": sg.user.email
        })

    return jsonify(students), 200


@app.route("/groups/<int:group_id>/students/<int:user_id>", methods=["DELETE"])
@jwt_required()
@role_required("ADMIN")
def remove_student_from_group(group_id, user_id):
    student_group = Students_Group.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()

    if not student_group:
        return jsonify({"msg": "Relación no encontrada"}), 404

    db.session.delete(student_group)
    db.session.commit()

    return jsonify({"msg": "Estudiante removido del grupo"}), 200


@app.route("/my-groups", methods=["GET"])
@jwt_required()
@role_required("STUDENT")
def get_my_groups():
    current_user = get_jwt_identity()

    relations = Students_Group.query.filter_by(
        user_id=current_user["id"]
    ).all()

    result = []
    for sg in relations:
        result.append({
            "group_id": sg.group.id,
            "group_name": sg.group.name,
            "description": sg.group.description
        })

    return jsonify(result), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
