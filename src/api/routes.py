"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Bike, BikePart
from api.utils import generate_sitemap, APIException, is_valid_email
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not is_valid_email(email):
        return jsonify({"msg": "Invalid email"}), 400
    if len(password) < 8:
        return jsonify({"msg": "Password must be at least 8 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201


@api.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route("/home", methods=["GET"])
@jwt_required()
def home():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "user not found"}), 404

    home_data = {
        "user": user.serialize(),
        "weekly_kms": 42,
        "featured_routes": [
            {
                "id": 1,
                "name": "Ruta del Bosque",
                "Kms": 12
            },
            {
                "id": 2,
                "name": "Costa Norte",
                "Kms": 18
            },
        ],
        "friends_activity": [
            {
                "user": "Alex",
                "kms": 10
            },
            {
                "user": "Pablo",
                "kms": 25
            }
        ]
    }
    return jsonify(home_data), 200

@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"msg": "Access granted", "user": user.serialize()}), 200

@api.route("/bikes", methods=["POST"])
@jwt_required()
def create_bike():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    model = body.get("model")
    specs = body.get("specs")
    image_url = body.get("image_url")
    video_url = body.get("video_url")
    parts = body.get("parts") or []

    if not name:
        return jsonify({"msg": "Name is required"}), 400

    bike = Bike(
        user_id=user.id,
        name=name,
        model=model,
        specs=specs,
        image_url=image_url,
        video_url=video_url,
        is_active=False,
    )
    db.session.add(bike)
    db.session.flush()

    for p in parts:
        part = BikePart(
            bike_id=bike.id,
            part_name=p.get("part_name"),
            brand=p.get("brand"),
            model=p.get("model"),
            km_life=p.get("km_life") or 0,
            km_current=p.get("km_current") or 0,
            wear_percentage=p.get("wear_percentage") or 0,
        )
        db.session.add(part)

    db.session.commit()
    return jsonify(bike.serialize()), 201


@api.route("/bikes", methods=["GET"])
@jwt_required()
def get_bikes():
    user_id = int(get_jwt_identity())
    bikes = Bike.query.filter_by(user_id=user_id).all()
    return jsonify([b.serialize() for b in bikes]), 200
