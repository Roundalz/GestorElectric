// app.js
import express from 'express';
import cors from 'cors';
import testController from './controllers/testController.js';
import dotenv from 'dotenv';
dotenv.config();

import pool from './database.js'; // Importar el pool de conexiones


pool.query('SELECT 1', (err, result) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida correctamente.');
  }
});

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests

// Rutas de prueba
app.use('/api', testController);

// Ruta principal del orquestador
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

// Rutas de autenticación
import autenticacionRouter from './routes/autenticacion.js';
app.use("/api/auth", autenticacionRouter);

// Rutas de inventario: Aquí se agregan las rutas que actuarán como proxy para el microservicio de inventario
import inventarioRouter from './routes/inventario.js';
app.use("/api/inventario", inventarioRouter);
// En tu app.js o en un archivo de rutas específico
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Orquestador funcionando correctamente" });
});


// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});
