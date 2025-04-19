import { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración por defecto centralizada
const DEFAULT_CONFIG = {
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
};

export const usePortalConfig = (vendedorId) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [state, setState] = useState({
    config: DEFAULT_CONFIG, // Usa el mismo objeto de valores por defecto
    loading: true,
    error: null,
    portalCodigo: null
  });

  // Cuando recibas datos del servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const configRes = await axios.get(`${baseURL}/api/portales/${vendedorId}/config`);
        
        setState({
          loading: false,
          error: null,
          config: {
            ...DEFAULT_CONFIG,
            ...(configRes.data?.config || {}) // Combina con los datos del servidor
          },
          portalCodigo: configRes.data?.codigo_portal || null
        });
      } catch (err) {
        // En caso de error, usa los valores por defecto
        setState({
          loading: false,
          error: err.message,
          config: DEFAULT_CONFIG,
          portalCodigo: null
        });
      }
    };

    if (vendedorId) fetchData();
  }, [vendedorId, baseURL]);

  const updateConfig = async (newConfig) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/portales/portal/config`,
        {
          portal_codigo_portal: state.portalCodigo,
          ...newConfig
        }
      );
      
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            ...newConfig
          }
        }));
        return { success: true };
      }
      throw new Error(response.data?.error || 'Error al actualizar');
    } catch (err) {
      console.error('Error al actualizar configuración:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      };
    }
  };

  return { 
    ...state,
    updateConfig 
  };
};