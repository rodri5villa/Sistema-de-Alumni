from flask import Blueprint, request, jsonify  
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app.utils import hash_password  
from app import mongo  

user_bp = Blueprint("users", __name__)

# Ruta para actualizar un usuario existente
@user_bp.route("/<id>", methods=["PUT"])
@jwt_required() # Asegura que solo los usuarios autenticados puedan acceder a esta ruta
def update_user(id):
    # Obtener el ID del usuario autenticado
    user_id = get_jwt_identity()

    if user_id != id:
        return jsonify({"message": "No tienes permisos para actualizar este usuario"}), 403

    data = request.json

    updated_data = {}
    if "email" in data:
        if mongo.db.users.find_one({"email": data["email"], "_id": {"$ne": ObjectId(id)}}):
            return jsonify({"message": "El correo ya está en uso"}), 400
        updated_data["email"] = data["email"]
    if "password" in data:
        updated_data["password"] = hash_password(data["password"])

    mongo.db.users.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

# Ruta para eliminar un usuario existente
@user_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    user_id = get_jwt_identity()

    if user_id != id:
        return jsonify({"message": "No tienes permisos para eliminar este usuario"}), 403
    
    mongo.db.users.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Usuario eliminado exitosamente"}), 200