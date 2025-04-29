import React, { useState, useEffect } from 'react';
import { useVendedor } from '@context/VendedorContext';
import axios from 'axios';
import { 
  LineChart, BarChart, PieChart, 
  Line, Bar, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis
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
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.error || err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
  
    if (vendedorId) {
      fetchDashboardData();
    }
  }, [vendedorId, baseURL]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) return <div className="loading">Cargando dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  // Componente de gráfica con zoom
  const ChartWithZoom = ({ children }) => {
    const [scale, setScale] = useState(1);
  
    return (
      <div className="zoom-container">
        <div className="zoom-controls">
          <button onClick={() => setScale(s => Math.min(s + 0.1, 3))}>+</button>
          <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}>-</button>
          <button onClick={() => setScale(1)}>Reset</button>
        </div>
        <div 
          className="zoom-content" 
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '100%',
            height: '100%'
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  const CustomizedShape = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={10} 
          fill={payload.estado === 'activo' ? '#4CAF50' : '#F44336'} 
          stroke="#fff" 
          strokeWidth={1}
        />
        <text 
          x={cx} 
          y={cy} 
          dy={4} 
          textAnchor="middle" 
          fill="#fff" 
          fontSize={10}
        >
          {payload.nombre.charAt(0)}
        </text>
      </g>
    );
  };

  return (
    <div className="dashboard-container">
      <h1>Panel de Control</h1>
      
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

      <div className="dashboard-content">
        {activeTab === 'finanzas' && (
          <>
            <div className="dashboard-section">
              <h2>Ingresos vs Gastos</h2>
              <div className="chart-container">
                <ChartWithZoom>
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
                </ChartWithZoom>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Desglose de Gastos</h2>
              <div className="chart-container">
                {data.gastosCategoria && data.gastosCategoria.length > 0 ? (
                  <ChartWithZoom>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={data.gastosCategoria.map(item => ({
                            ...item,
                            valor: Number(item.valor)
                          }))}
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
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Valor']}
                          labelFormatter={(label) => `Categoría: ${label}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartWithZoom>
                ) : (
                  <div className="no-data-message">
                    No hay datos de gastos por categoría disponibles
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Evolución de Ventas</h2>
              <div className="chart-container">
                <ChartWithZoom>
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
                </ChartWithZoom>
              </div>
            </div>
          </>
        )}

        {activeTab === 'productos' && (
          <>
            <div className="dashboard-section">
              <h2>Productos Más Vendidos</h2>
              <div className="chart-container">
                <ChartWithZoom>
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
                </ChartWithZoom>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Productos Mejor Valorados</h2>
              <div className="products-grid">
                {data.productosValorados.slice(0, 5).map((producto, index) => {
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
                <ChartWithZoom>
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
                </ChartWithZoom>
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
                <ChartWithZoom>
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
                </ChartWithZoom>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Impacto de Descuentos</h2>
              <div className="chart-container">
                <ChartWithZoom>
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
                </ChartWithZoom>
              </div>
            </div>
            <div className="dashboard-section">
                <h2>Rendimiento de Portales</h2>
                <div className="chart-container">
                  <ChartWithZoom>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={data.rendimientoPortales}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="nombre" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          stroke="#ff7300" 
                          domain={[0, 100]}
                          label={{ value: 'Tasa (%)', angle: -90, position: 'insideRight' }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'Tasa de conversión') return [`${value}%`, name];
                            if (name === 'Visitas') return [value.toLocaleString(), name];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="visitas" 
                          fill="#8884d8" 
                          name="Visitas"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="pedidos" 
                          fill="#82ca9d" 
                          name="Pedidos"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="tasaConversion" 
                          stroke="#ff7300" 
                          strokeWidth={2}
                          name="Tasa de conversión"
                          dot={{ r: 4 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartWithZoom>
                </div>
                <div className="insights">
                  <h3>Análisis Comparativo:</h3>
                  <ul>
                    <li><strong>Portales con alta tasa de conversión</strong> (línea naranja alta) son eficientes en convertir visitas a ventas</li>
                    <li><strong>Portales con muchas visitas pero pocos pedidos</strong> (barras azules altas pero barras verdes bajas) necesitan optimización</li>
                    <li><strong>Relación ideal</strong>: Barras azules y verdes proporcionales con línea naranja por encima del 50%</li>
                  </ul>
                </div>
              </div>
          </>
        )}

        {activeTab === 'clientes' && (
          <>
            <div className="dashboard-section">
              <h2>Clientes Recurrentes</h2>
              <div className="chart-container">
                {data.clientesRecurrentes && data.clientesRecurrentes.length > 0 ? (
                  <ChartWithZoom>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart 
                        data={data.clientesRecurrentes.map(item => ({
                          ...item,
                          valor_total: Number(item.valor_total),
                          compras: Number(item.compras)
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="nombre" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'valor_total' ? `$${value.toLocaleString()}` : value,
                            name === 'valor_total' ? 'Valor total' : 'Compras'
                          ]}
                          labelFormatter={(label) => `Cliente: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="compras" 
                          fill="#3F51B5" 
                          name="Compras realizadas" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="valor_total" 
                          fill="#009688" 
                          name="Valor total ($)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartWithZoom>
                ) : (
                  <div className="no-data-message">
                    No se encontraron clientes recurrentes
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Valor por Cliente</h2>
              <div className="chart-container">
                {data.clientesRecurrentes && data.clientesRecurrentes.length > 0 ? (
                  <ChartWithZoom>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        layout="vertical"
                        data={data.clientesRecurrentes
                          .map(item => ({
                            ...item,
                            valor_total: Number(item.valor_total)
                          }))
                          .slice(0, 5)
                        }
                        margin={{ left: 100 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="nombre" 
                          type="category" 
                          width={150} 
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Valor generado']}
                          labelFormatter={(label) => `Cliente: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="valor_total" 
                          fill="#FF9800" 
                          name="Valor generado ($)"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartWithZoom>
                ) : (
                  <div className="no-data-message">
                    No se encontraron datos de clientes
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Cumpleaños de Clientes</h2>
              <div className="birthdays-list">
                <h3>Próximos cumpleaños</h3>
                {data.proximosCumpleanos && data.proximosCumpleanos.length > 0 ? (
                  <ul>
                    {data.proximosCumpleanos.map((cliente, index) => (
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
                ) : (
                  <div className="no-data-message">
                    No hay cumpleaños próximos
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;