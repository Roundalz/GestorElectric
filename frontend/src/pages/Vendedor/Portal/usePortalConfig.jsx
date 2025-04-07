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
        newConfig
      );
      setConfig(response.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { config, temas, loading, error, updateConfig };
};