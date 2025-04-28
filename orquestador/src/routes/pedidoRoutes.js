import express from 'express';
import {
  getPedido,
  getPedidoByClienteId,
  crearPedido,
  getDetallePedido
} from '../controllers/pedidoController.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getPedido);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:clienteid', getPedidoByClienteId);


router.post('/crear-pedido', crearPedido);

// Ruta nueva en tu servidor (por ejemplo en pedidoRoutes.js)
router.get('/detalle_pedido/:codigo_pedido', getDetallePedido);


export default router;
