import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";

function AddProduct() {
  const navigate = useNavigate();
  // Estado para datos generales del producto
  const [product, setProduct] = useState({
    nombre_producto: "",
    tipo_producto: "",
    precio_unidad_producto: "",
    cantidad_disponible_producto: "",
    imagen_referencia_producto: "",
    estado_producto: "",
    calificacion_producto: "",
    costo_producto: "",
    descuento_producto: "",
    VENDEDOR_codigo_vendedore: "1",  // Fijo para vendedor 1
    PORTAL_codigo_portal: ""
  });

  // Para manejar la subida de archivo y su previsualización
  const [filePreview, setFilePreview] = useState("");

  // Estado para características (dinámico)
  const [characteristics, setCharacteristics] = useState([
    { nombre_caracteristica: "", descripcion_caracteristica: "" }
  ]);

  // Manejo de cambios en los inputs del producto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo del cambio del file input para imagen
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct((prev) => ({
        ...prev,
        file,
        // Utilizamos la URL creada para previsualización
        imagen_referencia_producto: URL.createObjectURL(file)
      }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Agregar nueva característica al array
  const addCharacteristic = () => {
    setCharacteristics((prev) => [
      ...prev,
      { nombre_caracteristica: "", descripcion_caracteristica: "" }
    ]);
  };

  // Manejar cambios en las características
  const handleCharacteristicChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...characteristics];
    updated[index][name] = value;
    setCharacteristics(updated);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Armar el objeto final a enviar; en este ejemplo, se envía como JSON.
    // Si la imagen es un archivo y el backend espera multipart/form-data,
    // tendrás que usar FormData.
    const productData = { ...product, caracteristicas: characteristics };
    console.log("Enviando producto:", productData);

    try {
      const response = await fetch("http://localhost:5000/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert("Producto creado exitosamente");
        navigate("/inventario"); // Redirigir a la lista de productos o donde desees
      } else {
        const errorData = await response.json();
        alert("Error al crear producto: " + errorData.error);
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error al enviar producto.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Agregar Nuevo Producto</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nombre del Producto:</label>
          <input
            type="text"
            name="nombre_producto"
            value={product.nombre_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Tipo de Producto:</label>
          <input
            type="text"
            name="tipo_producto"
            value={product.tipo_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Precio Unitario:</label>
          <input
            type="number"
            name="precio_unidad_producto"
            value={product.precio_unidad_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Cantidad Disponible:</label>
          <input
            type="number"
            name="cantidad_disponible_producto"
            value={product.cantidad_disponible_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Imagen del Producto:</label>
          <input
            type="text"
            name="imagen_referencia_producto"
            value={product.imagen_referencia_producto}
            onChange={handleChange}
            placeholder="O ingresa URL de imagen"
          />
          <span className={styles.or}>OR</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {filePreview && (
            <img src={filePreview} alt="Vista previa" className={styles.previewImage} />
          )}
        </div>
        <div className={styles.formGroup}>
            <label>Estado del Producto:</label>
            <select
                name="estado_producto"
                value={product.estado_producto}
                onChange={handleChange}
                required
            >
                <option value="">Selecciona...</option>
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
            </select>
        </div>

        <div className={styles.formGroup}>
          <label>Calificación:</label>
          <input
            type="number"
            name="calificacion_producto"
            value={product.calificacion_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Costo:</label>
          <input
            type="number"
            name="costo_producto"
            value={product.costo_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Descuento (%):</label>
          <input
            type="number"
            name="descuento_producto"
            value={product.descuento_producto}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Código del Portal:</label>
          <input
            type="text"
            name="PORTAL_codigo_portal"
            value={product.PORTAL_codigo_portal}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Características</h2>
        {characteristics.map((charac, index) => (
          <div key={index} className={styles.characteristicGroup}>
            <input
              type="text"
              name="nombre_caracteristica"
              placeholder="Nombre característica"
              value={charac.nombre_caracteristica}
              onChange={(e) => handleCharacteristicChange(index, e)}
              required
            />
            <input
              type="text"
              name="descripcion_caracteristica"
              placeholder="Descripción"
              value={charac.descripcion_caracteristica}
              onChange={(e) => handleCharacteristicChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={addCharacteristic}>
          + Agregar Característica
        </button>

        <button type="submit" className={styles.submitButton}>
          Guardar Producto
        </button>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
            Cancelar
        </button>
      </form>
    </div>
  );
}

export default AddProduct;