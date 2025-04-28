import express from 'express';
import dotenv from 'dotenv';
import productoRoutes from './routes/productoRoutes.js';
import cors from 'cors';
import pool from './database.js';


// Carga variables de entorno
dotenv.config();

const app = express();

// Permitir CORS
dotenv.config();  // Already loaded env
// app.js en inventario service
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend','http://localhost:5000'],
  methods: ['GET','POST','PUT','DELETE']
}));


// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos al iniciar
pool.connect()
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch(err => console.error('❌ Error al conectar con la base de datos:', err));

// Montamos las rutas del CRUD de productos bajo el prefijo "/inventario"
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