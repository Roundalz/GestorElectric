import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'gestor_nuevo',
  port: parseInt(process.env.DB_PORT) || 5432
});

// Definición de características permitidas por plan
const plan1Features = [
  'color_principal', 'color_secundario', 'color_fondo', 
  'fuente_principal', 'disposicion_productos', 'productos_por_fila',
  'estilo_titulo', 'mostrar_banner', 'logo_personalizado', 'banner_personalizado'
];

const plan2Features = [
  ...plan1Features,
  'mostrar_precios', 'mostrar_valoraciones', 'estilo_header',
  'mostrar_busqueda', 'mostrar_categorias', 'estilos_productos',
  'estilos_botones', 'efecto_hover_productos', 'opciones_filtrados',
  'mostrar_boton_whatsapp', 'whatsapp_numero'
];

const plan3Features = [
  ...plan2Features,
  'mostrar_ofertas', 'mostrar_instragram_feed', 'instagram_link',
  'opciones_avanzadas'
];

const plan4Features = [
  ...plan3Features,
  'scripts_personalizados'
];
// Definición de características permitidas por plan
const PLAN_FEATURES = {
  1: { allowed: plan1Features },
  2: { allowed: plan2Features },
  3: { allowed: plan3Features },
  4: { allowed: plan4Features },
  5: { allowed: 'all' } // Plan Premium - todas las características
};


