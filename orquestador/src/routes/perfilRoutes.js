// orquestador/src/routes/perfilRoutes.js
import express from 'express';
import { updateClienteProfile, updateVendedorProfile } from '../controllers/perfilController.js';

const router = express.Router();

// Ruta para actualizar el perfil de un cliente
router.put('/cliente/:id', updateClienteProfile);

// Ruta para actualizar el perfil de un vendedor
router.put('/vendedor/:id', updateVendedorProfile);

export default router;
