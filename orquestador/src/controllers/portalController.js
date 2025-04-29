import pool from '../database.js';

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

// Función para verificar si una característica está permitida en el plan
function isFeatureAllowed(planId, featureName) {
  if (!planId || !PLAN_FEATURES[planId]) return false;
  
  // Plan premium tiene acceso a todo
  if (planId === 5) return true;
  
  return PLAN_FEATURES[planId].allowed.includes(featureName);
}

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
      opciones_avanzadas: {
        checkout: {
          metodos_pago: ['tarjeta', 'transferencia'],
          politica_devoluciones: ''
        }
      },
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

    const row = configResult.rows[0];
    const codigo_portal = row.codigo_portal;
    const config = { ...row };
    delete config.codigo_portal; // Eliminamos el código del portal del objeto de configuración

    res.json({
      success: true,
      codigo_portal,
      config: {
        ...defaultConfig,
        ...config
      },
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
  /*________________IMAGENS IMG_PRODUCTO_PORTALVIEW_______ */
  export const getProductImages = async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      
      const result = await pool.query(
        `SELECT primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo 
         FROM IMG_PRODUCTO 
         WHERE PRODUCTOS_codigo_producto = $1`,
        [productId]
      );
  
      if (result.rows.length === 0) {
        return res.json({
          success: true,
          imagenes: {}
        });
      }
  
      res.json({
        success: true,
        imagenes: result.rows[0]
      });
    } catch (error) {
      console.error('Error en getProductImages:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener imágenes del producto'
      });
    }
  };
  /*_______________________________________________________ */
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
    console.log('Solicitud recibida en updatePortalConfig:', {
      body: req.body,
      params: req.params
    });
    const client = await pool.connect();
    const { portal_codigo_portal, changes, vendedorId } = req.body;
  
    // Validaciones de URL al inicio
    if (changes.logo_personalizado && !isValidUrl(changes.logo_personalizado)) {
      return res.status(400).json({
        success: false,
        error: 'URL de logo no válida'
      });
    }
    
    if (changes.banner_personalizado && !isValidUrl(changes.banner_personalizado)) {
      return res.status(400).json({
        success: false,
        error: 'URL de banner no válida'
      });
    } 
    try {
      const { portal_codigo_portal, changes, vendedorId } = req.body;
      
      // Validaciones de URL
      if (changes.logo_personalizado && !isValidUrl(changes.logo_personalizado)) {
        return res.status(400).json({
          success: false,
          error: 'URL de logo no válida'
        });
      }
      
      if (changes.banner_personalizado && !isValidUrl(changes.banner_personalizado)) {
        return res.status(400).json({
          success: false,
          error: 'URL de banner no válida'
        });
      }
  
      console.log('Datos recibidos:', { portal_codigo_portal, changes, vendedorId });
      // Validaciones básicas
      if (!portal_codigo_portal || !changes || !vendedorId) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: 'Datos incompletos para la actualización'
        });
      }
  
      // 1. Obtener configuración actual
      const currentConfigResult = await client.query(
        'SELECT * FROM portal_configuracion WHERE portal_codigo_portal = $1',
        [portal_codigo_portal]
      );
  
      if (currentConfigResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: 'Configuración no encontrada para este portal'
        });
      }
  
      const currentConfig = currentConfigResult.rows[0];
  
      // 2. Preparar cambios para el histórico
      const changedFields = {};
      Object.keys(changes).forEach(key => {
        if (JSON.stringify(currentConfig[key]) !== JSON.stringify(changes[key])) {
          changedFields[key] = {
            old: currentConfig[key],
            new: changes[key]
          };
        }
      });
  
      // 3. Validar que hay cambios reales
      if (Object.keys(changedFields).length === 0) {
        await client.query('ROLLBACK');
        return res.json({
          success: true,
          message: 'No hay cambios para actualizar'
        });
      }
  
      // 4. Construir la consulta de actualización
      const updateFields = Object.keys(changes)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
  
      const updateValues = Object.values(changes);
      updateValues.push(portal_codigo_portal);
  
      const updateQuery = `
        UPDATE portal_configuracion
        SET ${updateFields}, fecha_actualizacion = NOW()
        WHERE portal_codigo_portal = $${updateValues.length}
        RETURNING *`;
  
      // 5. Ejecutar actualización
      const updateResult = await client.query(updateQuery, updateValues);
      const updatedConfig = updateResult.rows[0];
  
      // 6. Registrar en el histórico
      const historicoQuery = `
        INSERT INTO historico_configuracion (
          configuracion_anterior,
          configuracion_nueva,
          fecha_cambio,
          cambiado_por,
          motivo_cambio,
          portal_codigo_portal,
          campos_cambiados
        ) VALUES ($1, $2, NOW(), $3, $4, $5, $6)
        RETURNING codigo_historial`;
      
      const historicoResult = await client.query(
        historicoQuery,
        [
          JSON.stringify(currentConfig),
          JSON.stringify(updatedConfig),
          vendedorId,
          1, // 1 = Actualización manual desde la interfaz
          portal_codigo_portal,
          JSON.stringify(changedFields)
        ]
      );
  
      await client.query('COMMIT');
  
      res.json({
        success: true,
        config: updatedConfig,
        historicoId: historicoResult.rows[0].codigo_historial,
        changedFields: Object.keys(changedFields),
        message: 'Configuración actualizada correctamente'
      });
  
      console.log('Valores recibidos para actualizar:', updateValues);
      console.log('Query a ejecutar:', updateQuery);
  
    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuración',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      client.release();
    }
    
  };
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
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

  
  export const portalActivo = async (req, res) => {
    try {
      const portales = await pool.query(
        "SELECT * FROM portal WHERE estado_portal = 'Activo'"
      );
      res.json(portales);
    } catch (error) {
      console.error('Error en portalActivo:', error.message);
      res.status(500).send('Error al obtener portales');
    }
  };
  
  export const visita = async (req, res) => {
    const { codigoPortal } = req.params;
    try {
      await pool.query(
        `UPDATE portal SET contador_visitas = contador_visitas + 1 WHERE codigo_portal = $1 RETURNING *`,
        [codigoPortal]
      );
      res.send('Visita registrada');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al registrar visita');
    }
  };
