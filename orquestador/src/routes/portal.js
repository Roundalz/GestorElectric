import express from 'express';
import { 
  getPortalView, 
  getTemas,
  getPortalConfig,
  getProductosPortal 
} from '../controllers/portalController.js';
const router = express.Router();


// ✅ Ruta para obtener configuración del portal
router.get('/:vendedorId/view', getPortalView);

// ✅ Ruta para obtener los temas disponibles
router.get('/temas', getTemas);


// Añade estas rutas
router.get('/:vendedorId/config', getPortalConfig);
router.get('/:vendedorId/productos', getProductosPortal);
export default router;
