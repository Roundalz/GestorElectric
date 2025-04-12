import express from 'express';
import inventarioController from '../controllers/inventarioController.js';

const router = express.Router(); // Aquí se crea el objeto router

// Ruta de prueba para el microservicio de inventario
router.get('/test', (req, res) => {
  res.json({ message: 'Inventario test OK' });
});;
  

// Ruta para listar todos los productos
router.get('/productos', inventarioController.getAllProductos);

// Ruta para obtener un producto específico
router.get('/productos/:id', inventarioController.getProductoById);

// Ruta para crear un nuevo producto
router.post('/productos', inventarioController.createProducto);

// Ruta para actualizar un producto existente
router.put('/productos/:id', inventarioController.updateProducto);

// Ruta para eliminar un producto
router.delete('/productos/:id', inventarioController.deleteProducto);

 // Habilitar CORS para todas las rutas

export default router;