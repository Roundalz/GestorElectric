// src/context/VendedorContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { AuthContext } from "./AuthContext";

const VendedorContext = createContext();

export const VendedorProvider = ({ children }) => {
  const [vendedorId, setVendedorId] = useState(5); // O el ID inicial que corresponda

  return (
    <VendedorContext.Provider value={{ vendedorId, setVendedorId }}>
      {children}
    </VendedorContext.Provider>
  );
};

export const useVendedor = () => {
  const ctx = useContext(VendedorContext);
  if (!ctx)
    throw new Error("useVendedor debe usarse dentro de un VendedorProvider");
  return ctx;
};
