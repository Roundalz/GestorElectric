// src/pages/Vendedor/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { QRCodeCanvas } from "qrcode.react";

function ProductDetail() {
  const { codigoProducto } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    // Ajusta la URL según tu orquestador
    fetch(`http://localhost:5000/api/inventario/productos/${codigoProducto}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((error) =>
        console.error("Error al obtener detalle del producto:", error)
      );
  }, [codigoProducto]);

  if (!producto) {
    return <div style={{ padding: "1rem" }}>Cargando detalle...</div>;
  }

  // Funciones placeholder para los botones de acción
  const handleEdit = () =>
    alert(`Editar producto [ID=${producto.codigo_producto}] - (No implementado)`);
  const handleDelete = () =>
    alert(`Eliminar producto [ID=${producto.codigo_producto}] - (No implementado)`);

  // Variables para imágenes
  const imagenes = producto.imagenes || [];
  const imagenPrincipal = imagenes.length > 0 ? imagenes[0] : null;
  const imagenesSecundarias = imagenes.length > 1 ? imagenes.slice(1) : [];

  return (
    <div style={containerStyle}>
      {/* Columna Izquierda: Área de Imágenes (30% del ancho) */}
      <div style={leftColumnStyle}>
        {imagenPrincipal ? (
          <img
            src={imagenPrincipal}
            alt="Producto Principal"
            style={imagenPrincipalStyle}
          />
        ) : (
          <div style={imagenSinDatosStyle}>Sin imagen</div>
        )}
        {imagenesSecundarias.length > 0 && (
          <div style={secundaryImagesContainerStyle}>
            {imagenesSecundarias.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Producto Secundaria ${index + 1}`}
                style={imagenSecundariaStyle}
              />
            ))}
          </div>
        )}
      </div>

      {/* Columna Derecha: Detalles del Producto (70% del ancho) */}
      <div style={rightColumnStyle}>
        <h2>{producto.nombre_producto}</h2>
        <p>
          <strong>Tipo:</strong> {producto.tipo_producto}
        </p>
        <p>
          <strong>Precio:</strong> ${producto.precio_unidad_producto}
        </p>
        <p>
          <strong>Cantidad:</strong> {producto.cantidad_disponible_producto}
        </p>
        <p>
          <strong>Estado:</strong> {producto.estado_producto}
        </p>
        <p>
          <strong>Calificación:</strong> {producto.calificacion_producto}
        </p>
        <p>
          <strong>Costo:</strong> ${producto.costo_producto}
        </p>
        <p>
          <strong>Descuento:</strong> {producto.descuento_producto}%
        </p>

        {/* Listado de Características */}
        {producto.caracteristicas && producto.caracteristicas.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Características</h3>
            <ul>
              {producto.caracteristicas.map((car, index) => (
                <li key={index}>
                  <strong>{car.nombre_caracteristica}:</strong>{" "}
                  {car.descripcion_caracteristica}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Código de Barras y QR */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <div>
            <Barcode
              value={`P-${producto.codigo_producto}`}
              format="CODE128"
              displayValue={true}
            />
          </div>
          <div>
            <QRCodeCanvas
              value={`https://miapp.com/productos/${producto.codigo_producto}`}
              size={100}
              level="M"
              includeMargin
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button style={actionButtonStyle} onClick={handleEdit}>
            Editar
          </button>
          <button style={actionButtonStyle} onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos en línea
const containerStyle = {
  display: "flex",
  width: "100%",
  gap: "1rem",
  padding: "1rem",
};

const leftColumnStyle = {
  width: "30%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "1px solid #ccc",
  padding: "1rem",
};

const rightColumnStyle = {
  width: "70%",
  border: "1px solid #ccc",
  padding: "1rem",
};

const imagenPrincipalStyle = {
  width: "100%",
  height: "auto",
  marginBottom: "1rem",
};

const imagenSinDatosStyle = {
  width: "100%",
  height: "150px",
  backgroundColor: "#eee",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1rem",
};

const secundaryImagesContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const imagenSecundariaStyle = {
  width: "48%",
  height: "auto",
  border: "1px solid #ccc",
};

const actionButtonStyle = {
  padding: "0.5rem 1rem",
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  borderRadius: "4px",
};

export default ProductDetail;
