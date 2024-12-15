import React, { useState } from "react";

export default function JobForm({ job, onClose, onSave }) {
  const [formData, setFormData] = useState(
    job || { title: "", description: "", company: "", location: "Oficina", price: "" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/jobs/${job ? job._id : ""}`,
        {
          method: job ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar la oferta.");
      }

      const data = await response.json();
      onSave(data);
    } catch (error) {
      console.error("Error al guardar la oferta:", error);
      alert("Error al guardar la oferta.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full"
      >
        <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
          {job ? "Actualizar Oferta" : "Crear Oferta"}
        </h2>
        <input
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="company"
          placeholder="Compañía"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <div className="flex flex-col mb-4">
          <label htmlFor="location" className="text-gray-700 font-medium mb-2">
            Ubicación
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Oficina">Oficina</option>
            <option value="Remoto">Remoto</option>
          </select>
        </div>
        <input
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}