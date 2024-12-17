import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Actualiza los valores introducidos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar una solicitud POST al servidor para registrar al usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Usuario registrado exitosamente");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-gray-200">
      {/* Parte Superior */}
      <div className="flex items-center justify-start p-4">
        <BackToHomeButton />
      </div>

      {/* Parte Inferior */}
      <div className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-lg bg-white shadow-xl p-8 rounded-lg">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            Registro
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Crea una cuenta para comenzar a explorar nuestras ofertas laborales.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition duration-300"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
