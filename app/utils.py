from werkzeug.security import generate_password_hash, check_password_hash

# Función para cifrar una contraseña
def hash_password(password):
    return generate_password_hash(password)

# Función para verificar una contraseña contra un hash almacenado
def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)
