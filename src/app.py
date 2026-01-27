"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.models import Reading
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

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

#MOSTRAR LECTURAS A ESTUDIANTES 
@app.route('/private/readings', methods=['GET'])
#@jwt_required()
def get_all_readings():
    readings_query = Reading.query.all()
    readings_query_serialized = []
    for readings in readings_query:
        readings_query_serialized.append(readings_query.serialize())
    return ({'Tus lecturas pendientes': readings})

#CREAR LECTURAS POR PROFESOR 
@app.route('/private/readings/create', methods=['POST'])
#@jwt_required()
def create_new_reading():
    #current_user_id = get_jwt_identity()
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Necesitas llenar el body'}),400
    if 'title' not in body:
        return jsonify({'msg': 'Necesitas poner un titulo a la lectura'}),400
    if 'content' not in body:
        return jsonify({'msg': 'Necesitas agregar contenido'}),400
    if 'group_id' not in body:
        return jsonify({'msg': 'Necesitas asignarla a un grupo'}),400
    new_reading = Reading()
    new_reading.title = body['title']
    new_reading.content = body['content']
    new_reading.group_id = body['group_id']
    db.session.add(new_reading)
    db.session.commit()

    return jsonify({'msg': f'lectura agregada por profesor: '})



#MODIFICAR TAREA 
@app.route('/private/readings/update/<int:id>', methods=['PUT'])
#@jwt_required()
def edit_reading(id):
    #current_user_id = get_jwt_identity()
    body = request.get_json(silent=True)
    
    
    reading_to_edit = Reading.query.get(id)
    if reading_to_edit is None:
        return jsonify({'msg': 'Lectura no encontrada'})
    
    if 'title' in body:
        reading_to_edit.title = body['title']
    if 'content' in body:
        reading_to_edit.content = body['content']
    if 'group_id' in body:
        reading_to_edit.group_id = body['group_id']
    
    db.session.commit()
    
    return jsonify({'msg': f'lectura editada por profesor:'})

#ELIMINAR TAREA 
        
@app.route('/private/readings/delete/<int:id>', methods=['DELETE'])
#@jwt_required()
def delete_reading(id):
    #current_user_id = get_jwt_identity()
    
    reading_to_delete = Reading.query.get(id)
    if reading_to_delete is None:
        return jsonify({'msg': 'Lectura no encontrada'})
    
    db.session.delete(reading_to_delete)
    db.session.commit()
    
    return jsonify({'msg': f'lectura eliminada por profesor: '})



# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
