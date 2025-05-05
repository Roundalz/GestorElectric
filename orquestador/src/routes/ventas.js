// src/routes/ventas.js
import express from 'express';
import {
  proxyVentas,
  proxyVentaDetalle,
  proxyClientes,
  proxyClienteDetalle,
  crearGiftCard,
  listarGiftCards,
  actualizarGiftCard,
  eliminarGiftCard,
  exportVentasGeneral,
  exportVentaDetalle,
} from '../controllers/ventasController.js';

const router = express.Router();

router.get('/export/general', exportVentasGeneral);
router.get('/export/:id', exportVentaDetalle);
router.get('/clientes', proxyClientes);
router.get('/clientes/:id', proxyClienteDetalle);
router.post('/giftcards', crearGiftCard);
router.get('/giftcards', listarGiftCards);
router.put('/giftcards/:id', actualizarGiftCard);
router.delete('/giftcards/:id', eliminarGiftCard);

// --- Venta principal ---
router.get('/', proxyVentas);
router.get('/:id', proxyVentaDetalle);

export default router;