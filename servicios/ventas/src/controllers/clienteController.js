// servicios/nuevoServicio/src/controllers/clienteController.js
const clienteService = require('../services/clienteService');

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

module.exports = {
    listarClientes,
    obtenerClientePorId,
};
