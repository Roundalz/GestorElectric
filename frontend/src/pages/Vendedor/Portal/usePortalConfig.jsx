
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
    config: null,
    loading: true,
    error: null,
    portalCodigo: null,
    plan: null,
    isReady: false // Estado para controlar cuando la carga inicial ha terminado
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!vendedorId) return;

        setState(prev => ({ ...prev, loading: true }));

        const [configRes, planRes] = await Promise.all([
          axios.get(`${baseURL}/api/portales/${vendedorId}/config`),
          axios.get(`${baseURL}/api/portales/vendedor/${vendedorId}/plan`)
        ]);

        // Asegúrate que el backend devuelve codigo_portal
        console.log('Respuesta de configuración:', configRes.data);
        
        if (!configRes.data?.codigo_portal) {
          throw new Error('El backend no devolvió el código del portal');
        }

        setState({
          loading: false,
          error: null,
          config: {
            ...DEFAULT_CONFIG,
            ...(configRes.data?.config || {})
          },
          portalCodigo: configRes.data.codigo_portal,
          plan: planRes.data,
          isReady: true
        });
      } catch (err) {
        console.error('Error fetching portal config:', err);
        setState({
          config: null,
          loading: false,
          error: err.message || 'Error al cargar configuración',
          portalCodigo: null,
          plan: null,
          isReady: true
        });
      }
    };

    fetchData();
  }, [vendedorId, baseURL]);

  const updateConfig = async (changes) => {
    try {
      if (!state.portalCodigo) {
        console.error('portalCodigo no disponible en updateConfig');
        throw new Error('No se ha cargado el código del portal');
      }
  
      console.log('Enviando cambios al backend:', changes);
      
      const response = await axios.put(
        `${baseURL}/api/portales/${vendedorId}/config`,
        {
          portal_codigo_portal: state.portalCodigo,
          changes,
          vendedorId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Respuesta completa del backend:', response);
  
      if (response.data.success) {
        console.log('Actualización exitosa, actualizando estado local...');
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            ...changes
          },
          originalConfig: {
            ...prev.originalConfig,
            ...changes
          }
        }));
        
        return { 
          success: true,
          changes: Object.keys(changes)
        };
      }
      
      console.error('Error en la respuesta del backend:', response.data);
      throw new Error(response.data?.error || 'Error al actualizar');
    } catch (err) {
      console.error('Error detallado en updateConfig:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
      throw err;
    }
  };

  return { 
    ...state,
    updateConfig 
  };
};