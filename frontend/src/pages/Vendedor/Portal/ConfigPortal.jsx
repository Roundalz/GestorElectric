import React, { useState, useEffect } from 'react';
import { usePortalConfig } from '../portal/usePortalConfig.jsx';
import { useVendedor } from '@context/vendedorContext';
import axios from 'axios';
import './styles.css';
import HistoricoConfiguracion from '../portal/HistoricoConfiguracion.jsx'
// Primero definimos las características base para cada plan
const plan1Features = [
  'color_principal', 'color_secundario', 'color_fondo', 
  'fuente_principal', 'disposicion_productos', 'productos_por_fila',
  'estilo_titulo', 'mostrar_banner', 'logo_personalizado', 'banner_personalizado'
];

const plan2Features = [
  ...plan1Features,
  'mostrar_precios', 'mostrar_valoraciones', 'estilo_header',
  'mostrar_busqueda', 'mostrar_categorias', 'estilos_productos',
  'estilos_botones', 'efecto_hover_productos', 'opciones_filtrados',
  'mostrar_boton_whatsapp', 'whatsapp_numero'
];

const plan3Features = [
  ...plan2Features,
  'mostrar_ofertas', 'mostrar_instragram_feed', 'instagram_link',
  'opciones_avanzadas'
];

const plan4Features = [
  ...plan3Features,
  'scripts_personalizados',
  'metodos_pago'
];

// Configuración por defecto extendida con todas las opciones
const DEFAULT_CONFIG = {
  // Campos de apariencia
  estilo_titulo: 'bold 24px Arial',
  color_principal: '#4F46E5',
  color_secundario: '#7C3AED',
  color_fondo: '#FFFFFF',
  fuente_principal: 'Arial',
  
  // Campos de disposición
  disposicion_productos: 'grid',
  productos_por_fila: 3,
  estilo_header: 'normal',
  mostrar_busqueda: true,
  mostrar_categorias: true,
  
  // Campos de productos
  estilos_productos: 'card',
  mostrar_precios: true,
  mostrar_valoraciones: true,
  efecto_hover_productos: 'sombra',
  opciones_filtrados: { precio: false, categorias: false },
  mostrar_ofertas: false,
  
  // Campos de branding
  mostrar_banner: true,
  logo_personalizado: '',
  banner_personalizado: '',
  estilos_botones: 'redondeado',
  
  // Campos de integraciones
  mostrar_boton_whatsapp: false,
  whatsapp_numero: 0,
  mostrar_instragram_feed: false,
  instagram_link: '',
  
  // Campos avanzados
  opciones_avanzadas: {},
  scripts_personalizados: '',
  
  // Campo de fecha (no editable)
  fecha_actualizacion: new Date().toISOString()
};

// Definición de características por plan
const PLAN_FEATURES = {
  1: { // Plan Gratis
    allowed: plan1Features,
    lockedMessage: 'Esta característica no está disponible en tu plan actual. Actualiza para desbloquear más opciones.'
  },
  2: { // Plan Básico
    allowed: plan2Features,
    lockedMessage: 'Actualiza al Plan Estándar o superior para desbloquear esta característica.'
  },
  3: { // Plan Estándar
    allowed: plan3Features,
    lockedMessage: 'Actualiza al Plan Estándar Plus o Premium para desbloquear esta característica.'
  },
  4: { // Plan Estándar Plus
    allowed: plan4Features,
    lockedMessage: 'Actualiza al Plan Premium para desbloquear características avanzadas.'
  },
  5: { // Plan Premium
    allowed: Object.keys(DEFAULT_CONFIG),
    lockedMessage: ''
  }
};

