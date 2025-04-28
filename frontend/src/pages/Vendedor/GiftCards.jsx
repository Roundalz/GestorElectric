import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useVendedor } from '@context/vendedorContext';
import './giftcards.css';

const GiftCards = () => {
  const { vendedorId } = useVendedor();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [formData, setFormData] = useState({
    clave_gift_card: '',
    fecha_expiracion_gift_card: '',
    porcentaje_gift_card: 10,
    estado_gift_card: true
  });
  const [consoleMessages, setConsoleMessages] = useState([]);


useEffect(() => {
  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/gift-cards/${vendedorId}`);
      
      console.log('Datos crudos de la API:', response.data); // Verifica esto
      
      // Elimina la normalización - asume que el backend devuelve los nombres correctos
      setGiftCards(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      addConsoleMessage('error', `Error al cargar gift cards: ${err.message}`);
    }
  };
  fetchGiftCards();
}, [vendedorId, baseURL]);

  const addConsoleMessage = (type, message) => {
    const newMessage = {
      id: Date.now(),
      type,
      message
    };
    setConsoleMessages(prev => [...prev, newMessage]);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      setConsoleMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openModal = (card = null) => {
    if (card) {
      console.log('Datos completos de la card:', card); // Debug detallado
      setCurrentCard(card);
      setFormData({
        clave_gift_card: card.clave_gift_card || card.codigo,
        fecha_expiracion_gift_card: (card.fecha_expiracion_gift_card || card.fecha_expiracion).split('T')[0],
        porcentaje_gift_card: card.porcentaje_gift_card || card.descuento,
        estado_gift_card: card.estado_gift_card || card.activa
      });
    } else {
      setCurrentCard(null);
      setFormData({
        clave_gift_card: '',
        fecha_expiracion_gift_card: '',
        porcentaje_gift_card: 10,
        estado_gift_card: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      clave_gift_card: result
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentCard) {
        if (!currentCard.codigo_gift_Card) {
          throw new Error('ID no encontrado en currentCard');
        }
        
        const updateData = {
          clave_gift_card: formData.clave_gift_card,
          fecha_expiracion_gift_card: formData.fecha_expiracion_gift_card,
          porcentaje_gift_card: Number(formData.porcentaje_gift_card),
          estado_gift_card: Boolean(formData.estado_gift_card),
          vendedorId
        };
  
        console.log('Enviando datos de actualización:', {
          id: currentCard.codigo_gift_Card,
          data: updateData
        });
  
        await axios.put(`${baseURL}/api/gift-cards/${currentCard.codigo_gift_Card}`, updateData);
        
        addConsoleMessage('success', 'Gift card actualizada exitosamente');
        
        // Refrescar lista
        const response = await axios.get(`${baseURL}/api/gift-cards/${vendedorId}`);
        setGiftCards(response.data);
        closeModal();
      } else {
        // Crear nueva gift card
        await axios.post(`${baseURL}/api/gift-cards`, {
          ...formData,
          vendedorId
        });
        addConsoleMessage('success', 'Gift card creada exitosamente');
      }
      
      // Refrescar lista
      const response = await axios.get(`${baseURL}/api/gift-cards/${vendedorId}`);
      setGiftCards(response.data);
      closeModal();
    } catch (err) {
      console.error('Error completo en handleSubmit:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.details || 
                      err.message || 
                      'Error desconocido';
      addConsoleMessage('error', `Error: ${errorMsg}`);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta gift card?')) return;
    
    try {
      await axios.delete(`${baseURL}/api/gift-cards/${id}`);
      addConsoleMessage('success', 'Gift card eliminada exitosamente');
      
      // Refresh list
      const response = await axios.get(`${baseURL}/api/gift-cards/${vendedorId}`);
      setGiftCards(response.data);
    } catch (err) {
      addConsoleMessage('error', `Error al eliminar gift card: ${err.response?.data?.error || err.message}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) return <div className="loading">Cargando gift cards...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="gift-cards-container" >
      <div className="gift-cards-header">
        <h2>Gift Cards</h2>
        <button 
          className="btn-add"
          onClick={() => openModal()}
        >
          + Nueva Gift Card
        </button>
      </div>

      <div className="gift-cards-grid">
        {giftCards.length === 0 ? (
          <div className="no-cards">
            <p>No hay gift cards registradas</p>
          </div>
        ) : (
          giftCards.map(card => (
            <div key={card.codigo_gift_Card} className="gift-card">
              <div className="card-header">
                <span className={`status ${card.estado_gift_card ? 'active' : 'inactive'}`}>
                  {card.estado_gift_card ? 'Activa' : 'Inactiva'}
                </span>
                <span className="discount">{card.porcentaje_gift_card}%</span>
              </div>
              <div className="card-body">
                <div className="card-code">{card.clave_gift_card}</div>
                <div className="card-expiry">
                  <span>Vence:</span> {formatDate(card.fecha_expiracion_gift_card)}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  className="btn-edit"
                  onClick={() => openModal(card)}
                >
                  Editar
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(card.codigo_gift_Card)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <h3>{currentCard ? 'Editar Gift Card' : 'Crear Gift Card'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="clave_gift_card">Código</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    id="clave_gift_card"
                    name="clave_gift_card"
                    value={formData.clave_gift_card}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese el código o genere uno"
                  />
                  <button 
                    type="button" 
                    className="btn-generate"
                    onClick={generateRandomKey}
                  >
                    Generar
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fecha_expiracion_gift_card">Fecha de expiración</label>
                <input
                  type="date"
                  id="fecha_expiracion_gift_card"
                  name="fecha_expiracion_gift_card"
                  value={formData.fecha_expiracion_gift_card}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="porcentaje_gift_card">Porcentaje de descuento</label>
                <input
                  type="number"
                  id="porcentaje_gift_card"
                  name="porcentaje_gift_card"
                  value={formData.porcentaje_gift_card}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div className="form-group checkbox">
              <input
                type="checkbox"
                id="estado_gift_card"
                name="estado_gift_card"
                checked={formData.estado_gift_card || false}
                onChange={(e) => setFormData({...formData, estado_gift_card: e.target.checked})}
              />
                <label htmlFor="estado_gift_card">Activa</label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {currentCard ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Console messages */}
      <div className="console-messages">
        {consoleMessages.map(msg => (
          <div key={msg.id} className={`console-message ${msg.type}`}>
            <span className="icon">
              {msg.type === 'success' ? '✅' : 
               msg.type === 'error' ? '❌' : 
               msg.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="text">{msg.message}</span>
            <button 
              className="close"
              onClick={() => setConsoleMessages(prev => prev.filter(m => m.id !== msg.id))}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftCards;