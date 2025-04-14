import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SalesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/ventas/${id}`)
      .then((res) => res.json())
      .then((data) => setVenta(data))
      .catch((err) => console.error("Error al obtener detalle de venta:", err));
  }, [id]);

  if (!venta) {
    return <div style={{ padding: "1rem" }}>Cargando detalle...</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        Volver
      </button>
      <h2>Detalle de Venta #{venta.codigo_pedido}</h2>
      <div style={cardContainerStyle}>
        <div style={cardStyle}>
          <h3>Información de la Venta</h3>
          <p><strong>Fecha:</strong> {venta.fecha_pedido}</p>
          <p><strong>Cliente:</strong> {venta.nombre_cliente || "N/A"}</p>
          <p><strong>Estado:</strong> {venta.estado_pedido}</p>
          <p><strong>Total:</strong> ${venta.total_pedido}</p>
        </div>
        <div style={cardStyle}>
          <h3>Detalle de Productos</h3>
          {venta.detalles && venta.detalles.length > 0 ? (
            venta.detalles.map((detalle, idx) => (
              <div key={idx} style={detalleStyle}>
                <p><strong>Producto:</strong> {detalle.nombre_producto}</p>
                <p><strong>Cantidad:</strong> {detalle.cantidad_detalle_pedido}</p>
                <p><strong>Precio Unitario:</strong> ${detalle.precio_unitario_}</p>
                <p><strong>Subtotal:</strong> ${detalle.subtotal_detalle_pedido}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No hay detalles para esta venta.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const cardContainerStyle = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap"
};

const cardStyle = {
  flex: "1 1 300px",
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
};

const detalleStyle = {
  marginBottom: "0.5rem"
};

export default SalesDetail;
