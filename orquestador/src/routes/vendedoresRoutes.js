import express from "express";
import {
  actualizarVendedor,
  crearVendedor,
  eliminarVendedor,
  obtenerVendedores,
} from "../controllers/vendedorController.js";

const router = express.Router();

router.get("/", obtenerVendedores);
router.post("/", crearVendedor);
router.put("/:id", actualizarVendedor);
router.delete("/:id", eliminarVendedor);

export default router;
