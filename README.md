# Sistema de Alumni

## Descripción General

El **Sistema de Alumni** es una plataforma web que permite:
- Registro e inicio de sesión de usuarios, utilizando **JWT** asegurando que cada usuario pueda interactuar con sus datos de forma segura.
- Actualización y eliminación de los propios usuarios.
- Creación, edición y eliminación de ofertas de empleo.
- Listado y filtrado entre tus propias ofertas o las de todos los usuarios.

---

## Estructura del Proyecto

### Tecnologías Utilizadas

### Backend:
- **Flask**: Framework ligero para el desarrollo de APIs.
- **JWT**: Para el manejo de autenticación segura con JSON Web Tokens (Para proteger las rutas).
- **PyMongo**: Extensión para interactuar con MongoDB.
- **CORS**: Permite solicitudes entre dominios (Cross-Origin Resource Sharing).
- **load_dotenv**: Carga de variables de entorno desde archivos `.env`.
- **Werkzeug Security**: Para hashing y verificación de contraseñas.
- **Blueprint**: Organización modular de rutas en Flask.

### Frontend:
- **React.js**: Biblioteca para interfaces de usuario.
- **Vite**: Herramienta rápida y moderna para construir proyectos frontend con React.
- **Tailwind CSS**: Framework de CSS para un diseño responsivo.

### Base de Datos:
- **MongoDB**: Base de datos NoSQL utilizada.

---

## Backend

### Directorios Principales:

```plaintext
├── backend                           
│   ├── app                             # Carpeta con la lógica principal del backend
│   │   ├── __init__.py                 # Configuración inicial de Flask
│   │   ├── authenticationRoutes.py     # Rutas para login y registro
│   │   ├── jobRoutes.py                # Rutas para gestionar ofertas de empleo
│   │   ├── userRoutes.py               # Rutas para gestión de usuarios
│   │   ├── models.py                   # Clases de usuario y ofertas
│   │   ├── utils.py                    # Funciones auxiliares de cifrado y verificación
│   ├── .env                            # Variables de entorno (MongoDB, JWT secret)
│   ├── requirements.txt                # Dependencias de Python
│   ├── run.py                          # Archivo para ejecutar el backend
```

### Endpoints Principales:

#### Autenticación de Usuario
- `POST /auth/register`: Registrar usuario.
- `POST /auth/login`: Iniciar sesión.

#### Ofertas
- `POST /jobs`: Crear oferta.
- `GET /jobs`: Listar ofertas.
- `PUT /jobs/:id`: Actualizar oferta.
- `DELETE /jobs/:id`: Eliminar oferta.

#### Usuarios
- `PUT /users/:id`: Actualizar usuario.
- `DELETE /users/:id`: Eliminar usuario.

---

## Frontend

### Directorios Principales:

```plaintext
├── frontend              
│   ├── src                             # Código fuente del frontend
│   │   ├── assets                      # Recursos estáticos como logos e imágenes
│   │   ├── components                  # Carpeta de componentes reutilizables de React
│   │   │   ├── BackToHomeButton.jsx    # Botón para volver a la página principal
│   │   │   ├── JobFilters.jsx          # Filtros avanzados para las ofertas
│   │   │   ├── JobForm.jsx             # Formulario para crear/editar ofertas
│   │   │   ├── JobList.jsx             # Lista de ofertas de empleo
│   │   │   ├── LogoutButton.jsx        # Botón para cerrar sesión
│   │   │   ├── UserActions.jsx         # Acciones de usuario como editar o eliminar cuenta
│   │   ├── pages                       # Carpeta con las páginas del proyecto
│   │   │   ├── Home.jsx                # Página principal
│   │   │   ├── Login.jsx               # Página de inicio de sesión
│   │   │   ├── Register.jsx            # Página de registro
│   │   │   ├── JobDashboard.jsx        # Panel de administración de ofertas y usuario
│   |   ├── App.jsx                     # Configuración principal de las rutas
│   │   ├── index.css                   # Estilos globales con Tailwind
│   ├── tailwind.config.js              # Configuracioón de Tailwind   
│   ├── vite.config.js                  # Configuración de Vite
└── README.md                           # Documentación del proyecto
```

---

## Base de Datos en MongoDB `alumni_system`

### Modelo de Datos:

#### Colección: `users`
- `_id`: Identificador único (ObjectId).
- `name`: Nombre del usuario.
- `email`: Correo único.
- `password`: Contraseña hasheada.

#### Colección: `jobs`
- `_id`: Identificador único (ObjectId).
- `title`: Título de la oferta.
- `description`: Descripción de la oferta.
- `company`: Nombre de la compañía.
- `location`: Ubicación (Oficina o Remoto).
- `price`: Salario estimado.
- `created_by`: Identificador del usuario.

### Relaciones entre Tablas:
- Cada usuario puede crear múltiples ofertas de trabajo.
- Las ofertas están asociadas al creador a través de `created_by`.

---

## Diagrama de Arquitectura

| ![Clases](/diagrama%20de%20Arquitectura/diagramaArquitectura.svg) | 
|  :--------------------------------------------------------------: |
|  [Código](/diagrama%20de%20Arquitectura/diagramaArquitectura.puml)|


## Cómo Ejecutar el Proyecto

### Requisitos:
- Node.js y npm instalados.
- Python y pip instalados.
- MongoDB en ejecución.
- Anaconda instalado (para gestionar el entorno del backend).

### Pasos:
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/rodri5villa/Sistema-de-Alumni.git
   cd Sistema-de-Alumni
   ```

2. **Configurar Backend**:
   - Entra a la carpeta `backend`:
     ```bash
     cd backend
     ```
   - Crea un entorno en Anaconda:
     ```bash
     conda create --name alumni_env python=3.9
     conda activate alumni_env
     ```
   - Instala las dependencias:
     ```bash
     pip install -r requirements.txt
     ```
   - Configura `.env`:
        1. Crea un archivo `.env` en la carpeta `backend`.
        2. Añade las siguientes variables:
     ```plaintext
     MONGO_URI=mongodb://localhost:27017/alumni_system
     JWT_SECRET_KEY=s3cur3_r4nd0m_k3y!
     ```
   - Ejecuta el servidor:
     ```bash
     python run.py
     ```

3. **Configurar Frontend**:
   - Entra a la carpeta `frontend`:
     ```bash
     cd frontend
     ```
   - Instala las dependencias:
     ```bash
     npm install
     ```
   - Ejecuta el servidor:
     ```bash
     npm run dev
     ```

4. **Abre la aplicación**:
   - Accede al frontend: `http://localhost:5173`.
   - Backend en: `http://localhost:5000`.