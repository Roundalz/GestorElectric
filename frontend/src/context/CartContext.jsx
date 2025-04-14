import React, { createContext, useState, useContext } from "react";

// Crear un contexto vacío para el carrito
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Función para eliminar productos del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Función para obtener el total del carrito
  const getTotal = () => {
    return cart.reduce((total, product) => total + product.precio_unidad_producto, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el carrito en otros componentes
export const useCart = () => {
  return useContext(CartContext);
};