// routes/ventaRoutes.js
import express from "express";
import ventaController from "../controllers/ventaController.js";

const router = express.Router();

router.get("/", ventaController.listVentas);
router.get("/export", ventaController.exportVentas);
router.get("/:id", ventaController.ventaDetail);


// Puedes agregar más rutas, por ejemplo, para exportar a Excel, con endpoints como:
// router.get("/:id/export", ventaController.exportVenta);
// router.get("/export", ventaController.exportVentas);

export default router;
