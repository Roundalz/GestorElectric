import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { usePortalConfig } from './usePortalConfig';
import { VendedorContext } from '@context/VendedorContext';
import './styles.css';

const ConfigPortal = () => {
  const { vendedorId } = useContext(VendedorContext);
  console.log("vendedorId desde contexto:", vendedorId);
  const { config, temas, loading, error, updateConfig } = usePortalConfig(vendedorId);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleThemeChange = (temaId) => {
    const selectedTema = temas.find(t => t.codigo_tema == temaId);
    if (selectedTema) {
      updateConfig({
        ...config,
        tema_seleccionado: selectedTema.nombre_tema,
        color_principal: selectedTema.datos_config.colorPrincipal,
        color_secundario: selectedTema.datos_config.colorSecundario,
        color_fondo: selectedTema.datos_config.colorFondo
      });
    }
  };

  if (loading) return <div className="loading">Cargando configuración...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="config-container">
      <h2>Configuración del Portal</h2>
      
      <div className="config-section">
        <h3>Selección de Tema</h3>
        <div className="theme-selector">
          {temas.map(tema => (
            <div 
              key={tema.codigo_tema}
              className={`theme-card ${config.tema_seleccionado === tema.nombre_tema ? 'active' : ''}`}
              onClick={() => handleThemeChange(tema.codigo_tema)}
            >
              <div className="theme-preview" style={{
                backgroundColor: tema.datos_config.colorFondo,
                borderColor: tema.datos_config.colorPrincipal
              }}>
                <div className="theme-primary" style={{ backgroundColor: tema.datos_config.colorPrimary }}></div>
                <div className="theme-secondary" style={{ backgroundColor: tema.datos_config.colorSecondary }}></div>
              </div>
              <h4>{tema.nombre_tema}</h4>
              <p>{tema.descripcion_tema}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h3>Personalización Avanzada</h3>
        <div className="form-group">
          <label>Color Principal:</label>
          <input
            type="color"
            name="color_principal"
            value={config.color_principal}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Disposición de Productos:</label>
          <select
            name="disposicion_productos"
            value={config.disposicion_productos}
            onChange={handleChange}
          >
            <option value="grid">Grid</option>
            <option value="list">Lista</option>
            <option value="carousel">Carrusel</option>
          </select>
        </div>

        <div className="form-group">
          <label>Productos por Fila:</label>
          <input
            type="number"
            name="productos_por_fila"
            min="1"
            max="6"
            value={config.productos_por_fila}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="mostrar_precios"
              checked={config.mostrar_precios}
              onChange={handleChange}
            />
            Mostrar Precios
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>CSS Personalizado</h3>
        <textarea
          name="css_personalizado"
          value={config.css_personalizado || ''}
          onChange={handleChange}
          placeholder=".product-card { border-radius: 10px; }"
        />
      </div>
    </div>
  );
};

export default ConfigPortal;