import React, { useEffect, useState } from "react";
import styles from "./Inventario.module.css";
import { useNavigate } from "react-router-dom";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Se asume que la API devuelve los productos filtrados por vendedor (vendedor 1)
    fetch("http://localhost:5000/api/inventario")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        // Agrupar productos por tipo_producto:
        const groups = data.reduce((acc, producto) => {
          const tipo = producto.tipo_producto;
          if (!acc[tipo]) acc[tipo] = [];
          acc[tipo].push(producto);
          return acc;
        }, {});
        setGrouped(groups);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Función para expandir/contraer cada grupo
  const toggleGroup = (tipo) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [tipo]: !prev[tipo]
    }));
  };

  // Handlers para los botones
  const handleAddProduct = () => {
    navigate("/agregar-producto");
  };

  const handleExportExcel = () => {
    // Se supone que el backend exporta a Excel desde este endpoint
    window.location.href = "http://localhost:5000/api/inventario/export";
  };

  const handlePrintBarCodes = () => {
    alert("Imprimir Códigos de Barra - (No implementado)");
  };

  const handleListAll = () => {
    alert("Listar Todos - (No implementado)");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Inventario</h1>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleAddProduct}>
          Agregar Producto
        </button>
        <button className={styles.button} onClick={handleExportExcel}>
          Exportar a Excel
        </button>
        <button className={styles.button} onClick={handlePrintBarCodes}>
          Imprimir Códigos de Barra
        </button>
        <button className={styles.button} onClick={handleListAll}>
          Listar Todos
        </button>
      </div>

      <div className={styles.groupContainer}>
        {Object.keys(grouped).length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          Object.keys(grouped).map((tipo) => (
            <div key={tipo} className={styles.groupCard}>
              <div
                className={styles.groupHeader}
                onClick={() => toggleGroup(tipo)}
              >
                <h2 className={styles.groupTitle}>{tipo}</h2>
                <span className={styles.toggleIcon}>
                  {expandedGroups[tipo] ? "−" : "+"}
                </span>
              </div>
              {expandedGroups[tipo] && (
                <div className={styles.groupProducts}>
                  {grouped[tipo].map((producto) => (
                    <div
                      key={producto.codigo_producto}
                      className={styles.productCard}
                      onClick={() =>
                        navigate(`/inventario/${producto.codigo_producto}`)
                      }
                    >
                      <h3>{producto.nombre_producto}</h3>
                      <p>
                        <strong>Código:</strong> {producto.codigo_producto}
                      </p>
                      <p>
                        <strong>Precio:</strong> ${producto.precio_unidad_producto}
                      </p>
                      <p>
                        <strong>Cant.:</strong>{" "}
                        {producto.cantidad_disponible_producto}
                      </p>
                      <p>
                        <strong>Estado:</strong> {producto.estado_producto}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Inventario;