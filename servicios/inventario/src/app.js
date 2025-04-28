import express from 'express';
import dotenv from 'dotenv';
import productoRoutes from './routes/productoRoutes.js';
import cors from 'cors';
import pool from './database.js';
import { validarVendedorId }from './middlewares/validateVendedorId.js';

// Carga variables de entorno
dotenv.config();

const app = express();

// Permitir CORS
// app.js en inventario service
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend','http://localhost:5000','http://localhost:5173'],
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','X-Vendedor-Id'], 
  exposedHeaders:  ['X-Vendedor-Id']  
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Conexión a la base de datos al iniciar
pool.connect()
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch(err => console.error('❌ Error al conectar con la base de datos:', err));

// Montamos las rutas del CRUD de productos bajo el prefijo "/inventario"

app.use('/inventario', validarVendedorId);
app.use('/inventario', productoRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Inventario Service funcionando 🚀');
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('🔴 Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Inventario Service corriendo en http://localhost:${PORT}`);
});