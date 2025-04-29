// routes/planRoutes.js
import express from "express";
import { obtenerPlanesPago, cambiarPlanVendedor } from "../controllers/planesPagoController.js";

const router = express.Router();

router.get("/", obtenerPlanesPago);                       // /api/planes/
router.put("/cambiar/:codigo_vendedore", cambiarPlanVendedor); // /api/planes/cambiar/:id

export default router;

