import express from "express";
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", getClientes);
router.post("/", createCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;