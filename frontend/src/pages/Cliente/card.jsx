import React from 'react';
import './CardStyles.css';

const Card = ({ image, title, line1, line2 }) => {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-text">{line1}</p>
        <p className="card-text">{line2}</p>
      </div>
    </div>
  );
};

export default Card;