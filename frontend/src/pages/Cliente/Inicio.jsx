// src/pages/TiendasPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/InicioStyles.css';

const tiendasData = [
  { id: 1, nombre: 'Tienda Uno', descripcion: 'Ropa y accesorios de moda.' },
  { id: 2, nombre: 'Tienda Dos', descripcion: 'Electrónica y gadgets.' },
  { id: 3, nombre: 'Tienda Tres', descripcion: 'Alimentos y bebidas gourmet.' },
];

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Tiendas Disponibles</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        {tiendasData.map((tienda) => (
          <div
            key={tienda.id}
            style={{
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3>{tienda.nombre}</h3>
            <p>{tienda.descripcion}</p>
            <button onClick={() => navigate(`/cliente/portal/${tienda.id}`)}>Entrar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;
