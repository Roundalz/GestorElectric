import express from "express";
import { obtenerLogs } from "../controllers/logsController.js";

const router = express.Router();

// GET todos los logs
router.get("/", obtenerLogs);

export default router;