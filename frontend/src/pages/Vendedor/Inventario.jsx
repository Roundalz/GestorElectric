import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Carga de productos al montar el componente.
  useEffect(() => {
    // Ajusta la URL según tu orquestador/microservicio de inventario
    fetch("http://localhost:5000/api/inventario/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Ejemplo de función placeholder para "exportar a Excel"
  const handleExportExcel = () => {
    alert("Exportar a Excel - (función aún no implementada)");
  };

  // Ejemplo de función placeholder para "Agregar producto"
  const handleAgregarProducto = () => {
    alert("Agregar nuevo producto - (función aún no implementada)");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Productos</h2>
      
      {/* Botones superiores */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button 
          style={{ backgroundColor: "#ccc", cursor: "default" }}
        >
          Lista de productos
        </button>
        <button onClick={() => alert("Imprimir códigos - (No implementado)")}>
          Imprimir códigos
        </button>
        <button onClick={() => alert("Ajuste de cantidad - (No implementado)")}>
          Ajuste de cantidad
        </button>
      </div>

      {/* Botones de exportar e insertar producto */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={handleExportExcel}>Exportar Excel (Productos)</button>
        <button onClick={() => alert("Exportar Excel caracteristicas - (no implementado)")}>
          Exportar Excel (Características)
        </button>
        <button onClick={handleAgregarProducto}>Agregar producto</button>
      </div>

      {/* Tabla de productos */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>CODIGO PROD</th>
            <th style={thStyle}>IMAGEN</th>
            <th style={thStyle}>NOMBRE PROD</th>
            <th style={thStyle}>TIPO PROD</th>
            <th style={thStyle}>PRECIO</th>
            <th style={thStyle}>CANTID</th>
            <th style={thStyle}>ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                No hay productos registrados.
              </td>
            </tr>
          ) : (
            productos.map((prod) => (
              <tr key={prod.codigo_producto}
                  onClick={() => navigate(`/productos/${prod.codigo_producto}`)}
                  style={{ cursor: "pointer" }}>
                <td style={tdStyle}>{`P00${prod.codigo_producto}`}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {/* Ajusta la fuente de la imagen según tus datos */}
                  <img
                    src={
                      prod.imagen_referencia_producto
                        ? prod.imagen_referencia_producto
                        : "https://via.placeholder.com/50"
                    }
                    alt="Producto"
                    width="50"
                    height="50"
                  />
                </td>
                <td style={tdStyle}>{prod.nombre_producto}</td>
                <td style={tdStyle}>{prod.tipo_producto}</td>
                <td style={tdStyle}>{`$${prod.precio_unidad_producto}`}</td>
                <td style={tdStyle}>{prod.cantidad_disponible_producto}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() =>
                      alert(`Editar producto con ID = ${prod.codigo_producto}`)
                    }
                  >
                    Editar
                  </button>{" "}
                  |{" "}
                  <button
                    onClick={() =>
                      alert(`Eliminar producto con ID = ${prod.codigo_producto}`)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Estilos simples para ejemplo
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

export default Inventario;
