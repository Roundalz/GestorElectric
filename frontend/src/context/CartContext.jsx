import React, { createContext, useState, useContext } from "react";

// Crear un contexto vacío para el carrito
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.codigo_producto === product.codigo_producto);
      if (existingProduct) {
        return prevCart.map(item =>
          item.codigo_producto === product.codigo_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, cantidad: 1 }];
      }
    });
  };

  // Función para eliminar uno en uno
  const removeFromCart = (codigoProducto) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.codigo_producto === codigoProducto);
      if (existingProduct) {
        if (existingProduct.cantidad > 1) {
          // Reducimos cantidad
          return prevCart.map(item =>
            item.codigo_producto === codigoProducto
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          );
        } else {
          // Eliminamos si la cantidad es 1
          return prevCart.filter(item => item.codigo_producto !== codigoProducto);
        }
      }
      return prevCart;
    });
  };

  // Función para obtener el total
  const getTotal = () => {
    return cart.reduce((total, product) => total + (product.precio_unidad_producto * product.cantidad), 0);
  };
  
  const clearCart = () => {
    setCart([]); // ← Esto vacía el carrito
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el carrito
export const useCart = () => {
  return useContext(CartContext);
};
