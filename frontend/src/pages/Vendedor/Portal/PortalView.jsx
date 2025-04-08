import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { VendedorContext } from '@context/VendedorContext';
import './styles.css';

const PortalView = () => {
  const { vendedorId } = useContext(VendedorContext);
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const response = await fetch(`/api/portales/${vendedorId}/view`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.config) {
          throw new Error('Datos del portal no recibidos correctamente');
        }
        
        setPortalData(data);
      } catch (err) {
        console.error('Error en loadPortalData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId) {
      loadPortalData();
    } else {
      setError('ID de vendedor no proporcionado');
      setLoading(false);
    }
  }, [vendedorId]);

  // Resto del código permanece igual...
  useEffect(() => {
    if (!portalData) return;

    // Aplicar estilos dinámicos
    document.documentElement.style.setProperty('--color-primary', portalData.config.color_principal);
    document.documentElement.style.setProperty('--color-secondary', portalData.config.color_secundario);
    document.documentElement.style.setProperty('--bg-color', portalData.config.color_fondo);

    // Aplicar CSS personalizado
    if (portalData.config.css_personalizado) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = portalData.config.css_personalizado;
      document.head.appendChild(styleTag);
      return () => document.head.removeChild(styleTag);
    }
  }, [portalData]);

  if (loading) return <div className="loading">Cargando portal...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!portalData) return <div>Portal no encontrado</div>;

  return (
    <div className={`portal-container ${portalData.config.tema_seleccionado.toLowerCase()}`}>
      <header className={`portal-header ${portalData.config.estilo_header}`}>
        <img src={portalData.config.logo_personalizado} alt="Logo" className="portal-logo" />
        <h1 style={{ fontFamily: portalData.config.fuente_principal }}>
          {portalData.vendedor.nombre_empresa}
        </h1>
      </header>

      {portalData.config.mostrar_banner && (
        <div className="banner-container">
          <img src={portalData.config.banner_personalizado} alt="Banner" className="portal-banner" />
        </div>
      )}

      <main className={`product-display layout-${portalData.config.disposicion_productos}`}>
        {portalData.productos.map(producto => (
          <div key={producto.codigo_producto} className="product-card">
            <img 
              src={producto.imagen_referencia_producto} 
              alt={producto.nombre_producto} 
              className="product-image"
            />
            <div className="product-info">
              <h3>{producto.nombre_producto}</h3>
              {portalData.config.mostrar_precios && (
                <p className="product-price">${producto.precio_unidad_producto}</p>
              )}
              {portalData.config.mostrar_valoraciones && producto.calificacion_producto > 0 && (
                <div className="product-rating">
                  {'★'.repeat(producto.calificacion_producto)}
                  {'☆'.repeat(5 - producto.calificacion_producto)}
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PortalView;