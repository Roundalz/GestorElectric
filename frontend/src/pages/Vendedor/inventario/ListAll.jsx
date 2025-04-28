// src/pages/Vendedor/inventario/ListAll.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendedor } from '@context/vendedorContext';
import styles from './ListAll.module.css';

const API_BASE = 'http://localhost:5000/api/inventario';

export default function ListAll() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  const { vendedorId } = useVendedor();

  useEffect(() => {
    if (vendedorId) {
      fetch(`${API_BASE}/productos`, {
        headers: {
          'X-Vendedor-Id': vendedorId, // ✅ Correcto: mandar en header
        },
      })
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          const unique = Array.from(new Set(data.map(p => p.tipo_producto)));
          setTypes(unique);
        })
        .catch(console.error);
    }
  }, [vendedorId]);

  const filtered = products.filter(p => {
    const term = search.toLowerCase();
    const matchSearch =
      p.nombre_producto.toLowerCase().includes(term) ||
      String(p.codigo_producto).includes(term);
    const matchType = typeFilter ? p.tipo_producto === typeFilter : true;
    return matchSearch && matchType;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por código o nombre"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {types.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(prod => (
              <tr
                key={prod.codigo_producto}
                className={styles.row}
                onClick={() => navigate(`/inventario/${prod.codigo_producto}`)}
              >
                <td>
                  <img
                    src={
                      prod.imagen_referencia_producto ||
                      'https://via.placeholder.com/60'
                    }
                    alt={prod.nombre_producto}
                    className={styles.img}
                  />
                </td>
                <td>{prod.codigo_producto}</td>
                <td>{prod.nombre_producto}</td>
                <td>{prod.cantidad_disponible_producto}</td>
                <td>${prod.precio_unidad_producto}</td>
                <td>{prod.tipo_producto}</td>
                <td>{prod.estado_producto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
