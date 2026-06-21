from flask import Blueprint
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

# Las rutas se registran importando los módulos DESPUÉS de crear el blueprint
from api.routes import routes_user, routes_tag, routes_foro, routes_post