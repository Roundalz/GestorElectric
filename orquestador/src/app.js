import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import validarVendedorId from './middlewares/validarVendedorId.js';



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

// Global middleware
app.use(cors({
  origin: ['http://localhost:3000','http://localhost', 'http://frontend'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','X-Vendedor-Id'],
  exposedHeaders: ['Content-Disposition']
}));

app.use(validarVendedorId);
// ↑ Aquí subimos el tamaño máximo del body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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
