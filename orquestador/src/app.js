import express from 'express';
import cors from 'cors';
import pool from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Temporalmente permitir todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json());

// Importar rutas
import servicioRoutes from './routes/servicioRoutes.js';
import portalRouter from './routes/portal.js';
import autenticacionRouter from './routes/autenticacion.js';
import giftCardRoutes from './routes/giftCardRoutes.js';
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
app.use("/api/gift-cards", giftCardRoutes);
// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});