// servicios/nuevoServicio/src/routes/ventaRoutes.js
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const clienteController = require('../controllers/clienteController');
const giftCardController = require('../controllers/giftCardController');

// Middleware validar vendedorId siempre antes
const validateVendedorId = require('../middlewares/validateVendedorId');

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

module.exports = router;
