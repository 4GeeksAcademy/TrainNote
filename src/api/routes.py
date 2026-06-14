"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import uuid
import uuid
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Workshop
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash

api = Blueprint('api', __name__)
 

# Allow CORS requests to this API
CORS(api, resources={r"/api/*": {"origins": "*"}})


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    password_confirm = body.get("password_confirm")
    role = body.get("role", "employee")
    company_name = body.get("company_name")
    
    # Validaciones
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    if not password_confirm:
        return jsonify({"error": "Password confirmation is required"}), 400
    if password != password_confirm:
        return jsonify({"error": "Passwords do not match"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    # Verificar si el email ya existe
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400
    
    # Crear o obtener workshop
    if company_name:
        workshop = Workshop.query.filter_by(company_name=company_name).first()
        if not workshop:
            workshop = Workshop(
                company_name=company_name,
                cif=str(uuid.uuid4()),
                phone="000000000",
                email=email,
                is_active=True
            )
            db.session.add(workshop)
            db.session.commit()
    else:
        # Si no hay company_name, usar el primer taller disponible o crear uno por defecto
        workshop = Workshop.query.first()
        if not workshop:
            workshop = Workshop(
                company_name="Default Workshop",
                cif=str(uuid.uuid4()),
                phone="000000000",
                email=email,
                is_active=True
            )
            db.session.add(workshop)
            db.session.commit()
    
    # Crear el usuario
    password_hash = generate_password_hash(password)
    new_user = User(
        email=email,
        password_hash=password_hash,
        role=role,
        workshop_id=workshop.id,
        is_active=True
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generar token
    access_token = create_access_token(
        identity=str(new_user.id),
        additional_claims={"role": new_user.role, "workshop_id": new_user.workshop_id}
    )
    
    response = {
        "token": access_token,
        "user": new_user.serialize()
    }
    
    return jsonify(response), 201

@api.route('/login', methods=['POST'])
def login(): 
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    user = User.query.filter_by(email=email, is_active=True).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    if not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid password"}), 401
    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "workshop_id": user.workshop_id})
    response = {
        "token": access_token,
        "user": user.serialize()
    }     
    if user.employee:
        response["employee"] = user.employee.serialize()
    return jsonify(response), 200       

