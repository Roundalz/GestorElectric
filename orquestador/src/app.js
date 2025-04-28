import express from 'express';
import cors from 'cors';

import testController from './controllers/testController.js';

import autenticacionRouter from './routes/autenticacion.js';
import clientes from "./routes/clientesRoutes.js"; 
import inventarioRouter from './routes/inventario.js';
import logsRoutes from "./routes/LogsRoutes.js"; // <-- Asegúrate de importar las rutas de logs
import servicioRoutes from './routes/servicioRoutes.js'; // Importa las rutas de servicios
import pagoRoutes from "./routes/pagoRoutes.js";
import planPagosRoutes from "./routes/planPagosRoutes.js";
import planesRoutes   from './routes/planesRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js'; // Importamos las rutas del perfil
import portalRoutes from './routes/portalRoutes.js';
import portalRouter from './routes/portal.js';
import productoRoutes from './routes/productoRoutes.js';
import vendedorRoutes from "./routes/vendedorRoutes.js";
import ventasRoutes from "./routes/ventas.js"; 

import dotenv from 'dotenv';
import pool from './database.js';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './database.js';

// Controllers & Routes
import testController from './controllers/testController.js';
import servicioRoutes from './routes/servicioRoutes.js';
import vendedorRoutes from './routes/vendedorRoutes.js';
import autenticacionRouter from './routes/autenticacion.js';
import portalRoutes from './routes/portalRoutes.js';
import portalRouter from './routes/portal.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import planPagosRoutes from './routes/planPagosRoutes.js';
import planesRoutes from './routes/planesRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import inventarioRouter from './routes/inventario.js';
import ventasRoutes from './routes/ventas.js';

// Load environment variables
dotenv.config();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check DB connection at startup
pool.query('SELECT 1', (err) => {
  if (err) console.error('❌ Error de conexión a la base de datos:', err);
  else console.log('✅ Conexión a la base de datos establecida correctamente.');
});

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar JSON en requests

// Rutas de prueba (o cualquier endpoint de prueba)
app.use("/api", testController);

// Rutas de CRUD para LOGS
app.use("/api/logs", logsRoutes); // <-- Monta tus rutas de logs aquí

// Luego de otros `app.use`, monta esto:
app.use("/api/planes_pago", planPagosRoutes);

// Rutas de CRUD para VENDEDOR
app.use("/api/vendedores", vendedorRoutes);

// Rutas de CRUD para SERVICIO
app.use("/api/servicios", servicioRoutes);

// Luego de otros `app.use`, monta esto:
app.use("/api/planes_pago", planPagosRoutes);
app.use("/api/planes", planesRoutes);
app.use("/api/pagos", pagoRoutes);

// Rutas de CRUD para VENDEDOR
app.use("/api/vendedores", vendedorRoutes);
 
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

// Global middleware
app.use(cors({
  origin: ['http://localhost:3000','http://localhost', 'http://frontend'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));
app.options('*', cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/test', testController);
app.use('/api/servicios', servicioRoutes);
app.use('/api/planes_pago', planPagosRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/auth', autenticacionRouter);
app.use('/api/portal', portalRoutes);
app.use('/api/portales', portalRouter);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/inventario', inventarioRouter);
app.use('/api/ventas', ventasRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'orquestador' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Orquestador funcionando 🚀');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Orquestador corriendo en http://localhost:${PORT}`);
});
