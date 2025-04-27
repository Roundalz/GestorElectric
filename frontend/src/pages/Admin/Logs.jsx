import axios from "axios";
import { useEffect, useState } from "react";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    accion: "",
    fecha: "",
    tipo: "",
  });

  // GET: Obtener todos los logs
  const obtenerLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/logs");
      setLogs(res.data);
    } catch (error) {
      console.error("Error al obtener logs:", error);
    }
  };

  useEffect(() => {
    obtenerLogs();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value.toLowerCase() });
  };

  // Filtrado de logs
  const logsFiltrados = logs.filter((log) =>
    (log.usuario_id?.toString().toLowerCase() || "").includes(filtros.usuario) &&
    (log.accion?.toLowerCase() || "").includes(filtros.accion) &&
    (new Date(log.fecha_hora).toLocaleString().toLowerCase() || "").includes(filtros.fecha) &&
    (log.tipo_log?.toLowerCase() || "").includes(filtros.tipo)
  );
  

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historial de Logs</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="usuario"
          value={filtros.usuario}
          onChange={handleFiltroChange}
          placeholder="Filtrar por usuario ID"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="accion"
          value={filtros.accion}
          onChange={handleFiltroChange}
          placeholder="Filtrar por acción"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="fecha"
          value={filtros.fecha}
          onChange={handleFiltroChange}
          placeholder="Filtrar por fecha (ej: 2025-04)"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="tipo"
          value={filtros.tipo}
          onChange={handleFiltroChange}
          placeholder="Filtrar por tipo (evento/usuario)"
          className="border p-2 w-full"
        />
      </div>

      {/* Tabla de logs */}
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Acción</th>
            <th className="p-2 border">Usuario ID</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Detalles</th>
          </tr>
        </thead>
        <tbody>
  {logsFiltrados.length > 0 ? (
    logsFiltrados.map((log, index) => (
      <tr key={log.id ?? `log-${index}`}>
        <td className="p-2 border">{log.id}</td>
        <td className="p-2 border capitalize">{log.tipo_log}</td>
        <td className="p-2 border">{log.accion}</td>
        <td className="p-2 border">{log.usuario_id}</td>
        <td className="p-2 border">
          {new Date(log.fecha_hora).toLocaleString()}
        </td>
        <td className="p-2 border">{log.detalles || "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4">
        No se encontraron logs con los filtros aplicados.
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}

export default Logs;