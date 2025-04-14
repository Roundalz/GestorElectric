import React, { useState, useEffect } from 'react';
import { useVendedor } from '@context/vendedorContext';
import axios from 'axios';
import { 
  LineChart, BarChart, PieChart, 
  Line, Bar, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import './dashboard.css';

const Dashboard = () => {
  const { vendedorId } = useVendedor();
  const [activeTab, setActiveTab] = useState('finanzas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    ingresosGastos: [],
    ventasMensuales: [],
    topProductos: [],
    productosValorados: [],
    clientesRecurrentes: [],
    conversiones: [],
    gastosCategoria: []
  });
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/api/portales/${vendedorId}/dashboard`);
        setData(response.data);
        console.log('Datos de gastos por categoría:', response.data.gastosCategoria); // <-- Agrega esto
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (vendedorId) {
      fetchDashboardData();
    }
  }, [vendedorId, baseURL]);
  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) return <div className="loading">Cargando dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Panel de Control</h1>
      
      {/* Pestañas del dashboard */}
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'finanzas' ? 'active' : ''}
          onClick={() => setActiveTab('finanzas')}
        >
          Análisis Financiero
        </button>
        <button 
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
        >
          Análisis de Productos
        </button>
        <button 
          className={activeTab === 'rendimiento' ? 'active' : ''}
          onClick={() => setActiveTab('rendimiento')}
        >
          Rendimiento del Portal
        </button>
        <button 
          className={activeTab === 'clientes' ? 'active' : ''}
          onClick={() => setActiveTab('clientes')}
        >
          Análisis de Clientes
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="dashboard-content">
        {activeTab === 'finanzas' && (
          <>
            <div className="dashboard-section">
              <h2>Ingresos vs Gastos</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.ingresosGastos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" stroke="#4CAF50" strokeWidth={2} />
                    <Line type="monotone" dataKey="gastos" stroke="#F44336" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Desglose de Gastos</h2>
              <div className="chart-container">
                {data.gastosCategoria && data.gastosCategoria.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={data.gastosCategoria}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="valor"
                        nameKey="categoria"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.gastosCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data-message">No hay datos de gastos por categoría disponibles</div>
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Evolución de Ventas</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#8884d8" name="Ventas mensuales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'productos' && (
          <>
            <div className="dashboard-section">
              <h2>Productos Más Vendidos</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    layout="vertical"
                    data={data.topProductos.slice(0, 5)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#4CAF50" name="Unidades vendidas" />
                    <Bar dataKey="ingresos" fill="#2196F3" name="Ingresos generados" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Productos Mejor Valorados</h2>
              <div className="products-grid">
                {data.productosValorados.slice(0, 5).map((producto, index) => {
                  // Convierte a número y maneja casos undefined/null
                  const calificacion = Number(producto.calificacion) || 0;
                  
                  return (
                    <div key={index} className="product-card">
                      <h3>{producto.nombre}</h3>
                      <div className="rating">
                        {'★'.repeat(Math.round(calificacion))}
                        {'☆'.repeat(5 - Math.round(calificacion))}
                        <span>({calificacion.toFixed(1)})</span>
                      </div>
                      <p>Veces calificado: {producto.veces_calificado}</p>
                      <p>Ventas: {producto.ventas}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Productos en Favoritos</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.topProductos.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="favoritos" fill="#FF9800" name="Veces agregado a favoritos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'rendimiento' && (
          <>
            <div className="dashboard-section">
              <h2>Conversión: Pedidos vs Favoritos</h2>
              <div className="conversion-metrics">
                <div className="metric-card">
                  <h3>Tasa de Conversión</h3>
                  <p className="big-number">
                    {data.conversiones.tasa_conversion}%
                  </p>
                  <p>De favoritos a compras</p>
                </div>
                <div className="metric-card">
                  <h3>Favoritos</h3>
                  <p className="big-number">
                    {data.conversiones.total_favoritos}
                  </p>
                  <p>Productos en listas de deseos</p>
                </div>
                <div className="metric-card">
                  <h3>Pedidos</h3>
                  <p className="big-number">
                    {data.conversiones.total_pedidos}
                  </p>
                  <p>Realizados este mes</p>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Ticket Promedio</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ticket_promedio" 
                      stroke="#9C27B0" 
                      strokeWidth={2} 
                      name="Ticket promedio ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Impacto de Descuentos</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas_con_descuento" fill="#FF5722" name="Ventas con descuento" />
                    <Bar dataKey="ventas_sin_descuento" fill="#607D8B" name="Ventas sin descuento" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'clientes' && (
          <>
            <div className="dashboard-section">
              <h2>Clientes Recurrentes</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.clientesRecurrentes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="compras" fill="#3F51B5" name="Compras realizadas" />
                    <Bar dataKey="valor_total" fill="#009688" name="Valor total ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Valor por Cliente</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    layout="vertical"
                    data={data.clientesRecurrentes.slice(0, 5)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor_total" fill="#FF9800" name="Valor generado ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Cumpleaños de Clientes</h2>
              <div className="birthdays-list">
                <h3>Próximos cumpleaños</h3>
                <ul>
                  {data.proximosCumpleanos?.map((cliente, index) => (
                    <li key={index}>
                      <span className="client-name">{cliente.nombre}</span>
                      <span className="client-birthday">
                        {new Date(cliente.cumpleanos).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'long'
                        })}
                      </span>
                      <span className="client-email">{cliente.correo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;