import React, { useState, useEffect, useContext } from 'react';
import { VendedorContext } from '@context/VendedorContext';
import { useParams } from 'react-router-dom';
import './styles.css';

const ProductEditor = () => {
  const { vendedorId } = useContext(VendedorContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/portales/${vendedorId}/productos`) // Usa ruta relativa con proxy
                                .then(response => {
                                  if (!response.ok) throw new Error('Network response was not ok')
                                  const contentType = response.headers.get('content-type')
                                  if (!contentType || !contentType.includes('application/json')) {
                                    throw new TypeError("Oops, no recibimos JSON!")
                                  }
                                  return response.json()
                                })
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [vendedorId]);

  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Error al actualizar');
      
      // Actualizar estado local
      setProducts(products.map(p => 
        p.codigo_producto === productId ? { ...p, ...updatedData } : p
      ));
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-editor">
      <h2>Administrar Productos</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.codigo_producto} className="product-item">
            <div className="product-image-container">
              <img 
                src={product.imagen_referencia_producto} 
                alt={product.nombre_producto} 
              />
            </div>
            <div className="product-details">
              <input
                type="text"
                value={product.nombre_producto}
                onChange={(e) => handleUpdateProduct(product.codigo_producto, {
                  nombre_producto: e.target.value
                })}
              />
              <input
                type="number"
                value={product.precio_unidad_producto}
                onChange={(e) => handleUpdateProduct(product.codigo_producto, {
                  precio_unidad_producto: e.target.value
                })}
              />
              <select
                value={product.estado_producto}
                onChange={(e) => handleUpdateProduct(product.codigo_producto, {
                  estado_producto: e.target.value
                })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductEditor;