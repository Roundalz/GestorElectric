import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'gestor_nuevo',
  port: parseInt(process.env.DB_PORT) || 5432
});

export const getPortalConfig = async (req, res) => {
    try {
      const vendedorId = parseInt(req.params.vendedorId);
      
      // 1. Obtener código del portal
      const portalQuery = await pool.query(
        `SELECT p.codigo_portal, pc.* 
         FROM portal p
         LEFT JOIN portal_configuracion pc ON p.codigo_portal = pc.portal_codigo_portal
         WHERE p.vendedor_codigo_vendedore = $1`,
        [vendedorId]
      );
  
      if (portalQuery.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Portal no encontrado para este vendedor'
        });
      }
  
      const config = portalQuery.rows[0] || {};
      delete config.codigo_portal; // Eliminamos el campo duplicado
  
      res.json({
        success: true,
        codigo_portal: portalQuery.rows[0].codigo_portal,
        config
      });
  
    } catch (error) {
      console.error('Error en getPortalConfig:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
  
  export const getTemas = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM temas_portal');
      res.json(result.rows);
    } catch (error) {
      console.error('Error en getTemas:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener temas'
      });
    }
  };
  export const updateProducto = async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const updatedData = req.body;
  
      const fields = Object.keys(updatedData)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
  
      const values = Object.values(updatedData);
      values.push(productId);
  
      const query = `
        UPDATE PRODUCTOS
        SET ${fields}, fecha_actualizacion = NOW()
        WHERE codigo_producto = $${values.length}
        RETURNING *`;
  
      const result = await pool.query(query, values);
  
      res.json({
        success: true,
        producto: result.rows[0]
      });
    } catch (error) {
      console.error('Error en updateProducto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar producto'
      });
    }
  };
  export const deleteProducto = async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
  
      const result = await pool.query(
        `DELETE FROM PRODUCTOS 
         WHERE codigo_producto = $1
         RETURNING *`,
        [productId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }
  
      res.json({
        success: true,
        message: 'Producto eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en deleteProducto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar producto'
      });
    }
  };
  export const updatePortalConfig = async (req, res) => {
    try {
      const { portal_codigo_portal, ...newConfig } = req.body;
      
      if (!portal_codigo_portal) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere el código del portal'
        });
      }
  
      const fields = Object.keys(newConfig)
        .filter(key => newConfig[key] !== undefined)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
  
      const values = Object.values(newConfig)
        .filter(val => val !== undefined);
  
      const query = `
        UPDATE portal_configuracion
        SET ${fields}, fecha_actualizacion = NOW()
        WHERE portal_codigo_portal = $${values.length + 1}
        RETURNING *`;
  
      const result = await pool.query(query, [...values, portal_codigo_portal]);
  
      res.json({
        success: true,
        config: result.rows[0]
      });
  
    } catch (error) {
      console.error('Error en updatePortalConfig:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuración'
      });
    }
  };
  export const getVendedorPlan = async (req, res) => {
    try {
      const vendedorId = parseInt(req.params.id);
      
      const result = await pool.query(
        `SELECT p.* FROM planes_pago p
         JOIN vendedor v ON p.codigo_plan = v.planes_pago_codigo_plan
         WHERE v.codigo_vendedore = $1`,
        [vendedorId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Plan no encontrado para este vendedor'
        });
      }
  
      res.json({
        success: true,
        ...result.rows[0]
      });
    } catch (error) {
      console.error('Error en getVendedorPlan:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener plan del vendedor'
      });
    }
  };
  
  export const getProductosPortal = async (req, res) => {
    try {
      const vendedorId = parseInt(req.params.vendedorId);
      
      const result = await pool.query(
        `SELECT * FROM PRODUCTOS 
         WHERE vendedor_codigo_vendedore = $1`,
        [vendedorId]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error en getProductosPortal:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener productos'
      });
    }
  };
  
  export const getPortalView = async (req, res) => {
    try {
      const vendedorId = parseInt(req.params.vendedorId);
      
      if (isNaN(vendedorId)) {
        return res.status(400).json({ 
          success: false,
          error: 'ID de vendedor no válido' 
        });
      }
  
      // 1. Obtener datos del vendedor
      const vendedor = await pool.query(
        'SELECT * FROM vendedor WHERE codigo_vendedore = $1', 
        [vendedorId]
      );
      
      if (vendedor.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Vendedor no encontrado' 
        });
      }
      
      // 2. Obtener configuración del portal
      const portal = await pool.query(
        `SELECT p.codigo_portal, pc.* 
         FROM portal p
         LEFT JOIN portal_configuracion pc ON p.codigo_portal = pc.portal_codigo_portal
         WHERE p.vendedor_codigo_vendedore = $1`,
        [vendedorId]
      );
      
      // 3. Obtener productos
      const productos = await pool.query(
        'SELECT * FROM PRODUCTOS WHERE vendedor_codigo_vendedore = $1 AND estado_producto = $2',
        [vendedorId, 'activo']
      );
  
      res.json({
        success: true,
        data: {
          vendedor: vendedor.rows[0],
          config: portal.rows[0] || {},
          productos: productos.rows
        }
      });
  
    } catch (error) {
      console.error('Error en getPortalView:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
  export const uploadFile = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No se subió ningún archivo'
        });
      }
  
      const { vendedorId, type } = req.body;
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${type}_${vendedorId}_${Date.now()}.${fileExtension}`;
      const filePath = `portales/${fileName}`;
  
      // Aquí deberías implementar la lógica para guardar el archivo
      // Por ejemplo, usando fs para guardar localmente o un cliente S3 para AWS
      // Este es un ejemplo básico para guardar localmente:
      const fs = require('fs');
      const path = require('path');
      
      const uploadDir = path.join(__dirname, '../../uploads/portales');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, fileName), req.file.buffer);
  
      res.json({
        success: true,
        filePath: `portales/${fileName}`
      });
    } catch (error) {
      console.error('Error en uploadFile:', error);
      res.status(500).json({
        success: false,
        error: 'Error al subir el archivo'
      });
    }
  };
  
