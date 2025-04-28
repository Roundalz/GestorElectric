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
  const { user } = useContext(AuthContext);

  /*  ID inicial si ya hay un vendedor en sesión  */
  const [vendedorId, setVendedorId] = useState(
    user?.role === "vendedor" ? user.codigo_vendedore : null
  );

  /*  Sincroniza ID cuando cambia el usuario  */
  useEffect(() => {
    if (user && user.role === "vendedor") {
      setVendedorId(user.codigo_vendedore);
    } else {
      setVendedorId(null);
    }
  }, [user]);

  /*  Log a consola cada vez que cambie el ID  */
  useEffect(() => {
    console.log("🔌 Vendedor ID actualizado →", vendedorId);
  }, [vendedorId]);

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