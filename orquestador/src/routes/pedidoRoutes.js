import express from 'express';
import {
  getPedido,
  getPedidoByClienteId,
  crearPedido
} from '../controllers/pedidoController.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getPedido);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:clienteid', getPedidoByClienteId);


router.post('/crear-pedido', crearPedido);

export default router;
