import express from "express";
import { obtenerLogs } from "../controllers/logsController.js";

const router = express.Router();

router.get("/", obtenerLogs);

export default router;
