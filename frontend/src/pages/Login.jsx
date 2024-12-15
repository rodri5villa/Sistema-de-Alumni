import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToHomeButton from "../components/BackToHomeButton";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Enviar una solicitud POST al servidor para autenticar al usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, userId } = data; // Desestructurar ambos valores
        localStorage.setItem("token", token); // Guarda el token en el almacenamiento local
        localStorage.setItem("userId", userId); // Guarda el userId en el almacenamiento local
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Credenciales inválidas");
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
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Accede a tu cuenta para gestionar tus ofertas laborales.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-300"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
