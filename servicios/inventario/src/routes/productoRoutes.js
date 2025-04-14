// routes/productoRoutes.js
import express from "express";
import productoController from "../controllers/productoController.js";

const router = express.Router();

// Crear un producto
router.post("/", productoController.createProducto);

// Listar productos (sólo del vendedor 1)
router.get("/", productoController.getProductos);

// Obtener detalle de producto (incluye características e imágenes)
router.get("/:id", productoController.getProductoDetail);

// Actualizar producto
router.put("/:id", productoController.updateProducto);

// Eliminar producto (remover registros relacionados)
router.delete("/:id", productoController.deleteProducto);

router.get("/export", productoController.exportProductos);


export default router;
