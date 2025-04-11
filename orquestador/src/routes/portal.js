import express from 'express';
import { 
  getPortalView, 
  getTemas,
  getPortalConfig,
  getProductosPortal,
  getVendedorPlan,
  updatePortalConfig  
} from '../controllers/portalController.js';

const router = express.Router();

router.get('/:vendedorId/view', getPortalView);
router.get('/temas', getTemas);
router.get('/:vendedorId/config', getPortalConfig);
router.get('/vendedor/:id/plan', getVendedorPlan);
router.get('/:vendedorId/productos', getProductosPortal);
router.put('/portal/config/:portalCodigo', updatePortalConfig);
router.put('/portal/config/:portalCodigo', updatePortalConfig);
// Debug endpoint
// Cambia el endpoint debug
router.get('/debug/test', async (req, res) => {
  try {
    // Verifica conexión con el servicio portal
    const portalResponse = await axios.get('http://portal:5100/health');
    
    // Verifica conexión con la base de datos
    const dbResponse = await pool.query('SELECT NOW()');
    
    res.json({
      status: 'OK',
      portal: portalResponse.data,
      db: {
        connected: true,
        time: dbResponse.rows[0].now
      },
      endpoints: {
        plan: '/api/portales/vendedor/:id/plan',
        config: '/api/portales/:vendedorId/config'
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      details: {
        portal: process.env.PORTAL_SERVICE_URL,
        db: {
          host: process.env.DB_HOST,
          database: process.env.DB_NAME
        }
      }
    });
  }
});

export default router;