/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

  /*___________________HISTORICO CONFIGURACION____________________*/
  
/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

/*________________________________________________________________*/

export const getHistoricoConfiguracion = async (req, res) => {
  try {
    const { portalCodigo } = req.params;
    const { vendedorId } = req.query;

    console.log(`Fetching history for portal: ${portalCodigo}`);

    const result = await pool.query(`
      SELECT 
        h.codigo_historial,
        h.configuracion_anterior,
        h.configuracion_nueva,
        h.fecha_cambio,
        h.cambiado_por,
        h.motivo_cambio,
        h.portal_codigo_portal,
        h.campos_cambiados,
        v.nombre_vendedor as vendedor_nombre
      FROM historico_configuracion h
      LEFT JOIN vendedor v ON h.cambiado_por = v.codigo_vendedore
      WHERE h.portal_codigo_portal = $1
      ORDER BY h.fecha_cambio DESC
    `, [portalCodigo]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron registros históricos para este portal'
      });
    }

    // Función mejorada para parsear JSON
    const safeParse = (data) => {
      if (typeof data === 'object') return data;
      try {
        return data ? JSON.parse(data) : {};
      } catch (e) {
        console.error('Error parsing JSON:', { data, error: e.message });
        return {};
      }
    };

    const historico = result.rows.map(row => ({
      ...row,
      configuracion_anterior: safeParse(row.configuracion_anterior),
      configuracion_nueva: safeParse(row.configuracion_nueva),
      campos_cambiados: safeParse(row.campos_cambiados)
    }));

    console.log('Histórico preparado:', historico);
    res.json(historico);
  } catch (error) {
    console.error('Error en getHistoricoConfiguracion:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el historial de configuración',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Función helper para parsear JSON seguro
function tryParseJSON(jsonString) {
  try {
    return jsonString ? JSON.parse(jsonString) : {};
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return {};
  }
}
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
        proximosCumpleanos,
        rendimientoPortales
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
        `, [vendedorId]),

        // 9. Rendimiento de portales por visitas
        pool.query(`
        SELECT 
          p.codigo_portal AS nombre,
          p.contador_visitas AS visitas,
          p.estado_portal AS estado,
          COUNT(DISTINCT ped.codigo_pedido) AS pedidos,
          ROUND(COUNT(DISTINCT ped.codigo_pedido) * 100.0 / 
            NULLIF(p.contador_visitas, 0), 2) AS tasaConversion
        FROM PORTAL p
        LEFT JOIN PRODUCTOS pr ON p.codigo_portal = pr.PORTAL_codigo_portal
        LEFT JOIN DETALLE_PEDIDO dp ON pr.codigo_producto = dp.PRODUCTOS_codigo_producto
        LEFT JOIN PEDIDO ped ON dp.PEDIDO_codigo_pedido = ped.codigo_pedido
        WHERE p.VENDEDOR_codigo_vendedore = $1
        GROUP BY p.codigo_portal, p.contador_visitas, p.estado_portal
        ORDER BY visitas DESC
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
        proximosCumpleanos: proximosCumpleanos.rows,
        rendimientoPortales: rendimientoPortales.rows
      });
  
    } catch (error) {
      console.error('Error en getDashboardData:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos del dashboard'
      });
    }
  };