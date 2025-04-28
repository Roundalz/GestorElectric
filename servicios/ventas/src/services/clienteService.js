// servicios/nuevoServicio/src/services/clienteService.js
const clienteModel = require('../models/clienteModel');

async function listarClientes(vendedorId) {
    return await clienteModel.listarClientes(vendedorId);
}

async function obtenerClientePorId(clienteId) {
    return await clienteModel.obtenerClientePorId(clienteId);
}

module.exports = {
    listarClientes,
    obtenerClientePorId,
};
