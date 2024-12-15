// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-gray-200 flex flex-col items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-12 text-center max-w-xl">
        <h1 className="text-[48px] font-extrabold mb-6 text-gray-800 leading-tight">
          Sistema de <span className="text-blue-500">Ofertas de Empleo</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Encuentra las mejores oportunidades laborales en un solo lugar.
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full py-3 rounded-lg text-xl transition duration-300"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-medium w-full py-3 rounded-lg text-xl transition duration-300"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
