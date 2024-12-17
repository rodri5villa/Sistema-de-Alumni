from flask import Flask  
from flask_pymongo import PyMongo 
from flask_jwt_extended import JWTManager 
from dotenv import load_dotenv 
from flask_cors import CORS
import os  

# Cargar las variables de entorno del archivo .env
load_dotenv()

# Inicializar la aplicación Flask
app = Flask(__name__)

# Utilizamos CORS para poder conectar el Frontend, en un puerto diferente al Backend, con el Backend
CORS(app)

# Configuración de MongoDB y de la clave secreta de JWT: Lee la URI y la clave desde las variables de entorno
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Importar los Blueprints de autenticación, usuarios y gestión de trabajos registrandolo con los prefijos 
from app.autenthicationRoutes import auth_bp  
from app.jobRoutes import jobs_bp 
from app.userRoutes import user_bp 

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(jobs_bp, url_prefix="/jobs")