// src/routes/inventario.js
import express from 'express';
import inventarioController from '../controllers/inventarioController.js';

const router = express.Router();

// Productos CRUD
router.post('/productos', inventarioController.createProduct);
router.get('/productos', inventarioController.getProducts);
router.get('/productos/:id', inventarioController.getProductById);
router.put('/productos/:id', inventarioController.updateProduct);
router.patch('/productos/:id/cantidad', inventarioController.updateQuantity);
router.delete('/productos/:id', inventarioController.deleteProduct);

// Características
router.post('/productos/:productId/caracteristicas', inventarioController.setCharacteristics);
router.get('/productos/:productId/caracteristicas', inventarioController.getCharacteristics);
router.put('/caracteristicas/:charId', inventarioController.updateCharacteristic);
router.delete('/productos/:productId/caracteristicas', inventarioController.deleteCharacteristics);

// Imágenes
router.post('/productos/:productId/imagenes', inventarioController.setImages);
router.get('/productos/:productId/imagenes', inventarioController.getImages);
router.put('/imagenes/:imgId', inventarioController.updateImage);
router.delete('/productos/:productId/imagenes', inventarioController.deleteImages);

export default router;
