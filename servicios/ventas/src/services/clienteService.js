// servicios/nuevoServicio/src/services/clienteService.js
import clienteModel from '../models/clienteModel.js';

async function listarClientes(vendedorId) {
    return await clienteModel.listarClientes(vendedorId);
}

async function obtenerClientePorId(clienteId) {
    return await clienteModel.obtenerClientePorId(clienteId);
}

export default {
    listarClientes,
    obtenerClientePorId,
};