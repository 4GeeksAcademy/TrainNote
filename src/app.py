from datetime import timedelta
import os
from api.models import db
from api.routes import api_bp, jwt_blacklist
from api.commands import setup_commands
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Ruta a la carpeta "dist" generada por npm run build (está un nivel arriba de src/)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="/")
setup_commands(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

db_url = os.getenv("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif db_url and db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///trainnote.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in jwt_blacklist


app.register_blueprint(api_bp)


# Esta parte sirve el frontend (React/Vite) para cualquier ruta que no sea de la API
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)