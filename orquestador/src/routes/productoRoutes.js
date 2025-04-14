// orquestador/src/routes/servicioRoutes.js
import express from 'express';
import {
  getProducto,
  getProductoById
} from '../controllers/productosController.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getProducto);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:id', getProductoById);

export default router;
