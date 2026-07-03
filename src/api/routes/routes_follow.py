from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models.models_foro import Foro
from api.models.model_follow import Follow
from api.database.db import db
from . import api

@api.route("/follow/<int:foro_id>", methods=["POST"])
@jwt_required()
def follow_foro(foro_id):

    user_id = get_jwt_identity()

    foro = Foro.query.get(foro_id)


    if not foro:
        return jsonify({"msg": "Foro no encontrado"}), 400
    
    exist = Follow.query.filter_by( user_id=user_id, foro_id=foro_id ).first()
    
    if exist:
        return jsonify({"msg": "Ya sigues este foro"}), 400
    
    new_follow = Follow(
        user_id=user_id,
        foro_id=foro_id
    )
    
    db.session.add(new_follow)
    db.session.commit()

    return jsonify({"msg": "Foro seguido correctamente"}), 201
        

@api.route("/unfollow/<int:foro_id>", methods=["DELETE"])
@jwt_required()
def delete_follow(foro_id):

    user_id= get_jwt_identity()

    follow= Follow.query.filter_by(
        user_id=user_id,
        foro_id=foro_id
    ).first()

    if not follow:
     return jsonify({"msg": "No sigues este foro"}), 404
    
    db.session.delete(follow)
    db.session.commit()

    return jsonify({"msg": "Foro eliminado"})


@api.route("/myfollow", methods=["GET"])
@jwt_required()
def get_follow():

    user_id = get_jwt_identity()

    follows = Follow.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for follow in follows:

        foro = Foro.query.get(follow.foro_id)

        if foro:

            foro_data = foro.serialize_foro()

            foro_data["posts"] = [
                post.serialize_post()
                for post in foro.post[-3:]
            ]

            result.append(foro_data)

    return jsonify(result), 200