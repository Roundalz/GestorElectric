import React, { useState, useEffect, useContext } from 'react';
import { usePortalConfig } from './usePortalConfig';
import { useVendedor } from '@context/VendedorContext';
import axios from 'axios';
import './styles.css';

const ConfigPortal = () => {
  const { vendedorId } = useVendedor();
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [errorPlan, setErrorPlan] = useState(null);
  const [portalCodigo, setPortalCodigo] = useState(null);
  
  // Debug: Verificar vendedorId
  useEffect(() => {
    console.log('VendedorID desde contexto:', vendedorId);
  }, [vendedorId]);

  const { 
    config, 
    temas, 
    loading: loadingConfig, 
    error: errorConfig, 
    updateConfig 
  } = usePortalConfig(vendedorId);

  const [activeTab, setActiveTab] = useState('apariencia');

  // Obtener información del plan del vendedor y código del portal
  useEffect(() => {
    const fetchVendedorData = async () => {
      try {
        setLoadingPlan(true);
        
        // 1. Obtener plan del vendedor
        const planResponse = await axios.get(`/api/vendedor/${vendedorId}/plan`);
        setPlan(planResponse.data);
        
        // 2. Obtener código del portal
        const portalResponse = await axios.get(`/api/vendedor/${vendedorId}/portal`);
        setPortalCodigo(portalResponse.data.codigo_portal);
        
        setErrorPlan(null);
      } catch (err) {
        console.error('Error al obtener datos del vendedor:', err);
        setErrorPlan(err.message);
      } finally {
        setLoadingPlan(false);
      }
    };

    if (vendedorId) {
      fetchVendedorData();
    }
  }, [vendedorId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    updateConfig({
      ...config,
      [name]: newValue
    });
  };

  const handleThemeChange = (temaId) => {
    const selectedTema = temas.find(t => t.codigo_tema == temaId);
    if (selectedTema) {
      updateConfig({
        ...config,
        tema_seleccionado: selectedTema.nombre_tema,
        color_principal: selectedTema.datos_config.color_principal,
        color_secundario: selectedTema.datos_config.color_secundario,
        color_fondo: selectedTema.datos_config.color_fondo
      });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/portal/config/${portalCodigo}`, config);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const isFeatureAllowed = (feature) => {
    if (!plan) return false;
    
    // Definir qué características permite cada plan
    switch(plan.codigo_plan) {
      case 1: // Plan Básico
        return ['tema_seleccionado', 'mostrar_precios', 'color_principal', 'color_secundario'].includes(feature);
      case 2: // Plan Estándar
        return ['tema_seleccionado', 'mostrar_precios', 'disposicion_productos', 
                'productos_por_fila', 'mostrar_valoraciones', 'color_principal', 
                'color_secundario', 'color_fondo'].includes(feature);
      case 3: // Plan Premium
        return true; // Todos los features permitidos
      default:
        return false;
    }
  };

  const renderFeatureLock = (feature) => {
    if (!isFeatureAllowed(feature)) {
      return (
        <div className="feature-lock">
          <span className="lock-icon">🔒</span>
          <span className="upgrade-text">Disponible en {plan.codigo_plan === 1 ? 'Plan Estándar o Premium' : 'Plan Premium'}</span>
        </div>
      );
    }
    return null;
  };

  if (loadingConfig || loadingPlan) {
    return <div className="loading">Cargando configuración del portal...</div>;
  }

  if (errorConfig || errorPlan) {
    return (
      <div className="error">
        Error: {errorConfig?.message || errorPlan || 'Error al cargar la configuración'}
        <br />
        VendedorID: {vendedorId}
      </div>
    );
  }

  if (!config || !plan) {
    return (
      <div className="error">
        No se pudo cargar la configuración del portal
        <br />
        VendedorID: {vendedorId}
      </div>
    );
  }

  return (
    <div className="config-container">
      <div className="plan-info">
        <h3>Plan Actual: {plan.nombre_plan}</h3>
        <p>{plan.descripcion}</p>
        <p>Límite de productos: {plan.max_productos}</p>
        <p>Portal ID: {portalCodigo}</p>
      </div>

      <div className="config-tabs">
        <button 
          className={activeTab === 'apariencia' ? 'active' : ''}
          onClick={() => setActiveTab('apariencia')}
        >
          Apariencia
        </button>
        <button 
          className={activeTab === 'disposicion' ? 'active' : ''}
          onClick={() => setActiveTab('disposicion')}
          disabled={!isFeatureAllowed('disposicion_productos')}
        >
          Disposición {!isFeatureAllowed('disposicion_productos') && '🔒'}
        </button>
        <button 
          className={activeTab === 'contenido' ? 'active' : ''}
          onClick={() => setActiveTab('contenido')}
        >
          Contenido
        </button>
        <button 
          className={activeTab === 'avanzado' ? 'active' : ''}
          onClick={() => setActiveTab('avanzado')}
          disabled={!isFeatureAllowed('mostrar_banner')}
        >
          Avanzado {!isFeatureAllowed('mostrar_banner') && '🔒'}
        </button>
      </div>

      <div className="config-content">
        {activeTab === 'apariencia' && (
          <>
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
                      backgroundColor: tema.datos_config.color_fondo,
                      borderColor: tema.datos_config.color_principal
                    }}>
                      <div className="theme-primary" style={{ 
                        backgroundColor: tema.datos_config.color_principal 
                      }}></div>
                      <div className="theme-secondary" style={{ 
                        backgroundColor: tema.datos_config.color_secundario 
                      }}></div>
                    </div>
                    <h4>{tema.nombre_tema}</h4>
                    <p>{tema.descripcion_tema}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="config-section">
              <h3>Personalización de Colores</h3>
              
              {renderFeatureLock('color_principal')}
              <div className={`form-group ${!isFeatureAllowed('color_principal') ? 'disabled' : ''}`}>
                <label>Color Principal:</label>
                <input
                  type="color"
                  name="color_principal"
                  value={config.color_principal || '#4F46E5'}
                  onChange={handleChange}
                  disabled={!isFeatureAllowed('color_principal')}
                />
              </div>

              {renderFeatureLock('color_secundario')}
              <div className={`form-group ${!isFeatureAllowed('color_secundario') ? 'disabled' : ''}`}>
                <label>Color Secundario:</label>
                <input
                  type="color"
                  name="color_secundario"
                  value={config.color_secundario || '#10B981'}
                  onChange={handleChange}
                  disabled={!isFeatureAllowed('color_secundario')}
                />
              </div>

              {renderFeatureLock('color_fondo')}
              <div className={`form-group ${!isFeatureAllowed('color_fondo') ? 'disabled' : ''}`}>
                <label>Color de Fondo:</label>
                <input
                  type="color"
                  name="color_fondo"
                  value={config.color_fondo || '#FFFFFF'}
                  onChange={handleChange}
                  disabled={!isFeatureAllowed('color_fondo')}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'disposicion' && (
          <div className="config-section">
            <h3>Disposición de Productos</h3>
            
            {renderFeatureLock('disposicion_productos')}
            <div className={`form-group ${!isFeatureAllowed('disposicion_productos') ? 'disabled' : ''}`}>
              <label>Disposición:</label>
              <select
                name="disposicion_productos"
                value={config.disposicion_productos || 'grid'}
                onChange={handleChange}
                disabled={!isFeatureAllowed('disposicion_productos')}
              >
                <option value="grid">Grid</option>
                <option value="list">Lista</option>
                <option value="carousel">Carrusel</option>
              </select>
            </div>

            {renderFeatureLock('productos_por_fila')}
            <div className={`form-group ${!isFeatureAllowed('productos_por_fila') ? 'disabled' : ''}`}>
              <label>Productos por Fila:</label>
              <input
                type="number"
                name="productos_por_fila"
                min="1"
                max="6"
                value={config.productos_por_fila || 3}
                onChange={handleChange}
                disabled={!isFeatureAllowed('productos_por_fila')}
              />
            </div>

            {renderFeatureLock('estilos_productos')}
            <div className={`form-group ${!isFeatureAllowed('estilos_productos') ? 'disabled' : ''}`}>
              <label>Estilo de Productos:</label>
              <select
                name="estilos_productos"
                value={config.estilos_productos || 'tarjeta'}
                onChange={handleChange}
                disabled={!isFeatureAllowed('estilos_productos')}
              >
                <option value="tarjeta">Tarjeta</option>
                <option value="minimalista">Minimalista</option>
                <option value="detallado">Detallado</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'contenido' && (
          <div className="config-section">
            <h3>Configuración de Contenido</h3>
            
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="mostrar_precios"
                  checked={config.mostrar_precios || false}
                  onChange={handleChange}
                />
                Mostrar Precios
              </label>
            </div>

            {renderFeatureLock('mostrar_valoraciones')}
            <div className={`form-group checkbox ${!isFeatureAllowed('mostrar_valoraciones') ? 'disabled' : ''}`}>
              <label>
                <input
                  type="checkbox"
                  name="mostrar_valoraciones"
                  checked={config.mostrar_valoraciones || false}
                  onChange={handleChange}
                  disabled={!isFeatureAllowed('mostrar_valoraciones')}
                />
                Mostrar Valoraciones
              </label>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="mostrar_categorias"
                  checked={config.mostrar_categorias || false}
                  onChange={handleChange}
                />
                Mostrar Categorías
              </label>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="mostrar_busqueda"
                  checked={config.mostrar_busqueda || false}
                  onChange={handleChange}
                />
                Mostrar Barra de Búsqueda
              </label>
            </div>
          </div>
        )}

        {activeTab === 'avanzado' && (
          <div className="config-section">
            <h3>Configuración Avanzada</h3>
            
            {renderFeatureLock('mostrar_banner')}
            <div className={`form-group checkbox ${!isFeatureAllowed('mostrar_banner') ? 'disabled' : ''}`}>
              <label>
                <input
                  type="checkbox"
                  name="mostrar_banner"
                  checked={config.mostrar_banner || false}
                  onChange={handleChange}
                  disabled={!isFeatureAllowed('mostrar_banner')}
                />
                Mostrar Banner
              </label>
            </div>

            {renderFeatureLock('banner_personalizado')}
            <div className={`form-group ${!isFeatureAllowed('banner_personalizado') ? 'disabled' : ''}`}>
              <label>URL del Banner Personalizado:</label>
              <input
                type="text"
                name="banner_personalizado"
                value={config.banner_personalizado || ''}
                onChange={handleChange}
                disabled={!isFeatureAllowed('banner_personalizado')}
                placeholder="https://ejemplo.com/banner.jpg"
              />
            </div>

            {renderFeatureLock('logo_personalizado')}
            <div className={`form-group ${!isFeatureAllowed('logo_personalizado') ? 'disabled' : ''}`}>
              <label>URL del Logo Personalizado:</label>
              <input
                type="text"
                name="logo_personalizado"
                value={config.logo_personalizado || ''}
                onChange={handleChange}
                disabled={!isFeatureAllowed('logo_personalizado')}
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>

            {renderFeatureLock('fuente_principal')}
            <div className={`form-group ${!isFeatureAllowed('fuente_principal') ? 'disabled' : ''}`}>
              <label>Fuente Principal:</label>
              <select
                name="fuente_principal"
                value={config.fuente_principal || 'Roboto'}
                onChange={handleChange}
                disabled={!isFeatureAllowed('fuente_principal')}
              >
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="config-actions">
        <button className="btn-save" onClick={handleSave}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ConfigPortal;