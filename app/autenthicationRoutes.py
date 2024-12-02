from flask import Blueprint, request, jsonify  
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app.utils import hash_password, verify_password  
from app import mongo  

# Se crea un Blueprint para agrupar las rutas relacionadas con la autenticación
auth_bp = Blueprint("auth", __name__)

# Ruta para registrar un nuevo usuario
@auth_bp.route("/register", methods=["POST"])
def register():
    # Extraer los datos enviados en el cuerpo de la solicitud
    data = request.json

    # Verificar si el correo ya está registrado en la colección "users"
    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"message": "El correo ya está registrado"}), 400

    # Hashear la contraseña antes de guardarla en la base de datos para mayor seguridad
    hashed_password = hash_password(data["password"])

    # Crear el documento del usuario con los datos proporcionados
    user = {
        "name": data["name"],        
        "email": data["email"],      
        "password": hashed_password   
    }

    # Insertar el usuario en la colección "users"
    mongo.db.users.insert_one(user)

    # Responder con un mensaje de éxito
    return jsonify({"message": "Usuario registrado exitosamente"}), 201

# Ruta para iniciar sesión y obtener un token JWT
@auth_bp.route("/login", methods=["POST"])
def login():
   
    data = request.json

    # Buscar el usuario en la base de datos por su correo electrónico
    user = mongo.db.users.find_one({"email": data["email"]})

    # Verificar que el usuario exista y que la contraseña proporcionada sea correcta
    if user and verify_password(user["password"], data["password"]):
        # Generar un token JWT con el _id del usuario como identidad
        token = create_access_token(identity=str(user["_id"]))

        # Devolver el token como respuesta
        return jsonify({"token": token}), 200

    # Si las credenciales no son válidas, responder con un mensaje de error
    return jsonify({"message": "Credenciales inválidas"}), 401

# Ruta para obtener todas los usuarios
@auth_bp.route("/", methods=["GET"])
@jwt_required()  
def get_users():
    # Recupera todos los usuarios de la colección 'users' y los devuelve como JSON.
    users = list(mongo.db.users.find())
    for user in users:
        # Convertir el ObjectId a una cadena para que sea JSON serializable
        user["_id"] = str(user["_id"])
    # Devolver la lista de ofertas como respuesta JSON
    return jsonify(users), 200

# Ruta para actualizar un usuario existente
@auth_bp.route("/<id>", methods=["PUT"])
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
    if "name" in data:
        updated_data["name"] = data["name"]
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
@auth_bp.route("/<id>", methods=["DELETE"])
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