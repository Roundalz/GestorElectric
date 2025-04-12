const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener configuración del portal por ID de vendedor
router.get('/:vendedorId/config', async (req, res) => {
  try {
    const { vendedorId } = req.params;
    
    // Primero obtener el código del portal asociado al vendedor
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
    
    // Obtener la configuración del portal
    const configResult = await pool.query(
      'SELECT * FROM PORTAL_CONFIGURACION WHERE PORTAL_codigo_portal = $1',
      [portalCodigo]
    );
    
    if (configResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Configuración no encontrada para este portal' 
      });
    }
    
    res.json({
      success: true,
      codigo_portal: portalCodigo,
      config: configResult.rows[0]
    });
    
  } catch (err) {
    console.error('Error al obtener configuración del portal:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener configuración del portal' 
    });
  }
});

// Actualizar configuración del portal
router.put('/portal/config/:portalCodigo', async (req, res) => {
  try {
    const { portalCodigo } = req.params;
    const configData = req.body;
    
    // Verificar que el portal existe
    const portalExists = await pool.query(
      'SELECT 1 FROM PORTAL WHERE codigo_portal = $1',
      [portalCodigo]
    );
    
    if (portalExists.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Portal no encontrado' 
      });
    }
    
    // Actualizar configuración
    const updateQuery = `
      UPDATE PORTAL_CONFIGURACION 
      SET 
        estilo_titulo = $1,
        tema_seleccionado = $2,
        color_principal = $3,
        color_secundario = $4,
        color_fondo = $5,
        fuente_principal = $6,
        disposicion_productos = $7,
        productos_por_fila = $8,
        mostrar_precios = $9,
        mostrar_valoraciones = $10,
        estilo_header = $11,
        mostrar_busqueda = $12,
        mostrar_categorias = $13,
        estilos_productos = $14,
        mostrar_banner = $15,
        logo_personalizado = $16,
        banner_personalizado = $17,
        fecha_actualizacion = NOW()
      WHERE PORTAL_codigo_portal = $18
      RETURNING *
    `;
    
    const values = [
      configData.estilo_titulo,
      configData.tema_seleccionado,
      configData.color_principal,
      configData.color_secundario,
      configData.color_fondo,
      configData.fuente_principal,
      configData.disposicion_productos,
      configData.productos_por_fila,
      configData.mostrar_precios,
      configData.mostrar_valoraciones,
      configData.estilo_header,
      configData.mostrar_busqueda,
      configData.mostrar_categorias,
      configData.estilos_productos,
      configData.mostrar_banner,
      configData.logo_personalizado,
      configData.banner_personalizado,
      portalCodigo
    ];
    
    const result = await pool.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No se pudo actualizar la configuración' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Configuración actualizada correctamente',
      config: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error al actualizar configuración del portal:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error al actualizar configuración del portal' 
    });
  }
});

// Obtener temas disponibles para el portal
router.get('/temas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM TEMAS_PORTAL');
    res.json({
      success: true,
      temas: result.rows
    });
  } catch (err) {
    console.error('Error al obtener temas:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener temas' 
    });
  }
});

// Endpoint de prueba
router.get('/debug/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Conexión exitosa al servidor' 
  });
});

module.exports = router;