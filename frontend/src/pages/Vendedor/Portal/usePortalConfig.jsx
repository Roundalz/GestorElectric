import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePortalConfig = (vendedorId) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener configuración del portal
        const configRes = await axios.get(`http://localhost:5000/api/portales/${vendedorId}/config`)
        ;
        
        // Obtener temas disponibles
        const temasRes = await axios.get(`http://localhost:5000/api/portales/temas`)
        ;
        
        setConfig(configRes.data);
        setTemas(temasRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendedorId]);

  const updateConfig = async (newConfig) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/portales/${vendedorId}/config`,
        {
          // Mapear los nombres de campos según tu base de datos
          estilo_titulo: newConfig.estilo_titulo,
          tema_seleccionado: newConfig.tema_seleccionado,
          color_principal: newConfig.color_principal,
          color_secundario: newConfig.color_secundario,
          color_fondo: newConfig.color_fondo,
          fuente_principal: newConfig.fuente_principal,
          disposicion_productos: newConfig.disposicion_productos,
          productos_por_fila: newConfig.productos_por_fila,
          mostrar_precios: newConfig.mostrar_precios,
          mostrar_valoraciones: newConfig.mostrar_valoraciones,
          estilo_header: newConfig.estilo_header,
          mostrar_busqueda: newConfig.mostrar_busqueda,
          mostrar_categorias: newConfig.mostrar_categorias,
          estilos_productos: JSON.stringify(newConfig.estilos_productos),
          mostrar_banner: newConfig.mostrar_banner,
          logo_personalizado: newConfig.logo_personalizado,
          banner_personalizado: newConfig.banner_personalizado
        }
      );
      setConfig(response.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { config, temas, loading, error, updateConfig };
};