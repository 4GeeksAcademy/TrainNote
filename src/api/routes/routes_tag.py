from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models.model_tag import Tag
from api.models.models_user import User
from api.models.models_foro import Foro
from api.models.model_select_tag import Tag_select
from api.database.db import db
from . import api

#para uso de creacion de una tag personalizada para que usuariO la cree
# @api.route('/tag', methods=["POST"])
# @jwt_required()
# def create_tag():
#     data = request.get_json()

#     title = data.get("title")

#     if title is None:
#         return jsonify({"msg": "Title is required"}), 400
    
#     title_check = title.strip().lower()
    
#     tag_check = db.session.execute(db.select(Tag).where(Tag.title == title_check)).scalar_one_or_none()
#     if tag_check is not None:
#         return jsonify({"msg": "That tag is already registered"}), 400
    
#     new_tag = Tag(title=title_check, user_id = get_jwt_identity())
#     db.session.add(new_tag)
#     db.session.commit()

#     return jsonify({"msg": "Tag created", 'tag': new_tag.serialize_tag()}), 201

@api.route('/tag', methods=["GET"])
@jwt_required()
def all_tags():
    tag_list = db.session.query(Tag).all()
    tag = list(map(lambda tag: tag.serialize_tag(), tag_list))

    response_body = {"tag": tag}

    return jsonify(response_body), 200

@api.route('/tag-select', methods=["POST"])
@jwt_required()
def select_tag():
    user_token = get_jwt_identity()
    
    data = request.get_json()
    tags_id = data.get('tags_id')
    user_id = int(user_token)
    

    if tags_id is None:
        return jsonify({"msg": "Bad request i need tag_id"}), 400
    
    for tag in tags_id:

        tag_exists = db.session.get(Tag, tag)
        if tag_exists is None:
            return jsonify({"msg": "Tag not found"}), 404
        
        new_tag_select = Tag_select(tag_id=tag, user_id=user_id)
        db.session.add(new_tag_select)
    db.session.commit()

    return jsonify({"msg": "Tag assigned", "Tag_select":new_tag_select.serialize_tag_user()}), 201

@api.route('/tag-select-foro', methods=["POST"])
@jwt_required()
def select_tagForo():
    # user_token = get_jwt_identity()
    # user_id = int(user_token)

    data = request.get_json()
    foro_id = data.get('foro_id')
    tags_id = data.get('tags_id')
    
    if tags_id is None:
        return jsonify({"msg": "Bad request i need tag_id"}), 400
    
    for tag in tags_id:

        tag_exists = db.session.get(Tag, tag)
        if tag_exists is None:
            return jsonify({"msg": "Tag not found"}), 404
        
        new_tag_select = Tag_select(tag_id=tag, foro_id=foro_id)
        db.session.add(new_tag_select)
    db.session.commit()

    return jsonify({"msg": "Tag assigned", "Tag_select":new_tag_select.serialize_tag_foro()}), 201
    
@api.route('/tag/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_tag_from_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 400
    query= db.select(Tag_select).where(Tag_select.user_id == user_id)
    tag_select_list = db.session.execute(query).scalars().all()
    tags = list(map(lambda Tag_select: Tag_select.serialize_tag_user(), tag_select_list))

    return jsonify ({"user_id": user_id, "tags": tags})

@api.route('/tag/foro/<int:foro_id>', methods=['GET'])
@jwt_required()
def get_tag_from_foro(foro_id):
    foro = db.session.get(Foro, foro_id)
    if foro is None:
        return jsonify({"msg": "Foro not found"}), 400
    query= db.select(Tag_select).where(Tag_select.foro_id == foro_id)
    tag_select_list = db.session.execute(query).scalars().all()
    tags = list(map(lambda Tag_select: Tag_select.serialize_tag_foro(), tag_select_list))

    return jsonify ({"foro_id": foro_id, "tags": tags})