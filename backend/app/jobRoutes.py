from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import mongo

jobs_bp = Blueprint("jobs", __name__)

# Ruta para crear una nueva oferta de trabajo
@jobs_bp.route("/", methods=["POST"])
@jwt_required()  
def create_job():
    user_id = get_jwt_identity()

    data = request.json

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    job = {
        "title": data["title"],         
        "description": data["description"],  
        "company": data["company"],      
        "location": data["location"],    
        "price": data["price"],          
        "created_by":  user_id    
    }
    # Insertar el documento en la colección "jobs"
    mongo.db.jobs.insert_one(job)
    return jsonify({"message": "Oferta creada exitosamente"}), 201

# Ruta para obtener todas las ofertas de trabajo
@jobs_bp.route("/", methods=["GET"])
@jwt_required()  
def get_jobs():

    jobs = list(mongo.db.jobs.find())
    for job in jobs:
        # Convertir el ObjectId a una cadena para que sea JSON serializable
        job["_id"] = str(job["_id"])
        
    return jsonify(jobs), 200


# Ruta para actualizar una oferta de trabajo existente
@jobs_bp.route("/<id>", methods=["PUT"])
@jwt_required()  
def update_job(id):

    data = request.json

    job = mongo.db.jobs.find_one({"_id": ObjectId(id)})
    if not job:
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
    
    job = mongo.db.jobs.find_one({"_id": ObjectId(id)})
    if not job:
        return jsonify({"message": "Oferta no encontrada o no tienes permisos para eliminarla"}), 404

    mongo.db.jobs.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Oferta eliminada exitosamente"}), 200