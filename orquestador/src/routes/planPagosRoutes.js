import express from "express";
import {
  actualizarPlan,
  crearPlan,
  eliminarPlan,
  obtenerPlanes,
} from "../controllers/planPagosController.js";

const router = express.Router();

router.get("/", obtenerPlanes);
router.post("/", crearPlan);
router.put("/:id", actualizarPlan);
router.delete("/:id", eliminarPlan);

export default router;