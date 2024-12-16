import React, { useState, useEffect } from "react";
import JobList from "../components/JobList";
import JobForm from "../components/JobForm";
import UserActions from "../components/UserActions";
import LogoutButton from "../components/LogoutButton";
import JobFilters from "../components/JobFilters";

export default function JobDashboard() {
  // Estado para almacenar todas las ofertas de empleo
  const [jobs, setJobs] = useState([]);
  // Estado para almacenar las ofertas filtradas
  const [filteredJobs, setFilteredJobs] = useState([]);
  // Estado para manejar los filtros aplicados
  const [filters, setFilters] = useState({ title: "", company: "", location: "" });
  // Estado para manejar la oferta actualmente seleccionada para edición o creación
  const [currentJob, setCurrentJob] = useState(null);
  // Estado para manejar si el formulario de creación/edición está abierto
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Estado para alternar entre "Mis Ofertas" y "Todas las Ofertas"
  const [showUserJobs, setShowUserJobs] = useState(false);

  // Función para obtener todas las ofertas de empleo desde el servidor
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setJobs(data);
    filterJobs(data, filters, showUserJobs);
  };

  // Para cargar las ofertas cuando se monta el componente
  useEffect(() => {
    fetchJobs();
  }, []);

  // Función para filtrar las ofertas basándose en filtros activos y opciones de usuario
  const filterJobs = (allJobs, activeFilters, userOnly) => {
    const userId = localStorage.getItem("userId");
    const filtered = allJobs.filter((job) => {
      // Si está activado `showUserJobs`, incluir solo trabajos del usuario
      if (userOnly && job.created_by !== userId) return false;

      // Aplicar filtros activos
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true; 
        return job[key]?.toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredJobs(filtered);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    filterJobs(jobs, updatedFilters, showUserJobs);
  };

  // Alternar entre "Mis Ofertas" y "Todas las Ofertas"
  const toggleUserJobs = () => {
    const newShowUserJobs = !showUserJobs;
    setShowUserJobs(newShowUserJobs);
    filterJobs(jobs, filters, newShowUserJobs);
  };

  // Manejar la creación de una nueva oferta
  const handleCreate = () => {
    setCurrentJob(null);
    setIsFormOpen(true);
  };

  // Manejar la edición de una oferta existente
  const handleEdit = (job) => {
    setCurrentJob(job);
    setIsFormOpen(true);
  };

  // Manejar la eliminación de una oferta
  const handleDelete = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar la oferta.");

      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      filterJobs(updatedJobs, filters, showUserJobs); // Refrescar el filtrado tras eliminar
      alert("Oferta eliminada exitosamente.");
    } catch (error) {
      alert("Error al eliminar la oferta.");
    }
  };

  // Función para gestionar el cierre del formulario y recargar la lista de ofertas.
  const handleSave = async (newJob) => {
    try {
      setIsFormOpen(false);
      await fetchJobs();
      alert(currentJob ? "Oferta actualizada exitosamente." : "Oferta creada exitosamente.");
    } catch (error) {
      console.error("Error al guardar o actualizar:", error);
      alert("Error al guardar la oferta.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-200 p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 flex items-center">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center flex-grow">
          Sistema de <span className="text-blue-500">Ofertas de Empleo</span>
        </h1>
        <div className="flex flex-col space-y-4">
          <UserActions />
          <LogoutButton />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
          >
            Crear Nueva Oferta
          </button>
          <h2 className="text-3xl font-bold text-gray-800 flex-grow text-center">
            Lista de Ofertas
          </h2>
        </div>
        <div className="mb-6">
          <JobFilters
            filteredJobs={filteredJobs}
            filters={filters}
            onFilterChange={handleFilterChange}
            toggleUserJobs={toggleUserJobs}
            showUserJobs={showUserJobs}
          />
        </div>
        <JobList jobs={filteredJobs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <JobForm
              job={currentJob}
              onClose={() => setIsFormOpen(false)}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}