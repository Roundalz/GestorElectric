import express from 'express';
import {
  productController,
  characteristicController,
  imageController,
  eventLogController
} from '../controllers/index.js';

const router = express.Router();

// PRODUCTOS
router.post('/productos', productController.createProduct);
router.get('/productos', productController.getProducts);
router.get('/productos/:id', productController.getProductById);
router.put('/productos/:id', productController.updateProduct);
router.patch('/productos/:id/cantidad', productController.updateQuantity);
router.delete('/productos/:id', productController.deleteProduct);

// CARACTERISTICAS
router.post(
  '/productos/:productId/caracteristicas',
  characteristicController.setCharacteristics
);
router.get(
  '/productos/:productId/caracteristicas',
  characteristicController.getCharacteristicsByProduct
);
router.put(
  '/caracteristicas/:charId',
  characteristicController.updateCharacteristic
);
router.delete(
  '/productos/:productId/caracteristicas',
  characteristicController.deleteCharacteristicsByProduct
);

// IMAGENES
router.post(
  '/productos/:productId/imagenes',
  imageController.setImages
);
router.get(
  '/productos/:productId/imagenes',
  imageController.getImagesByProduct
);
router.put(
  '/imagenes/:imgId',
  imageController.updateImage
);
router.delete(
  '/productos/:productId/imagenes',
  imageController.deleteImagesByProduct
);

// LOG EVENTO
router.get('/logs', eventLogController.getAllLogs);
router.get('/logs/:id', eventLogController.getLogById);

export default router;