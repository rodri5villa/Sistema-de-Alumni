from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import mongo

# Se crea un Blueprint para agrupar las rutas relacionadas con las ofertas de empleo
jobs_bp = Blueprint("jobs", __name__)

# Ruta para crear una nueva oferta de trabajo
@jobs_bp.route("/", methods=["POST"])
@jwt_required()  # Asegura que solo los usuarios autenticados puedan acceder a esta ruta
def create_job():
    # Obtener el ID del usuario autenticado desde el token JWT
    user_id = get_jwt_identity()
    # Extraer los datos enviados en el cuerpo de la solicitud
    data = request.json

    # Buscar el usuario en la base de datos para obtener su nombre
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        # Si el usuario no existe (o fue eliminado), devolver un error 404
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Crear el documento de la oferta con los datos proporcionados y el nombre del creador
    job = {
        "title": data["title"],         
        "description": data["description"],  
        "company": data["company"],      
        "location": data["location"],    
        "price": data["price"],          
        "created_by": user["name"]    
    }
    # Insertar el documento en la colección "jobs"
    mongo.db.jobs.insert_one(job)
    return jsonify({"message": "Oferta creada exitosamente"}), 201

# Ruta para obtener todas las ofertas de trabajo
@jobs_bp.route("/", methods=["GET"])
@jwt_required()  
def get_jobs():
    # Recuperar todas las ofertas de la colección "jobs"
    jobs = list(mongo.db.jobs.find())
    for job in jobs:
        # Convertir el ObjectId a una cadena para que sea JSON serializable
        job["_id"] = str(job["_id"])
    # Devolver la lista de ofertas como respuesta JSON
    return jsonify(jobs), 200


# Ruta para actualizar una oferta de trabajo existente
@jobs_bp.route("/<id>", methods=["PUT"])
@jwt_required()  
def update_job(id):
    # Obtener el ID del usuario autenticado desde el token JWT
    user_id = get_jwt_identity()
    # Extraer los datos enviados en el cuerpo de la solicitud
    data = request.json

    # Buscar el nombre del usuario en la colección "users"
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Buscar la oferta en la base de datos utilizando el _id y el nombre del usuario
    job = mongo.db.jobs.find_one({"_id": ObjectId(id), "created_by": user["name"]})
    if not job:
        # Si no se encuentra la oferta o no pertenece al usuario, devolver un error 404
        return jsonify({"message": "Oferta no encontrada o no tienes permisos para actualizarla"}), 404

    # Crear un diccionario con los campos actualizados
    updated_data = {}
    if "title" in data:
        updated_data["title"] = data["title"]  
    if "description" in data:
        updated_data["description"] = data["description"]  
    if "company" in data:
        updated_data["company"] = data["company"] 
    if "location" in data:
        updated_data["location"] = data["location"]  
    if "price" in data:
        updated_data["price"] = data["price"]  

    # Actualizar la oferta en la base de datos
    mongo.db.jobs.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    return jsonify({"message": "Oferta actualizada exitosamente"}), 200

@jobs_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_job(id):
    # Obtener el ID del usuario autenticado desde el token JWT
    user_id = get_jwt_identity()

    # Buscar el nombre del usuario en la colección "users"
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Buscar la oferta en la base de datos utilizando el _id y el nombre del usuario
    job = mongo.db.jobs.find_one({"_id": ObjectId(id), "created_by": user["name"]})
    if not job:
        # Si no se encuentra la oferta o no pertenece al usuario, devolver un error 404
        return jsonify({"message": "Oferta no encontrada o no tienes permisos para eliminarla"}), 404

    # Eliminar la oferta de la base de datos
    mongo.db.jobs.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Oferta eliminada exitosamente"}), 200