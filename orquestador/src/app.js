// app.js
import express from 'express';
import cors from 'cors';
import testController from './controllers/testController.js';
import servicioRoutes from './routes/servicioRoutes.js'; // Importa las rutas de servicios

import pool from './database.js'; // Importar el pool de conexiones

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://frontend', 'http://localhost:80', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rutas de CRUD para SERVICIO
app.use("/api/servicios", servicioRoutes);

// Proxy de rutas hacia los microservicios
import autenticacionRouter from './routes/autenticacion.js';
app.use("/api/auth", autenticacionRouter);


// Rutas principales del orquestador
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

<<<<<<< HEAD
// Proxy de rutas hacia los microservicios
import autenticacionRouter from './routes/autenticacion.js';
app.use("/api/auth", autenticacionRouter);

// Proxy de rutas hacia los microservicios
import portalRouter from './routes/portal.js';
app.use("/api/portales", portalRouter);

=======
>>>>>>> ronald
// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});