export const getPortalConfig = async (req, res) => {
  try {
    const vendedorId = parseInt(req.params.vendedorId);
    
    // Obtener configuración y plan del vendedor
    const [configResult, planResult] = await Promise.all([
      pool.query(
        `SELECT p.codigo_portal, pc.* 
         FROM portal p
         LEFT JOIN portal_configuracion pc ON p.codigo_portal = pc.portal_codigo_portal
         WHERE p.vendedor_codigo_vendedore = $1`,
        [vendedorId]
      ),
      pool.query(
        `SELECT p.* FROM planes_pago p
         JOIN vendedor v ON p.codigo_plan = v.planes_pago_codigo_plan
         WHERE v.codigo_vendedore = $1`,
        [vendedorId]
      )
    ]);

    // Configuración por defecto extendida
    const defaultConfig = {
      tema_seleccionado: 'default',
      color_principal: '#4F46E5',
      color_secundario: '#7C3AED',
      color_fondo: '#FFFFFF',
      fuente_principal: 'Arial',
      disposicion_productos: 'grid',
      productos_por_fila: 3,
      mostrar_precios: true,
      mostrar_valoraciones: true,
      estilo_header: 'normal',
      mostrar_busqueda: true,
      mostrar_categorias: true,
      mostrar_banner: true,
      logo_personalizado: '',
      banner_personalizado: '',
      estilos_botones: 'redondeado',
      efecto_hover_productos: 'sombra',
      opciones_filtrados: { precio: true, categorias: true },
      mostrar_ofertas: false,
      mostrar_boton_whatsapp: false,
      whatsapp_numero: 0,
      mostrar_instragram_feed: false,
      instagram_link: '',
      scripts_personalizados: ''
    };

    if (configResult.rows.length === 0) {
      return res.json({
        success: true,
        codigo_portal: 'DEFAULT-001',
        config: defaultConfig,
        plan: planResult.rows[0] || null
      });
    }

    const config = configResult.rows[0] || {};
    delete config.codigo_portal;

    res.json({
      success: true,
      codigo_portal: configResult.rows[0].codigo_portal,
      config,
      plan: planResult.rows[0] || null
    });

  } catch (error) {
    console.error('Error en getPortalConfig:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor'
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
    const client = await pool.connect();
      
    try {
      await client.query('BEGIN');
  
      const { portal_codigo_portal, ...newConfig } = req.body;
      
      if (!portal_codigo_portal) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: 'Se requiere el código del portal'
        });
      }
  
      // 1. Obtener plan del vendedor
      const planQuery = await client.query(
        `SELECT v.planes_pago_codigo_plan 
         FROM portal p
         JOIN vendedor v ON p.vendedor_codigo_vendedore = v.codigo_vendedore
         WHERE p.codigo_portal = $1`,
        [portal_codigo_portal]
      );
  
      if (planQuery.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'No se pudo determinar el plan del vendedor'
        });
      }
  
      const planId = planQuery.rows[0].planes_pago_codigo_plan;
  
      // 2. Validar que las características a actualizar estén permitidas en el plan
      const featuresToUpdate = Object.keys(newConfig);
      const unauthorizedFeatures = [];
  
      for (const feature of featuresToUpdate) {
        if (!isFeatureAllowed(planId, feature)) {
          unauthorizedFeatures.push(feature);
        }
      }
  
      if (unauthorizedFeatures.length > 0) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          error: 'Características no permitidas en el plan actual',
          unauthorizedFeatures,
          planId
        });
      }
  
      // 3. Obtener configuración actual para el histórico
      const currentConfigQuery = await client.query(
        'SELECT * FROM portal_configuracion WHERE portal_codigo_portal = $1',
        [portal_codigo_portal]
      );
  
      if (currentConfigQuery.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Configuración no encontrada para este portal'
        });
      }
  
      const currentConfig = currentConfigQuery.rows[0];
      
      // 4. Preparar y ejecutar la actualización
      const fieldsToUpdate = Object.keys(newConfig)
        .filter(key => newConfig[key] !== undefined && key !== 'codigo_portal_configuracion')
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
  
      const valuesToUpdate = Object.values(newConfig)
        .filter(val => val !== undefined);
  
      const updateQuery = `
        UPDATE portal_configuracion
        SET ${fieldsToUpdate}, fecha_actualizacion = NOW()
        WHERE portal_codigo_portal = $${valuesToUpdate.length + 1}
        RETURNING *`;
  
      const updateResult = await client.query(
        updateQuery, 
        [...valuesToUpdate, portal_codigo_portal]
      );
  
      const updatedConfig = updateResult.rows[0];
  
      // 5. Registrar en histórico_configuracion
      const historicoQuery = `
        INSERT INTO historico_configuracion (
          configuracion_anterior,
          configuracion_nueva,
          fecha_cambio,
          cambiado_por,
          motivo_cambio,
          portal_codigo_portal
        ) VALUES ($1, $2, NOW(), $3, $4, $5)
        RETURNING codigo_historial`;
  
      const vendedorId = req.user?.codigo_vendedore || req.vendedorId || 1;
      
      const historicoResult = await client.query(
        historicoQuery,
        [
          JSON.stringify(currentConfig),
          JSON.stringify(updatedConfig),
          vendedorId,
          1, // Motivo 1 = actualización manual
          portal_codigo_portal
        ]
      );
  
      await client.query('COMMIT');
  
      res.json({
        success: true,
        config: updatedConfig,
        historicoId: historicoResult.rows[0].codigo_historial,
        planId
      });
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en updatePortalConfig:', error);
      
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuración',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    } finally {
      client.release();
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
           WHERE vendedor_codigo_vendedore = $1 
           AND estado_producto IN ('Disponible', 'Agotado')`,
          [vendedorId]
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
      
      // Validar que el tipo de archivo está permitido para el plan del vendedor
      const planQuery = await pool.query(
        `SELECT v.planes_pago_codigo_plan 
         FROM vendedor v 
         WHERE v.codigo_vendedore = $1`,
        [vendedorId]
      );
  
      if (planQuery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Vendedor no encontrado'
        });
      }
  
      const planId = planQuery.rows[0].planes_pago_codigo_plan;
      const allowedTypes = ['logo', 'banner']; // Tipos permitidos para todos los planes
      
      if (!allowedTypes.includes(type)) {
        return res.status(403).json({
          success: false,
          error: 'Tipo de archivo no permitido'
        });
      }
  
      // Continuar con la subida del archivo
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
        filePath: `portales/${fileName}`,
        planId
      });
    } catch (error) {
      console.error('Error en uploadFile:', error);
      res.status(500).json({
        success: false,
        error: 'Error al subir el archivo'
      });
    }
  };
/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

  /*__________________________DASHBOARD___________________________*/
  
/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/
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
  