// En tu archivo de contexto (VendedorContext.js)
import React, { createContext, useState, useContext } from 'react';

const vendedorContext = createContext();

export const VendedorProvider = ({ children }) => {
  const [vendedorId, setVendedorId] = useState(4); // O el ID inicial que corresponda

  return (
    <vendedorContext.Provider value={{ vendedorId, setVendedorId }}>
      {children}
    </vendedorContext.Provider>
  );
};

export const useVendedor = () => {
  const context = useContext(vendedorContext);
  if (!context) {
    throw new Error('useVendedor debe usarse dentro de un VendedorProvider');
  }
  return context;
};