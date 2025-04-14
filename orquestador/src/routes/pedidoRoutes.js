import express from 'express';
import {
  getPedido,
  //getPedidoById,
  getPedidoByClienteId
  //updatePedido,
  //deletePedido
} from '../controllers/pedidoController.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getPedido);

// GET /api/servicios/:id → Obtener un servicio por ID
//router.get('/:id', getPedidoById);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:clienteid', getPedidoByClienteId);

// POST /api/servicios → Crear un nuevo servicio (incluyendo codigo_servicio manualmente)
//router.post('/', createPedido);

// PUT /api/servicios/:id → Actualizar un servicio
//router.put('/:id', updatePedido);

// DELETE /api/servicios/:id → Eliminar un servicio
//router.delete('/:id', deletePedido);

export default router;
