import express from "express";
import {
  actualizarPlan,
  crearPlan,
  eliminarPlan,
  obtenerPlanes,
} from "../controllers/planDePagosController.js";

const router = express.Router();

router.get("/", obtenerPlanes);
router.post("/", crearPlan);
router.put("/:id", actualizarPlan);
router.delete("/:id", eliminarPlan);

export default router;
/////////////////////Anghelo/////////////////
import clienteRoutes from "./routes/clientes.js";
app.use("/api/clientes", clienteRoutes);

import planDePagosRoutes from "./routes/planDePagos.js";
app.use("/api/planes", planDePagosRoutes);

import vendedorRoutes from "./routes/vendedores.js";
app.use("/api/vendedores", vendedorRoutes);

import logsRoutes from "./routes/logs.js";
app.use("/api/logs", logsRoutes);
