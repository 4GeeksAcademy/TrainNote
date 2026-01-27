"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Bike, BikePart, BikeModel
from api.utils import generate_sitemap, APIException, is_valid_email
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.services.ollama_client import ollama_chat
from api.services.catalog import load_catalog, rank_bikes

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


# ============================================
# BIKE MODELS ENDPOINTS
# ============================================

# GET todos los modelos
@api.route("/bike-models", methods=["GET"])
@jwt_required()
def get_bike_models():
    """Obtiene todos los modelos de bicicletas disponibles"""
    bike_type = request.args.get("type")
    
    query = BikeModel.query
    
    if bike_type:
        query = query.filter_by(bike_type=bike_type)
    
    models = query.order_by(BikeModel.brand, BikeModel.model_name).all()
    return jsonify([m.serialize() for m in models]), 200


# SEARCH - Buscar modelos
@api.route("/bike-models/search", methods=["GET"])
@jwt_required()
def search_bike_models():
    """Busca modelos por término (marca o nombre)"""
    search_term = request.args.get("q", "").strip()
    
    if not search_term or len(search_term) < 2:
        return jsonify({"msg": "Search term must be at least 2 characters"}), 400
    
    search_pattern = f"%{search_term}%"
    models = BikeModel.query.filter(
        db.or_(
            BikeModel.brand.ilike(search_pattern),
            BikeModel.model_name.ilike(search_pattern)
        )
    ).limit(20).all()
    
    return jsonify([m.serialize() for m in models]), 200


# GET tipos disponibles
@api.route("/bike-models/types", methods=["GET"])
@jwt_required()
def get_bike_types():
    """Obtiene todos los tipos de bicicleta disponibles"""
    types = db.session.query(BikeModel.bike_type).distinct().all()
    return jsonify({"types": [t[0] for t in types]}), 200


# POST crear nuevo modelo
@api.route("/bike-models", methods=["POST"])
@jwt_required()
def create_bike_model():
    """Crea un nuevo modelo de bicicleta (solo admin)"""
    body = request.get_json(silent=True) or {}
    
    brand = (body.get("brand") or "").strip()
    model_name = (body.get("model_name") or "").strip()
    bike_type = (body.get("bike_type") or "").strip()
    model_year = body.get("model_year")
    description = body.get("description")
    
    if not all([brand, model_name, bike_type]):
        return jsonify({"msg": "Brand, model_name, and bike_type are required"}), 400
    
    # Evitar duplicados
    existing = BikeModel.query.filter_by(
        brand=brand,
        model_name=model_name,
        model_year=model_year
    ).first()
    
    if existing:
        return jsonify({"msg": "This bike model already exists"}), 409
    
    bike_model = BikeModel(
        brand=brand,
        model_name=model_name,
        model_year=model_year,
        bike_type=bike_type,
        description=description
    )
    
    db.session.add(bike_model)
    db.session.commit()
    
    return jsonify(bike_model.serialize()), 201


# ============================================
# BIKES ENDPOINTS
# ============================================

