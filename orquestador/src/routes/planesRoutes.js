// routes/planRoutes.js
 import express from "express";
 import { obtenerPlanesPago } from "../controllers/planesPagoController.js";
 
 const router = express.Router();
 router.get("/", obtenerPlanesPago);
 export default router;