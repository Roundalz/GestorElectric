import React, { useEffect, useState } from "react";
import Card from './card';
import './CardStyles.css';

const Inicio = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5005/api/productos')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Error al obtener productos:', err));
  }, []);

  return (
    <div className="cards-container">
      <div className="cards-grid">
        {items.map((item) => (
          <Card
            key={item.codigo_producto}
            image="https://a.rgbimg.com/users/o/or/organza3/300/mtgVC1W.jpg"
            title={`${item.nombre_producto}`}
            line1={`${item.descripcion}`}
            line2={`${item.precio_unidad_producto} Bs.`}
          />
        ))}
      </div>
    </div>
  );
};
  
  export default Inicio;
  