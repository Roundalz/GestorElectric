// frontend/src/pages/Vendedor/ventas/Ventas.jsx
import React, { useState, useEffect } from 'react';
import { useVendedor } from '@/context/VendedorContext';
import { useNavigate } from 'react-router-dom';
import Estadisticas from './Estadisticas';
import Clientes from './Clientes';

export default function Ventas() {
  const { vendedorId } = useVendedor();
  const navigate = useNavigate();

  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [tabActivo, setTabActivo] = useState('ventas');

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    async function fetchVentas() {
      try {
        const res = await fetch(`${API_URL}/api/ventas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Vendedor-Id': vendedorId,
          },
        });
        const data = await res.json();
        setVentas(data);
      } catch (error) {
        console.error('Error al cargar ventas:', error);
      }
    }
    if (vendedorId) fetchVentas();
  }, [vendedorId]);

  const ventasFiltradas = ventas.filter(v =>
    (v.codigo_pedido.toString().includes(filtro) || v.nombre_cliente?.toLowerCase().includes(filtro.toLowerCase())) &&
    (filtroEstado ? v.estado_pedido === filtroEstado : true)
  );

  const handleRowClick = (id) => {
    navigate(`/vendedor/ventas/${id}`);
  };

  return (
    <div className="container content">
      <h1>Ventas</h1>

      <div className="flex" style={{ marginBottom: '1rem' }}>
        <button onClick={() => setTabActivo('ventas')} className={tabActivo === 'ventas' ? 'tabActivo' : ''}>Ventas</button>
        <button onClick={() => setTabActivo('estadisticas')} className={tabActivo === 'estadisticas' ? 'tabActivo' : ''}>Estadísticas</button>
        <button onClick={() => setTabActivo('clientes')} className={tabActivo === 'clientes' ? 'tabActivo' : ''}>Clientes</button>
      </div>

      {tabActivo === 'ventas' && (
        <>
          <div className="flex" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Buscar por código o cliente"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            />

            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              style={{ padding: '0.5rem' }}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="COMPLETADO">Completado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="ventasTabla">
            <div className="ventasHeader">
              <span>Código</span>
              <span>Cliente</span>
              <span>Fecha</span>
              <span>Total</span>
              <span>Estado</span>
            </div>

            {ventasFiltradas.map(venta => (
              <div key={venta.codigo_pedido} className="ventasRow" onClick={() => handleRowClick(venta.codigo_pedido)}>
                <span>{venta.codigo_pedido}</span>
                <span>{venta.nombre_cliente}</span>
                <span>{new Date(venta.fecha_pedido).toLocaleDateString()}</span>
                <span>${venta.total_pedido}</span>
                <span>{venta.estado_pedido}</span>
              </div>
            ))}

            {ventasFiltradas.length === 0 && (
              <p style={{ marginTop: '1rem' }}>No se encontraron ventas.</p>
            )}
          </div>
        </>
      )}

      {tabActivo === 'estadisticas' && <Estadisticas />}
      {tabActivo === 'clientes' && <Clientes />}
    </div>
  );
}
