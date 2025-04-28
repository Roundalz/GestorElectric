// orquestador/src/middlewares/validarVendedorId.js

export function validarVendedorId(req, res, next) {
    const vendedorId = req.header('X-Vendedor-Id');
  
    if (!vendedorId) {
      console.warn('⚠️ Vendedor ID no recibido, usando ID 1 por defecto (modo desarrollo)');
      req.vendedorId = 1; // modo dev
    } else {
      req.vendedorId = parseInt(vendedorId, 10);
    }
  
    next();
  }
  
  export default validarVendedorId;
  