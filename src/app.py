"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import Students_Group, Group, Todo, Submission, Status, User, db
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


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)







# SUBMISION POST SUBE TAREA DE UN ESTUDIANTE CON ID
@app.route("/submission", methods=["POST"])
def submission():
    try:
        body = request.get_json(silent=True)
        if body is None:
            return jsonify({'msg': 'Debes enviar información en el body'}), 400

        todo_id = body.get("todo_id")
        student_id = body.get("student_id")
        description = body.get("description")
        response_url = body.get("response_url")

        if todo_id is None or student_id is None:
            return jsonify({"msg": "todo_id y student_id son obligatorios"}), 400

        if not description and not response_url:
            return jsonify({"msg": "Debes enviar description o response_url"}), 400

        todo = Todo.query.get(todo_id)
        if not todo:
            return jsonify({"msg": "La tarea no existe"}), 404

        user = User.query.get(student_id)
        if not user:
            return jsonify({"msg": "Usuario no existe"}), 404

        if user.role.lower() != "student":  # el student tiene q venir en minuscula sino ponerle un .lower()
            return jsonify({"msg": "Solo un alumno puede crear una entrega"}), 403

        new_submission = Submission(

            description=description,
            response_url=response_url,
            todo_id=todo_id,
            student_id=student_id

        )

        db.session.add(new_submission)
        db.session.commit()

        return jsonify({
            "msg": "Entrega creada",
            "submission": {
                "id": new_submission.id,
                "todo_id": new_submission.todo_id,
                "student_id": new_submission.student_id,
                "description": new_submission.description,
                "response_url": new_submission.response_url

            }



        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Errpr interno del servidor", "error": str(e)}), 500

# SUBMISION PUT EDITA TAREA SUBIDA POR UN ESTUDIANTE CON ID
@app.route("/submission/<int:submission_id>", methods=["PUT"])
def update_submission(submission_id):

    try:
        body = request.get_json(silent=True) or {}

        description = body.get("description")
        response_url = body.get("response_url")

        if description is None and response_url is None:
            return jsonify({"msg": "No hay nada que actualizar"}), 400

        student_id = body.get("student_id")

        if student_id is None:
            return jsonify({"msg": "student_id es obligatorio"}), 400

        user = User.query.get(student_id)

        if not user:
            return jsonify({"msg": "Usuario no existe"}), 404

        if user.role.lower() != "student":
            return jsonify({"msg": "Solo un alumno puede modificar una entrega"}), 403

        submission = Submission.query.get(submission_id)
        if not submission:
            return jsonify({"msg": "No existe la entrega"}), 404

        if submission.student_id != student_id:
            return jsonify({"msg": "No autorizado para modificar esta entrega"}), 403

        if description is not None:
            submission.description = description

        if response_url is not None:
            submission.response_url = response_url

        db.session.commit()

        return jsonify({
            "msg": "Entrega actualizada",
            "submission": {
                "id": submission.id,
                "description": submission.description,
                "response_url": submission.response_url,
                "todo_id": submission.todo_id,
                "student_id": submission.student_id

            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500


# SUBMISION DELETE TAREA SUBIDA POR UN ESTUDIANTE CON ID
@app.route("/submission/<int:submission_id>", methods=["DELETE"])
def delete_submission(submission_id):
    try:
        body = request.get_json(silent=True) or {}
        student_id = body.get("student_id")

        if student_id is None:
            return jsonify({"msg": "student_id es obligatorio"}), 400

        user = User.query.get(student_id)
        if not user:
            return jsonify({"msg": "Usuario no existe"}), 404

        if user.role.lower() != "student":
            return jsonify({"msg": "Solo un alumno puede eliminar una entrega"}), 403

        submission = Submission.query.get(submission_id)
        if not submission:
            return jsonify({"msg": "No existe la entrega"}), 404

        if submission.student_id != student_id:
            return jsonify({"msg": "No autorizado para Eliminar esta entrega"}), 403

        db.session.delete(submission)
        db.session.commit()

        return jsonify({
            "msg": "Entrega borrada",
            "submission": {
                "id": submission.id,
                "todo_id": submission.todo_id,
                "student_id": submission.student_id,
                "description": submission.description,
                "response_url": submission.response_url

            }

        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500

# SUBMISION GET TAREA SUBIDA POR UN ESTUDIANTE CON ID
@app.route("/submission/<int:submission_id>", methods=["GET"])
def get_submission(submission_id):

    try:

        submission = Submission.query.get(submission_id)

        if not submission:
            return jsonify({"msg": "No existe la entrega"}), 404

        return jsonify({
            "msg": "Vista de entrega",
            "submission": {
                "id": submission.id,
                "todo_id": submission.todo_id,
                "student_id": submission.student_id,
                "description": submission.description,
                "response_url": submission.response_url

            }

        }), 200

    except Exception as e:

        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500


# SUBMISION GET LISTA DE TAREAS SUBIDA POR ESTUDIANTES
@app.route("/submissions", methods=["GET"])
def get_submissions():

    try:

        student_id = request.args.get("student_id")
        todo_id = request.args.get("todo_id")

        if student_id is None and todo_id is None:
            return jsonify({"msg": " No existe student_id o todo_id"}), 400

        

        if todo_id is not None:
            todo = Todo.query.get(todo_id)
            if todo is None:
                return jsonify ({"msg" : "La tarea no existe"}), 404
            

        if student_id is not None:
            user = User.query.get (student_id)
            if user is None:
                return jsonify ({"msg" : "No existe el estudiante"}), 404
             
        query = Submission.query
        if student_id is not None:
            query = query.filter_by (student_id = student_id)


        if todo_id is not None:
            query = query.filter_by(todo_id=todo_id)

        submissions = query.all()
        
        return jsonify({
            "msg": "Listado de entrega",
            "submissions": [
                {
                    "id": submission.id,
                    "todo_id": submission.todo_id,
                    "student_id": submission.student_id,
                    "description": submission.description,
                    "response_url": submission.response_url

                } for submission in submissions
            ]

        }), 200

    except Exception as e:

        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500