const ConfigPortal = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const { vendedorId } = useVendedor();
  
  const { 
    config, 
    loading: loadingConfig, 
    error: errorConfig, 
    updateConfig,
    portalCodigo,
    plan,
    isReady 
  } = usePortalConfig(vendedorId);
  
  const [localConfig, setLocalConfig] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('apariencia');
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const uploadImgToImgbb = async (file) => {
    const key = import.meta.env.VITE_IMGBB_KEY;
    if (!key) throw new Error("Falta VITE_IMGBB_KEY en .env");
    const form = new FormData();
    form.append("image", file);
    form.append("name", file.name.split(".")[0]);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body: form
    });
    const data = await res.json();
    if (!data.success) throw new Error("Upload failed");
    return data.data.url; // Retorna la URL directa de ImgBB
  };
  
  const handleFileUpload = async (file, type) => {
    try {
      setUploading(type);
      const url = await uploadImgToImgbb(file);
      
      // Actualizar el estado local primero para feedback inmediato
      const updates = {
        [`${type}_personalizado`]: url
      };
      setLocalConfig(prev => ({ ...prev, ...updates }));
      
      // Enviar al backend
      const response = await axios.put(
        `${baseURL}/api/portales/${vendedorId}/config`,
        {
          portal_codigo_portal: portalCodigo,
          changes: updates,
          vendedorId
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.error || 'Error al actualizar la configuración');
      }
  
      // Actualizar también el vendedor si es necesario
      await axios.put(`${baseURL}/api/vendedores/${vendedorId}`, {
        [`${type === 'logo' ? 'logo_empresa' : 'banner_empresa'}`]: url
      });
  
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      // Revertir cambios en caso de error
      setLocalConfig(prev => ({
        ...prev,
        [`${type}_personalizado`]: config?.[`${type}_personalizado`] || ''
      }));
      throw error;
    } finally {
      setUploading(null);
    }
  };



  useEffect(() => {
    if (config && portalCodigo) {  // Añadida verificación de portalCodigo
      setLocalConfig(prev => ({
        ...DEFAULT_CONFIG,
        ...config
      }));
      setInitialLoadComplete(true);
      
      if (config.logo_personalizado) {
        const logoUrl = isValidUrl(config.logo_personalizado) 
          ? config.logo_personalizado 
          : `${baseURL}/uploads/${config.logo_personalizado}`;
        setLogoPreview(logoUrl);
      }
      
      if (config.banner_personalizado) {
        const bannerUrl = isValidUrl(config.banner_personalizado)
          ? config.banner_personalizado
          : `${baseURL}/uploads/${config.banner_personalizado}`;
        setBannerPreview(bannerUrl);
      }
    }
  }, [config, portalCodigo, baseURL]);  // Añadido portalCodigo como dependencia
  
  // Función auxiliar para validar URLs
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  const handleConfigChange = (field, value) => {
    setLocalConfig({
      ...localConfig,
      [field]: value
    });
  };

  const isSaveDisabled = saving || !initialLoadComplete;




  const handleSave = async () => {
    if (!portalCodigo) {
      console.error('portalCodigo no definido');
      alert('El portal aún no está listo para guardar cambios. Por favor espera un momento.');
      return;
    }
  
    setSaving(true);
    try {
      const changes = {};
      Object.keys(localConfig).forEach(key => {
        if (JSON.stringify(config[key]) !== JSON.stringify(localConfig[key])) {
          changes[key] = localConfig[key];
        }
      });
  
      if (Object.keys(changes).length === 0) {
        alert('No hay cambios para guardar');
        return;
      }
  
      // Usamos directamente portalCodigo del hook usePortalConfig
      const response = await axios.put(
        `${baseURL}/api/portales/${vendedorId}/config`,
        {
          portal_codigo_portal: portalCodigo,
          changes,
          vendedorId
        }
      );
  
      if (response.data.success) {
        alert('Configuración guardada exitosamente');
        // Actualizar el estado local con los cambios
        setLocalConfig(prev => ({ ...prev, ...changes }));
      } else {
        throw new Error(response.data.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };


  // Función para verificar si una característica está permitida en el plan actual
  const isFeatureAllowed = (featureName) => {
    if (!plan?.codigo_plan) return false;
    return PLAN_FEATURES[plan.codigo_plan]?.allowed.includes(featureName) || false;
  };

  // Componente para mostrar cuando una característica está bloqueada
  const FeatureLocked = ({ message }) => (
    <div className="feature-lock">
      <span className="lock-icon">🔒</span>
      <span className="upgrade-text">{message}</span>
    </div>
  );

      // Validaciones unificadas - colocar justo antes del return principal
    if (loadingConfig || !isReady) {
      return <div className="loading">Cargando configuración...</div>;
    }

    if (errorConfig) {
      return <div className="error">{errorConfig}</div>;
    }

    if (!config || !portalCodigo) {
      return <div className="error">No se pudo cargar la configuración del portal</div>;
    }
  return (
    <div className="config-container">
      {/* Información del plan */}
      <div className="plan-info">
        <h3>{plan?.nombre_plan || 'Plan no asignado'}</h3>
        <p>{plan?.descripcion || 'No se pudo cargar la información del plan'}</p>
        <p>Límite de productos: {plan?.max_productos || 'No definido'}</p>
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
          disabled={!isFeatureAllowed('disposicion_productos')}
        >
          Disposición
        </button>
        <button 
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
          disabled={!isFeatureAllowed('estilos_productos')}
        >
          Productos
        </button>
        <button 
          className={activeTab === 'branding' ? 'active' : ''}
          onClick={() => setActiveTab('branding')}
          disabled={!isFeatureAllowed('logo_personalizado')}
        >
          Branding
        </button>
        <button 
          className={activeTab === 'integraciones' ? 'active' : ''}
          onClick={() => setActiveTab('integraciones')}
          disabled={!isFeatureAllowed('mostrar_boton_whatsapp')}
        >
          Integraciones
        </button>
        <button 
          className={activeTab === 'avanzado' ? 'active' : ''}
          onClick={() => setActiveTab('avanzado')}
          disabled={!isFeatureAllowed('scripts_personalizados')}
        >
          Avanzado
        </button>
        <button 
          className={activeTab === 'historico' ? 'active' : ''}
          onClick={() => setActiveTab('historico')}
        >
          Histórico
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="config-content">
        {activeTab === 'apariencia' && (
          <>
            <div className="config-section">
              <h3>Colores Personalizados</h3>
              
              <div className="form-group">
                <label htmlFor="color-principal">Color principal</label>
                <input
                  type="color"
                  id="color-principal"
                  name="color_principal"
                  value={localConfig.color_principal || '#4F46E5'}
                  onChange={(e) => handleConfigChange('color_principal', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="color-secundario">Color secundario</label>
                <input
                  type="color"
                  id="color-secundario"
                  name="color_secundario"
                  value={localConfig.color_secundario}
                  onChange={(e) => handleConfigChange('color_secundario', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="color-fondo">Color de fondo</label>
                <input
                  type="color"
                  id="color-fondo"
                  name="color_fondo"
                  value={localConfig.color_fondo}
                  onChange={(e) => handleConfigChange('color_fondo', e.target.value)}
                />
              </div>
            </div>

            <div className="config-section">
              <h3>Tipografía</h3>
              
              <div className="form-group">
                <label htmlFor="fuente-principal">Fuente principal</label>
                <select
                  id="fuente-principal"
                  name="fuente_principal"
                  value={localConfig.fuente_principal || 'Arial'}
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
                <label htmlFor="estilo-titulo">Estilo del título</label>
                <input
                  type="text"
                  id="estilo-titulo"
                  name="estilo_titulo"
                  value={localConfig.estilo_titulo}
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
              
              {!isFeatureAllowed('disposicion_productos') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="layout-options">
                    {['grid', 'list', 'masonry'].map((layout) => (
                      <div 
                        key={layout}
                        className={`layout-option ${localConfig.disposicion_productos === layout ? 'active' : ''}`}
                        onClick={() => handleConfigChange('disposicion_productos', layout)}
                      >
                        <div className={`layout-preview ${layout}`}>
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="product-box"></div>
                          ))}
                        </div>
                        <span>{layout.charAt(0).toUpperCase() + layout.slice(1)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label htmlFor="productos-por-fila">Productos por fila</label>
                    <input
                      type="number"
                      id="productos-por-fila"
                      name="productos_por_fila"
                      min="1"
                      max="6"
                      value={localConfig.productos_por_fila || 3}
                      onChange={(e) => handleConfigChange('productos_por_fila', parseInt(e.target.value, 10))}
                      />
                  </div>
                </>
              )}
            </div>

            <div className="config-section">
              <h3>Encabezado</h3>
              
              {!isFeatureAllowed('estilo_header') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="estilo-header">Estilo del encabezado</label>
                    <select
                      id="estilo-header"
                      name="estilo_header"
                      value={localConfig.estilo_header}
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
                      id="mostrar-busqueda"
                      name="mostrar_busqueda"
                      checked={localConfig.mostrar_busqueda}
                      onChange={(e) => handleConfigChange('mostrar_busqueda', e.target.checked)}
                    />
                    <label htmlFor="mostrar-busqueda">Mostrar barra de búsqueda</label>
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="mostrar-categorias"
                      name="mostrar_categorias"
                      checked={!!localConfig.mostrar_categorias}
                      onChange={(e) => handleConfigChange('mostrar_categorias', e.target.checked)}
                    />
                    <label htmlFor="mostrar-categorias">Mostrar categorías</label>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'productos' && (
          <>
            <div className="config-section">
              <h3>Estilo de Productos</h3>
              
              {!isFeatureAllowed('estilos_productos') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="style-options">
                    {['card', 'minimal', 'detailed'].map((style) => (
                      <div 
                        key={style}
                        className={`style-option ${localConfig.estilos_productos === style ? 'active' : ''}`}
                        onClick={() => handleConfigChange('estilos_productos', style)}
                      >
                        <div className={`product-preview ${style}`}>
                          <div className="product-image"></div>
                          <div className="product-info">
                            {style === 'card' && (
                              <>
                                <div className="product-title"></div>
                                <div className="product-price"></div>
                              </>
                            )}
                            {style === 'detailed' && (
                              <>
                                <div className="product-title"></div>
                                <div className="product-description"></div>
                                <div className="product-price"></div>
                                <div className="product-rating"></div>
                              </>
                            )}
                          </div>
                        </div>
                        <span>{style.charAt(0).toUpperCase() + style.slice(1)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="mostrar-precios"
                      name="!!mostrar_precios"
                      checked={localConfig.mostrar_precios}
                      onChange={(e) => handleConfigChange('mostrar_precios', e.target.checked)}
                    />
                    <label htmlFor="mostrar-precios">Mostrar precios</label>
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="mostrar-valoraciones"
                      name="mostrar_valoraciones"
                      checked={!!localConfig.mostrar_valoraciones}
                      onChange={(e) => handleConfigChange('mostrar_valoraciones', e.target.checked)}
                    />
                    <label htmlFor="mostrar-valoraciones">Mostrar valoraciones</label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="efecto-hover">Efecto hover</label>
                    <select
                      id="efecto-hover"
                      name="efecto_hover_productos"
                      value={localConfig.efecto_hover_productos}
                      onChange={(e) => handleConfigChange('efecto_hover_productos', e.target.value)}
                    >
                      <option value="sombra">Sombra</option>
                      <option value="escala">Escala</option>
                      <option value="borde">Borde</option>
                      <option value="ninguno">Ninguno</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'branding' && (
          <>
            <div className="config-section">
              <h3>Logo Personalizado</h3>
              
              {!isFeatureAllowed('logo_personalizado') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <div className="file-upload">
                  {logoPreview && (
                    <div className="image-preview">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/placeholder-logo.png';
                      }}
                    />
                  </div>
                  )}
                  <input
                    type="file"
                    id="logo-upload"
                    name="logo_personalizado"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'logo')}
                  />
                  <label htmlFor="logo-upload" className="btn-upload">
                    {uploading === 'logo' ? 'Subiendo...' : (logoPreview ? 'Cambiar Logo' : 'Subir Logo')}
                  </label>
                  <p>Recomendado: 200x200px, formato PNG o JPG</p>
                </div>
              )}
            </div>

            <div className="config-section">
              <h3>Banner Personalizado</h3>
              
              {!isFeatureAllowed('banner_personalizado') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="file-upload">
                    {bannerPreview && (
                      <div className="image-preview">
                        <img src={bannerPreview} alt="Banner preview" />
                      </div>
                    )}
                    <input
                      type="file"
                      id="banner-upload"
                      name="banner_personalizado"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'banner')}
                    />
                    <label htmlFor="banner-upload" className="btn-upload">
                      {uploading === 'banner' ? 'Subiendo...' : (bannerPreview ? 'Cambiar Banner' : 'Subir Banner')}
                    </label>
                    <p>Recomendado: 1200x400px, formato JPG o PNG</p>
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="mostrar-banner"
                      name="mostrar_banner"
                      checked={!!localConfig.mostrar_banner}
                      onChange={(e) => handleConfigChange('mostrar_banner', e.target.checked)}
                    />
                    <label htmlFor="mostrar-banner">Mostrar banner en el portal</label>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'integraciones' && (
          <>
            <div className="config-section">
              <h3>WhatsApp</h3>
              
              {!isFeatureAllowed('mostrar_boton_whatsapp') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="mostrar-whatsapp"
                      name="mostrar_boton_whatsapp"
                      checked={localConfig.mostrar_boton_whatsapp}
                      onChange={(e) => handleConfigChange('mostrar_boton_whatsapp', e.target.checked)}
                    />
                    <label htmlFor="mostrar-whatsapp">Mostrar botón de WhatsApp</label>
                  </div>

                  {localConfig.mostrar_boton_whatsapp && (
                    <div className="form-group">
                      <label htmlFor="whatsapp-numero">Número de WhatsApp</label>
                      <input
                        type="number"
                        id="whatsapp-numero"
                        name="whatsapp_numero"
                        value={localConfig.whatsapp_numero || ''}
                        onChange={(e) => handleConfigChange('whatsapp_numero', parseInt(e.target.value))}
                        placeholder="Ej: 549123456789"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="config-section">
              <h3>Instagram</h3>
              
              {!isFeatureAllowed('mostrar_instragram_feed') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="mostrar-instagram"
                      name="mostrar_instragram_feed"
                      checked={localConfig.mostrar_instragram_feed}
                      onChange={(e) => handleConfigChange('mostrar_instragram_feed', e.target.checked)}
                    />
                    <label htmlFor="mostrar-instagram">Mostrar feed de Instagram</label>
                  </div>

                  {localConfig.mostrar_instragram_feed && (
                    <div className="form-group">
                      <label htmlFor="instagram-link">Enlace de Instagram</label>
                      <input
                        type="text"
                        id="instagram-link"
                        name="instagram_link"
                        value={localConfig.instagram_link || ''}
                        onChange={(e) => handleConfigChange('instagram_link', e.target.value)}
                        placeholder="Ej: https://instagram.com/tuempresa"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'avanzado' && (
          <>
            <div className="config-section">
              <h3>Filtros Avanzados</h3>
              
              {!isFeatureAllowed('opciones_filtrados') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <>
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="filtro-precio"
                      name="precio"
                      checked={localConfig.opciones_filtrados?.precio || false}
                      onChange={(e) => handleConfigChange('opciones_filtrados', {
                        ...localConfig.opciones_filtrados,
                        [e.target.name.replace('opciones_filtrados_', '')]: e.target.checked
                      })}
                    />
                    <label htmlFor="filtro-precio">Habilitar filtro por precio</label>
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="filtro-categorias"
                      name="categorias"
                      checked={localConfig.opciones_filtrados?.categorias || false}
                      onChange={(e) => handleConfigChange('opciones_filtrados', {
                        ...localConfig.opciones_filtrados,
                        categorias: e.target.checked
                      })}
                    />
                    <label htmlFor="filtro-categorias">Habilitar filtro por categorías</label>
                  </div>

                  <div className="config-section">
                    <h3>Métodos de Pago</h3>
                    
                    {![4, 5].includes(plan?.codigo_plan) ? (
                      <FeatureLocked message="Actualiza al Plan Estándar Plus o Premium para configurar métodos de pago" />
                    ) : (
                      <>
                        <div className="form-group checkbox">
                          <input
                            type="checkbox"
                            id="pago-tarjeta"
                            name="tarjeta"
                            checked={localConfig.opciones_avanzadas?.checkout?.metodos_pago?.includes('tarjeta') || false}
                            onChange={(e) => {
                              const metodos = localConfig.opciones_avanzadas?.checkout?.metodos_pago || [];
                              const newMetodos = e.target.checked
                                ? [...metodos, 'tarjeta']
                                : metodos.filter(m => m !== 'tarjeta');
                              
                              handleConfigChange('opciones_avanzadas', {
                                ...localConfig.opciones_avanzadas,
                                checkout: {
                                  ...localConfig.opciones_avanzadas?.checkout,
                                  metodos_pago: newMetodos
                                }
                              });
                            }}
                          />
                          <label htmlFor="pago-tarjeta">Aceptar pagos con tarjeta</label>
                        </div>

                        <div className="form-group checkbox">
                          <input
                            type="checkbox"
                            id="pago-transferencia"
                            name="transferencia"
                            checked={localConfig.opciones_avanzadas?.checkout?.metodos_pago?.includes('transferencia') || false}
                            onChange={(e) => {
                              const metodos = localConfig.opciones_avanzadas?.checkout?.metodos_pago || [];
                              const newMetodos = e.target.checked
                                ? [...metodos, 'transferencia']
                                : metodos.filter(m => m !== 'transferencia');
                              
                              handleConfigChange('opciones_avanzadas', {
                                ...localConfig.opciones_avanzadas,
                                checkout: {
                                  ...localConfig.opciones_avanzadas?.checkout,
                                  metodos_pago: newMetodos
                                }
                              });
                            }}
                          />
                          <label htmlFor="pago-transferencia">Aceptar transferencias bancarias</label>
                        </div>

                        {plan?.codigo_plan === 5 && (
                          <div className="form-group checkbox">
                            <input
                              type="checkbox"
                              id="pago-efectivo"
                              name="efectivo"
                              checked={localConfig.opciones_avanzadas?.checkout?.metodos_pago?.includes('efectivo') || false}
                              onChange={(e) => {
                                const metodos = localConfig.opciones_avanzadas?.checkout?.metodos_pago || [];
                                const newMetodos = e.target.checked
                                  ? [...metodos, 'efectivo']
                                  : metodos.filter(m => m !== 'efectivo');
                                
                                handleConfigChange('opciones_avanzadas', {
                                  ...localConfig.opciones_avanzadas,
                                  checkout: {
                                    ...localConfig.opciones_avanzadas?.checkout,
                                    metodos_pago: newMetodos
                                  }
                                });
                              }}
                            />
                            <label htmlFor="pago-efectivo">Aceptar pagos en efectivo</label>
                          </div>
                        )}

                        {plan?.codigo_plan === 5 && (
                          <div className="form-group">
                            <label htmlFor="politica-devoluciones">Política de devoluciones</label>
                            <input
                              type="text"
                              id="politica-devoluciones"
                              name="politica_devoluciones"
                              value={localConfig.opciones_avanzadas?.checkout?.politica_devoluciones || ''}
                              onChange={(e) => handleConfigChange('opciones_avanzadas', {
                                ...localConfig.opciones_avanzadas,
                                checkout: {
                                  ...localConfig.opciones_avanzadas?.checkout,
                                  politica_devoluciones: e.target.value
                                }
                              })}
                              placeholder="Ej: 30 días para devoluciones"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="config-section">
              <h3>Scripts Personalizados</h3>
              
              {!isFeatureAllowed('scripts_personalizados') ? (
                <FeatureLocked message={PLAN_FEATURES[plan?.codigo_plan]?.lockedMessage} />
              ) : (
                <div className="form-group">
                  <label htmlFor="scripts-personalizados">Código JavaScript personalizado</label>
                  <textarea
                    id="scripts-personalizados"
                    name="scripts_personalizados"
                    value={localConfig.scripts_personalizados || ''}
                    onChange={(e) => handleConfigChange('scripts_personalizados', e.target.value)}
                    placeholder="Pega aquí tu código JavaScript"
                  />
                  <p className="help-text">Nota: Usa con precaución. Código malicioso puede afectar tu portal.</p>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === 'historico' && (
          <HistoricoConfiguracion 
            portalCodigo={portalCodigo} 
            vendedorId={vendedorId}
            updateConfig={updateConfig}
          />
        )}
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {saving ? 'Guardando...' : 
          (!initialLoadComplete ? 'Cargando configuración...' : 'Guardar Configuración')}
        </button>
      </div>
    </div>  
  );
};

export default ConfigPortal;