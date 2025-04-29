import React, { useState, useEffect } from 'react';
import { useVendedor } from '@context/VendedorContext';
import axios from 'axios';
import './styles.css';
import { useCart } from "../../context/CartContext";

const ProductModal = ({ product, config, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (isValidUrl(imagePath)) {
      return imagePath;
    }
    return `${baseURL}/uploads/${imagePath}`;
  };

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/productos/${product.codigo_producto}/imagenes`);
        if (response.data && response.data.success) {
          const images = [
            product.imagen_referencia_producto,
            ...Object.values(response.data.imagenes).filter(img => img)
          ];
          setProductImages(images);
        }
      } catch (error) {
        console.error('Error al cargar imágenes adicionales:', error);
        setProductImages([product.imagen_referencia_producto]);
      }
    };

    loadProductImages();
  }, [product.codigo_producto]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-product-images">
          {productImages.length > 0 && (
            <>
              <img 
                src={getImageUrl(productImages[currentImageIndex])} 
                alt={`${product.nombre_producto} - Imagen ${currentImageIndex + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
                }}
              />
              {productImages.length > 1 && (
                <div className="image-navigation">
                  <button onClick={(e) => { e.stopPropagation(); prevImage(); }}>&lt;</button>
                  <span>{currentImageIndex + 1} / {productImages.length}</span>
                  <button onClick={(e) => { e.stopPropagation(); nextImage(); }}>&gt;</button>
                </div>
              )}
              <div className="image-thumbnails">
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`Miniatura ${index + 1}`}
                    className={index === currentImageIndex ? 'active' : ''}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="modal-product-details">
          <h2>{product.nombre_producto}</h2>
          <p className="product-type">{product.tipo_producto}</p>
          
          <div className="product-price-section">
            <span className="price">${product.precio_unidad_producto}</span>
            {product.descuento_producto > 0 && (
              <span className="discount">-{product.descuento_producto}%</span>
            )}
          </div>
          
          <div className="product-stock">
            <span>Disponibles: {product.cantidad_disponible_producto}</span>
            <span>Estado: {product.estado_producto}</span>
          </div>
          
          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.descripcion || 'No hay descripción disponible'}</p>
          </div>
          
          {config.opciones_avanzadas?.checkout?.metodos_pago && (
            <div className="payment-methods">
              <h3>Métodos de pago aceptados</h3>
              <div className="method-icons">
                {config.opciones_avanzadas.checkout.metodos_pago.includes('tarjeta') && (
                  <span className="payment-icon" title="Tarjeta de crédito/débito">💳</span>
                )}
                {config.opciones_avanzadas.checkout.metodos_pago.includes('transferencia') && (
                  <span className="payment-icon" title="Transferencia bancaria">🏦</span>
                )}
                {config.opciones_avanzadas.checkout.metodos_pago.includes('efectivo') && (
                  <span className="payment-icon" title="Efectivo">💵</span>
                )}
              </div>
            </div>
          )}
          
          <div className="product-actions">
              <button 
                className={`btn-add-to-cart ${config.estilos_botones}`} 
                onClick={() => {
                  addToCart({
                    ...selectedProduct,
                    vendedor_codigo_vendedore: vendedor.codigo_vendedore, // <- añadimos el código del vendedor
                  });
                }}
              >
                Añadir al carrito
              </button>
            
            <button className={`btn-favorite ${config.estilos_botones}`}>
              ❤️ Favorito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortalView = () => {
  const { vendedorId } = useVendedor();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [items, setItems] = useState([]);
  const { addToCart } = useCart(); // Extraemos la función para agregar productos al carrito

    /* ───────────────  Utilidad para validar URLs  ────────────── */
    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };
  
    /* ───────────────  Función para obtener URL de imagen  ────────────── */
    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      if (isValidUrl(imagePath)) {
        return imagePath;
      }
      return `${baseURL}/uploads/${imagePath}`;
    };

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
    const styles = {
      '--color-primary': config.color_principal || '#4F46E5',
      '--color-secondary': config.color_secundario || '#7C3AED',
      '--color-bg': config.color_fondo || '#FFFFFF',
      '--font-family': config.fuente_principal || 'Arial, sans-serif',
      '--title-style': config.estilo_titulo || 'bold 24px Arial',
      '--products-per-row': config.productos_por_fila || 4,
      '--button-style': config.estilos_botones || 'redondeado'
    };
    
    if (config.efecto_hover_productos) {
      styles['--product-hover-effect'] = config.efecto_hover_productos;
    }
    
    return styles;
  };

  const getProductGridStyle = (config) => {
    const styles = {};
    
    if (config.productos_por_fila) {
      styles.gridTemplateColumns = `repeat(${config.productos_por_fila}, 1fr)`;
    }
    
    return styles;
  };

  const renderWhatsAppButton = (config) => {
    if (!config.mostrar_boton_whatsapp || !config.whatsapp_numero) return null;
    
    const phoneNumber = config.whatsapp_numero.toString().replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    
    return (
      <div className="whatsapp-float">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <img 
            src={`${baseURL}/assets/whatsapp-icon.png`} 
            alt="Contactar por WhatsApp" 
          />
        </a>
      </div>
    );
  };

  const renderInstagramFeed = (config) => {
    if (!config.mostrar_instragram_feed || !config.instagram_link) return null;
    
    const instagramUser = config.instagram_link.split('/').filter(Boolean).pop();
    
    return (
      <div className="instagram-feed">
        <h3>Síguenos en Instagram</h3>
        <div className="instagram-posts">
          <p>@{instagramUser}</p>
        </div>
      </div>
    );
  };

  const getFilterOptions = (config) => {
    if (!config.opciones_filtrados) return null;
    
    try {
      const filters = typeof config.opciones_filtrados === 'string' 
        ? JSON.parse(config.opciones_filtrados) 
        : config.opciones_filtrados;
      
      return (
        <div className="product-filters">
          <h4>Filtrar por:</h4>
          {filters.precio && (
            <div className="filter-option">
              <label>
                <input type="checkbox" name="price-filter" />
                Precio
              </label>
            </div>
          )}
          {filters.categorias && (
            <div className="filter-option">
              <label>
                <input type="checkbox" name="category-filter" />
                Categorías
              </label>
            </div>
          )}
          {filters.valoraciones && (
            <div className="filter-option">
              <label>
                <input type="checkbox" name="rating-filter" />
                Valoraciones
              </label>
            </div>
          )}
          {filters.disponibilidad && (
            <div className="filter-option">
              <label>
                <input type="checkbox" name="availability-filter" />
                Disponibilidad
              </label>
            </div>
          )}
        </div>
      );
    } catch (e) {
      console.error('Error parsing filter options:', e);
      return null;
    }
  };

  const filteredProducts = portalData?.productos?.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) return <div className="loading">Cargando portal...</div>;
  if (error) {
    console.error('Error loading portal:', error);
    return <div className="error">{error}</div>;
  }

  if (!portalData || !portalData.productos) {
    return (
      <div className="no-products">
        <h3>No se encontraron productos disponibles</h3>
        <p>El vendedor no tiene productos publicados en este momento.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="no-products">
        <h3>No se encontraron productos que coincidan con tu búsqueda</h3>
        <p>Intenta con otros términos de búsqueda.</p>
      </div>
    );
  }

  const { vendedor, config, productos } = portalData;
  const themeStyles = applyThemeStyles(config);
  const productGridStyle = getProductGridStyle(config);
  const filterOptions = getFilterOptions(config);

  return (
    <div className="portal-view" style={themeStyles}>
      {/* Header del portal */}
      <header className={`portal-header ${config.estilo_header}`}>
        <div className="portal-logo">
          {config.logo_personalizado ? (
            <img 
              src={getImageUrl(config.logo_personalizado)} 
              alt={`Logo de ${vendedor.nombre_empresa}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200?text=Logo+no+disponible';
              }}
            />
          ) : (
            <h1 style={{ font: themeStyles['--title-style'] }}>
              {vendedor.nombre_empresa}
            </h1>
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
          <img 
            src={getImageUrl(config.banner_personalizado)} 
            alt="Banner del portal"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/1200x400?text=Banner+no+disponible';
            }}
          />
        </div>
      )}

      {/* Contenido principal */}
      <main className="portal-main">
        <div className="portal-content-wrapper">
          {/* Filtros (si están habilitados) */}
          {filterOptions && (
            <aside className="portal-sidebar">
              {filterOptions}
            </aside>
          )}

          <div className="portal-products-section">
            <h2 className="portal-title" style={{ font: themeStyles['--title-style'] }}>
              {config.mostrar_categorias ? 'Nuestros Productos' : vendedor.nombre_empresa}
            </h2>
            
            {/* Mostrar ofertas destacadas si está habilitado */}
            {config.mostrar_ofertas && (
              <div className="featured-offers">
                <h3>Ofertas Especiales</h3>
                <div className="offers-grid">
                  {productos
                    .filter(p => p.descuento_producto > 0)
                    .slice(0, 3)
                    .map(producto => (
                      <div 
                        key={`offer-${producto.codigo_producto}`}
                        className="offer-card"
                        onClick={() => setSelectedProduct(producto)}
                      >
                        <img 
                          src={getImageUrl(producto.imagen_referencia_producto) || 
                               'https://via.placeholder.com/300x200?text=Oferta'}
                          alt={producto.nombre_producto}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                          }}
                        />
                        <div className="offer-badge">
                          -{producto.descuento_producto}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Listado de productos */}
            <div 
              className={`product-grid ${config.disposicion_productos} ${config.estilos_productos}`}
              style={productGridStyle}
            >
              {filteredProducts.map(producto => (
                <div 
                  key={producto.codigo_producto} 
                  className={`product-card ${config.estilos_productos} ${config.estilos_botones}`}
                  onClick={() => setSelectedProduct(producto)}
                  data-hover-effect={config.efecto_hover_productos}
                >
                  <div className="product-image">
                  <img 
                      src={getImageUrl(producto.imagen_referencia_producto) || 
                           'https://via.placeholder.com/300x200?text=Producto+Sin+Imagen'}
                      alt={producto.nombre_producto}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                      }}
                    />
                    {producto.descuento_producto > 0 && (
                      <span className="discount-badge">
                        -{producto.descuento_producto}%
                      </span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{producto.nombre_producto}</h3>
                    <p className="product-type">{producto.tipo_producto}</p>
                    {config.mostrar_precios && (
                      <div className="product-price">
                        ${producto.precio_unidad_producto}
                        {producto.descuento_producto > 0 && (
                          <span className="original-price">
                            ${Math.round(producto.precio_unidad_producto * 100 / (100 - producto.descuento_producto))}
                          </span>
                        )}
                      </div>
                    )}
                    {config.mostrar_valoraciones && producto.calificacion_producto > 0 && (
                      <div className="product-rating">
                        {'★'.repeat(producto.calificacion_producto)}
                        {'☆'.repeat(5 - producto.calificacion_producto)}
                        <span>({producto.calificacion_producto})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feed de Instagram si está habilitado */}
        {renderInstagramFeed(config)}
      </main>

      {/* Footer del portal */}
      <footer className="portal-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>{vendedor.nombre_empresa}</p>
            <p>{vendedor.direccion_empresa}</p>
            <p>{vendedor.ciudad_empresa}, {vendedor.pais_empresa}</p>
            <p>Tel: {vendedor.telefono_empresa}</p>
          </div>
          
          {config.mostrar_boton_whatsapp && (
            <div className="footer-section">
              <h4>Contacto Rápido</h4>
              <a 
                href={`https://wa.me/${config.whatsapp_numero}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                WhatsApp: {config.whatsapp_numero}
              </a>
            </div>
          )}
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} {vendedor.nombre_empresa} - Todos los derechos reservados
        </p>
      </footer>

      {/* Botón flotante de WhatsApp */}
      {renderWhatsAppButton(config)}

      {/* Modal de producto */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          config={config} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default PortalView;