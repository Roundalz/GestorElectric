// src/pages/TiendaDetallePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const productosPorTienda = {
  1: [
    { id: 101, nombre: 'Camisa de lino', precio: 30 },
    { id: 102, nombre: 'Zapatos casuales', precio: 50 },
  ],
  2: [
    { id: 201, nombre: 'Auriculares Bluetooth', precio: 80 },
    { id: 202, nombre: 'Cargador rápido', precio: 25 },
  ],
  3: [
    { id: 301, nombre: 'Vino tinto reserva', precio: 45 },
    { id: 302, nombre: 'Caja de chocolates artesanales', precio: 35 },
  ],
};

const TiendaDetallePage = () => {
  const { id } = useParams();
  const productos = productosPorTienda[id] || [];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Productos de la Tienda {id}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div
              key={producto.id}
              style={{
                width: '250px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <h4>{producto.nombre}</h4>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>No hay productos en esta tienda.</p>
        )}
      </div>
    </div>
  );
};

export default TiendaDetallePage;
