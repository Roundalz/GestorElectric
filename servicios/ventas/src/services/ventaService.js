// servicios/nuevoServicio/src/services/ventaService.js
import ventaModel from '../models/ventaModel.js';

async function listarVentas(vendedorId) {
    return await ventaModel.listarVentas(vendedorId);
}

async function obtenerVentaPorId(vendedorId, ventaId) {
    return await ventaModel.obtenerVentaPorId(vendedorId, ventaId);
}

// Exportaciones Excel irán después (modular)

export default {
    listarVentas,
    obtenerVentaPorId,
};