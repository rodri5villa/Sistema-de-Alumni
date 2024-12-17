import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); 
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300 w-full"
    >
      Cerrar Sesión
    </button>
  );
}
