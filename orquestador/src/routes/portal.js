import express from 'express';
import {
    getPortalConfig,
    getTemas,
    updatePortalConfig,
    getVendedorPlan,
    getProductosPortal,
    getPortalView,
    updateProducto,
    deleteProducto,
    uploadFile
} from '../controllers/portalController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Configuración del portal
router.get('/:vendedorId/config', getPortalConfig);
router.get('/vendedor/:id/plan', getVendedorPlan);
router.get('/temas', getTemas);
router.put('/portal/config', updatePortalConfig);

// Productos
router.get('/:vendedorId/productos', getProductosPortal);
router.put('/productos/:productId', updateProducto);
router.delete('/productos/:productId', deleteProducto);

// Uploads
router.post('/upload', upload.single('file'), uploadFile);

// Vista del portal
router.get('/:vendedorId/view', getPortalView);

export default router;