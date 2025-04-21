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
  
      // Elimina la duplicación de fecha_actualizacion
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
        `SELECT 
           codigo_producto,
           nombre_producto,
           tipo_producto AS descripcion,  
           precio_unidad_producto,
           cantidad_disponible_producto,
           estado_producto,
           tipo_producto,
           calificacion_producto,
           descuento_producto,
           imagen_referencia_producto
         FROM PRODUCTOS 
         WHERE vendedor_codigo_vendedore = $1 AND estado_producto = $2`,
        [vendedorId, 'activo']
      );
      console.log('Productos encontrados:', productos.rows); // Debug
    
    if(productos.rows.length === 0) {
      console.warn('No se encontraron productos para el vendedor:', vendedorId);
    }
  
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

  //////////////DASHBOARD//////////////
  export const getDashboardData = async (req, res) => {
    try {
      const vendedorId = parseInt(req.params.vendedorId);
      
      // Ejecutar todas las consultas en paralelo
      const [
        ingresosGastos,
        ventasMensuales,
        topProductos,
        productosValorados,
        clientesRecurrentes,
        conversiones,
        gastosCategoria,
        proximosCumpleanos
      ] = await Promise.all([
        // 1. Ingresos vs Gastos mensuales
        pool.query(`
          SELECT 
            DATE_TRUNC('month', t.fecha_transaccion) AS mes,
            SUM(CASE WHEN t.tipo_transaccion = 'Ingreso' THEN t.monto ELSE 0 END) AS ingresos,
            SUM(CASE WHEN t.tipo_transaccion = 'Gasto' THEN t.monto ELSE 0 END) AS gastos
          FROM TRANSACCION t
          WHERE t.VENDEDOR_codigo_vendedore = $1
          GROUP BY mes
          ORDER BY mes
          LIMIT 12
        `, [vendedorId]),
  
        // 2. Ventas mensuales y ticket promedio (corregido)
        pool.query(`
          SELECT 
            DATE_TRUNC('month', p.fecha_pedido) AS mes,
            COUNT(p.codigo_pedido) AS ventas,
            SUM(p.total_pedido) AS ingresos,
            AVG(p.total_pedido) AS ticket_promedio,
            SUM(CASE WHEN pr.descuento_producto > 0 THEN 1 ELSE 0 END) AS ventas_con_descuento,
            SUM(CASE WHEN pr.descuento_producto = 0 THEN 1 ELSE 0 END) AS ventas_sin_descuento
          FROM PEDIDO p
          JOIN DETALLE_PEDIDO dp ON p.codigo_pedido = dp.PEDIDO_codigo_pedido
          JOIN PRODUCTOS pr ON dp.PRODUCTOS_codigo_producto = pr.codigo_producto
          WHERE p.VENDEDORE_codigo_vendedore = $1
          GROUP BY mes
          ORDER BY mes
          LIMIT 12
        `, [vendedorId]),
  
        // 3. Productos más vendidos
        pool.query(`
          SELECT 
            pr.nombre_producto AS nombre,
            SUM(dp.cantidad_detalle_pedido) AS ventas,
            SUM(dp.subtotal_detalle_pedido) AS ingresos,
            COUNT(f.codigo_favorito) AS favoritos
          FROM PRODUCTOS pr
          JOIN DETALLE_PEDIDO dp ON pr.codigo_producto = dp.PRODUCTOS_codigo_producto
          LEFT JOIN FAVORITOS f ON pr.codigo_producto = f.PRODUCTOS_codigo_producto
          WHERE pr.VENDEDOR_codigo_vendedore = $1
          GROUP BY pr.nombre_producto
          ORDER BY ventas DESC
          LIMIT 10
        `, [vendedorId]),
  
        // 4. Productos mejor valorados
        pool.query(`
        SELECT 
          pr.nombre_producto AS nombre,
          COALESCE(AVG(dp.calificacion_pedido)::numeric, 0) AS calificacion,
          COUNT(dp.codigo_detalle_pedido) AS veces_calificado,
          COALESCE(SUM(dp.cantidad_detalle_pedido), 0) AS ventas
        FROM PRODUCTOS pr
        LEFT JOIN DETALLE_PEDIDO dp ON pr.codigo_producto = dp.PRODUCTOS_codigo_producto
        WHERE pr.VENDEDOR_codigo_vendedore = $1
        GROUP BY pr.nombre_producto
        HAVING COUNT(dp.codigo_detalle_pedido) > 0
        ORDER BY calificacion DESC
        LIMIT 10
      `, [vendedorId]),
  
        // 5. Clientes recurrentes
        pool.query(`
        SELECT 
            c.nombre_cliente AS nombre,
            COUNT(p.codigo_pedido) AS compras,
            COALESCE(SUM(p.total_pedido), 0) AS valor_total,
            MAX(p.fecha_pedido) AS ultima_compra
        FROM CLIENTE c
        JOIN PEDIDO p ON c.codigo_cliente = p.CLIENTE_codigo_cliente
        WHERE p.VENDEDORE_codigo_vendedore = $1
            AND p.total_pedido > 0  -- Filtra pedidos con valor
        GROUP BY c.nombre_cliente
        ORDER BY valor_total DESC, compras DESC
        LIMIT 10
        `, [vendedorId]),
  
        // 6. Conversiones (favoritos vs pedidos)
        pool.query(`
          SELECT 
            COUNT(DISTINCT f.codigo_favorito) AS total_favoritos,
            COUNT(DISTINCT p.codigo_pedido) AS total_pedidos,
            ROUND(COUNT(DISTINCT p.codigo_pedido) * 100.0 / 
                  NULLIF(COUNT(DISTINCT f.codigo_favorito), 0), 2) AS tasa_conversion
          FROM FAVORITOS f
          LEFT JOIN PEDIDO p ON f.CLIENTE_codigo_cliente = p.CLIENTE_codigo_cliente
          WHERE f.PORTAL_codigo_portal IN (
            SELECT codigo_portal FROM PORTAL WHERE VENDEDOR_codigo_vendedore = $1
          )
        `, [vendedorId]),
  
        // 7. Gastos por categoría
        pool.query(`
          SELECT 
            s.nombre_servicio AS categoria,
            SUM(t.monto) AS valor
          FROM TRANSACCION t
          JOIN SERVICIO s ON t.SERVICIO_codigo_servicio = s.codigo_servicio
          WHERE t.VENDEDOR_codigo_vendedore = $1 AND t.tipo_transaccion = 'Gasto'
          GROUP BY s.nombre_servicio
          ORDER BY valor DESC
        `, [vendedorId]),
  
        // 8. Próximos cumpleaños
        pool.query(`
          SELECT 
            nombre_cliente AS nombre,
            correo_cliente AS correo,
            cumpleanos_cliente AS cumpleanos
          FROM CLIENTE
          WHERE codigo_cliente IN (
            SELECT DISTINCT CLIENTE_codigo_cliente 
            FROM PEDIDO 
            WHERE VENDEDORE_codigo_vendedore = $1
          )
          AND EXTRACT(MONTH FROM cumpleanos_cliente) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')
          ORDER BY EXTRACT(DAY FROM cumpleanos_cliente)
          LIMIT 10
        `, [vendedorId])
      ]);
  
      res.json({
        success: true,
        ingresosGastos: ingresosGastos.rows,
        ventasMensuales: ventasMensuales.rows,
        topProductos: topProductos.rows,
        productosValorados: productosValorados.rows,
        clientesRecurrentes: clientesRecurrentes.rows,
        conversiones: conversiones.rows[0],
        gastosCategoria: gastosCategoria.rows,
        proximosCumpleanos: proximosCumpleanos.rows
      });
  
    } catch (error) {
      console.error('Error en getDashboardData:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos del dashboard'
      });
    }
  };
  