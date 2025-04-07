import axios from 'axios';

// Configuración base de axios para manejar errores
const api = axios.create({
  baseURL: 'http://localhost:5100',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// En orquestador/src/controllers/portalController.js
export const getPortalView = async (req, res) => {
  try {
    const response = await api.get(`/portales/${req.params.vendedorId}/view`);
    if (!response.data) throw new Error('No data received from portal service');
    
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