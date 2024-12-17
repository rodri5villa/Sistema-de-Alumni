export default function JobList({ jobs, onEdit, onDelete }) {
  const userId = localStorage.getItem("userId");

  // Función que maneja la eliminación de un trabajo.
  const handleDelete = (job) => {
    const confirmation = prompt(
      "Escribe 'eliminar' para confirmar la eliminación de esta oferta"
    );

    if (confirmation === "eliminar") {
      onDelete(job._id);
    } else {
      alert("No se eliminó la oferta. Acción cancelada.");
    }
  };

  return (
    <div className="overflow-auto w-full p-6 bg-gray-100 rounded-lg shadow-inner">
      {/*Itera sobre los jobs*/}
      {jobs.map((job, index) => (
        <div
          key={job._id || index}
          className="border p-6 mb-6 rounded-lg shadow-md bg-white"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{job.title}</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-800">Descripción:</span> {job.description}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-800">Compañía:</span> {job.company}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-800">Ubicación:</span> {job.location}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold text-gray-800">Sueldo:</span>{" "}
            {job.price ? `${job.price} €` : "Sin especificar"}
          </p>
          {/*Los botones Editar y Eliminar solo se muestran en los trabajos del usuario que inicia sesión*/}
          {job.created_by === userId && (
            <div className="flex space-x-4">
              <button
                onClick={() => onEdit(job)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(job)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
