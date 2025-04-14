import express from 'express';
import cors from 'cors';
import pool from './database.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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