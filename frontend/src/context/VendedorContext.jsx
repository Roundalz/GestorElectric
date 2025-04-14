// En tu archivo de contexto (VendedorContext.js)
import React, { createContext, useState, useContext } from 'react';

const VendedorContext = createContext();

export const VendedorProvider = ({ children }) => {
  const [vendedorId, setVendedorId] = useState(2); // O el ID inicial que corresponda

  return (
    <VendedorContext.Provider value={{ vendedorId, setVendedorId }}>
      {children}
    </VendedorContext.Provider>
  );
};

export const useVendedor = () => {
  const context = useContext(VendedorContext);
  if (!context) {
    throw new Error('useVendedor debe usarse dentro de un VendedorProvider');
  }
  return context;
};