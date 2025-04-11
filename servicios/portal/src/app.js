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
  host: process.env.DB_HOST || 'postgres_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'gestor_nuevo',
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
      FROM portal p
      JOIN vendedor v ON p.vendedor_codigo_vendedore = v.codigo_vendedore
      WHERE p.vendedor_codigo_vendedore = $1`;
    const result = await pool.query(query, [vendedorId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error en obtenerDatosPortal:', error);
    throw error;
  }
};

const obtenerConfigPortal = async (vendedorId) => {
  try {
    // Consulta corregida - usa comillas dobles para nombres con mayúsculas
    const query = `
      SELECT * FROM portal_configuracion 
      WHERE "portal_codigo_portal" = (
        SELECT "codigo_portal" FROM "portal" 
        WHERE "vendedor_codigo_vendedore" = $1
      )`;
    
    const result = await pool.query(query, [vendedorId]);
    
    if (result.rows.length === 0) {
      // Crear configuración por defecto si no existe
      const portalRes = await pool.query(
        `SELECT "codigo_portal" FROM "portal" WHERE "vendedor_codigo_vendedore" = $1`, 
        [vendedorId]
      );
      
      if (portalRes.rows.length === 0) {
        throw new Error('No existe portal para este vendedor');
      }
      
      const codigo_portal = portalRes.rows[0].codigo_portal;
      const defaultConfig = {
        // ... (mantén tu configuración por defecto)
      };
      
      const insertQuery = `
        INSERT INTO portal_configuracion (
          "portal_codigo_portal", ${Object.keys(defaultConfig).map(col => `"${col}"`).join(', ')}
        ) VALUES ($1, ${Object.keys(defaultConfig).map((_, i) => `$${i+2}`).join(', ')})
        RETURNING *`;
      
      const insertRes = await pool.query(
        insertQuery,
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
      SELECT * FROM productos 
      WHERE vendedor_codigo_vendedore = $1
      AND estado_producto = 'activo'`;
    const result = await pool.query(query, [vendedorId]);
    return result.rows;
  } catch (error) {
    console.error('Error en obtenerProductosPortal:', error);
    throw error;
  }
};
// Agrega esto temporalmente en tu servicio (app.js) antes de los endpoints
app.get('/debug', async (req, res) => {
  try {
    const vendedorId = 2; // ID hardcodeado para pruebas
    
    const portalData = await pool.query(
      'SELECT * FROM portal WHERE vendedor_codigo_vendedore = $1', 
      [vendedorId]
    );
    
    const configData = await pool.query(
      'SELECT * FROM portal_configuracion WHERE portal_codigo_portal = $1',
      [portalData.rows[0]?.codigo_portal]
    );
    
    res.json({
      portal: portalData.rows[0] || 'No existe portal',
      config: configData.rows[0] || 'No existe configuración'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
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

app.get('/api/portales/:vendedorId/config', async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.vendedorId);
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de vendedor inválido' 
      });
    }

    // 1. Obtener código del portal
    const portalRes = await pool.query(
      'SELECT codigo_portal FROM portal WHERE vendedor_codigo_vendedore = $1', 
      [vendedorId]
    );
    
    if (portalRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró portal para este vendedor'
      });
    }

    const codigo_portal = portalRes.rows[0].codigo_portal;

    // 2. Obtener configuración
    const configRes = await pool.query(
      'SELECT * FROM portal_configuracion WHERE portal_codigo_portal = $1',
      [codigo_portal]
    );

    // 3. Si no existe configuración, crear una por defecto
    if (configRes.rows.length === 0) {
      const defaultConfig = {
        tema_seleccionado: 'default',
        color_principal: '#4F46E5',
        color_secundario: '#10B981',
        color_fondo: '#FFFFFF',
        mostrar_precios: true,
        mostrar_valoraciones: false,
        disposicion_productos: 'grid',
        productos_por_fila: 3
      };

      const insertRes = await pool.query(
        `INSERT INTO portal_configuracion (
          portal_codigo_portal, ${Object.keys(defaultConfig).join(', ')}
         VALUES ($1, ${Object.keys(defaultConfig).map((_, i) => `$${i+2}`).join(', ')})
         RETURNING *`,
        [codigo_portal, ...Object.values(defaultConfig)]
      );

      return res.status(200).json({
        success: true,
        codigo_portal,
        config: insertRes.rows[0]
      });
    }

    res.status(200).json({
      success: true,
      codigo_portal,
      config: configRes.rows[0]
    });
  } catch (error) {
    console.error('Error en /api/portales/:vendedorId/config:', error);
    res.status(500).json({ 
      success: false,
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
// Añadir endpoint para temas
app.get('/api/temas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM temas_portal');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener temas:', error);
    res.status(500).json({ error: 'Error al obtener temas' });
  }
});
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`✅ Servicio Portal corriendo en http://localhost:${PORT}`);
  console.log(`📊 Estado DB: ${pool.totalCount > 0 ? 'Conectado' : 'Desconectado'}`);
});