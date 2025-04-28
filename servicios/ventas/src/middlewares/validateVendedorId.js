// src/middlewares/validateVendedorId.js
function validateVendedorId(req, res, next) {
    const vendedorId = parseInt(req.headers['x-vendedor-id'], 10);

    if (isNaN(vendedorId) || vendedorId <= 0) {
        return res.status(400).json({ error: 'vendedorId inválido. Debe ser un número positivo.' });
    }

    req.vendedorId = vendedorId;
    next();
}

export default validateVendedorId;