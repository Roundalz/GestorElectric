// src/pages/cliente/TiendasPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendedor } from '@context/vendedorContext';
import axios from 'axios';
import './styles/InicioStyles.css';

const Inicio = () => {
  const { vendedorId, setVendedorId } = useVendedor();
  const navigate = useNavigate();
  const [portales, setPortales] = useState([]);

  useEffect(() => {
    const fetchPortales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/portales/activos'); // Ajusta la URL si es necesario
        setPortales(response.data.rows);
      } catch (error) {
        console.error('Error al obtener los portales:', error);
      }
    };

    fetchPortales();
  }, []);

  const handleEntrar = async (codigoPortal, vendedorCodigo) => {
    try {
      await axios.put(`http://localhost:5000/api/portales/${codigoPortal}/visita`);
      setVendedorId(vendedorCodigo);
      navigate(`/cliente/portal/${codigoPortal}`);
    } catch (error) {
      console.error('Error al registrar la visita:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Tiendas Disponibles</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        {portales.map((portal) => (
          <div
            key={portal.codigo_portal}
            style={{
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <p>{portal.codigo_portal}</p>
            <button onClick={() => handleEntrar(portal.codigo_portal, portal.vendedor_codigo_vendedore)}>Entrar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;
