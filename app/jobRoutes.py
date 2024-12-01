from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from app import mongo

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/", methods=["POST"])
@jwt_required()
def create_job():
    user_id = get_jwt_identity()
    data = request.json
    job = {
        "title": data["title"],
        "description": data["description"],
        "company": data["company"],
        "location": data["location"],
        "created_by": user_id
    }
    mongo.db.jobs.insert_one(job)
    return jsonify({"message": "Oferta creada exitosamente"}), 201

@jobs_bp.route("/", methods=["GET"])
@jwt_required()
def get_jobs():
    jobs = list(mongo.db.jobs.find())
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jsonify(jobs), 200

@jobs_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def update_job(id):
    user_id = get_jwt_identity()
    data = request.json

    job = mongo.db.jobs.find_one({"_id": ObjectId(id), "created_by": user_id})
    if not job:
        return jsonify({"message": "Oferta no encontrada o no tienes permisos para actualizarla"}), 404

    updated_data = {}
    if "title" in data:
        updated_data["title"] = data["title"]
    if "description" in data:
        updated_data["description"] = data["description"]
    if "company" in data:
        updated_data["company"] = data["company"]
    if "location" in data:
        updated_data["location"] = data["location"]

    mongo.db.jobs.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    return jsonify({"message": "Oferta actualizada exitosamente"}), 200


@jobs_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_job(id):
    user_id = get_jwt_identity()

    job = mongo.db.jobs.find_one({"_id": ObjectId(id), "created_by": user_id})
    if not job:
        return jsonify({"message": "Oferta no encontrada o no tienes permisos para eliminarla"}), 404

    mongo.db.jobs.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Oferta eliminada exitosamente"}), 200