import express from 'express';
import {
  registerCliente,
  registerVendedor,
  loginCliente,
  loginVendedor,
  logoutUsuario
} from '../controllers/autenticacionController.js';
import { intentoFallido } from '../controllers/autenticacionController.js';

const router = express.Router();

// RUTAS DE REGISTRO
router.post('/register/cliente', registerCliente);
router.post('/register/vendedor', registerVendedor);

// RUTAS DE LOGIN
router.post('/login/cliente', loginCliente);
router.post('/login/vendedor', loginVendedor);
router.post('/login/attempt', intentoFallido);   // ⬅ nuevo

// routes/auth.js  (o el archivo donde defines rutas)
router.post('/logout', logoutUsuario);


export default router;
