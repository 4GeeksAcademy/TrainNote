from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models.model_post import Post
from api.database.db import db

import cloudinary
import cloudinary.uploader
from api.cloudinary.cloudinary_config import *

# Importación circular segura: se resuelve porque routes/__init__.py
# ya terminó de crear `api` antes de llegar a esta línea
from api.routes import api


@api.route('/post', methods=['POST'])
@jwt_required()
def create_post():

    content = request.form.get('content')
    foro_id = request.form.get('foro_id')
    title = request.form.get('title')

    if not title:
        return jsonify({
            "msg": "Title is required"
        }), 400

    if not content:
        return jsonify({
            "msg": "Content is required"
        }), 400

    img_url = None

    if 'img' in request.files:

        file_to_upload = request.files['img']

        if file_to_upload.filename != '':

            try:

                upload_result = cloudinary.uploader.upload(
                file_to_upload,
                upload_preset="neqycdyx"  
                )
                

                img_url = upload_result["secure_url"]

            except Exception as e:

                return jsonify({
                    "msg": str(e)
                }), 500

    new_post = Post(
        title=title,
        content=content,
        img=img_url,
        foro_id=int(foro_id) if foro_id else None,
        user_id=int(get_jwt_identity())
    )

    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        "msg": "Post created",
        "post": new_post.serialize_post()
    }), 201


@api.route('/post/<int:post_id>', methods=['GET'])
def get_post_id(post_id):

    post = Post.query.get(post_id)

    if post is None:
        return jsonify({
            "msg": "Post not found"
        }), 404

    return jsonify(
        post.serialize_post()
    ), 200


@api.route('/foro/<int:foro_id>/posts', methods=['GET'])
def get_posts_by_foro(foro_id):

    posts = Post.query.filter_by(
        foro_id=foro_id
    ).order_by(
        Post.created_at.desc()
    ).all()

    return jsonify([
        post.serialize_post()
        for post in posts
    ]), 200


@api.route('/foro/<int:foro_id>/posts/top', methods=['GET'])
def get_top_three_posts(foro_id):

    posts = Post.query.filter_by(
        foro_id=foro_id
    ).order_by(
        Post.created_at.desc()
    ).limit(3).all()

    return jsonify([
        post.serialize_post()
        for post in posts
    ]), 200
