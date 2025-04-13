// orquestador/src/routes/autenticacion.js
import express from 'express';
import { registerCliente, loginCliente } from '../controllers/autenticacionController.js';

const router = express.Router();

// Ruta para registro
router.post('/register', registerCliente);

// Ruta para login
router.post('/login', loginCliente);

export default router;
