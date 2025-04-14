import React, { useState, useEffect } from 'react';
import { useVendedor } from '@context/vendedorContext';
import axios from 'axios';
import './styles.css';

const PortalView = () => {
  const { vendedorId } = useVendedor();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/portales/${vendedorId}/view`);
        
        if (!response.data || !response.data.success) {
          throw new Error(response.data?.error || 'La respuesta no contiene datos válidos');
        }
        
        setPortalData(response.data.data);
      } catch (err) {
        let errorMessage = `Error al cargar el portal: ${err.message}`;
        if (err.response?.status === 500) {
          errorMessage = "Error interno del servidor. Por favor, inténtelo más tarde.";
        } else if (err.response?.status === 404) {
          errorMessage = "Portal no encontrado para este vendedor";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId) {
      loadPortalData();
    } else {
      setError('No se proporcionó ID de vendedor');
      setLoading(false);
    }
  }, [vendedorId, baseURL]);

  const applyThemeStyles = (config) => {
    return {
      '--color-primary': config.color_principal || '#4F46E5',
      '--color-secondary': config.color_secundario || '#7C3AED',
      '--color-bg': config.color_fondo || '#FFFFFF',
      '--font-family': config.fuente_principal || 'Arial, sans-serif',
      '--title-style': config.estilo_titulo || 'bold 24px Arial'
    };
  };

  const filteredProducts = portalData?.productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando portal...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!portalData) return <div>No se encontraron datos del portal</div>;

  const { vendedor, config, productos } = portalData;
  const themeStyles = applyThemeStyles(config);

  return (
    <div className="portal-view" style={themeStyles}>
      {/* Header del portal */}
      <header className={`portal-header ${config.estilo_header}`}>
        <div className="portal-logo">
          {config.logo_personalizado ? (
            <img src={`${baseURL}/uploads/${config.logo_personalizado}`} alt={`Logo de ${vendedor.nombre_empresa}`} />
          ) : (
            <h1 style={{ font: themeStyles['--title-style'] }}>{vendedor.nombre_empresa}</h1>
          )}
        </div>
        
        {config.mostrar_busqueda && (
          <div className="portal-search">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </header>

      {/* Banner del portal */}
      {config.mostrar_banner && config.banner_personalizado && (
        <div className="portal-banner">
          <img src={`${baseURL}/uploads/${config.banner_personalizado}`} alt="Banner del portal" />
        </div>
      )}

      {/* Contenido principal */}
      <main className="portal-main">
        <h2 className="portal-title" style={{ font: themeStyles['--title-style'] }}>
          {config.mostrar_categorias ? 'Nuestros Productos' : vendedor.nombre_empresa}
        </h2>
        
        {/* Listado de productos */}
        <div className={`product-grid ${config.disposicion_productos}`}>
          {filteredProducts?.map(producto => (
            <div 
              key={producto.codigo_producto} 
              className={`product-card ${config.estilos_productos}`}
              onClick={() => setSelectedProduct(producto)}
            >
              <div className="product-image">
                <img 
                  src={`${baseURL}/uploads/${producto.imagen_referencia_producto}`} 
                  alt={producto.nombre_producto} 
                />
              </div>
              <div className="product-info">
                <h3>{producto.nombre_producto}</h3>
                <p className="product-type">{producto.tipo_producto}</p>
                {config.mostrar_precios && (
                  <p className="product-price">${producto.precio_unidad_producto}</p>
                )}
                {config.mostrar_valoraciones && producto.calificacion_producto > 0 && (
                  <div className="product-rating">
                    {'★'.repeat(producto.calificacion_producto)}
                    {'☆'.repeat(5 - producto.calificacion_producto)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer del portal */}
      <footer className="portal-footer">
        <p>&copy; {new Date().getFullYear()} {vendedor.nombre_empresa}</p>
      </footer>

      {/* Modal de producto */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            
            <div className="modal-product-images">
              <img 
                src={`${baseURL}/uploads/${selectedProduct.imagen_referencia_producto}`} 
                alt={selectedProduct.nombre_producto} 
              />
            </div>
            
            <div className="modal-product-details">
              <h2>{selectedProduct.nombre_producto}</h2>
              <p className="product-type">{selectedProduct.tipo_producto}</p>
              
              <div className="product-price-section">
                <span className="price">${selectedProduct.precio_unidad_producto}</span>
                {selectedProduct.descuento_producto > 0 && (
                  <span className="discount">-{selectedProduct.descuento_producto}%</span>
                )}
              </div>
              
              <div className="product-stock">
                <span>Disponibles: {selectedProduct.cantidad_disponible_producto}</span>
                <span>Estado: {selectedProduct.estado_producto}</span>
              </div>
              
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{selectedProduct.descripcion || 'No hay descripción disponible'}</p>
              </div>
              
              <div className="product-actions">
                <button className="btn-add-to-cart">Añadir al carrito</button>
                <button className="btn-favorite">❤️ Favorito</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalView;