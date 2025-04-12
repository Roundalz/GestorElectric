// routes/caracteristicaRoutes.js
import express from 'express';
import caracteristicaController from '../controllers/caracteristicaController.js';

const router = express.Router();

// Para obtener todas las características de un producto, se usa un parámetro productoId
router.get('/producto/:productoId', caracteristicaController.getAllCaracteristicasByProducto);

// Crear una nueva característica
router.post('/', caracteristicaController.createCaracteristica);

// Actualizar una característica por su ID
router.put('/:id', caracteristicaController.updateCaracteristica);

// Eliminar una característica por su ID
router.delete('/:id', caracteristicaController.deleteCaracteristica);

export default router;
