import axios from 'axios';

// Configuración base de axios para manejar errores
const api = axios.create({
  baseURL: process.env.PORTAL_SERVICE_URL || 'http://portal:5100', // Usar nombre del servicio
  timeout: 5000
});
// En orquestador/src/controllers/portalController.js
export const getPortalView = async (req, res) => {
  try {
    const response = await api.get(`/portales/${req.params.vendedorId}/view`);
    
    // Asegurar que la respuesta sea JSON
    if (response.headers['content-type']?.includes('text/html')) {
      throw new Error('El servicio portal devolvió HTML en lugar de JSON');
    }
    
    res.set('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error en getPortalView:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener vista del portal',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getTemas = async (req, res) => {
  try {
    const response = await api.get('/temas');
    res.set('Content-Type', 'application/json');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error en getTemas:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener temas',
      details: error.response?.data || error.message 
    });
  }
};
export const getPortalConfig = async (req, res) => {
  try {
    const response = await api.get(`/portales/${req.params.vendedorId}/config`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error en getPortalConfig:', error);
    res.status(500).json({ error: 'Error al obtener configuración del portal' });
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