import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './HistoricoConfiguracion.css';

const HistoricoConfiguracion = ({ portalCodigo, vendedorId }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fechaDesde: '',
    fechaHasta: '',
    campo: '',
    usuario: ''
  });
  const [expandedRows, setExpandedRows] = useState({});

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/portales/historico/${portalCodigo}`, {
        params: { vendedorId }
      });
      
      console.log('API Response:', response.data);
      
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }

      const formattedData = response.data.map(item => {
        // Verificación profunda de campos_cambiados
        let cambios = {};
        if (typeof item.campos_cambiados === 'string') {
          try {
            cambios = JSON.parse(item.campos_cambiados);
          } catch (e) {
            console.error('Error parsing campos_cambiados:', e);
            cambios = {};
          }
        } else if (item.campos_cambiados && typeof item.campos_cambiados === 'object') {
          cambios = item.campos_cambiados;
        }
        
        return {
          ...item,
          campos_cambiados: cambios
        };
      });
      
      setHistorico(formattedData);
    } catch (err) {
      console.error('Error al obtener el histórico:', {
        message: err.message,
        response: err.response?.data
      });
      setError(err.response?.data?.error || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (portalCodigo) {
      fetchHistorico();
    }
  }, [portalCodigo, vendedorId]);

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    return historico.filter(item => {
      const fechaCambio = new Date(item.fecha_cambio);
      const cumpleFechaDesde = !filters.fechaDesde || fechaCambio >= new Date(filters.fechaDesde);
      const cumpleFechaHasta = !filters.fechaHasta || fechaCambio <= new Date(filters.fechaHasta + 'T23:59:59');
      const cumpleCampo = !filters.campo || 
        Object.keys(item.campos_cambiados || {}).some(key => 
          key.toLowerCase().includes(filters.campo.toLowerCase())
        );
      const cumpleUsuario = !filters.usuario || 
        (item.vendedor_nombre && item.vendedor_nombre.toLowerCase().includes(filters.usuario.toLowerCase()));
      
      return cumpleFechaDesde && cumpleFechaHasta && cumpleCampo && cumpleUsuario;
    });
  };

  const exportToPDF = () => {
    const filteredData = applyFilters();
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Histórico Detallado de Configuraciones', 14, 15);
    
    // Preparar datos para la tabla
    const tableData = filteredData.flatMap(item => {
      const baseInfo = [
        new Date(item.fecha_cambio).toLocaleString(),
        item.vendedor_nombre || 'Desconocido'
      ];
      
      return Object.entries(item.campos_cambiados).map(([field, {old, new: nuevo}]) => [
        ...baseInfo,
        field.replace(/_/g, ' '),
        String(old),
        String(nuevo)
      ]);
    });
  
    autoTable(doc, {
      startY: 25,
      head: [['Fecha', 'Usuario', 'Campo', 'Valor anterior', 'Valor nuevo']],
      body: tableData,
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 45 },
        4: { cellWidth: 45 }
      },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    doc.save(`historico_detallado_${portalCodigo}.pdf`);
  };

  const filteredData = applyFilters();

  if (loading) return <div className="loading">Cargando histórico...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="historico-container">
      <div className="filtros-container">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div className="form-group">
              <label htmlFor="fechaDesde">Fecha desde:</label>
              <input
                id="fechaDesde"
                type="date"
                name="fechaDesde"
                value={filters.fechaDesde}
                onChange={handleFilterChange}
              />
            </div>
          <div className="form-group">
            <label htmlFor='fechaHasta'>Fecha hasta:</label>
            <input
              id='fechaHasta'
              type="date"
              name="fechaHasta"
              value={filters.fechaHasta}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor='campo'>Campo:</label>
            <input
              id='campo'
              type="text"
              name="campo"
              placeholder="Buscar por campo"
              value={filters.campo}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor='usuario'>Usuario:</label>
            <input
              id='usuario'
              type="text"
              name="usuario"
              placeholder="Buscar por usuario"
              value={filters.usuario}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="acciones-container">
        <button 
          onClick={exportToPDF} 
          className="btn-export"
          disabled={filteredData.length === 0}
        >
          Exportar a PDF
        </button>
        <span className="resultados-count">
          Mostrando {filteredData.length} de {historico.length} registros
        </span>
      </div>

      <div className="historico-table-container">
        <table className="historico-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Campos modificados</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <React.Fragment key={item.codigo_historial}>
                  <tr>
                    <td>{new Date(item.fecha_cambio).toLocaleString()}</td>
                    <td>{item.vendedor_nombre || 'Desconocido'}</td>
                    <td>
                      {Object.keys(item.campos_cambiados || {}).join(', ')}
                    </td>
                    <td>
                      <button 
                        className="btn-expand"
                        onClick={() => toggleRowExpand(item.codigo_historial)}
                      >
                        {expandedRows[item.codigo_historial] ? '▲' : '▼'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[item.codigo_historial] && (
                    <tr className="expanded-row">
                      <td colSpan="4">
                        <div className="changes-details">
                          {Object.entries(item.campos_cambiados || {}).map(([field, changes]) => (
                            <div key={field} className="change-item">
                              <h4>{field}</h4>
                              <div className="change-values">
                                <div className="change-old">
                                  <span className="change-label">Antes:</span>
                                  <pre>{JSON.stringify(changes.old, null, 2)}</pre>
                                </div>
                                <div className="change-new">
                                  <span className="change-label">Después:</span>
                                  <pre>{JSON.stringify(changes.new, null, 2)}</pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  No se encontraron registros con los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoConfiguracion;