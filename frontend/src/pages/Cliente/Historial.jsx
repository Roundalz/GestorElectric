import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import './styles/HistorialStyles.css';

const Historial = () => {
  const { user } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null); // Guardar el pedido seleccionado

 
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchPedido = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedido/${user.codigo_cliente}`);
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };
  
  useEffect(() => {
    fetchPedido();
  }, []);

  
  // Abrir el modal y asignar el pedido seleccionado
  const openModal = (pedido) => {
    setSelectedPedido(pedido); // Guardar el pedido seleccionado
    setModalVisible(true); // Hacer visible el modal
  };

  // Cerrar el modal
  const closeModal = () => {
    setModalVisible(false); // Ocultar el modal
    setSelectedPedido(null); // Limpiar el pedido seleccionado
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
              <div>
                <p><strong>Código del pedido:</strong> {selectedPedido.codigo_pedido}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedPedido.fecha_pedido)}</p>
                <p><strong>Total:</strong> ${selectedPedido.total_pedido}</p>
                <p><strong>Cliente:</strong> {selectedPedido.nombre_cliente}</p>
                {/* Agrega más campos según sea necesario */}
              </div>
            )}
            <button className="close-button" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
};
  export default Historial;
  