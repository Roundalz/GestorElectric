import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePortalConfig = (vendedorId) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [configResponse, temasResponse] = await Promise.all([
          axios.get(`${baseURL}/api/portales/${vendedorId}/config`),
          axios.get(`${baseURL}/api/portales/temas`)
        ]);
        
        if (!configResponse.data?.success) {
          throw new Error(configResponse.data?.error || 'Error en la respuesta de configuración');
        }
        
        setConfig(configResponse.data.config);
        setTemas(temasResponse.data || []);
      } catch (err) {
        console.error('Error en usePortalConfig:', err);
        setError(err.message);
        
        // Configuración por defecto si hay error
        setConfig({
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
          banner_personalizado: ''
        });
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId) fetchData();
  }, [vendedorId, baseURL]);

  const updateConfig = async (newConfig) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/portales/portal/config`,
        newConfig,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Error al actualizar configuración');
      }
      
      setConfig(newConfig);
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar configuración:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    }
  };

  return { config, temas, loading, error, updateConfig };
};