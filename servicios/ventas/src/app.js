// servicios/ventas/src/app.js
const express = require('express');
const ventaRoutes = require('./routes/ventaRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Opcional si quieres capturar errores globales

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use('/api/ventas', ventaRoutes);

// Manejo de errores (opcional)
app.use(errorHandler);

// Levantar servidor directamente
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Microservicio ventas corriendo en puerto ${port}`);
});
