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
// Funciones de negocio actualizadas
const obtenerDatosPortal = async (vendedorId) => {
  try {
    const query = `
      SELECT p.*, v.nombre_empresa, v.logo_empresa, v.banner_empresa 
      FROM PORTAL p
      JOIN VENDEDOR v ON p.VENDEDOR_codigo_vendedore = v.codigo_vendedore
      WHERE p.VENDEDOR_codigo_vendedore = $1`;
    const result = await pool.query(query, [vendedorId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error en obtenerDatosPortal:', error);
    throw error;
  }
};

const obtenerConfigPortal = async (vendedorId) => {
  try {
    const query = `
      SELECT * FROM PORTAL_CONFIGURACION 
      WHERE PORTAL_codigo_portal = (
        SELECT codigo_portal FROM PORTAL WHERE VENDEDOR_codigo_vendedore = $1
      )`;
    const result = await pool.query(query, [vendedorId]);
    
    if (result.rows.length === 0) {
      // Crear configuración por defecto si no existe
      const portalRes = await pool.query(
        'SELECT codigo_portal FROM PORTAL WHERE VENDEDOR_codigo_vendedore = $1', 
        [vendedorId]
      );
      
      if (portalRes.rows.length === 0) {
        throw new Error('No existe portal para este vendedor');
      }
      
      const codigo_portal = portalRes.rows[0].codigo_portal;
      const defaultConfig = {
        estilo_titulo: 'centrado',
        tema_seleccionado: 'claro',
        color_principal: '#4a6baf',
        color_secundario: '#f8f9fa',
        color_fondo: '#ffffff',
        fuente_principal: 'Arial',
        disposicion_productos: 'grid',
        productos_por_fila: 3,
        mostrar_precios: true,
        mostrar_valoraciones: true,
        estilo_header: 'normal',
        mostrar_busqueda: true,
        mostrar_categorias: true,
        estilos_productos: '{}',
        mostrar_banner: true,
        logo_personalizado: '',
        banner_personalizado: '',
        fecha_actualizacion: new Date()
      };
      
      const insertRes = await pool.query(
        `INSERT INTO PORTAL_CONFIGURACION (
          PORTAL_codigo_portal, ${Object.keys(defaultConfig).join(', ')}
        ) VALUES ($1, ${Object.keys(defaultConfig).map((_, i) => `$${i+2}`).join(', ')}) 
        RETURNING *`,
        [codigo_portal, ...Object.values(defaultConfig)]
      );
      
      return insertRes.rows[0];
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error en obtenerConfigPortal:', error);
    throw error;
  }
};

const obtenerProductosPortal = async (vendedorId) => {
  try {
    const query = `
      SELECT * FROM PRODUCTOS 
      WHERE VENDEDOR_codigo_vendedore = $1
      AND estado_producto = 'activo'`;
    const result = await pool.query(query, [vendedorId]);
    return result.rows;
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

    // Obtener datos del portal y vendedor
    const portalData = await obtenerDatosPortal(vendedorId);
    if (!portalData) {
      return res.status(404).json({ error: 'Portal no encontrado' });
    }

    // Obtener configuración
    const config = await obtenerConfigPortal(vendedorId);
    
    // Obtener productos
    const productos = await obtenerProductosPortal(vendedorId);

    res.set('Content-Type', 'application/json');
    res.status(200).json({
      vendedor: {
        nombre_empresa: portalData.nombre_empresa,
        logo_empresa: portalData.logo_empresa,
        banner_empresa: portalData.banner_empresa
      },
      config,
      productos
    });
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