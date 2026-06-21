from flask import request, jsonify
import cloudinary
import cloudinary.uploader
from api.cloudinary.cloudinary_config import *


def save_img(file):
    if file.filename != '':
        try:
            upload_result = cloudinary.uploader.upload(file)
            return upload_result["secure_url"]
        except Exception as e:
            return jsonify({"msg": str(e)}), 500