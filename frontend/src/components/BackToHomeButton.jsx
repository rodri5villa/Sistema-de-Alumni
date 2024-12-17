import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackToHomeButton() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <button
      onClick={handleBackToHome}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md text-sm transition duration-300"
    >
      ← Volver a Inicio
    </button>
  );
}
