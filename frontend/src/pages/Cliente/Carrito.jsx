import React from 'react';
import { useCart } from "../../context/CartContext";
import Card from './card/InicioCard';
import './styles/CarritoStylEs.css';

const Carrito = () => {
  const { cart, removeFromCart, getTotal, clearCart } = useCart(); // Agregué clearCart por si quieres limpiar el carrito al final

  const handleCrearPedido = async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    try {
      const clienteId = 1; // 🔥 aquí debes poner el ID del cliente actual (puedes traerlo de otra variable global si quieres)

      const productos = cart.map((item) => ({
        codigo_producto: item.codigo_producto,
        precio_unitario: item.precio_unidad_producto,
        vendedor_codigo_vendedore: item.vendedor_codigo_vendedore
      }));

      const response = await fetch('http://localhost:5000/api/pedido/crear-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clienteId, productos }),
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Pedido creado exitosamente!');
        clearCart(); // Limpiar carrito después de compra
      } else {
        alert('Error al crear el pedido.');
      }
    } catch (error) {
      console.error('Error en la creación del pedido:', error);
      alert('Hubo un problema al crear el pedido.');
    }
  };

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
          <div className="cart-item" key={product.codigo_producto}>
            <span>{product.nombre_producto}</span>
            <span>{product.precio_unidad_producto} Bs.</span>
          </div>
        ))}

        <div className="cart-total">
          <h3>Total: {getTotal()} Bs.</h3>
        </div>

        {/* 🔥 Botón para crear pedido */}
        <button className="create-order-btn" onClick={handleCrearPedido}>
          Crear Pedido
        </button>
      </div>
    </div>
  );
};

export default Carrito;
