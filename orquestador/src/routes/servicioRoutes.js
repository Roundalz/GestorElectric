// orquestador/src/routes/servicioRoutes.js
import express from 'express';
import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
} from '../controllers/servicioController.js';

const router = express.Router();

// GET /api/servicios → Obtener todos los servicios
router.get('/', getServicios);

// GET /api/servicios/:id → Obtener un servicio por ID
router.get('/:id', getServicioById);

// POST /api/servicios → Crear un nuevo servicio (incluyendo codigo_servicio manualmente)
router.post('/', createServicio);

// PUT /api/servicios/:id → Actualizar un servicio
router.put('/:id', updateServicio);

// DELETE /api/servicios/:id → Eliminar un servicio
router.delete('/:id', deleteServicio);

export default router;
