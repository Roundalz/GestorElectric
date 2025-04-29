// servicios/nuevoServicio/src/routes/ventaRoutes.js
import express from 'express';
import ventaController from '../controllers/ventaController.js';
import clienteController from '../controllers/clienteController.js';
import giftCardController from '../controllers/giftCardController.js';
import validateVendedorId from '../middlewares/validateVendedorId.js';

const router = express.Router();

// Todas las rutas validan vendedorId
router.use(validateVendedorId);

// --- Ventas ---
router.get('/ventas', ventaController.listarVentas);
router.get('/ventas/:id', ventaController.obtenerVentaPorId);
router.get('/ventas/export/general', ventaController.exportVentasGeneralExcel);
router.get('/ventas/export/:id', ventaController.exportVentaDetalleExcel);

// --- Clientes ---
router.get('/clientes', clienteController.listarClientes);
router.get('/clientes/:id', clienteController.obtenerClientePorId);

// --- GiftCards ---
router.post('/giftcards', giftCardController.crearGiftCard);
router.get('/giftcards', giftCardController.listarGiftCards);
router.put('/giftcards/:id', giftCardController.actualizarGiftCard);
router.delete('/giftcards/:id', giftCardController.eliminarGiftCard);

export default router;
