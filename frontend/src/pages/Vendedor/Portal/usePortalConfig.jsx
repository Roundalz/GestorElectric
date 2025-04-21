import { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración por defecto extendida con todas las opciones
const DEFAULT_CONFIG = {
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
  estilos_productos: 'card',
  mostrar_banner: true,
  logo_personalizado: '',
  banner_personalizado: '',
  estilo_titulo: 'bold 24px Arial',
  estilos_botones: 'redondeado',
  efecto_hover_productos: 'sombra',
  opciones_filtrados: { precio: false, categorias: false },
  mostrar_ofertas: false,
  mostrar_boton_whatsapp: false,
  whatsapp_numero: 0,
  mostrar_instragram_feed: false,
  instagram_link: '',
  opciones_avanzadas: {},
  scripts_personalizados: ''
};

export const usePortalConfig = (vendedorId) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [state, setState] = useState({
    config: DEFAULT_CONFIG,
    loading: true,
    error: null,
    portalCodigo: null,
    plan: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!vendedorId) return;

        // Obtener configuración y plan en paralelo
        const [configRes, planRes] = await Promise.all([
          axios.get(`${baseURL}/api/portales/${vendedorId}/config`),
          axios.get(`${baseURL}/api/portales/vendedor/${vendedorId}/plan`)
        ]);

        setState({
          loading: false,
          error: null,
          config: {
            ...DEFAULT_CONFIG,
            ...(configRes.data?.config || {})
          },
          portalCodigo: configRes.data?.codigo_portal || null,
          plan: planRes.data || null
        });
      } catch (err) {
        console.error('Error fetching portal config:', err);
        setState({
          loading: false,
          error: err.message,
          config: DEFAULT_CONFIG,
          portalCodigo: null,
          plan: null
        });
      }
    };

    fetchData();
  }, [vendedorId, baseURL]);

  const updateConfig = async (newConfig) => {
    try {
      if (!state.portalCodigo) {
        throw new Error('No se ha cargado el código del portal');
      }

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
          },
          // Actualizar el plan si viene en la respuesta
          plan: response.data.plan || prev.plan
        }));
        return { 
          success: true,
          plan: response.data.plan || state.plan
        };
      }
      throw new Error(response.data?.error || 'Error al actualizar');
    } catch (err) {
      console.error('Error updating config:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || err.message,
        unauthorizedFeatures: err.response?.data?.unauthorizedFeatures,
        currentPlan: state.plan
      };
    }
  };

  return { 
    ...state,
    updateConfig 
  };
};