import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useVendedor } from '@context/VendedorContext';
import './styles.css';

const PortalView = () => {
  const { vendedorId } = useVendedor();
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
        
        if (!data?.success) {
          throw new Error(data.error || 'Respuesta inválida del servidor');
        }
        
        setPortalData(data.data);
      } catch (err) {
        console.error('Error en loadPortalData:', err);
        setError(err.message);
        
        // Cargar datos mock como fallback
        setPortalData(mockPortalData);
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
/*
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';

const PortalView = () => {
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos simulados del vendedor y su portal
  const mockPortalData = {
    config: {
      color_principal: '#4a6baf',
      color_secundario: '#f8a51b',
      color_fondo: '#f5f5f5',
      tema_seleccionado: 'Moderno',
      estilo_header: 'centrado',
      logo_personalizado: 'https://via.placeholder.com/150x80?text=Logo+Empresa',
      fuente_principal: 'Arial, sans-serif',
      mostrar_banner: true,
      banner_personalizado: 'https://via.placeholder.com/1200x300?text=Banner+Promocional',
      disposicion_productos: 'grid',
      mostrar_precios: true,
      mostrar_valoraciones: true,
      css_personalizado: `
        .product-card:hover {
          transform: scale(1.03);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `
    },
    vendedor: {
      nombre_empresa: "Tienda Ejemplo",
      descripcion_empresa: "Vendemos productos de calidad desde 2010"
    },
    productos: [
      {
        codigo_producto: 'prod-001',
        nombre_producto: 'Producto Ejemplo 1',
        imagen_referencia_producto: 'https://via.placeholder.com/300x200?text=Producto+1',
        precio_unidad_producto: 29.99,
        calificacion_producto: 4,
        descripcion_producto: 'Descripción detallada del producto 1'
      },
      {
        codigo_producto: 'prod-002',
        nombre_producto: 'Producto Ejemplo 2',
        imagen_referencia_producto: 'https://via.placeholder.com/300x200?text=Producto+2',
        precio_unidad_producto: 49.99,
        calificacion_producto: 5,
        descripcion_producto: 'Descripción detallada del producto 2'
      },
      {
        codigo_producto: 'prod-003',
        nombre_producto: 'Producto Ejemplo 3',
        imagen_referencia_producto: 'https://via.placeholder.com/300x200?text=Producto+3',
        precio_unidad_producto: 19.99,
        calificacion_producto: 3,
        descripcion_producto: 'Descripción detallada del producto 3'
      },
      {
        codigo_producto: 'prod-004',
        nombre_producto: 'Producto Ejemplo 4',
        imagen_referencia_producto: 'https://via.placeholder.com/300x200?text=Producto+4',
        precio_unidad_producto: 99.99,
        calificacion_producto: 4,
        descripcion_producto: 'Descripción detallada del producto 4'
      }
    ]
  };

  useEffect(() => {
    // Simulamos una carga asíncrona
    const timer = setTimeout(() => {
      setPortalData(mockPortalData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
                <p className="product-price">${producto.precio_unidad_producto.toFixed(2)}</p>
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

export default PortalView;*/