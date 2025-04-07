import React from 'react';
import { cartProducts } from './cartData';
import CartCard from './CartCard';
import './CardStyles.css';

const Carrito = () => {
  const total = cartProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="cart-container">
      {/* Sección izquierda - Productos */}
      <div className="cart-products">
        {cartProducts.map((product) => (
          <CartCard
            key={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>

      {/* Sección derecha - Resumen */}
      <div className="cart-summary">
        <h2>Resumen del Carrito</h2>
        {cartProducts.map((product) => (
          <div className="cart-item" key={product.id}>
            <span>{product.title}</span>
            <span>${product.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
