import axios from 'axios';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'gestor_nuevo',
  port: parseInt(process.env.DB_PORT) || 5432
});
// Configuración base de axios para manejar errores
const api = axios.create({
  baseURL: process.env.PORTAL_SERVICE_URL || 'http://portal:5100', // Usar nombre del servicio
  timeout: 5000
});
const temasApi = axios.create({
  baseURL: process.env.TEMAS_SERVICE_URL || 'http://temas:5200',
  timeout: 5000
});
export const getPortalView = async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.vendedorId);
    
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de vendedor inválido'
      });
    }

    // Asegúrate de establecer el Content-Type antes de enviar la respuesta
    res.set('Content-Type', 'application/json');
    
    // Simulación de datos - reemplaza con tu lógica real
    const mockData = {
      success: true,
      data: {
        config: {
          color_principal: '#4a6baf',
          color_secundario: '#f8a51b',
          // ... otros campos de configuración
        },
        productos: [
          // ... array de productos
        ]
      }
    };

    res.status(200).json(mockData);
    
  } catch (error) {
    console.error('Error en getPortalView:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener vista del portal'
    });
  }
};
// Para el plan del vendedor
export const getVendedorPlan = async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.id);
    
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de vendedor inválido' 
      });
    }

    const query = `
      SELECT p.codigo_plan, p.nombre_plan, p.descripcion, p.max_productos 
      FROM planes_pago p
      JOIN vendedor v ON p.codigo_plan = v.planes_pago_codigo_plan
      WHERE v.codigo_vendedore = $1`;
    
    const result = await pool.query(query, [vendedorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'No se encontró plan para este vendedor' 
      });
    }

    // Asegúrate de incluir el campo success: true
    res.status(200).json({
      success: true,
      codigo_plan: result.rows[0].codigo_plan,
      nombre_plan: result.rows[0].nombre_plan,
      descripcion: result.rows[0].descripcion,
      max_productos: result.rows[0].max_productos
    });
  } catch (error) {
    console.error('Error en getVendedorPlan:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener plan del vendedor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getPortalConfig = async (req, res) => {
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
        ) VALUES ($1, ${Object.keys(defaultConfig).map((_, i) => `$${i+2}`).join(', ')})
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
    console.error('Error en getPortalConfig:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener configuración',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getTemas = async (req, res) => {
  try {
    const response = await api.get('/api/temas');  // Cambia a endpoint del portal
    res.json(response.data);
  } catch (error) {
    console.error('Error en getTemas:', error);
    res.status(500).json({ error: 'Error al obtener temas' });
  }
};


export const getProductosPortal = async (req, res) => {
  try {
    const response = await api.get(`/portales/${req.params.vendedorId}/productos`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error en getProductosPortal:', error);
    res.status(500).json({ error: 'Error al obtener productos del portal' });
  }
};

export const updatePortalConfig = async (req, res) => {
  try {
    const portalCodigo = req.params.portalCodigo;
    const nuevaConfig = req.body;
    
    if (!portalCodigo || !nuevaConfig) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos inválidos' 
      });
    }

    const fields = Object.keys(nuevaConfig).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = Object.values(nuevaConfig);
    
    const query = `
      UPDATE portal_configuracion 
      SET ${fields}, fecha_actualizacion = NOW()
      WHERE portal_codigo_portal = $${values.length + 1}
      RETURNING *`;
    
    const result = await pool.query(query, [...values, portalCodigo]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'No se encontró configuración para actualizar' 
      });
    }

    res.status(200).json({
      success: true,
      config: result.rows[0]
    });
  } catch (error) {
    console.error('Error en updatePortalConfig:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar configuración',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};