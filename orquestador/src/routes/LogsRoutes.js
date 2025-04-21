import express from "express";
import { obtenerLogs } from "../controllers/logController.js";

const router = express.Router();

// GET todos los logs
router.get("/", obtenerLogs);

export default router;
