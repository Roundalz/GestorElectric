import express from "express";
import ventasController from "../controllers/ventasController.js";

const router = express.Router();

// Cuando se hace GET a /api/ventas, se invoca el controlador
router.get("/", ventasController.getVentas);
router.get("/:id", ventasController.getVentaDetail);
router.get("/export", ventasController.exportVentas);

export default router;
