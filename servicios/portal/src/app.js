import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const { Pool } = pkg;

// Configuración middleware
app.use(cors({
  origin: ['http://localhost', 'http://frontend', 'http://localhost:80'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configuración robusta de Pool
const poolConfig = {
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'GESTOR_ELECTRIC',
  port: parseInt(process.env.DB_PORT) || 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
};

const pool = new Pool(poolConfig);

console.log('Configuración de conexión a PostgreSQL:', poolConfig);

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Prueba la conexión al iniciar
pool.connect()
  .then(client => {
    console.log('✅ Conexión a PostgreSQL establecida');
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('✅ Conexión a PostgreSQL exitosa. Hora actual:', res.rows[0].now);
        client.release();
      });
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err);
    process.exit(1);
  });

// Funciones de negocio (implementación básica)
const obtenerDatosPortal = async (vendedorId) => {
  try {
    const query = 'SELECT * FROM portales WHERE vendedor_id = $1';
    const result = await pool.query(query, [vendedorId]);
    return result.rows[0] || { id: vendedorId, nombre: `Portal ${vendedorId}` };
  } catch (error) {
    console.error('Error en obtenerDatosPortal:', error);
    throw error;
  }
};

const obtenerConfigPortal = async (vendedorId) => {
  try {
    const query = 'SELECT config FROM portales_config WHERE vendedor_id = $1';
    const result = await pool.query(query, [vendedorId]);
    return result.rows[0]?.config || { tema: 'claro', colores: ['azul', 'blanco'] };
  } catch (error) {
    console.error('Error en obtenerConfigPortal:', error);
    throw error;
  }
};

const obtenerProductosPortal = async (vendedorId) => {
  try {
    const query = 'SELECT * FROM productos WHERE vendedor_id = $1';
    const result = await pool.query(query, [vendedorId]);
    return result.rows.length > 0 
      ? result.rows 
      : [{ id: 1, nombre: 'Producto 1' }, { id: 2, nombre: 'Producto 2' }];
  } catch (error) {
    console.error('Error en obtenerProductosPortal:', error);
    throw error;
  }
};

// Endpoints
app.get('/portales/:vendedorId/view', async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.vendedorId);
    
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ error: 'ID de vendedor inválido' });
    }

    const portalData = await obtenerDatosPortal(vendedorId);
    res.set('Content-Type', 'application/json');
    res.status(200).json(portalData);
  } catch (error) {
    console.error('Error en /portales/:vendedorId/view:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/portales/:vendedorId/config', async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.vendedorId);
    
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ error: 'ID de vendedor inválido' });
    }

    const config = await obtenerConfigPortal(vendedorId);
    res.set('Content-Type', 'application/json');
    res.status(200).json(config);
  } catch (error) {
    console.error('Error en /portales/:vendedorId/config:', error);
    res.status(500).json({ 
      error: 'Error al obtener configuración',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/portales/:vendedorId/productos', async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.vendedorId);
    
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ error: 'ID de vendedor inválido' });
    }

    const productos = await obtenerProductosPortal(vendedorId);
    res.set('Content-Type', 'application/json');
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error en /portales/:vendedorId/productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', db: pool.totalCount > 0 ? 'connected' : 'disconnected' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`✅ Servicio Portal corriendo en http://localhost:${PORT}`);
  console.log(`📊 Estado DB: ${pool.totalCount > 0 ? 'Conectado' : 'Desconectado'}`);
});