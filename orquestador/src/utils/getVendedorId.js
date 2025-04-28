// src/utils/getVendedorId.js
export function getVendedorId(req) {
    const vendedorId = req.headers['x-vendedor-id'];
  
    if (!vendedorId) {
      console.warn("⚠️ Vendedor ID no recibido, usando ID 1 por defecto (modo desarrollo)");
      return 1; // Usa 1 como ID por defecto
    }
  
    return parseInt(vendedorId, 10);
  }
  