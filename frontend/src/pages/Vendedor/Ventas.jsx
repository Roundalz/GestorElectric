import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/ventas")
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error("Error al obtener ventas:", error));
  }, []);

  const handleExportExcel = () => {
    // Redirigir para descargar el Excel
    window.location.href = "http://localhost:5000/api/ventas/export";
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Ventas</h2>
      
      {/* Botones superiores */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button style={{ backgroundColor: "#ccc", cursor: "default" }}>
          Lista de ventas
        </button>
        <button onClick={() => alert("Estadísticas - (No implementado)")}>
          Estadísticas
        </button>
        <button onClick={() => alert("Clientes - (No implementado)")}>
          Clientes
        </button>
        <button onClick={handleExportExcel}>
          Exportar Excel (Ventas)
        </button>
      </div>

      {/* Tabla de Ventas */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>Fecha de Venta</th>
            <th style={thStyle}>Cliente</th>
            <th style={thStyle}>Estado Venta</th>
            <th style={thStyle}>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No hay ventas registradas.
              </td>
            </tr>
          ) : (
            ventas.map((venta) => (
              // Al hacer clic en la fila, navega al detalle de la venta
              <tr
                key={venta.codigo_pedido}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/ventas/${venta.codigo_pedido}`)}
              >
                <td style={tdStyle}>{venta.fecha_pedido}</td>
                <td style={tdStyle}>{venta.nombre_cliente || "N/A"}</td>
                <td style={tdStyle}>{venta.estado_pedido}</td>
                <td style={tdStyle}>${venta.total_pedido}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  fontWeight: "bold",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default Ventas;
