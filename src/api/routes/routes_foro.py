from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models.models_foro import Foro
from api.database.db import db
from . import api

import cloudinary
import cloudinary.uploader
from api.cloudinary.cloudinary_config import *

@api.route('/foro', methods=["POST"])
@jwt_required()
def create_forum():

    title = request.form.get("title")       
    description = request.form.get("description")

    if not title:
        return jsonify({"msg": "Title is required"}), 400

    img_url = None

    if 'img' in request.files:             
        file_to_upload = request.files['img']
        if file_to_upload.filename != '':
            try:
                upload_result = cloudinary.uploader.upload(file_to_upload)
                img_url = upload_result["secure_url"]
            except Exception as e:
                return jsonify({"msg": str(e)}), 500

    new_forum = Foro(
        title=title,
        img=img_url,                         
        description=description,
        user_id=int(get_jwt_identity())
    )

    db.session.add(new_forum)
    db.session.commit()

    return jsonify({
        "msg": "Forum created",
        "forum": new_forum.serialize_foro()
    }), 201

@api.route('/foros', methods=['GET'])
def get_forums():

    forums = Foro.query.all()

    return jsonify([
        forum.serialize_foro()
        for forum in forums
    ]), 200


@api.route("/foro/<int:forum_id>", methods=["GET"])
def get_forum_id(forum_id):

    forum = Foro.query.get(forum_id)

    if forum is None:
        return jsonify({
            "msg": "Forum not found"
        }), 404

    return jsonify(
        forum.serialize_foro()
    ), 200


@api.route("/foros/search", methods=["GET"])
def get_forum_search():

    query = request.args.get("query")

    if not query:
        return jsonify({
            "msg": "Query is required"
        }), 400

    forums = Foro.query.filter(
        Foro.title.ilike(f"%{query}%")
    ).all()

    return jsonify([
        forum.serialize_foro()
        for forum in forums
    ]), 200