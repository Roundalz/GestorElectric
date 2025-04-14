// orquestador/src/routes/servicioRoutes.js
import express from 'express';
import {
  getPortal,
  getPortalById
} from '../controllers/portalController2.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getPortal);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:id', getPortalById);

export default router;
