import React from 'react';
import { purchaseHistory } from './purchaseHistoryData';
import './PurchaseHistoryStyles.css';

const Historial = () => {
  return (
    <div className="purchase-history-container">
      <h1 className="text-2xl font-semibold mb-8">Historial de Compras</h1>
      <div className="purchase-list">
        {purchaseHistory.map((purchase) => (
          <div key={purchase.id} className="purchase-card">
            <div className="purchase-info">
              <span className="purchase-date">Fecha: {purchase.date}</span>
              <span className="purchase-total">Total: ${purchase.total.toFixed(2)}</span>
            </div>
            <button className="details-button">Ver detalles</button>
          </div>
        ))}
      </div>
    </div>
  );
};
  export default Historial;
  