// routes/imgProductoRoutes.js
import express from 'express';
import imgProductoController from '../controllers/imgProductoController.js';

const router = express.Router();

// Obtener todas las imágenes de un producto específico (usando el productoId)
router.get('/producto/:productoId', imgProductoController.getAllImgsByProducto);

// Crear una nueva imagen
router.post('/', imgProductoController.createImgProducto);

// Actualizar una imagen por su id (codigo_img_producto)
router.put('/:id', imgProductoController.updateImgProducto);

// Eliminar una imagen por su id
router.delete('/:id', imgProductoController.deleteImgProducto);

export default router;
