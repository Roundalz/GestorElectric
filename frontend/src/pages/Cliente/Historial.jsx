// src/pages/cliente/Historial.jsx
import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import './styles/HistorialStyles.css';

const Historial = () => {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detallePedido, setDetallePedido] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedido/${user.codigo_cliente}`);
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const fetchDetallePedido = async (codigoPedido) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedido/detalle/${codigoPedido}`);
      const data = await response.json();
      setDetallePedido(data);
    } catch (error) {
      console.error("Error al obtener detalle del pedido:", error);
    }
  };

  useEffect(() => {
    if (user?.codigo_cliente) {
      fetchPedidos();
    }
  }, [user]);

  const openModal = async (pedido) => {
    setSelectedPedido(pedido);
    await fetchDetallePedido(pedido.codigo_pedido);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPedido(null);
    setDetallePedido([]);
  };

  return (
    <div className="purchase-history-container">
      <h1 className="text-2xl font-semibold mb-8">Historial de Compras</h1>
      <div className="purchase-list">
        {pedidos.map((pedido) => (
          <div key={pedido.codigo_pedido} className="purchase-card">
            <div className="purchase-info">
              <span className="purchase-date">Fecha: {formatDate(pedido.fecha_pedido)}</span>
              <span className="purchase-total">Total: ${pedido.total_pedido}</span>
            </div>
            <button className="details-button" onClick={() => openModal(pedido)}>
              Ver detalles
            </button>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detalles del Pedido</h2>

            {selectedPedido && (
              <>
                <p><strong>Fecha del pedido:</strong> {formatDate(selectedPedido.fecha_pedido)}</p>

                <div style={{ marginTop: '1rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Productos:</h3>
                  {detallePedido.map((producto, index) => (
                    <div key={index} style={{ marginBottom: '0.5rem', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '6px' }}>
                      <p><strong>Producto:</strong> {producto.nombre_producto}</p>
                      <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                      <p><strong>Precio unitario:</strong> ${producto.precio_unitario}</p>
                    </div>
                  ))}
                </div>

                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Total del pedido: ${selectedPedido.total_pedido}</p>

                <button className="close-button" onClick={closeModal}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Historial;
