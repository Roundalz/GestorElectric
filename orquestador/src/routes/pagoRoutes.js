import express from "express";
 import { crearPago } from "../controllers/PagoController.js";
 
 const router = express.Router();
 router.post("/", crearPago);          //  POST /api/pagos
 export default router;