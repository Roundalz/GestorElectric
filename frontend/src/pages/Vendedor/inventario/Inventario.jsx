// src/pages/Vendedor/inventario/Inventario.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendedor } from '@context/VendedorContext';
import AddProduct from './AddProduct';
import BarcodePrint from './BarcodePrint';
import ListAll from './ListAll';
import styles from './Inventario.module.css';

const DEFAULT_IMAGE = 'https://img3.wallspic.com/crops/5/8/0/1/5/151085/151085-marco_de_plastico_verde_y_negro-3840x2160.jpg';

export default function Inventario() {
  const [activeTab, setActiveTab] = useState('list');
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  
  const { vendedorId } = useVendedor();

  useEffect(() => {
    if (activeTab === 'list' && vendedorId) {
      fetch(`http://localhost:5000/api/inventario/productos`, {
        headers: {
          'X-Vendedor-Id': vendedorId, // ✅ HEADER correcto
        },
      })
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          const uniqueTypes = Array.from(new Set(data.map(p => p.tipo_producto)));
          setTypes(uniqueTypes);
        })
        .catch(console.error);
    }
  }, [activeTab, vendedorId]);// también depende de vendedorId

  const filteredProducts = selectedType
    ? products.filter(p => p.tipo_producto === selectedType)
    : [];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button
          className={`${styles.navItem} ${activeTab === 'list' ? styles.active : ''}`}
          onClick={() => { setActiveTab('list'); setSelectedType(null); }}
        >
          Listar Inventario
        </button>
        <button
          className={`${styles.navItem} ${activeTab === 'add' ? styles.active : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Agregar Producto
        </button>
        <button
          className={`${styles.navItem} ${activeTab === 'print' ? styles.active : ''}`}
          onClick={() => setActiveTab('print')}
        >
          Imprimir Códigos
        </button>
        <button
          className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Listar Productos
        </button>
      </nav>

      <div className={styles.content}>
        {activeTab === 'list' && (
          !selectedType
            ? (
              <div className={styles.grid}>
                {types.map(type => (
                  <div
                    key={type}
                    className={styles.typeCard}
                    onClick={() => setSelectedType(type)}
                  >
                    <img
                      src={DEFAULT_IMAGE}
                      alt={type}
                      className={styles.typeImage}
                    />
                    <h3 className={styles.typeName}>{type}</h3>
                  </div>
                ))}
              </div>
            )
            : (
              <>
                <button
                  className={styles.backButton}
                  onClick={() => setSelectedType(null)}
                >
                  ← Volver a tipos
                </button>
                <div className={styles.grid}>
                  {filteredProducts.map(prod => (
                    <div
                      key={prod.codigo_producto}
                      className={styles.productCard}
                      onClick={() => navigate(`/inventario/${prod.codigo_producto}`)}
                    >
                      <img
                        src={prod.imagen_referencia_producto || DEFAULT_IMAGE}
                        alt={prod.nombre_producto}
                        className={styles.productImage}
                      />
                      <div className={styles.productInfo}>
                        <h4 className={styles.productName}>{prod.nombre_producto}</h4>
                        <p className={styles.price}>${prod.precio_unidad_producto}</p>
                        <p className={styles.quantity}>
                          Disponibles: {prod.cantidad_disponible_producto}
                        </p>
                        <p className={styles.status}>{prod.estado_producto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
        )}
        {activeTab === 'add' && <AddProduct />}
        {activeTab === 'print' && <BarcodePrint />}
        {activeTab === 'products' && <ListAll />}
      </div>
    </div>
  );
}