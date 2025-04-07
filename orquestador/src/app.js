// app.js
import express from 'express';
import cors from 'cors';
import testController from './controllers/testController.js';

import pool from './database.js'; // Importar el pool de conexiones

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests
app.use('/api', testController);


// Rutas principales del orquestador
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

// Proxy de rutas hacia los microservicios
import autenticacionRouter from './routes/autenticacion.js';
app.use("/api/auth", autenticacionRouter);

// Proxy de rutas hacia los microservicios
import portalRouter from './routes/portal.js';
app.use("/api/portales", portalRouter);

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});
