import React from "react";

export default function UserActions() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Función para la actualización de datos del usuario.
  const handleUpdateUser = async () => {
    const updatedEmail = prompt("Introduce el nuevo email del usuario:");
    const updatedPassword = prompt("Introduce la nueva contraseña:");

    if (!updatedEmail && !updatedPassword) {
      alert("Debes ingresar al menos un dato para actualizar.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: updatedEmail || undefined,
          password: updatedPassword || undefined,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar el usuario.");
      alert("Usuario actualizado exitosamente.");
    } catch (error) {
      alert("Error al actualizar el usuario.");
    }
  };

  // Función para la eliminación del usuario.
  const handleDeleteUser = async () => {
    const confirmation = prompt(
      "Escribe 'eliminar' para confirmar la eliminación de tu usuario:"
    );
    if (confirmation !== "eliminar") {
      alert("Acción cancelada.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario.");
      alert("Usuario eliminado exitosamente.");
      localStorage.clear(); // Limpiar datos del usuario
      window.location.href = "/"; // Redirigir a Home
    } catch (error) {
      alert("Error al eliminar el usuario.");
    }
  };

  return (
    <div className="flex flex-col items-end space-y-4">
      <button
        onClick={handleUpdateUser}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300 w-full"
      >
        Editar Usuario
      </button>
      <button
        onClick={handleDeleteUser}
        className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition duration-300 w-full"
      >
        Eliminar Usuario
      </button>
    </div>
  );
}
