from flask import Flask  
from flask_pymongo import PyMongo 
from flask_jwt_extended import JWTManager 
from dotenv import load_dotenv 
import os  

# Cargar las variables de entorno definidas en el archivo .env
load_dotenv()

# Inicializar la aplicación Flask
app = Flask(__name__)

# Configuración de MongoDB: Lee la URI desde las variables de entorno
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
# Inicializar PyMongo para conectar Flask con MongoDB
mongo = PyMongo(app)

# Configuración del secreto JWT: Lee la clave secreta desde las variables de entorno
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
# Inicializar JWTManager para gestionar tokens JWT en la aplicación
jwt = JWTManager(app)

# Importar los Blueprints de autenticación y gestión de trabajos
from app.autenthicationRoutes import auth_bp  
from app.jobRoutes import jobs_bp  

# Registrar el Blueprint de autenticación con el prefijo "/auth"
app.register_blueprint(auth_bp, url_prefix="/auth")
# Registrar el Blueprint de ofertas de trabajo con el prefijo "/jobs"
app.register_blueprint(jobs_bp, url_prefix="/jobs")
