"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Reading
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

#MOSTRAR LECTURAS 
@app.route('/readings', methods=['GET'])
def get_all_readings():
    readings = Reading.query.all()
    readings_serialized = []
    for reading in readings:
        readings_serialized.append(reading.serialize())
    return ({'Tus lecturas pendientes': readings})

#CREAR LECTURAS POR PROFESOR 
@app.route('/readings/create', methods=['POST'])
def create_new_reading():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Necesitas llenar el body'}),400
    if 'title' not in body:
        return jsonify({'msg': 'Necesitas poner un titulo a la lectura'}),400
    if 'content' not in body:
        return jsonify({'msg': 'Necesitas agregar contenido'}),400
    new_reading = Reading()
    new_reading.title = body['title']
    new_reading.content = body['content']
    db.session.add(new_reading)
    db.session.commit()

    return jsonify({'msg': f'lectura {new_reading.title}agregada'})



#MODIFICAR LECTURA
@app.route('/editreading/<int:reading_id>', methods=['PUT'])  
def edit_reading(reading_id):
    reading = Reading.query.get(reading_id)
    if reading is None:
        return jsonify({'msg': f'Lectura {reading_id} no encontrada'}), 404

    body = request.get_json(silent=True)
    if 'title' in body:
        reading.title = body['title']
    if 'content' in body:
        reading.content = body['content']
    db.session.commit()

    return jsonify({'msg': f'Lectura {reading.name} actualizada'}),200

#ELIMINAR READING 
        
@app.route('deletereading/<int:reading_id>', methods=['DELETE'])
def delete_reading(reading_id):
    reading = Reading.query.get(reading_id)
    if reading is None:
        return jsonify({'msg': f'Lectura {reading_id} no encontrada'}), 404
   
    db.session.delete(reading)
    db.session.commit()

    return jsonify(f'Se ha eliminado correctamente la lectura {reading.title} '), 200   




# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
