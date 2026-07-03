from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models.model_comment import Comment
from api.database.db import db
from api.models.model_post import Post

from api.routes import api

@api.route('/comment', methods=['POST'])
@jwt_required()
def create_comment():
    
    data = request.get_json()
    user_id = data.get('user_id')
    post_id = data.get('post_id')
    content = data.get('content')

    if content is None or post_id is None or user_id is None:
        return jsonify({
            "msg": "Content and post_id is required"
        }), 400

    new_comment = Comment(user_id=user_id, content=content, post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"msg": "Comment created",'comment': new_comment.serialize()}), 201


@api.route('/comment/<int:post_id>', methods=['GET'])
@jwt_required()
def get_comments_by_posts(post_id):

    post = db.session.get(Post, post_id)
    if post is None:
        return jsonify({"msg": "Post not found"}), 400

    comments_list = db.session.query(Comment).all()
    comments = list(map(lambda Comment: Comment.serialize_comment(), comments_list))

    return jsonify({"post_id": post_id, "comments": comments})


@api.route('/comment/<int:comment_id>', methods=['PUT'])
@jwt_required()
def edit_comment(comment_id):

    data = request.get_json()
    if data is None:
        return jsonify({"msg": "You must to send the body"}), 400

    comment_update = db.session.get(Comment, comment_id)
    if comment_update is None:
        return jsonify({"msg": "Comment not found"}), 404

    user_token = int(get_jwt_identity())
    if user_token != comment_update.user_id:
        return jsonify({"msg": "You do not have permission to update this comment"}), 403

    content = data.get('content')
    if not content:
        return jsonify({"msg": "Content is required"}), 400

    comment_update.content = content
    db.session.commit()

    return jsonify({"msg": "Comment updated", "comment": comment_update.serialize()}), 200
