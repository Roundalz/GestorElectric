const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener información del plan de un vendedor
router.get('/vendedor/:vendedorId/plan', async (req, res) => {
  try {
    const { vendedorId } = req.params;
    
    const result = await pool.query(`
      SELECT p.* 
      FROM VENDEDOR v
      JOIN PLANES_PAGO p ON v.PLANES_PAGO_codigo_plan = p.codigo_plan
      WHERE v.codigo_vendedore = $1
    `, [vendedorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendedor o plan no encontrado' 
      });
    }
    
    res.json({
      success: true,
      ...result.rows[0]
    });
    
  } catch (err) {
    console.error('Error al obtener plan del vendedor:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener plan del vendedor' 
    });
  }
});

// Vista del portal para clientes
router.get('/:vendedorId/view', async (req, res) => {
  try {
    const { vendedorId } = req.params;
    
    // 1. Obtener información del vendedor y su portal
    const vendedorResult = await pool.query(`
      SELECT 
        v.*,
        p.codigo_portal,
        pc.*
      FROM VENDEDOR v
      LEFT JOIN PORTAL p ON v.codigo_vendedore = p.VENDEDOR_codigo_vendedore
      LEFT JOIN PORTAL_CONFIGURACION pc ON p.codigo_portal = pc.PORTAL_codigo_portal
      WHERE v.codigo_vendedore = $1
    `, [vendedorId]);
    
    if (vendedorResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendedor no encontrado' 
      });
    }
    
    const vendedorData = vendedorResult.rows[0];
    
    // 2. Obtener productos del portal
    const productosResult = await pool.query(`
      SELECT * FROM PRODUCTOS 
      WHERE PORTAL_codigo_portal = $1 AND estado_producto = 'activo'
    `, [vendedorData.codigo_portal]);
    
    res.json({
      success: true,
      data: {
        vendedor: {
          nombre_empresa: vendedorData.nombre_empresa,
          descripcion_empresa: vendedorData.descripcion_empresa,
          logo_empresa: vendedorData.logo_empresa
        },
        config: {
          tema_seleccionado: vendedorData.tema_seleccionado,
          color_principal: vendedorData.color_principal,
          color_secundario: vendedorData.color_secundario,
          color_fondo: vendedorData.color_fondo,
          fuente_principal: vendedorData.fuente_principal,
          disposicion_productos: vendedorData.disposicion_productos,
          mostrar_precios: vendedorData.mostrar_precios,
          mostrar_valoraciones: vendedorData.mostrar_valoraciones,
          estilo_header: vendedorData.estilo_header,
          mostrar_banner: vendedorData.mostrar_banner,
          banner_personalizado: vendedorData.banner_personalizado,
          logo_personalizado: vendedorData.logo_personalizado
        },
        productos: productosResult.rows
      }
    });
    
  } catch (err) {
    console.error('Error al obtener vista del portal:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener vista del portal' 
    });
  }
});

// Obtener productos del portal
router.get('/:vendedorId/productos', async (req, res) => {
  try {
    const { vendedorId } = req.params;
    
    // Primero obtener el código del portal
    const portalResult = await pool.query(
      'SELECT codigo_portal FROM PORTAL WHERE VENDEDOR_codigo_vendedore = $1',
      [vendedorId]
    );
    
    if (portalResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No se encontró portal para este vendedor' 
      });
    }
    
    const portalCodigo = portalResult.rows[0].codigo_portal;
    
    // Obtener productos
    const result = await pool.query(
      'SELECT * FROM PRODUCTOS WHERE PORTAL_codigo_portal = $1',
      [portalCodigo]
    );
    
    res.json({
      success: true,
      productos: result.rows
    });
    
  } catch (err) {
    console.error('Error al obtener productos del portal:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener productos del portal' 
    });
  }
});

module.exports = router;