import express from 'express';
import {
  getPortalConfig,
  updatePortalConfig,
  getVendedorPlan,
  getProductosPortal,
  getPortalView,
  updateProducto,
  deleteProducto,
  getDashboardData,
  getHistoricoConfiguracion,
  getProductImages,
  portalActivo,
  visita
} from '../controllers/portalController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Rutas más específicas primero
router.get('/vendedor/:id/plan', getVendedorPlan);

// Rutas con parámetros similares después
router.get('/:vendedorId/config', getPortalConfig);
router.get('/:vendedorId/productos', getProductosPortal);
router.get('/:vendedorId/dashboard', getDashboardData);
router.get('/:vendedorId/view', getPortalView);

// Otras rutas
router.put('/:vendedorId/config', updatePortalConfig);
router.put('/productos/:productId', updateProducto);
router.delete('/productos/:productId', deleteProducto);
router.get('/productos/:productId/imagenes', getProductImages);


router.get('/historico/:portalCodigo', getHistoricoConfiguracion);

router.get('/activos', portalActivo);
router.put('/:codigoPortal/visita', visita); 


router.use((err, req, res, next) => {
    console.error('Error en rutas:', err);
    res.status(500).json({ error: 'Error interno en el servidor de rutas' });
  });
export default router;