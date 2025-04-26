import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { QRCodeCanvas } from "qrcode.react";
import styles from "./ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  // Estados para el formulario de ajuste
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [adjustOperation, setAdjustOperation] = useState("Agregar");
  const [adjustValue, setAdjustValue] = useState(0);

  useEffect(() => {
    // Se asume que la API del inventario (vía orquestador) devuelve el detalle completo
    fetch(`http://localhost:5000/api/inventario/${id}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al obtener el detalle:", err));
  }, [id]);

  if (!producto) {
    return <div className={styles.loading}>Cargando detalle...</div>;
  }
  // Manejador del ajuste de cantidad
  const handleAdjustQuantity = async () => {
    const currentQty = Number(producto.cantidad_disponible_producto);
    const value = Number(adjustValue);
    let newQty;
    if (adjustOperation === "Agregar") {
      newQty = currentQty + value;
    } else if (adjustOperation === "Restar") {
      newQty = currentQty - value;
      if (newQty < 0) newQty = 0;
    }

    // Crear el objeto actualizado. Se asume que debemos enviar todo el objeto o al menos el campo actualizado junto con los demás que ya tenga.
    const updatedProduct = { ...producto, cantidad_disponible_producto: newQty };

    try {
      const response = await fetch(`http://localhost:5000/api/inventario/${producto.codigo_producto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      if (response.ok) {
        const data = await response.json();
        setProducto(data);
        setShowAdjustForm(false);
        setAdjustValue(0);
        alert("Cantidad actualizada exitosamente");
      } else {
        const errorData = await response.json();
        alert("Error al actualizar cantidad: " + errorData.error);
      }
    } catch (error) {
      console.error("Error en ajuste de cantidad:", error);
      alert("Error al actualizar cantidad");
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Volver
      </button>
      <div className={styles.detailContainer}>
        {/* Columna Izquierda (30%): Imágenes */}
        <div className={styles.leftColumn}>
          {producto.imagenes && producto.imagenes.length > 0 ? (
            <div className={styles.mainImageContainer}>
              <img
                src={
                  producto.imagenes[0].primer_angulo ||
                  producto.imagen_referencia_producto
                }
                alt="Producto Principal"
                className={styles.mainImage}
              />
            </div>
          ) : (
            <div className={styles.noImage}>Sin imagen</div>
          )}
          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {producto.imagenes.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img.primer_angulo}
                  alt={`Miniatura ${index + 1}`}
                  className={styles.thumbnail}
                />
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha (70%): Datos, Características, Códigos y Botones */}
        <div className={styles.rightColumn}>
          <h1 className={styles.productName}>{producto.nombre_producto}</h1>
          <p>
            <strong>Tipo:</strong> {producto.tipo_producto}
          </p>
          <p>
            <strong>Precio:</strong> ${producto.precio_unidad_producto}
          </p>
          <p>
            <strong>Cantidad Disponible:</strong> {producto.cantidad_disponible_producto}
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

          <h2>Características</h2>
          {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
            <ul className={styles.caracteristicasList}>
              {producto.caracteristicas.map((caract) => (
                <li key={caract.codigo_caracteristica}>
                  <strong>{caract.nombre_caracteristica}:</strong> {caract.descripcion_caracteristica}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tiene características</p>
          )}

          <div className={styles.codes}>
            <div className={styles.barcode}>
              <Barcode
                value={`P-${producto.codigo_producto}`}
                format="CODE128"
                displayValue={true}
              />
            </div>
            <div className={styles.qrcode}>
              <QRCodeCanvas
                value={`https://miapp.com/productos/${producto.codigo_producto}`}
                size={100}
                level="M"
                includeMargin
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            {/* Botón para mostrar formulario de ajuste de cantidad */}
            <button
                className={styles.adjustButton}
                onClick={() => setShowAdjustForm(!showAdjustForm)}
            >
                Ajustar Cantidad
            </button>
             {/* Formulario de Ajuste de Cantidad */}
            {showAdjustForm && (
                <div className={styles.adjustForm}>
                <label>Ajustar:</label>
                <select
                    value={adjustOperation}
                    onChange={(e) => setAdjustOperation(e.target.value)}
                >
                    <option value="Agregar">Agregar</option>
                    <option value="Restar">Restar</option>
                </select>
                <input
                    type="number"
                    min="1"
                    value={adjustValue}
                    onChange={(e) => setAdjustValue(e.target.value)}
                    placeholder="Cantidad"
                />
                <div className={styles.adjustFormButtons}>
                    <button onClick={handleAdjustQuantity} className={styles.applyButton}>
                    Aplicar
                    </button>
                    <button onClick={() => setShowAdjustForm(false)} className={styles.cancelButton}>
                    Cancelar
                    </button>
                </div>
                </div>
            )}
            <button
              className={styles.editButton}
              onClick={() => alert("Editar Producto - (No implementado)")}
            >
              Editar Producto
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => alert("Eliminar Producto - (No implementado)")}
            >
              Eliminar Producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
