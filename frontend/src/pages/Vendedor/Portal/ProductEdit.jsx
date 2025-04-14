import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const ProductEditor = () => {
  const { vendedorId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portalConfig, setPortalConfig] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsRes, configRes] = await Promise.all([
          axios.get(`${baseURL}/api/portales/${vendedorId}/productos`),
          axios.get(`${baseURL}/api/portales/${vendedorId}/config`)
        ]);
        
        setProducts(productsRes.data || []);
        setPortalConfig(configRes.data?.config || {});
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendedorId) {
      fetchData();
    }
  }, [vendedorId, baseURL]);

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/portales/productos/${productId}`,
        updatedData
      );
      
      if (response.data.success) {
        setProducts(products.map(p => 
          p.codigo_producto === productId ? { ...p, ...updatedData } : p
        ));
        alert('Producto actualizado correctamente');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await axios.delete(
          `${baseURL}/api/portales/productos/${productId}`
        );
        
        if (response.data.success) {
          setProducts(products.filter(p => p.codigo_producto !== productId));
          alert('Producto eliminado correctamente');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleAddProduct = () => {
    navigate(`/vendedor/${vendedorId}/productos/nuevo`);
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-editor">
      <div className="editor-header">
        <h2>Administración de Productos</h2>
        <button onClick={handleAddProduct} className="btn-add">
          + Añadir Producto
        </button>
      </div>

      <div className="product-list">
        {products.map(producto => (
          <div key={producto.codigo_producto} className="product-item">
            <div className="product-image">
              <img 
                src={producto.imagen_referencia_producto} 
                alt={producto.nombre_producto} 
              />
            </div>
            
            <div className="product-details">
              <h3>{producto.nombre_producto}</h3>
              <p>Tipo: {producto.tipo_producto}</p>
              <p>Precio: ${producto.precio_unidad_producto}</p>
              <p>Stock: {producto.cantidad_disponible_producto}</p>
              <p>Estado: {producto.estado_producto}</p>
            </div>
            
            <div className="product-actions">
              <button 
                onClick={() => navigate(`/vendedor/${vendedorId}/productos/${producto.codigo_producto}`)}
                className="btn-edit"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDeleteProduct(producto.codigo_producto)}
                className="btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuración de visualización de productos */}
      {portalConfig && (
        <div className="display-config">
          <h3>Configuración de Visualización</h3>
          
          <div className="config-option">
            <label>
              <input 
                type="checkbox" 
                checked={portalConfig.mostrar_precios}
                readOnly
              />
              Mostrar precios
            </label>
          </div>
          
          <div className="config-option">
            <label>
              <input 
                type="checkbox" 
                checked={portalConfig.mostrar_valoraciones}
                readOnly
              />
              Mostrar valoraciones
            </label>
          </div>
          
          <div className="config-option">
            <label>Disposición: </label>
            <span>{portalConfig.disposicion_productos}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditor;