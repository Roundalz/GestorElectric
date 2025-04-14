import React, { useEffect, useState } from "react";
import Card from './card/InicioCard';
import './styles/InicioStyles.css';
import { useCart } from "../../context/CartContext";

const Inicio = () => {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart(); // Extraemos la función para agregar productos al carrito

  // Obtener servicios
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/producto');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="cards-container">
      <div className="cards-grid">
        {items.map((item) => (
          <div>
          <Card
            key={item.codigo_producto}
            image="https://a.rgbimg.com/users/o/or/organza3/300/mtgVC1W.jpg"
            title={`${item.nombre_producto}`}
            line1={`${item.tipo_producto}`}
            line2={`${item.precio_unidad_producto} Bs.`}
          />
          <br/>
          <button class='details-button' onClick={() => addToCart(item)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
      <br></br>
    </div>
  );
};
  
  export default Inicio;