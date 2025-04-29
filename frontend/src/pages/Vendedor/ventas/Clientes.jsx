// frontend/src/pages/Vendedor/ventas/Estadisticas.jsx
import React, { useState, useEffect } from 'react';
import { useVendedor } from '@/context/VendedorContext';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Estadisticas() {
  const { vendedorId } = useVendedor();

  const [ventas, setVentas] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchVentas() {
      try {
        const res = await fetch('/api/ventas', {
          headers: { 'X-Vendedor-Id': vendedorId }
        });
        const data = await res.json();
        setVentas(data);
      } catch (error) {
        console.error('Error al cargar ventas:', error);
      }
    }
    if (vendedorId) fetchVentas();
  }, [vendedorId]);

  const ventasPorMes = Array(12).fill(0);
  ventas.forEach(v => {
    const fecha = new Date(v.fecha_pedido);
    if (fecha.getFullYear() === parseInt(anioFiltro)) {
      ventasPorMes[fecha.getMonth()] += Number(v.total_pedido);
    }
  });

  const dataVentas = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Ventas ($)',
        data: ventasPorMes,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="container content">
      <h1>Estadísticas de Ventas</h1>

      <div className="filtrosEstadisticas">
        <label>
          Año:
          <select value={anioFiltro} onChange={e => setAnioFiltro(e.target.value)}>
            {[2022, 2023, 2024].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="graficoContainer">
        <Bar data={dataVentas} />
      </div>

      <div className="graficoContainer" style={{ marginTop: '2rem' }}>
        <Line data={dataVentas} />
      </div>
    </div>
  );
}
