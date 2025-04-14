// src/routes/clientes.js
import express from "express";
import clientesController from "../controllers/clientesController.js";

const router = express.Router();

// Ruta para listar todos los clientes (con datos agregados, si lo implementas en el microservicio)
router.get("/", clientesController.listClientes);

export default router;
