import express from 'express';
const router = express.Router();

// Aquí definimos las rutas para autenticación
router.get('/login', (req, res) => {
  res.send('Login route');
});

// Exportar el router
export default router;
