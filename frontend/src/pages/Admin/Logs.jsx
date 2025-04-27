import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/Logs.css"; // <-- importamos tu CSS personalizado

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    accion: "",
    fecha: "",
    tipo: "",
  });

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

  const logsFiltrados = logs.filter((log) =>
    (log.usuario_id?.toString().toLowerCase() || "").includes(filtros.usuario) &&
    (log.accion?.toLowerCase() || "").includes(filtros.accion) &&
    (new Date(log.fecha_hora).toLocaleString().toLowerCase() || "").includes(filtros.fecha) &&
    (log.tipo_log?.toLowerCase() || "").includes(filtros.tipo)
  );

  return (
    <div className="logsContainer">
      <h1 className="logsTitle">Historial de Logs</h1>

      {/* Filtros */}
      <div className="logsFilters">
        <input
          type="text"
          name="usuario"
          value={filtros.usuario}
          onChange={handleFiltroChange}
          placeholder="Filtrar por usuario ID"
          className="inputFiltro"
        />
        <input
          type="text"
          name="accion"
          value={filtros.accion}
          onChange={handleFiltroChange}
          placeholder="Filtrar por acción"
          className="inputFiltro"
        />
        <input
          type="text"
          name="fecha"
          value={filtros.fecha}
          onChange={handleFiltroChange}
          placeholder="Filtrar por fecha (ej: 2025-04)"
          className="inputFiltro"
        />
        <input
          type="text"
          name="tipo"
          value={filtros.tipo}
          onChange={handleFiltroChange}
          placeholder="Filtrar por tipo (evento/usuario)"
          className="inputFiltro"
        />
      </div>

      {/* Tabla */}
      <div className="tablaLogsContainer">
        <table className="tablaLogs">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Acción</th>
              <th>Usuario ID</th>
              <th>Fecha</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.length > 0 ? (
              logsFiltrados.map((log, index) => (
                <tr key={log.id ?? `log-${index}`}>
                  <td>{log.id}</td>
                  <td className="capitalize">{log.tipo_log}</td>
                  <td>{log.accion}</td>
                  <td>{log.usuario_id}</td>
                  <td>{new Date(log.fecha_hora).toLocaleString()}</td>
                  <td>{log.detalles || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="noLogs">
                  No se encontraron logs con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logs;
