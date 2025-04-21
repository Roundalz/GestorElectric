// routes/vendedorRoutes.js
import express from "express";
import {
  obtenerVendedores,
  crearVendedor,
  actualizarVendedor,
  eliminarVendedor,
} from "../controllers/vendedorController.js";

const router = express.Router();

router.get("/", obtenerVendedores);
router.post("/", crearVendedor);
router.put("/:id", actualizarVendedor);
router.delete("/:id", eliminarVendedor);

export default router;