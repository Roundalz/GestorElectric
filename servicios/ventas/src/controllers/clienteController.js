// servicios/nuevoServicio/src/controllers/clienteController.js
import clienteService from '../services/clienteService.js';

async function listarClientes(req, res, next) {
    try {
        const { vendedorId } = req;
        const clientes = await clienteService.listarClientes(vendedorId);
        res.json(clientes);
    } catch (err) {
        next(err);
    }
}

async function obtenerClientePorId(req, res, next) {
    try {
        const { id } = req.params;
        const cliente = await clienteService.obtenerClientePorId(id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (err) {
        next(err);
    }
}

export default {
    listarClientes,
    obtenerClientePorId,
};