import express from 'express';
import cors from 'cors';
import testController from './controllers/testController.js';
import servicioRoutes from './routes/servicioRoutes.js'; // Importa las rutas de servicios
import autenticacionRouter from './routes/autenticacion.js';
import portalRoutes from './routes/portalRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js'; // Importamos las rutas del perfil

import clientes from "./routes/clientes.js";
import pool from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests

// Rutas de prueba (o cualquier endpoint de prueba)
app.use("/api", testController);

// Rutas de CRUD para SERVICIO
app.use("/api/servicios", servicioRoutes);

// Rutas de CRUD para CLIENTES
app.use("/api/clientes", clientes); // <-- monta tus rutas de clientes aquí

// Proxy de rutas hacia los microservicios
app.use("/api/auth", autenticacionRouter);

// Rutas portal
app.use("/api/portal", portalRoutes);

// Rutas portal
app.use("/api/pedido", pedidoRoutes);

// Rutas producto
app.use("/api/producto", productoRoutes);
app.use("/api/perfil", perfilRoutes); // Aquí se añaden las rutas para actualizar perfil

app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Importar rutas
import servicioRoutes from './routes/servicioRoutes.js';
import portalRouter from './routes/portal.js';
import autenticacionRouter from './routes/autenticacion.js';

// Usar rutas
app.use("/api/servicios", servicioRoutes);
app.use("/api/portales", portalRouter);
app.use("/api/auth", autenticacionRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'orquestador' });
});

// Ruta principal
app.get("/", (req, res) => {
  res.send("Orquestador funcionando 🚀");
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});