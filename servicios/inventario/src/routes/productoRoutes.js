// routes/productoRoutes.js
import express from 'express';
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/productoController.js';

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/productos', getAllProductos);

// Ruta para obtener un producto específico por ID
router.get('/productos/:id', getProductoById);

// Ruta para crear un nuevo producto
router.post('/productos', createProducto);

// Ruta para actualizar un producto existente por ID
router.put('/productos/:id', updateProducto);

// Ruta para eliminar un producto por ID
router.delete('/productos/:id', deleteProducto);

export default router;
