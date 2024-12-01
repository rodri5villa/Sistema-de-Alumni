from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.utils import hash_password, verify_password
from app import mongo

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"message": "El correo ya está registrado"}), 400

    hashed_password = hash_password(data["password"])
    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password
    }
    mongo.db.users.insert_one(user)
    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = mongo.db.users.find_one({"email": data["email"]})
    if user and verify_password(user["password"], data["password"]):
        token = create_access_token(identity=str(user["_id"]))
        return jsonify({"token": token}), 200
    return jsonify({"message": "Credenciales inválidas"}), 401