from datetime import timedelta
import os

from api.models import db
from api.routes import api_bp, jwt_blacklist
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

app = Flask(__name__)
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

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=3001, debug=True)