from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

from app.autenthicationRoutes import auth_bp
from app.jobRoutes import jobs_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(jobs_bp, url_prefix="/jobs")
