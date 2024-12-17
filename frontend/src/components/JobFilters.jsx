import React from "react";

export default function JobFilters({
  filteredJobs,
  filters,
  onFilterChange,
  toggleUserJobs,
  showUserJobs,
}) {
  // Obtener opciones únicas basadas en trabajos filtrados
  const titles = [...new Set(filteredJobs.map((job) => job.title))];
  const companies = [...new Set(filteredJobs.map((job) => job.company))];
  const locations = [...new Set(filteredJobs.map((job) => job.location))];

  return (
    <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      {/* Botón Toggle */}
      <div className="flex items-center">
        <span className="text-gray-600 font-medium mr-4">Todas las Ofertas</span>
        <div
          onClick={toggleUserJobs}
          className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            showUserJobs ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              showUserJobs ? "translate-x-8" : ""
            }`}
          ></div>
        </div>
        <span className="text-gray-600 font-medium ml-4">Mis Ofertas</span>
      </div>

      {/* Desplegable para Títulos */}
      <div className="flex flex-col w-full md:w-1/3">
        <label htmlFor="title" className="text-gray-700 font-medium mb-2 text-center">
          Filtrar por Título
        </label>
        <select
          id="title"
          name="title"
          value={filters.title}
          onChange={onFilterChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos los títulos</option>
          {titles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {/* Desplegable para Compañías */}
      <div className="flex flex-col w-full md:w-1/3">
        <label htmlFor="company" className="text-gray-700 font-medium mb-2 text-center">
          Filtrar por Compañía
        </label>
        <select
          id="company"
          name="company"
          value={filters.company}
          onChange={onFilterChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas las compañías</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* Desplegable para Ubicaciones */}
      <div className="flex flex-col w-full md:w-1/3">
        <label htmlFor="location" className="text-gray-700 font-medium mb-2 text-center">
          Filtrar por Ubicación
        </label>
        <select
          id="location"
          name="location"
          value={filters.location}
          onChange={onFilterChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas las ubicaciones</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