# POST crear bike (ACTUALIZADO con bike_model_id)
@api.route("/bikes", methods=["POST"])
@jwt_required()
def create_bike():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    bike_model_id = body.get("bike_model_id")  # NUEVO
    model = body.get("model")
    specs = body.get("specs")
    image_url = body.get("image_url")
    video_url = body.get("video_url")
    parts = body.get("parts") or []

    if not name:
        return jsonify({"msg": "Name is required"}), 400

    # Validar modelo si se proporciona
    if bike_model_id:
        bike_model = BikeModel.query.get(bike_model_id)
        if not bike_model:
            return jsonify({"msg": "Bike model not found"}), 404

    bike = Bike(
        user_id=user.id,
        name=name,
        bike_model_id=bike_model_id,  # NUEVO
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


# GET get bike
@api.route("/bikes", methods=["GET"])
@jwt_required()
def get_bikes():
    user_id = int(get_jwt_identity())
    bikes = Bike.query.filter_by(user_id=user_id).all()
    return jsonify([b.serialize() for b in bikes]), 200

# DELETE eliminar bike
@api.route("/bikes/<int:bike_id>", methods=["DELETE"])
@jwt_required()
def delete_bike(bike_id):
    user_id = int(get_jwt_identity())
    
    bike = Bike.query.filter_by(id=bike_id, user_id=user_id).first()
    if not bike:
        return jsonify({"msg": "Bike not found"}), 404
    
    db.session.delete(bike)
    db.session.commit()
    
    return jsonify({"msg": "Bike deleted successfully"}), 200

# PUT actualizar bike
@api.route("/bikes/<int:bike_id>", methods=["PUT"])
@jwt_required()
def update_bike(bike_id):
    user_id = int(get_jwt_identity())
    
    bike = Bike.query.filter_by(id=bike_id, user_id=user_id).first()
    if not bike:
        return jsonify({"msg": "Bike not found"}), 404
    
    body = request.get_json(silent=True) or {}
    
    # Actualizar campos
    if "name" in body:
        bike.name = body["name"].strip()
    
    if "bike_model_id" in body:
        bike_model_id = body["bike_model_id"]
        if bike_model_id:
            bike_model = BikeModel.query.get(bike_model_id)
            if not bike_model:
                return jsonify({"msg": "Bike model not found"}), 404
            bike.bike_model_id = bike_model_id
    
    if "specs" in body:
        bike.specs = body["specs"]
    
    if "image_url" in body:
        bike.image_url = body["image_url"]
    
    if "video_url" in body:
        bike.video_url = body["video_url"]
    
    # Actualizar partes si se envían
    if "parts" in body:
        # Eliminar partes antiguas
        BikePart.query.filter_by(bike_id=bike.id).delete()
        
        # Añadir nuevas partes
        for p in body["parts"]:
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
    return jsonify(bike.serialize()), 200


@api.route("/ai/chat", methods=["POST"])
# @jwt_required()  
def ai_chat():
    try:
        body = request.get_json(silent=True) or {}
        messages = body.get("messages") or []
        context = body.get("context") or {}

        if not isinstance(messages, list) or len(messages) == 0:
            return jsonify({"error": "messages debe ser una lista no vacía"}), 400
        if not isinstance(context, dict):
            context = {}

        # 1) Rankear bicis del catálogo
        catalog = load_catalog()
        recommendations = rank_bikes(context, catalog, limit=3)

        # 2) Construir prompt para Ollama
        system = {
            "role": "system",
            "content": (
                "Eres GASTACOBRE, asistente de compra de bicis.\n"
                "Reglas:\n"
                "- Responde SIEMPRE en español.\n"
                "- Sé breve, claro y práctico.\n"
                "- NO inventes modelos. SOLO puedes hablar de las recomendaciones del catálogo que te pasan.\n"
                "- Si falta modalidad o presupuesto, pregunta 1-2 cosas.\n"
                "- Cuando haya recomendaciones, explica por qué encajan y sugiere 1-2 preguntas siguientes.\n"
            ),
        }

        
        catalog_context = {
            "role": "system",
            "content": (
                "RECOMMENDATIONS (del catálogo, no inventar):\n"
                + "\n".join(
                    [
                        f"- {r['name']} | type={r.get('type')} | price={r.get('price_eur')}€ | url={r.get('url')}"
                        for r in recommendations
                    ]
                )
            ),
        }

        prompt = [system, catalog_context] + [
            {"role": m.get("role"), "content": m.get("content")}
            for m in messages
            if m.get("role") in ("user", "assistant") and isinstance(m.get("content"), str)
        ]

        # 3) Llamar a Ollama
        result = ollama_chat(prompt, temperature=0.3)

        return jsonify(
            {
                "assistant_message": result.get("assistant_message", "").strip(),
                "recommendations": recommendations,  
                "next_questions": [],
                "context": context,
            }
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
