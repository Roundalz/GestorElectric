// servicios/nuevoServicio/src/services/ventaService.js
const ventaModel = require('../models/ventaModel');

async function listarVentas(vendedorId) {
    return await ventaModel.listarVentas(vendedorId);
}

async function obtenerVentaPorId(vendedorId, ventaId) {
    return await ventaModel.obtenerVentaPorId(vendedorId, ventaId);
}

// Exportaciones Excel irán después (modular)

module.exports = {
    listarVentas,
    obtenerVentaPorId,
};
