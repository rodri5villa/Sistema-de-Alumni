from flask import Blueprint, request, jsonify  
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app.utils import hash_password  
from app import mongo  

# Se crea un Blueprint para agrupar las rutas relacionadas con los usuarios
user_bp = Blueprint("users", __name__)

# Ruta para listar todos los usuarios sin mostrar sus contraseñas
@user_bp.route("/", methods=["GET"])
@jwt_required()  
def get_users():
    users = list(mongo.db.users.find())
    for user in users:
        user["_id"] = str(user["_id"])
        if "password" in user:
            del user["password"]
    return jsonify(users), 200

# Ruta para actualizar un usuario existente
@user_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    # Obtener el ID del usuario autenticado
    user_id = get_jwt_identity()

    # Verificar que el usuario autenticado coincide con el usuario que se desea actualizar
    if user_id != id:
        return jsonify({"message": "No tienes permisos para actualizar este usuario"}), 403

    # Extraer los datos enviados en la solicitud
    data = request.json

    # Crear un diccionario con los campos actualizados
    updated_data = {}
    if "email" in data:
        # Verificar que el nuevo correo no esté en uso por otro usuario
        if mongo.db.users.find_one({"email": data["email"], "_id": {"$ne": ObjectId(id)}}):
            return jsonify({"message": "El correo ya está en uso"}), 400
        updated_data["email"] = data["email"]
    if "password" in data:
        # Hashear la nueva contraseña antes de guardarla
        updated_data["password"] = hash_password(data["password"])

    # Actualizar el usuario en la base de datos
    mongo.db.users.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

# Ruta para eliminar un usuario existente
@user_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    # Obtener el ID del usuario autenticado
    user_id = get_jwt_identity()

    # Verificar que el usuario autenticado coincide con el usuario que se desea eliminar
    if user_id != id:
        return jsonify({"message": "No tienes permisos para eliminar este usuario"}), 403

    # Eliminar el usuario de la base de datos
    mongo.db.users.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Usuario eliminado exitosamente"}), 200