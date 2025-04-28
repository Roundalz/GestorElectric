// src/middlewares/validarVendedorId.js
export function validarVendedorId(req, res, next) {
    const vendedorId = req.headers['x-vendedor-id'];
  
    if (!vendedorId) {
      return res.status(400).json({ error: "Vendedor ID es obligatorio en headers (X-Vendedor-Id)" });
    }
  
    req.vendedorId = parseInt(vendedorId, 10);
    next();
  }
  