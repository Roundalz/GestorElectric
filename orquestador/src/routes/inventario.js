const express = require('express');
const router = express.Router();
const productosController = require('../controllers/inventarioController');

// Redirigir CRUD al microservicio de productos
router.get('/', productosController.listar);
router.get('/:id', productosController.obtener);
router.post('/', productosController.crear);
router.put('/:id', productosController.actualizar);
router.delete('/:id', productosController.eliminar);

module.exports = router;
