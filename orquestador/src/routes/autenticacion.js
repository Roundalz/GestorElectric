import express from 'express';
import {
  registerCliente,
  registerVendedor,
  loginCliente,
  loginVendedor
} from '../controllers/autenticacionController.js';

const router = express.Router();

// RUTAS DE REGISTRO
router.post('/register/cliente', registerCliente);
router.post('/register/vendedor', registerVendedor);

// RUTAS DE LOGIN
router.post('/login/cliente', loginCliente);
router.post('/login/vendedor', loginVendedor);

export default router;
