// src/routes/routes-inventario.js
import express from "express";
import inventarioController from "../controllers/inventarioController.js";

const router = express.Router();

// Rutas del CRUD de productos:

// Obtener lista de productos
router.get("/", inventarioController.getAllProductos);

// Obtener detalle de un producto (por su id)
router.get("/:id", inventarioController.getProductoDetail);

// Crear un producto nuevo
router.post("/", inventarioController.createProducto);

// Actualizar un producto existente
router.put("/:id", inventarioController.updateProducto);

// Eliminar un producto (y registros relacionados)
router.delete("/:id", inventarioController.deleteProducto);

export default router;
