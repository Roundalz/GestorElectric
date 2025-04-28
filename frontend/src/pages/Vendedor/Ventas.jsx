import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, BarChart2, Users, FileSpreadsheet } from 'lucide-react';
import styles from './Ventas.module.css';

const API_BASE = 'http://localhost:5000/api/ventas';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}`)
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error('Error al obtener ventas:', err));
  }, []);

  const handleExportExcel = () => {
    window.location.href = `${API_BASE}/export`;
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <button className={`${styles.tab} ${styles.active}`}>
          <List size={16} /> Lista de ventas
        </button>
        <button className={styles.tab} onClick={() => alert('Estadísticas - No implementado')}>          
          <BarChart2 size={16} /> Estadísticas
        </button>
        <button className={styles.tab} onClick={() => alert('Clientes - No implementado')}>
          <Users size={16} /> Clientes
        </button>
        <button className={styles.button} onClick={handleExportExcel}>
          <FileSpreadsheet size={16} /> Exportar Excel
        </button>
      </nav>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha de Venta</th>
              <th>Cliente</th>
              <th>Estado Venta</th>
              <th>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.empty}>
                  No hay ventas registradas.
                </td>
              </tr>
            ) : (
              ventas.map(v => (
                <tr
                  key={v.codigo_pedido}
                  className={styles.row}
                  onClick={() => navigate(`/ventas/${v.codigo_pedido}`)}
                >
                  <td>{v.fecha_pedido}</td>
                  <td>{v.nombre_cliente || 'N/A'}</td>
                  <td>{v.estado_pedido}</td>
                  <td>${v.total_pedido}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
