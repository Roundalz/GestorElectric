// src/context/VendedorContext.js
import { createContext, useState } from 'react';

export const VendedorContext = createContext();

export const VendedorProvider = ({ children }) => {
  const [vendedorId, setVendedorId] = useState(2); // Valor por defecto
  
  return (
    <VendedorContext.Provider value={{ vendedorId, setVendedorId }}>
      {children}
    </VendedorContext.Provider>
  );
};