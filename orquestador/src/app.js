// app.js
import express from 'express';
import cors from 'cors';
import testController from './controllers/testController.js';
import servicioRoutes from './routes/servicioRoutes.js'; // Importa las rutas de servicios
import autenticacionRouter from './routes/autenticacion.js';
import perfilRoutes from './routes/perfilRoutes.js'; // Importamos las rutas del perfil



import pool from './database.js'; // Importar el pool de conexiones

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests
app.use('/api', testController);

// Rutas de CRUD para SERVICIO
app.use("/api/servicios", servicioRoutes);

// Proxy de rutas hacia los microservicios
app.use("/api/auth", autenticacionRouter);

app.use("/api/perfil", perfilRoutes); // Aquí se añaden las rutas para actualizar perfil


// Rutas principales del orquestador
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});
