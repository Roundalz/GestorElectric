import React, { useState, useEffect } from 'react';
import { usePortalConfig } from '../portal/usePortalConfig.jsx';
import { useVendedor } from '@context/vendedorContext';
import axios from 'axios';
import './styles.css';

const ConfigPortal = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const { vendedorId } = useVendedor();
  
  const { 
    config, 
    temas, 
    loading: loadingConfig, 
    error: errorConfig, 
    updateConfig 
  } = usePortalConfig(vendedorId);

  const [activeTab, setActiveTab] = useState('apariencia');
  const [plan, setPlan] = useState(null);
  const [portalCodigo, setPortalCodigo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const layoutPreviews = {
    grid: `${baseURL}/assets/layout-grid.jpg`,
    list: `${baseURL}/assets/layout-list.jpg`,
    masonry: `${baseURL}/assets/layout-masonry.jpg`
  };

  const stylePreviews = {
    card: `${baseURL}/assets/style-card.jpg`,
    minimal: `${baseURL}/assets/style-minimal.jpg`,
    detailed: `${baseURL}/assets/style-detailed.jpg`
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, configRes] = await Promise.all([
          axios.get(`${baseURL}/api/portales/vendedor/${vendedorId}/plan`),
          axios.get(`${baseURL}/api/portales/${vendedorId}/config`)
        ]);
        
        setPlan(planRes.data?.success ? planRes.data : backupPlan);
        setPortalCodigo(configRes.data?.codigo_portal || 'DEFAULT-001');
        
        // Cargar previsualizaciones de imágenes si existen
        if (configRes.data?.config?.logo_personalizado) {
          setLogoPreview(`${baseURL}/uploads/${configRes.data.config.logo_personalizado}`);
        }
        if (configRes.data?.config?.banner_personalizado) {
          setBannerPreview(`${baseURL}/uploads/${configRes.data.config.banner_personalizado}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (vendedorId) fetchData();
  }, [vendedorId, baseURL]);

  const handleConfigChange = (field, value) => {
    updateConfig({
      ...config,
      [field]: value
    });
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendedorId', vendedorId);
    formData.append('type', type);

    try {
      const response = await axios.post(`${baseURL}/api/portales/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const fieldName = type === 'logo' ? 'logo_personalizado' : 'banner_personalizado';
        handleConfigChange(fieldName, response.data.filePath);
        
        // Actualizar previsualización
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'logo') {
            setLogoPreview(e.target.result);
          } else {
            setBannerPreview(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `${baseURL}/api/portales/portal/config`,
        {
          portal_codigo_portal: portalCodigo,
          ...config
        }
      );
      
      if (response.data.success) {
        alert('Configuración guardada exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig || !config) return <div className="loading">Cargando configuración...</div>;
  if (errorConfig) return <div className="error">{errorConfig}</div>;

  return (
    <div className="config-container">
      {/* Información del plan */}
      <div className="plan-info">
        <h3>{plan?.nombre_plan || 'Plan Básico'}</h3>
        <p>{plan?.descripcion || 'Plan por defecto'}</p>
        <p>Límite de productos: {plan?.max_productos || 50}</p>
      </div>

      {/* Pestañas de configuración */}
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
        >
          Disposición
        </button>
        <button 
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
        >
          Productos
        </button>
        <button 
          className={activeTab === 'branding' ? 'active' : ''}
          onClick={() => setActiveTab('branding')}
        >
          Branding
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="config-content">
        {activeTab === 'apariencia' && (
          <>
            <div className="config-section">
              <h3>Tema del Portal</h3>
              
              <div className="theme-selector">
                {temas.map(tema => (
                  <div 
                    key={tema.codigo_tema}
                    className={`theme-card ${config.tema_seleccionado === tema.nombre_tema ? 'active' : ''}`}
                    onClick={() => handleConfigChange('tema_seleccionado', tema.nombre_tema)}
                  >
                    <div className="theme-preview">
                      <div 
                        className="theme-primary" 
                        style={{ backgroundColor: tema.datos_config.colorPrincipal }}
                      />
                      <div 
                        className="theme-secondary" 
                        style={{ backgroundColor: tema.datos_config.colorSecundario }}
                      />
                    </div>
                    <h4>{tema.nombre_tema}</h4>
                    <p>{tema.descripcion_tema}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="config-section">
              <h3>Colores Personalizados</h3>
              
              <div className="form-group">
                <label>Color principal</label>
                <input
                  type="color"
                  value={config.color_principal}
                  onChange={(e) => handleConfigChange('color_principal', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Color secundario</label>
                <input
                  type="color"
                  value={config.color_secundario}
                  onChange={(e) => handleConfigChange('color_secundario', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Color de fondo</label>
                <input
                  type="color"
                  value={config.color_fondo}
                  onChange={(e) => handleConfigChange('color_fondo', e.target.value)}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>Tipografía</h3>
              
              <div className="form-group">
                <label>Fuente principal</label>
                <select
                  value={config.fuente_principal}
                  onChange={(e) => handleConfigChange('fuente_principal', e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estilo del título</label>
                <input
                  type="text"
                  value={config.estilo_titulo}
                  onChange={(e) => handleConfigChange('estilo_titulo', e.target.value)}
                  placeholder="Ej: bold 24px Arial"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'disposicion' && (
          <>
            <div className="config-section">
              <h3>Disposición de Productos</h3>
              
              <div className="layout-options">
                {Object.entries(layoutPreviews).map(([layout, imgSrc]) => (
                  <div 
                    key={layout}
                    className={`layout-option ${config.disposicion_productos === layout ? 'active' : ''}`}
                    onClick={() => handleConfigChange('disposicion_productos', layout)}
                  >
                    <img src={imgSrc} alt={`Layout ${layout}`} />
                    <span>{layout.charAt(0).toUpperCase() + layout.slice(1)}</span>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Productos por fila</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={config.productos_por_fila}
                  onChange={(e) => handleConfigChange('productos_por_fila', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>Encabezado</h3>
              
              <div className="form-group">
                <label>Estilo del encabezado</label>
                <select
                  value={config.estilo_header}
                  onChange={(e) => handleConfigChange('estilo_header', e.target.value)}
                >
                  <option value="fijo">Fijo (siempre visible)</option>
                  <option value="sticky">Sticky (se pega al hacer scroll)</option>
                  <option value="normal">Normal</option>
                  <option value="minimalista">Minimalista</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  checked={config.mostrar_busqueda}
                  onChange={(e) => handleConfigChange('mostrar_busqueda', e.target.checked)}
                />
                <label>Mostrar barra de búsqueda</label>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  checked={config.mostrar_categorias}
                  onChange={(e) => handleConfigChange('mostrar_categorias', e.target.checked)}
                />
                <label>Mostrar categorías</label>
              </div>
            </div>
          </>
        )}

        {activeTab === 'productos' && (
          <>
            <div className="config-section">
              <h3>Estilo de Productos</h3>
              
              <div className="style-options">
                {Object.entries(stylePreviews).map(([style, imgSrc]) => (
                  <div 
                    key={style}
                    className={`style-option ${config.estilos_productos === style ? 'active' : ''}`}
                    onClick={() => handleConfigChange('estilos_productos', style)}
                  >
                    <img src={imgSrc} alt={`Style ${style}`} />
                    <span>{style.charAt(0).toUpperCase() + style.slice(1)}</span>
                  </div>
                ))}
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  checked={config.mostrar_precios}
                  onChange={(e) => handleConfigChange('mostrar_precios', e.target.checked)}
                />
                <label>Mostrar precios</label>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  checked={config.mostrar_valoraciones}
                  onChange={(e) => handleConfigChange('mostrar_valoraciones', e.target.checked)}
                />
                <label>Mostrar valoraciones</label>
              </div>
            </div>
          </>
        )}

        {activeTab === 'branding' && (
          <>
            <div className="config-section">
              <h3>Logo Personalizado</h3>
              
              <div className="file-upload">
                {logoPreview && (
                  <div className="image-preview">
                    <img src={logoPreview} alt="Logo preview" />
                  </div>
                )}
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'logo')}
                />
                <label htmlFor="logo-upload" className="btn-upload">
                  {logoPreview ? 'Cambiar Logo' : 'Subir Logo'}
                </label>
                <p>Recomendado: 200x200px, formato PNG o JPG</p>
              </div>
            </div>

            <div className="config-section">
              <h3>Banner Personalizado</h3>
              
              <div className="file-upload">
                {bannerPreview && (
                  <div className="image-preview">
                    <img src={bannerPreview} alt="Banner preview" />
                  </div>
                )}
                <input
                  type="file"
                  id="banner-upload"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'banner')}
                />
                <label htmlFor="banner-upload" className="btn-upload">
                  {bannerPreview ? 'Cambiar Banner' : 'Subir Banner'}
                </label>
                <p>Recomendado: 1200x400px, formato JPG o PNG</p>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  checked={config.mostrar_banner}
                  onChange={(e) => handleConfigChange('mostrar_banner', e.target.checked)}
                />
                <label>Mostrar banner en el portal</label>
              </div>
            </div>
          </>
        )}

        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
};

export default ConfigPortal;