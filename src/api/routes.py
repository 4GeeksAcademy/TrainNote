"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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

