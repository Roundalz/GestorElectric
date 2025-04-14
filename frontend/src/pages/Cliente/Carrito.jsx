import React from 'react';
//import { cartProducts } from './data/CarritoData';
import { useCart } from "../../context/CartContext";
import Card from './card/InicioCard';
import './styles/CarritoStylEs.css';

const Carrito = () => {
  const { cart, removeFromCart, getTotal } = useCart(); // Extraemos el carrito y las funciones

  return (
    <div className="cart-container">
      {/* Sección izquierda - Productos */}
      <div className="cart-products">
        {cart.map((item) => (
          <Card
            key={item.codigo_producto}
            image="https://a.rgbimg.com/users/o/or/organza3/300/mtgVC1W.jpg"
            title={`${item.nombre_producto}`}
            line1={`${item.tipo_producto}`}
            line2={`${item.precio_unidad_producto} Bs.`}
          />
        ))}
      </div>

      {/* Sección derecha - Resumen */}
      <div className="cart-summary">
        <h2>Resumen del Carrito</h2>
        {cart.map((product) => (
          <div className="cart-item" key={product.id}>
            <span>{product.nombre_producto}</span>
            <span>{product.precio_unidad_producto} Bs.</span>
          </div>
        ))}
        <div className="cart-total">
          <h3>Total: ${getTotal()}</h3>
        </div>
      </div>
    </div>
  );
};

export default Carrito;