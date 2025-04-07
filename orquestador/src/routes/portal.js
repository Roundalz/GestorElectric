import express from 'express';
import { getPortalView, getTemas } from '../controllers/portalController.js';
const router = express.Router();

// Ruta existente
router.get('/login', (req, res) => {
  res.send('Login route');
});

// ✅ Ruta para obtener configuración del portal
router.get('/:vendedorId/view', getPortalView);

// ✅ Ruta para obtener los temas disponibles
router.get('/temas', getTemas);

export default router;
