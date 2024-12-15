from flask import Blueprint, request, jsonify  
from flask_jwt_extended import create_access_token
from app.utils import hash_password, verify_password  
from app import mongo  

auth_bp = Blueprint("auth", __name__)

# Ruta para registrar un nuevo usuario
@auth_bp.route("/register", methods=["POST"])
def register():
    # Extraer los datos enviados en el cuerpo de la solicitud
    data = request.json

    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"message": "El correo ya está registrado"}), 400

    hashed_password = hash_password(data["password"])

    # Crear el documento del usuario con los datos proporcionados
    user = {
        "name": data["name"],        
        "email": data["email"],      
        "password": hashed_password   
    }

    # Insertar el usuario en la colección "users"
    mongo.db.users.insert_one(user)
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

        # Devolver el token y el userId en la respuesta
        return jsonify({"token": token, "userId": str(user["_id"])}), 200
    
    return jsonify({"message": "Credenciales inválidas"}), 401