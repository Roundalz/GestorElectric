import axios from 'axios';

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


export const getTemas = async (req, res) => {
  try {
    const response = await api.get('/api/temas');  // Cambia a endpoint del portal
    res.json(response.data);
  } catch (error) {
    console.error('Error en getTemas:', error);
    res.status(500).json({ error: 'Error al obtener temas' });
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