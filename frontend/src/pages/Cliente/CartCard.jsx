// src/components/CartCard.jsx
import React from 'react';
import './CartStyles.css';

const CartCard = ({ image, title, description, price }) => {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{description}</p>
        <p className="card-text">{price}</p>
      </div>
    </div>
  );
};

export default CartCard;
