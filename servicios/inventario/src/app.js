// app.js
import express from 'express';
import dotenv from 'dotenv';
import productoRoutes from './routes/productoRoutes.js';
import caracteristicaRoutes from './routes/caracteristicaRoutes.js';
import imgProductoRoutes from './routes/imgProductoRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
// Middleware para parsear JSON
app.use(express.json());

// Montamos las rutas del CRUD de productos bajo el prefijo "/inventario"
app.use('/inventario', productoRoutes);
app.use('/inventario/caracteristicas', caracteristicaRoutes);
app.use('/inventario/imagenes', imgProductoRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Inventario Service funcionando 🚀');
});

// Configuración del puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Inventario Service corriendo en http://localhost:${PORT}`);
});
