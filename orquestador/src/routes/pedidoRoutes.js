import express from 'express';
import {
  getPedido,
  getPedidoByClienteId,
  crearPedido,
  getPedidosByCliente,
  getDetallePedido
} from '../controllers/pedidoController.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getPedido);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:clienteid', getPedidoByClienteId);


router.post('/crear-pedido', crearPedido);

// Obtener todos los pedidos de un cliente
router.get('/codigo/:codigoCliente', getPedidosByCliente);

// Obtener detalles de un pedido específico
router.get('/detalle/:codigoPedido', getDetallePedido);


export default router;
