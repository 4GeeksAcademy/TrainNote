"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Company, Event
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/event', methods=['POST'])
def create_event():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "El cuerpo de la petición debe ser JSON"}), 400

    required_fields = ['title', 'description', 'date',
                       'location', 'price', 'capacity', 'category', 'company_id']
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta el campo obligatorio: {field}"}), 400

    try:
        event_date = datetime.fromisoformat(
            body['date'].replace("Z", "+00:00"))
    except ValueError:
        return jsonify({"msg": "Formato de fecha inválido. Usa ISO 8601"}), 400

    company = db.session.get(Company, body['company_id'])
    if not company:
        return jsonify({"msg": "La empresa (company_id) especificada no existe"}), 404

    new_event = Event(
        title=body['title'],
        description=body['description'],
        date=event_date,
        location=body['location'],
        price=body['price'],
        capacity=body['capacity'],
        category=body['category'],
        image_url=body.get('image_url'),
        company_id=body['company_id']
    )

    try:
        db.session.add(new_event)
        db.session.commit()
        return jsonify({
            "msg": "Evento creado exitosamente para venta de entradas",
            "event": new_event.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno al crear el evento", "error": str(e)}), 500


@api.route('/event', methods=['GET'])
def get_all_events():
    events = Event.query.all()

    if not events:
        return jsonify([]), 200

    events_list = [event.serialize() for event in events]

    return jsonify(events_list), 200


@api.route('/users', methods=['POST'])
def register_user():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "El cuerpo de la petición debe ser JSON"}), 400

    required_fields = ['email', 'password', 'name']
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta el campo obligatorio: {field}"}), 400

    user_exists = User.query.filter_by(email=body['email']).first()
    if user_exists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    new_user = User(
        email=body['email'],
        password=body['password'],
        name=body['name'],
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "msg": "Usuario registrado exitosamente",
            "user": new_user.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno al registrar el usuario", "error": str(e)}), 500


@api.route('/companies', methods=['POST'])
def register_company():
    body = request.get_json()

    if body is None:
        return jsonify({"msg": "El cuerpo de la petición debe ser JSON"}), 400

    required_fields = ['email', 'password', 'name']
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta el campo obligatorio: {field}"}), 400

    company_exists = Company.query.filter_by(email=body['email']).first()
    if company_exists:
        return jsonify({"msg": "El correo electrónico de la empresa ya está registrado"}), 400

    new_company = Company(
        email=body['email'],
        password=body['password'],
        name=body['name'],
        is_active=True
    )

    try:
        db.session.add(new_company)
        db.session.commit()
        return jsonify({
            "msg": "Empresa registrada exitosamente",
            "company": new_company.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno al registrar la empresa", "error": str(e)}), 500
